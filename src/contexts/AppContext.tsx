/**
 * Application Context
 * Manages application-wide state (views, departments, modals, etc.)
 */

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ViewType, DataModalContent, BotAction } from "@/types";
import { DEFAULT_DEPARTMENTS } from "@/constants";
import { NavigationService } from "@/services/navigation.service";
import { parseMonth } from "@/utils/month.utils";

interface AppContextType {
  currentView: ViewType;
  selectedDepartments: string[];
  isChatbotOpen: boolean;
  showReauthDialog: boolean;
  dataModalOpen: boolean;
  dataModalContent: DataModalContent | null;

  // Actions
  setCurrentView: (view: ViewType) => void;
  toggleDepartment: (deptId: string) => void;
  updateDepartments: (departments: string[]) => void;
  setChatbotOpen: (open: boolean) => void;
  setShowReauthDialog: (show: boolean) => void;
  setDataModalOpen: (open: boolean) => void;
  setDataModalContent: (content: DataModalContent | null) => void;
  handleBotAction: (action: BotAction) => void;
  resetToDashboard: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentViewState] = useState<ViewType>(
    NavigationService.getDefaultView()
  );
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(
    DEFAULT_DEPARTMENTS
  );
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [showReauthDialog, setShowReauthDialog] = useState(false);
  const [dataModalOpen, setDataModalOpen] = useState(false);
  const [dataModalContent, setDataModalContent] = useState<DataModalContent | null>(null);

  const setCurrentView = useCallback((view: ViewType) => {
    if (NavigationService.canNavigateToView(currentView, view)) {
      setCurrentViewState(view);
    }
  }, [currentView]);

  const toggleDepartment = useCallback((deptId: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(deptId)
        ? prev.filter((id) => id !== deptId)
        : [...prev, deptId]
    );
  }, []);

  const updateDepartments = useCallback((departments: string[]) => {
    setSelectedDepartments(departments);
  }, []);

  const setChatbotOpen = useCallback((open: boolean) => {
    setIsChatbotOpen(open);
  }, []);

  const setShowReauthDialogState = useCallback((show: boolean) => {
    setShowReauthDialog(show);
  }, []);

  const setDataModalOpenState = useCallback((open: boolean) => {
    setDataModalOpen(open);
  }, []);

  const resetToDashboard = useCallback(() => {
    setCurrentViewState(NavigationService.getDefaultView());
    setSelectedDepartments(DEFAULT_DEPARTMENTS);
  }, []);

  const handleBotAction = useCallback(
    (action: BotAction) => {
      // This will be enhanced with auth context in the component
      // For now, we'll handle the basic navigation logic
      if (action.type === "NAVIGATE") {
        const normalizedView = NavigationService.normalizeView(
          action.payload.view || "dashboard"
        );
        setCurrentView(normalizedView);

        // Handle department selection for financial view
        if (action.payload.view === "financeiro") {
          if (!selectedDepartments.includes("financeiro")) {
            setSelectedDepartments((prev) => [...prev, "financeiro"]);
          }
        }
      }

      if (action.type === "OPEN_MODAL") {
        // Financial report modal
        if (action.payload.view === "financeiro_detalhe") {
          const monthName = parseMonth(action.payload.filter);
          setDataModalContent({
            title: action.payload.title || "Análise Financeira",
            data: { type: "financial", month: monthName },
          });
          setDataModalOpenState(true);
        }

        // Legal report modal
        if (action.payload.view === "juridico_status") {
          setDataModalContent({
            title: action.payload.title || "Jurídico",
            data: { type: "legal" },
          });
          setDataModalOpenState(true);
        }
      }
    },
    [selectedDepartments, setCurrentView, setDataModalOpenState]
  );

  return (
    <AppContext.Provider
      value={{
        currentView,
        selectedDepartments,
        isChatbotOpen,
        showReauthDialog,
        dataModalOpen,
        dataModalContent,
        setCurrentView,
        toggleDepartment,
        updateDepartments,
        setChatbotOpen,
        setShowReauthDialog: setShowReauthDialogState,
        setDataModalOpen: setDataModalOpenState,
        setDataModalContent,
        handleBotAction,
        resetToDashboard,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

