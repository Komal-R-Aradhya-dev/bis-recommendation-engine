import { api } from "./api";
import type { RecommendationResponse } from "@/types/recommendation";
import type { HistoryItem } from "@/types/history";

interface HistoryApiItem {
  _id: string;
  user: string;
  query: string;
  language: string;
  hasDocument?: boolean;
  ragResponse: unknown;
  createdAt: string;
  updatedAt: string;
}

interface HistoryResponse {
  success: boolean;
  data: HistoryApiItem[];
}

interface DeleteHistoryResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseRawResponse(value: unknown): unknown {
  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function asNumberOrNull(value: unknown): number | null {
  return typeof value === "number" ? value : null;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function unwrapRagResponse(value: unknown): Record<string, unknown> {
  const parsed = parseRawResponse(value);

  if (!isRecord(parsed)) {
    return {};
  }

  if (isRecord(parsed.data)) {
    const inner = parsed.data;

    if ("recommendations" in inner || "summary" in inner || "query" in inner) {
      return inner;
    }
  }

  return parsed;
}

function normalizeRecommendation(
  value: unknown,
): RecommendationResponse["recommendations"][number] {
  const recommendation = isRecord(value) ? value : {};

  const relevance = isRecord(recommendation.relevance)
    ? recommendation.relevance
    : {};

  const version = isRecord(recommendation.version)
    ? recommendation.version
    : {};

  const certification = isRecord(recommendation.certification)
    ? recommendation.certification
    : {};

  const testing = isRecord(recommendation.testing)
    ? recommendation.testing
    : {};

  const procurement = isRecord(recommendation.procurement)
    ? recommendation.procurement
    : {};

  const latestAmendment = isRecord(version.latestAmendment)
    ? version.latestAmendment
    : null;

  const relatedStandards = Array.isArray(recommendation.relatedStandards)
    ? recommendation.relatedStandards
    : [];

  const evidence = Array.isArray(recommendation.evidence)
    ? recommendation.evidence
    : [];

  return {
    standardNumber: asString(recommendation.standardNumber),

    title: asString(recommendation.title),

    applicability: asString(recommendation.applicability),

    relevance: {
      level: asString(relevance.level),
    },

    reason: asString(recommendation.reason),

    version: {
      edition: asString(version.edition),

      year: typeof version.year === "number" ? version.year : 0,

      status: asString(version.status),

      latestAmendment: latestAmendment
        ? {
            amendmentNumber: asString(latestAmendment.amendmentNumber),
            date: asString(latestAmendment.date),
            title: asString(latestAmendment.title),
          }
        : null,
    },

    certification: {
      status: asNullableString(certification.status),

      scheme: asNullableString(certification.scheme),

      mandatory: asBoolean(certification.mandatory),

      crsApplicable:
        typeof certification.crsApplicable === "boolean"
          ? certification.crsApplicable
          : false,

      hallmarkingApplicable:
        typeof certification.hallmarkingApplicable === "boolean"
          ? certification.hallmarkingApplicable
          : false,

      qualityControlOrder: asNullableString(certification.qualityControlOrder),

      note: asNullableString(certification.note),
    },

    testing: {
      required: asBoolean(testing.required),

      testMethods: asStringArray(testing.testMethods),

      relatedTestStandards: asStringArray(testing.relatedTestStandards),

      inspectionRequirements: asStringArray(testing.inspectionRequirements),
    },

    relatedStandards: relatedStandards.map((standard) => {
      const item = isRecord(standard) ? standard : {};

      return {
        standardNumber: asString(item.standardNumber),

        relationship: asString(item.relationship),

        title: asNullableString(item.title),

        reason: asString(item.reason),
      };
    }),

    procurement: {
      applicable:
        typeof procurement.applicable === "boolean"
          ? procurement.applicable
          : false,

      recommendedFor: asStringArray(procurement.recommendedFor),

      specificationPoints: asStringArray(procurement.specificationPoints),

      buyerConsiderations: asStringArray(procurement.buyerConsiderations),
    },

    evidence: evidence.map((item) => {
      const evidenceItem = isRecord(item) ? item : {};

      return {
        source: asString(evidenceItem.source),

        standardNumber: asString(evidenceItem.standardNumber),

        page: asNumberOrNull(evidenceItem.page),

        chunkIndex:
          typeof evidenceItem.chunkIndex === "number"
            ? evidenceItem.chunkIndex
            : 0,

        excerpt: asString(evidenceItem.excerpt),
      };
    }),
  };
}

function normalizeTenderRequirements(
  value: unknown,
): RecommendationResponse["tenderRequirements"] {
  if (!isRecord(value)) {
    return undefined;
  }

  const product = asString(value.product);
  const materials = asStringArray(value.materials);
  const dimensions = asStringArray(value.dimensions);
  const grades = asStringArray(value.grades);
  const performanceRequirements = asStringArray(value.performanceRequirements);
  const testingRequirements = asStringArray(value.testingRequirements);
  const certificationRequirements = asStringArray(
    value.certificationRequirements,
  );
  const uses = asStringArray(value.uses);

  const hasAnyData =
    product.trim().length > 0 ||
    materials.length > 0 ||
    dimensions.length > 0 ||
    grades.length > 0 ||
    performanceRequirements.length > 0 ||
    testingRequirements.length > 0 ||
    certificationRequirements.length > 0 ||
    uses.length > 0;

  if (!hasAnyData) {
    return undefined;
  }

  return {
    product,
    materials,
    dimensions,
    grades,
    performanceRequirements,
    testingRequirements,
    certificationRequirements,
    uses,
  };
}

function normalizeResult(value: unknown): RecommendationResponse {
  const raw = unwrapRagResponse(value);

  const rawRecommendations = Array.isArray(raw.recommendations)
    ? raw.recommendations
    : [];

  const tenderRequirements = normalizeTenderRequirements(
    raw.tenderRequirements,
  );

  return {
    query: asString(raw.query),

    summary: asString(raw.summary),

    recommendations: rawRecommendations.map(normalizeRecommendation),

    warnings: asStringArray(raw.warnings),

    ...(tenderRequirements ? { tenderRequirements } : {}),
  };
}

export async function fetchHistory(): Promise<HistoryItem[]> {
  const { data } = await api.get<HistoryResponse>("/recommendations/history");

  return data.data.map((item) => ({
    id: item._id,
    title: item.query || "Untitled analysis",
    subtitle: item.hasDocument
      ? "Tender document analyzed"
      : "Standards recommendation",
    createdAt: item.createdAt,
    hasDocument: Boolean(item.hasDocument),
    result: normalizeResult(item.ragResponse),
  }));
}

export async function deleteHistory(historyId: string): Promise<void> {
  await api.delete<DeleteHistoryResponse>(
    `/recommendations/history/${historyId}`,
  );
}
