import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from 'src/book/entities/book.entity';
import { User } from 'src/user/entities/user.entity';
import { LoanStatus } from '../enums/loanStatus.enum';

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToOne(() => Book, { eager: true })
  book: Book;

  @Column({ type: 'date' })
  issue_date: Date;

  @Column({ type: 'date' })
  due_date: Date;

  @Column({ type: 'date', nullable: true })
  return_date: Date;

  @Column({ type: 'enum', enum: LoanStatus, default: LoanStatus.ISSUED })
  status: LoanStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
