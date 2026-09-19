import { Download, Loader2, Square } from "lucide-react";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/layout/TopBar";
import Composer from "@/components/composer/Composer";
import RecommendationCard from "@/components/recommendations/RecommendationCard";
import TenderRequirements from "@/components/recommendations/TenderRequirements";
import { useRecommendations } from "@/hooks/useRecommendations";
import { downloadRecommendationReport } from "@/services/report.api";
import { useRecommendationStore } from "@/store/recommendationStore";
import heroBackground from "@/assets/hero.png";

interface ActiveRequest {
  query: string;
  fileName: string | null;
}

export default function Home() {
  const { result, loading, error, generate, stop, clear } =
    useRecommendations();

  const historyId = useRecommendationStore((state) => state.historyId);

  const [activeRequest, setActiveRequest] = useState<ActiveRequest | null>(
    null,
  );

  const [downloadingReport, setDownloadingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

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

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950">
      <Sidebar />

      <main className="relative flex min-w-0 flex-1 flex-col overflow-y-auto">
        {/* Government building background */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed bottom-0 left-84.5 right-0 z-0 h-[48vh] overflow-hidden opacity-40 dark:opacity-[0.14]"
        >
          <img
            src={heroBackground}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-bottom"
          />

          <div className="absolute inset-0 bg-linear-to-t from-white/20 via-white/35 to-white/90 dark:from-slate-950/40 dark:via-slate-950/70 dark:to-slate-950" />
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <TopBar />

          <div className="flex min-h-0 flex-1 flex-col items-center px-5 sm:px-6">
            {/* Empty / landing state */}
            {!result && !loading && (
              <div className="flex w-full max-w-4xl flex-1 flex-col items-center justify-center pb-20">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-900">
                  <img
                    src="/bis-logo.png"
                    alt="Bureau of Indian Standards"
                    className="h-16 w-16 object-contain"
                  />
                </div>

                <h1 className="text-center text-3xl font-semibold tracking-tight text-bis-navy dark:text-slate-100 sm:text-4xl">
                  BIS Procurement Assistant
                </h1>

                <p className="mt-3 max-w-2xl text-center text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                  Ask about Indian Standards, upload a tender document, or
                  describe your procurement requirement.
                </p>

                <div className="mt-8 w-full">
                  <Composer
                    loading={loading}
                    onStop={stop}
                    onSubmit={handleSubmit}
                  />

                  {error && (
                    <div className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ChatGPT-style generation state */}
            {loading && (
              <div className="w-full max-w-3xl flex-1 py-8 sm:py-10">
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-md bg-bis-blue px-4 py-3 text-white shadow-sm">
                    {activeRequest?.query && (
                      <p className="text-sm leading-6">{activeRequest.query}</p>
                    )}

                    {activeRequest?.fileName && (
                      <div
                        className={`rounded-xl border border-white/20 bg-white/10 ${
                          activeRequest.query ? "mt-3" : ""
                        } px-3 py-2`}
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-100">
                          Tender document
                        </p>

                        <p className="mt-1 truncate text-xs text-white">
                          {activeRequest.fileName}
                        </p>
                      </div>
                    )}

                    {!activeRequest?.query && !activeRequest?.fileName && (
                      <p className="text-sm text-white/80">
                        Procurement analysis request
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bis-blue-soft dark:bg-blue-950/50">
                    <span className="h-3.5 w-3.5 animate-pulse rounded-full bg-bis-blue" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm font-semibold text-bis-navy dark:text-slate-100">
                        BIS Procurement Assistant
                      </p>

                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        Analyzing
                      </span>
                    </div>

                    <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      Finding relevant Indian Standards and analyzing the
                      procurement requirement...
                    </p>

                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-bis-blue [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-bis-blue [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-bis-blue" />
                    </div>

                    <button
                      type="button"
                      onClick={stop}
                      className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
                    >
                      <Square size={11} fill="currentColor" />
                      Stop
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400">
                    {error}
                  </div>
                )}
              </div>
            )}

            {/* Result state */}
            {result && !loading && (
              <div className="w-full max-w-5xl py-5 sm:py-7">
                <div className="mb-5">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-bis-blue">
                        Recommendation Result
                      </p>

                      <h1 className="mt-1 text-2xl font-bold text-bis-navy dark:text-slate-100 sm:text-3xl">
                        Indian Standards Recommendations
                      </h1>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <div className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {result.recommendations.length}{" "}
                        {result.recommendations.length === 1
                          ? "standard"
                          : "standards"}
                      </div>

                      <button
                        type="button"
                        onClick={handleDownloadReport}
                        disabled={!historyId || downloadingReport}
                        className="inline-flex items-center gap-2 rounded-lg bg-bis-blue px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-bis-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {downloadingReport ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Download size={14} />
                        )}

                        {downloadingReport
                          ? "Generating..."
                          : "Download Report"}
                      </button>
                    </div>
                  </div>

                  {reportError && (
                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-400">
                      {reportError}
                    </div>
                  )}
                </div>

                {result.query?.trim() && (
                  <section className="mb-4 rounded-2xl border border-border-light bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-950">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Analyzed requirement
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {result.query}
                    </p>
                  </section>
                )}

                {result.summary?.trim() && (
                  <section className="mb-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/60 dark:bg-blue-950/30">
                    <p className="text-xs font-semibold uppercase tracking-wide text-bis-blue">
                      Summary
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {result.summary}
                    </p>
                  </section>
                )}

                {result.tenderRequirements && (
                  <div className="mb-5">
                    <TenderRequirements
                      requirements={result.tenderRequirements}
                    />
                  </div>
                )}

                <section>
                  <div className="mb-3">
                    <h2 className="text-lg font-bold text-bis-navy dark:text-slate-100">
                      Recommended Indian Standards
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Important recommendation information is shown directly;
                      additional details can be expanded when needed.
                    </p>
                  </div>

                  {result.recommendations.length === 0 ? (
                    <div className="rounded-2xl border border-border-light bg-white p-7 text-center shadow-card dark:border-slate-700 dark:bg-slate-950">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        No Indian Standards were returned for this request.
                      </p>

                      <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                        Try providing a more specific procurement requirement or
                        tender document.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {result.recommendations.map((recommendation) => (
                        <RecommendationCard
                          key={recommendation.standardNumber}
                          recommendation={recommendation}
                        />
                      ))}
                    </div>
                  )}
                </section>

                {result.warnings.length > 0 && (
                  <section className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/20">
                    <h2 className="text-sm font-bold text-amber-900 dark:text-amber-300">
                      Important notices
                    </h2>

                    <ul className="mt-2 space-y-1.5">
                      {result.warnings.map((warning, index) => (
                        <li
                          key={`${warning}-${index}`}
                          className="text-sm leading-6 text-amber-800 dark:text-amber-300"
                        >
                          • {warning}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={handleNewAnalysis}
                    className="rounded-lg border border-border-light px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                  >
                    New Analysis
                  </button>
                </div>
              </div>
            )}
          </div>

          <footer className="relative z-10 flex items-center justify-between px-6 py-3 text-[11px] text-slate-400 dark:text-slate-500 sm:px-8">
            <span>Standards Build a Safer, Stronger India</span>
            <span>Government of India</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
