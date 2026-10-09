import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { InlineCommand } from "../interactive";
import { MANUAL_CONFIG, SECURITY_DOCS, SETUP_COMMAND, SETUP_DOCS, SiteFooter, SiteNav } from "../site";
import { SOCIAL_IMAGE } from "../seo";

const title = "Install QueryIO — PostgreSQL MCP for Claude Code, Codex & Cursor";
const description = "Set up QueryIO with one command. Configure your coding agents, supply your PostgreSQL connection through the environment, and verify with queryio check. Node.js 20+.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/install" },
  openGraph: { type: "website", siteName: "QueryIO", title, description, url: "/install", images: [SOCIAL_IMAGE] },
  twitter: { card: "summary_large_image", title, description, images: [SOCIAL_IMAGE] },
};

export default function Install() {
  return (
    <main className="min-h-screen bg-bg">
      <SiteNav />
      <div id="content" tabIndex={-1} className="mx-auto max-w-3xl px-6">
        <section aria-labelledby="install-heading" className="pt-10 pb-10 sm:pt-12">
          <Link href="/#setup" className="inline-flex items-center gap-2 text-sm text-fg-3 hover:text-ink"><ArrowLeft size={14} aria-hidden />Back to homepage setup</Link>
          <h1 id="install-heading" className="mt-6 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Setup reference.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-fg-2">
            The homepage has the setup command and agent-specific guidance. Use this reference for configuration scope, environment requirements, and troubleshooting.
          </p>
          <div className="mt-6 max-w-xl">
            <InlineCommand cmd={SETUP_COMMAND} />
          </div>
          <p className="mt-4 font-mono text-xs leading-6 text-fg-3">Node.js 20+ required · PostgreSQL only · No global install needed</p>
        </section>

        <section aria-labelledby="scope-heading" className="border-t border-line py-10">
          <h2 id="scope-heading" className="text-xl font-semibold tracking-tight text-ink">Configuration scope and file changes</h2>
          <p className="mt-4 text-sm leading-relaxed text-fg-3">
            Run setup from your application repository. Choose one or more of Claude Code, Codex, and Cursor. Project scope is the default; global scope applies across projects and requires an extra confirmation.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-fg-3">
            Setup previews the entries it will write, preserves other MCP servers and settings, and backs up files it modifies. It asks before replacing an existing QueryIO entry. Matching configuration is left unchanged.
          </p>
        </section>

        <section id="connection" aria-labelledby="connection-heading" className="scroll-mt-8 border-t border-line py-10">
          <h2 id="connection-heading" className="text-xl font-semibold tracking-tight text-ink">Keep your connection in your environment.</h2>
          <p className="mt-4 text-sm leading-relaxed text-fg-3">
            Set <code className="font-mono text-fg">QUERYIO_DATABASE_URL</code> in the environment that starts your agent, using an existing PostgreSQL database and a dedicated role with narrow read permissions. Start your agent from that terminal so it can pass the variable to QueryIO. An editor opened from the Dock, Start menu, or an existing window may not inherit it.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-fg-3">
            This website never requests, collects, or stores connection strings. The wizard does not ask for your connection string, save it, or load <code className="font-mono text-fg">.env</code> files. It does not provision a database or provide secure credential storage.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-fg-3">
            When the variable is available, setup checks database connectivity and role privileges, then starts QueryIO to list its tools. Missing or invalid credentials leave setup incomplete. To check the connection after setting the variable, run <code className="font-mono text-fg">npx -y queryio check</code> in that terminal.
          </p>
          <a href={SETUP_DOCS} className="mt-5 inline-flex items-center gap-1.5 text-sm text-fg underline decoration-fg-7 underline-offset-4 hover:text-ink">
            Environment and setup documentation <ArrowUpRight size={14} aria-hidden />
          </a>
          <p className="mt-4 text-sm leading-relaxed text-fg-3">
            QueryIO is not a security sandbox. Returned records enter your agent’s context, and redaction can be bypassed by aliases or expressions. Read the <a href={SECURITY_DOCS} className="text-fg underline decoration-fg-7 underline-offset-4 hover:text-ink">security and resource-limit guidance</a> before connecting sensitive data.
          </p>
        </section>

        <section aria-label="Installation help" className="border-t border-b border-line py-8">
          <a href={MANUAL_CONFIG} className="inline-flex items-center gap-1.5 text-sm text-fg underline decoration-fg-7 underline-offset-4 hover:text-ink">
            Prefer manual configuration? Read the GitHub docs <ArrowUpRight size={14} aria-hidden />
          </a>
          <details className="mt-6 text-sm leading-relaxed text-fg-3">
            <summary className="w-fit cursor-pointer text-fg">Seeing an older npm release?</summary>
            <p className="mt-3">QueryIO 0.2.1 includes the setup wizard and agent preselection flags. If npm serves an older version, retry with <code className="font-mono text-fg">npx -y queryio@0.2.1 setup</code>. If that version is not available from your registry, use the manual configuration docs or retry once it is available.</p>
          </details>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
