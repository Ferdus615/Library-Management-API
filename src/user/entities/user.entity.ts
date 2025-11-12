import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoles } from 'src/auth/enums/roles.enum';
import { Loan } from 'src/loan/entities/loan.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.USER })
  role: UserRoles;

  @Column({ default: 0.0 })
  totalFines: number;

//   @OneToMany(() => Loan, (loan) => loan.user)
//   loans: Loan[];
}
