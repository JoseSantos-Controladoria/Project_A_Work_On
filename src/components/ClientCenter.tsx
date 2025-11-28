import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { mockClients } from "@/data/mockData";
import { Client } from "@/types";
import { 
  ArrowLeft, BarChart2, ShoppingCart, 
  Layers, AlertTriangle, Users, Search 
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

interface ClientCenterProps {
  onClose: () => void;
}

export function ClientCenter({ onClose }: ClientCenterProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Dados mockados para o gráfico de evolução (genérico para visualização)
  const evolutionData = [
    { name: 'Sem 1', realizado: 4000, meta: 4500 },
    { name: 'Sem 2', realizado: 3000, meta: 4500 },
    { name: 'Sem 3', realizado: 5000, meta: 4500 },
    { name: 'Sem 4', realizado: 4800, meta: 4500 },
  ];

  const filteredClients = mockClients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- VISÃO 1: LISTA DE CLIENTES ---
  if (!selectedClient) {
    return (
      <div className="flex-1 overflow-auto bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header da Lista */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-2xl font-bold text-slate-900">Central do Cliente</h1>
              </div>
              <p className="text-slate-600 ml-0 md:ml-0">Gestão de Trade Marketing e Performance</p>
            </div>
            
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input 
                placeholder="Buscar cliente (ex: P&G)..." 
                className="pl-10 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Grid de Cards dos Clientes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <Card 
                key={client.id} 
                className="hover:shadow-lg transition-all cursor-pointer group border-slate-200 flex flex-col justify-between"
                onClick={() => setSelectedClient(client)}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {client.segment}
                  </Badge>
                  {client.status === "Ativo" && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  )}
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex flex-col items-center text-center py-4 flex-1">
                    
                    {/* --- LOGO ATUALIZADA --- */}
                    <div className="w-24 h-24 bg-white rounded-lg border p-2 flex items-center justify-center shadow-sm mb-4 relative overflow-hidden aspect-square">
                        <img 
                          src={client.logo} 
                          alt={client.name} 
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" 
                          onError={(e) => e.currentTarget.src='https://placehold.co/64?text=Logo'} 
                        />
                    </div>
                    {/* ----------------------- */}

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {client.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Atualizado: {client.lastUpdate}</p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-sm">
                    <div className="text-center">
                      <p className="text-slate-500 text-xs uppercase tracking-wider">Sell-Out</p>
                      <p className="font-semibold text-slate-900">R$ {(client.kpis.sellOut / 1000).toFixed(0)}k</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-500 text-xs uppercase tracking-wider">Ruptura</p>
                      <p className={`font-semibold ${client.kpis.ruptura > 5 ? 'text-red-600' : 'text-green-600'}`}>
                        {client.kpis.ruptura}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-500 text-xs uppercase tracking-wider">Share</p>
                      <p className="font-semibold text-blue-600">{client.kpis.shareOfShelf}%</p>
                    </div>
                  </div>

                  {/* --- BOTÃO POWER BI COM STOP PROPAGATION --- */}
                  <div className="mt-6 pt-2">
                    <Button 
                        variant="outline" 
                        className="w-full border-yellow-500 text-yellow-700 hover:bg-yellow-50 hover:text-yellow-800"
                        onClick={(e) => {
                          e.stopPropagation(); // Impede que o clique abra o modal do cliente
                          window.open(client.powerBiUrl, '_blank');
                        }}
                    >
                        <BarChart2 className="w-4 h-4 mr-2" />
                        Dashboard Power BI
                    </Button>
                  </div>
                  {/* ------------------------------------------- */}

                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- VISÃO 2: DASHBOARD DETALHADO DO CLIENTE ---
  return (
    <div className="flex-1 overflow-auto bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header do Dashboard */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSelectedClient(null)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 bg-white rounded-lg border p-2 flex items-center justify-center">
                  <img src={selectedClient.logo} className="w-full h-full object-contain" />
               </div>
               <div>
                 <h1 className="text-2xl font-bold text-slate-900">{selectedClient.name}</h1>
                 <p className="text-slate-600 text-sm">Dashboard Analítico de Trade</p>
               </div>
            </div>
          </div>
          <Button 
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium shadow-sm"
            onClick={() => window.open(selectedClient.powerBiUrl, '_blank')}
          >
            <BarChart2 className="w-4 h-4 mr-2" />
            Abrir Power BI
          </Button>
        </div>

        {/* KPIs Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase">Sell-Out (Mês)</CardTitle>
              <ShoppingCart className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                R$ {selectedClient.kpis.sellOut.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 mr-1"></span>
                +12% vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase">Share of Shelf</CardTitle>
              <Layers className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {selectedClient.kpis.shareOfShelf}%
              </div>
              <p className="text-xs text-slate-500 mt-1">Meta da Categoria: 40%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase">Ruptura</CardTitle>
              <AlertTriangle className={`w-4 h-4 ${selectedClient.kpis.ruptura > 4 ? 'text-red-600' : 'text-green-600'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${selectedClient.kpis.ruptura > 4 ? 'text-red-600' : 'text-slate-900'}`}>
                {selectedClient.kpis.ruptura}%
              </div>
              <p className="text-xs text-slate-500 mt-1">Produtos indisponíveis</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase">Visitas / Mês</CardTitle>
              <Users className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {selectedClient.kpis.visitas}
              </div>
              <p className="text-xs text-green-600 mt-1">98% de aderência</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Performance de Sell-Out vs Meta</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Legend />
                  <Bar dataKey="realizado" name="Realizado" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="meta" name="Meta" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top SKUs - {selectedClient.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded flex items-center justify-center text-xs font-bold">
                        #{i}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">Produto SKU-{100+i}</p>
                        <p className="text-xs text-slate-500">Categoria A</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-700">R$ 12.4k</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6">Ver Lista Completa</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}