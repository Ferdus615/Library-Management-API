import { Category } from 'src/category/entities/category.entity';
import { Loan } from 'src/loan/entities/loan.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
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
  @JoinColumn({ name: 'category_id' })
  category: Category;

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

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
