import { ChevronDown, LogOut, Moon, Sun, UserCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { clearToken } from "@/services/api";
import { useThemeStore } from "@/store/themeStore";

export default function TopBar() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const [menuOpen, setMenuOpen] = useState(false);

  const initial = user?.name?.charAt(0).toUpperCase() ?? "U";

  function handleLogout() {
    clearToken();
    clearUser();
    setMenuOpen(false);
    navigate("/login", { replace: true });
  }

  return (
    <header className="flex h-20 shrink-0 items-center justify-end px-8">
      <div className="relative flex items-center gap-4">
        {/* Light mode icon */}
        <Sun
          size={21}
          strokeWidth={1.7}
          className={theme === "light" ? "text-bis-blue" : "text-slate-400"}
        />

        {/* Theme switch */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            theme === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
          title={
            theme === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
          className={`relative h-8 w-14 rounded-full transition ${
            theme === "dark" ? "bg-slate-700" : "bg-blue-100 hover:bg-blue-200"
          }`}
        >
          <span
            className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-all ${
              theme === "dark" ? "left-1" : "right-1"
            }`}
          />
        </button>

        {/* Dark mode icon */}
        <Moon
          size={20}
          strokeWidth={1.7}
          className={theme === "dark" ? "text-blue-300" : "text-slate-600"}
        />

        {/* User menu */}
        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          className="flex items-center gap-2 rounded-full p-1 transition hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bis-blue-soft text-base font-semibold text-bis-blue dark:bg-slate-700 dark:text-blue-300">
            {initial}
          </span>

          <ChevronDown
            size={16}
            className={`text-slate-500 transition-transform dark:text-slate-400 ${
              menuOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-14 z-50 w-72 overflow-hidden rounded-2xl border border-border-light bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
          >
            {/* User information */}
            <div className="border-b border-slate-100 px-4 py-4 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bis-blue-soft text-base font-semibold text-bis-blue dark:bg-slate-700 dark:text-blue-300">
                  {initial}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-bis-navy dark:text-slate-100">
                    {user?.name ?? "User"}
                  </p>

                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {user?.email ?? ""}
                  </p>
                </div>
              </div>

              {user?.role && (
                <div className="mt-3">
                  <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {user.role}
                  </span>
                </div>
              )}
            </div>

            {/* Account actions */}
            <div className="p-2">
              <button
                type="button"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-600 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <UserCircle size={18} />
                Account
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                <LogOut size={18} />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
