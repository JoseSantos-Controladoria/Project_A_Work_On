import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { TrendingUp, DollarSign, Wallet, Activity } from "lucide-react";
import { detailedFinanceData } from "../../data/mockData";

interface FinancialReportProps {
  month: string;
}

export function FinancialReport({ month }: FinancialReportProps) {
  return (
    <div className="space-y-4">
      {/* KPIs Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">EBITDA</span>
            <div className="flex items-center gap-2 mt-1">
              <Activity className="w-4 h-4 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">{detailedFinanceData.kpis.ebitda}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Margem</span>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xl font-bold text-slate-900">{detailedFinanceData.kpis.margemLucro}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Runway</span>
            <div className="flex items-center gap-2 mt-1">
              <Wallet className="w-4 h-4 text-purple-600" />
              <span className="text-xl font-bold text-slate-900">{detailedFinanceData.kpis.runway}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">CAC</span>
            <div className="flex items-center gap-2 mt-1">
              <DollarSign className="w-4 h-4 text-orange-600" />
              <span className="text-xl font-bold text-slate-900">{detailedFinanceData.kpis.cac}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para diferentes visões */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Fluxo Diário</TabsTrigger>
          <TabsTrigger value="composition">Composição & Despesas</TabsTrigger>
        </TabsList>
        
        {/* Tab 1: Visão Geral / Tendência */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Evolução Diária - Mês {month}</CardTitle>
              <CardDescription>Comparativo de entradas e saídas dia a dia.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={detailedFinanceData.dailyTrend}>
                  <defs>
                    <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" hide />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36}/>
                  <Area type="monotone" dataKey="receita" stroke="#10b981" fillOpacity={1} fill="url(#colorReceita)" name="Receitas" />
                  <Area type="monotone" dataKey="despesa" stroke="#ef4444" fillOpacity={1} fill="url(#colorDespesa)" name="Despesas" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Detalhes */}
        <TabsContent value="composition" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Breakdown de Despesas</CardTitle>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={detailedFinanceData.expensesBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {detailedFinanceData.expensesBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fluxo de Caixa Semanal</CardTitle>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={detailedFinanceData.cashFlow}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="entrada" fill="#10b981" name="Entradas" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="saida" fill="#ef4444" name="Saídas" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}