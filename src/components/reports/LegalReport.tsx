import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, CartesianGrid } from "recharts";
import { Shield, AlertTriangle, Gavel, Clock } from "lucide-react";
import { detailedLegalData } from "../../data/mockData";

export function LegalReport() {
  return (
    <div className="space-y-4">
      {/* KPIs de Risco */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-red-600 uppercase">Valor em Risco</p>
                <p className="text-lg font-bold text-red-900 mt-1">{detailedLegalData.kpis.processosValor}</p>
              </div>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-emerald-600 uppercase">Taxa de Sucesso</p>
                <p className="text-lg font-bold text-emerald-900 mt-1">{detailedLegalData.kpis.taxaSucesso}</p>
              </div>
              <Shield className="w-5 h-5 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-blue-600 uppercase">Resolução Média</p>
                <p className="text-lg font-bold text-blue-900 mt-1">{detailedLegalData.kpis.tempoMedioResolucao}</p>
              </div>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-600 uppercase">Risco Geral</p>
                <p className="text-lg font-bold text-slate-900 mt-1">{detailedLegalData.kpis.riscoGeral}</p>
              </div>
              <Gavel className="w-5 h-5 text-slate-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Radar de Riscos */}
        <Card>
          <CardHeader>
            <CardTitle>Matriz de Risco por Área</CardTitle>
            <CardDescription>Análise de exposição legal.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={detailedLegalData.risksData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} />
                <Radar name="Risco Atual" dataKey="A" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cronograma de Contratos */}
        <Card>
          <CardHeader>
            <CardTitle>Cronograma de Vencimentos</CardTitle>
            <CardDescription>Previsão para o próximo trimestre.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={detailedLegalData.expiringTimeline} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="month" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="vencendo" name="A Vencer" fill="#f59e0b" stackId="a" radius={[0, 4, 4, 0]} />
                <Bar dataKey="renovados" name="Já Renovados" fill="#3b82f6" stackId="a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}