import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Clock, 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus 
} from "lucide-react";
import TopBar from "@/components/TopBar";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Employee, Attendance } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAttendanceSchema, type InsertAttendance } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });

  const { data: attendance = [], isLoading } = useQuery<Attendance[]>({
    queryKey: ["/api/attendance", { date: selectedDate }],
    queryFn: () => 
      fetch(`/api/attendance?date=${selectedDate}`, { credentials: "include" })
        .then(res => res.json()),
  });

  const form = useForm<InsertAttendance>({
    resolver: zodResolver(insertAttendanceSchema),
    defaultValues: {
      employeeId: "",
      date: selectedDate,
      clockIn: "",
      clockOut: "",
      status: "present",
      hoursWorked: undefined,
    },
  });

  const addAttendanceMutation = useMutation({
    mutationFn: async (data: InsertAttendance) => {
      const response = await apiRequest("POST", "/api/attendance", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/attendance"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success!",
        description: "Attendance record added successfully",
      });
      setIsAddModalOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add attendance record",
        variant: "destructive",
      });
    },
  });

  const markAttendanceMutation = useMutation({
    mutationFn: async ({ employeeId, status }: { employeeId: string; status: string }) => {
      const data = {
        employeeId,
        date: selectedDate,
        status,
        clockIn: status === "present" ? new Date().toLocaleTimeString() : undefined,
        hoursWorked: status === "present" ? 8 : 0,
      };
      const response = await apiRequest("POST", "/api/attendance", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/attendance"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success!",
        description: "Attendance marked successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark attendance",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return (
          <Badge className="bg-success-100 text-success">
            <CheckCircle className="w-3 h-3 mr-1" />
            Present
          </Badge>
        );
      case "absent":
        return (
          <Badge className="bg-error-100 text-error">
            <XCircle className="w-3 h-3 mr-1" />
            Absent
          </Badge>
        );
      case "late":
        return (
          <Badge className="bg-warning-100 text-warning">
            <AlertCircle className="w-3 h-3 mr-1" />
            Late
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.employeeId === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : employeeId;
  };

  const attendanceMap = new Map(attendance.map(att => [att.employeeId, att]));
  const presentCount = attendance.filter(att => att.status === "present").length;
  const absentCount = attendance.filter(att => att.status === "absent").length;
  const lateCount = attendance.filter(att => att.status === "late").length;

  const onSubmit = (data: InsertAttendance) => {
    // Calculate hours worked if clock in and out are provided
    if (data.clockIn && data.clockOut) {
      const clockIn = new Date(`${data.date}T${data.clockIn}`);
      const clockOut = new Date(`${data.date}T${data.clockOut}`);
      const hours = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60);
      data.hoursWorked = Math.max(0, hours);
    }

    addAttendanceMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div>
        <TopBar title="Attendance" subtitle="Track daily attendance" showAddButton={false} />
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-16 bg-slate-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TopBar title="Attendance" subtitle="Track daily attendance" showAddButton={false} />

      {/* Date Selection and Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-48"
            />
          </div>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Attendance
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Attendance Record</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Employee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem key={employee.employeeId} value={employee.employeeId}>
                              {employee.firstName} {employee.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="present">Present</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                          <SelectItem value="late">Late</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clockIn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clock In</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clockOut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clock Out</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={addAttendanceMutation.isPending}>
                    Add Record
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Employees</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{employees.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-primary text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Present</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{presentCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-success text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Absent</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{absentCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="text-error text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Late</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{lateCount}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-warning text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee List with Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Attendance - {new Date(selectedDate).toLocaleDateString()}</CardTitle>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No employees found</h3>
              <p className="text-slate-500">Add employees first to track their attendance.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {employees.map((employee) => {
                const attendanceRecord = attendanceMap.get(employee.employeeId);
                return (
                  <div key={employee.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center">
                        <Users className="text-slate-600 w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-sm text-slate-500">{employee.department} • {employee.position}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {attendanceRecord ? (
                        <div className="flex items-center space-x-4">
                          {getStatusBadge(attendanceRecord.status)}
                          {attendanceRecord.clockIn && (
                            <div className="text-sm text-slate-600">
                              <span className="font-medium">In:</span> {attendanceRecord.clockIn}
                              {attendanceRecord.clockOut && (
                                <span className="ml-2">
                                  <span className="font-medium">Out:</span> {attendanceRecord.clockOut}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-success border-success hover:bg-success hover:text-white"
                            onClick={() => markAttendanceMutation.mutate({ 
                              employeeId: employee.employeeId, 
                              status: "present" 
                            })}
                            disabled={markAttendanceMutation.isPending}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Present
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-error border-error hover:bg-error hover:text-white"
                            onClick={() => markAttendanceMutation.mutate({ 
                              employeeId: employee.employeeId, 
                              status: "absent" 
                            })}
                            disabled={markAttendanceMutation.isPending}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Absent
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-warning border-warning hover:bg-warning hover:text-white"
                            onClick={() => markAttendanceMutation.mutate({ 
                              employeeId: employee.employeeId, 
                              status: "late" 
                            })}
                            disabled={markAttendanceMutation.isPending}
                          >
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Late
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
