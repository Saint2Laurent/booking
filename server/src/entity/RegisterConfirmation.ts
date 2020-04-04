import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RegisterConfirmation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mail: string;

  @Column()
  token: string;

  @Column({ default: new Date() })
  expires: Date;
}
