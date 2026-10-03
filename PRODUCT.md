# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: AI engineers who want their agents (Claude Desktop / Claude Code, Cursor, LangChain, custom MCP clients) to answer questions from production data without handing them a database connection string.

Secondary: the infra or security lead who has to sign off on that access. The homepage speaks to the engineer first and gives the approver a short, honest section of their own.

## Product Purpose

QueryIO is a Model Context Protocol (MCP) gateway between AI agents and SQL databases. Agents get three bounded tools (`list_tables`, `describe_tables`, `run_query`) instead of raw credentials. Every query is parsed and rejected unless it is a single read-only SELECT, row counts and run time are capped, sensitive columns are hidden from schema context, and queries run against a read-only replica.

Success for the homepage: a qualified engineer joins the waitlist; an approver understands why it is safer than a read-only role.

## Positioning

Two independent layers instead of one: a parser gate that refuses anything but a SELECT before a socket opens, and a read-only replica that refuses writes at the engine even if the gate were bypassed. Plus a narrow, typed tool surface that shapes what the agent can even ask for.

Open question the page must answer: why this instead of a read-only Postgres role plus the reference MCP server.

## Operating Context

Pre-launch. Waitlist only. Engineers evaluate by reading the tool contract, the config snippet, and a rejected-write example.

## Capabilities and Constraints

- Deployment: both a hosted/managed gateway and a self-hosted CLI / Docker gateway (confirmed).
- Open-source repository exists (confirmed); URL not yet supplied.
- Tools: `list_tables`, `describe_tables`, `run_query`. There is no fourth public tool.
- Enforced limits shown on the current page (LIMIT 100, 5,000 ms timeout) are design values; treat as current defaults, not guarantees.
- Audit trail per call is NOT confirmed. Do not claim signed or cryptographic traces.
- Supported databases beyond PostgreSQL are not confirmed. Do not list them as supported.
- Waitlist: no backend. Use a `mailto:` fallback. Never fake a confirmation or reservation code.

## Brand Commitments

Name: QueryIO. No logo asset yet.

## Evidence on Hand

- Realistic sample payloads in `app/page.tsx` (MRR query, schema with redacted columns, rejected UPDATE). Synthetic; label as examples.
- No customers, testimonials, benchmarks, team bios, or pricing. Do not fabricate any.

## Product Principles

1. Prove with the real mechanism (a refused write) before claiming.
2. Say exactly what is enforced and where; no absolute or inflated security language.
3. Engineer-first language, but define MCP once in plain words.
4. Honest pre-launch state: no fake live status, versions, or confirmations.
