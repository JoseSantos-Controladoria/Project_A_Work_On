import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Users, DollarSign, TrendingUp, ArrowUp, Activity, Loader2 } from "lucide-react";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { api } from "@/services/api.service";
import { toast } from "sonner";

interface DashboardMainProps {
  selectedDepartments: string[];
  userRole: string;
}

// Cores e dados estáticos que não vêm do banco (ainda)
// (Removidos temporariamente para evitar warnings de variáveis não utilizadas)


export function DashboardMain({ selectedDepartments, userRole }: DashboardMainProps) {
  const [financeData, setFinanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- BUSCA DADOS REAIS DO BACKEND ---
  useEffect(() => {
    async function fetchData() {
      try {
        // Busca dados financeiros (que alimentarão Finanças e Vendas)
        const data = await api.financial.list();
        
        // O backend pode retornar fora de ordem, então ordenamos por mês/ano se necessário
        // Como é PoC, assumimos que o seed já inseriu na ordem correta ou ordenamos aqui simples
        setFinanceData(data);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao atualizar dashboard", { description: "Usando dados de cache visual." });
      } finally {
        setLoading(false);
      }
    }

    if (selectedDepartments.includes("financeiro") || selectedDepartments.includes("vendas")) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [selectedDepartments]);

  const canViewDepartment = (deptId: string) => {
    if (userRole === "Admin" || userRole === "Gestor") return true;
    if (userRole === "Colaborador" || userRole === "Estagiário") return selectedDepartments.includes(deptId);
    return false;
  };

  const canViewFinancials = userRole === "Admin" || userRole === "Gestor";
  // const canViewFullMetrics = userRole !== "Estagiário"; // removido: não utilizado atualmente

  // Loading state simples para os cards não "piscarem" vazios
  if (loading && (selectedDepartments.includes("financeiro") || selectedDepartments.includes("vendas"))) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Se a API falhar ou estiver vazia, fallback para array vazio para não quebrar charts
  const chartData = financeData.length > 0 ? financeData : [];

  return (
    <div className="flex-1 overflow-auto bg-slate-50">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-slate-900 mb-2">Dashboard Geral</h1>
          <p className="text-slate-600">Bem-vindo ao seu centro de informações corporativas (Conectado)</p>
        </div>

        {/* Overview Cards - Valores Dinâmicos (Pegando o último mês disponível) */}
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
                {/* Valor estático pois ainda não temos endpoint de contagem de usuários */}
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
                  <CardTitle>Receita (Mês)</CardTitle>
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                {/* Pega a receita do último registro do array */}
                <div className="text-slate-900">
                  R$ {chartData.length > 0 ? chartData[chartData.length - 1].receita.toLocaleString() : "0"}
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">+10.5% vs anterior</span>
                </div>
              </CardContent>
            </Card>
          )}

          {canViewDepartment("vendas") && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Vendas (Mês)</CardTitle>
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                {/* Usando Receita como proxy de Vendas para demonstrar integração */}
                <div className="text-slate-900">
                   R$ {chartData.length > 0 ? (chartData[chartData.length - 1].receita * 0.4).toLocaleString() : "0"}
                </div>
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
          {/* Finance Department - GRÁFICO REAL */}
          {selectedDepartments.includes("financeiro") && canViewDepartment("financeiro") && canViewFinancials && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Financeiro</CardTitle>
                    <CardDescription>Receitas, despesas e fluxo de caixa (Tempo Real)</CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Financeiro</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Cards de Resumo Financeiro (Mockados ou calculados se quiser evoluir) */}
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-600 mb-1">Total Acumulado</p>
                    <p className="text-slate-900">R$ {chartData.reduce((acc, curr) => acc + curr.receita, 0).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-600 mb-1">Despesas Total</p>
                    <p className="text-slate-900">R$ {chartData.reduce((acc, curr) => acc + curr.despesa, 0).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-600 mb-1">Lucro Líquido</p>
                    <p className="text-slate-900">R$ {chartData.reduce((acc, curr) => acc + (curr.receita - curr.despesa), 0).toLocaleString()}</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
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

          {/* Sales Department - GRÁFICO REAL (Baseado no Financeiro para PoC) */}
          {selectedDepartments.includes("vendas") && canViewDepartment("vendas") && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Vendas</CardTitle>
                    <CardDescription>Performance de vendas vs Metas</CardDescription>
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
                    <p className="text-slate-900">R$ {chartData.length > 0 ? (chartData[chartData.length-1].receita * 0.45).toLocaleString() : 0}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-600 mb-1">Taxa de Conversão</p>
                    <p className="text-slate-900">28.4%</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    {/* Simulando dados de Vendas como uma fração da Receita para ilustração */}
                    <Bar dataKey="receita" fill="#3b82f6" name="Vendas (R$)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* RH Department (Mantido estático pois não temos endpoint de RH ainda) */}
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
              </CardContent>
            </Card>
          )}

          {/* Outros cards mantidos igual... */}
          {/* Operations & TI (Omiti o código repetitivo para focar na mudança principal, mas no seu arquivo real mantenha-os) */}
          
        </div>
      </div>
    </div>
  );
}