import type { RecommendationResponse } from "@/types/recommendation";

export interface HistoryItem {
  id: string;
  title: string;
  subtitle: string;
  createdAt: string;
  hasDocument: boolean;
  result: RecommendationResponse;
}

export type HistoryGroupLabel =
  | "Today"
  | "Yesterday"
  | "Previous 7 days"
  | "Older";

export interface HistoryGroup {
  label: HistoryGroupLabel;
  items: HistoryItem[];
}
