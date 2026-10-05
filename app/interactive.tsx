"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, Copy } from "lucide-react";

const DSN = "postgres://user:password@localhost:5432/my_database";

function Tabs<T extends string>({
  label,
  value,
  options,
  onChange,
  panelId,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
  panelId: string;
}) {
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const i = options.findIndex((o) => o.id === value);
    const next = options[(i + (e.key === "ArrowRight" ? 1 : options.length - 1)) % options.length];
    onChange(next.id);
    (e.currentTarget.querySelector(`[data-id="${next.id}"]`) as HTMLElement | null)?.focus();
  };
  return (
    <div role="tablist" aria-label={label} onKeyDown={onKey} className="flex flex-wrap gap-1">
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={o.id}
            data-id={o.id}
            role="tab"
            aria-selected={on}
            aria-controls={panelId}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(o.id)}
            className={`h-8 cursor-pointer rounded-md border px-3 font-mono text-xs transition-colors duration-150 ${
              on ? "border-line-strong bg-surface-2 text-fg" : "border-transparent text-fg-3 hover:text-fg"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return; // clipboard blocked (insecure context); the command stays selectable
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy command"}
      className={`flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-line px-2.5 font-mono text-xs text-fg-2 transition-colors duration-150 hover:border-line-strong hover:text-fg ${className}`}
    >
      {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

/** A command shown wrapped for reading; the copy button copies the one-line form. */
export function CommandBar({ lines, copy }: { lines: string[]; copy: string }) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-line bg-surface py-3 pr-3 pl-4">
      <pre className="min-w-0 flex-1 overflow-x-auto py-1.5 font-mono text-[13px] leading-[1.65] text-fg">
        {lines.map((l, i) => (
          <span key={i} className="block whitespace-pre">
            {i === 0 ? <span className="text-fg-3 select-none">$ </span> : "  "}
            {l}
          </span>
        ))}
      </pre>
      <CopyButton text={copy} />
    </div>
  );
}

const INSTALL = {
  claude: {
    label: "Claude Code",
    lines: ["claude mcp add queryio \\", `  -e QUERYIO_DATABASE_URL="${DSN}" \\`, "  -- npx -y queryio"],
    copy: `claude mcp add queryio -e QUERYIO_DATABASE_URL="${DSN}" -- npx -y queryio`,
  },
  codex: {
    label: "Codex",
    lines: ["codex mcp add queryio \\", `  --env QUERYIO_DATABASE_URL="${DSN}" \\`, "  -- npx -y queryio"],
    copy: `codex mcp add queryio --env QUERYIO_DATABASE_URL="${DSN}" -- npx -y queryio`,
  },
  check: {
    label: "Preflight",
    lines: ["npx -y queryio check"],
    copy: "npx -y queryio check",
  },
};

export function InstallCommand() {
  const [tab, setTab] = useState<keyof typeof INSTALL>("claude");
  const panelId = useId();
  const cmd = INSTALL[tab];
  return (
    <div className="text-left">
      <Tabs
        label="Install command"
        value={tab}
        onChange={setTab}
        panelId={panelId}
        options={Object.entries(INSTALL).map(([id, c]) => ({ id: id as keyof typeof INSTALL, label: c.label }))}
      />
      <div id={panelId} role="tabpanel" className="mt-3">
        <CommandBar lines={cmd.lines} copy={cmd.copy} />
      </div>
    </div>
  );
}

const SETUP = {
  claude: {
    label: "Claude Code",
    file: "terminal",
    body: `# Project scope (.mcp.json at repo root)
claude mcp add queryio -e QUERYIO_DATABASE_URL="${DSN}" -- npx -y queryio

# User scope (~/.claude.json)
claude mcp add -s user queryio -e QUERYIO_DATABASE_URL="${DSN}" -- npx -y queryio`,
  },
  json: {
    label: ".mcp.json",
    file: ".mcp.json",
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
    label: "Codex",
    file: "~/.codex/config.toml",
    body: `[mcp_servers.queryio]
command = "npx"
args = ["-y", "queryio"]
[mcp_servers.queryio.env]
QUERYIO_DATABASE_URL = "${DSN}"`,
  },
};

export function SetupConfig() {
  const [tab, setTab] = useState<keyof typeof SETUP>("json");
  const panelId = useId();
  const s = SETUP[tab];
  return (
    <div className="min-w-0">
      <Tabs
        label="MCP client"
        value={tab}
        onChange={setTab}
        panelId={panelId}
        options={Object.entries(SETUP).map(([id, c]) => ({ id: id as keyof typeof SETUP, label: c.label }))}
      />
      <div id={panelId} role="tabpanel" className="mt-3 overflow-hidden rounded-md border border-line bg-surface">
        <div className="flex h-10 items-center justify-between gap-3 border-b border-line bg-bg pr-2 pl-4">
          <span className="font-mono text-xs text-fg-2">{s.file}</span>
          <CopyButton text={s.body} className="h-7" />
        </div>
        <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-[1.65] text-fg">{s.body}</pre>
      </div>
    </div>
  );
}
