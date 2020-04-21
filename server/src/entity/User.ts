import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { ObjectType, Field, ID, InputType, ArgsType } from 'type-graphql';
import { registerEnumType } from 'type-graphql';
import { Role, User as UserInterface } from '../../../shared/types/entity/User';

registerEnumType(Role, {
  name: 'Role'
});

@ObjectType()
@Entity()
export class User extends BaseEntity implements UserInterface {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  fullName: string;

  @Field()
  @Column()
  mail: string;

  @Column()
  password: string;

  @Field()
  @Column({ default: false })
  isConfirmed: boolean;

  @Field()
  @Column({ default: false })
  isGoogle: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  googleId?: string;

  @Field(() => Role)
  @Column({ type: 'enum', enum: Role, default: Role.MASTER })
  role: Role;

  @Field({ nullable: true })
  @Column({ nullable: true })
  profileImageUrl?: string;
}
