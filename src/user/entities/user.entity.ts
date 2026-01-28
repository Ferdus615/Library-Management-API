import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MemberStatus } from '../enum/member.enum';
import { Loan } from 'src/loan/entities/loan.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { UserRole } from 'src/auth/enum/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  first_name: string;

  @Column({ length: 100 })
  last_name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER })
  role: UserRole;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ length: 11, nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'enum', enum: MemberStatus, default: MemberStatus.MEMBER })
  role: string;

  @Column({ type: 'timestamptz', nullable: true })
  membership_expiry: Date;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => Loan, (Loan) => Loan.user)
  loans: Loan[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
