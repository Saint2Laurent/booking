import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { registerEnumType } from 'type-graphql';

enum Role {
  MASTER,
  DESK,
  STAFF,
  CUSTOMER
}

registerEnumType(Role, {
  name: 'Role'
});

@ObjectType()
@Entity()
export class User extends BaseEntity {
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
  @Column({ default: true })
  isGoogle: boolean;

  @Field()
  @Column({ nullable: true })
  googleId?: string;

  @Field(() => Role)
  @Column({ type: 'enum', enum: Role, default: Role.MASTER })
  role: Role;
}
