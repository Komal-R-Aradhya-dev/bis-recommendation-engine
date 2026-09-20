import { ArrowLeft, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { useSceneMode } from "@/lib/useSceneMode";
import { clearToken } from "@/services/api";
import { useAuthStore } from "@/store/authStore";

export default function Settings() {
  useSceneMode("settings");
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);

  function handleLogout() {
    clearToken();
    clearUser();
    navigate("/login", { replace: true });
  }

  return (
    <div className="relative z-10 min-h-screen overflow-x-hidden text-bis-ink">
      <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex h-10 w-10 items-center justify-center rounded-xl bis-chrome text-bis-ink"
            title="Back to dashboard"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="bis-kicker">Account</p>
            <h1 className="bis-display mt-1 text-3xl">Settings</h1>
            <p className="mt-1 text-sm text-bis-muted">
              Identity, appearance, and session controls.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5">
          <section className="bis-surface rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bis-blue-soft text-bis-accent">
                <User size={20} />
              </div>
              <div>
                <p className="font-mono text-[11px] tracking-[0.14em] text-bis-muted uppercase">
                  01 · Identity
                </p>
                <h2 className="mt-1 font-semibold text-bis-ink">Signed-in account</h2>
                <p className="text-sm text-bis-muted">
                  Your authenticated account information.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="font-mono text-[11px] tracking-[0.14em] text-bis-muted uppercase">
                  Name
                </p>
                <p className="mt-1 text-sm font-medium text-bis-ink">
                  {user?.name ?? "—"}
                </p>
              </div>
              <div>
                <p className="font-mono text-[11px] tracking-[0.14em] text-bis-muted uppercase">
                  Email
                </p>
                <p className="mt-1 text-sm font-medium text-bis-ink">
                  {user?.email ?? "—"}
                </p>
              </div>
              <div>
                <p className="font-mono text-[11px] tracking-[0.14em] text-bis-muted uppercase">
                  Role
                </p>
                <p className="mt-1 text-sm font-medium text-bis-ink">
                  {user?.role ?? "—"}
                </p>
              </div>
            </div>
          </section>

          <section className="bis-surface rounded-2xl p-5">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <p className="font-mono text-[11px] tracking-[0.14em] text-bis-muted uppercase">
                  02 · Appearance
                </p>
                <h2 className="mt-1 font-semibold text-bis-ink">Theme</h2>
                <p className="text-sm text-bis-muted">
                  Light is the default. Dark remains quiet and atmospheric.
                </p>
              </div>
              <ThemeToggle className="ml-auto" />
            </div>
          </section>

          <section className="bis-surface rounded-2xl p-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bis-danger/10 text-bis-danger">
                <LogOut size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[11px] tracking-[0.14em] text-bis-muted uppercase">
                  03 · Session
                </p>
                <h2 className="mt-1 font-semibold text-bis-ink">Sign out</h2>
                <p className="text-sm text-bis-muted">
                  End this session on this device.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-bis-danger px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Sign out
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
