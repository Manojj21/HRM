import { useState } from "react";
import { Search, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmployeeModal from "./EmployeeModal";

interface TopBarProps {
  title?: string;
  subtitle?: string;
  showAddButton?: boolean;
}

export default function TopBar({ 
  title = "Dashboard", 
  subtitle = "Welcome back, here's what's happening with your team",
  showAddButton = true 
}: TopBarProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
            <p className="text-slate-600 mt-1">{subtitle}</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Input
                type="search"
                placeholder="Search employees..."
                className="pl-10 w-64"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            </div>
            
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Button>
            
            {/* Add Employee Button */}
            {showAddButton && (
              <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Employee</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <EmployeeModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </>
  );
}
