# How to Download Your HRM Application Code

## Option 1: Direct File Copy (Recommended)
Use Replit's file explorer to browse and copy files:
1. Navigate through the folders in the file explorer
2. Open each file and copy the content
3. Paste into your local development environment

## Option 2: Git Clone (If Available)
If this is connected to a Git repository:
```bash
git clone <repository-url>
```

## Option 3: Individual File Download
Key files to download in order of importance:

### Core Configuration Files:
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Build configuration
- `tailwind.config.ts` - Styling configuration
- `drizzle.config.ts` - Database configuration
- `components.json` - UI components configuration

### Database Schema:
- `shared/schema.ts` - Database schema and types

### Backend Files:
- `server/index.ts` - Main server entry point
- `server/db.ts` - Database connection
- `server/storage.ts` - Data access layer
- `server/routes.ts` - API routes
- `server/vite.ts` - Development server setup

### Frontend Files:
- `client/index.html` - HTML template
- `client/src/main.tsx` - React entry point
- `client/src/App.tsx` - Main app component
- `client/src/index.css` - Global styles

### Page Components:
- `client/src/pages/Dashboard.tsx`
- `client/src/pages/Employees.tsx`
- `client/src/pages/Attendance.tsx`
- `client/src/pages/LeaveManagement.tsx`
- `client/src/pages/Payroll.tsx`
- `client/src/pages/Reports.tsx`

### Layout Components:
- `client/src/components/Layout.tsx`
- `client/src/components/Sidebar.tsx`
- `client/src/components/TopBar.tsx`
- `client/src/components/EmployeeModal.tsx`

### Utility Files:
- `client/src/lib/queryClient.ts`
- `client/src/lib/utils.ts`
- `client/src/hooks/use-toast.ts`

## Option 4: Archive Download
An archive file has been created: `hrm-app-source.tar`

## Setup Instructions After Download:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file with:
   ```
   DATABASE_URL=your_postgresql_connection_string
   ```

3. **Database Setup:**
   ```bash
   npm run db:push
   ```

4. **Start Development:**
   ```bash
   npm run dev
   ```

## Project Features:
- Complete HR management system
- Employee CRUD operations
- Attendance tracking
- Leave management
- Payroll processing
- PostgreSQL database integration
- Modern React + TypeScript frontend
- Express.js backend with type safety

## Support:
The application is fully functional with PostgreSQL database integration. All data persists between sessions.