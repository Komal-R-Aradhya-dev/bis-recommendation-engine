import { api } from "@/services/api";

export async function downloadRecommendationReport(
  historyId: string,
): Promise<Blob> {
  const response = await api.post(
    "/reports",
    { historyId },
    {
      responseType: "blob",
    },
  );

  return response.data;
}
