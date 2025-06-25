import { 
  type Employee, 
  type InsertEmployee, 
  type Attendance, 
  type InsertAttendance,
  type LeaveRequest,
  type InsertLeaveRequest,
  type Payroll,
  type InsertPayroll,
  employees,
  attendance,
  leaveRequests,
  payroll
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Employee methods
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee | undefined>;
  getEmployeeByEmployeeId(employeeId: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, employee: Partial<InsertEmployee>): Promise<Employee | undefined>;
  deleteEmployee(id: number): Promise<boolean>;

  // Attendance methods
  getAttendance(): Promise<Attendance[]>;
  getAttendanceByEmployee(employeeId: string): Promise<Attendance[]>;
  getAttendanceByDate(date: string): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: number, attendance: Partial<InsertAttendance>): Promise<Attendance | undefined>;

  // Leave request methods
  getLeaveRequests(): Promise<LeaveRequest[]>;
  getLeaveRequestsByEmployee(employeeId: string): Promise<LeaveRequest[]>;
  createLeaveRequest(leaveRequest: InsertLeaveRequest): Promise<LeaveRequest>;
  updateLeaveRequest(id: number, leaveRequest: Partial<InsertLeaveRequest>): Promise<LeaveRequest | undefined>;

  // Payroll methods
  getPayroll(): Promise<Payroll[]>;
  getPayrollByEmployee(employeeId: string): Promise<Payroll[]>;
  createPayroll(payroll: InsertPayroll): Promise<Payroll>;
  updatePayroll(id: number, payroll: Partial<InsertPayroll>): Promise<Payroll | undefined>;
}

export class MemStorage implements IStorage {
  private employees: Map<number, Employee>;
  private attendance: Map<number, Attendance>;
  private leaveRequests: Map<number, LeaveRequest>;
  private payroll: Map<number, Payroll>;
  private currentEmployeeId: number;
  private currentAttendanceId: number;
  private currentLeaveRequestId: number;
  private currentPayrollId: number;

  constructor() {
    this.employees = new Map();
    this.attendance = new Map();
    this.leaveRequests = new Map();
    this.payroll = new Map();
    this.currentEmployeeId = 1;
    this.currentAttendanceId = 1;
    this.currentLeaveRequestId = 1;
    this.currentPayrollId = 1;
  }

  // Employee methods
  async getEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values());
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async getEmployeeByEmployeeId(employeeId: string): Promise<Employee | undefined> {
    return Array.from(this.employees.values()).find(emp => emp.employeeId === employeeId);
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const id = this.currentEmployeeId++;
    const employee: Employee = {
      ...insertEmployee,
      id,
      salary: insertEmployee.salary?.toString() || null,
      address: insertEmployee.address || null,
      phone: insertEmployee.phone || null,
      status: insertEmployee.status || "active",
      createdAt: new Date(),
    };
    this.employees.set(id, employee);
    return employee;
  }

  async updateEmployee(id: number, updateData: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const employee = this.employees.get(id);
    if (!employee) return undefined;

    const updatedEmployee = { 
      ...employee, 
      ...updateData,
      salary: updateData.salary?.toString() || employee.salary,
      address: updateData.address || employee.address,
      phone: updateData.phone || employee.phone,
    };
    this.employees.set(id, updatedEmployee);
    return updatedEmployee;
  }

  async deleteEmployee(id: number): Promise<boolean> {
    return this.employees.delete(id);
  }

  // Attendance methods
  async getAttendance(): Promise<Attendance[]> {
    return Array.from(this.attendance.values());
  }

  async getAttendanceByEmployee(employeeId: string): Promise<Attendance[]> {
    return Array.from(this.attendance.values()).filter(att => att.employeeId === employeeId);
  }

  async getAttendanceByDate(date: string): Promise<Attendance[]> {
    return Array.from(this.attendance.values()).filter(att => att.date === date);
  }

  async createAttendance(insertAttendance: InsertAttendance): Promise<Attendance> {
    const id = this.currentAttendanceId++;
    const attendance: Attendance = {
      ...insertAttendance,
      id,
      clockIn: insertAttendance.clockIn || null,
      clockOut: insertAttendance.clockOut || null,
      hoursWorked: insertAttendance.hoursWorked?.toString() || null,
      createdAt: new Date(),
    };
    this.attendance.set(id, attendance);
    return attendance;
  }

  async updateAttendance(id: number, updateData: Partial<InsertAttendance>): Promise<Attendance | undefined> {
    const attendance = this.attendance.get(id);
    if (!attendance) return undefined;

    const updatedAttendance = { 
      ...attendance, 
      ...updateData,
      clockIn: updateData.clockIn || attendance.clockIn,
      clockOut: updateData.clockOut || attendance.clockOut,
      hoursWorked: updateData.hoursWorked?.toString() || attendance.hoursWorked,
    };
    this.attendance.set(id, updatedAttendance);
    return updatedAttendance;
  }

  // Leave request methods
  async getLeaveRequests(): Promise<LeaveRequest[]> {
    return Array.from(this.leaveRequests.values());
  }

  async getLeaveRequestsByEmployee(employeeId: string): Promise<LeaveRequest[]> {
    return Array.from(this.leaveRequests.values()).filter(req => req.employeeId === employeeId);
  }

  async createLeaveRequest(insertLeaveRequest: InsertLeaveRequest): Promise<LeaveRequest> {
    const id = this.currentLeaveRequestId++;
    const leaveRequest: LeaveRequest = {
      ...insertLeaveRequest,
      id,
      status: insertLeaveRequest.status || "pending",
      reason: insertLeaveRequest.reason || null,
      appliedAt: new Date(),
      reviewedAt: null,
      reviewedBy: null,
    };
    this.leaveRequests.set(id, leaveRequest);
    return leaveRequest;
  }

  async updateLeaveRequest(id: number, updateData: Partial<InsertLeaveRequest>): Promise<LeaveRequest | undefined> {
    const leaveRequest = this.leaveRequests.get(id);
    if (!leaveRequest) return undefined;

    const updatedLeaveRequest = { ...leaveRequest, ...updateData };
    this.leaveRequests.set(id, updatedLeaveRequest);
    return updatedLeaveRequest;
  }

  // Payroll methods
  async getPayroll(): Promise<Payroll[]> {
    return Array.from(this.payroll.values());
  }

  async getPayrollByEmployee(employeeId: string): Promise<Payroll[]> {
    return Array.from(this.payroll.values()).filter(pay => pay.employeeId === employeeId);
  }

  async createPayroll(insertPayroll: InsertPayroll): Promise<Payroll> {
    const id = this.currentPayrollId++;
    const payroll: Payroll = {
      ...insertPayroll,
      id,
      basicSalary: insertPayroll.basicSalary.toString(),
      overtime: insertPayroll.overtime?.toString() || null,
      bonuses: insertPayroll.bonuses?.toString() || null,
      deductions: insertPayroll.deductions?.toString() || null,
      grossPay: insertPayroll.grossPay.toString(),
      netPay: insertPayroll.netPay.toString(),
      processedAt: new Date(),
    };
    this.payroll.set(id, payroll);
    return payroll;
  }

  async updatePayroll(id: number, updateData: Partial<InsertPayroll>): Promise<Payroll | undefined> {
    const payroll = this.payroll.get(id);
    if (!payroll) return undefined;

    const updatedPayroll = { 
      ...payroll, 
      ...updateData,
      basicSalary: updateData.basicSalary?.toString() || payroll.basicSalary,
      overtime: updateData.overtime?.toString() || payroll.overtime,
      bonuses: updateData.bonuses?.toString() || payroll.bonuses,
      deductions: updateData.deductions?.toString() || payroll.deductions,
      grossPay: updateData.grossPay?.toString() || payroll.grossPay,
      netPay: updateData.netPay?.toString() || payroll.netPay,
    };
    this.payroll.set(id, updatedPayroll);
    return updatedPayroll;
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // Employee methods
  async getEmployees(): Promise<Employee[]> {
    return await db.select().from(employees);
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.id, id));
    return employee || undefined;
  }

  async getEmployeeByEmployeeId(employeeId: string): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.employeeId, employeeId));
    return employee || undefined;
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const employeeData = {
      ...insertEmployee,
      salary: insertEmployee.salary?.toString() || null,
      address: insertEmployee.address || null,
      phone: insertEmployee.phone || null,
      status: insertEmployee.status || "active",
    };
    
    const [employee] = await db
      .insert(employees)
      .values(employeeData)
      .returning();
    return employee;
  }

  async updateEmployee(id: number, updateData: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const employeeData = {
      ...updateData,
      salary: updateData.salary?.toString() || undefined,
      address: updateData.address || undefined,
      phone: updateData.phone || undefined,
    };

    const [employee] = await db
      .update(employees)
      .set(employeeData)
      .where(eq(employees.id, id))
      .returning();
    return employee || undefined;
  }

  async deleteEmployee(id: number): Promise<boolean> {
    const result = await db.delete(employees).where(eq(employees.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Attendance methods
  async getAttendance(): Promise<Attendance[]> {
    return await db.select().from(attendance);
  }

  async getAttendanceByEmployee(employeeId: string): Promise<Attendance[]> {
    return await db.select().from(attendance).where(eq(attendance.employeeId, employeeId));
  }

  async getAttendanceByDate(date: string): Promise<Attendance[]> {
    return await db.select().from(attendance).where(eq(attendance.date, date));
  }

  async createAttendance(insertAttendance: InsertAttendance): Promise<Attendance> {
    const attendanceData = {
      ...insertAttendance,
      clockIn: insertAttendance.clockIn || null,
      clockOut: insertAttendance.clockOut || null,
      hoursWorked: insertAttendance.hoursWorked?.toString() || null,
    };

    const [attendanceRecord] = await db
      .insert(attendance)
      .values(attendanceData)
      .returning();
    return attendanceRecord;
  }

  async updateAttendance(id: number, updateData: Partial<InsertAttendance>): Promise<Attendance | undefined> {
    const attendanceData = {
      ...updateData,
      clockIn: updateData.clockIn || undefined,
      clockOut: updateData.clockOut || undefined,
      hoursWorked: updateData.hoursWorked?.toString() || undefined,
    };

    const [attendanceRecord] = await db
      .update(attendance)
      .set(attendanceData)
      .where(eq(attendance.id, id))
      .returning();
    return attendanceRecord || undefined;
  }

  // Leave request methods
  async getLeaveRequests(): Promise<LeaveRequest[]> {
    return await db.select().from(leaveRequests);
  }

  async getLeaveRequestsByEmployee(employeeId: string): Promise<LeaveRequest[]> {
    return await db.select().from(leaveRequests).where(eq(leaveRequests.employeeId, employeeId));
  }

  async createLeaveRequest(insertLeaveRequest: InsertLeaveRequest): Promise<LeaveRequest> {
    const leaveRequestData = {
      ...insertLeaveRequest,
      status: insertLeaveRequest.status || "pending",
      reason: insertLeaveRequest.reason || null,
    };

    const [leaveRequest] = await db
      .insert(leaveRequests)
      .values(leaveRequestData)
      .returning();
    return leaveRequest;
  }

  async updateLeaveRequest(id: number, updateData: Partial<InsertLeaveRequest>): Promise<LeaveRequest | undefined> {
    const [leaveRequest] = await db
      .update(leaveRequests)
      .set(updateData)
      .where(eq(leaveRequests.id, id))
      .returning();
    return leaveRequest || undefined;
  }

  // Payroll methods
  async getPayroll(): Promise<Payroll[]> {
    return await db.select().from(payroll);
  }

  async getPayrollByEmployee(employeeId: string): Promise<Payroll[]> {
    return await db.select().from(payroll).where(eq(payroll.employeeId, employeeId));
  }

  async createPayroll(insertPayroll: InsertPayroll): Promise<Payroll> {
    const payrollData = {
      ...insertPayroll,
      basicSalary: insertPayroll.basicSalary.toString(),
      overtime: insertPayroll.overtime?.toString() || null,
      bonuses: insertPayroll.bonuses?.toString() || null,
      deductions: insertPayroll.deductions?.toString() || null,
      grossPay: insertPayroll.grossPay.toString(),
      netPay: insertPayroll.netPay.toString(),
    };

    const [payrollRecord] = await db
      .insert(payroll)
      .values(payrollData)
      .returning();
    return payrollRecord;
  }

  async updatePayroll(id: number, updateData: Partial<InsertPayroll>): Promise<Payroll | undefined> {
    const payrollData = {
      ...updateData,
      basicSalary: updateData.basicSalary?.toString() || undefined,
      overtime: updateData.overtime?.toString() || undefined,
      bonuses: updateData.bonuses?.toString() || undefined,
      deductions: updateData.deductions?.toString() || undefined,
      grossPay: updateData.grossPay?.toString() || undefined,
      netPay: updateData.netPay?.toString() || undefined,
    };

    const [payrollRecord] = await db
      .update(payroll)
      .set(payrollData)
      .where(eq(payroll.id, id))
      .returning();
    return payrollRecord || undefined;
  }
}

// Use database storage by default now that it's set up
export const storage = new DatabaseStorage();
