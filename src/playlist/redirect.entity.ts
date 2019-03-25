import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class Redirect {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  @Index({
    unique: true,
  })
  sourceUrl: string;

  @Column()
  targetUrl: string;
}
