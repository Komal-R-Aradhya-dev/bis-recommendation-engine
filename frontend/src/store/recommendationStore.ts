import { create } from "zustand";
import type { RecommendationResponse } from "@/types/recommendation";

interface RecommendationState {
  result: RecommendationResponse | null;
  historyId: string | null;

  setResult: (
    result: RecommendationResponse | null,
    historyId?: string | null,
  ) => void;

  clearResult: () => void;
  setHistoryId: (historyId: string | null) => void;
}

export const useRecommendationStore = create<RecommendationState>((set) => ({
  result: null,
  historyId: null,

  setResult: (result, historyId = null) =>
    set({
      result,
      historyId,
    }),

  clearResult: () =>
    set({
      result: null,
      historyId: null,
    }),

  setHistoryId: (historyId) =>
    set({
      historyId,
    }),
}));
