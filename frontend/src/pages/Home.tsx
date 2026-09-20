import { Download, Loader2, Square } from "lucide-react";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/layout/TopBar";
import Composer from "@/components/composer/Composer";
import RecommendationCard from "@/components/recommendations/RecommendationCard";
import TenderRequirements from "@/components/recommendations/TenderRequirements";
import { useRecommendations } from "@/hooks/useRecommendations";
import { fadeUp, stagger } from "@/lib/motion";
import { useSceneMode } from "@/lib/useSceneMode";
import { downloadRecommendationReport } from "@/services/report.api";
import { useRecommendationStore } from "@/store/recommendationStore";
import { useUIStore } from "@/store/uiStore";

interface ActiveRequest {
  query: string;
  fileName: string | null;
}

export default function Home() {
  const { result, loading, error, generate, stop, clear } =
    useRecommendations();
  const historyId = useRecommendationStore((state) => state.historyId);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const reduced = useReducedMotion();

  const [activeRequest, setActiveRequest] = useState<ActiveRequest | null>(
    null,
  );
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  useSceneMode(loading ? "analyzing" : result ? "results" : "hero");

  async function handleSubmit(
    submittedQuery: string,
    submittedDocument: File | null,
  ) {
    setActiveRequest({
      query: submittedQuery.trim(),
      fileName: submittedDocument?.name ?? null,
    });

    setReportError(null);

    try {
      await generate({
        query: submittedQuery || undefined,
        document: submittedDocument,
      });
    } catch {
      // Error is handled by the recommendation hook.
    }
  }

  function handleNewAnalysis() {
    setActiveRequest(null);
    setReportError(null);
    clear();
  }

  async function handleDownloadReport() {
    if (!historyId || downloadingReport) {
      return;
    }

    setDownloadingReport(true);
    setReportError(null);

    try {
      const blob = await downloadRecommendationReport(historyId);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = `BIS-Recommendation-Report-${historyId}.pdf`;

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(url);
    } catch {
      setReportError("Unable to generate the report. Please try again.");
    } finally {
      setDownloadingReport(false);
    }
  }

  const recommendationCount = result?.recommendations.length ?? 0;

  return (
    <div className="relative z-10 flex h-screen overflow-hidden">
      <Sidebar />

      <main className="relative flex min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <TopBar onMenuToggle={toggleSidebar} />

          <div className="flex min-h-0 flex-1 flex-col items-center px-4 sm:px-6">
            {!result && !loading && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger(reduced)}
                className="flex w-full max-w-4xl flex-1 flex-col items-center justify-center pb-16"
              >
                <motion.div
                  variants={fadeUp(reduced)}
                  className="mb-6 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bis-surface"
                >
                  <img
                    src="/bis-logo.png"
                    alt="Bureau of Indian Standards"
                    className="h-14 w-14 object-contain"
                  />
                </motion.div>
                <motion.p
                  variants={fadeUp(reduced)}
                  className="bis-kicker text-center"
                >
                  Bureau of Indian Standards
                </motion.p>
                <motion.p
                  variants={fadeUp(reduced)}
                  className="mt-2 font-deva text-sm text-bis-muted"
                >
                  भारतीय मानक ब्यूरो
                </motion.p>
                <motion.h1
                  variants={fadeUp(reduced)}
                  className="bis-display mt-5 max-w-3xl text-center text-[2.35rem] leading-[1.05] sm:text-5xl lg:text-6xl"
                >
                  Indian Standards
                  <span className="mt-1 block italic">Intelligence</span>
                </motion.h1>
                <motion.p
                  variants={fadeUp(reduced)}
                  className="mt-5 max-w-xl text-center text-sm leading-7 text-bis-muted sm:text-base"
                >
                  Describe what you need to procure.
                  <br />
                  We'll identify the relevant Indian Standards.
                </motion.p>
                <motion.div variants={fadeUp(reduced)} className="mt-8 w-full">
                  <Composer
                    loading={loading}
                    onStop={stop}
                    onSubmit={handleSubmit}
                  />
                  {error && (
                    <div
                      role="alert"
                      className="mt-3 rounded-xl border border-bis-danger/25 bg-bis-danger/10 px-4 py-3 text-sm text-bis-danger"
                    >
                      {error}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {loading && (
              <div className="flex w-full max-w-2xl flex-1 flex-col items-center justify-center py-10">
                <div className="relative mb-8 flex h-32 w-32 items-center justify-center">
                  <span className="bis-breathe absolute inset-0 rounded-full border border-bis-accent/25" />
                  <span className="bis-breathe bis-breathe-delay absolute inset-4 rounded-full border border-bis-accent/40" />
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-full bis-surface">
                    <span className="h-2.5 w-2.5 rounded-full bg-bis-accent" />
                  </span>
                </div>

                <p className="bis-kicker">Reasoning over standards</p>
                <h1 className="bis-display mt-3 text-center text-3xl sm:text-4xl">
                  Reading the requirement
                </h1>
                <p className="mt-3 max-w-md text-center text-sm leading-7 text-bis-muted">
                  The system is identifying living Indian Standards against the
                  submitted procurement language.
                </p>

                {(activeRequest?.query || activeRequest?.fileName) && (
                  <div className="bis-surface mt-8 w-full rounded-2xl p-5">
                    {activeRequest.query && (
                      <div>
                        <p className="font-mono text-[11px] tracking-[0.14em] text-bis-muted uppercase">
                          Query
                        </p>
                        <p className="mt-2 text-sm leading-7 text-bis-ink">
                          {activeRequest.query}
                        </p>
                      </div>
                    )}
                    {activeRequest.fileName && (
                      <div className={activeRequest.query ? "mt-4" : ""}>
                        <p className="font-mono text-[11px] tracking-[0.14em] text-bis-muted uppercase">
                          Tender document
                        </p>
                        <p className="mt-2 truncate font-mono text-sm text-bis-ink">
                          {activeRequest.fileName}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={stop}
                  className="mt-8 inline-flex h-10 items-center gap-2 rounded-xl border border-bis-danger/30 bg-bis-danger/10 px-4 text-sm font-semibold text-bis-danger"
                >
                  <Square size={11} fill="currentColor" />
                  Stop
                </button>

                {error && (
                  <div
                    role="alert"
                    className="mt-5 w-full rounded-xl border border-bis-danger/25 bg-bis-danger/10 px-4 py-3 text-sm text-bis-danger"
                  >
                    {error}
                  </div>
                )}
              </div>
            )}

            {result && !loading && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger(reduced)}
                className="w-full max-w-5xl py-5 sm:py-7"
              >
                <motion.div
                  variants={fadeUp(reduced)}
                  className="mb-7 flex flex-wrap items-end justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="bis-kicker">Indian Standards</p>
                    <h1 className="bis-display mt-2 text-3xl sm:text-4xl">
                      Indian Standards Recommendations
                    </h1>
                    <p className="mt-2 font-mono text-xs text-bis-muted">
                      {recommendationCount}{" "}
                      {recommendationCount === 1
                        ? "standard returned"
                        : "standards returned"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <div className="rounded-full bis-surface px-3 py-1.5 font-mono text-xs text-bis-ink">
                      {recommendationCount}{" "}
                      {recommendationCount === 1 ? "standard" : "standards"}
                    </div>
                    <button
                      type="button"
                      onClick={handleDownloadReport}
                      disabled={!historyId || downloadingReport}
                      className="inline-flex items-center gap-2 rounded-lg bg-bis-accent px-3.5 py-2 text-xs font-semibold text-white shadow-glow transition hover:bg-bis-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {downloadingReport ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Download size={14} />
                      )}
                      {downloadingReport ? "Generating..." : "Download Report"}
                    </button>
                    <button
                      type="button"
                      onClick={handleNewAnalysis}
                      className="rounded-lg border border-bis-line px-3.5 py-2 text-xs font-medium text-bis-ink transition hover:bg-bis-surface"
                    >
                      New Analysis
                    </button>
                  </div>
                </motion.div>

                {reportError && (
                  <div
                    role="alert"
                    className="mb-4 rounded-xl border border-bis-danger/25 bg-bis-danger/10 px-4 py-3 text-sm text-bis-danger"
                  >
                    {reportError}
                  </div>
                )}

                {result.query?.trim() && (
                  <motion.section
                    variants={fadeUp(reduced)}
                    className="bis-surface mb-4 rounded-2xl p-4"
                  >
                    <p className="font-mono text-[11px] tracking-[0.14em] text-bis-muted uppercase">
                      Analyzed requirement
                    </p>
                    <p className="mt-2 text-sm leading-7 text-bis-ink">
                      {result.query}
                    </p>
                  </motion.section>
                )}

                {result.summary?.trim() && (
                  <motion.section
                    variants={fadeUp(reduced)}
                    className="mb-5 rounded-2xl border border-bis-accent/20 bg-bis-accent/8 p-5"
                  >
                    <p className="bis-kicker">01 · Executive Summary</p>
                    <p className="mt-3 font-serif text-lg leading-8 text-bis-ink">
                      {result.summary}
                    </p>
                  </motion.section>
                )}

                {result.tenderRequirements && (
                  <motion.div variants={fadeUp(reduced)} className="mb-5">
                    <TenderRequirements
                      requirements={result.tenderRequirements}
                    />
                  </motion.div>
                )}

                <motion.section variants={fadeUp(reduced)}>
                  <div className="mb-4">
                    <p className="bis-kicker">03 · Recommended Standards</p>
                    <h2 className="mt-2 font-serif text-2xl text-bis-ink">
                      Recommended Standards
                    </h2>
                    <p className="mt-1 text-sm text-bis-muted">
                      Important recommendation information is shown directly;
                      additional details can be expanded when needed.
                    </p>
                  </div>

                  {result.recommendations.length === 0 ? (
                    <div className="bis-surface rounded-2xl p-7 text-center">
                      <p className="text-sm font-medium text-bis-ink">
                        No Indian Standards were returned for this request.
                      </p>
                      <p className="mt-1.5 text-xs text-bis-muted">
                        Try providing a more specific procurement requirement or
                        tender document.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {result.recommendations.map((recommendation, index) => (
                        <RecommendationCard
                          key={recommendation.standardNumber || String(index)}
                          recommendation={recommendation}
                          index={index}
                        />
                      ))}
                    </div>
                  )}
                </motion.section>

                {result.warnings.length > 0 && (
                  <section className="mt-5 rounded-2xl border border-bis-warning/30 bg-bis-warning/10 p-4">
                    <h2 className="text-sm font-bold text-bis-warning">
                      Important notices
                    </h2>
                    <ul className="mt-2 space-y-1.5">
                      {result.warnings.map((warning, index) => (
                        <li
                          key={`${warning}-${index}`}
                          className="text-sm leading-6 text-bis-ink"
                        >
                          • {warning}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <div className="mt-6 flex justify-center pb-4">
                  <button
                    type="button"
                    onClick={handleNewAnalysis}
                    className="rounded-lg border border-bis-line px-5 py-2.5 text-sm font-medium text-bis-ink transition hover:bg-bis-surface"
                  >
                    New Analysis
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <footer className="relative z-10 flex flex-wrap items-center justify-between gap-2 px-5 py-3 font-mono text-[11px] text-bis-muted sm:px-8">
            <span>Standards Build a Safer, Stronger India</span>
            <span>Government of India</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
