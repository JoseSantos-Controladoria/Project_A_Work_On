/**
 * Custom hook for view navigation with permission checking
 */

import { useCallback } from "react";
import { ViewType } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";

export function useViewNavigation() {
  const { hasPermission } = useAuth();
  const { setCurrentView, setShowReauthDialog } = useApp();

  const navigateToView = useCallback(
    (view: ViewType, requireLegalAuth = false) => {
      if (requireLegalAuth && view === "legal") {
        if (!hasPermission(view)) {
          setShowReauthDialog(true);
          return;
        }
        setCurrentView(view);
        return;
      }

      if (view === "legal" && !hasPermission(view)) {
        setShowReauthDialog(true);
        return;
      }

      setCurrentView(view);
    },
    [hasPermission, setCurrentView, setShowReauthDialog]
  );

  return { navigateToView };
}

