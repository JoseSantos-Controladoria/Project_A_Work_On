
export type UserRole = "Admin" | "Jurídico" | "Gestor" | "Colaborador" | "Estagiário" | "Operação";

export type ViewType = "dashboard" | "settings" | "admin" | "legal" | "client-center"; // Já preparando para o futuro

// ... restante do arquivo igual
export interface User {
  email: string;
  name: string;
  role: UserRole;
}

export interface BotAction {
  type: "NAVIGATE" | "OPEN_MODAL";
  payload: {
    view?: string;
    filter?: string;
    title?: string;
  };
}

export interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  action?: BotAction;
}

export interface DataModalContent {
  title: string;
  data: {
    type: "financial" | "legal";
    month?: string;
  };
}

export interface Department {
  id: string;
  name: string;
  icon: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  isLegalAuthenticated: boolean;
}

export interface AppState {
  currentView: ViewType;
  selectedDepartments: string[];
  isChatbotOpen: boolean;
  showReauthDialog: boolean;
  dataModalOpen: boolean;
  dataModalContent: DataModalContent | null;
}

export interface TradeKPIs {
  sellOut: number;      // Valor de vendas na ponta (R$)
  shareOfShelf: number; // % de participação na gôndola
  ruptura: number;      // % de falta de produto
  visitas: number;      // Visitas realizadas
  skusAtivos: number;   // Quantidade de produtos ativos
}

export interface Client {
  id: string;
  name: string;
  logo: string;
  segment: string;
  status: "Ativo" | "Inativo";
  kpis: TradeKPIs;
  powerBiUrl: string;
  lastUpdate: string;
}