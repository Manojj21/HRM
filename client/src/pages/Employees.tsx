import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Filter,
  ArrowUpDown 
} from "lucide-react";
import TopBar from "@/components/TopBar";
import EmployeeModal from "@/components/EmployeeModal";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Employee } from "@shared/schema";

export default function Employees() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [sortField, setSortField] = useState<keyof Employee>("firstName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: employees = [], isLoading } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/employees/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success!",
        description: "Employee deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success-100 text-success">Active</Badge>;
      case "on-leave":
        return <Badge className="bg-warning-100 text-warning">On Leave</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      deleteEmployeeMutation.mutate(id);
    }
  };

  const filteredAndSortedEmployees = employees
    .filter((employee) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        employee.firstName.toLowerCase().includes(searchLower) ||
        employee.lastName.toLowerCase().includes(searchLower) ||
        employee.email.toLowerCase().includes(searchLower) ||
        employee.department.toLowerCase().includes(searchLower) ||
        employee.position.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const aValue = a[sortField]?.toString() || "";
      const bValue = b[sortField]?.toString() || "";
      const comparison = aValue.localeCompare(bValue);
      return sortDirection === "asc" ? comparison : -comparison;
    });

  if (isLoading) {
    return (
      <div>
        <TopBar title="Employees" subtitle="Manage your team members" />
        <div className="space-y-6">
          <Card className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-64 bg-slate-200 rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TopBar title="Employees" subtitle="Manage your team members" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Employee Directory</span>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAndSortedEmployees.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {employees.length === 0 ? "No employees yet" : "No employees found"}
              </h3>
              <p className="text-slate-500 mb-6">
                {employees.length === 0 
                  ? "Start building your team by adding your first employee." 
                  : "Try adjusting your search criteria."
                }
              </p>
              {employees.length === 0 && (
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Employee
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSort("firstName")}
                        className="h-auto p-0 font-medium"
                      >
                        Employee
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </Button>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSort("department")}
                        className="h-auto p-0 font-medium"
                      >
                        Department
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </Button>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Position</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSort("startDate")}
                        className="h-auto p-0 font-medium"
                      >
                        Start Date
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </Button>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedEmployees.map((employee) => (
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
                            <p className="text-xs text-slate-400">ID: {employee.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600 capitalize">{employee.department}</td>
                      <td className="py-4 px-4 text-slate-600">{employee.position}</td>
                      <td className="py-4 px-4 text-slate-600">
                        {new Date(employee.startDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(employee.status)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleEdit(employee)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(employee.id)}
                            disabled={deleteEmployeeMutation.isPending}
                          >
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

      <EmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        isEdit={true}
      />
    </div>
  );
}
