"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { Check, Minus, X } from "lucide-react";

// Placeholder inbox: replace with the real waitlist address before launch.
const WAITLIST_EMAIL = "waitlist@queryio.dev";

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
    <div role="tablist" aria-label={label} onKeyDown={onKey} className="flex gap-6 border-b border-rule">
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
            className={`-mb-px cursor-pointer border-b-2 pb-3 text-[15px] font-semibold transition-colors duration-200 ${
              on ? "border-ink text-ink" : "border-transparent text-ink-2 hover:text-ink"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

type Mode = "write" | "read";
type Result = "pass" | "fail" | "skip";

const QUERIES: Record<Mode, string> = {
  write: "UPDATE subscriptions\nSET status = 'cancelled'\nWHERE id = '3f9a-11ee'\nRETURNING id;",
  read: "SELECT plan, count(*) AS accounts,\n       sum(mrr_cents) / 100 AS mrr\nFROM subscriptions\nGROUP BY plan ORDER BY mrr DESC;",
};

const CHECKS: { label: string; write: [Result, string]; read: [Result, string] }[] = [
  { label: "One statement", write: ["pass", "1 statement"], read: ["pass", "1 statement"] },
  { label: "SELECT only", write: ["fail", "UPDATE refused"], read: ["pass", "SELECT"] },
  { label: "Allowlisted tables", write: ["skip", "not reached"], read: ["pass", "subscriptions"] },
  { label: "Row cap", write: ["skip", "not reached"], read: ["pass", "LIMIT 100 added"] },
  { label: "Timeout", write: ["skip", "not reached"], read: ["pass", "5,000 ms"] },
];

const ROWS = [
  ["scale", "412", "82,400"],
  ["growth", "890", "44,500"],
  ["starter", "2,450", "24,500"],
];

/** One stop on the path: a node on the rail, then its content. */
function Stop({
  node,
  rail,
  railTop = "top-0",
  railBottom = "bottom-0",
  children,
  className = "",
  i = 0,
}: {
  node: ReactNode;
  rail: string;
  railTop?: string;
  railBottom?: string;
  children: ReactNode;
  className?: string;
  i?: number;
}) {
  return (
    <div className={`stop-in relative grid grid-cols-[1.5rem_1fr] gap-x-4 ${className}`} style={{ "--i": i } as React.CSSProperties}>
      <span aria-hidden className={`absolute left-[11px] w-0.5 ${railTop} ${railBottom} ${rail}`} />
      <span className="relative z-10 flex h-6 items-center justify-center">{node}</span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function CheckNode({ r }: { r: Result }) {
  if (r === "pass")
    return (
      <span className="flex size-5 items-center justify-center rounded-full bg-green text-on-green">
        <Check size={12} strokeWidth={3} aria-hidden />
      </span>
    );
  if (r === "fail")
    return (
      <span className="flex size-5 items-center justify-center rounded-full bg-refuse text-paper">
        <X size={12} strokeWidth={3} aria-hidden />
      </span>
    );
  return (
    <span className="flex size-5 items-center justify-center rounded-full border border-ink-3/60 bg-green-tint text-ink-3">
      <Minus size={10} strokeWidth={3} aria-hidden />
    </span>
  );
}

export function QueryPath() {
  const [mode, setMode] = useState<Mode>("write");
  const panelId = useId();
  const refused = mode === "write";
  const failAt = CHECKS.findIndex((c) => c[mode][0] === "fail");

  return (
    <figure className="w-full">
      <Tabs
        label="Example query"
        value={mode}
        onChange={setMode}
        panelId={panelId}
        options={[
          { id: "write", label: "Try a write" },
          { id: "read", label: "Ask a question" },
        ]}
      />

      <div id={panelId} role="tabpanel" key={mode} aria-live="polite" className="px-4 pt-7">
        {/* Agent side */}
        <Stop
          node={<span className="size-3 rounded-full border-2 border-ink bg-paper" />}
          rail="bg-ink/25"
          railTop="top-3"
          className="pb-6"
        >
          <p className="text-[15px] leading-6 text-ink-2">
            Your agent calls <code className="font-mono text-ink">run_query</code> over MCP
          </p>
          <pre className="mt-3 min-h-[6.5rem] overflow-x-auto rounded-md bg-paper-2 px-4 py-3 font-mono text-sm leading-[1.6] text-ink">
            {QUERIES[mode]}
          </pre>
        </Stop>

        {/* The boundary: QueryIO */}
        <div className="relative -mx-4 border-y-2 border-green bg-green-tint px-4">
          <div className="grid grid-cols-[1.5rem_1fr] gap-x-4 pt-3 pb-2">
            <span aria-hidden className="absolute top-0 bottom-0 left-[27px] w-0.5 bg-green/40" />
            <span />
            <p className="flex flex-wrap items-baseline justify-between gap-x-4 text-[15px]">
              <span className="font-bold text-green">QueryIO</span>
              <span className="text-sm text-ink-2">checks every query before connecting</span>
            </p>
          </div>
          <ol className="pb-3">
            {CHECKS.map((c, i) => {
              const [r, detail] = c[mode];
              return (
                <li key={c.label}>
                  <Stop
                    i={i + 1}
                    node={<CheckNode r={r} />}
                    rail={refused && i >= failAt ? "bg-transparent" : "bg-green/40"}
                    className="py-1"
                  >
                    <div className="flex items-baseline justify-between gap-4 text-[15px] leading-6">
                      <span className={r === "skip" ? "text-ink-3" : "text-ink"}>
                        {c.label}
                        <span className="sr-only">: {r === "pass" ? "passed" : r === "fail" ? "refused" : "not checked"}</span>
                      </span>
                      <span
                        className={`text-right font-mono text-sm ${
                          r === "fail" ? "font-semibold text-refuse" : r === "skip" ? "text-ink-3" : "text-ink-2"
                        }`}
                      >
                        {detail}
                      </span>
                    </div>
                  </Stop>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Your data */}
        <Stop
          i={CHECKS.length + 1}
          node={
            refused ? (
              <span className="size-3 rounded-full border-2 border-ink-3/70 bg-paper" />
            ) : (
              <span className="size-3 rounded-full bg-ink" />
            )
          }
          rail={refused ? "border-l-2 border-dashed border-rule w-0" : "bg-ink/25"}
          railBottom="bottom-auto h-3"
          className="min-h-[9.75rem] pt-6"
        >
          <p className={`text-[15px] leading-6 ${refused ? "text-ink-3" : "text-ink-2"}`}>
            Read-only replica <span aria-hidden>·</span> PostgreSQL
          </p>
          {refused ? (
            <p className="mt-3 max-w-[24rem] text-[15px] leading-relaxed text-ink">
              <span className="font-semibold text-refuse">Refused before the database.</span> No connection was
              opened, so there was nothing to roll back.
            </p>
          ) : (
            <div className="reveal mt-3" style={{ "--i": CHECKS.length + 1 } as React.CSSProperties}>
              <table className="w-full font-mono text-sm tabular-nums">
                <thead>
                  <tr className="text-left text-ink-2">
                    <th className="pb-1.5 font-normal">plan</th>
                    <th className="pb-1.5 text-right font-normal">accounts</th>
                    <th className="pb-1.5 text-right font-normal">mrr</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r[0]} className="border-t border-rule">
                      <td className="py-1">{r[0]}</td>
                      <td className="py-1 text-right">{r[1]}</td>
                      <td className="py-1 text-right">{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-sm text-ink-2">3 rows in 28 ms.</p>
            </div>
          )}
        </Stop>
      </div>
      <figcaption className="mt-4 border-t border-rule pt-3 text-sm text-ink-3">Example exchange with synthetic data.</figcaption>
    </figure>
  );
}

const CONFIGS = {
  hosted: `{
  "mcpServers": {
    "queryio": {
      "url": "https://<workspace>.queryio.dev/mcp"
    }
  }
}`,
  self: `{
  "mcpServers": {
    "queryio": {
      "command": "queryio",
      "args": ["serve", "--database-url", "$READ_REPLICA_URL"]
    }
  }
}`,
};

export function SetupConfig() {
  const [where, setWhere] = useState<keyof typeof CONFIGS>("hosted");
  const panelId = useId();
  return (
    <div className="min-w-0">
      <Tabs
        label="Deployment"
        value={where}
        onChange={setWhere}
        panelId={panelId}
        options={[
          { id: "hosted", label: "Hosted" },
          { id: "self", label: "Self-hosted" },
        ]}
      />
      <div id={panelId} role="tabpanel">
        <p className="mt-5 max-w-[34rem] leading-relaxed text-ink-2">
          {where === "hosted"
            ? "We run the gateway and the replica connection. You add one URL to your MCP client."
            : "Run the open-source CLI or Docker image in your own VPC. Credentials never leave your network."}
        </p>
        <pre className="mt-5 overflow-x-auto rounded-md bg-paper px-5 py-4 font-mono text-sm leading-[1.65] text-ink">
          {CONFIGS[where]}
        </pre>
        <p className="mt-3 text-sm text-ink-3">Illustrative config. Final names ship with the beta.</p>
      </div>
    </div>
  );
}

export function WaitlistForm({ tone }: { tone: "paper" | "green" }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "sent">("idle");
  const id = useId();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      return;
    }
    const body = `Please add ${email} to the QueryIO waitlist.\n\nDatabase:\nAgent client:`;
    window.location.href = `mailto:${WAITLIST_EMAIL}?subject=${encodeURIComponent("QueryIO waitlist")}&body=${encodeURIComponent(body)}`;
    setState("sent");
  };

  const green = tone === "green";
  const field = green
    ? "border-on-green-2/40 bg-green-deep text-on-green placeholder:text-on-green-2/80 focus:border-on-green"
    : "border-ink/20 bg-paper text-ink placeholder:text-ink-3 focus:border-green";
  const button = green ? "bg-paper text-ink hover:bg-green-tint" : "bg-green text-on-green hover:bg-green-hover";
  const helper = green ? "text-on-green-2" : "text-ink-2";

  return (
    <form onSubmit={submit} noValidate className="w-full max-w-[28rem]">
      <label htmlFor={id} className="sr-only">
        Work email
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={id}
          type="email"
          autoComplete="email"
          value={email}
          aria-invalid={state === "error"}
          aria-describedby={`${id}-help`}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state !== "idle") setState("idle");
          }}
          placeholder="you@company.com"
          className={`h-12 w-full min-w-0 rounded-md border px-4 text-base outline-none transition-colors sm:flex-1 ${field}`}
        />
        <button
          type="submit"
          className={`h-12 shrink-0 cursor-pointer rounded-md px-5 text-base font-semibold transition-colors duration-200 ${button}`}
        >
          Join the waitlist
        </button>
      </div>
      <p
        id={`${id}-help`}
        aria-live="polite"
        className={`mt-2.5 min-h-5 text-sm ${state === "error" ? (green ? "text-on-green" : "text-refuse") : helper}`}
      >
        {state === "error" ? (
          "Enter an email like you@company.com."
        ) : state === "sent" ? (
          <>Your email app should open with a note to us. If not, write to {WAITLIST_EMAIL}.</>
        ) : (
          "Early access in small cohorts. One email when yours opens."
        )}
      </p>
    </form>
  );
}
