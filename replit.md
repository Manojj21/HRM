# HRM App - Human Resource Management System

## Overview

This is a comprehensive Human Resource Management (HRM) application built as a full-stack web application. The system provides functionality for managing employees, attendance tracking, leave management, payroll processing, and reporting. It features a modern React frontend with a Node.js/Express backend, using PostgreSQL for data storage and Drizzle ORM for database operations.

## System Architecture

The application follows a full-stack architecture with clear separation between frontend and backend:

- **Frontend**: React-based single-page application with TypeScript
- **Backend**: Express.js REST API server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Build System**: Vite for frontend bundling and development
- **UI Framework**: Tailwind CSS with Shadcn/ui components

### Directory Structure
```
/
├── client/          # React frontend application
├── server/          # Express.js backend API
├── shared/          # Shared types and schemas
├── migrations/      # Database migrations (auto-generated)
└── dist/           # Production build output
```

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI primitives with Shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with Zod schema validation
- **Database**: PostgreSQL (Neon serverless)
- **API Design**: RESTful API with proper error handling
- **Development**: Hot reloading with Vite integration

### Database Schema
The application uses four main entities:
1. **Employees**: Core employee information (personal details, position, salary)
2. **Attendance**: Daily attendance tracking (clock in/out, hours worked)
3. **Leave Requests**: Leave applications and approval workflow
4. **Payroll**: Salary calculations and payment records

### Storage Layer
- **Interface**: IStorage interface for data operations
- **Implementation**: MemStorage for development (in-memory storage)
- **Production Ready**: Drizzle ORM with PostgreSQL for production

## Data Flow

1. **User Interaction**: Users interact through React components
2. **API Calls**: TanStack Query manages API requests to Express backend
3. **Validation**: Zod schemas validate data on both client and server
4. **Database Operations**: Drizzle ORM handles PostgreSQL interactions
5. **Response**: Data flows back through the same chain with proper error handling

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling and validation
- **zod**: Schema validation
- **wouter**: Lightweight React router

### UI Dependencies
- **@radix-ui/**: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type safety
- **tsx**: TypeScript execution for Node.js

## Deployment Strategy

### Development
- **Command**: `npm run dev`
- **Port**: 5000 (configurable)
- **Hot Reloading**: Vite provides instant updates
- **Database**: Uses memory storage or development PostgreSQL

### Production Build
- **Frontend Build**: `vite build` - Creates optimized client bundle
- **Backend Build**: `esbuild` - Bundles server code for Node.js
- **Output**: All assets compiled to `dist/` directory
- **Start Command**: `npm run start`

### Replit Configuration
- **Modules**: Node.js 20, Web, PostgreSQL 16
- **Auto-deployment**: Configured for Replit's autoscale deployment
- **Environment**: Development and production configurations

### Database Setup
- **Development**: `npm run db:push` - Pushes schema changes
- **Migrations**: Auto-generated in `/migrations` directory
- **Connection**: Environment variable `DATABASE_URL` required

## Changelog
- June 25, 2025. Initial setup
- June 25, 2025. Fixed salary and data type handling across the application:
  - Updated schema validation to handle both string and number inputs
  - Fixed storage layer to properly convert numeric values to strings for database compatibility
  - Resolved all LSP type errors for proper data flow
  - Fixed Vite configuration issues and CSS import order
  - Corrected navigation structure to prevent DOM nesting warnings
- June 25, 2025. Added PostgreSQL database integration:
  - Created database connection using Drizzle ORM with Neon serverless PostgreSQL
  - Implemented DatabaseStorage class with full CRUD operations
  - Set up automatic schema migration with db:push command
  - Configured environment variables for database connectivity
  - Maintained backward compatibility with in-memory storage for development
- June 25, 2025. Implemented complete Docker containerization:
  - Created multi-stage Dockerfile optimized for production with Alpine Linux
  - Added docker-compose.yml for complete application stack with PostgreSQL
  - Implemented health check endpoint at /api/health for container monitoring
  - Created development Docker setup with hot reloading support
  - Added comprehensive Docker scripts and documentation
  - Configured container security with non-root user and proper permissions

## User Preferences

Preferred communication style: Simple, everyday language.