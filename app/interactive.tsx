"use client";

import { useEffect, useId, useRef, useState, type ComponentProps, type KeyboardEvent, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

const DSN = "postgres://user:password@localhost:5432/my_database";

export function CopyButton({ text, label = false }: { text: string; label?: boolean }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return; // clipboard blocked (insecure context); the text stays selectable
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };
  const Icon = copied ? Check : Copy;
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className={`flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded font-mono text-xs transition-colors duration-150 ${
        copied ? "text-green" : "text-fg-7 hover:text-fg-4"
      } ${label ? "h-6 px-1" : "h-6 w-6"}`}
    >
      <Icon size={13} aria-hidden />
      {label && <span aria-live="polite">{copied ? "copied" : "copy"}</span>}
    </button>
  );
}

/** One-line command with a `$` prompt and an icon copy button. Truncates rather than overflowing. */
export function InlineCommand({ cmd, className = "" }: { cmd: string; className?: string }) {
  return (
    <div
      className={`flex h-11 min-w-0 items-center justify-between gap-4 rounded-lg border border-line bg-cmd px-4 transition-colors duration-150 hover:border-line-hover ${className}`}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className="shrink-0 font-mono text-sm text-fg-6 select-none">$</span>
        <code className="truncate font-mono text-sm text-fg">{cmd}</code>
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
      <div className="relative flex h-10 items-center justify-between gap-3 border-b border-line-term bg-term-head px-4">
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

const CLIENTS = {
  json: {
    label: ".mcp.json",
    body: `{
  "mcpServers": {
    "queryio": {
      "command": "npx",
      "args": ["-y", "queryio"],
      "env": {
        "QUERYIO_DATABASE_URL": "${DSN}"
      }
    }
  }
}`,
  },
  codex: {
    label: "~/.codex/config.toml",
    body: `[mcp_servers.queryio]
command = "npx"
args = ["-y", "queryio"]
[mcp_servers.queryio.env]
QUERYIO_DATABASE_URL = "${DSN}"`,
  },
};

type Client = keyof typeof CLIENTS;

/** Config file for MCP clients other than the Claude Code CLI, with file tabs in the window header. */
export function ClientConfig() {
  const [tab, setTab] = useState<Client>("json");
  const panelId = useId();
  const ids = Object.keys(CLIENTS) as Client[];
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = ids[(ids.indexOf(tab) + 1) % ids.length];
    setTab(next);
    (e.currentTarget.querySelector(`[data-id="${next}"]`) as HTMLElement | null)?.focus();
  };
  return (
    <Terminal
      title={CLIENTS[tab].label}
      copy={CLIENTS[tab].body}
      head={
        <div role="tablist" aria-label="Config file" onKeyDown={onKey} className="flex min-w-0 gap-1">
          {ids.map((id) => {
            const on = id === tab;
            return (
              <button
                key={id}
                data-id={id}
                role="tab"
                aria-selected={on}
                aria-controls={panelId}
                tabIndex={on ? 0 : -1}
                onClick={() => setTab(id)}
                className={`h-6 cursor-pointer truncate rounded px-2 font-mono text-xs transition-colors duration-150 ${
                  on ? "bg-bg text-fg" : "text-fg-5 hover:text-fg"
                }`}
              >
                {CLIENTS[id].label}
              </button>
            );
          })}
        </div>
      }
    >
      <pre id={panelId} role="tabpanel" className="overflow-x-auto p-5 font-mono text-[13px] leading-6 text-fg">
        {CLIENTS[tab].body}
      </pre>
    </Terminal>
  );
}

/** Muted looping video that plays only while at least half of it is on screen. */
export function ViewportVideo(props: ComponentProps<"video">) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? video.play().catch(() => {}) : video.pause()),
      { threshold: 0.5 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} muted loop playsInline preload="auto" {...props} />;
}
