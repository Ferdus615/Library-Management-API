# Library Management System (LMS) - Complete Documentation

**Version**: 1.0.0  
**Last Updated**: March 3, 2026  
**Project Status**: Active Development

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Setup & Installation](#setup--installation)
6. [Frontend Documentation](#frontend-documentation)
7. [Backend Documentation](#backend-documentation)
8. [API Endpoints](#api-endpoints)
9. [Database Schema](#database-schema)
10. [Development Guide](#development-guide)
11. [Deployment Guide](#deployment-guide)
12. [Contributing Guidelines](#contributing-guidelines)

---

## Project Overview

The Library Management System (LMS) is a comprehensive full-stack application designed to streamline library operations. It provides tools for managing books, member accounts, loans, reservations, and fines with a role-based access control system.

### Key Features

- **User Management**: Manage members, librarians, and administrators with role-based permissions
- **Book Catalog**: Complete book management with search, filtering, and categorization
- **Loan Management**: Track book borrowings, returns, and due dates
- **Reservations**: Waitlist system for currently unavailable books
- **Fine System**: Automated and manual fine management for overdue books
- **Dashboard Analytics**: Real-time statistics for admins and members
- **Notifications**: System-wide notifications and updates
- **Cloud Storage**: Integration with Supabase for storing book images and documents
- **Authentication**: JWT-based secure authentication with Passport.js

### Supported User Roles

- **Member**: Regular library users who can borrow books, reserve, and view their history
- **Librarian**: Staff members who manage loans, reservations, and member requests
- **Admin**: Full system access with user management and configuration capabilities

---

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Applications                       │
│  (Next.js Frontend - Web Browser/Responsive Web App)        │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTP/HTTPS Requests (RESTful API)
                 │
┌────────────────▼────────────────────────────────────────────┐
│                Reverse Proxy / Load Balancer                │
│                   (Optional for Production)                  │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│                  NestJS API Server                           │
│  (Authentication, Business Logic, Data Processing)          │
│  ┌──────────────────────────────────────────────────┐        │
│  │  Modules:                                        │        │
│  │  - Auth Module (JWT, Passport)                  │        │
│  │  - User Module (CRUD, Profile Management)       │        │
│  │  - Book Module (Catalog Management)             │        │
│  │  - Loan Module (Borrowing/Returning)            │        │
│  │  - Reservation Module (Waitlist)                │        │
│  │  - Fine Module (Penalty Management)             │        │
│  │  - Dashboard Module (Analytics)                 │        │
│  │  - Notification Module (Updates)                │        │
│  └──────────────────────────────────────────────────┘        │
└────────────────┬────────────────────────────────────────────┘
                 │
    ┌────────────┴────────────┬──────────────────┐
    │                         │                  │
┌───▼────────┐    ┌───────────▼──┐    ┌──────────▼────┐
│ PostgreSQL │    │  Supabase    │    │  Firebase     │
│ Database   │    │  Storage     │    │  (Optional)   │
│ (Neon)     │    │  (Images)    │    │  Notifications│
└────────────┘    └──────────────┘    └───────────────┘
```

### Frontend Architecture

```
Next.js Frontend
├── Authentication Pages
│   ├── Login
│   ├── Register
│   └── Forgot Password
├── Admin Dashboard
│   ├── Dashboard Overview
│   ├── Member Management
│   ├── Book Management
│   ├── Category Management
│   ├── Loan Management
│   ├── Reservation Management
│   ├── Fine Management
│   └── Statistics
└── Member Dashboard
    ├── Dashboard Overview
    ├── Browse Books
    ├── My Loans/Borrows
    ├── My Reservations
    ├── Profile
    └── History
```

---

## Tech Stack

### Frontend

- **Framework**: Next.js 16.1.6 (React 19.2.3)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom components + Lucide React icons
- **Theming**: Next Themes for dark/light mode
- **Notifications**: Sonner (toast notifications)
- **Build Tool**: Webpack (via Next.js)
- **Port**: 4000

### Backend

- **Framework**: NestJS 11.0.1
- **Language**: TypeScript
- **Database**: PostgreSQL (hosted on Neon)
- **ORM**: TypeORM 0.3.17
- **Authentication**: Passport.js + JWT
- **Validation**: Class-validator & Class-transformer
- **Storage**: Supabase SDK 2.98.0
- **File Upload**: Multer (Express middleware)
- **API Documentation**: Swagger/OpenAPI 11.2.5
- **Security**: Bcrypt 6.0.0
- **Scheduling**: NestJS Schedule 6.0.1
- **HTTP Client**: Axios 4.0.1
- **Port**: 3000

### Development Tools

- **Linting**: ESLint 9, Prettier
- **Testing**: Jest with coverage
- **Version Control**: Git
- **Containerization**: Docker & Docker Compose

---

## Project Structure

```
LMS-Project/
├── Library_Management_Frontend/          # Next.js Frontend Application
│   ├── app/
│   │   ├── page.tsx                     # Home page
│   │   ├── layout.tsx                   # Root layout
│   │   ├── middleware.ts                # Auth middleware
│   │   ├── globals.css                  # Global styles
│   │   ├── (auth)/                      # Auth routes
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── admin/                       # Admin routes
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── books/
│   │   │   ├── member-management/
│   │   │   ├── category-management/
│   │   │   ├── fines/
│   │   │   ├── borrowed-books/
│   │   │   └── reservations/
│   │   └── dashboard/                   # Member routes
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── books/
│   │       ├── borrows/
│   │       ├── history/
│   │       └── profile/
│   ├── components/
│   │   ├── admin/                       # Admin-specific components
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── OverdueBooks.tsx
│   │   │   ├── OverdueBookRow.tsx
│   │   │   └── PendingRequests.tsx
│   │   ├── books/                       # Book-related components
│   │   │   ├── BookCard.tsx
│   │   │   └── BookTable.tsx
│   │   ├── common/                      # Shared components
│   │   │   ├── EmptyState.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── StatCard.tsx
│   │   ├── dashboard/                   # Dashboard components
│   │   │   └── MemberStats.tsx
│   │   ├── layout/                      # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   └── AdminTopbar.tsx
│   │   └── ui/                          # UI primitives
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── ConfirmModal.tsx
│   │       ├── deleteModal.tsx
│   │       └── ActionButton.tsx
│   ├── services/
│   │   ├── auth.service.ts              # Auth API calls
│   │   ├── admin.service.ts             # Admin API calls
│   │   └── upload.service.ts            # File upload service
│   ├── types/
│   │   ├── auth.ts
│   │   └── admin.ts
│   ├── public/
│   │   └── brand/                       # Brand assets (logo, icons)
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── eslint.config.mjs
│   └── postcss.config.mjs
│
├── lms-api/                             # NestJS Backend Application
│   ├── src/
│   │   ├── main.ts                      # Application entry point
│   │   ├── app.module.ts                # Root module
│   │   ├── app.controller.ts            # Root controller
│   │   ├── app.service.ts               # Root service
│   │   ├── auth/                        # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── decorators/
│   │   │   ├── dto/
│   │   │   ├── guards/
│   │   │   └── *.spec.ts
│   │   ├── user/                        # User management module
│   │   ├── book/                        # Book management module
│   │   │   ├── book.controller.ts
│   │   │   ├── book.service.ts
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   └── *.spec.ts
│   │   ├── category/                    # Category management
│   │   ├── loan/                        # Loan management module
│   │   ├── reservation/                 # Reservation module
│   │   ├── fine/                        # Fine management module
│   │   ├── dashboard/                   # Dashboard/Analytics module
│   │   ├── notification/                # Notification module
│   │   ├── file/                        # File upload module
│   │   ├── common/                      # Shared utilities
│   │   │   ├── decorators/
│   │   │   └── guards/
│   │   └── config/
│   │       └── db.config.ts
│   ├── test/
│   │   ├── app.e2e-spec.ts
│   │   └── jest-e2e.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── README.md
│
└── PROJECT_DOCUMENTATION.md             # This file
```

---

## Setup & Installation

### Prerequisites

- **Node.js**: v18 or higher
- **npm/yarn**: Package manager
- **PostgreSQL**: v12 or higher (or use Neon for cloud hosting)
- **Git**: Version control
- **Docker** (optional): For containerization

### Installation Steps

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd LMS-Project
```

#### 2. Setup Backend (lms-api)

```bash
cd lms-api

# Install dependencies
npm install

# Create .env file and configure
# Copy .env.example to .env and fill in your values
cp .env.example .env
```

**Required Environment Variables**:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/lms_db

# Authentication
JWT_SECRET=your-jwt-secret-key-here
JWT_EXPIRATION=7d

# Supabase (for file storage)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_BUCKET_NAME=lms-storage

# Firebase (optional, for notifications)
FIREBASE_PROJECT_ID=your-firebase-project
FIREBASE_PRIVATE_KEY=your-firebase-key
FIREBASE_CLIENT_EMAIL=your-firebase-email

# Server
PORT=3000
NODE_ENV=development
```

**Start the backend server**:

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod

# With debugging
npm run start:debug
```

#### 3. Setup Frontend (Library_Management_Frontend)

```bash
cd ../Library_Management_Frontend

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Library Management System
EOF
```

**Start the frontend server**:

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start

# Linting
npm run lint
```

#### 4. Database Setup

The database schema is automatically created by TypeORM on first run. However, you can seed initial data:

```bash
# Run migrations (if any)
npm run typeorm migration:run

# Seed database with initial data (create a seed script if needed)
# Connection to: DATABASE_URL
```

---

## Frontend Documentation

### Structure Overview

The frontend is a Next.js 16 application built with TypeScript and Tailwind CSS, featuring role-based UI components.

### Key Pages and Routes

#### Authentication Routes (`/app/(auth)`)

- **Login** (`/login`): User authentication page
- **Register** (`/register`): New user registration
- **Forgot Password** (`/forgot-password`): Password recovery

#### Admin Routes (`/app/admin`)

- **Dashboard** (`/admin`): Admin overview with statistics
- **Member Management** (`/admin/member-management`): Manage user accounts
- **Book Management** (`/admin/books`): Add, edit, delete books
- **Category Management** (`/admin/category-management`): Manage book categories
- **Loan Management** (`/admin/borrowed-books`): Track all active loans
- **Reservation Management** (`/admin/reservations`): View and manage reservations
- **Fine Management** (`/admin/fines`): Track and manage fines

#### Member Routes (`/app/dashboard`)

- **Dashboard** (`/dashboard`): Member overview
- **Books** (`/dashboard/books`): Browse and search books
- **Borrows** (`/dashboard/borrows`): View active loans
- **History** (`/dashboard/history`): View borrowing history
- **Profile** (`/dashboard/profile`): Manage personal information

### Component Architecture

#### Common Components (`components/common/`)

- **EmptyState**: Display when no data is available
- **Loading**: Loading skeleton/spinner
- **StatCard**: Statistics card component

#### Layout Components (`components/layout/`)

- **Sidebar**: Navigation sidebar (responsive)
- **AdminSidebar**: Admin-specific navigation
- **Topbar**: Header with user info and notifications
- **AdminTopbar**: Admin header navigation

#### UI Components (`components/ui/`)

- **Button**: Primary action button
- **Input**: Form input field
- **ConfirmModal**: Confirmation dialog
- **DeleteModal**: Delete confirmation
- **ActionButton**: Action button with icons

#### Feature Components

- **BookCard**: Individual book display card
- **BookTable**: Tabular book listing
- **DashboardStats**: Admin statistics display
- **OverdueBooks**: List of overdue books
- **PendingRequests**: Pending member requests

### Services (`services/`)

#### `auth.service.ts`

Handles authentication API calls:

- `login(credentials)`: User login
- `register(data)`: New user registration
- `logout()`: Clear session
- `refreshToken()`: Refresh JWT token

#### `admin.service.ts`

Admin operations:

- User management (CRUD)
- Book management
- Fine management
- Dashboard statistics

#### `upload.service.ts`

File upload operations:

- Upload book images/documents
- Delete uploaded files
- Get file URLs

### Types (`types/`)

#### `auth.ts`

Authentication-related types:

- `User`
- `LoginCredentials`
- `AuthResponse`
- `UserRole` (enum: ADMIN, LIBRARIAN, MEMBER)

#### `admin.ts`

Admin-related types:

- `AdminStats`
- `BookManagement`
- `MemberInfo`
- `FineInfo`

### Styling

The project uses **Tailwind CSS v4** with custom CSS variables for theming:

```css
/* Custom color variables */
--clr-primary-a0: Primary color --clr-primary-a10: Primary hover state
  --clr-surface-a0: Surface background --clr-light-a0: Light text/foreground;
```

Theme switching via Next Themes allows dark/light mode toggle.

### Middleware (`app/middleware.ts`)

Handles:

- Token validation on protected routes
- Redirect unauthorized users to login
- Role-based route protection

---

## Backend Documentation

### Architecture Pattern

The backend follows **NestJS Architecture** with:

- **Modules**: Feature-based organization
- **Controllers**: Handle HTTP requests
- **Services**: Business logic
- **DTOs**: Data validation and transformation
- **Entities**: Database models
- **Guards**: Authentication and authorization
- **Decorators**: Custom route metadata

### Core Modules

#### Authentication Module (`src/auth/`)

```
auth/
├── auth.controller.ts       # Login, Register endpoints
├── auth.service.ts          # JWT generation, password hashing
├── auth.module.ts           # Module configuration
├── guards/
│   ├── jwt.guard.ts
│   └── roles.guard.ts
├── decorators/
│   ├── current-user.decorator.ts
│   └── roles.decorator.ts
└── dto/
    ├── login.dto.ts
    └── register.dto.ts
```

**Key Endpoints**:

- `POST /auth/login`: Authenticate user
- `POST /auth/register`: Create new account
- `POST /auth/refresh`: Refresh JWT token

#### User Module (`src/user/`)

Manages user profiles and accounts:

- Create/update user profiles
- Get user information
- List all users (admin only)
- Delete user accounts
- Update password

#### Book Module (`src/book/`)

Book catalog management:

- Add new books
- Update book information
- Search and filter books
- Get book details
- Delete books
- Track book availability

**Entities**:

- `Book`: Book records with title, author, ISBN, etc.
- `BookImage`: Associated images

#### Category Module (`src/category/`)

Manage book categories:

- Create categories
- Update categories
- Delete categories
- List all categories

#### Loan Module (`src/loan/`)

Borrowing and returning management:

```
Loan workflow:
1. Member requests to borrow book
2. Librarian/Admin approves (creates loan record)
3. Book status changes to "borrowed"
4. Due date is set (typically 14 days)
5. Member returns book
6. Loan record is closed
7. Book becomes available again
```

**Entities**:

- `Loan`: Borrowing records with dates and status

#### Reservation Module (`src/reservation/`)

Waitlist for unavailable books:

```
Reservation workflow:
1. Member reserves unavailable book
2. Reservation added to waitlist
3. When book is returned, system notifies next member
4. Member can collect book
5. Reservation mark as completed
```

#### Fine Module (`src/fine/`)

Penalty management for overdue books:

- Calculate fines automatically
- Manual fine adjustment
- Fine payment tracking
- Generate fine reports

**Automatic Fine Calculation**:

- Triggered daily via NestJS Scheduler
- Per day: configurable rate (e.g., $1/day)
- Capped maximum fine

#### Dashboard Module (`src/dashboard/`)

Analytics and reporting:

**Admin Dashboard**:

- Total books count
- Total members count
- Active loans count
- Overdue books count
- Outstanding fines
- Recent activities

**Member Dashboard**:

- Active loans
- Due dates
- Reservations pending
- Outstanding fines
- Borrowing history

#### Notification Module (`src/notification/`)

Alert system:

- Loan due date reminders
- Reservation ready notifications
- Fine notifications
- System announcements

#### File Module (`src/file/`)

File upload and management:

- Upload book covers/documents to Supabase
- Validate file types and sizes
- Generate secure URLs
- Delete uploaded files

### Database Models (TypeORM Entities)

```typescript
// User Entity
User {
  id: UUID
  email: string (unique)
  password: string (hashed)
  firstName: string
  lastName: string
  role: UserRole (enum: ADMIN, LIBRARIAN, MEMBER)
  phoneNumber: string
  address: string
  membershipDate: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Book Entity
Book {
  id: UUID
  isbn: string (unique)
  title: string
  author: string
  description: string
  category: Category (relation)
  publishDate: Date
  totalCopies: number
  availableCopies: number
  location: string
  image: string (URL)
  createdAt: Date
  updatedAt: Date
}

// Category Entity
Category {
  id: UUID
  name: string (unique)
  description: string
  books: Book[] (relation)
  createdAt: Date
  updatedAt: Date
}

// Loan Entity
Loan {
  id: UUID
  book: Book (relation)
  member: User (relation)
  issuedDate: Date
  dueDate: Date
  returnedDate: Date | null
  status: LoanStatus (ACTIVE, RETURNED, OVERDUE)
  createdAt: Date
  updatedAt: Date
}

// Reservation Entity
Reservation {
  id: UUID
  book: Book (relation)
  member: User (relation)
  reservationDate: Date
  priority: number (queue position)
  status: ReservationStatus (PENDING, READY, COLLECTED)
  createdAt: Date
  updatedAt: Date
}

// Fine Entity
Fine {
  id: UUID
  member: User (relation)
  loan: Loan (relation)
  amount: decimal
  reason: string
  status: FineStatus (PENDING, PAID)
  createdAt: Date
  updatedAt: Date
  paidDate: Date | null
}
```

### Guard and Decorator Pattern

#### JWT Guard (`src/auth/guards/jwt.guard.ts`)

Validates JWT tokens on protected routes

#### Roles Guard (`src/common/guards/roles.guard.ts`)

Enforces role-based access control

#### Custom Decorators

- `@GetCurrentUser()`: Extract current user from request
- `@Roles(UserRole.ADMIN)`: Check user role before executing handler

### Error Handling

Global error handling with custom exceptions:

- `NotFoundException`
- `BadRequestException`
- `UnauthorizedException`
- `ForbiddenException`
- `InternalServerErrorException`

Validation pipe catches DTO validation errors.

---

## API Endpoints

### Authentication

| Endpoint         | Method | Auth | Description             |
| ---------------- | ------ | ---- | ----------------------- |
| `/auth/login`    | POST   | No   | Login user, returns JWT |
| `/auth/register` | POST   | No   | Register new user       |
| `/auth/refresh`  | POST   | Yes  | Refresh JWT token       |
| `/auth/logout`   | POST   | Yes  | Logout user             |

### Users

| Endpoint      | Method | Auth | Role            | Description          |
| ------------- | ------ | ---- | --------------- | -------------------- |
| `/user`       | GET    | Yes  | Admin/Librarian | List all users       |
| `/user/:id`   | GET    | Yes  | All             | Get user details     |
| `/user/:id`   | PUT    | Yes  | User/Admin      | Update user info     |
| `/user/:id`   | DELETE | Yes  | Admin           | Delete user          |
| `/user/count` | GET    | Yes  | Admin           | Get total user count |

### Books

| Endpoint              | Method | Auth | Role            | Description                        |
| --------------------- | ------ | ---- | --------------- | ---------------------------------- |
| `/book`               | GET    | No   | All             | List books with pagination/filters |
| `/book/:id`           | GET    | No   | All             | Get book details                   |
| `/book`               | POST   | Yes  | Admin           | Create new book                    |
| `/book/:id`           | PUT    | Yes  | Admin/Librarian | Update book info                   |
| `/book/:id`           | DELETE | Yes  | Admin           | Delete book                        |
| `/book/search/:query` | GET    | No   | All             | Search books                       |

### Categories

| Endpoint        | Method | Auth | Role  | Description         |
| --------------- | ------ | ---- | ----- | ------------------- |
| `/category`     | GET    | No   | All   | List all categories |
| `/category`     | POST   | Yes  | Admin | Create category     |
| `/category/:id` | PUT    | Yes  | Admin | Update category     |
| `/category/:id` | DELETE | Yes  | Admin | Delete category     |

### Loans

| Endpoint             | Method | Auth | Role            | Description       |
| -------------------- | ------ | ---- | --------------- | ----------------- |
| `/loan`              | GET    | Yes  | Admin/Librarian | List all loans    |
| `/loan/user/:userId` | GET    | Yes  | All             | Get user's loans  |
| `/loan`              | POST   | Yes  | Admin/Librarian | Create new loan   |
| `/loan/:id/return`   | POST   | Yes  | Admin/Librarian | Return book       |
| `/loan/overdue`      | GET    | Yes  | Admin           | Get overdue loans |

### Reservations

| Endpoint                    | Method | Auth | Role            | Description             |
| --------------------------- | ------ | ---- | --------------- | ----------------------- |
| `/reservation`              | GET    | Yes  | Admin/Librarian | List all reservations   |
| `/reservation/user/:userId` | GET    | Yes  | All             | Get user's reservations |
| `/reservation`              | POST   | Yes  | All             | Create reservation      |
| `/reservation/:id`          | DELETE | Yes  | All             | Cancel reservation      |

### Fines

| Endpoint             | Method | Auth | Role  | Description        |
| -------------------- | ------ | ---- | ----- | ------------------ |
| `/fine`              | GET    | Yes  | Admin | List all fines     |
| `/fine/user/:userId` | GET    | Yes  | All   | Get user's fines   |
| `/fine/:id/pay`      | POST   | Yes  | All   | Mark fine as paid  |
| `/fine`              | POST   | Yes  | Admin | Create manual fine |

### Dashboard

| Endpoint                    | Method | Auth | Role   | Description       |
| --------------------------- | ------ | ---- | ------ | ----------------- |
| `/dashboard/admin`          | GET    | Yes  | Admin  | Admin statistics  |
| `/dashboard/member/:userId` | GET    | Yes  | Member | Member statistics |

### File Upload

| Endpoint       | Method | Auth | Role            | Description |
| -------------- | ------ | ---- | --------------- | ----------- |
| `/file/upload` | POST   | Yes  | Admin/Librarian | Upload file |
| `/file/:id`    | DELETE | Yes  | Admin           | Delete file |

### Notifications

| Endpoint                 | Method | Auth | Role | Description            |
| ------------------------ | ------ | ---- | ---- | ---------------------- |
| `/notification`          | GET    | Yes  | All  | Get user notifications |
| `/notification/:id/read` | PATCH  | Yes  | All  | Mark as read           |
| `/notification/read-all` | PATCH  | Yes  | All  | Mark all as read       |

---

## Database Schema

### ER Diagram

```
┌──────────────┐         ┌──────────────┐         ┌────────────┐
│    User      │         │    Book      │         │ Category   │
├──────────────┤         ├──────────────┤         ├────────────┤
│ id (PK)      │         │ id (PK)      │◄────────│ id (PK)    │
│ email        │         │ isbn         │         │ name       │
│ password     │         │ title        │         │ description│
│ firstName    │         │ author       │         └────────────┘
│ lastName     │         │ category_id  │
│ role         │         │ publishDate  │
│ phoneNumber  │         │ totalCopies  │
│ address      │         │ availableCop.│
│ created_at   │         │ location     │
│ updated_at   │         │ image        │
└──────────────┘         │ created_at   │
      ▲                  │ updated_at   │
      │                  └──────────────┘
      │ (has)              ▲
      │                    │ (borrowed_by)
      ├─────────────────────┐
      │ (made_by)           │
      │                     │ (borrows)
┌─────┴──────┐          ┌────┴──────────┐
│   Loan     │          │ Reservation   │
├────────────┤          ├───────────────┤
│ id (PK)    │          │ id (PK)       │
│ book_id    │          │ book_id       │
│ user_id    │          │ user_id       │
│ issuedDate │          │ reserv_date   │
│ dueDate    │          │ priority      │
│ returnedD. │          │ status        │
│ status     │          │ created_at    │
│ created_at │          │ updated_at    │
│ updated_at │          └───────────────┘
└────────────┘

┌──────────────────┐
│     Fine         │
├──────────────────┤
│ id (PK)          │
│ user_id (FK)     │
│ loan_id (FK)     │ (optional)
│ amount           │
│ reason           │
│ status           │
│ created_at       │
│ updated_at       │
│ paid_date        │
└──────────────────┘

┌──────────────────┐
│  Notification    │
├──────────────────┤
│ id (PK)          │
│ user_id (FK)     │
│ type             │
│ message          │
│ isRead           │
│ created_at       │
│ updated_at       │
└──────────────────┘
```

### Key Relationships

- **User → Book** (Many-to-Many through Loan/Reservation)
- **Book → Category** (Many-to-One)
- **User → Loan** (One-to-Many)
- **Book → Loan** (One-to-Many)
- **User → Reservation** (One-to-Many)
- **Book → Reservation** (One-to-Many)
- **User → Fine** (One-to-Many)
- **Loan → Fine** (One-to-One, optional)
- **User → Notification** (One-to-Many)

---

## Development Guide

### Frontend Development

#### Start Dev Server

```bash
cd Library_Management_Frontend
npm run dev
```

Access at `http://localhost:4000`

#### File Structure Rules

- **Pages/Routes**: `/app/**/*.tsx`
- **Components**: `/components/**/*.tsx`
- **Services**: `/services/**/*.ts`
- **Types**: `/types/**/*.ts`

#### Adding a New Page

1. Create folder in `app/` with desired route
2. Add `page.tsx` file
3. Import components and services
4. Add necessary types in `types/`

Example:

```bash
# Create new admin sub-page
mkdir -p app/admin/test-management
touch app/admin/test-management/page.tsx
```

#### Adding a New Component

1. Create file in `components/` directory
2. Follow naming convention: PascalCase
3. Export as default or named export
4. Use proper TypeScript types

Example:

```tsx
// components/MyComponent.tsx
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export default function MyComponent({ title, onAction }: MyComponentProps) {
  return <div>{title}</div>;
}
```

#### API Integration

Use service files for API calls:

```tsx
// services/my-service.ts
export const fetchData = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/endpoint/${id}`,
  );
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json();
};

// In component
const [data, setData] = useState(null);
useEffect(() => {
  fetchData("123").then(setData);
}, []);
```

### Backend Development

#### Start Dev Server

```bash
cd lms-api
npm run start:dev
```

API at `http://localhost:3000`  
Swagger Docs at `http://localhost:3000/api/docs`

#### Module Structure

Each feature module should have:

```
feature/
├── feature.controller.ts
├── feature.service.ts
├── feature.module.ts
├── dto/
│   ├── create-feature.dto.ts
│   └── update-feature.dto.ts
├── entities/
│   └── feature.entity.ts
└── feature.controller.spec.ts
```

#### Creating a New Module

```bash
# Generate new module
nest g module features/new-feature

# Generate controller
nest g controller features/new-feature

# Generate service
nest g service features/new-feature
```

#### Database Migrations

```bash
# Generate migration
npm run typeorm migration:generate -- src/migrations/AddNewColumn

# Run migrations
npm run typeorm migration:run

# Revert last migration
npm run typeorm migration:revert
```

#### Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:cov

# E2E testing
npm run test:e2e
```

#### Authentication Flow

1. User submits login credentials
2. `auth.service.validateUser()` checks email/password
3. If valid, `generateJwt()` creates token
4. Token sent to client, stored in localStorage/cookie
5. Client includes token in Authorization header
6. `jwt.guard` validates token on protected routes
7. `@GetCurrentUser()` extracts user from token

#### Adding a New Endpoint

1. Create DTO for validation
2. Add method to service (business logic)
3. Add endpoint to controller
4. Add guard if authentication needed
5. Test with Swagger or Postman

Example:

```typescript
// dto/create-item.dto.ts
export class CreateItemDto {
  @IsString()
  name: string;

  @IsOptional()
  description?: string;
}

// service
async create(createItemDto: CreateItemDto) {
  return this.repository.save(createItemDto);
}

// controller
@Post()
@UseGuards(JwtGuard)
create(@Body() createItemDto: CreateItemDto) {
  return this.service.create(createItemDto);
}
```

---

## Deployment Guide

### Frontend Deployment

#### Build for Production

```bash
cd Library_Management_Frontend
npm run build
npm start
```

#### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Deploy to AWS S3 + CloudFront

```bash
# Build static export
npm run build

# Deploy to S3
aws s3 sync .next/static s3://your-bucket/
```

#### Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_NAME=Library Management System
```

### Backend Deployment

#### Docker Deployment

Build image:

```bash
docker build -t lms-api .
```

Run container:

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  -e JWT_SECRET=your-secret \
  lms-api
```

#### Docker Compose

```bash
# Start all services
docker-compose up -d

# Stop services
docker-compose down
```

#### Deploy to Heroku

```bash
# Install Heroku CLI
npm i -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set DATABASE_URL=...
heroku config:set JWT_SECRET=...

# Deploy
git push heroku main
```

#### Deploy to Railway/Render

1. Connect Git repository
2. Set environment variables in dashboard
3. Deploy automatically on push

#### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=your-production-secret
PORT=3000
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

### Database Deployment

#### PostgreSQL on Neon

1. Sign up at [neon.tech](https://neon.tech)
2. Create project and database
3. Get connection string
4. Set as `DATABASE_URL`

#### Backup Strategy

```bash
# Backup PostgreSQL
pg_dump $DATABASE_URL > backup.sql

# Restore from backup
psql $DATABASE_URL < backup.sql
```

### SSL/HTTPS

1. Obtain SSL certificate (Let's Encrypt)
2. Configure on reverse proxy (Nginx/Apache)
3. Update `CORS_ORIGIN` in backend for HTTPS
4. Update frontend API URL to HTTPS

---

## Contributing Guidelines

### Branch Naming Convention

```
feature/feature-name
bugfix/bug-name
hotfix/critical-fix
docs/documentation-updates
test/test-coverage
```

### Commit Message Format

```
[FEATURE/BUGFIX/HOTFIX] Brief description

Optional detailed explanation
- List of changes
- Related ticket #123
```

### Code Style

#### Frontend (TypeScript/React)

- Use functional components with hooks
- Export default for pages, named for components
- Use camelCase for variables/functions
- Use PascalCase for components/classes
- Add JSDoc comments for complex logic

#### Backend (NestJS)

- Follow NestJS conventions
- Use descriptive method/variable names
- Add @ApiOperation() decorators for Swagger
- Write unit tests for services
- Use proper error handling

### PR Process

1. Create feature branch from `develop`
2. Make commits with clear messages
3. Push to repository
4. Create PR with description
5. Request review from team
6. Address feedback
7. Merge to `develop` when approved
8. Merge `develop` to `main` for release

### Development Checklist

- [ ] Code follows style guide
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] No console errors
- [ ] TypeScript strict mode passes
- [ ] ESLint checks pass
- [ ] Tested in all supported browsers
- [ ] No sensitive data in code
- [ ] Performance acceptable

---

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port
lsof -i :3000  # Frontend
lsof -i :4000  # Backend

# Kill process
kill -9 PID
```

#### Database Connection Error

- Verify `DATABASE_URL` is correct
- Check PostgreSQL is running
- Ensure network access allowed
- Check username/password

#### CORS Error

- Verify backend CORS configuration
- Check frontend API URL matches backend
- Ensure credentials are sent correctly

#### JWT Token Expired

- Check JWT_EXPIRATION setting
- Verify token refresh logic
- Check system time sync

#### File Upload Fails

- Verify Supabase credentials
- Check file size limits
- Ensure bucket exists and is accessible
- Check file type restrictions

---

## Additional Resources

### Documentation Links

- [NestJS Documentation](https://docs.nestjs.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeORM Documentation](https://typeorm.io)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Tools and Services

- **Swagger UI**: http://localhost:3000/api/docs
- **Neon Database**: https://neon.tech
- **Supabase Storage**: https://supabase.com
- **Firebase**: https://firebase.google.com

### Team Contacts

- **Backend Lead**: [Contact Info]
- **Frontend Lead**: [Contact Info]
- **DevOps**: [Contact Info]

---

## Changelog

### Version 1.0.0 (March 3, 2026)

- Initial project setup
- Core modules implemented
- Authentication system
- Book management
- Loan management
- Dashboard analytics
- Documentation complete

---

## License

This project is licensed under the UNLICENSED license. All rights reserved.

---

**Last Updated**: March 3, 2026  
**Documentation Version**: 1.0.0
