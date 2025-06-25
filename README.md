# HRM App - Human Resource Management System

A comprehensive Human Resource Management application built with React, Express.js, and PostgreSQL.

## Features

- **Employee Management**: Complete CRUD operations for employee records
- **Attendance Tracking**: Daily attendance monitoring with clock in/out functionality
- **Leave Management**: Leave request submission and approval workflow
- **Payroll Processing**: Salary calculations and payment record management
- **Analytics Dashboard**: Real-time HR metrics and reporting
- **Database Integration**: PostgreSQL with Drizzle ORM for data persistence

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Express.js, Node.js, TypeScript
- **Database**: PostgreSQL (Neon serverless)
- **ORM**: Drizzle ORM with Zod validation
- **Build Tool**: Vite
- **State Management**: TanStack Query

## Project Structure

```
/
├── client/          # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utility functions
├── server/          # Express.js backend API
│   ├── db.ts           # Database connection
│   ├── routes.ts       # API route definitions
│   ├── storage.ts      # Data access layer
│   └── index.ts        # Server entry point
├── shared/          # Shared types and schemas
│   └── schema.ts       # Database schema and validation
└── components.json  # Shadcn/ui configuration
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
DATABASE_URL=your_postgresql_connection_string
```

3. Push database schema:
```bash
npm run db:push
```

4. Start development server:
```bash
npm run dev
```

## Development

- **Frontend**: Runs on Vite dev server with hot reloading
- **Backend**: Express server with TypeScript compilation
- **Database**: Automatic schema migration with Drizzle

## Deployment

The application is configured for Replit deployment with:
- Automatic environment setup
- PostgreSQL database integration
- Production build optimization

## API Endpoints

- `GET/POST /api/employees` - Employee management
- `GET/POST /api/attendance` - Attendance tracking
- `GET/POST /api/leave-requests` - Leave management
- `GET/POST /api/payroll` - Payroll processing
- `GET /api/stats` - Dashboard statistics

## Database Schema

The application uses four main entities:
- **Employees**: Personal and employment information
- **Attendance**: Daily attendance records
- **Leave Requests**: Leave applications and approvals
- **Payroll**: Salary calculations and payments

## Contributing

1. Follow TypeScript best practices
2. Use Zod schemas for validation
3. Maintain type safety throughout
4. Update tests for new features

## License

MIT License - feel free to use this code for your projects.