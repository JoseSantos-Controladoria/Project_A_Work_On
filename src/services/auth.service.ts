/**
 * Authentication service
 * Handles all authentication-related business logic
 */

import { User, UserRole } from "@/types";
import { MOCK_USERS } from "@/constants";

export class AuthService {
  /**
   * Authenticates a user based on email and password
   * In production, this would make an API call
   */
  static async login(email: string, password: string): Promise<User> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock authentication logic
    const user = this.getUserByEmail(email);
    
    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    // In production, verify password with backend
    if (password.length === 0) {
      throw new Error("Senha não pode estar vazia");
    }

    return user;
  }

  /**
   * Determines user role and name based on email
   */
  private static getUserByEmail(email: string): User | null {
    const emailLower = email.toLowerCase();

    if (emailLower.includes("admin")) {
      return MOCK_USERS.admin;
    }
    if (emailLower.includes("juridico")) {
      return MOCK_USERS.juridico;
    }
    if (emailLower.includes("gestor")) {
      return MOCK_USERS.gestor;
    }
    if (emailLower.includes("estagiario")) {
      return MOCK_USERS.estagiario;
    }
    // Lógica para o novo usuário
    if (emailLower.includes("operacao")) {
      return MOCK_USERS.operacao;
    }
    if (emailLower.includes("colaborador")) {
      return MOCK_USERS.colaborador;
    }

    // Default user
    return {
      email,
      name: "Usuário",
      role: "Colaborador",
    };
  }

  /**
   * Verifies re-authentication for sensitive areas
   */
  static async reauthenticate(email: string, password: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (password.length === 0) {
      throw new Error("Senha incorreta. Tente novamente.");
    }

    return true;
  }

  /**
   * Checks if a user has permission to access a specific view
   */
  static hasPermission(userRole: UserRole, view: string): boolean {
    if (view === "legal") {
      return userRole === "Admin" || userRole === "Jurídico";
    }
    if (view === "admin") {
      return userRole === "Admin";
    }
    return true;
  }
}

