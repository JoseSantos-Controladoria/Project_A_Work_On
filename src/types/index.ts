/**
 * Centralized type definitions for the application
 */

export type UserRole = "Admin" | "Jurídico" | "Gestor" | "Colaborador" | "Estagiário";

export type ViewType = "dashboard" | "settings" | "admin" | "legal";

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

