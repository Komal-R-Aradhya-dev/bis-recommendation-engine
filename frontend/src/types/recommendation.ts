export interface Amendment {
  amendmentNumber: string;
  date: string;
  title: string;
}

export interface Relevance {
  level: string;
}

export interface Certification {
  status: string | null;
  scheme: string | null;
  mandatory: boolean | null;
  crsApplicable: boolean;
  hallmarkingApplicable: boolean;
  qualityControlOrder: string | null;
  note: string | null;
}

export interface Testing {
  required: boolean | null;
  testMethods: string[];
  relatedTestStandards: string[];
  inspectionRequirements: string[];
}

export interface RelatedStandard {
  standardNumber: string;
  relationship: string;
  title: string | null;
  reason: string;
}

export interface Procurement {
  applicable: boolean;
  recommendedFor: string[];
  specificationPoints: string[];
  buyerConsiderations: string[];
}

export interface Evidence {
  source: string;
  standardNumber: string;
  page: number | null;
  chunkIndex: number;
  excerpt: string;
}

export interface Version {
  edition: string;
  year: number;
  status: string;
  latestAmendment: Amendment | null;
}

export interface Recommendation {
  standardNumber: string;
  title: string;
  applicability: string;
  relevance: Relevance;
  reason: string;
  version: Version;
  certification: Certification;
  testing: Testing;
  relatedStandards: RelatedStandard[];
  procurement: Procurement;
  evidence: Evidence[];
}

export interface TenderRequirements {
  product: string;
  materials: string[];
  dimensions: string[];
  grades: string[];
  performanceRequirements: string[];
  testingRequirements: string[];
  certificationRequirements: string[];
  uses: string[];
}

export interface RecommendationResponse {
  query: string;
  summary: string;
  recommendations: Recommendation[];
  warnings: string[];
  tenderRequirements?: TenderRequirements;
}

export interface RecommendationApiResponse {
  success: boolean;
  message: string;
  data: RecommendationResponse;
}
