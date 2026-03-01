# Library Management System (LMS) API

A robust, scalable backend service for managing library operations, built with [NestJS](https://nestjs.com/), [TypeORM](https://typeorm.io/), and [PostgreSQL](https://www.postgresql.org/).

## 🚀 Overview

This API provides a comprehensive solution for libraries to manage books, members, loans, reservations, and fines. It features a Role-Based Access Control (RBAC) system and integrates with Supabase for cloud storage.

### Key Modules

- **Authentication**: JWT-based secure login and registration.
- **Users**: Manage members, librarians, and admins.
- **Books**: Complete catalog management with search and filtering.
- **Loans**: Track book borrowings and returns.
- **Reservations**: Waitlist system for unavailable books.
- **Fines**: Automated and manual fine management.
- **Dashboard**: Analytics and overview for both admins and members.
- **Notifications**: System-wide update tracking.

---

## 🛠️ Tech Stack

- **Framework**: NestJS (v10+)
- **Language**: TypeScript
- **Database**: PostgreSQL (hosted on Neon)
- **ORM**: TypeORM
- **Authentication**: Passport.js + JWT
- **Storage**: Supabase (for book images/files)
- **Documentation**: Swagger/OpenAPI
- **Validation**: Class-validator & Class-transformer

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A PostgreSQL database instance

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Ferdus615/Library-Management-API.git
   cd lms-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the following:
   ```env
   PORT=3000
   DATABASE_URL=your_postgresql_url
   JWT_SECRET=your_jwt_secret
   SUPABASE_BUCKET_URL=your_supabase_storage_url
   ```

### Running the App

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

---

## 📖 API Documentation

The API comes with built-in Swagger documentation. Once the server is running, you can access it at:
`http://localhost:3000/api/docs`

### Major Endpoints Summary

| Module          | Method | Endpoint             | Access          | Description                           |
| :-------------- | :----- | :------------------- | :-------------- | :------------------------------------ |
| **Auth**        | POST   | `/auth/login`        | Public          | Authenticate and get JWT.             |
| **User**        | POST   | `/user`              | Public          | Register a new member.                |
|                 | GET    | `/user`              | Admin/Librarian | List all users.                       |
|                 | GET    | `/user/:id`          | Member/Staff    | Get detailed user info.               |
| **Book**        | GET    | `/book`              | Public          | List books with search/filters.       |
|                 | POST   | `/book`              | Admin           | Create a new book record.             |
| **Loan**        | POST   | `/loan`              | Admin/Librarian | Issue a new book loan.                |
|                 | GET    | `/loan`              | Admin/Librarian | List all loan history.                |
| **Reservation** | POST   | `/reservation`       | All             | Reserve a currently unavailable book. |
| **Fine**        | GET    | `/fine/user/:userId` | All             | View fine history for a user.         |
|                 | POST   | `/fine/pay/:id`      | All             | Mark a fine as paid.                  |
| **Dashboard**   | GET    | `/dashboard/admin`   | Admin/Librarian | Get statistics overview.              |

---

## 🔐 Roles & Permissions

- **ADMIN**: Full system access (Books, Users, Loans, etc.)
- **LIBRARIAN**: Manage books, loans, and reservations.
- **MEMBER**: Search books, view personal history, and make reservations.

---

## 📁 Project Structure

```text
src/
├── auth/           # Authentication logic & JWT strategies
├── book/           # Book management & search
├── user/           # User profiles & role management
├── loan/           # Borrowing & returning system
├── fine/           # Fine calculation & payment tracking
├── reservation/    # Book waitlisting
├── dashboard/      # Admin & Member analytics
├── common/         # Global guards, filters, and decorators
├── config/         # Environment & ORM settings
└── main.ts         # Application entry point
```

---

## 📜 License

This project is [MIT licensed](LICENSE).
