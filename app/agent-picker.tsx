"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { InlineCommand } from "./interactive";
import { MANUAL_CONFIG, SETUP_COMMAND } from "./site";

const AGENTS = [
  {
    name: "Claude Code",
    label: "Anthropic’s CLI coding agent",
    icon: "/agents/claude.svg",
    flag: "--claude",
    config: "Adds a local stdio MCP server to .mcp.json in your project, or .claude.json in your user configuration for global scope. The entry references QUERYIO_DATABASE_URL from your environment.",
    verify: "Start Claude Code from the terminal where the variable is set. Approve the project server if prompted, then use /mcp to check QueryIO’s status and tools.",
  },
  {
    name: "Codex",
    label: "OpenAI’s coding agent",
    icon: "/agents/codex.svg",
    flag: "--codex",
    config: "Adds QueryIO to .codex/config.toml in your project or your global Codex configuration. The env_vars setting forwards QUERYIO_DATABASE_URL without storing its value. Project configuration requires a trusted project.",
    verify: "Start a new Codex session from the terminal where the variable is set, trust the project if using project scope, then use /mcp to check QueryIO’s available tools.",
  },
  {
    name: "Cursor",
    label: "AI code editor",
    icon: "/agents/cursor.svg",
    flag: "--cursor",
    config: "Adds a local stdio MCP server to .cursor/mcp.json in your project or home directory. The entry references QUERYIO_DATABASE_URL from the environment where Cursor starts.",
    verify: "Fully quit Cursor, then reopen your project from the terminal where the variable is set. Open Settings > MCP and confirm queryio is listed and enabled. Setup does not check Cursor discovery automatically.",
  },
] as const;

/** The hero's setup command and the agent cards that choose it. */
export function AgentPicker() {
  const [selected, setSelected] = useState<number | null>(null);
  const panelId = useId();
  const headingId = useId();
  const agent = selected === null ? null : AGENTS[selected];
  const command = agent ? `${SETUP_COMMAND} ${agent.flag}` : SETUP_COMMAND;

  return (
    <>
      <div id="setup" tabIndex={-1} className="mt-6 scroll-mt-6">
        <InlineCommand cmd={command} prominent />
      </div>
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-fg-3">
        <p className="font-mono">Node.js 20+ · No global install needed</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <a href={MANUAL_CONFIG} target="_blank" rel="noreferrer" className="inline-flex min-h-6 items-center gap-1 hover:text-ink">
            Prefer manual setup? <span className="text-fg underline decoration-fg-7 underline-offset-4">Read the docs</span>
            <ArrowUpRight size={12} aria-hidden /><span className="sr-only">(opens in a new tab)</span>
          </a>
          <a href="#demo" className="inline-flex min-h-6 items-center gap-1.5 hover:text-ink">Watch the demo <ArrowRight size={13} aria-hidden /></a>
        </div>
      </div>

      <section aria-labelledby={headingId} className="mt-8 sm:mt-10">
        <h2 id={headingId} className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">Pick your agent</h2>
        <div role="group" aria-label="Coding agents" className="mt-5 grid gap-3 sm:grid-cols-3">
          {AGENTS.map(({ name, label, icon }, index) => {
            const on = selected === index;
            return (
              <button
                key={name}
                type="button"
                aria-pressed={on}
                aria-expanded={on}
                aria-controls={panelId}
                onClick={() => setSelected(on ? null : index)}
                className={`relative flex cursor-pointer flex-col rounded-xl border p-4 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg sm:p-5 ${on ? "border-fg bg-night" : "border-line bg-card hover:border-fg-7 hover:bg-card-hover"}`}
              >
                <span className="flex w-full items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-bg">
                    <Image src={icon} alt="" aria-hidden width={22} height={22} className="brightness-0 invert" />
                  </span>
                  <span aria-hidden className={`flex h-5 w-5 items-center justify-center rounded-full bg-fg text-bg transition-opacity duration-150 ${on ? "opacity-100" : "opacity-0"}`}>
                    <Check size={12} strokeWidth={3} />
                  </span>
                </span>
                <span className="mt-4 block text-sm font-medium text-fg">{name}</span>
                <span className="mt-1 block text-xs leading-relaxed text-fg-3">{label}</span>
              </button>
            );
          })}
        </div>
        <p role="status" className="sr-only">{agent ? `${agent.name} selected. Command: ${command}` : ""}</p>
        <div id={panelId} aria-live="polite" aria-atomic="true">
          {agent && (
            <div role="region" aria-label={`${agent.name} setup details`} className="mt-4 grid gap-5 rounded-xl border border-line bg-cmd p-5 sm:grid-cols-2 sm:gap-8 sm:p-6">
              <div>
                <h3 className="text-sm font-medium text-fg">What setup configures for {agent.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-3">{agent.config}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-fg">Verify in your agent</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-3">{agent.verify}</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
