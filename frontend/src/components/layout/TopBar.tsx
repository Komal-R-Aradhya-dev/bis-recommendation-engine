import { ChevronDown, LogOut, Menu, UserCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/cn";
import { clearToken } from "@/services/api";
import { useAuthStore } from "@/store/authStore";

interface TopBarProps {
  onMenuToggle?: () => void;
}

export default function TopBar({ onMenuToggle }: TopBarProps) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initial = user?.name?.charAt(0).toUpperCase() ?? "U";

  function handleLogout() {
    clearToken();
    clearUser();
    setMenuOpen(false);
    navigate("/login", { replace: true });
  }

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="sticky top-3 z-20 mx-3 shrink-0 sm:mx-5 lg:mx-6">
      <div className="bis-chrome flex h-14 items-center justify-between gap-3 rounded-2xl px-2.5 sm:h-16 sm:px-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-bis-ink md:hidden"
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>

        <p className="hidden min-w-0 truncate font-mono text-[11px] tracking-[0.14em] text-bis-muted uppercase md:block">
          Indian Standards Intelligence
        </p>

        <div className="relative ml-auto flex items-center gap-1.5" ref={menuRef}>
          <ThemeToggle compact />

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="flex items-center gap-2 rounded-full p-1 transition hover:bg-bis-surface-strong"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bis-blue-soft text-sm font-semibold text-bis-accent">
              {initial}
            </span>
            <ChevronDown
              size={16}
              className={cn(
                "mr-1 hidden text-bis-muted transition-transform sm:block",
                menuOpen && "rotate-180",
              )}
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="bis-surface absolute right-0 top-14 z-50 w-72 overflow-hidden rounded-2xl"
            >
              <div className="border-b border-bis-line px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bis-blue-soft text-base font-semibold text-bis-accent">
                    {initial}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-bis-ink">
                      {user?.name ?? "User"}
                    </p>
                    <p className="truncate text-xs text-bis-muted">
                      {user?.email ?? ""}
                    </p>
                  </div>
                </div>
                {user?.role && (
                  <div className="mt-3">
                    <span className="inline-flex rounded-full bg-bis-blue-soft px-2.5 py-1 font-mono text-[11px] text-bis-ink">
                      {user.role}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-2">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/settings");
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-bis-ink transition hover:bg-bis-surface-strong"
                >
                  <UserCircle size={18} />
                  Account
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-bis-danger transition hover:bg-bis-danger/10"
                >
                  <LogOut size={18} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
