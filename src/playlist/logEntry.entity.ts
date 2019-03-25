import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export const LOG_ENTRY_STATUS_NOT_FOUND = 'Not Found';
export const LOG_ENTRY_STATUS_OK = 'OK';

type allowedStatus = 'Not Found' | 'OK';

@Entity()
export class LogEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  date: Date;

  @Column()
  triedUrl: string;

  @Column()
  resultUrl: string;

  @Column()
  referrer: string;

  @Column({
    type: 'varchar',
    name: 'state',
  })
  status: allowedStatus;
}
