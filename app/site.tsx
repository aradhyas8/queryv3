import Link from "next/link";

export const SETUP_COMMAND = "npx -y queryio setup";
export const MANUAL_CONFIG = "https://github.com/aradhyas8/queryio-mcp/blob/main/README.md#manual-configuration";
export const SETUP_DOCS = "https://github.com/aradhyas8/queryio-mcp/blob/main/docs/reference.md#setup-wizard";
export const SECURITY_DOCS = "https://github.com/aradhyas8/queryio-mcp/blob/main/docs/security.md";
const NPM = "https://www.npmjs.com/package/queryio";
const GITHUB = "https://github.com/aradhyas8/queryio-mcp";

function Logo() {
  return (
    <svg viewBox="0 0 611 448" fill="currentColor" aria-hidden className="h-3.5 w-auto shrink-0 text-ink">
      <path d="M0 0H136V51H60V397H136V448H0Z" />
      <path d="M611 0H475V51H550V397H475V448H611Z" />
      <path fillRule="evenodd" d="M289 87a137 137 0 1 0 0 274a137 137 0 1 0 0-274ZM292 146a78 78 0 1 1 0 156a78 78 0 1 1 0-156Z" />
      <path d="M372 91H438V448H372Z" />
    </svg>
  );
}

export function SiteNav() {
  return (
    <nav aria-label="Main navigation" className="border-b border-line">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 font-mono text-sm font-medium text-ink">
          <Logo />
          queryio
        </Link>
        <div className="flex items-center gap-3 font-mono text-xs sm:gap-5">
          <a href={SETUP_DOCS} className="text-fg-3 transition-colors hover:text-ink">Docs</a>
          <a href={GITHUB} className="text-fg-3 transition-colors hover:text-ink">GitHub</a>
          <Link href="/#setup" className="rounded-md border border-line px-3 py-2 text-fg transition-colors hover:border-fg-7 hover:text-ink">
            Install
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
      <span className="flex items-center gap-2.5 font-mono text-xs text-fg-5"><Logo />queryio</span>
      <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-3 font-mono text-xs text-fg-3">
        <Link href="/#setup" className="hover:text-ink">Install</Link>
        <Link href="/install" className="hover:text-ink">Setup reference</Link>
        <a href={SETUP_DOCS} className="hover:text-ink">Docs</a>
        <a href={SECURITY_DOCS} className="hover:text-ink">Security</a>
        <a href="/llms.txt" className="hover:text-ink">llms.txt</a>
        <a href={GITHUB} className="hover:text-ink">GitHub</a>
        <a href={NPM} className="hover:text-ink">npm</a>
      </nav>
    </footer>
  );
}
