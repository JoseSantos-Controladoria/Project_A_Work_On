/**
 * Navigation service
 * Handles navigation logic and view management
 */

import { ViewType } from "@/types";
import { VIEW_TYPES } from "@/constants";

export class NavigationService {
  /**
   * Validates if a view transition is allowed
   */
  static canNavigateToView(currentView: ViewType, targetView: ViewType): boolean {
    // Add any navigation rules here
    return true;
  }

  /**
   * Gets the default view for a user
   */
  static getDefaultView(): ViewType {
    return VIEW_TYPES.DASHBOARD;
  }

  /**
   * Normalizes view name
   */
  static normalizeView(view: string): ViewType {
    const normalized = view.toLowerCase();
    
    if (normalized === "dashboard" || normalized === "financeiro" || normalized === "vendas" || normalized === "rh" || normalized === "ti" || normalized === "operacoes") {
      return VIEW_TYPES.DASHBOARD;
    }
    if (normalized === "settings" || normalized === "configuracoes") {
      return VIEW_TYPES.SETTINGS;
    }
    if (normalized === "admin" || normalized === "administracao") {
      return VIEW_TYPES.ADMIN;
    }
    if (normalized === "legal" || normalized === "juridico") {
      return VIEW_TYPES.LEGAL;
    }

    return VIEW_TYPES.DASHBOARD;
  }
}

