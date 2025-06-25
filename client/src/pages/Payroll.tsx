import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  DollarSign, 
  Users, 
  Calculator, 
  FileText, 
  Plus,
  Search,
  Download 
} from "lucide-react";
import TopBar from "@/components/TopBar";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Employee, Payroll } from "@shared/schema";
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
import { insertPayrollSchema, type InsertPayroll } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function PayrollPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("current");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });

  const { data: payrollRecords = [], isLoading } = useQuery<Payroll[]>({
    queryKey: ["/api/payroll"],
  });

  const form = useForm<InsertPayroll>({
    resolver: zodResolver(insertPayrollSchema),
    defaultValues: {
      employeeId: "",
      payPeriod: new Date().toISOString().slice(0, 7), // YYYY-MM format
      basicSalary: 0,
      overtime: 0,
      bonuses: 0,
      deductions: 0,
      grossPay: 0,
      netPay: 0,
    },
  });

  const addPayrollMutation = useMutation({
    mutationFn: async (data: InsertPayroll) => {
      const response = await apiRequest("POST", "/api/payroll", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payroll"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success!",
        description: "Payroll record added successfully",
      });
      setIsAddModalOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add payroll record",
        variant: "destructive",
      });
    },
  });

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.employeeId === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : employeeId;
  };

  const getCurrentMonth = () => {
    return new Date().toISOString().slice(0, 7);
  };

  const filteredPayroll = payrollRecords.filter(record => {
    const matchesSearch = searchTerm === "" || 
      getEmployeeName(record.employeeId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPeriod = selectedPeriod === "all" || 
      (selectedPeriod === "current" && record.payPeriod === getCurrentMonth()) ||
      record.payPeriod === selectedPeriod;

    return matchesSearch && matchesPeriod;
  });

  // Calculate form values when inputs change
  const watchedValues = form.watch();
  const calculateTotals = () => {
    const basicSalary = Number(watchedValues.basicSalary) || 0;
    const overtime = Number(watchedValues.overtime) || 0;
    const bonuses = Number(watchedValues.bonuses) || 0;
    const deductions = Number(watchedValues.deductions) || 0;
    
    const grossPay = basicSalary + overtime + bonuses;
    const netPay = grossPay - deductions;
    
    return { grossPay, netPay };
  };

  const onSubmit = (data: InsertPayroll) => {
    const { grossPay, netPay } = calculateTotals();
    const finalData = {
      ...data,
      grossPay,
      netPay,
    };
    addPayrollMutation.mutate(finalData);
  };

  // Calculate summary stats
  const totalGrossPay = filteredPayroll.reduce((sum, record) => sum + Number(record.grossPay), 0);
  const totalNetPay = filteredPayroll.reduce((sum, record) => sum + Number(record.netPay), 0);
  const totalDeductions = filteredPayroll.reduce((sum, record) => sum + Number(record.deductions), 0);
  const avgSalary = filteredPayroll.length > 0 ? totalGrossPay / filteredPayroll.length : 0;

  if (isLoading) {
    return (
      <div>
        <TopBar title="Payroll" subtitle="Manage employee compensation" showAddButton={false} />
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
      <TopBar title="Payroll" subtitle="Manage employee compensation" showAddButton={false} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Gross Pay</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  ${totalGrossPay.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-success text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Net Pay</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  ${totalNetPay.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calculator className="text-primary text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Deductions</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  ${totalDeductions.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FileText className="text-error text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Average Salary</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  ${Math.round(avgSalary).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="text-purple-600 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Payroll Records</span>
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
              
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Periods</SelectItem>
                  <SelectItem value="current">Current Month</SelectItem>
                  {/* Add more periods dynamically based on available data */}
                  {Array.from(new Set(payrollRecords.map(r => r.payPeriod))).map(period => (
                    <SelectItem key={period} value={period}>
                      {new Date(period + "-01").toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payroll
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Payroll Record</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
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
                          name="payPeriod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pay Period</FormLabel>
                              <FormControl>
                                <Input type="month" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="basicSalary"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Basic Salary</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="0.00" 
                                  step="0.01"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="overtime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Overtime</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="0.00" 
                                  step="0.01"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="bonuses"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bonuses</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="0.00" 
                                  step="0.01"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="deductions"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Deductions</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="0.00" 
                                  step="0.01"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Calculated totals display */}
                      <div className="border-t pt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 p-3 rounded-lg">
                            <p className="text-sm text-slate-600">Gross Pay</p>
                            <p className="text-lg font-semibold text-slate-900">
                              ${calculateTotals().grossPay.toFixed(2)}
                            </p>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-lg">
                            <p className="text-sm text-slate-600">Net Pay</p>
                            <p className="text-lg font-semibold text-slate-900">
                              ${calculateTotals().netPay.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={addPayrollMutation.isPending}>
                          Add Payroll Record
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPayroll.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No payroll records found</h3>
              <p className="text-slate-500">
                {payrollRecords.length === 0 
                  ? "Start by adding payroll records for your employees." 
                  : "Try adjusting your search or filter criteria."
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Employee</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Pay Period</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Basic Salary</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Overtime</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Bonuses</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Deductions</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Gross Pay</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Net Pay</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayroll.map((record) => (
                    <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-slate-900">
                            {getEmployeeName(record.employeeId)}
                          </p>
                          <p className="text-sm text-slate-500">{record.employeeId}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        {new Date(record.payPeriod + "-01").toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </td>
                      <td className="py-4 px-4 text-slate-600">${Number(record.basicSalary).toLocaleString()}</td>
                      <td className="py-4 px-4 text-slate-600">${Number(record.overtime).toLocaleString()}</td>
                      <td className="py-4 px-4 text-slate-600">${Number(record.bonuses).toLocaleString()}</td>
                      <td className="py-4 px-4 text-slate-600">${Number(record.deductions).toLocaleString()}</td>
                      <td className="py-4 px-4 font-semibold text-slate-900">${Number(record.grossPay).toLocaleString()}</td>
                      <td className="py-4 px-4 font-semibold text-success">${Number(record.netPay).toLocaleString()}</td>
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
