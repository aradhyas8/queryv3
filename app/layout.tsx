import type { Metadata } from "next";
import { Geist_Mono, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QueryIO — Read-only database access for AI agents",
  description:
    "QueryIO is an MCP gateway that gives AI agents three bounded tools instead of database credentials. Writes are refused before a connection opens, and queries run on a read-only replica.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${schibsted.variable} ${geistMono.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
