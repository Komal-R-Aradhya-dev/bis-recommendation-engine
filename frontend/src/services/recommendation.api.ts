import { api } from "./api";
import type {
  RecommendationApiResponse,
  RecommendationResponse,
} from "@/types/recommendation";

export interface SubmitRecommendationParams {
  query?: string;
  document?: File | null;
  signal?: AbortSignal;
}

export type SubmittedRecommendationResponse = RecommendationResponse & {
  historyId: string;
};

type RecommendationApiResponseWithHistory = Omit<
  RecommendationApiResponse,
  "data"
> & {
  data: SubmittedRecommendationResponse;
};

export async function submitRecommendation(
  params: SubmitRecommendationParams,
): Promise<SubmittedRecommendationResponse> {
  const query = params.query?.trim() ?? "";
  const document = params.document ?? null;

  // Text-only request
  if (!document) {
    const { data } = await api.post<RecommendationApiResponseWithHistory>(
      "/recommendations",
      {
        query,
        limit: 5,
      },
      {
        signal: params.signal,
      },
    );

    return data.data;
  }

  // PDF/DOCX request
  const formData = new FormData();

  if (query) {
    formData.append("query", query);
  }

  formData.append("document", document);
  formData.append("limit", "5");

  const { data } = await api.post<RecommendationApiResponseWithHistory>(
    "/recommendations",
    formData,
    {
      signal: params.signal,
    },
  );

  return data.data;
}
