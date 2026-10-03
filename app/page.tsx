import { QueryPath, SetupConfig, WaitlistForm } from "./boundary";

const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#security", label: "Security" },
  { href: "#setup", label: "Setup" },
];

const RISKS = [
  {
    title: "It can write.",
    body: "A prompt injection or a confused agent can run UPDATE, DELETE or DROP with the same credentials it uses to read.",
  },
  {
    title: "It can stall production.",
    body: "One unbounded join can hold locks and saturate I/O until someone notices and kills it.",
  },
  {
    title: "It sees everything.",
    body: "Payment tokens and secrets sit in the schema the agent pulls into its context window.",
  },
];

const TOOLS = [
  {
    name: "list_tables",
    gets: "The tables you allowlisted, with a one-line description each.",
    withheld: "System catalogs, migration tables, anything not on the list.",
  },
  {
    name: "describe_tables",
    gets: "Columns, types and foreign keys for the tables it asks about.",
    withheld: "Columns you mark sensitive, like payment_method_token.",
  },
  {
    name: "run_query",
    gets: "Rows from one SELECT, run on a read-only replica.",
    withheld: "Every other statement type, multiple statements, more than 100 rows.",
  },
];

const ENFORCED = [
  {
    where: "Before the database",
    what: "The statement must parse as a single SELECT on allowlisted tables. A LIMIT 100 is added if missing. Anything else is refused without opening a connection.",
  },
  {
    where: "At the database",
    what: "Queries run on a replica in read-only transaction mode, so a write fails at the engine even if the first check were bypassed.",
  },
  {
    where: "Around every query",
    what: "A 5,000 ms timeout cancels long runs before they load your primary.",
  },
];

const H2 = "text-[clamp(1.9rem,3.2vw,2.75rem)] leading-[1.08] font-bold tracking-[-0.03em]";
const LEDE = "mt-5 max-w-[36rem] text-lg leading-relaxed text-ink-2";

export default function Home() {
  return (
    <main id="top">
      <header className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <a href="#top" className="text-xl font-bold tracking-[-0.03em]">
          QueryIO
        </a>
        <div className="flex items-center gap-8">
          <nav aria-label="Sections" className="hidden items-center gap-8 text-[15px] text-ink-2 md:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="transition-colors hover:text-ink">
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href="#waitlist"
            className="rounded-md bg-green px-4 py-2 text-[15px] font-semibold whitespace-nowrap text-on-green transition-colors hover:bg-green-hover"
          >
            Join the waitlist
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-16 px-4 pt-12 pb-24 sm:px-6 md:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-16 lg:pt-20 lg:pb-32">
        <div>
          <h1 className="text-[clamp(2.6rem,4.6vw,4rem)] leading-[1.0] font-bold tracking-[-0.035em]">
            Your agents can read production. They can&rsquo;t change it.
          </h1>
          <p className="mt-7 max-w-[33rem] text-lg leading-relaxed text-ink-2 sm:text-xl sm:leading-relaxed">
            QueryIO sits between AI agents and your database. Agents connect over MCP, the protocol Claude, Cursor and
            other clients use to call tools, and get three read&#8209;only tools instead of a connection string.
          </p>
          <div className="mt-10">
            <WaitlistForm tone="paper" />
          </div>
        </div>
        <QueryPath />
      </section>

      <section id="why" className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 border-t border-rule py-24 md:py-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div>
            <h2 className={H2}>A connection string gives the agent everything the role can do.</h2>
            <p className={LEDE}>
              Most agent database setups hand the model a <code className="font-mono text-[0.92em] text-ink">DATABASE_URL</code>.
              You find out what it did afterwards.
            </p>
          </div>
          <ul className="lg:pt-2">
            {RISKS.map((r) => (
              <li key={r.title} className="grid gap-2 border-b border-rule py-6 first:pt-0 sm:grid-cols-[13rem_1fr] sm:gap-8">
                <h3 className="text-lg font-bold tracking-[-0.01em]">{r.title}</h3>
                <p className="leading-relaxed text-ink-2">{r.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="how" className="bg-paper-2">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
          <h2 className={`max-w-[44rem] ${H2}`}>Three tools. Nothing else is on offer.</h2>
          <p className={LEDE}>
            The agent can find tables, read their shape, and ask one question at a time. That covers what analysis needs
            and leaves out everything else.
          </p>

          <div className="mt-14">
            <div className="hidden grid-cols-[15rem_1fr_1fr] gap-10 border-b border-ink/70 pb-3 text-sm text-ink-2 md:grid">
              <span>Tool</span>
              <span>The agent gets</span>
              <span>Withheld</span>
            </div>
            {TOOLS.map((t) => (
              <div
                key={t.name}
                className="grid gap-2 border-b border-rule py-7 first:border-t first:border-t-ink/70 md:grid-cols-[15rem_1fr_1fr] md:gap-10 md:first:border-t-0"
              >
                <code className="font-mono text-base font-semibold text-ink">{t.name}</code>
                <p className="leading-relaxed">{t.gets}</p>
                <p className="leading-relaxed text-ink-2">
                  <span className="font-semibold text-ink md:hidden">Withheld: </span>
                  {t.withheld}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="security" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div>
            <h2 className={H2}>Why not just a read-only role?</h2>
            <p className={LEDE}>
              A read-only role stops writes, and QueryIO uses one as its second lock. On its own it won&rsquo;t stop a
              40-table join at 3 a.m., keep secret columns out of the agent&rsquo;s context, or narrow what the agent can
              ask for in the first place.
            </p>
          </div>
          <dl className="lg:pt-2">
            {ENFORCED.map((e) => (
              <div key={e.where} className="group relative grid grid-cols-[1.5rem_1fr] gap-x-5 pb-9 last:pb-0">
                <span aria-hidden className="absolute top-3.5 bottom-0 left-[11px] w-0.5 bg-green/30 group-last:hidden" />
                <span className="relative z-10 flex h-7 items-center justify-center">
                  <span className="size-3 rounded-full bg-green ring-4 ring-paper" />
                </span>
                <div>
                  <dt className="text-lg font-bold tracking-[-0.01em]">{e.where}</dt>
                  <dd className="mt-1.5 max-w-[34rem] leading-relaxed text-ink-2">{e.what}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="setup" className="bg-paper-2">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div>
            <h2 className={H2}>Hosted, or in your own VPC.</h2>
            <p className={LEDE}>
              Point any MCP client at QueryIO: Claude Desktop, Claude Code, Cursor, or your own. The checks are the same
              either way.
            </p>
          </div>
          <SetupConfig />
        </div>
      </section>

      <section id="waitlist" className="bg-green-deep text-on-green">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-20">
          <div>
            <h2 className="text-[clamp(2.2rem,4.4vw,3.6rem)] leading-[1.02] font-bold tracking-[-0.035em]">
              Give agents the answers, not the connection string.
            </h2>
            <p className="mt-5 max-w-[34rem] text-lg leading-relaxed text-on-green-2">
              We&rsquo;re onboarding teams in small cohorts, starting with PostgreSQL. Tell us which database and agent
              client you use and we&rsquo;ll prioritize accordingly.
            </p>
          </div>
          <WaitlistForm tone="green" />
        </div>
        <footer className="border-t border-on-green-2/20">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-on-green-2 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>
              <span className="font-bold text-on-green">QueryIO</span> &middot; Read-only database access for AI agents
              &middot; &copy; 2026
            </span>
            <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
              {NAV.map((n) => (
                <a key={n.href} href={n.href} className="transition-colors hover:text-on-green">
                  {n.label}
                </a>
              ))}
            </nav>
          </div>
        </footer>
      </section>
    </main>
  );
}
