import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Terminal } from "./interactive";
import { AgentPicker } from "./agent-picker";
import { SECURITY_DOCS, SETUP_COMMAND, SiteFooter, SiteNav } from "./site";
import { SITE_DESCRIPTION, SITE_URL } from "./seo";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const software = {
  "@context": "https://schema.org",
  "@type": ["SoftwareApplication", "SoftwareSourceCode"],
  "@id": `${SITE_URL}/#software`,
  name: "QueryIO",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  codeRepository: "https://github.com/aradhyas8/queryio-mcp",
  license: "https://github.com/aradhyas8/queryio-mcp/blob/main/LICENSE",
  applicationCategory: "DeveloperApplication",
  runtimePlatform: "Node.js 20+",
  featureList: ["PostgreSQL database investigation over MCP", "Bounded inspection of records and declared foreign-key relationships", "Read-oriented SQL and schema inspection"],
  sameAs: ["https://github.com/aradhyas8/queryio-mcp", "https://www.npmjs.com/package/queryio"],
};

/* ---------- primitives ---------- */

function Section({ id, children, className = "py-20" }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`mx-auto max-w-5xl border-b border-line px-6 ${className}`}>
      {children}
    </section>
  );
}

function SectionLabel({ children, className = "mb-12", as: Tag = "h2" }: { children: ReactNode; className?: string; as?: "h2" | "p" }) {
  return <Tag className={`font-mono text-xs font-normal tracking-widest text-fg-4 uppercase ${className}`}>{children}</Tag>;
}

function FeatureCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-line bg-card p-6 transition-colors duration-150 hover:border-line-hover hover:bg-card-hover">
      <h3 className="text-sm font-medium text-fg">{title}</h3>
      <p className="text-sm leading-relaxed text-fg-4">{children}</p>
    </div>
  );
}

const pill = "rounded-md border px-2 py-0.5 font-mono text-xs";
const ghostLink =
  "rounded-md border border-line px-3 py-1.5 font-mono text-xs text-fg-4 transition-colors duration-150 hover:border-fg-7 hover:text-ink";

/* ---------- content ---------- */

const STEPS: { n: string; title: string; window: string; copy?: string; code: ReactNode; body: string }[] = [
  {
    n: "01",
    title: "Set up QueryIO",
    window: "terminal",
    copy: SETUP_COMMAND,
    code: (
      <>
        <span className="text-fg-4">$</span> {SETUP_COMMAND}
        {"\n\n"}
        <span className="text-fg-4"># Choose your agents</span>
        {"\n"}<span className="text-fg-4"># Review and confirm</span>
      </>
    ),
    body: "The wizard configures your selected coding agents, previews changes before writing, and checks PostgreSQL connectivity when QUERYIO_DATABASE_URL is set. Choose project or global scope.",
  },
  {
    n: "02",
    title: "Inspect a record",
    window: "inspect_row",
    code: (
      <>
        {"{"}
        {"\n"}
        {'  "table": "public.invoices",'}
        {"\n"}
        {'  "key": { "id": 90017 }'}
        {"\n"}
        {"}"}
        {"\n\n"}
        <span className="text-fg-5"># ← paid invoice, linked</span>
        {"\n"}
        <span className="text-fg-5">#   org + subscription</span>
      </>
    ),
    body: "inspect_row fetches a record by its full primary key and bounded samples of immediate declared foreign-key relationships, in both directions, in one MCP call.",
  },
  {
    n: "03",
    title: "Verify with targeted SQL",
    window: "query",
    code: (
      <>
        SELECT id, status, amount_cents
        {"\n"}FROM public.invoices
        {"\n"}WHERE org_id = 142
        {"\n"}
        {"  "}AND period_start = &apos;2026-09-05&apos;;
        {"\n\n"}
        <span className="text-fg-5"># ← bounded, read-only</span>
      </>
    ),
    body: "The agent uses your code to interpret the records, then checks its diagnosis with read-oriented SQL. Here, a second invoice is still open for the same billing period.",
  },
];

const COMPARE = [
  {
    title: "Starting with SQL",
    badge: "SQL access",
    intro: "The agent writes the lookups that connect a symptom to related records.",
    points: [
      "Find the record behind the bug.",
      "Look up its relationships in the schema.",
      "Write joins or follow-up queries to gather related rows.",
    ],
    flow: "schema → SQL → records → follow-up SQL",
    dark: false,
  },
  {
    title: "QueryIO",
    badge: "inspect_row + SQL",
    intro: "Start with the failing record and related evidence in one MCP call.",
    points: [
      "Inspect a user, invoice, or project by its primary key.",
      "Get bounded samples of rows linked by declared foreign keys.",
      "Use application code and targeted SQL to verify the diagnosis.",
    ],
    flow: "record → inspect_row → targeted SQL",
    dark: true,
  },
];

const CAPABILITIES: [string, string][] = [
  ["Inspect a record", "inspect_row fetches one row by its full primary key and samples of rows one declared foreign key away, in one MCP call."],
  ["Follow linked rows", "Incoming and outgoing relationships, up to 5 rows per relation and 25 relations by default. Check has_more and skipped or failed relations."],
  ["Verify with SQL", "query accepts one read-oriented SELECT, WITH, VALUES, TABLE or SHOW statement per call, including joins and aggregates."],
  ["Understand the schema", "list_tables and describe_tables return columns, keys, indexes and planner stats without scanning tables."],
  ["Bounded results", "query defaults to 100 returned rows and a 32 KiB result budget. Long values are shortened with a size marker."],
  ["Redact sensitive values", "Exact column-name matches, such as password, token or api_key, return [redacted]. Aliases and expressions can bypass redaction."],
  ["Read-only execution", "Investigation tools run in READ ONLY transactions and roll back afterward. Database permissions still determine what functions can do."],
  ["Server-side timeouts", "Postgres cancels statements after 5 seconds and lock waits after 1 second."],
  ["Audit operations", "Local audit logging records tool metadata by default, without row values. Logging failures do not stop an investigation."],
];

const LIMITS: [string, string][] = [
  ["enforced", "Investigation tools use READ ONLY transactions and reject direct data changes. Use a dedicated role with narrow read permissions."],
  ["enforced", "Credentials come only from QUERYIO_DATABASE_URL. Never from arguments or .env files."],
  ["not guaranteed", "QueryIO is not a sandbox. An agent with shell access can run psql on its own."],
  ["not guaranteed", "Redaction matches column names. A hand-written query can alias a column past it."],
  ["not guaranteed", "Privileged roles, side-effecting functions, dblink or foreign data wrappers can affect data outside the read-only transaction."],
];

const STATS = [
  ["16 → 13", "Database calls", "Median, record-level tasks, psql → QueryIO"],
  ["25 KB → 16 KB", "Database output", "Median, record-level tasks, psql → QueryIO"],
  ["100%", "Correct answers", "Every arm, graded by hand"],
];

const NOT_SHOWN = [
  "We set a target in advance: about 30% fewer calls or less output. Averages missed it: 17% fewer calls and 21% less output on record-level tasks.",
  "On the counting tasks, QueryIO used more output on average, not less.",
  "It is a small study: two runs per task, one model.",
  "We measured bytes of database output, not model tokens.",
  "The QueryIO runs used a command-line wrapper, not the MCP server.",
];

/* ---------- page ---------- */

export default function Home() {
  return (
    <main className="min-h-screen bg-bg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(software).replace(/</g, "\\u003c") }} />
      <SiteNav />

      {/* Hero */}
      <Section id="top" className="pt-10 pb-12 sm:pt-12 sm:pb-14">
        <div id="content" tabIndex={-1} />
        <p className="font-mono text-xs tracking-widest text-fg-6 uppercase">
          Database debugging <span className="px-2">·</span> MCP server
        </p>
        <h1 className="mt-5 max-w-2xl text-4xl leading-[1.05] font-bold tracking-tight text-ink sm:text-5xl">
          Debug database issues with your AI coding agent.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-2">
          QueryIO is an open-source PostgreSQL MCP server that helps coding agents investigate application bugs with database evidence: inspect a record,
          see related rows, and verify a diagnosis with bounded, read-oriented SQL.
        </p>
        <p className="mt-3 text-sm text-fg-3">Currently supports PostgreSQL only.</p>
        <AgentPicker />
        <p className="mt-5 max-w-3xl text-[13px] leading-relaxed text-fg-3">
          Set <code className="font-mono text-fg">QUERYIO_DATABASE_URL</code> in the environment that starts your agent. The wizard configures one or more agents with project or global scope and previews changes before writing. It does not store credentials or provision PostgreSQL.{" "}
          <Link href="/install" className="inline-block underline decoration-fg-7 underline-offset-4 hover:text-ink">Setup details</Link>
          {" · "}<Link href="/install#connection" className="inline-block underline decoration-fg-7 underline-offset-4 hover:text-ink">Verify your connection</Link>
        </p>
        <p className="mt-4 font-mono text-xs text-fg-4">Read-only · bounded · redacted · audited</p>
      </Section>

      {/* Demo */}
      <Section id="demo">
        <SectionLabel as="p" className="mb-4">See it work</SectionLabel>
        <h2 id="demo-title" className="max-w-2xl text-2xl leading-tight font-semibold tracking-tight text-ink sm:text-3xl">
          Paid invoice. Suspended workspace. Why?
        </h2>
        <p id="demo-description" className="mt-4 mb-8 max-w-xl text-sm leading-relaxed text-fg-4">
          Follow an agent from the billing code to a paid invoice and its linked records, then through a SQL
          check that reveals the duplicate invoice keeping the workspace suspended.
        </p>
        <video
          src="/queryio-film-web.mp4"
          poster="/queryio-film-poster.png"
          controls
          playsInline
          preload="metadata"
          aria-labelledby="demo-title"
          aria-describedby="demo-description demo-note"
          className="w-full rounded-xl border border-line bg-cmd shadow-[0_0_0_1px_rgb(0_0_0/0.04),0_24px_64px_-12px_rgb(0_0_0/0.12)]"
        >
          <a href="/queryio-film-web.mp4">Watch the QueryIO debugging walkthrough.</a>
        </video>
        <p id="demo-note" className="mt-4 text-[13px] leading-relaxed text-fg-4">
          32-second illustrated walkthrough · PostgreSQL · No audio. Use fullscreen for small text.
        </p>
        <details className="mt-4 text-sm leading-relaxed text-fg-4">
          <summary className="w-fit cursor-pointer text-fg-3">Read the demo walkthrough</summary>
          <ol className="mt-3 max-w-2xl list-decimal space-y-2 pl-5">
            <li>The agent reads the billing code: any open invoice more than 14 days past due keeps a workspace suspended.</li>
            <li>inspect_row returns paid invoice 90017, its suspended organization, and its past-due subscription.</li>
            <li>A targeted SQL query finds invoice 90018 for the same period and $49 amount, still open and 23 days overdue.</li>
            <li>The agent diagnoses the duplicate invoice as the blocker and recommends voiding it and reactivating the workspace. QueryIO does not apply the fix.</li>
          </ol>
        </details>
      </Section>

      {/* How it works */}
      <Section id="how">
        <SectionLabel>How it works</SectionLabel>
        <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="flex min-w-0 flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-fg-7">{s.n}</span>
                <div className="h-px flex-1 bg-line" />
              </div>
              <h3 className="text-sm font-medium text-fg-3">{s.title}</h3>
              <Terminal title={s.window} copy={s.copy}>
                <pre className="min-h-64 p-5 font-mono text-xs leading-6 whitespace-pre-wrap break-words text-fg lg:min-h-56">{s.code}</pre>
              </Terminal>
              <p className="text-[13px] leading-relaxed text-fg-4">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Why QueryIO */}
      <Section id="why">
        <SectionLabel>Why QueryIO</SectionLabel>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {COMPARE.map((card) => (
            <div
              key={card.title}
              className={`flex flex-col rounded-2xl border p-6 ${
                card.dark ? "border-night-line bg-night" : "border-line bg-card"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-[15px] font-medium text-ink">{card.title}</h3>
                <span className={`${pill} ${card.dark ? "border-night-line text-fg-3" : "border-line text-fg-5"}`}>
                  {card.badge}
                </span>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-fg-4">
                {card.intro}
              </p>
              <ul className="mt-5 mb-6 space-y-2">
                {card.points.map((p) => (
                  <li key={p} className="flex gap-2.5 text-sm text-fg-2">
                    {card.dark ? (
                      <Check size={14} aria-hidden className="mt-[3px] shrink-0 text-green" />
                    ) : (
                      <span aria-hidden className="w-3.5 shrink-0 text-center font-mono text-fg-7">
                        –
                      </span>
                    )}
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex min-h-11 items-center rounded-lg border border-line bg-cmd px-4 py-2.5">
                <code className="font-mono text-[13px] leading-5 text-fg">{card.flow}</code>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[13px] leading-relaxed text-fg-5">
          Both workflows use SQL. QueryIO adds the initial relationship lookups through inspect_row, so the agent can
          compare state across tables before choosing its next query. Samples are not exhaustive or ordered by recency;
          use SQL to confirm missing data or investigate relationships without declared foreign keys.
        </p>
      </Section>

      {/* Capabilities */}
      <Section id="capabilities">
        <SectionLabel>What it does</SectionLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {CAPABILITIES.map(([t, d]) => (
            <FeatureCard key={t} title={t}>
              {d}
            </FeatureCard>
          ))}
        </div>
        <div className="mt-12 overflow-hidden rounded-xl border border-line">
          <div className="flex gap-8 border-b border-line bg-row-hover px-5 py-3 font-mono text-xs text-fg-5">
            <span className="w-32 shrink-0">scope</span>
            <span>what that means</span>
          </div>
          {LIMITS.map(([scope, text]) => (
            <div
              key={text}
              className="flex flex-col gap-1 border-b border-line-soft bg-card px-5 py-3.5 last:border-b-0 sm:flex-row sm:items-center sm:gap-8"
            >
              <span className="w-32 shrink-0 font-mono text-sm text-fg">{scope}</span>
              <span className="text-sm text-fg-4">{text}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[13px] leading-relaxed text-fg-4">
          Numeric budgets and timeouts are configurable. Returned records enter your agent’s context. Read the <a href={SECURITY_DOCS} className="text-fg underline decoration-fg-7 underline-offset-4 hover:text-ink">security guidance and resource limits</a> before connecting sensitive data.
        </p>
      </Section>

      {/* Benchmark */}
      <Section id="benchmark">
        <SectionLabel className="mb-4">Benchmark</SectionLabel>
        <p className="mb-10 max-w-xl text-sm leading-relaxed text-fg-4">
          An AI agent ran five tasks against a seeded SaaS database with raw psql or QueryIO, with DBHub as a
          reference: 25 runs, every answer graded by hand. Three tasks were about specific records; two counted across
          many rows.
        </p>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {STATS.map(([n, name, foot]) => (
            <div key={name} className="flex flex-col rounded-xl border border-line bg-card p-6">
              <dt className="order-2 mt-4 font-mono text-xs tracking-widest text-fg-5 uppercase">{name}</dt>
              <dd className="order-1 text-3xl font-bold tracking-tight text-ink tabular-nums">{n}</dd>
              <dd className="order-3 mt-1 text-[13px] text-fg-4">{foot}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-fg-2">
          In each record-level task, a record lookup in at least one run surfaced the fact that explained the problem: a
          missing membership, a duplicate invoice, and an API key that was never revoked.
        </p>
        <p className="mt-8 font-mono text-xs text-fg-5">What it didn&apos;t show</p>
        <ul className="mt-3 max-w-2xl space-y-2">
          {NOT_SHOWN.map((e) => (
            <li key={e} className="flex gap-2.5 text-[13px] leading-relaxed text-fg-4">
              <span aria-hidden className="font-mono text-fg-7">
                –
              </span>
              {e}
            </li>
          ))}
        </ul>
      </Section>

      {/* Final CTA */}
      <Section>
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-line bg-cmd px-6 py-14 text-center">
          <SectionLabel as="p" className="">Get started</SectionLabel>
          <h2 className="max-w-md text-3xl leading-tight font-bold tracking-tight text-fg">
            Investigate the record behind the bug.
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-fg-4">
            Connect PostgreSQL, give your coding agent a record ID and a symptom, and start investigating.
          </p>
          <a href="#setup" className={`${ghostLink} flex h-11 items-center justify-center gap-2`}>
            Set up QueryIO <ArrowRight size={14} aria-hidden />
          </a>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}
