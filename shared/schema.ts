import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  employeeId: text("employee_id").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  address: text("address"),
  department: text("department").notNull(),
  position: text("position").notNull(),
  startDate: text("start_date").notNull(),
  salary: decimal("salary", { precision: 10, scale: 2 }),
  employmentType: text("employment_type").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  employeeId: text("employee_id").notNull(),
  date: text("date").notNull(),
  clockIn: text("clock_in"),
  clockOut: text("clock_out"),
  status: text("status").notNull(), // present, absent, late
  hoursWorked: decimal("hours_worked", { precision: 4, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leaveRequests = pgTable("leave_requests", {
  id: serial("id").primaryKey(),
  employeeId: text("employee_id").notNull(),
  leaveType: text("leave_type").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  reason: text("reason"),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  appliedAt: timestamp("applied_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: text("reviewed_by"),
});

export const payroll = pgTable("payroll", {
  id: serial("id").primaryKey(),
  employeeId: text("employee_id").notNull(),
  payPeriod: text("pay_period").notNull(),
  basicSalary: decimal("basic_salary", { precision: 10, scale: 2 }).notNull(),
  overtime: decimal("overtime", { precision: 10, scale: 2 }).default("0"),
  bonuses: decimal("bonuses", { precision: 10, scale: 2 }).default("0"),
  deductions: decimal("deductions", { precision: 10, scale: 2 }).default("0"),
  grossPay: decimal("gross_pay", { precision: 10, scale: 2 }).notNull(),
  netPay: decimal("net_pay", { precision: 10, scale: 2 }).notNull(),
  processedAt: timestamp("processed_at").defaultNow(),
});

// Insert schemas
export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  createdAt: true,
}).extend({
  salary: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'string') {
      return parseFloat(val) || 0;
    }
    return val;
  }),
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
  createdAt: true,
}).extend({
  hoursWorked: z.union([z.string(), z.number()]).optional().transform((val) => {
    if (val === undefined || val === null) return undefined;
    if (typeof val === 'string') {
      return parseFloat(val) || undefined;
    }
    return val;
  }),
});

export const insertLeaveRequestSchema = createInsertSchema(leaveRequests).omit({
  id: true,
  appliedAt: true,
  reviewedAt: true,
  reviewedBy: true,
});

export const insertPayrollSchema = createInsertSchema(payroll).omit({
  id: true,
  processedAt: true,
}).extend({
  basicSalary: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'string') {
      return parseFloat(val) || 0;
    }
    return val;
  }),
  overtime: z.union([z.string(), z.number()]).optional().transform((val) => {
    if (val === undefined || val === null) return 0;
    if (typeof val === 'string') {
      return parseFloat(val) || 0;
    }
    return val;
  }),
  bonuses: z.union([z.string(), z.number()]).optional().transform((val) => {
    if (val === undefined || val === null) return 0;
    if (typeof val === 'string') {
      return parseFloat(val) || 0;
    }
    return val;
  }),
  deductions: z.union([z.string(), z.number()]).optional().transform((val) => {
    if (val === undefined || val === null) return 0;
    if (typeof val === 'string') {
      return parseFloat(val) || 0;
    }
    return val;
  }),
  grossPay: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'string') {
      return parseFloat(val) || 0;
    }
    return val;
  }),
  netPay: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'string') {
      return parseFloat(val) || 0;
    }
    return val;
  }),
});

// Types
export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;

export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;

export type LeaveRequest = typeof leaveRequests.$inferSelect;
export type InsertLeaveRequest = z.infer<typeof insertLeaveRequestSchema>;

export type Payroll = typeof payroll.$inferSelect;
export type InsertPayroll = z.infer<typeof insertPayrollSchema>;
