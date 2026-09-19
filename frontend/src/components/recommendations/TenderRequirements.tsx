import {
  ClipboardCheck,
  Factory,
  Layers3,
  Ruler,
  ShieldCheck,
  TestTube2,
  Wrench,
} from "lucide-react";
import type { ReactNode } from "react";
import type { TenderRequirements as TenderRequirementsType } from "@/types/recommendation";

interface TenderRequirementsProps {
  requirements: TenderRequirementsType;
}

interface RequirementListProps {
  title: string;
  items: string[];
  icon?: ReactNode;
  className?: string;
}

function hasText(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasItems<T>(items: T[] | null | undefined): items is T[] {
  return Array.isArray(items) && items.length > 0;
}

function RequirementList({
  title,
  items,
  icon,
  className = "",
}: RequirementListProps) {
  if (!hasItems(items)) {
    return null;
  }

  return (
    <div
      className={`rounded-xl bg-slate-50 p-4 dark:bg-slate-900 ${className}`}
    >
      <div className="flex items-center gap-2">
        {icon}

        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {title}
        </p>
      </div>

      <ul className="mt-2 space-y-2">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="text-sm leading-6 text-slate-700 dark:text-slate-300"
          >
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TenderRequirements({
  requirements,
}: TenderRequirementsProps) {
  const hasProduct = hasText(requirements.product);

  const hasMaterials = hasItems(requirements.materials);
  const hasDimensions = hasItems(requirements.dimensions);
  const hasGrades = hasItems(requirements.grades);
  const hasPerformance = hasItems(requirements.performanceRequirements);
  const hasTesting = hasItems(requirements.testingRequirements);
  const hasCertification = hasItems(requirements.certificationRequirements);
  const hasUses = hasItems(requirements.uses);

  const hasAnyRequirement =
    hasProduct ||
    hasMaterials ||
    hasDimensions ||
    hasGrades ||
    hasPerformance ||
    hasTesting ||
    hasCertification ||
    hasUses;

  if (!hasAnyRequirement) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-border-light bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-950">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bis-blue-soft dark:bg-blue-950/50">
          <ClipboardCheck size={20} className="text-bis-blue" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-bis-blue">
            Tender analysis
          </p>

          <h2 className="mt-1 text-xl font-bold text-bis-navy dark:text-slate-100">
            Extracted Tender Requirements
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Requirements identified from the submitted procurement query or
            tender document.
          </p>
        </div>
      </div>

      {/* Product / Work */}
      {hasProduct && (
        <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Factory size={17} className="text-bis-blue" />

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Product / Work
            </p>
          </div>

          <p className="mt-2 text-sm font-semibold leading-6 text-bis-navy dark:text-slate-100">
            {requirements.product}
          </p>
        </div>
      )}

      {/* Requirement grid */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {hasMaterials && (
          <RequirementList
            title="Materials"
            items={requirements.materials}
            icon={<Layers3 size={17} className="text-bis-blue" />}
          />
        )}

        {hasDimensions && (
          <RequirementList
            title="Dimensions"
            items={requirements.dimensions}
            icon={<Ruler size={17} className="text-bis-blue" />}
          />
        )}

        {hasGrades && (
          <RequirementList
            title="Grades"
            items={requirements.grades}
            icon={<Wrench size={17} className="text-bis-blue" />}
          />
        )}

        {hasTesting && (
          <RequirementList
            title="Testing requirements"
            items={requirements.testingRequirements}
            icon={<TestTube2 size={17} className="text-bis-blue" />}
          />
        )}
      </div>

      {/* Performance */}
      {hasPerformance && (
        <div className="mt-4">
          <RequirementList
            title="Performance requirements"
            items={requirements.performanceRequirements}
          />
        </div>
      )}

      {/* Certification */}
      {hasCertification && (
        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/60 dark:bg-blue-950/30">
          <div className="flex items-center gap-2">
            <ShieldCheck size={17} className="text-bis-blue" />

            <p className="text-xs font-semibold uppercase tracking-wide text-bis-blue">
              Certification requirements
            </p>
          </div>

          <ul className="mt-2 space-y-2">
            {requirements.certificationRequirements.map(
              (requirement, index) => (
                <li
                  key={`${requirement}-${index}`}
                  className="text-sm leading-6 text-slate-700 dark:text-slate-300"
                >
                  • {requirement}
                </li>
              ),
            )}
          </ul>
        </div>
      )}

      {/* Uses */}
      {hasUses && (
        <div className="mt-4">
          <RequirementList title="Intended uses" items={requirements.uses} />
        </div>
      )}
    </section>
  );
}
