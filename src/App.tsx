import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import MainLayout from "@/layouts/MainLayout";
import Index from "./pages/Index";
import LiveBetting from "./pages/LiveBetting";
import CommunityHub from "./pages/CommunityHub";
import WalletPayments from "./pages/WalletPayments";
import ResponsibleGaming from "./pages/ResponsibleGaming";
import AboutUs from "./pages/AboutUs";
import EventsToursPage from "./pages/EventsToursPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/live" element={<LiveBetting />} />
              <Route path="/community" element={<CommunityHub />} />
              <Route path="/wallet" element={<WalletPayments />} />
              <Route path="/events" element={<EventsToursPage />} />
              <Route path="/responsible-gaming" element={<ResponsibleGaming />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
