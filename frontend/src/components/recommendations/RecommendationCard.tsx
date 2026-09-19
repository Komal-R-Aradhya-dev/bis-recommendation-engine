import type { ReactNode } from "react";
import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ClipboardList,
  FileSearch,
  FlaskConical,
  Link2,
  ShieldCheck,
} from "lucide-react";
import type { Recommendation } from "@/types/recommendation";

interface RecommendationCardProps {
  recommendation: Recommendation;
}

interface SectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

function Section({ title, icon, children, defaultOpen = false }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-slate-100 pt-4 dark:border-slate-700">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-bis-navy dark:text-slate-100">
          {icon}
          {title}
        </span>

        <ChevronDown
          size={17}
          className={`shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasItems<T>(items: unknown): items is T[] {
  return Array.isArray(items) && items.length > 0;
}

function BooleanValue({ value }: { value: unknown }) {
  if (typeof value !== "boolean") {
    return null;
  }

  return (
    <span
      className={
        value
          ? "font-semibold text-emerald-600 dark:text-emerald-400"
          : "font-semibold text-slate-600 dark:text-slate-300"
      }
    >
      {value ? "Yes" : "No"}
    </span>
  );
}

function SummaryItem({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <div className="mt-1 text-sm font-semibold leading-5 text-bis-navy dark:text-slate-100">
        {children}
      </div>
    </div>
  );
}

export default function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  /*
   * History records created earlier may not contain all nested
   * recommendation objects. Default missing sections to empty objects
   * so the UI never crashes.
   */
  const relevance = recommendation?.relevance ?? {};
  const version = recommendation?.version ?? {};
  const certification = recommendation?.certification ?? {};
  const testing = recommendation?.testing ?? {};
  const procurement = recommendation?.procurement ?? {};

  const latestAmendment = version.latestAmendment ?? null;

  const relatedStandards = Array.isArray(recommendation?.relatedStandards)
    ? recommendation.relatedStandards
    : [];

  const evidence = Array.isArray(recommendation?.evidence)
    ? recommendation.evidence
    : [];

  const testMethods = Array.isArray(testing.testMethods)
    ? testing.testMethods
    : [];

  const relatedTestStandards = Array.isArray(testing.relatedTestStandards)
    ? testing.relatedTestStandards
    : [];

  const inspectionRequirements = Array.isArray(testing.inspectionRequirements)
    ? testing.inspectionRequirements
    : [];

  const recommendedFor = Array.isArray(procurement.recommendedFor)
    ? procurement.recommendedFor
    : [];

  const specificationPoints = Array.isArray(procurement.specificationPoints)
    ? procurement.specificationPoints
    : [];

  const buyerConsiderations = Array.isArray(procurement.buyerConsiderations)
    ? procurement.buyerConsiderations
    : [];

  const reason = recommendation?.reason;

  const hasCertificationDetails =
    hasText(certification.scheme) ||
    typeof certification.mandatory === "boolean" ||
    typeof certification.crsApplicable === "boolean" ||
    typeof certification.hallmarkingApplicable === "boolean" ||
    hasText(certification.qualityControlOrder) ||
    hasText(certification.note);

  const hasTestingDetails =
    hasItems<string>(testMethods) ||
    hasItems<string>(relatedTestStandards) ||
    hasItems<string>(inspectionRequirements);

  const hasRelatedStandards = relatedStandards.length > 0;

  const hasProcurementDetails =
    hasItems<string>(recommendedFor) ||
    hasItems<string>(specificationPoints) ||
    hasItems<string>(buyerConsiderations);

  const hasEvidence = evidence.length > 0;

  return (
    <article className="overflow-hidden rounded-2xl border border-border-light bg-white shadow-card dark:border-slate-700 dark:bg-slate-950">
      {/* =====================================================
          IMPORTANT INFORMATION — ALWAYS VISIBLE
         ===================================================== */}
      <div className="p-6">
        {/* Standard number + title */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {hasText(recommendation?.standardNumber) && (
              <p className="text-sm font-bold text-bis-blue">
                {recommendation.standardNumber}
              </p>
            )}

            {hasText(recommendation?.title) && (
              <h2 className="mt-1 text-xl font-bold leading-7 text-bis-navy dark:text-slate-100">
                {recommendation.title}
              </h2>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            {hasText(recommendation?.applicability) && (
              <span className="rounded-full bg-bis-blue-soft px-3 py-1 text-xs font-semibold text-bis-blue dark:bg-blue-950/50 dark:text-blue-300">
                {recommendation.applicability}
              </span>
            )}

            {hasText(relevance.level) && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {relevance.level}
              </span>
            )}
          </div>
        </div>

        {/* Why recommended */}
        {hasText(reason) && (
          <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Why this standard is recommended
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
              {reason}
            </p>
          </div>
        )}

        {/* Version */}
        {(hasText(version.edition) ||
          typeof version.year === "number" ||
          hasText(version.status)) && (
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {hasText(version.edition) && (
              <SummaryItem label="Edition">{version.edition}</SummaryItem>
            )}

            {typeof version.year === "number" && (
              <SummaryItem label="Year">{version.year}</SummaryItem>
            )}

            {hasText(version.status) && (
              <SummaryItem label="Current status">{version.status}</SummaryItem>
            )}
          </div>
        )}

        {/* Latest amendment */}
        {latestAmendment &&
          (hasText(latestAmendment.amendmentNumber) ||
            hasText(latestAmendment.date) ||
            hasText(latestAmendment.title)) && (
            <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/60 dark:bg-blue-950/30">
              <p className="text-xs font-semibold uppercase tracking-wide text-bis-blue">
                Latest amendment
              </p>

              {hasText(latestAmendment.amendmentNumber) && (
                <p className="mt-1 text-sm font-semibold text-bis-navy dark:text-slate-100">
                  Amendment {latestAmendment.amendmentNumber}
                </p>
              )}

              {(hasText(latestAmendment.date) ||
                hasText(latestAmendment.title)) && (
                <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
                  {hasText(latestAmendment.date) ? latestAmendment.date : ""}
                  {hasText(latestAmendment.date) &&
                  hasText(latestAmendment.title)
                    ? " · "
                    : ""}
                  {hasText(latestAmendment.title) ? latestAmendment.title : ""}
                </p>
              )}
            </div>
          )}

        {/* Certification summary */}
        {(hasText(certification.status) ||
          typeof certification.mandatory === "boolean" ||
          typeof certification.crsApplicable === "boolean" ||
          typeof certification.hallmarkingApplicable === "boolean") && (
          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Certification & compliance
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {hasText(certification.status) && (
                <SummaryItem label="Status">{certification.status}</SummaryItem>
              )}

              {typeof certification.mandatory === "boolean" && (
                <SummaryItem label="Mandatory">
                  <BooleanValue value={certification.mandatory} />
                </SummaryItem>
              )}

              {typeof certification.crsApplicable === "boolean" && (
                <SummaryItem label="CRS">
                  <BooleanValue value={certification.crsApplicable} />
                </SummaryItem>
              )}

              {typeof certification.hallmarkingApplicable === "boolean" && (
                <SummaryItem label="Hallmarking">
                  <BooleanValue value={certification.hallmarkingApplicable} />
                </SummaryItem>
              )}
            </div>
          </div>
        )}

        {/* Testing summary */}
        {typeof testing.required === "boolean" && (
          <div className="mt-5">
            <SummaryItem label="Testing required">
              <BooleanValue value={testing.required} />
            </SummaryItem>
          </div>
        )}

        {/* Procurement summary */}
        {(typeof procurement.applicable === "boolean" ||
          recommendedFor.length > 0) && (
          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Procurement
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {typeof procurement.applicable === "boolean" && (
                <SummaryItem label="Applicable to procurement">
                  <BooleanValue value={procurement.applicable} />
                </SummaryItem>
              )}

              {recommendedFor.length > 0 && (
                <SummaryItem label="Recommended for">
                  <div className="flex flex-wrap gap-2">
                    {recommendedFor.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-bis-blue-soft px-2.5 py-1 text-xs font-medium text-bis-blue dark:bg-blue-950/50 dark:text-blue-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </SummaryItem>
              )}
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          SECONDARY DETAILS
         ===================================================== */}
      <div className="space-y-4 px-6 pb-6">
        {hasCertificationDetails && (
          <Section
            title="Certification & compliance details"
            icon={<ShieldCheck size={17} className="text-bis-blue" />}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {hasText(certification.scheme) && (
                <SummaryItem label="Scheme">{certification.scheme}</SummaryItem>
              )}

              {typeof certification.mandatory === "boolean" && (
                <SummaryItem label="Mandatory">
                  <BooleanValue value={certification.mandatory} />
                </SummaryItem>
              )}

              {typeof certification.crsApplicable === "boolean" && (
                <SummaryItem label="CRS">
                  <BooleanValue value={certification.crsApplicable} />
                </SummaryItem>
              )}

              {typeof certification.hallmarkingApplicable === "boolean" && (
                <SummaryItem label="Hallmarking">
                  <BooleanValue value={certification.hallmarkingApplicable} />
                </SummaryItem>
              )}
            </div>

            {hasText(certification.qualityControlOrder) && (
              <div className="mt-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Quality Control Order
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                  {certification.qualityControlOrder}
                </p>
              </div>
            )}

            {hasText(certification.note) && (
              <div className="mt-3 rounded-xl border border-slate-100 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Compliance note
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {certification.note}
                </p>
              </div>
            )}
          </Section>
        )}

        {hasTestingDetails && (
          <Section
            title="Testing & inspection details"
            icon={<FlaskConical size={17} className="text-bis-blue" />}
          >
            {testMethods.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Test methods
                </p>

                <ul className="mt-2 space-y-2">
                  {testMethods.map((method, index) => (
                    <li
                      key={`${method}-${index}`}
                      className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700 dark:bg-slate-900 dark:text-slate-300"
                    >
                      {method}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {relatedTestStandards.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Related test standards
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {relatedTestStandards.map((standard) => (
                    <span
                      key={standard}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300"
                    >
                      {standard}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {inspectionRequirements.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Inspection requirements
                </p>

                <ul className="mt-2 space-y-2">
                  {inspectionRequirements.map((item, index) => (
                    <li
                      key={`${item}-${index}`}
                      className="text-sm leading-6 text-slate-700 dark:text-slate-300"
                    >
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Section>
        )}

        {hasRelatedStandards && (
          <Section
            title="Related standards"
            icon={<Link2 size={17} className="text-bis-blue" />}
          >
            <div className="space-y-3">
              {relatedStandards.map((standard, index) => (
                <div
                  key={`${standard.standardNumber}-${index}`}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {hasText(standard.standardNumber) && (
                      <span className="text-sm font-bold text-bis-blue">
                        {standard.standardNumber}
                      </span>
                    )}

                    {hasText(standard.relationship) && (
                      <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {standard.relationship}
                      </span>
                    )}
                  </div>

                  {hasText(standard.title) && (
                    <p className="mt-1 text-sm font-semibold text-bis-navy dark:text-slate-100">
                      {standard.title}
                    </p>
                  )}

                  {hasText(standard.reason) && (
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {standard.reason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {hasProcurementDetails && (
          <Section
            title="Procurement details"
            icon={<ClipboardList size={17} className="text-bis-blue" />}
          >
            {recommendedFor.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Recommended for
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {recommendedFor.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-bis-blue-soft px-3 py-1.5 text-xs font-medium text-bis-blue dark:bg-blue-950/50 dark:text-blue-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {specificationPoints.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Specification points
                </p>

                <ul className="mt-2 space-y-2">
                  {specificationPoints.map((point, index) => (
                    <li
                      key={`${point}-${index}`}
                      className="text-sm leading-6 text-slate-700 dark:text-slate-300"
                    >
                      • {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {buyerConsiderations.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Buyer considerations
                </p>

                <ul className="mt-2 space-y-2">
                  {buyerConsiderations.map((item, index) => (
                    <li
                      key={`${item}-${index}`}
                      className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-sm leading-6 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Section>
        )}

        {hasEvidence && (
          <Section
            title="Evidence & sources"
            icon={<FileSearch size={17} className="text-bis-blue" />}
          >
            <div className="space-y-3">
              {evidence.map((item, index) => (
                <div
                  key={`${item.standardNumber}-${item.chunkIndex}-${index}`}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {hasText(item.source) && (
                      <span className="text-xs font-bold text-bis-blue">
                        {item.source}
                      </span>
                    )}

                    {hasText(item.standardNumber) && (
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {item.standardNumber}
                      </span>
                    )}

                    {item.page !== null && item.page !== undefined && (
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        Page {item.page}
                      </span>
                    )}

                    {item.chunkIndex !== null &&
                      item.chunkIndex !== undefined && (
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          Chunk {item.chunkIndex}
                        </span>
                      )}
                  </div>

                  {hasText(item.excerpt) && (
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {item.excerpt}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {hasText(reason) && (
          <Section
            title="Standard scope"
            icon={<BookOpen size={17} className="text-bis-blue" />}
          >
            <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
              {reason}
            </p>
          </Section>
        )}
      </div>
    </article>
  );
}
