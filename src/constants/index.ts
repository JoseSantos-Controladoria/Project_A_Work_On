/**
 * Application constants and configuration
 */

import { Department } from "@/types";

export const DEFAULT_DEPARTMENTS = ["rh", "vendas"];

export const DEPARTMENTS: Department[] = [
  { id: "rh", name: "Recursos Humanos", icon: "Users" },
  { id: "vendas", name: "Vendas", icon: "TrendingUp" },
  { id: "financeiro", name: "Financeiro", icon: "DollarSign" },
  { id: "ti", name: "Tecnologia", icon: "Server" },
  { id: "operacoes", name: "Operações", icon: "Settings" },
];

export const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const USER_ROLES = {
  ADMIN: "Admin",
  JURIDICO: "Jurídico",
  GESTOR: "Gestor",
  COLABORADOR: "Colaborador",
  ESTAGIARIO: "Estagiário",
} as const;

export const VIEW_TYPES = {
  DASHBOARD: "dashboard",
  SETTINGS: "settings",
  ADMIN: "admin",
  LEGAL: "legal",
} as const;

export const MOCK_USERS = {
  admin: { email: "admin@empresa.com", name: "Ana Silva", role: "Admin" as const },
  juridico: { email: "juridico@empresa.com", name: "Dr. Ricardo Alves", role: "Jurídico" as const },
  gestor: { email: "gestor@empresa.com", name: "Carlos Santos", role: "Gestor" as const },
  colaborador: { email: "colaborador@empresa.com", name: "Maria Oliveira", role: "Colaborador" as const },
  estagiario: { email: "estagiario@empresa.com", name: "Patricia Costa", role: "Estagiário" as const },
};

