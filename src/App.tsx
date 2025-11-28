/**
 * Main Application Component
 * Refactored with professional architecture using Context API and custom hooks
 */

import { LoginScreen } from "./components/LoginScreen";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { DashboardMain } from "./components/DashboardMain";
import { ChatbotPanel } from "./components/ChatbotPanel";
import { UserSettings } from "./components/UserSettings";
import { AdminPanel } from "./components/AdminPanel";
import { LegalCenter } from "./components/LegalCenter";
import { ClientCenter } from "./components/ClientCenter"; // <--- Novo Import
import { ReauthDialog } from "./components/ReauthDialog";
import { FinancialReport } from "./components/reports/FinancialReport";
import { LegalReport } from "./components/reports/LegalReport";
import { Button } from "./components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./components/ui/dialog";
import { MessageSquare, TrendingUp, Scale } from "lucide-react";
import { Toaster } from "./components/ui/sonner";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AppProvider, useApp } from "./contexts/AppContext";
import { useBotActions } from "./hooks/useBotActions";
import { useViewNavigation } from "./hooks/useViewNavigation";

/**
 * Main App Content (requires providers)
 */
function AppContent() {
  const { isLoggedIn, user, reauthenticate, setLegalAuthenticated, logout } = useAuth();
  const {
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
    setShowReauthDialog,
    setDataModalOpen,
    setDataModalContent,
  } = useApp();

  const { handleBotAction } = useBotActions();
  const { navigateToView } = useViewNavigation();

  // Login is handled directly by LoginScreen component using AuthContext

  const handleLogout = () => {
    logout();
    setCurrentView("dashboard");
  };

  const handleReauthSuccess = (password: string) => {
    // Reauthentication is handled by ReauthDialog component
    // This callback is called after successful reauth
    setLegalAuthenticated(true);
    setShowReauthDialog(false);
    setCurrentView("legal");
  };

  const handleReauthCancel = () => {
    setShowReauthDialog(false);
  };

  const handleViewChange = (view: typeof currentView) => {
    if (view === "legal") {
      navigateToView(view, true);
    } else {
      setCurrentView(view);
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <LoginScreen />
        <Toaster />
      </>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <DashboardSidebar
        selectedDepartments={selectedDepartments}
        onToggleDepartment={toggleDepartment}
        currentView={currentView}
        onViewChange={handleViewChange}
        userRole={user?.role || "Colaborador"}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          userName={user?.name || "Usuário"}
          userRole={user?.role || "Colaborador"}
          onLogout={handleLogout}
          onOpenSettings={() => setCurrentView("settings")}
        />

        {currentView === "dashboard" && (
          <DashboardMain
            selectedDepartments={selectedDepartments}
            userRole={user?.role || "Colaborador"}
          />
        )}

        {currentView === "settings" && (
          <UserSettings
            selectedDepartments={selectedDepartments}
            onUpdateDepartments={updateDepartments}
            onClose={() => setCurrentView("dashboard")}
          />
        )}

        {currentView === "admin" && user?.role === "Admin" && (
          <AdminPanel onClose={() => setCurrentView("dashboard")} />
        )}

        {/* --- NOVA RENDERIZAÇÃO: CENTRAL DO CLIENTE --- */}
        {currentView === "client-center" && (
          <ClientCenter onClose={() => setCurrentView("dashboard")} />
        )}
        {/* --------------------------------------------- */}

        {currentView === "legal" && (user?.role === "Admin" || user?.role === "Jurídico") && (
          <LegalCenter
            onClose={() => setCurrentView("dashboard")}
            userName={user?.name || "Usuário"}
            userRole={user?.role || "Colaborador"}
          />
        )}
      </div>

      <ReauthDialog
        open={showReauthDialog}
        onSuccess={handleReauthSuccess}
        onCancel={handleReauthCancel}
        userEmail={user?.email || ""}
      />

      {/* Data Modal for Generative UI */}
      <Dialog open={dataModalOpen} onOpenChange={setDataModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {dataModalContent?.data.type === "legal" ? (
                <Scale className="w-6 h-6 text-amber-600" />
              ) : (
                <TrendingUp className="w-6 h-6 text-blue-600" />
              )}
              {dataModalContent?.title}
            </DialogTitle>
            <DialogDescription>
              Relatório de inteligência e métricas gerado por IA.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            {dataModalContent && (
              <>
                {dataModalContent.data.type === "financial" && (
                  <FinancialReport month={dataModalContent.data.month} />
                )}

                {dataModalContent.data.type === "legal" && <LegalReport />}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {!isChatbotOpen && currentView === "dashboard" && (
        <Button
          onClick={() => setChatbotOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-2xl z-40"
          size="icon"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      )}

      {isChatbotOpen && (
        <ChatbotPanel
          onClose={() => setChatbotOpen(false)}
          userRole={user?.role}
          onAction={handleBotAction}
        />
      )}

      <Toaster />
    </div>
  );
}

/**
 * Root App Component with Providers
 */
function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;