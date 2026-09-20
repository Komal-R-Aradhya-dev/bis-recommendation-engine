import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { cn } from "@/lib/cn";

interface ThemeToggleProps {
  className?: string;
  compact?: boolean;
}

export default function ThemeToggle({ className, compact = false }: ThemeToggleProps) {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDark = theme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={label}
        title={label}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full text-bis-ink transition hover:bg-bis-surface-strong",
          className,
        )}
      >
        {isDark ? <Sun size={17} strokeWidth={1.7} /> : <Moon size={17} strokeWidth={1.7} />}
      </button>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Sun
        size={18}
        strokeWidth={1.7}
        className={isDark ? "text-bis-muted" : "text-bis-accent"}
      />
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={label}
        title={label}
        className={cn(
          "relative h-8 w-14 rounded-full transition",
          isDark ? "bg-white/10" : "bg-bis-blue-soft",
        )}
      >
        <span
          className={cn(
            "absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform",
            isDark && "translate-x-6",
          )}
        />
      </button>
      <Moon
        size={17}
        strokeWidth={1.7}
        className={isDark ? "text-bis-accent" : "text-bis-muted"}
      />
    </div>
  );
}
