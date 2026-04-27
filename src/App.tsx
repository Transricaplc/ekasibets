import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import LiveBetting from "./pages/LiveBetting";
import CommunityHub from "./pages/CommunityHub";
import WalletPayments from "./pages/WalletPayments";
import ResponsibleGaming from "./pages/ResponsibleGaming";
import AboutUs from "./pages/AboutUs";
import EventsToursPage from "./pages/EventsToursPage";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import KYC from "./pages/KYC";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth route renders standalone (no sidebar) */}
              <Route path="/auth" element={<Auth />} />

              {/* All other routes use MainLayout */}
              <Route
                path="*"
                element={
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/live" element={<LiveBetting />} />
                      <Route path="/community" element={<CommunityHub />} />
                      <Route path="/events" element={<EventsToursPage />} />
                      <Route path="/responsible-gaming" element={<ResponsibleGaming />} />
                      <Route path="/about" element={<AboutUs />} />
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/kyc"
                        element={
                          <ProtectedRoute>
                            <KYC />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/wallet"
                        element={
                          <ProtectedRoute>
                            <WalletPayments />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </MainLayout>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
