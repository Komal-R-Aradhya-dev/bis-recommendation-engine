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
      className={`rounded-xl border border-bis-line bg-bis-surface-strong/60 p-4 ${className}`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <p className="font-mono text-[11px] tracking-[0.14em] text-bis-muted uppercase">
          {title}
        </p>
      </div>
      <ul className="mt-2 space-y-2">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="text-sm leading-7 text-bis-ink"
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
    <section className="bis-surface rounded-2xl p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bis-blue-soft dark:bg-white/10">
          <ClipboardCheck size={20} className="text-bis-accent" />
        </div>
        <div>
          <p className="bis-kicker">02 · Tender Intelligence</p>
          <h2 className="mt-1 font-serif text-2xl text-bis-ink">
            Extracted Tender Requirements
          </h2>
          <p className="mt-1 text-sm leading-7 text-bis-muted">
            Requirements identified from the submitted procurement query or
            tender document.
          </p>
        </div>
      </div>

      {hasProduct && (
        <div className="mt-5 rounded-xl border border-bis-line bg-bis-surface-strong/60 p-4">
          <div className="flex items-center gap-2">
            <Factory size={17} className="text-bis-accent" />
            <p className="font-mono text-[11px] tracking-[0.14em] text-bis-muted uppercase">
              Product / Work
            </p>
          </div>
          <p className="mt-2 text-sm font-semibold leading-7 text-bis-ink">
            {requirements.product}
          </p>
        </div>
      )}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {hasMaterials && (
          <RequirementList
            title="Materials"
            items={requirements.materials}
            icon={<Layers3 size={17} className="text-bis-accent" />}
          />
        )}
        {hasDimensions && (
          <RequirementList
            title="Dimensions"
            items={requirements.dimensions}
            icon={<Ruler size={17} className="text-bis-accent" />}
          />
        )}
        {hasGrades && (
          <RequirementList
            title="Grades"
            items={requirements.grades}
            icon={<Wrench size={17} className="text-bis-accent" />}
          />
        )}
        {hasTesting && (
          <RequirementList
            title="Testing requirements"
            items={requirements.testingRequirements}
            icon={<TestTube2 size={17} className="text-bis-accent" />}
          />
        )}
      </div>

      {hasPerformance && (
        <div className="mt-4">
          <RequirementList
            title="Performance requirements"
            items={requirements.performanceRequirements}
          />
        </div>
      )}

      {hasCertification && (
        <div className="mt-4 rounded-xl border border-bis-accent/20 bg-bis-accent/8 p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={17} className="text-bis-accent" />
            <p className="bis-kicker">Certification requirements</p>
          </div>
          <ul className="mt-2 space-y-2">
            {requirements.certificationRequirements.map(
              (requirement, index) => (
                <li
                  key={`${requirement}-${index}`}
                  className="text-sm leading-7 text-bis-ink"
                >
                  • {requirement}
                </li>
              ),
            )}
          </ul>
        </div>
      )}

      {hasUses && (
        <div className="mt-4">
          <RequirementList title="Intended uses" items={requirements.uses} />
        </div>
      )}
    </section>
  );
}
