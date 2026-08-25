import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router";
import { useEffect, useState } from "react";
import { VinPalaceHomeWrapper } from "./components/VinPalaceHomeWrapper";
import Component2DiSnHome from "../imports/VinPalaceHome/VinPalaceHome";
import Component3DiSnStep from "../imports/VinPalaceStep1/VinPalaceStep1";
import Component4DiSnStep2 from "../imports/VinPalaceStep2/VinPalaceStep2";
import Component6DiSnStep from "../imports/VinPalaceStep3/VinPalaceStep3";
import Component7DiSnStep32Done from "../imports/VinPalaceStep4/VinPalaceStep4";
import Component10Step from "../imports/VinPalaceStep5/VinPalaceStep5";
import Component11Step from "../imports/VinPalaceStep6/VinPalaceStep6";
import CommandPalette from "./components/ui/CommandPalette";
import DownloadPage from "./pages/DownloadPhotoPage";
import PromptEditorPage from "./pages/PromptEditorPage";
import Dashboard from "./pages/Dashboard";
import QrPage from "./pages/QrPage";
import MaintenancePage from "./pages/MaintenancePage";
import { MAINTENANCE_CONFIG } from "./config/maintenanceConfig";
// Force cache bust: 2026-08-25T11:26

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, [pathname]);

  return null;
}

// Route Guard kiểm tra trạng thái bảo trì hệ thống
function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const hasBypass = searchParams.get(MAINTENANCE_CONFIG.bypassParam) === "true";

  // Cho phép truy cập nếu là route quản trị hoặc có cờ bypass
  const isAllowed =
    MAINTENANCE_CONFIG.allowedRoutes.some((route) => location.pathname.startsWith(route)) ||
    hasBypass;

  if (MAINTENANCE_CONFIG.isUnderMaintenance && !isAllowed) {
    return <MaintenancePage />;
  }

  return <>{children}</>;
}

export default function App() {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => {
      setIsPaletteOpen(true);
    };
    window.addEventListener("open-command-palette", handleOpen);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "q") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("open-command-palette", handleOpen);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <MaintenanceGuard>
        <div className="min-h-screen bg-[#f7f8f9]">
          <Routes>
            <Route path="/" element={<Navigate to="/vinpalacestep1" replace />} />
            <Route path="/vinpalacehome2" element={<Navigate to="/vinpalacestep1" replace />} />
            <Route path="/vinpalacestep1" element={<Component3DiSnStep />} />
            <Route path="/vinpalacestep2" element={<Component4DiSnStep2 />} />
            <Route path="/vinpalacestep3" element={<Component6DiSnStep />} />
            <Route path="/vinpalacestep4" element={<Component7DiSnStep32Done />} />
            <Route path="/vinpalacestep5" element={<Component10Step />} />
            <Route path="/vinpalacestep6" element={<Component11Step />} />
            <Route path="/vinpalacedownload" element={<DownloadPage />} />
            <Route path="/qr" element={<QrPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/admin/prompts" element={<PromptEditorPage />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
          </Routes>
          <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
        </div>
      </MaintenanceGuard>
    </BrowserRouter>
  );
}
