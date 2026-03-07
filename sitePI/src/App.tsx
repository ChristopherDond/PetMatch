import { useState } from "react";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { useNotifications } from "@/hooks/useNotifications";
import { useChatbot } from "@/hooks/useChatbot"; // Importa a LÓGICA
import { Navigation } from "@/components/Navigation";
import { NotificationPanel } from "@/components/NotificationPanel";
import { Chatbot } from "@/hooks/Chatbot"; // AJUSTE AQUI: Se o seu componente visual com o scroll está na pasta hooks, aponte para lá
import { AuthPage } from "@/pages/AuthPage";
import { HomePage } from "@/pages/HomePage";
import { AdoptionPage } from "@/pages/AdoptionPage";
import { FavoritesPage } from "@/pages/FavoritesPage";
import { LocationsPage } from "@/pages/LocationsPage";
import { AboutPage } from "@/pages/AboutPage";
import { ContactPage } from "@/pages/ContactPage";
import { Toaster } from "@/components/ui/sonner";

type Page =
  | "home"
  | "adoption"
  | "favorites"
  | "locations"
  | "about"
  | "contact";

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const {
    notifications,
    unreadCount,
    markAsRead,
    removeNotification,
    clearAll,
  } = useNotifications();

  const {
    messages,
    isOpen: chatbotOpen,
    sendMessage,
    toggleChat,
    closeChat,
    clearMessages,
  } = useChatbot();

  const handlePageChange = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    const props = { onPageChange: handlePageChange };
    switch (currentPage) {
      case "home":
        return <HomePage {...props} />;
      case "adoption":
        return <AdoptionPage />;
      case "favorites":
        return <FavoritesPage {...props} />;
      case "locations":
        return <LocationsPage />;
      case "about":
        return <AboutPage />;
      case "contact":
        return <ContactPage />;
      default:
        return <HomePage {...props} />;
    }
  };

  if (!isAuthenticated)
    return (
      <ThemeProvider>
        <AuthPage />
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    );

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Navigation
          currentPage={currentPage}
          onPageChange={handlePageChange}
          notificationCount={unreadCount}
          onOpenNotifications={() => setNotificationsOpen(true)}
        />
        <main className="min-h-[calc(100vh-64px)]">{renderPage()}</main>

        <NotificationPanel
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onRemove={removeNotification}
          onClearAll={clearAll}
        />

        {/* O Componente Chatbot com a correção de scroll que aplicamos */}
        <Chatbot
          isOpen={chatbotOpen}
          messages={messages}
          onToggle={toggleChat}
          onClose={closeChat}
          onSendMessage={sendMessage}
          onClear={clearMessages}
        />

        <Toaster position="top-right" richColors />
      </div>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
