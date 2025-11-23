import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'int', default: 1 })
  total_copies: number;

  @Column({ type: 'int', default: 0 })
  damaged_copies: number;

  @Column({ type: 'int', default: 1 })
  available_copies: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
