import { FileText, MessageSquare, Plus, Search, Settings, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHistory } from "@/hooks/useHistory";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/store/authStore";
import { useRecommendationStore } from "@/store/recommendationStore";
import { useUIStore } from "@/store/uiStore";
import type {
  HistoryGroup,
  HistoryGroupLabel,
  HistoryItem,
} from "@/types/history";

interface SidebarProps {
  onSettings?: () => void;
}

const groupOrder: HistoryGroupLabel[] = [
  "Today",
  "Yesterday",
  "Previous 7 days",
  "Older",
];

function getGroupLabel(dateString: string): HistoryGroupLabel {
  const date = new Date(dateString);
  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const startOfPrevious7Days = new Date(startOfToday);
  startOfPrevious7Days.setDate(startOfPrevious7Days.getDate() - 7);

  if (date >= startOfToday) {
    return "Today";
  }

  if (date >= startOfYesterday) {
    return "Yesterday";
  }

  if (date >= startOfPrevious7Days) {
    return "Previous 7 days";
  }

  return "Older";
}

function groupHistory(items: HistoryItem[]): HistoryGroup[] {
  const grouped: Record<HistoryGroupLabel, HistoryItem[]> = {
    Today: [],
    Yesterday: [],
    "Previous 7 days": [],
    Older: [],
  };

  for (const item of items) {
    grouped[getGroupLabel(item.createdAt)].push(item);
  }

  return groupOrder
    .filter((label) => grouped[label].length > 0)
    .map((label) => ({
      label,
      items: grouped[label],
    }));
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function Sidebar({ onSettings }: SidebarProps) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setResult = useRecommendationStore((state) => state.setResult);
  const clearResult = useRecommendationStore((state) => state.clearResult);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);
  const historyId = useRecommendationStore((state) => state.historyId);
  const { items, loading, error, refresh } = useHistory();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!historyId) {
      return;
    }

    setSelectedId(historyId);
    void refresh();
  }, [historyId, refresh]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return items;
    }

    return items.filter((item) => {
      return (
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.subtitle.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [items, search]);

  const groups = useMemo(() => groupHistory(filteredItems), [filteredItems]);

  function closeMobileDrawer() {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }

  function handleNewAnalysis() {
    setSelectedId(null);
    clearResult();
    setSearch("");
    navigate("/");
    closeMobileDrawer();
  }

  function handleHistoryClick(item: HistoryItem) {
    setSelectedId(item.id);

    /*
     * Restore the exact saved recommendation response.
     *
     * This does NOT call the recommendation endpoint again.
     * The result and its real MongoDB history ID are restored
     * directly from the history record.
     */
    setResult(item.result, item.id);

    navigate("/");
    closeMobileDrawer();
  }

  function handleSettings() {
    if (onSettings) {
      onSettings();
      return;
    }

    navigate("/settings");
    closeMobileDrawer();
  }

  const initial = user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <>
      <button
        type="button"
        className={cn(
          "fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden",
          sidebarOpen ? "block" : "hidden",
        )}
        onClick={() => setSidebarOpen(false)}
        aria-label="Close navigation"
      />

      <aside
        aria-label="Analysis navigation"
        className={cn(
          "bis-surface fixed inset-y-0 left-0 z-40 flex h-screen w-[min(20.5rem,88vw)] shrink-0 flex-col rounded-none border-y-0 border-l-0 transition-transform duration-300 md:static md:w-80 md:translate-x-0 md:border-r",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex items-start justify-between px-5 pb-4 pt-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-bis-surface-strong">
              <img
                src="/bis-logo.png"
                alt="Bureau of Indian Standards"
                className="h-10 w-10 object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold tracking-[0.12em] text-bis-ink">
                BUREAU OF INDIAN STANDARDS
              </p>
              <p className="mt-0.5 font-deva text-[11px] text-bis-muted">
                भारतीय मानक ब्यूरो
              </p>
              <p className="mt-0.5 text-[9px] leading-3 text-bis-muted">
                Standards Build a Safer, Stronger India
              </p>
            </div>
          </div>
          <button
            type="button"
            className="mt-1 rounded-lg p-1 text-bis-muted md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-4">
          <button
            type="button"
            onClick={handleNewAnalysis}
            className="flex w-full items-center gap-2 rounded-xl bg-bis-accent px-3 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:bg-bis-blue-dark"
          >
            <Plus size={18} />
            New Analysis
          </button>
        </div>

        <div className="px-4 pt-4">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-bis-muted"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search history"
              aria-label="Search history"
              className="h-10 w-full rounded-xl border border-bis-line bg-bis-surface-strong/70 pl-9 pr-3 text-sm text-bis-ink outline-none placeholder:text-bis-muted focus:border-bis-accent"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-5">
          <div className="mb-3 px-2 font-mono text-[11px] tracking-[0.16em] text-bis-muted uppercase">
            Analysis History
          </div>

          {loading ? (
            <div className="px-2 py-6 text-center text-xs text-bis-muted">
              Loading history...
            </div>
          ) : error ? (
            <div className="rounded-xl bg-bis-danger/10 p-3">
              <p className="text-xs leading-5 text-bis-danger">{error}</p>
              <button
                type="button"
                onClick={() => void refresh()}
                className="mt-2 text-xs font-semibold text-bis-danger underline"
              >
                Try again
              </button>
            </div>
          ) : groups.length === 0 ? (
            <div className="px-2 py-8 text-center">
              <MessageSquare size={22} className="mx-auto text-bis-muted/50" />
              <p className="mt-3 text-xs text-bis-muted">
                {search.trim()
                  ? "No matching analyses found."
                  : "No analyses yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {groups.map((group) => (
                <section key={group.label}>
                  <h2 className="mb-2 px-2 font-mono text-[11px] text-bis-muted">
                    {group.label}
                  </h2>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const selected = selectedId === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleHistoryClick(item)}
                          aria-current={selected ? "true" : undefined}
                          className={cn(
                            "group relative flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition",
                            selected
                              ? "bg-bis-accent/10"
                              : "hover:bg-bis-surface-strong",
                          )}
                        >
                          {selected && (
                            <span
                              aria-hidden="true"
                              className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-bis-accent shadow-glow"
                            />
                          )}
                          <div className="mt-0.5 shrink-0">
                            {item.hasDocument ? (
                              <FileText
                                size={17}
                                className={
                                  selected
                                    ? "text-bis-accent"
                                    : "text-bis-muted"
                                }
                              />
                            ) : (
                              <MessageSquare
                                size={17}
                                className={
                                  selected
                                    ? "text-bis-accent"
                                    : "text-bis-muted"
                                }
                              />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p
                                className={cn(
                                  "truncate text-[13px] font-medium",
                                  selected ? "text-bis-accent" : "text-bis-ink",
                                )}
                              >
                                {item.title}
                              </p>
                              <span className="shrink-0 font-mono text-[10px] text-bis-muted">
                                {formatTime(item.createdAt)}
                              </span>
                            </div>
                            <p className="mt-0.5 truncate text-xs text-bis-muted">
                              {item.subtitle}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-bis-line px-3 py-3">
          <button
            type="button"
            onClick={handleSettings}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-bis-ink transition hover:bg-bis-surface-strong"
          >
            <Settings size={18} />
            Settings
          </button>
          <div className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bis-blue-soft text-sm font-semibold text-bis-accent dark:bg-white/10">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-bis-ink">
                {user?.name ?? "User"}
              </p>
              <p className="truncate text-xs text-bis-muted">
                {user?.email ?? ""}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
