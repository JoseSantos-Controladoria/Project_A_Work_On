import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Users, DollarSign, Package, TrendingUp, Server, ArrowUp, ArrowDown, Activity } from "lucide-react";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface DashboardMainProps {
  selectedDepartments: string[];
  userRole: string;
}

// Mock data
const salesData = [
  { month: "Jan", value: 45000 },
  { month: "Fev", value: 52000 },
  { month: "Mar", value: 48000 },
  { month: "Abr", value: 61000 },
  { month: "Mai", value: 55000 },
  { month: "Jun", value: 67000 },
];

const financeData = [
  { month: "Jan", receita: 120000, despesa: 85000 },
  { month: "Fev", receita: 135000, despesa: 92000 },
  { month: "Mar", receita: 128000, despesa: 88000 },
  { month: "Abr", receita: 145000, despesa: 95000 },
  { month: "Mai", receita: 152000, despesa: 98000 },
  { month: "Jun", receita: 168000, despesa: 102000 },
];

const operationsData = [
  { name: "Produção", value: 35 },
  { name: "Logística", value: 25 },
  { name: "Qualidade", value: 20 },
  { name: "Manutenção", value: 20 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export function DashboardMain({ selectedDepartments, userRole }: DashboardMainProps) {
  const canViewDepartment = (deptId: string) => {
    if (userRole === "Admin" || userRole === "Gestor") return true;
    if (userRole === "Colaborador") return selectedDepartments.includes(deptId);
    if (userRole === "Estagiário") return selectedDepartments.includes(deptId);
    return false;
  };

  const canViewFinancials = userRole === "Admin" || userRole === "Gestor";
  const canViewFullMetrics = userRole !== "Estagiário";

  return (
    <div className="flex-1 overflow-auto bg-slate-50">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-slate-900 mb-2">Dashboard Geral</h1>
          <p className="text-slate-600">Bem-vindo ao seu centro de informações corporativas</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {canViewDepartment("rh") && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Colaboradores</CardTitle>
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-slate-900">248</div>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">12 este mês</span>
                </div>
              </CardContent>
            </Card>
          )}

          {canViewDepartment("financeiro") && canViewFinancials && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Receita</CardTitle>
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-slate-900">R$ 168.000</div>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">+10.5% vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
          )}

          {canViewDepartment("vendas") && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Vendas</CardTitle>
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-slate-900">R$ 67.000</div>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">+21.8% este mês</span>
                </div>
              </CardContent>
            </Card>
          )}

          {canViewDepartment("operacoes") && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Eficiência</CardTitle>
                  <Activity className="w-5 h-5 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-slate-900">92.3%</div>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">+2.1% vs semana passada</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Department Cards */}
        <div className="space-y-6">
          {/* RH Department */}
          {selectedDepartments.includes("rh") && canViewDepartment("rh") && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recursos Humanos</CardTitle>
                    <CardDescription>Métricas e indicadores de pessoal</CardDescription>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">RH</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-600 mb-1">Taxa de Retenção</p>
                    <p className="text-slate-900">94.2%</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-600 mb-1">Satisfação</p>
                    <p className="text-slate-900">4.5/5.0</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-600 mb-1">Vagas Abertas</p>
                    <p className="text-slate-900">12 posições</p>
                  </div>
                </div>
                {canViewFullMetrics && (
                  <div className="space-y-2">
                    <p className="text-slate-700">Distribuição por Área</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                        </div>
                        <span className="text-slate-600 w-32">Operações (35%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '28%' }}></div>
                        </div>
                        <span className="text-slate-600 w-32">Vendas (28%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: '22%' }}></div>
                        </div>
                        <span className="text-slate-600 w-32">TI (22%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div className="bg-orange-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                        <span className="text-slate-600 w-32">Admin (15%)</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Finance Department */}
          {selectedDepartments.includes("financeiro") && canViewDepartment("financeiro") && canViewFinancials && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Financeiro</CardTitle>
                    <CardDescription>Receitas, despesas e fluxo de caixa</CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Financeiro</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-600 mb-1">Receita Total</p>
                    <p className="text-slate-900">R$ 888.000</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-600 mb-1">Despesas</p>
                    <p className="text-slate-900">R$ 560.000</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-600 mb-1">Lucro Líquido</p>
                    <p className="text-slate-900">R$ 328.000</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={financeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="receita" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Receita" />
                    <Area type="monotone" dataKey="despesa" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Despesa" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Sales Department */}
          {selectedDepartments.includes("vendas") && canViewDepartment("vendas") && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Vendas</CardTitle>
                    <CardDescription>Performance de vendas e metas</CardDescription>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Vendas</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-600 mb-1">Meta do Mês</p>
                    <p className="text-slate-900">R$ 70.000</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-600 mb-1">Realizado</p>
                    <p className="text-slate-900">R$ 67.000</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-600 mb-1">Taxa de Conversão</p>
                    <p className="text-slate-900">28.4%</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" name="Vendas (R$)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Operations Department */}
          {selectedDepartments.includes("operacoes") && canViewDepartment("operacoes") && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Operações</CardTitle>
                    <CardDescription>Eficiência operacional e produtividade</CardDescription>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Operações</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-4 mb-6">
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-slate-600 mb-1">Projetos Ativos</p>
                        <p className="text-slate-900">18 projetos</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-slate-600 mb-1">Taxa de Entregas no Prazo</p>
                        <p className="text-slate-900">89.5%</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={operationsData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {operationsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* IT Department */}
          {selectedDepartments.includes("ti") && canViewDepartment("ti") && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Tecnologia da Informação</CardTitle>
                    <CardDescription>Infraestrutura e sistemas</CardDescription>
                  </div>
                  <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">TI</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-600 mb-1">Uptime</p>
                    <p className="text-slate-900">99.8%</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-600 mb-1">Tickets Abertos</p>
                    <p className="text-slate-900">23</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-600 mb-1">Tempo Médio Resposta</p>
                    <p className="text-slate-900">2.3h</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-600 mb-1">Satisfação</p>
                    <p className="text-slate-900">4.7/5.0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {selectedDepartments.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-slate-900 mb-2">Nenhum departamento selecionado</h3>
              <p className="text-slate-600">Selecione departamentos no menu lateral para visualizar suas informações</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
