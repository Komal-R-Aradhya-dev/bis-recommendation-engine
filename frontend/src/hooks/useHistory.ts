import { useCallback, useEffect, useState } from "react";
import { fetchHistory } from "@/services/history.api";
import { toFriendlyError } from "@/services/api";
import type { HistoryItem } from "@/types/history";

export function useHistory() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchHistory();
      setItems(data);
    } catch (error: unknown) {
      setError(toFriendlyError(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  return {
    items,
    loading,
    error,
    refresh: loadHistory,
  };
}
