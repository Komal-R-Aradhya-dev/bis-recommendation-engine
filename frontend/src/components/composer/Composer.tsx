import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ArrowUp, Paperclip, X, FileText, Loader2, Square } from "lucide-react";

interface ComposerProps {
  loading?: boolean;
  onSubmit: (query: string, document: File | null) => void;
  onStop?: () => void;
}

export default function Composer({
  loading = false,
  onSubmit,
  onStop,
}: ComposerProps) {
  const [query, setQuery] = useState("");
  const [document, setDocument] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    const isPdf = file.type === "application/pdf";
    const isDocx =
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    if (!isPdf && !isDocx) {
      return;
    }

    setDocument(file);
  }

  function removeDocument() {
    setDocument(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!query.trim() && !document) {
      return;
    }

    onSubmit(query.trim(), document);
  }

  const canSubmit = !loading && (!!query.trim() || !!document);

  return (
    <div className="w-full">
      {document && (
        <div className="mb-3 flex items-center justify-between rounded-xl border border-blue-100 bg-bis-blue-soft px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
              <FileText size={18} className="text-bis-blue" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-bis-navy">
                {document.name}
              </p>

              <p className="text-xs text-slate-500">
                {(document.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={removeDocument}
            disabled={loading}
            className="rounded-full p-2 text-slate-500 hover:bg-white hover:text-red-600 disabled:opacity-50"
            aria-label="Remove document"
          >
            <X size={17} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex min-h-19 items-center gap-3 rounded-full border border-slate-200 bg-white px-5 shadow-[0_8px_30px_rgba(40,70,120,0.08)] transition focus-within:border-bis-blue">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Attach PDF or DOCX"
          >
            <Paperclip size={21} />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            className="hidden"
          />

          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            disabled={loading}
            placeholder="Ask a question or upload a tender document (PDF/DOCX)..."
            className="min-w-0 flex-1 bg-transparent text-base text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
          />

          {loading ? (
            <button
              type="button"
              onClick={onStop}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600"
              aria-label="Stop generating"
            >
              <Square size={18} fill="currentColor" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-bis-blue text-white shadow-sm transition hover:bg-bis-blue-dark disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Submit recommendation request"
            >
              <ArrowUp size={21} strokeWidth={2.2} />
            </button>
          )}
        </div>
      </form>

      {loading && (
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Loader2 size={14} className="animate-spin" />
          Analyzing procurement requirement...
        </div>
      )}
    </div>
  );
}
