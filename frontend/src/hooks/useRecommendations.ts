import { useCallback, useRef, useState } from "react";
import { submitRecommendation } from "@/services/recommendation.api";
import type { SubmittedRecommendationResponse } from "@/services/recommendation.api";
import { toFriendlyError } from "@/services/api";
import { useRecommendationStore } from "@/store/recommendationStore";

interface GenerateParams {
  query?: string;
  document?: File | null;
}

export function useRecommendations() {
  const result = useRecommendationStore((state) => state.result);
  const setResult = useRecommendationStore((state) => state.setResult);
  const clearResult = useRecommendationStore((state) => state.clearResult);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);

  const generate = useCallback(
    async ({
      query,
      document,
    }: GenerateParams): Promise<SubmittedRecommendationResponse> => {
      if (loading) {
        throw new Error("An analysis is already running.");
      }

      const hasQuery = Boolean(query?.trim());
      const hasDocument = Boolean(document);

      if (!hasQuery && !hasDocument) {
        const message = "Please provide a query or upload a tender document.";

        setError(message);
        throw new Error(message);
      }

      const controller = new AbortController();
      controllerRef.current = controller;

      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const response = await submitRecommendation({
          query: hasQuery ? query?.trim() : undefined,
          document: document ?? null,
          signal: controller.signal,
        });

        // Store both the result and the real MongoDB history ID.
        setResult(response, response.historyId);

        return response;
      } catch (error: unknown) {
        const message = toFriendlyError(error);

        if (message !== "Generation stopped.") {
          setError(message);
        }

        throw error;
      } finally {
        if (controllerRef.current === controller) {
          controllerRef.current = null;
        }

        setLoading(false);
      }
    },
    [loading, setResult],
  );

  const stop = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  const clear = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setLoading(false);
    setError(null);
    clearResult();
  }, [clearResult]);

  return {
    result,
    loading,
    error,
    generate,
    stop,
    clear,
  };
}
