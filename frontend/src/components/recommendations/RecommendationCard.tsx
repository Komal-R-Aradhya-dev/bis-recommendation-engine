import type { ReactNode } from "react";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  ChevronDown,
  ClipboardList,
  FileSearch,
  FlaskConical,
  Link2,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { Recommendation } from "@/types/recommendation";

interface RecommendationCardProps {
  recommendation: Recommendation;
  index?: number;
}

interface SectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

function Section({ title, icon, children, defaultOpen = false }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const reduced = useReducedMotion();

  return (
    <div className="border-t border-bis-line pt-4">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-bis-ink">
          {icon}
          {title}
        </span>
        <ChevronDown
          size={17}
          className={cn(
            "shrink-0 text-bis-muted transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
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
        value ? "font-semibold text-bis-success" : "font-semibold text-bis-muted"
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
    <div className="rounded-xl border border-bis-line bg-bis-surface-strong/60 p-4">
      <p className="font-mono text-[11px] tracking-[0.14em] text-bis-muted uppercase">
        {label}
      </p>
      <div className="mt-1 text-sm font-semibold leading-5 text-bis-ink">
        {children}
      </div>
    </div>
  );
}

export default function RecommendationCard({
  recommendation,
  index,
}: RecommendationCardProps) {
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
  const ordinal =
    typeof index === "number" ? String(index + 1).padStart(2, "0") : null;

  return (
    <article className="bis-surface overflow-hidden rounded-2xl">
      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              {ordinal && (
                <span className="font-mono text-xs tracking-[0.16em] text-bis-muted">
                  {ordinal}
                </span>
              )}
              {hasText(recommendation?.standardNumber) && (
                <p className="font-mono text-sm font-bold text-bis-accent">
                  {recommendation.standardNumber}
                </p>
              )}
            </div>
            {hasText(recommendation?.title) && (
              <h2 className="mt-2 font-serif text-2xl leading-8 text-bis-ink">
                {recommendation.title}
              </h2>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            {hasText(recommendation?.applicability) && (
              <span className="rounded-full bg-bis-blue-soft px-3 py-1 text-xs font-semibold text-bis-accent dark:bg-white/10">
                {recommendation.applicability}
              </span>
            )}
            {hasText(relevance.level) && (
              <span className="rounded-full border border-bis-line px-3 py-1 text-xs font-semibold text-bis-ink">
                {relevance.level}
              </span>
            )}
          </div>
        </div>

        {hasText(reason) && (
          <div className="mt-5 rounded-xl bg-bis-surface-strong/70 p-4">
            <p className="font-mono text-[11px] tracking-[0.14em] text-bis-muted uppercase">
              Why this standard is recommended
            </p>
            <p className="mt-2 text-sm leading-7 text-bis-ink">{reason}</p>
          </div>
        )}

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

        {latestAmendment &&
          (hasText(latestAmendment.amendmentNumber) ||
            hasText(latestAmendment.date) ||
            hasText(latestAmendment.title)) && (
            <div className="mt-3 rounded-xl border border-bis-accent/20 bg-bis-accent/8 p-4">
              <p className="bis-kicker">Latest amendment</p>
              {hasText(latestAmendment.amendmentNumber) && (
                <p className="mt-1 text-sm font-semibold text-bis-ink">
                  Amendment {latestAmendment.amendmentNumber}
                </p>
              )}
              {(hasText(latestAmendment.date) ||
                hasText(latestAmendment.title)) && (
                <p className="mt-1 text-xs leading-5 text-bis-muted">
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

        {(hasText(certification.status) ||
          typeof certification.mandatory === "boolean" ||
          typeof certification.crsApplicable === "boolean" ||
          typeof certification.hallmarkingApplicable === "boolean") && (
          <div className="mt-5">
            <p className="mb-2 font-mono text-[11px] tracking-[0.14em] text-bis-muted uppercase">
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

        {typeof testing.required === "boolean" && (
          <div className="mt-5">
            <SummaryItem label="Testing required">
              <BooleanValue value={testing.required} />
            </SummaryItem>
          </div>
        )}

        {(typeof procurement.applicable === "boolean" ||
          recommendedFor.length > 0) && (
          <div className="mt-5">
            <p className="mb-2 font-mono text-[11px] tracking-[0.14em] text-bis-muted uppercase">
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
                        className="rounded-full bg-bis-blue-soft px-2.5 py-1 text-xs font-medium text-bis-accent dark:bg-white/10"
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

      <div className="space-y-4 px-6 pb-6">
        {hasCertificationDetails && (
          <Section
            title="Certification & compliance details"
            icon={<ShieldCheck size={17} className="text-bis-accent" />}
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
              <div className="mt-3 rounded-xl bg-bis-surface-strong/70 p-4">
                <p className="font-mono text-[11px] tracking-[0.14em] text-bis-muted uppercase">
                  Quality Control Order
                </p>
                <p className="mt-2 text-sm leading-7 text-bis-ink">
                  {certification.qualityControlOrder}
                </p>
              </div>
            )}
            {hasText(certification.note) && (
              <div className="mt-3 rounded-xl border border-bis-line p-4">
                <p className="font-mono text-[11px] tracking-[0.14em] text-bis-muted uppercase">
                  Compliance note
                </p>
                <p className="mt-2 text-sm leading-7 text-bis-muted">
                  {certification.note}
                </p>
              </div>
            )}
          </Section>
        )}

        {hasTestingDetails && (
          <Section
            title="Testing & inspection details"
            icon={<FlaskConical size={17} className="text-bis-accent" />}
          >
            {testMethods.length > 0 && (
              <div>
                <p className="font-mono text-[11px] tracking-[0.14em] text-bis-muted uppercase">
                  Test methods
                </p>
                <ul className="mt-2 space-y-2">
                  {testMethods.map((method, methodIndex) => (
                    <li
                      key={`${method}-${methodIndex}`}
                      className="rounded-lg bg-bis-surface-strong/70 px-3 py-2 text-sm leading-7 text-bis-ink"
                    >
                      {method}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {relatedTestStandards.length > 0 && (
              <div className="mt-4">
                <p className="font-mono text-[11px] tracking-[0.14em] text-bis-muted uppercase">
                  Related test standards
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {relatedTestStandards.map((standard) => (
                    <span
                      key={standard}
                      className="rounded-full border border-bis-line px-3 py-1.5 text-xs font-medium text-bis-ink"
                    >
                      {standard}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {inspectionRequirements.length > 0 && (
              <div className="mt-4">
                <p className="font-mono text-[11px] tracking-[0.14em] text-bis-muted uppercase">
                  Inspection requirements
                </p>
                <ul className="mt-2 space-y-2">
                  {inspectionRequirements.map((item, itemIndex) => (
                    <li
                      key={`${item}-${itemIndex}`}
                      className="text-sm leading-7 text-bis-ink"
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
            icon={<Link2 size={17} className="text-bis-accent" />}
          >
            <div className="space-y-3">
              {relatedStandards.map((standard, relatedIndex) => (
                <div
                  key={`${standard.standardNumber}-${relatedIndex}`}
                  className="rounded-xl border border-bis-line bg-bis-surface-strong/60 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {hasText(standard.standardNumber) && (
                      <span className="font-mono text-sm font-bold text-bis-accent">
                        {standard.standardNumber}
                      </span>
                    )}
                    {hasText(standard.relationship) && (
                      <span className="rounded-full bg-bis-surface px-2.5 py-1 text-[11px] font-medium text-bis-muted">
                        {standard.relationship}
                      </span>
                    )}
                  </div>
                  {hasText(standard.title) && (
                    <p className="mt-1 text-sm font-semibold text-bis-ink">
                      {standard.title}
                    </p>
                  )}
                  {hasText(standard.reason) && (
                    <p className="mt-2 text-sm leading-7 text-bis-muted">
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
            icon={<ClipboardList size={17} className="text-bis-accent" />}
          >
            {recommendedFor.length > 0 && (
              <div>
                <p className="font-mono text-[11px] tracking-[0.14em] text-bis-muted uppercase">
                  Recommended for
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {recommendedFor.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-bis-blue-soft px-3 py-1.5 text-xs font-medium text-bis-accent dark:bg-white/10"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {specificationPoints.length > 0 && (
              <div className="mt-4">
                <p className="font-mono text-[11px] tracking-[0.14em] text-bis-muted uppercase">
                  Specification points
                </p>
                <ul className="mt-2 space-y-2">
                  {specificationPoints.map((point, pointIndex) => (
                    <li
                      key={`${point}-${pointIndex}`}
                      className="text-sm leading-7 text-bis-ink"
                    >
                      • {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {buyerConsiderations.length > 0 && (
              <div className="mt-4">
                <p className="font-mono text-[11px] tracking-[0.14em] text-bis-muted uppercase">
                  Buyer considerations
                </p>
                <ul className="mt-2 space-y-2">
                  {buyerConsiderations.map((item, itemIndex) => (
                    <li
                      key={`${item}-${itemIndex}`}
                      className="rounded-lg border border-bis-line px-3 py-2 text-sm leading-7 text-bis-ink"
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
            icon={<FileSearch size={17} className="text-bis-accent" />}
          >
            <div className="space-y-3">
              {evidence.map((item, evidenceIndex) => (
                <div
                  key={`${item.standardNumber}-${item.chunkIndex}-${evidenceIndex}`}
                  className="rounded-xl border border-bis-line bg-bis-surface-strong/60 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {hasText(item.source) && (
                      <span className="font-mono text-xs font-bold text-bis-accent">
                        {item.source}
                      </span>
                    )}
                    {hasText(item.standardNumber) && (
                      <span className="font-mono text-xs text-bis-muted">
                        {item.standardNumber}
                      </span>
                    )}
                    {item.page !== null && item.page !== undefined && (
                      <span className="text-xs text-bis-muted">
                        Page {item.page}
                      </span>
                    )}
                    {item.chunkIndex !== null &&
                      item.chunkIndex !== undefined && (
                        <span className="text-xs text-bis-muted">
                          Chunk {item.chunkIndex}
                        </span>
                      )}
                  </div>
                  {hasText(item.excerpt) && (
                    <p className="mt-2 text-sm leading-7 text-bis-muted">
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
            icon={<BookOpen size={17} className="text-bis-accent" />}
          >
            <p className="text-sm leading-7 text-bis-ink">{reason}</p>
          </Section>
        )}
      </div>
    </article>
  );
}
