import type { ReactNode } from "react";
import {
  ArrowUpRight,
  Check,
  EyeOff,
  FileClock,
  Gauge,
  Github,
  Minus,
  Network,
  Plus,
  ShieldCheck,
  Terminal,
  Timer,
  TriangleAlert,
} from "lucide-react";
import { CommandBar, InstallCommand, SetupConfig } from "./interactive";

const REPO = "https://github.com/aradhyas8/queryio-mcp";
const LINKS = {
  repo: REPO,
  readme: `${REPO}#readme`,
  benchmark: `${REPO}/blob/main/BENCHMARK.md`,
  issues: `${REPO}/issues`,
  license: `${REPO}/blob/main/LICENSE`,
  npm: "https://www.npmjs.com/package/queryio",
};

const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#benchmark", label: "Benchmark" },
  { href: "#security", label: "Security" },
  { href: "#setup", label: "Setup" },
  { href: "#faq", label: "FAQ" },
];

const TRUST = [
  ["License", "MIT"],
  ["Transport", "MCP stdio"],
  ["Database", "PostgreSQL"],
  ["Tools", "4 read-oriented"],
  ["Install", "npx -y queryio"],
];

const BENEFITS = [
  {
    icon: Network,
    title: "Record neighborhoods in one call",
    body: "inspect_row returns a row plus its depth-1 foreign-key neighbors, in both directions.",
  },
  {
    icon: Gauge,
    title: "Bounded by default",
    body: "100 rows, 32 KB per response, 200-character values. has_more instead of expensive counts.",
  },
  {
    icon: Timer,
    title: "Server-side timeouts",
    body: "statement_timeout 5s and lock_timeout 1s are enforced inside Postgres, not abandoned client-side.",
  },
  {
    icon: EyeOff,
    title: "Secrets stay out of context",
    body: "password, token, api_key and similar columns come back as [redacted].",
  },
  {
    icon: FileClock,
    title: "Metadata-only audit log",
    body: "One JSONL line per call in ~/.queryio/audit.jsonl. No row values or raw SQL by default.",
  },
  {
    icon: Terminal,
    title: "No config files",
    body: "Environment variables only, so credentials never show up in process listings.",
  },
];

const STEPS: [string, ReactNode][] = [
  ["Set the connection string", <code key="c">QUERYIO_DATABASE_URL</code>],
  ["Run the preflight", <code key="c">npx -y queryio check</code>],
  ["Add QueryIO to your MCP client", "Claude Code, Codex, or any stdio MCP client"],
  ["Ask a debugging question", "“User 4821 says their account never activated.”"],
];

const TOOLS = [
  ["inspect_row", "One row by primary key plus its foreign-key neighborhood, bounded, truncated, and redacted."],
  ["describe_tables", "Columns, keys, indexes, and pg_stats planner statistics for several tables at once."],
  ["list_tables", "Compact catalog with planner row estimates. Never scans tables."],
  ["query", "One bounded read-only statement: SELECT, WITH, VALUES, TABLE, or SHOW."],
];

const COMPARE = [
  ["Write protection", "Depends on the role", "Varies by server", "READ ONLY transaction, unconditional ROLLBACK"],
  ["Timeouts", "None by default", "Often client-side", "Statement and lock timeouts inside Postgres"],
  ["Result size", "Unbounded", "Varies", "Row, byte, and value caps"],
  ["Secret columns", "Returned as-is", "Varies", "Name-based redaction"],
  ["Investigating one record", "Chain of manual joins", "Chain of exploratory queries", "inspect_row, one call"],
  ["Audit trail", "Shell history", "Varies", "Metadata-only JSONL"],
];

const STATS = [
  ["−38.5%", "Median DB output bytes", "Forensic tasks, vs raw psql"],
  ["−18.8%", "Median DB interactions", "Forensic tasks, vs raw psql"],
  ["100%", "Diagnostic accuracy", "All three arms, graded by hand"],
];

const ENFORCED = [
  "Single-statement extended query protocol",
  "BEGIN READ ONLY and ROLLBACK on every call",
  "Statement and lock timeouts set inside Postgres",
  "Cursor streaming with bounded memory",
  "Catalog-resolved identifiers and bind parameters",
  "No DSNs on the command line, no .env scanning",
];

const NOT_GUARANTEED = [
  "QueryIO is the safe default path, not a sandbox",
  "A superuser role breaks containment",
  "Name-based redaction can be bypassed with aliases in query",
  "dblink and FDW connections escape the read-only transaction",
];

const ROLE_SQL = `CREATE ROLE queryio_role WITH LOGIN PASSWORD 'CHANGE_ME_PASSWORD';
GRANT CONNECT ON DATABASE "your_database" TO queryio_role;
GRANT USAGE ON SCHEMA public TO queryio_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO queryio_role;`;

const DEFAULTS = [
  ["QUERYIO_STATEMENT_TIMEOUT_MS", "5000"],
  ["QUERYIO_LOCK_TIMEOUT_MS", "1000"],
  ["QUERYIO_MAX_ROWS", "100"],
  ["QUERYIO_MAX_RESPONSE_BYTES", "32768"],
  ["QUERYIO_MAX_VALUE_LENGTH", "200"],
  ["QUERYIO_AUDIT_LOG", "~/.queryio/audit.jsonl"],
];

const FAQ: [string, ReactNode][] = [
  [
    "Is QueryIO a sandbox?",
    "No. It is the safe default path. An agent that already has shell access can still read DATABASE_URL from .env and run psql directly.",
  ],
  [
    "Can it write to my database?",
    "Every call runs inside BEGIN READ ONLY and ends in ROLLBACK, so INSERT, UPDATE, DELETE, and DDL cannot commit. That guarantee weakens with a superuser role or with dblink and FDW connections, so connect as a dedicated read-only role.",
  ],
  ["Which databases are supported?", "PostgreSQL."],
  ["Which agents work with it?", "Any MCP client that runs stdio servers, including Claude Code, Codex, and Cursor."],
  [
    "What gets logged?",
    "One JSON line per tool call: timestamp, tool, duration, status, tables, row and byte counts, and a SHA-256 fingerprint of the SQL. Row values, primary-key values, and raw SQL are never logged unless you set QUERYIO_AUDIT_INCLUDE_SQL=true. Set QUERYIO_AUDIT_LOG=off to disable it.",
  ],
  [
    "Why does inspect_row need a primary key?",
    "It addresses one concrete row. Tables without a declared primary key return a no_primary_key error, and composite keys need every column. Use query for anything else.",
  ],
];

const FOOTER: [string, [string, string][]][] = [
  ["Product", [["How it works", "#how"], ["Benchmark", "#benchmark"], ["Security", "#security"], ["Setup", "#setup"]]],
  ["Resources", [["README", LINKS.readme], ["BENCHMARK.md", LINKS.benchmark], ["npm", LINKS.npm]]],
  ["Project", [["GitHub", LINKS.repo], ["Issues", LINKS.issues], ["MIT License", LINKS.license]]],
];

/* ---------- primitives ---------- */

const btn =
  "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium whitespace-nowrap transition-colors duration-150";
const btnPrimary = `${btn} bg-fg text-bg hover:bg-invert-hover`;
const btnSecondary = `${btn} border border-line-strong text-fg hover:bg-surface-2`;

function Frame({ id, children, className = "" }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className="border-b border-line">
      <div className={`mx-auto max-w-[1120px] px-4 sm:border-x sm:border-line sm:px-6 ${className}`}>{children}</div>
    </section>
  );
}

function Chapter({ index, label, title, tail }: { index: string; label: string; title: string; tail: string }) {
  return (
    <header className="mb-12 max-w-[52rem] md:mb-14">
      <p className="font-mono text-xs tracking-[0.06em] text-fg-3 uppercase">
        [ {index} / 09 ]&nbsp;&nbsp;{label}
      </p>
      <h2 className="mt-5 text-[32px] leading-[1.08] font-medium tracking-[-0.03em] md:text-[44px]">
        {title} <span className="text-fg-2">{tail}</span>
      </h2>
    </header>
  );
}

const label = "font-mono text-xs tracking-[0.06em] text-fg-3 uppercase";

/* ---------- investigation demo ---------- */

function Transcript() {
  const lines: ReactNode[] = [
    <p key="ask" className="text-fg">
      <span className="text-fg-3 select-none">&gt; </span>User 4821 says their account never activated. Find out why.
    </p>,
    <p key="read">
      <span className="text-fg-3">● read</span> <span className="text-fg">src/activation.ts</span>
      <span className="block pl-4 text-fg-3">activateUser requires a membership in users.org_id</span>
    </p>,
    <p key="inspect">
      <span className="text-fg-3">● </span>
      <span className="text-fg">inspect_row</span>{" "}
      <span className="break-all text-fg-2">{`{"table":"public.users","key":{"id":4821}}`}</span>
      <span className="block pl-4 text-fg-3">← 1 row + foreign-key neighborhood · password_hash redacted</span>
    </p>,
    <p key="query">
      <span className="text-fg-3">● </span>
      <span className="text-fg">query</span>{" "}
      <span className="text-fg-2">SELECT 1 FROM memberships WHERE org_id = 88 AND user_id = 4821</span>
      <span className="block pl-4 text-fg-3">← 0 rows</span>
    </p>,
  ];
  return (
    <div className="flex flex-col gap-4 p-5 font-mono text-[13px] leading-[1.65]">
      {lines.map((l, i) => (
        <div key={i} className="line-in" style={{ "--i": i } as React.CSSProperties}>
          {l}
        </div>
      ))}
      <div className="line-in mt-2 rounded-md border border-line bg-bg p-4" style={{ "--i": 4 } as React.CSSProperties}>
        <p className={label}>Diagnosis</p>
        <p className="mt-2 font-sans text-[15px] leading-relaxed text-fg">
          User 4821 verified their email but is stuck in <code className="font-mono text-[13px]">pending</code>. Support
          moved them from org 21 to org 88 with <code className="font-mono text-[13px]">transferUser</code>, which updates{" "}
          <code className="font-mono text-[13px]">users.org_id</code> without creating a membership in org 88.{" "}
          <code className="font-mono text-[13px]">activateUser</code> finds none and returns{" "}
          <code className="font-mono text-[13px]">no_membership</code> silently.
          <span aria-hidden className="caret ml-1 inline-block h-4 w-2 translate-y-0.5 bg-fg" />
        </p>
      </div>
    </div>
  );
}

function Rel({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div>
      <p className={`${label} mb-2`}>{name}</p>
      <div className="divide-y divide-line border border-line font-mono text-[12.5px]">{children}</div>
    </div>
  );
}

function Row({ cells, hit = false }: { cells: ReactNode[]; hit?: boolean }) {
  return (
    <div
      className={`grid min-h-10 items-center gap-3 px-3 py-2 ${
        hit ? "border-l-2 border-l-fg bg-surface-2 text-fg" : "text-fg-2"
      }`}
      style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }}
    >
      {cells.map((c, i) => (
        <span key={i} className="min-w-0 truncate">
          {c}
        </span>
      ))}
    </div>
  );
}

function InspectResult() {
  const user = [
    ["id", "4821"],
    ["org_id", "88"],
    ["status", "pending"],
    ["email_verified_at", "not null"],
    ["password_hash", "[redacted]"],
  ];
  return (
    <div className="flex flex-col gap-5 p-5">
      <Rel name="public.users · root">
        {user.map(([k, v]) => (
          <Row key={k} cells={[<span key="k" className="text-fg-3">{k}</span>, <span key="v" className="text-fg">{v}</span>]} />
        ))}
      </Rel>
      <Rel name="memberships · incoming">
        <Row cells={["org_id 21", "user_id 4821", "accepted_at null"]} />
        <Row hit cells={["no row for org_id = 88"]} />
      </Rel>
      <Rel name="user_events · incoming">
        <Row cells={[<span key="e">user.signed_up <span className="text-fg-3">{`{"org_id":21}`}</span></span>]} />
        <Row hit cells={[<span key="e">org.transferred {`{"from_org_id":21,"to_org_id":88}`}</span>]} />
        <Row cells={["email.verified"]} />
      </Rel>
      <ul className="flex flex-wrap gap-2 font-mono text-[11px]">
        {["bounded", "truncated", "redacted"].map((t) => (
          <li key={t} className="rounded-md border border-line px-2 py-1 text-fg-3">
            {t}
          </li>
        ))}
        <li className="rounded-md border border-line-strong px-2 py-1 text-fg">READ ONLY · ROLLBACK</li>
      </ul>
    </div>
  );
}

/* ---------- page ---------- */

export default function Home() {
  return (
    <main id="top">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/95">
        <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between gap-6 px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.01em]">
            <span className="rounded-[4px] border border-line-strong px-1.5 py-0.5 font-mono text-[11px] font-normal text-fg-2">
              [q]
            </span>
            QueryIO
          </a>
          <nav aria-label="Sections" className="hidden items-center gap-7 text-sm text-fg-2 lg:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="transition-colors duration-150 hover:text-fg">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href={LINKS.repo} className={`${btnSecondary} hidden h-8 px-3 sm:inline-flex`}>
              <Github size={15} aria-hidden /> GitHub
            </a>
            <a href="#setup" className={`${btnPrimary} h-8 px-3`}>
              Get started
            </a>
          </div>
        </div>
      </header>

      {/* Hero, command, and the investigation share one frame: claim, action, proof */}
      <Frame className="pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="mx-auto max-w-[920px] text-center">
          <p className="inline-flex rounded-md border border-line px-3 py-1.5 font-mono text-xs tracking-[0.06em] text-fg-2 uppercase">
            Open-source MCP server for PostgreSQL
          </p>
          <h1 className="mt-8 text-[40px] leading-[1.04] font-medium tracking-[-0.035em] sm:text-[52px] md:text-[64px]">
            Give your coding agent database access <span className="text-fg-2 md:block">without giving it your database.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-[620px] text-[17px] leading-[1.55] text-fg-2 md:text-lg">
            QueryIO gives Claude Code, Codex, and Cursor four bounded, read-oriented tools for Postgres. Every call runs in
            a READ ONLY transaction with server-side timeouts, then rolls back.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href="#setup" className={btnPrimary}>
              Get started
            </a>
            <a href={LINKS.repo} className={btnSecondary}>
              <Github size={16} aria-hidden /> View on GitHub
            </a>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-[820px]">
          <InstallCommand />
          <p className="mt-3 text-left font-mono text-xs leading-relaxed text-fg-3">
            Credentials are read only from QUERYIO_DATABASE_URL. QueryIO refuses DSNs passed as arguments and never scans
            .env files.
          </p>
        </div>

        <figure className="mt-16 overflow-hidden rounded-md border border-line bg-surface text-left md:mt-20">
          <figcaption className="flex h-10 items-center justify-between gap-4 border-b border-line px-5 font-mono text-xs">
            <span className="truncate text-fg-2">agent session · claude code + queryio</span>
            <span className="hidden text-fg-3 sm:inline">condensed from benchmark task 1</span>
          </figcaption>
          <div className="grid lg:grid-cols-2 lg:divide-x lg:divide-line">
            <Transcript />
            <div className="border-t border-line lg:border-t-0">
              <InspectResult />
            </div>
          </div>
        </figure>
      </Frame>

      {/* Technical trust strip */}
      <Frame>
        <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {TRUST.map(([k, v]) => (
            <div
              key={k}
              className="border-line px-1 py-6 not-last:border-b sm:px-5 sm:not-last:border-b-0 lg:border-r lg:first:pl-0 lg:last:border-r-0"
            >
              <dt className={label}>{k}</dt>
              <dd className={`mt-2 text-sm text-fg ${k === "Install" ? "font-mono" : ""}`}>{v}</dd>
            </div>
          ))}
        </dl>
      </Frame>

      <Frame id="why" className="py-20 md:py-24">
        <Chapter index="02" label="Why QueryIO" title="Runtime truth for your agent." tail="Without the blast radius." />
        <ul className="grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <li key={b.title} className="border-r border-b border-line p-7 md:p-8">
              <b.icon size={18} aria-hidden className="text-fg" />
              <h3 className="mt-6 text-[17px] leading-snug font-medium">{b.title}</h3>
              <p className="mt-2 leading-relaxed text-fg-2">{b.body}</p>
            </li>
          ))}
        </ul>
      </Frame>

      <Frame id="how" className="py-20 md:py-24">
        <Chapter index="03" label="How it works" title="Four tools." tail="One read-only path." />
        <div className="grid gap-4 lg:grid-cols-[5fr_7fr]">
          <ol className="divide-y divide-line border border-line">
            {STEPS.map(([title, detail], i) => (
              <li key={i} className="grid grid-cols-[2rem_1fr] p-5">
                <span className="font-mono text-xs leading-6 text-fg-3">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="leading-6 font-medium text-fg">{title}</p>
                  <p className="mt-1 text-sm text-fg-2 [&_code]:font-mono [&_code]:text-[13px] [&_code]:text-fg">{detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <dl className="divide-y divide-line border border-line">
            {TOOLS.map(([name, desc]) => (
              <div key={name} className="grid gap-1 p-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <dt className="font-mono text-[13px] leading-6 text-fg">{name}</dt>
                <dd className="leading-6 text-fg-2">{desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Frame>

      <Frame id="compare" className="py-20 md:py-24">
        <Chapter index="04" label="Compare" title="QueryIO vs raw psql" tail="vs a generic database MCP." />
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[720px] border-collapse border border-line text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="w-[22%] p-4 font-normal">
                  <span className="sr-only">Property</span>
                </th>
                <th className={`p-4 font-normal ${label}`}>Raw psql</th>
                <th className={`p-4 font-normal ${label}`}>Generic Postgres MCP</th>
                <th className="bg-surface p-4 font-mono text-xs font-medium tracking-[0.06em] text-fg uppercase">QueryIO</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([k, a, b, q]) => (
                <tr key={k} className="border-b border-line last:border-b-0">
                  <th scope="row" className="p-4 font-normal text-fg-3">
                    {k}
                  </th>
                  <td className="p-4 text-fg-2">{a}</td>
                  <td className="p-4 text-fg-2">{b}</td>
                  <td className="bg-surface p-4 text-fg">{q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 font-mono text-xs text-fg-3">Generic MCP behavior varies by server.</p>
      </Frame>

      <Frame id="benchmark" className="py-20 md:py-24">
        <Chapter index="05" label="Benchmark" title="Measured honestly." tail="Including where it fell short." />
        <dl className="grid border-t border-l border-line sm:grid-cols-3">
          {STATS.map(([n, k, foot]) => (
            <div key={k} className="flex flex-col border-r border-b border-line p-7 md:p-8">
              <dt className={`order-2 mt-5 ${label}`}>{k}</dt>
              <dd className="order-1 text-[44px] leading-none font-medium tracking-[-0.03em] tabular-nums md:text-5xl">{n}</dd>
              <dd className="order-3 mt-1.5 text-sm text-fg-2">{foot}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 rounded-md border border-line bg-surface p-6 md:p-8">
          <p className={label}>Win condition not met</p>
          <p className="mt-3 max-w-[60rem] leading-relaxed text-fg-2">
            We pre-declared ~30% fewer interactions or bytes on forensic tasks. <span className="text-fg">Median bytes
            cleared it.</span> Mean interactions (−16.8%) and mean bytes (−20.7%) did not, and aggregate tasks regressed
            on mean bytes (+27.9%). The QueryIO arm ran through a CLI shim, not the MCP transport, and logged 23 failed
            commands from shell quoting.
          </p>
          <p className="mt-5 font-mono text-xs leading-relaxed text-fg-3">
            25 runs · 3 arms: raw psql, QueryIO, DBHub reference · 5 tasks · seeded SaaS database · same agent model
          </p>
          <a
            href={LINKS.benchmark}
            className="mt-5 inline-flex items-center gap-1 text-sm text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-fg"
          >
            Read BENCHMARK.md <ArrowUpRight size={14} aria-hidden />
          </a>
        </div>
      </Frame>

      <Frame id="security" className="py-20 md:py-24">
        <Chapter index="06" label="Security" title="What QueryIO enforces." tail="And what it doesn’t." />
        <div className="grid border border-line md:grid-cols-2 md:divide-x md:divide-line">
          <div className="p-7 md:p-8">
            <p className={`flex items-center gap-2 ${label}`}>
              <ShieldCheck size={14} aria-hidden /> Enforced
            </p>
            <ul className="mt-5 space-y-3">
              {ENFORCED.map((e) => (
                <li key={e} className="flex gap-3 leading-6 text-fg">
                  <Check size={15} aria-hidden className="mt-[5px] shrink-0 text-fg-2" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-line p-7 md:border-t-0 md:p-8">
            <p className={`flex items-center gap-2 ${label}`}>
              <TriangleAlert size={14} aria-hidden /> Not guaranteed
            </p>
            <ul className="mt-5 space-y-3">
              {NOT_GUARANTEED.map((e) => (
                <li key={e} className="flex gap-3 leading-6 text-fg-2">
                  <Minus size={15} aria-hidden className="mt-[5px] shrink-0 text-fg-3" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4 overflow-hidden rounded-md border border-line bg-surface">
          <p className="flex h-10 items-center border-b border-line px-5 font-mono text-xs text-fg-2">
            Recommended: a dedicated read-only role
          </p>
          <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-[1.7] text-fg">{ROLE_SQL}</pre>
        </div>
      </Frame>

      <Frame id="setup" className="py-20 md:py-24">
        <Chapter index="07" label="Setup" title="Running in" tail="under two minutes." />
        <div className="grid gap-4 lg:grid-cols-[7fr_5fr]">
          <SetupConfig />
          <div className="lg:pt-11">
            <dl className="divide-y divide-line border border-line">
              <div className={`px-4 py-3 ${label}`}>Defaults · env vars only</div>
              {DEFAULTS.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4 px-4 py-3 font-mono text-xs">
                  <dt className="min-w-0 truncate text-fg-2">{k}</dt>
                  <dd className="shrink-0 text-fg">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Frame>

      <Frame id="faq" className="py-20 md:py-24">
        <Chapter index="08" label="FAQ" title="Questions," tail="answered plainly." />
        <div className="divide-y divide-line border border-line">
          {FAQ.map(([q, a], i) => (
            <details key={q} open={i === 0} className="group">
              <summary className="flex cursor-pointer items-center justify-between gap-6 px-5 py-5 text-base text-fg transition-colors hover:bg-surface md:px-6">
                {q}
                <Plus size={16} aria-hidden className="shrink-0 text-fg-3 group-open:hidden" />
                <Minus size={16} aria-hidden className="hidden shrink-0 text-fg-3 group-open:block" />
              </summary>
              <p className="max-w-[48rem] px-5 pb-6 leading-relaxed text-fg-2 md:px-6">{a}</p>
            </details>
          ))}
        </div>
      </Frame>

      <Frame className="py-24 text-center md:py-28">
        <p className={label}>[ 09 / 09 ]</p>
        <h2 className="mx-auto mt-5 max-w-[46rem] text-[32px] leading-[1.08] font-medium tracking-[-0.03em] md:text-[44px]">
          Let your agent read the database. <span className="text-fg-2">Not own it.</span>
        </h2>
        <div className="mx-auto mt-10 max-w-[420px] text-left">
          <CommandBar lines={["npx -y queryio check"]} copy="npx -y queryio check" />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href="#setup" className={btnPrimary}>
            Get started
          </a>
          <a href={LINKS.repo} className={btnSecondary}>
            <Github size={16} aria-hidden /> View on GitHub
          </a>
        </div>
      </Frame>

      <footer>
        <div className="mx-auto grid max-w-[1120px] gap-10 px-4 py-14 sm:border-x sm:border-line sm:px-6 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <p className="flex items-center gap-2.5 text-[15px] font-semibold">
              <span className="rounded-[4px] border border-line-strong px-1.5 py-0.5 font-mono text-[11px] font-normal text-fg-2">
                [q]
              </span>
              QueryIO
            </p>
            <p className="mt-3 max-w-[18rem] text-sm leading-relaxed text-fg-2">
              Bounded, read-oriented PostgreSQL investigation for coding agents.
            </p>
          </div>
          {FOOTER.map(([title, items]) => (
            <nav key={title} aria-label={title}>
              <p className={label}>{title}</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {items.map(([t, href]) => (
                  <li key={t}>
                    <a href={href} className="text-fg-2 transition-colors duration-150 hover:text-fg">
                      {t}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="border-t border-line">
          <p className="mx-auto max-w-[1120px] px-4 py-6 font-mono text-xs text-fg-3 sm:border-x sm:border-line sm:px-6">
            © 2026 QueryIO · MIT License
          </p>
        </div>
      </footer>
    </main>
  );
}
