import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, CheckCircle, Calendar, DollarSign, ArrowUp, Eye, Edit, Trash2, UserPlus, Clock, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import type { Employee } from "@shared/schema";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: employees, isLoading: employeesLoading } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });

  const recentEmployees = employees?.slice(-5) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success-100 text-success">Active</Badge>;
      case "on-leave":
        return <Badge className="bg-warning-100 text-warning">On Leave</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (statsLoading || employeesLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-slate-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Employees</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {stats?.totalEmployees || 0}
                </p>
                <p className="text-success text-sm mt-2 flex items-center">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  <span>Growing team</span>
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
                <p className="text-slate-600 text-sm font-medium">Present Today</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {stats?.presentToday || 0}
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  {stats?.totalEmployees > 0 ? 
                    `${Math.round((stats?.presentToday / stats?.totalEmployees) * 100)}% attendance` : 
                    "No data"
                  }
                </p>
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
                <p className="text-slate-600 text-sm font-medium">Leave Requests</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {stats?.leaveRequests || 0}
                </p>
                <p className="text-warning text-sm mt-2 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Pending review</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-warning text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Avg Salary</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  ${stats?.avgSalary?.toLocaleString() || 0}
                </p>
                <p className="text-success text-sm mt-2 flex items-center">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  <span>Competitive rates</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-purple-600 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/employees">
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <UserPlus className="text-primary w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-slate-900">Add New Employee</p>
                    <p className="text-sm text-slate-500">Create employee profile</p>
                  </div>
                </div>
              </Button>
            </Link>

            <Link href="/attendance">
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="text-success w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-slate-900">Mark Attendance</p>
                    <p className="text-sm text-slate-500">Record daily attendance</p>
                  </div>
                </div>
              </Button>
            </Link>

            <Link href="/reports">
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="text-purple-600 w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-slate-900">Generate Report</p>
                    <p className="text-sm text-slate-500">Create HR reports</p>
                  </div>
                </div>
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity - Placeholder for now */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="text-success w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 font-medium">New employees added</p>
                  <p className="text-slate-500 text-sm">
                    {recentEmployees.length} employees in the system
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="text-primary w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 font-medium">Attendance system ready</p>
                  <p className="text-slate-500 text-sm">Track employee attendance</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <DollarSign className="text-purple-600 w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 font-medium">Payroll system active</p>
                  <p className="text-slate-500 text-sm">Manage employee compensation</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Table Preview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Employees</CardTitle>
          <Link href="/employees">
            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
              <span>View All Employees</span>
              <ArrowUp className="w-4 h-4 rotate-45" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentEmployees.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No employees found. Add your first employee to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Employee</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Position</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEmployees.map((employee) => (
                    <tr key={employee.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center">
                            <Users className="text-slate-600 w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {employee.firstName} {employee.lastName}
                            </p>
                            <p className="text-sm text-slate-500">{employee.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600 capitalize">{employee.department}</td>
                      <td className="py-4 px-4 text-slate-600">{employee.position}</td>
                      <td className="py-4 px-4">{getStatusBadge(employee.status)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
