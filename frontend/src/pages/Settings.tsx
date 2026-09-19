import { ArrowLeft, LogOut, Moon, Sun, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { clearToken } from "@/services/api";

export default function Settings() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);

  function handleLogout() {
    clearToken();
    clearUser();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            title="Back to dashboard"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-2xl font-semibold text-bis-navy dark:text-slate-100">
              Settings
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your account and application preferences.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-bis-blue dark:bg-blue-950/40 dark:text-blue-300">
                <User size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                  Account
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Your authenticated account information.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Name
                </p>
                <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                  {user?.name ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email
                </p>
                <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                  {user?.email ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Role
                </p>
                <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                  {user?.role ?? "—"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-bis-blue dark:bg-blue-950/40 dark:text-blue-300">
                <Sun size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                  Appearance
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Use the theme control in the top bar to switch between light
                  and dark mode.
                </p>
              </div>

              <Moon size={18} className="ml-auto text-slate-400" />
            </div>
          </section>

          <section className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm dark:border-red-900/50 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                <LogOut size={20} />
              </div>

              <div className="flex-1">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                  Sign out
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Sign out of the BIS Procurement Assistant.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
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
