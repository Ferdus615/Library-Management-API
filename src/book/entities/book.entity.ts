import { Category } from 'src/category/entities/category.entity';
import { Loan } from 'src/loan/entities/loan.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 13, unique: true })
  isbn: string;

  @Column({ length: 150 })
  title: string;

  @Column({ length: 100 })
  author: string;

  @Column({ type: 'int' })
  publication_year: number;

  @ManyToOne(() => Category, (category) => category.books, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  category: Category | null;

  @Column({ type: 'int', default: 1 })
  total_copies: number;

  @Column({ type: 'int', default: 0 })
  damaged_copies: number;

  @Column({ type: 'int', default: 1 })
  available_copies: number;

  @OneToMany(() => Loan, (loan) => loan.book)
  loans: Loan[];

  @OneToMany(() => Reservation, (reservation) => reservation.book)
  reservations: Reservation[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
