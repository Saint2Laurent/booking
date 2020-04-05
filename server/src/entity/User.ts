import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { registerEnumType } from 'type-graphql';

export enum Role {
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
  @Column({ default: false })
  isGoogle: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  googleId?: string;

  @Field({nullable: true})
  profileImageUrl?: string;

  @Field(() => Role)
  @Column({ type: 'enum', enum: Role, default: Role.MASTER })
  role: Role;
}
