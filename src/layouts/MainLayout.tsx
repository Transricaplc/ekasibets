import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import TopBar from "@/components/TopBar";
import MiniPlayer from "@/components/MiniPlayer";
import AgeGate from "@/components/AgeGate";
import ResponsibleStrip from "@/components/ResponsibleStrip";
import SessionReminder from "@/components/SessionReminder";
import InstallPrompt from "@/components/InstallPrompt";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AgeGate />
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <TopBar onMenuToggle={() => setSidebarOpen(true)} />
        <ResponsibleStrip />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <MiniPlayer />
      <SessionReminder />
      <InstallPrompt />
    </div>
  );
};

export default MainLayout;
