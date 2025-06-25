import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Download,
  FileText,
  PieChart
} from "lucide-react";
import TopBar from "@/components/TopBar";
import type { Employee, Attendance, LeaveRequest, Payroll } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function Reports() {
  const [reportType, setReportType] = useState("overview");
  const [timePeriod, setTimePeriod] = useState("current-month");

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });

  const { data: attendance = [] } = useQuery<Attendance[]>({
    queryKey: ["/api/attendance"],
  });

  const { data: leaveRequests = [] } = useQuery<LeaveRequest[]>({
    queryKey: ["/api/leave-requests"],
  });

  const { data: payrollRecords = [] } = useQuery<Payroll[]>({
    queryKey: ["/api/payroll"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  // Calculate department distribution
  const departmentStats = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate employment type distribution
  const employmentTypeStats = employees.reduce((acc, emp) => {
    acc[emp.employmentType] = (acc[emp.employmentType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate attendance rates
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthAttendance = attendance.filter(att => att.date.startsWith(currentMonth));
  const attendanceRate = currentMonthAttendance.length > 0 
    ? (currentMonthAttendance.filter(att => att.status === 'present').length / currentMonthAttendance.length) * 100 
    : 0;

  // Calculate leave statistics
  const leaveStats = {
    pending: leaveRequests.filter(req => req.status === 'pending').length,
    approved: leaveRequests.filter(req => req.status === 'approved').length,
    rejected: leaveRequests.filter(req => req.status === 'rejected').length,
  };

  const leaveTypeStats = leaveRequests.reduce((acc, req) => {
    acc[req.leaveType] = (acc[req.leaveType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate payroll statistics
  const currentMonthPayroll = payrollRecords.filter(pay => pay.payPeriod === currentMonth);
  const totalPayroll = currentMonthPayroll.reduce((sum, pay) => sum + Number(pay.netPay), 0);
  const avgSalary = employees.length > 0 
    ? employees.reduce((sum, emp) => sum + Number(emp.salary || 0), 0) / employees.length 
    : 0;

  // Calculate growth metrics (mock data for demonstration)
  const growthMetrics = {
    employeeGrowth: 12, // percentage
    attendanceChange: 2.5, // percentage
    payrollChange: 8.3, // percentage
  };

  const handleExportReport = () => {
    // In a real application, this would generate and download a report
    alert("Report export functionality would be implemented here");
  };

  return (
    <div className="space-y-6">
      <TopBar title="Reports" subtitle="HR analytics and insights" showAddButton={false} />

      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Report Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Report Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Overview</SelectItem>
                    <SelectItem value="attendance">Attendance Report</SelectItem>
                    <SelectItem value="leave">Leave Report</SelectItem>
                    <SelectItem value="payroll">Payroll Report</SelectItem>
                    <SelectItem value="department">Department Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Time Period</label>
                <Select value={timePeriod} onValueChange={setTimePeriod}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current-month">Current Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleExportReport}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Employees</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{employees.length}</p>
                <p className="text-success text-sm mt-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+{growthMetrics.employeeGrowth}% growth</span>
                </p>
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
                <p className="text-slate-600 text-sm font-medium">Attendance Rate</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{attendanceRate.toFixed(1)}%</p>
                <p className="text-success text-sm mt-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+{growthMetrics.attendanceChange}% vs last month</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-success text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Monthly Payroll</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">${totalPayroll.toLocaleString()}</p>
                <p className="text-success text-sm mt-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+{growthMetrics.payrollChange}% vs last month</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-purple-600 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Avg Salary</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">${Math.round(avgSalary).toLocaleString()}</p>
                <p className="text-slate-500 text-sm mt-2">Competitive market rate</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-warning text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Content Based on Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="w-5 h-5" />
              <span>Department Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(departmentStats).length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No department data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(departmentStats).map(([dept, count]) => (
                  <div key={dept} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-primary rounded-sm"></div>
                      <span className="capitalize font-medium">{dept}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-600">{count} employees</span>
                      <span className="text-sm text-slate-500">
                        ({((count / employees.length) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leave Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Leave Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium text-slate-900">Pending Requests</span>
                <span className="text-xl font-bold text-warning">{leaveStats.pending}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-slate-900">Approved Requests</span>
                <span className="text-xl font-bold text-success">{leaveStats.approved}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="font-medium text-slate-900">Rejected Requests</span>
                <span className="text-xl font-bold text-error">{leaveStats.rejected}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employment Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Employment Types</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(employmentTypeStats).length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No employment type data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(employmentTypeStats).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-success rounded-sm"></div>
                      <span className="capitalize font-medium">{type.replace('-', ' ')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-600">{count} employees</span>
                      <span className="text-sm text-slate-500">
                        ({((count / employees.length) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leave Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Leave Types</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(leaveTypeStats).length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No leave data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(leaveTypeStats).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-warning rounded-sm"></div>
                      <span className="capitalize font-medium">{type}</span>
                    </div>
                    <span className="text-slate-600">{count} requests</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-slate-200 rounded-lg">
              <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Employee Management</h3>
              <p className="text-slate-600 mb-4">{employees.length} total employees across {Object.keys(departmentStats).length} departments</p>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
            
            <div className="text-center p-6 border border-slate-200 rounded-lg">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-success" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Attendance Tracking</h3>
              <p className="text-slate-600 mb-4">{attendanceRate.toFixed(1)}% average attendance rate this month</p>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
            
            <div className="text-center p-6 border border-slate-200 rounded-lg">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Payroll Processing</h3>
              <p className="text-slate-600 mb-4">${totalPayroll.toLocaleString()} total payroll this month</p>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
