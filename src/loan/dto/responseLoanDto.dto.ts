import { Loan } from '../entities/loan.entity';

export class ResponseLoanDto {
  id: string;

  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };

  book: {
    id: string;
    title: string;
    author: string;
    isbn: string;
  };

  issue_date: Date;
  due_date: Date;
  return_date: Date;
  status: string;
  created_at: Date;
  updated_at: Date;

  constructor(loan: Loan) {
    Object.assign(this, loan);

    this.user = {
      id: loan.user.id,
      first_name: loan.user.first_name,
      last_name: loan.user.last_name,
      email: loan.user.email,
      phone: loan.user.phone,
    };

    this.book = {
      id: loan.book.id,
      title: loan.book.title,
      author: loan.book.author,
      isbn: loan.book.author,
    };
  }
}
