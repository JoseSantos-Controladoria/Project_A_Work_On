import { Building2, Users, DollarSign, Package, TrendingUp, Server, LayoutDashboard, Shield, Scale } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export interface Department {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

export const departments: Department[] = [
  { id: "rh", name: "RH", icon: <Users className="w-5 h-5" />, color: "bg-purple-500" },
  { id: "financeiro", name: "Financeiro", icon: <DollarSign className="w-5 h-5" />, color: "bg-green-500" },
  { id: "operacoes", name: "Operações", icon: <Package className="w-5 h-5" />, color: "bg-orange-500" },
  { id: "vendas", name: "Vendas", icon: <TrendingUp className="w-5 h-5" />, color: "bg-blue-500" },
  { id: "ti", name: "TI", icon: <Server className="w-5 h-5" />, color: "bg-indigo-500" },
];

interface DashboardSidebarProps {
  selectedDepartments: string[];
  onToggleDepartment: (id: string) => void;
  currentView: string;
  onViewChange: (view: string) => void;
  userRole: string;
}

export function DashboardSidebar({
  selectedDepartments,
  onToggleDepartment,
  currentView,
  onViewChange,
  userRole,
}: DashboardSidebarProps) {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-slate-900">Work On</h2>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Button
          variant={currentView === "dashboard" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onViewChange("dashboard")}
        >
          <LayoutDashboard className="w-5 h-5 mr-3" />
          Dashboard
        </Button>

        {userRole === "Admin" && (
          <Button
            variant={currentView === "admin" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onViewChange("admin")}
          >
            <Shield className="w-5 h-5 mr-3" />
            Administração
          </Button>
        )}

        {(userRole === "Admin" || userRole === "Jurídico") && (
          <Button
            variant={currentView === "legal" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onViewChange("legal")}
          >
            <Scale className="w-5 h-5 mr-3" />
            Central Jurídica
            <Badge className="ml-auto bg-red-100 text-red-700 hover:bg-red-100">Restrito</Badge>
          </Button>
        )}

        <div className="pt-6">
          <p className="px-3 mb-2 text-slate-500">Departamentos</p>
          {departments.map((dept) => (
            <Button
              key={dept.id}
              variant={selectedDepartments.includes(dept.id) ? "secondary" : "ghost"}
              className="w-full justify-start mb-1"
              onClick={() => onToggleDepartment(dept.id)}
            >
              <div className={`w-8 h-8 ${dept.color} rounded-lg flex items-center justify-center mr-3 text-white`}>
                {dept.icon}
              </div>
              {dept.name}
              {selectedDepartments.includes(dept.id) && (
                <Badge className="ml-auto bg-blue-100 text-blue-700 hover:bg-blue-100">Ativo</Badge>
              )}
            </Button>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <p className="text-slate-900 mb-1">Precisa de ajuda?</p>
          <p className="text-slate-600 mb-3">Use nosso chatbot IA</p>
          <Button variant="outline" size="sm" className="w-full">
            Abrir Chat
          </Button>
        </div>
      </div>
    </aside>
  );
}