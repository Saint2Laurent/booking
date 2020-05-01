import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { User } from './User';

@ObjectType()
@Entity()
export class Branch extends BaseEntity {
  @Field()
  @Column()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(type => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
