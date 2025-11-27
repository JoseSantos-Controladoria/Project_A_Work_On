import { useState } from "react";
import { Bell, Search, Settings, LogOut, User } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

interface DashboardHeaderProps {
  userName: string;
  userRole: string;
  onLogout: () => void;
  onOpenSettings: () => void;
}

export function DashboardHeader({ userName, userRole, onLogout, onOpenSettings }: DashboardHeaderProps) {
  const [notifications] = useState([
    { id: 1, title: "Nova atualização de RH", time: "5 min atrás", unread: true },
    { id: 2, title: "Relatório financeiro disponível", time: "1 hora atrás", unread: true },
    { id: 3, title: "Reunião agendada para amanhã", time: "2 horas atrás", unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center flex-1 max-w-2xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            type="search"
            placeholder="Buscar informações, documentos, pessoas..."
            className="pl-10 h-10 bg-slate-50 border-slate-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-6">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-slate-600" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-1">
              <h4 className="text-slate-900 mb-3">Notificações</h4>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border cursor-pointer hover:bg-slate-50 ${
                    notification.unread ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200'
                  }`}
                >
                  <p className="text-slate-900">{notification.title}</p>
                  <p className="text-slate-500 mt-1">{notification.time}</p>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 h-10">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-600 text-white">{initials}</AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-slate-900">{userName}</p>
                <p className="text-slate-500">{userRole}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onOpenSettings}>
              <Settings className="mr-2 w-4 h-4" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuItem>
              <User className="mr-2 w-4 h-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 w-4 h-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
