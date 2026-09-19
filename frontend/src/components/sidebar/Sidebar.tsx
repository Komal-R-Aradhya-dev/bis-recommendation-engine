import { FileText, MessageSquare, Plus, Search, Settings } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHistory } from "@/hooks/useHistory";
import { useAuthStore } from "@/store/authStore";
import { useRecommendationStore } from "@/store/recommendationStore";
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

  const { items, loading, error, refresh } = useHistory();

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  function handleNewAnalysis() {
    setSelectedId(null);
    clearResult();
    setSearch("");
    navigate("/");
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
  }

  function handleSettings() {
    if (onSettings) {
      onSettings();
      return;
    }

    navigate("/settings");
  }

  const initial = user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <aside className="flex h-screen w-84.5 shrink-0 flex-col border-r border-border-light bg-white dark:border-border-dark dark:bg-slate-950">
      {/* Logo / brand */}
      <div className="px-5 pb-4 pt-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-900">
            <img
              src="/bis-logo.png"
              alt="Bureau of Indian Standards"
              className="h-10 w-10 object-contain"
            />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold tracking-wide text-bis-navy dark:text-slate-100">
              BUREAU OF INDIAN STANDARDS
            </p>

            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              भारतीय मानक ब्यूरो
            </p>

            <p className="mt-0.5 text-[9px] leading-3 text-slate-400 dark:text-slate-500">
              Standards Build a Safer, Stronger India
            </p>
          </div>
        </div>
      </div>

      {/* New analysis */}
      <div className="px-4">
        <button
          type="button"
          onClick={handleNewAnalysis}
          className="flex w-full items-center gap-2 rounded-xl bg-bis-blue px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-bis-blue-dark"
        >
          <Plus size={18} />
          New Analysis
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pt-4">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search history"
            className="h-10 w-full rounded-xl border border-border-light bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-bis-blue focus:ring-2 focus:ring-bis-blue/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* History */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-5">
        <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
          Analysis History
        </div>

        {loading ? (
          <div className="px-2 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
            Loading history...
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 p-3 dark:bg-red-950/30">
            <p className="text-xs leading-5 text-red-600 dark:text-red-400">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void refresh()}
              className="mt-2 text-xs font-semibold text-red-700 underline dark:text-red-300"
            >
              Try again
            </button>
          </div>
        ) : groups.length === 0 ? (
          <div className="px-2 py-8 text-center">
            <MessageSquare
              size={22}
              className="mx-auto text-slate-300 dark:text-slate-700"
            />

            <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
              {search.trim()
                ? "No matching analyses found."
                : "No analyses yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {groups.map((group) => (
              <section key={group.label}>
                <h2 className="mb-2 px-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
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
                        className={`group flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                          selected
                            ? "bg-bis-blue-soft dark:bg-blue-950/40"
                            : "hover:bg-slate-50 dark:hover:bg-slate-900"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {item.hasDocument ? (
                            <FileText
                              size={17}
                              className={
                                selected
                                  ? "text-bis-blue dark:text-blue-300"
                                  : "text-slate-400 dark:text-slate-500"
                              }
                            />
                          ) : (
                            <MessageSquare
                              size={17}
                              className={
                                selected
                                  ? "text-bis-blue dark:text-blue-300"
                                  : "text-slate-400 dark:text-slate-500"
                              }
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`truncate text-[13px] font-medium ${
                                selected
                                  ? "text-bis-blue dark:text-blue-300"
                                  : "text-slate-700 dark:text-slate-200"
                              }`}
                            >
                              {item.title}
                            </p>

                            <span className="shrink-0 text-[10px] text-slate-400 dark:text-slate-500">
                              {formatTime(item.createdAt)}
                            </span>
                          </div>

                          <p className="mt-0.5 truncate text-xs text-slate-400 dark:text-slate-500">
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

      {/* Bottom navigation */}
      <div className="border-t border-border-light px-3 py-3 dark:border-border-dark">
        <button
          type="button"
          onClick={handleSettings}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
        >
          <Settings size={18} />
          Settings
        </button>

        <div className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bis-blue-soft text-sm font-semibold text-bis-blue dark:bg-slate-800 dark:text-blue-300">
            {initial}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
              {user?.name ?? "User"}
            </p>

            <p className="truncate text-xs text-slate-400 dark:text-slate-500">
              {user?.email ?? ""}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
