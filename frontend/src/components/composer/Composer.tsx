import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent, FormEvent, KeyboardEvent } from "react";
import { ArrowUp, FileText, Paperclip, Square, X } from "lucide-react";
import { cn } from "@/lib/cn";

interface ComposerProps {
  loading?: boolean;
  onSubmit: (query: string, document: File | null) => void;
  onStop?: () => void;
}

const MAX_FILE_BYTES = 10 * 1024 * 1024;

function isAllowedDocument(file: File) {
  const name = file.name.toLowerCase();
  const isPdf = file.type === "application/pdf" || name.endsWith(".pdf");
  const isDocx =
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx");

  return isPdf || isDocx;
}

function fileKind(file: File) {
  return file.name.toLowerCase().endsWith(".docx") ? "DOCX" : "PDF";
}

export default function Composer({
  loading = false,
  onSubmit,
  onStop,
}: ComposerProps) {
  const [query, setQuery] = useState("");
  const [document, setDocument] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);

  function assignDocument(file: File | null) {
    if (!file) {
      return;
    }

    if (!isAllowedDocument(file)) {
      setFileError("Only PDF and DOCX files are allowed.");
      setDocument(null);
      setFormError(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setFileError("File is too large. Maximum size is 10 MB.");
      setDocument(null);
      setFormError(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setFileError(null);
    setFormError(null);
    setDocument(file);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    assignDocument(event.target.files?.[0] ?? null);
  }

  function removeDocument() {
    setDocument(null);
    setFileError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleDragEnter(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    dragDepth.current += 1;
    setDragging(true);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = loading ? "none" : "copy";
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    dragDepth.current = Math.max(0, dragDepth.current - 1);

    if (dragDepth.current === 0) {
      setDragging(false);
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    dragDepth.current = 0;
    setDragging(false);

    if (loading) {
      return;
    }

    assignDocument(event.dataTransfer.files?.[0] ?? null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (!query.trim() && !document) {
      setFormError("Please provide a query or upload a tender document.");
      return;
    }

    setFormError(null);
    onSubmit(query.trim(), document);
  }

  function handleQueryKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  const canSubmit = !loading && (!!query.trim() || !!document);
  const errorMessage = fileError || formError;

  return (
    <div className="w-full">
      {document && (
        <div className="bis-surface mb-3 flex items-center justify-between gap-3 rounded-2xl px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bis-surface-strong">
              <FileText size={18} className="text-bis-accent" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-bis-ink">
                {document.name}
              </p>
              <p className="font-mono text-[11px] text-bis-muted">
                {fileKind(document)} · {(document.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeDocument}
            disabled={loading}
            className="rounded-full p-2 text-bis-muted transition hover:text-bis-danger disabled:opacity-50"
            aria-label="Remove document"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="mb-3 rounded-xl border border-bis-danger/25 bg-bis-danger/10 px-4 py-3 text-sm text-bis-danger"
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "bis-surface flex min-h-16 items-end gap-2 rounded-[22px] px-3 py-2.5 transition sm:min-h-[4.5rem] sm:gap-3 sm:px-4",
            focused && "shadow-glow",
            dragging && "border-bis-accent shadow-glow",
            loading && "opacity-80",
          )}
        >
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-bis-muted transition hover:bg-bis-surface-strong hover:text-bis-accent disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Attach PDF or DOCX"
          >
            <Paperclip size={20} />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            disabled={loading}
            className="hidden"
          />

          <textarea
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleQueryKeyDown}
            disabled={loading}
            rows={1}
            placeholder={
              dragging
                ? "Drop a PDF or DOCX here"
                : "Describe what you need to procure, or attach a tender document..."
            }
            aria-label="Procurement requirement"
            className="max-h-36 min-h-10 min-w-0 flex-1 resize-none bg-transparent py-2 text-base leading-6 text-bis-ink outline-none placeholder:text-bis-muted disabled:cursor-not-allowed"
          />

          {loading ? (
            <button
              type="button"
              onClick={onStop}
              className="mb-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bis-danger text-white sm:h-12 sm:w-12"
              aria-label="Stop generating"
            >
              <Square size={16} fill="currentColor" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "mb-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bis-accent text-white shadow-glow transition hover:bg-bis-blue-dark sm:h-12 sm:w-12",
                !canSubmit && "opacity-40",
              )}
              aria-label="Submit recommendation request"
            >
              <ArrowUp size={20} strokeWidth={2.2} />
            </button>
          )}
        </div>
        <p className="mt-2 px-1 font-mono text-[11px] tracking-[0.04em] text-bis-muted">
          PDF and DOCX · 10 MB maximum · Enter to submit
        </p>
      </form>
    </div>
  );
}
