// src/types/chat.ts
// This is a UI-only shape for a single standalone analysis (NOT a conversation thread).
// Per spec: no conversationId, no follow-up Q&A, no message chaining.

import type { RecommendationResponse } from "./recommendation";

export type AnalysisStatus =
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "stopped";

export interface AnalysisInput {
  query: string;
  file: File | null;
}

export interface Analysis {
  id: string; // client-generated id for this standalone submission
  input: {
    query: string;
    fileName: string | null;
    fileSize: number | null;
  };
  status: AnalysisStatus;
  result: RecommendationResponse | null;
  errorMessage: string | null;
  createdAt: string; // ISO timestamp
}
