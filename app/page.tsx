import type { ReactNode } from "react";
import { ArrowUpRight, Check, Github, Minus, ShieldCheck, TriangleAlert } from "lucide-react";
import { CommandBar, InstallCommand, SetupConfig } from "./interactive";

const REPO = "https://github.com/aradhyas8/queryio-mcp";
const LINKS = {
  repo: REPO,
  readme: `${REPO}#readme`,
  config: `${REPO}#configuration--defaults`,
  benchmark: `${REPO}/blob/main/BENCHMARK.md`,
  issues: `${REPO}/issues`,
  license: `${REPO}/blob/main/LICENSE`,
  npm: "https://www.npmjs.com/package/queryio",
};

const NAV = [
  { href: "#example", label: "Example" },
  { href: "#compare", label: "Why not psql" },
  { href: "#trust", label: "Guarantees" },
  { href: "#benchmark", label: "Benchmark" },
  { href: "#setup", label: "Setup" },
];

const USE_CASES = [
  ["Explain a customer report", "Why is this customer still on the free plan?"],
  ["Check an assumption before you build", "Is email ever null in production data?"],
  ["Follow a record across tables", "Show me order 5531 and everything attached to it."],
  ["Answer a support question", "How many accounts signed up this week but never verified?"],
  ["Investigate an incident", "Which jobs failed after the 2pm deploy?"],
  ["Find data that breaks the rules", "Are there refunded orders with no refund record?"],
];

const COMPARE = [
  ["Writes", "Whatever the role allows.", "Nothing can commit. Every call is rolled back."],
  ["Slow queries", "Run until someone notices.", "Postgres cancels them after 5 seconds by default."],
  ["Huge results", "Every row lands in the agent’s context.", "Capped at 100 rows and 32 KB, with a flag when there’s more."],
  ["Related records", "One join at a time.", "One lookup returns a record and the rows directly linked to it."],
  ["Secret fields", "Password hashes and tokens come back as-is.", "Common secret columns come back as [redacted]."],
  ["Audit trail", "Shell history, maybe.", "One log line per call, without the data."],
];

const GUARANTEED = [
  "Nothing your agent runs can commit a write.",
  "Slow or blocked queries are cancelled inside Postgres, not just abandoned.",
  "One statement per call. No chaining.",
  "Credentials come only from an environment variable. Never from command-line arguments or .env files.",
];

const NOT_GUARANTEED = [
  "QueryIO is not a sandbox. An agent that can read DATABASE_URL and run psql on its own can go around it.",
  "Secret masking matches column names. A hand-written query can rename a column to get past it.",
  "A superuser role, dblink or foreign data wrappers break the read-only guarantee.",
];

const STATS = [
  ["−38.5%", "Less database output", "Median, investigation tasks, vs raw psql"],
  ["−18.8%", "Fewer database calls", "Median, investigation tasks, vs raw psql"],
  ["100%", "Correct answers", "Every arm, graded by hand"],
];

const FOOTER: [string, [string, string][]][] = [
  ["Product", [["Example", "#example"], ["Why not psql", "#compare"], ["Guarantees", "#trust"], ["Setup", "#setup"]]],
  ["Resources", [["README", LINKS.readme], ["BENCHMARK.md", LINKS.benchmark], ["npm", LINKS.npm]]],
  ["Project", [["GitHub", LINKS.repo], ["Issues", LINKS.issues], ["MIT License", LINKS.license]]],
];

/* ---------- primitives ---------- */

const btn =
  "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium whitespace-nowrap transition-colors duration-150";
const btnPrimary = `${btn} bg-fg text-bg hover:bg-fg-hover`;
const btnSecondary = `${btn} border border-line-strong text-fg hover:bg-surface-2`;
const textLink =
  "inline-flex items-center gap-1 text-sm text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-fg";

/** Full-width section canvas; only the inner content is constrained. */
function Frame({
  id,
  children,
  className = "",
  tone = "paper",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "paper" | "muted";
}) {
  const bg = tone === "muted" ? "bg-surface" : "bg-bg";
  return (
    <section id={id} className={`border-b border-line ${bg}`}>
      <div className={`mx-auto max-w-[1240px] px-5 sm:px-8 ${className}`}>{children}</div>
    </section>
  );
}

function Chapter({ eyebrow, title, tail, children }: { eyebrow: string; title: string; tail?: string; children?: ReactNode }) {
  return (
    <header className="mb-12 max-w-[52rem] md:mb-14">
      <p className={label}>{eyebrow}</p>
      <h2 className="mt-5 text-[32px] leading-[1.08] font-medium tracking-[-0.03em] md:text-[44px]">
        {title} {tail && <span className="text-fg-2">{tail}</span>}
      </h2>
      {children && <div className="mt-6 max-w-[44rem] space-y-4 text-[17px] leading-[1.6] text-fg-2">{children}</div>}
    </header>
  );
}

const label = "font-mono text-xs tracking-[0.06em] text-fg-3 uppercase";
const codeCls = "font-mono text-[13px] text-fg";

function Step({ n, title, children }: { n: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-4">
      <p className="font-medium text-fg">
        <span className="mr-3 font-mono text-xs text-fg-3">{n}</span>
        {title}
      </p>
      {children && <p className="mt-2 text-sm leading-relaxed text-fg-2">{children}</p>}
    </div>
  );
}

/* ---------- example session ---------- */

function Transcript() {
  const lines: ReactNode[] = [
    <p key="ask" className="text-fg">
      <span className="text-fg-3 select-none">&gt; </span>A customer upgraded to Pro yesterday. Their account still says
      Free. Why?
    </p>,
    <p key="read">
      <span className="text-fg-3">● read</span> <span className="text-fg">src/billing/webhooks.ts</span>
      <span className="block pl-4 text-fg-3">upgrade runs when invoice.paid matches a row in plans</span>
    </p>,
    <p key="inspect">
      <span className="text-fg-3">● queryio</span> <span className="text-fg">account 1042 and related records</span>
      <span className="block pl-4 text-fg-3">← plan free · subscription active · invoice.paid failed</span>
    </p>,
    <p key="query">
      <span className="text-fg-3">● queryio</span>{" "}
      <span className="text-fg-2">SELECT id FROM plans WHERE id = &apos;pro_annual&apos;</span>
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
      <div className="line-in mt-2 rounded-md border border-line bg-surface p-4" style={{ "--i": 4 } as React.CSSProperties}>
        <p className={label}>Answer</p>
        <p className="mt-2 font-sans text-[15px] leading-relaxed text-fg">
          The payment went through. The upgrade failed because the new annual Pro price was never added to the{" "}
          <code className="font-mono text-[13px]">plans</code> table.
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

const k = (s: string) => <span className="text-fg-3">{s}</span>;

function DataPanel() {
  return (
    <div className="flex flex-col gap-5 p-5">
      <Rel name="accounts · 1042">
        <Row cells={[k("plan"), "free"]} hit />
        <Row cells={[k("email"), "dana@example.com"]} />
      </Rel>
      <Rel name="subscriptions">
        <Row cells={[k("status"), "active"]} />
        <Row cells={[k("price"), "pro_annual"]} />
      </Rel>
      <Rel name="webhook_events">
        <Row cells={["invoice.paid", "failed"]} hit />
        <Row cells={[<span key="e" className="text-fg-3">error: unknown plan pro_annual</span>]} />
      </Rel>
      <Rel name="plans · id = pro_annual">
        <Row cells={["0 rows"]} hit />
      </Rel>
    </div>
  );
}

/* ---------- page ---------- */

export default function Home() {
  return (
    <main id="top">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/95">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-6 px-5 sm:px-8">
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
            <a href={LINKS.repo} className={`${btnSecondary} h-8 px-3 max-sm:hidden`}>
              <Github size={15} aria-hidden /> GitHub
            </a>
            <a href="#setup" className={`${btnPrimary} h-8 px-3`}>
              Get started
            </a>
          </div>
        </div>
      </header>

      {/* 1. Hero */}
      <Frame className="flex min-h-[min(calc(100svh-4rem),960px)] flex-col justify-center py-20">
        <div className="mx-auto max-w-[1040px] text-center">
          <p className="inline-flex rounded-md border border-line px-3 py-1.5 font-mono text-xs tracking-[0.06em] text-fg-2 uppercase">
            Open source · PostgreSQL · MCP
          </p>
          <h1 className="mt-8 text-[40px] leading-[1.04] font-medium tracking-[-0.035em] sm:text-[52px] md:text-[64px] xl:text-[72px]">
            Give your coding agent database access <span className="text-fg-2 md:block">without giving it your database.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-[640px] text-[17px] leading-[1.55] text-fg-2 md:text-lg">
            Your agent already knows your code. QueryIO lets it see the data behind it: the actual rows, records and
            state. Every call runs read-only, with limits you control. Works with Claude Code, Codex and other MCP
            clients.
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
        <div className="mx-auto mt-12 w-full max-w-[860px]">
          <InstallCommand />
        </div>
      </Frame>

      {/* 2. Problem */}
      <Frame id="problem" className="py-20 md:py-24">
        <Chapter eyebrow="The problem" title="Your agent knows the code." tail="It can’t see the data.">
          <p>
            It can read every line of your application and still not know why a real customer, order, subscription or
            job is in the wrong state. The answer is in a row it can’t see.
          </p>
          <p>
            So you paste query results into the chat. Or you hand it <code className={codeCls}>DATABASE_URL</code> and
            hope it only runs SELECTs.
          </p>
          <p className="text-fg">
            QueryIO is the middle path. Your agent checks the real data itself, through a connection that can’t write,
            can’t run forever and can’t flood its context.
          </p>
        </Chapter>
      </Frame>

      {/* 3. Example */}
      <Frame id="example" tone="muted" className="py-16 md:py-20">
        <figure className="overflow-hidden rounded-lg border border-line bg-bg text-left shadow-[0_16px_40px_-24px_rgb(0_0_0/0.12)]">
          <figcaption className="flex h-10 items-center justify-between gap-4 border-b border-line bg-surface px-5 font-mono text-xs">
            <span className="truncate text-fg-2">agent session · coding agent + queryio</span>
            <span className="shrink-0 text-fg-3">illustrative example</span>
          </figcaption>
          <div className="grid lg:grid-cols-2 lg:divide-x lg:divide-line">
            <Transcript />
            <div className="border-t border-line lg:border-t-0">
              <DataPanel />
            </div>
          </div>
        </figure>
        <p className="mt-8 text-center text-[22px] leading-snug font-medium tracking-[-0.02em] md:text-[26px]">
          The code said what should happen. <span className="text-fg-2">The data showed what did.</span>
        </p>
      </Frame>

      {/* 4. Use cases */}
      <Frame id="use-cases" className="py-20 md:py-24">
        <Chapter eyebrow="Use cases" title="Ask questions" tail="that need the real data." />
        <ul className="grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map(([title, ask]) => (
            <li key={title} className="border-r border-b border-line p-7 md:p-8">
              <h3 className="text-[17px] leading-snug font-medium">{title}</h3>
              <p className="mt-3 font-mono text-[13px] leading-relaxed text-fg-2">“{ask}”</p>
            </li>
          ))}
        </ul>
      </Frame>

      {/* 5. Why not psql */}
      <Frame id="compare" className="py-20 md:py-24">
        <Chapter eyebrow="Compare" title="Why not just give it psql?">
          <p>Because psql was built for you, not for an agent working on its own.</p>
        </Chapter>
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[620px] border-collapse border border-line text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="w-[20%] p-4 font-normal">
                  <span className="sr-only">Concern</span>
                </th>
                <th className={`p-4 font-normal ${label}`}>Agent + DATABASE_URL</th>
                <th className="bg-surface-2 p-4 font-mono text-xs font-medium tracking-[0.06em] text-fg uppercase">
                  Agent + QueryIO
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([concern, raw, q]) => (
                <tr key={concern} className="border-b border-line last:border-b-0">
                  <th scope="row" className="p-4 font-normal text-fg-3">
                    {concern}
                  </th>
                  <td className="p-4 text-fg-2">{raw}</td>
                  <td className="bg-surface-2 p-4 font-medium text-fg">{q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-[48rem] text-sm leading-relaxed text-fg-3">
          Many database MCP servers mainly pass SQL through. QueryIO adds the controls and record lookups you would
          otherwise build yourself. Limits are defaults and can be changed.
        </p>
      </Frame>

      {/* 6. Trust */}
      <Frame id="trust" className="py-20 md:py-24">
        <Chapter eyebrow="Guarantees" title="What QueryIO guarantees." tail="And what it doesn’t." />
        <div className="grid border border-line md:grid-cols-2 md:divide-x md:divide-line">
          <div className="p-7 md:p-8">
            <p className={`flex items-center gap-2 ${label}`}>
              <ShieldCheck size={14} aria-hidden /> Guaranteed, with a non-superuser role
            </p>
            <ul className="mt-5 space-y-3">
              {GUARANTEED.map((e) => (
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
        <p className="mt-4 rounded-md border border-line bg-surface p-5 leading-relaxed text-fg-2 md:p-6">
          <span className="text-fg">Connect with a dedicated read-only role.</span>{" "}
          <code className={codeCls}>npx -y queryio check</code> inspects the role you’re using and prints the SQL to
          create one.
        </p>
      </Frame>

      {/* 7. Benchmark */}
      <Frame id="benchmark" tone="muted" className="py-20 md:py-24">
        <Chapter eyebrow="Benchmark" title="On investigation tasks," tail="same answers with less to read.">
          <p>25 agent runs on a seeded SaaS database: raw psql against QueryIO, with DBHub as a reference.</p>
        </Chapter>
        <dl className="grid border-t border-l border-line bg-bg sm:grid-cols-3">
          {STATS.map(([n, name, foot]) => (
            <div key={name} className="flex flex-col border-r border-b border-line p-7 md:p-8">
              <dt className={`order-2 mt-5 ${label}`}>{name}</dt>
              <dd className="order-1 text-[44px] leading-none font-medium tracking-[-0.03em] tabular-nums md:text-5xl">{n}</dd>
              <dd className="order-3 mt-1.5 text-sm text-fg-2">{foot}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 max-w-[56rem] leading-relaxed text-fg-2">
          <span className="text-fg">The pre-declared win condition was not met.</span> Median output cleared the ~30%
          target. Mean interactions (−16.8%) and mean bytes (−20.7%) did not, and counting tasks used more output on
          average. The QueryIO runs went through a command-line wrapper, not MCP.
        </p>
        <a href={LINKS.benchmark} className={`mt-5 ${textLink}`}>
          Methodology and full results <ArrowUpRight size={14} aria-hidden />
        </a>
      </Frame>

      {/* 8. Get started */}
      <Frame id="setup" className="py-20 md:py-24">
        <Chapter eyebrow="Get started" title="Running in" tail="about two minutes." />
        <ol className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-x-8">
          <li>
            <Step n="01" title="Check your connection.">
              Set <code className={codeCls}>QUERYIO_DATABASE_URL</code>, then run the preflight. It reports your
              role’s privileges and warns about risky ones.
            </Step>
            <CommandBar lines={["npx -y queryio check"]} copy="npx -y queryio check" />
          </li>
          <li className="min-w-0 lg:row-span-2">
            <Step n="02" title="Add QueryIO to your coding agent." />
            <SetupConfig />
          </li>
          <li>
            <Step n="03" title="Ask about your data.">
              “Why is this customer still on the free plan?”
            </Step>
          </li>
        </ol>
        <p className="mt-8 text-sm text-fg-3">
          PostgreSQL · Any MCP client that runs local stdio servers · MIT ·{" "}
          <a href={LINKS.config} className={textLink}>
            Configuration in the README
          </a>
        </p>
      </Frame>

      {/* 9. Final CTA */}
      <Frame tone="muted" className="py-24 text-center md:py-32">
        <h2 className="mx-auto max-w-[46rem] text-[32px] leading-[1.08] font-medium tracking-[-0.03em] md:text-[44px]">
          Let your agent read the database. <span className="text-fg-2">Not own it.</span>
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href="#setup" className={btnPrimary}>
            Get started
          </a>
          <a href={LINKS.repo} className={btnSecondary}>
            <Github size={16} aria-hidden /> View on GitHub
          </a>
        </div>
      </Frame>

      <footer>
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <p className="flex items-center gap-2.5 text-[15px] font-semibold">
              <span className="rounded-[4px] border border-line-strong px-1.5 py-0.5 font-mono text-[11px] font-normal text-fg-2">
                [q]
              </span>
              QueryIO
            </p>
            <p className="mt-3 max-w-[18rem] text-sm leading-relaxed text-fg-2">Database access for coding agents.</p>
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
          <p className="mx-auto max-w-[1240px] px-5 py-6 font-mono text-xs text-fg-3 sm:px-8">© 2026 QueryIO · MIT License</p>
        </div>
      </footer>
    </main>
  );
}
