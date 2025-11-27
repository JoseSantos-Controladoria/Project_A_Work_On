import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ArrowLeft, Plus, Edit, Trash2, Search, Shield, Users, Activity, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface AdminPanelProps {
  onClose: () => void;
}

const mockUsers = [
  { id: 1, name: "Ana Silva", email: "ana.silva@empresa.com", role: "Admin", status: "Ativo", lastAccess: "Hoje, 14:32" },
  { id: 2, name: "Dr. Ricardo Alves", email: "ricardo.alves@empresa.com", role: "Jurídico", status: "Ativo", lastAccess: "Hoje, 13:20" },
  { id: 3, name: "Carlos Santos", email: "carlos.santos@empresa.com", role: "Gestor", status: "Ativo", lastAccess: "Hoje, 12:15" },
  { id: 4, name: "Maria Oliveira", email: "maria.oliveira@empresa.com", role: "Colaborador", status: "Ativo", lastAccess: "Ontem, 18:45" },
  { id: 5, name: "João Souza", email: "joao.souza@empresa.com", role: "Colaborador", status: "Ativo", lastAccess: "Hoje, 09:22" },
  { id: 6, name: "Patricia Costa", email: "patricia.costa@empresa.com", role: "Estagiário", status: "Ativo", lastAccess: "Hoje, 11:08" },
  { id: 7, name: "Roberto Lima", email: "roberto.lima@empresa.com", role: "Gestor", status: "Inativo", lastAccess: "há 3 dias" },
];

const mockLogs = [
  { id: 1, user: "Ana Silva", action: "Acessou dashboard", timestamp: "2025-11-07 14:32:15", ip: "192.168.1.10" },
  { id: 2, user: "Carlos Santos", action: "Exportou relatório financeiro", timestamp: "2025-11-07 12:15:42", ip: "192.168.1.25" },
  { id: 3, user: "Maria Oliveira", action: "Modificou configurações", timestamp: "2025-11-06 18:45:01", ip: "192.168.1.33" },
  { id: 4, user: "João Souza", action: "Visualizou dados de vendas", timestamp: "2025-11-07 09:22:18", ip: "192.168.1.42" },
  { id: 5, user: "Patricia Costa", action: "Acessou dashboard", timestamp: "2025-11-07 11:08:55", ip: "192.168.1.51" },
];

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const getRoleBadge = (role: string) => {
    const variants: Record<string, string> = {
      Admin: "bg-red-100 text-red-700",
      Jurídico: "bg-amber-100 text-amber-700",
      Gestor: "bg-blue-100 text-blue-700",
      Colaborador: "bg-green-100 text-green-700",
      Estagiário: "bg-purple-100 text-purple-700",
    };
    return variants[role] || "bg-slate-100 text-slate-700";
  };

  const getStatusBadge = (status: string) => {
    return status === "Ativo"
      ? "bg-green-100 text-green-700"
      : "bg-slate-100 text-slate-700";
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-50">
      <div className="p-6 max-w-7xl mx-auto">
        <Button variant="ghost" onClick={onClose} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        <div className="mb-6">
          <h1 className="text-slate-900 mb-2">Painel de Administração</h1>
          <p className="text-slate-600">Gerencie usuários, permissões e monitore atividades</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Total de Usuários</CardTitle>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-slate-900">248</div>
              <p className="text-slate-600 mt-1">+12 este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Usuários Ativos</CardTitle>
                <Activity className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-slate-900">184</div>
              <p className="text-slate-600 mt-1">Últimas 24h</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Permissões</CardTitle>
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-slate-900">4 Níveis</div>
              <p className="text-slate-600 mt-1">Admin a Estagiário</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Logs Hoje</CardTitle>
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-slate-900">1,547</div>
              <p className="text-slate-600 mt-1">Ações registradas</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="permissions">Permissões</TabsTrigger>
            <TabsTrigger value="logs">Logs de Atividade</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gerenciar Usuários</CardTitle>
                    <CardDescription>Adicione, edite ou remova usuários do sistema</CardDescription>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Usuário
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      type="search"
                      placeholder="Buscar usuários..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Nível de Acesso</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Último Acesso</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="text-slate-900">{user.name}</TableCell>
                          <TableCell className="text-slate-600">{user.email}</TableCell>
                          <TableCell>
                            <Badge className={getRoleBadge(user.role)}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadge(user.status)}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-600">{user.lastAccess}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Níveis de Acesso e Permissões</CardTitle>
                <CardDescription>Configure o que cada nível de usuário pode acessar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { role: "Admin", color: "bg-red-500", description: "Acesso total ao sistema, incluindo administração de usuários e Central Jurídica" },
                  { role: "Jurídico", color: "bg-amber-500", description: "Acesso exclusivo à Central Jurídica e documentações confidenciais" },
                  { role: "Gestor", color: "bg-blue-500", description: "Acesso a todos os departamentos e dados financeiros completos" },
                  { role: "Colaborador", color: "bg-green-500", description: "Acesso aos departamentos selecionados com dados limitados" },
                  { role: "Estagiário", color: "bg-purple-500", description: "Acesso apenas de visualização aos departamentos selecionados" },
                ].map((level, index) => (
                  <div key={index} className="p-6 border border-slate-200 rounded-lg bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${level.color} rounded-xl flex items-center justify-center`}>
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-slate-900">{level.role}</h3>
                          <p className="text-slate-600">{level.description}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {["Dashboard", "RH", "Financeiro", "Operações", "Vendas", "TI"].map((dept) => (
                        <div key={dept} className="flex items-center gap-2 text-slate-700">
                          <div className={`w-2 h-2 rounded-full ${level.role === "Admin" || (level.role === "Gestor" && dept !== "Administração") ? "bg-green-500" : "bg-slate-300"}`}></div>
                          {dept}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Logs de Atividade do Sistema</CardTitle>
                <CardDescription>Monitore todas as ações realizadas pelos usuários</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      type="search"
                      placeholder="Buscar logs..."
                      className="pl-10"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por ação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as ações</SelectItem>
                      <SelectItem value="access">Acessos</SelectItem>
                      <SelectItem value="export">Exportações</SelectItem>
                      <SelectItem value="modify">Modificações</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Ação</TableHead>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Endereço IP</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-slate-900">{log.user}</TableCell>
                          <TableCell className="text-slate-600">{log.action}</TableCell>
                          <TableCell className="text-slate-600">{log.timestamp}</TableCell>
                          <TableCell className="text-slate-600">{log.ip}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
