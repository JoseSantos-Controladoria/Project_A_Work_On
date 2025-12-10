/**
 * Authentication Context
 * Manages user authentication state globally
 */

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { User } from "@/types";
import { AuthService } from "@/services/auth.service";

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  isLegalAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  reauthenticate: (password: string) => Promise<void>;
  setLegalAuthenticated: (value: boolean) => void;
  hasPermission: (view: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLegalAuthenticated, setIsLegalAuthenticated] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const authenticatedUser = await AuthService.login(email, password);
      setUser(authenticatedUser);
      setIsLoggedIn(true);
      setIsLegalAuthenticated(false);
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
    setIsLegalAuthenticated(false);
  }, []);

  const reauthenticate = useCallback(async (password: string) => {
    if (!user?.email) {
      throw new Error("Usuário não autenticado");
    }

    try {
      await AuthService.reauthenticate(user.email, password);
      setIsLegalAuthenticated(true);
    } catch (error) {
      throw error;
    }
  }, [user]);

  const setLegalAuthenticated = useCallback((value: boolean) => {
    setIsLegalAuthenticated(value);
  }, []);

  const hasPermission = useCallback(
    (view: string): boolean => {
      if (!user) return false;
      return AuthService.hasPermission(user.role, view);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        isLegalAuthenticated,
        login,
        logout,
        reauthenticate,
        setLegalAuthenticated,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

