import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { BetSlipProvider } from "@/contexts/BetSlipContext";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import BetSlip from "@/components/BetSlip";
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
import Sportsbook from "./pages/Sportsbook";
import MyBets from "./pages/MyBets";
import Admin from "./pages/Admin";
import Promotions from "./pages/Promotions";
import Leaderboards from "./pages/Leaderboards";
import Rewards from "./pages/Rewards";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BetSlipProvider>
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
                        <Route path="/sportsbook" element={<Sportsbook />} />
                        <Route path="/promotions" element={<Promotions />} />
                        <Route path="/leaderboards" element={<Leaderboards />} />
                        <Route path="/rewards" element={<Rewards />} />
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
                          path="/my-bets"
                          element={
                            <ProtectedRoute>
                              <MyBets />
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
                        <Route
                          path="/admin"
                          element={
                            <ProtectedRoute>
                              <Admin />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                      <BetSlip />
                    </MainLayout>
                  }
                />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </BetSlipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
