export const SITE_URL = "https://queryiomcp.vercel.app";
export const SITE_TITLE = "QueryIO — PostgreSQL MCP server for database debugging";
export const SITE_DESCRIPTION =
  "Debug application data with QueryIO, an open-source PostgreSQL MCP server for Claude Code, Codex, and Cursor. Inspect related records and verify with bounded SQL.";
export const SOCIAL_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "QueryIO — Debug database issues with your AI coding agent. PostgreSQL MCP for Claude Code, Codex, and Cursor.",
};
// Vercel also protects preview deployments with an X-Robots-Tag header.
export const INDEXABLE = !process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production";
