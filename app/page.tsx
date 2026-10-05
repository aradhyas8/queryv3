import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { ClientConfig, CopyButton, InlineCommand, Terminal } from "./interactive";

const NPM = "https://www.npmjs.com/package/queryio";
const VERSION = "0.1.0";
const DSN = "postgres://user:password@localhost:5432/my_database";
const RUN = "npm i queryio";

/* ---------- primitives ---------- */

/** The [q] mark; same paths as public/queryio-logo.svg, filled with the current text color. */
function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 611 448" fill="currentColor" aria-hidden className={`w-auto shrink-0 ${className}`}>
      <path d="M0 0H136V51H60V397H136V448H0Z" />
      <path d="M611 0H475V51H550V397H475V448H611Z" />
      <path
        fillRule="evenodd"
        d="M289 87a137 137 0 1 0 0 274a137 137 0 1 0 0-274ZM292 146a78 78 0 1 1 0 156a78 78 0 1 1 0-156Z"
      />
      <path d="M372 91H438V448H372Z" />
    </svg>
  );
}

function Section({ id, children, className = "py-20" }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`mx-auto max-w-5xl border-b border-line px-6 ${className}`}>
      {children}
    </section>
  );
}

function SectionLabel({ children, className = "mb-12" }: { children: ReactNode; className?: string }) {
  return <p className={`font-mono text-xs tracking-widest text-fg-6 uppercase ${className}`}>{children}</p>;
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
const mono = "font-mono text-[13px] text-fg";

/* ---------- content ---------- */

const STEPS: { n: string; title: string; window: string; copy?: string; code: ReactNode; body: string }[] = [
  {
    n: "01",
    title: "Connect PostgreSQL",
    window: "bash",
    copy: `export QUERYIO_DATABASE_URL="${DSN}"\nnpx -y queryio check`,
    code: (
      <>
        <span className="text-fg-5"># Set the connection</span>
        {"\n"}export QUERYIO_DATABASE_URL=&quot;postgres://…&quot;
        {"\n\n"}
        <span className="text-fg-5"># Check the role</span>
        {"\n"}npx -y queryio check
      </>
    ),
    body: "Connect QueryIO to PostgreSQL with controlled read-oriented access. The preflight prints SQL for a read-only role if you need one.",
  },
  {
    n: "02",
    title: "Start from the record",
    window: "inspect_row",
    code: (
      <>
        {"{"}
        {"\n"}
        {'  "table": "public.users",'}
        {"\n"}
        {'  "key": { "id": 4821 }'}
        {"\n"}
        {"}"}
        {"\n\n"}
        <span className="text-fg-5"># ← the row, plus rows</span>
        {"\n"}
        <span className="text-fg-5">#   linked by foreign keys</span>
      </>
    ),
    body: "QueryIO gives the agent the record and relevant linked rows instead of making it guess which table matters next.",
  },
  {
    n: "03",
    title: "Dig deeper with SQL",
    window: "query",
    code: (
      <>
        SELECT count(*)
        {"\n"}FROM users
        {"\n"}WHERE email_verified_at IS NOT NULL
        {"\n"}
        {"  "}AND activated_at IS NULL;
        {"\n\n"}
        <span className="text-fg-5"># ← bounded, read-only</span>
      </>
    ),
    body: "For questions across many records, the agent can use ordinary SQL through the same controlled interface.",
  },
];

const COMPARE = [
  {
    title: "Typical database MCP",
    badge: "SQL access",
    intro: "The agent works out the path through the data one query at a time.",
    points: [
      "The agent decides which tables to query.",
      "Each result can lead to another query.",
      "Anything it does not think to check can be missed.",
    ],
    flow: "think → SQL → result → think → SQL → result",
    dark: false,
  },
  {
    title: "QueryIO",
    badge: "record context + SQL",
    intro: "The agent starts with the record and what is connected to it.",
    points: [
      "Start from a customer, user, job, order, project, or another record.",
      "QueryIO exposes useful connected data first.",
      "Then the agent uses SQL when deeper investigation is useful.",
    ],
    flow: "record → record + linked rows → SQL if needed",
    dark: true,
  },
];

const CAPABILITIES: [string, string][] = [
  ["Inspect a record", "inspect_row fetches one row by its primary key, plus everything one foreign key away, in a single call."],
  ["Follow linked rows", "Rows it references and rows referencing it, up to 5 per relation, with has_more when there are more."],
  ["Run read-only SQL", "query runs one SELECT, WITH, VALUES, TABLE or SHOW statement per call. No chaining."],
  ["Understand the schema", "list_tables and describe_tables return columns, keys, indexes and planner stats without scanning tables."],
  ["Bounded results", "SQL results stop at 100 rows or 32 KB. Values longer than 200 characters are cut with a size marker."],
  ["Redact sensitive values", "Columns named like password, token or api_key come back as [redacted]."],
  ["Read-only execution", "Every call runs in a READ ONLY transaction that is always rolled back."],
  ["Server-side timeouts", "Postgres cancels statements after 5 seconds and lock waits after 1 second."],
  ["Audit operations", "One JSON line per call records the tool, tables and sizes. Row values are never logged."],
];

const LIMITS: [string, string][] = [
  ["enforced", "Nothing the agent runs can commit a write, with a non-superuser role."],
  ["enforced", "Credentials come only from QUERYIO_DATABASE_URL. Never from arguments or .env files."],
  ["not guaranteed", "QueryIO is not a sandbox. An agent with shell access can run psql on its own."],
  ["not guaranteed", "Redaction matches column names. A hand-written query can alias a column past it."],
  ["not guaranteed", "A superuser role, dblink or foreign data wrappers break the read-only guarantee."],
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

const QUICKSTART: [string, string, ReactNode][] = [
  ["Set QUERYIO_DATABASE_URL", `export QUERYIO_DATABASE_URL="${DSN}"`, null],
  ["Check the connection", "npx -y queryio check", null],
  [
    "Add it to Claude Code",
    `claude mcp add queryio -e QUERYIO_DATABASE_URL="${DSN}" -- npx -y queryio`,
    null,
  ],
  ["Ask a database-backed question", "", <span key="q" className="text-sm text-fg-4">“Why is this customer still on the Free plan?”</span>],
];

/* ---------- page ---------- */

export default function Home() {
  return (
    <main className="min-h-screen bg-bg">
      <nav className="border-b border-line">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <a href="#top" className="flex items-center gap-2.5 font-mono text-sm font-medium text-ink">
            <Logo className="h-3.5" />
            queryio
          </a>
          <a href={NPM} className={ghostLink}>
            npm i queryio
          </a>
        </div>
      </nav>

      {/* Hero */}
      <Section id="top" className="pt-24 pb-20">
        <p className="font-mono text-xs tracking-widest text-fg-6 uppercase">
          PostgreSQL MCP <span className="px-2">·</span> for coding agents
        </p>
        <h1 className="mt-8 max-w-2xl text-4xl leading-[1.05] font-bold tracking-tight text-ink sm:text-5xl">
          Database context for coding agents.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-2">
          Your coding agent knows your code. QueryIO lets it inspect the real PostgreSQL records behind it — including
          the rows connected to them — and use SQL when it needs to go deeper.
        </p>
        <div className="mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
          <InlineCommand cmd={RUN} className="flex-1" />
        </div>
        <p className="mt-6 font-mono text-xs text-fg-5">Read-only · bounded · redacted · audited</p>
      </Section>

      {/* Demo */}
      <Section id="demo">
        <SectionLabel className="mb-4">See it work</SectionLabel>
        <p className="mb-10 max-w-md text-sm leading-relaxed text-fg-4">
          Start from a real record. See the context around it before the agent decides what to query next.
        </p>
        <video
          src="/queryio-film-web.mp4"
          poster="/queryio-film-poster.png"
          autoPlay
          muted
          loop
          controls
          playsInline
          className="w-full rounded-xl border border-line bg-cmd shadow-[0_0_0_1px_rgb(0_0_0/0.04),0_24px_64px_-12px_rgb(0_0_0/0.12)]"
        >
          QueryIO demo video.
        </video>
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
              <h2 className="text-sm font-medium text-fg-3">{s.title}</h2>
              <Terminal title={s.window} copy={s.copy}>
                <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-6 text-fg">{s.code}</pre>
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
          Database MCPs differ, and many offer read-only SQL, schema tools and safety controls. QueryIO runs SQL too; the
          difference is where the agent starts. Linked rows are rows one declared foreign key away.
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
        <p className="mt-4 text-[13px] text-fg-5">All limits are defaults you can change.</p>
      </Section>

      {/* Quick start */}
      <Section id="setup">
        <SectionLabel>Quick start</SectionLabel>
        <ol className="overflow-hidden rounded-xl border border-line">
          <li className="flex gap-8 border-b border-line bg-row-hover px-5 py-3 font-mono text-xs text-fg-5" aria-hidden>
            <span className="sm:w-72">step</span>
            <span className="max-sm:hidden">command</span>
          </li>
          {QUICKSTART.map(([step, cmd, alt], i) => (
            <li
              key={step}
              className="flex flex-col gap-2 border-b border-line-soft bg-card px-5 py-3.5 transition-colors duration-100 last:border-b-0 hover:bg-row-hover sm:flex-row sm:items-center sm:gap-8"
            >
              <span className="flex shrink-0 gap-3 text-sm text-fg-4 sm:w-72">
                <span className="font-mono text-xs leading-5 text-fg-7">0{i + 1}</span>
                {step}
              </span>
              {alt ?? (
                <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
                  <code className="min-w-0 font-mono text-sm leading-6 break-all text-fg">{cmd}</code>
                  <CopyButton text={cmd} />
                </div>
              )}
            </li>
          ))}
        </ol>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="text-sm font-medium text-fg-3">Using Codex or another MCP client?</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-fg-4">
              Add the same server to the client&apos;s config file. QueryIO runs as a local stdio server through{" "}
              <code className={mono}>npx</code>, so there is no install step.
            </p>
          </div>
          <ClientConfig />
        </div>
        <p className="mt-10 font-mono text-xs leading-relaxed text-fg-5">
          Node 20+ · PostgreSQL · any MCP client that runs local stdio servers ·{" "}
          <a href={NPM} className="underline decoration-fg-7 underline-offset-4 transition-colors hover:text-ink">
            configuration options on npm
          </a>
        </p>
      </Section>

      {/* Benchmark */}
      <Section id="benchmark">
        <SectionLabel className="mb-4">Benchmark</SectionLabel>
        <p className="mb-10 max-w-xl text-sm leading-relaxed text-fg-4">
          A coding agent ran five tasks against a seeded SaaS database with raw psql or QueryIO, with DBHub as a
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
          <SectionLabel className="">Get started</SectionLabel>
          <h2 className="max-w-md text-3xl leading-tight font-bold tracking-tight text-fg">
            Give your coding agent the database context it is missing.
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-fg-4">
            Connect PostgreSQL and start investigating real records from your coding agent.
          </p>
          <div className="flex w-full max-w-md flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <InlineCommand cmd={RUN} className="flex-1 bg-bg" />
            <a href={NPM} className={`${ghostLink} flex h-11 items-center justify-center`}>
              View on npm
            </a>
          </div>
        </div>
      </Section>

      <footer className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-12">
        <span className="flex items-center gap-2.5 font-mono text-xs text-fg-5">
          <Logo className="h-3.5 text-ink" />
          queryio v{VERSION}
        </span>
        <a href={NPM} className="font-mono text-xs text-fg-5 transition-colors duration-150 hover:text-ink">
          npm
        </a>
      </footer>
    </main>
  );
}
