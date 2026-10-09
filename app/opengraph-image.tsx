import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "QueryIO — Debug database issues with your AI coding agent. PostgreSQL MCP for Claude Code, Codex, and Cursor.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/queryio-logo-dark.svg"));
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#000", color: "#fff", padding: "64px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30 }}>
        {/* Existing brand mark embedded for a self-contained social image. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/svg+xml;base64,${logo.toString("base64")}`} width="44" height="32" alt="" />
        <span>QueryIO</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 66, fontWeight: 700, letterSpacing: -2, lineHeight: 1.1 }}>Debug database issues with your AI coding agent.</div>
        <div style={{ fontSize: 28, color: "#a8a8a8" }}>PostgreSQL MCP · Claude Code · Codex · Cursor</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", border: "1px solid #2a2a2a", borderRadius: 12, padding: "20px 24px", fontSize: 28, background: "#0c0c0c" }}>
        <span style={{ marginRight: 20, color: "#8c8c8c" }}>›</span>npx -y queryio setup
      </div>
    </div>,
    size,
  );
}
