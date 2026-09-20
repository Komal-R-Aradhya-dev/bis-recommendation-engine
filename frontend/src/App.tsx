import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import ImmersiveBackground from "@/components/layout/ImmersiveBackground";
import AppRoutes from "@/routes/AppRoutes";
import { useThemeStore } from "@/store/themeStore";

function App() {
  const theme = useThemeStore((state) => state.theme);
  const applyTheme = useThemeStore((state) => state.applyTheme);

  useEffect(() => {
    applyTheme();
  }, [applyTheme, theme]);

  return (
    <BrowserRouter>
      <ImmersiveBackground />
      <div className="relative z-10 min-h-full">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
