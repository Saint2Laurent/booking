import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@ObjectType()
@Entity()
export class PasswordResetToken extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  @OneToOne(type => User)
  @JoinColumn()
  userId: string;

  @Field()
  @Column()
  token: string;

  @Field()
  @Column()
  expiresAt: Date;
}
