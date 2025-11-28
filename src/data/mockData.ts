// src/data/mockData.ts

// --- DADOS GERAIS (Usados no Dashboard Principal) ---
export const salesData = [
  { month: "Jan", value: 45000 },
  { month: "Fev", value: 52000 },
  { month: "Mar", value: 48000 },
  { month: "Abr", value: 61000 },
  { month: "Mai", value: 55000 },
  { month: "Jun", value: 67000 },
  { month: "Jul", value: 72000 },
  { month: "Ago", value: 69000 },
  { month: "Set", value: 85000 },
  { month: "Out", value: 91000 },
];

export const financeData = [
  { month: "Jan", receita: 120000, despesa: 85000 },
  { month: "Fev", receita: 135000, despesa: 92000 },
  { month: "Mar", receita: 128000, despesa: 88000 },
  { month: "Abr", receita: 145000, despesa: 95000 },
  { month: "Mai", receita: 152000, despesa: 98000 },
  { month: "Jun", receita: 168000, despesa: 102000 },
  { month: "Jul", receita: 175000, despesa: 105000 },
  { month: "Ago", receita: 182000, despesa: 108000 },
  { month: "Set", receita: 198000, despesa: 112000 },
  { month: "Out", receita: 210000, despesa: 115000 },
];

// --- DADOS DETALHADOS PARA RELATÓRIOS (Novo) ---

// 1. Financeiro Detalhado
export const detailedFinanceData = {
  kpis: {
    ebitda: "R$ 42.500",
    margemLucro: "22.4%",
    runway: "14 meses",
    cac: "R$ 450,00"
  },
  dailyTrend: Array.from({ length: 30 }, (_, i) => ({
    day: `Dia ${i + 1}`,
    receita: Math.floor(Math.random() * 5000) + 2000,
    despesa: Math.floor(Math.random() * 3000) + 1000,
  })),
  expensesBreakdown: [
    { name: "Pessoal", value: 45000, color: "#3b82f6" },
    { name: "Infraestrutura", value: 15000, color: "#8b5cf6" },
    { name: "Marketing", value: 25000, color: "#f59e0b" },
    { name: "Softwares", value: 8000, color: "#10b981" },
    { name: "Impostos", value: 19000, color: "#ef4444" },
  ],
  cashFlow: [
    { name: "Semana 1", entrada: 45000, saida: 32000 },
    { name: "Semana 2", entrada: 52000, saida: 35000 },
    { name: "Semana 3", entrada: 48000, saida: 40000 },
    { name: "Semana 4", entrada: 61000, saida: 28000 },
  ]
};

// 2. Jurídico Detalhado
export const detailedLegalData = {
  kpis: {
    riscoGeral: "Baixo",
    processosValor: "R$ 125.000",
    taxaSucesso: "92%",
    tempoMedioResolucao: "45 dias"
  },
  contractsByType: [
    { name: "Prestação de Serviço", value: 45, color: "#3b82f6" },
    { name: "NDA", value: 30, color: "#8b5cf6" },
    { name: "Fornecedores", value: 25, color: "#10b981" },
    { name: "Trabalhista", value: 15, color: "#f59e0b" },
  ],
  risksData: [
    { subject: 'Trabalhista', A: 120, fullMark: 150 },
    { subject: 'Tributário', A: 98, fullMark: 150 },
    { subject: 'Civil', A: 86, fullMark: 150 },
    { subject: 'Propriedade Int.', A: 99, fullMark: 150 },
    { subject: 'Compliance', A: 85, fullMark: 150 },
    { subject: 'Ambiental', A: 65, fullMark: 150 },
  ],
  expiringTimeline: [
    { month: "Set", vencendo: 4, renovados: 12 },
    { month: "Out", vencendo: 8, renovados: 10 },
    { month: "Nov", vencendo: 12, renovados: 15 },
    { month: "Dez", vencendo: 5, renovados: 20 },
  ]
};


export const documentsData = [
  { id: 1, name: "Contrato de Trabalho - Modelo 2025", category: "Contratos" },
  { id: 2, name: "Política de LGPD", category: "Compliance" },
  { id: 3, name: "Manual do Funcionário", category: "Recursos Humanos" },
    { id: 4, name: "Relatório Financeiro Q1 2025", category: "Financeiro" },
    { id: 5, name: "Plano de Marketing 2025", category: "Marketing" },
    { id: 6, name: "Guia de Boas Práticas", category: "Compliance" },
    { id: 7, name: "Contrato de Prestação de Serviços - Modelo 2025", category: "Contratos" },
    { id: 8, name: "Política de Segurança da Informação", category: "Compliance" },
    { id: 9, name: "Relatório Anual de Sustentabilidade 2024", category: "Sustentabilidade" },
    { id: 10, name: "Estratégia de Vendas 2025", category: "Vendas" },
    { id: 11, name: "Manual de Procedimentos Internos", category: "Recursos Humanos" },
    { id: 12, name: "Contrato de Confidencialidade - Modelo 2025", category: "Contratos" },
    { id: 13, name: "Política de Uso de Recursos Corporativos", category: "Compliance" },
    { id: 14, name: "Relatório de Auditoria Interna 2024", category: "Financeiro" },
    { id: 15, name: "Plano de Desenvolvimento de Liderança 2025", category: "Recursos Humanos"},
    { id: 16, name: "Guia de Comunicação Corporativa", category: "Comunicação" },
    { id: 17, name: "Contrato de Locação Comercial - Modelo 2025", category: "Contratos" },
    { id: 18, name: "Política de Diversidade e Inclusão", category: "Recursos Humanos" },
    { id: 19, name: "Relatório de Desempenho Financeiro Q2 2025", category: "Financeiro" },
    { id: 20, name: "Estratégia de Marketing Digital 2025", category: "Marketing" },      
];

import { Client } from "@/types";

export const mockClients: Client[] = [
  {
    id: "pg",
    name: "P&G",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/85/Procter_%26_Gamble_logo.svg",
    segment: "Higiene & Beleza",
    status: "Ativo",
    kpis: { sellOut: 1250000, shareOfShelf: 45, ruptura: 3.2, visitas: 120, skusAtivos: 85 },
    powerBiUrl: "https://app.powerbi.com/view?r=dummy-pg", // Link simulado
    lastUpdate: "Hoje, 09:00"
  },
  {
    id: "semptcl",
    name: "SempTCL",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Semp_TCL_logo.png/800px-Semp_TCL_logo.png",
    segment: "Eletrônicos",
    status: "Ativo",
    kpis: { sellOut: 980000, shareOfShelf: 22, ruptura: 5.5, visitas: 45, skusAtivos: 30 },
    powerBiUrl: "https://app.powerbi.com/view?r=dummy-semptcl",
    lastUpdate: "Ontem, 18:30"
  },
  {
    id: "crs",
    name: "CRS Brands",
    logo: "https://crsbrands.com.br/wp-content/uploads/2020/07/logo-crs.png",
    segment: "Bebidas",
    status: "Ativo",
    kpis: { sellOut: 450000, shareOfShelf: 18, ruptura: 8.1, visitas: 60, skusAtivos: 42 },
    powerBiUrl: "https://app.powerbi.com/view?r=dummy-crs",
    lastUpdate: "Hoje, 10:15"
  }
];