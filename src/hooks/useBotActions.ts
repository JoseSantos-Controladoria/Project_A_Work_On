/**
 * Custom hook for handling bot actions with authentication checks
 */

import { useCallback } from "react";
import { BotAction } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { NavigationService } from "@/services/navigation.service";
import { parseMonth } from "@/utils/month.utils";

export function useBotActions() {
  const { user, hasPermission, isLegalAuthenticated } = useAuth();
  const {
    setCurrentView,
    selectedDepartments,
    updateDepartments,
    setDataModalOpen,
    setDataModalContent,
    setShowReauthDialog,
  } = useApp();

  const handleBotAction = useCallback(
    (action: BotAction) => {
      // Navigation actions
      if (action.type === "NAVIGATE") {
        if (action.payload.view === "legal") {
          if (!isLegalAuthenticated && !hasPermission("legal")) {
            setShowReauthDialog(true);
            return;
          }
          setCurrentView("legal");
        } else if (action.payload.view === "financeiro") {
          setCurrentView("dashboard");
          if (!selectedDepartments.includes("financeiro")) {
            updateDepartments([...selectedDepartments, "financeiro"]);
          }
        } else {
          const normalizedView = NavigationService.normalizeView(
            action.payload.view || "dashboard"
          );
          setCurrentView(normalizedView);
        }
      }

      // Modal actions
      if (action.type === "OPEN_MODAL") {
        // Financial report modal
        if (action.payload.view === "financeiro_detalhe") {
          const monthName = parseMonth(action.payload.filter);
          setDataModalContent({
            title: action.payload.title || "Análise Financeira",
            data: { type: "financial", month: monthName },
          });
          setDataModalOpen(true);
        }

        // Legal report modal
        if (action.payload.view === "juridico_status") {
          if (!isLegalAuthenticated && user?.role !== "Admin" && user?.role !== "Jurídico") {
            setShowReauthDialog(true);
            return;
          }

          setDataModalContent({
            title: action.payload.title || "Jurídico",
            data: { type: "legal" },
          });
          setDataModalOpen(true);
        }
      }
    },
    [
      user,
      hasPermission,
      isLegalAuthenticated,
      selectedDepartments,
      setCurrentView,
      updateDepartments,
      setDataModalOpen,
      setDataModalContent,
      setShowReauthDialog,
    ]
  );

  return { handleBotAction };
}

