import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  first_name: string;

  @Column({ length: 100 })
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ length: 11, nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ default: 'member' }) //admin | librarian | member
  role: string;

  @Column({ type: 'date', nullable: true })
  membership_expiry: Date;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'date', default: () => 'CURRENT-TIMESTAMP' })
  updated_at: Date;
}
