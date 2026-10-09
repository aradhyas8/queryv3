"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, ChevronRight, Copy } from "lucide-react";

export function CopyButton({ text, label = false }: { text: string; label?: boolean }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      setStatus("error");
      return;
    }
    setStatus("copied");
    timer.current = setTimeout(() => setStatus("idle"), 2000);
  };
  const copied = status === "copied";
  const Icon = copied ? Check : Copy;
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      title={status === "error" ? "Copy unavailable. Select and copy the command." : copied ? "Copied" : "Copy command"}
      className={`flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded font-mono text-xs transition-colors duration-150 ${
        copied ? "bg-night text-ink" : "text-fg-3 hover:bg-row-hover hover:text-ink"
      } ${label ? "h-11 px-2" : "h-11 w-11"}`}
    >
      <Icon size={16} aria-hidden />
      {label && <span>{copied ? "copied" : "copy"}</span>}
      <span role="status" className="sr-only">{copied ? "Command copied to clipboard." : status === "error" ? "Copy unavailable. Select and copy the command." : ""}</span>
    </button>
  );
}

export function InlineCommand({ cmd, prominent = false, className = "" }: { cmd: string; prominent?: boolean; className?: string }) {
  return (
    <div
      className={`flex min-w-0 items-center justify-between gap-2 border bg-cmd px-3 transition-colors duration-150 focus-within:border-fg-4 hover:border-fg-7 sm:gap-4 ${prominent ? "min-h-16 rounded-xl border-line-hover py-2 sm:min-h-[68px] sm:px-5" : "min-h-14 rounded-lg border-line sm:px-4"} ${className}`}
    >
      <div className="flex min-w-0 items-center gap-2">
        <ChevronRight size={16} aria-hidden className="shrink-0 text-fg-4" />
        <code className={`min-w-0 font-mono text-fg ${prominent ? "text-sm font-medium break-normal min-[400px]:text-base sm:text-[19px]" : "break-words text-xs sm:text-sm"}`}>
          {/* Narrow screens wrap between words, never inside a flag like --cursor; the text itself is unchanged. */}
          {prominent ? cmd.split(" ").map((word, index) => <span key={index}>{index > 0 && " "}<span className="whitespace-nowrap">{word}</span></span>) : cmd}
        </code>
      </div>
      <CopyButton text={cmd} />
    </div>
  );
}

/** Window chrome around code: traffic lights, a centered title, optional copy. */
export function Terminal({
  title,
  copy,
  head,
  children,
  className = "",
}: {
  title: string;
  copy?: string;
  head?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`min-w-0 overflow-hidden rounded-xl border border-line bg-term ${className}`}>
      <div className="relative flex h-12 items-center justify-between gap-3 border-b border-line-term bg-term-head px-4">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-red" />
          <span className="h-3 w-3 rounded-full bg-yellow" />
          <span className="h-3 w-3 rounded-full bg-green" />
        </div>
        {head ?? (
          <span className="absolute left-1/2 max-w-[50%] -translate-x-1/2 truncate font-mono text-xs text-fg-5">{title}</span>
        )}
        {copy ? <CopyButton text={copy} label /> : <span />}
      </div>
      {children}
    </div>
  );
}
