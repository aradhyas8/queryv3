"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Database,
  ShieldCheck,
  Zap,
  Code,
  Layout,
  Menu,
  X
} from "lucide-react";

// --- Components ---

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "outline" }) => {
  const baseStyles = "px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base";

  const variants = {
    primary: "bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.3)]",
    secondary: "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm",
    outline: "border border-white/10 text-white hover:bg-white/5",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Section = ({ children, className = "", id = "" }: { children: React.ReactNode; className?: string, id?: string }) => (
  <section id={id} className={`px-6 py-20 md:py-32 max-w-7xl mx-auto ${className}`}>
    {children}
  </section>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-blue-400 uppercase bg-blue-500/10 rounded-full border border-blue-500/20">
    {children}
  </span>
);

// --- Main Page Component ---

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0D10] text-white/90 selection:bg-white/20">

      {/* 1. Sticky Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${isScrolled ? "bg-[#0B0D10]/80 backdrop-blur-md border-white/10 py-4" : "bg-transparent border-transparent py-6"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-gradient-to-tr from-white to-gray-500 rounded-lg flex items-center justify-center text-black">
              Q
            </div>
            QueryIO
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            {["Features", "How it works", "Pricing", "FAQ"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s/g, "-")}`} className="hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a href="#" className="text-sm font-medium text-white/80 hover:text-white">Log in</a>
            <Button variant="primary" className="py-2 px-4 text-sm">Join Waitlist</Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#0B0D10] border-b border-white/10 p-6 flex flex-col gap-4">
            {["Features", "How it works", "Pricing", "FAQ"].map((item) => (
              <a key={item} href="#" className="text-white/80 py-2 block">{item}</a>
            ))}
            <Button variant="primary" className="w-full">Join Waitlist</Button>
          </div>
        )}
      </nav>

      {/* 2. Hero Section */}
      <div className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/20 opacity-20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <Badge>Coming Soon • Early Access</Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Ask your database in <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">plain English.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 mb-8 max-w-lg leading-relaxed">
            QueryIO converts natural language into safe, readable SQL for Postgres & MySQL—so anyone can get answers without writing queries.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <form className="flex w-full max-w-md relative group">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-[#10141A] border border-white/10 rounded-l-lg px-4 py-3 focus:outline-none focus:border-white/30 text-white placeholder:text-white/40 transition-all"
              />
              <button className="bg-white text-black px-6 py-3 rounded-r-lg font-medium hover:bg-gray-200 transition-colors whitespace-nowrap">
                Join Waitlist
              </button>
            </form>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/40 uppercase tracking-wide font-medium">
            <span>Built for Postgres & MySQL</span>
            <span className="w-1 h-1 bg-white/40 rounded-full" />
            <span>No Spam</span>
          </div>
        </div>

        {/* Dashboard Preview Frame */}
        <div className="relative z-10 bg-[#10141A] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-blue-900/10">
          <div className="bg-[#0B0D10] px-4 py-3 border-b border-white/10 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            </div>
            <div className="ml-4 text-xs text-white/30 font-mono">QueryIO Dashboard</div>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Database size={16} />
              </div>
              <div className="bg-[#1C2029] p-4 rounded-lg rounded-tl-none border border-white/5 text-sm md:text-base">
                What were revenue and churn last 30 days?
              </div>
            </div>

            <div className="border border-white/10 rounded-lg p-4 bg-black/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-green-400 font-mono flex items-center gap-1">
                  <Check size={12} /> Generated SQL
                </span>
                <span className="text-xs text-white/30">Read-only mode</span>
              </div>
              <pre className="font-mono text-xs md:text-sm text-white/70 overflow-x-auto">
                <span className="text-purple-400">SELECT</span> SUM(amount) as revenue, <br />
                COUNT(id) as churn <br />
                <span className="text-purple-400">FROM</span> subscriptions <br />
                <span className="text-purple-400">WHERE</span> status = 'cancelled' <br />
                <span className="text-purple-400">AND</span> date {'>'} NOW() - INTERVAL '30 days';
              </pre>
            </div>

            {/* Blurred Results Table */}
            <div className="space-y-2 opacity-50 blur-[2px]">
              <div className="h-8 bg-white/5 rounded w-full" />
              <div className="h-8 bg-white/5 rounded w-full" />
              <div className="h-8 bg-white/5 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Social Proof */}
      <div className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <p className="text-sm text-white/40 mb-8 font-medium">TRUSTED BY TEAMS FROM</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 grayscale opacity-40">
            {/* Replace with actual SVGs later */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-24 bg-white/20 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* 4. Features Grid */}
      <Section id="features">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Get answers fast. <br />Keep control.</h2>
          <p className="text-white/60 text-lg">QueryIO helps you explore data safely without becoming a SQL expert.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: <Code />, title: "Natural Language → SQL", desc: "Type in English, get production-ready SQL you can inspect before running." },
            { icon: <ShieldCheck />, title: "Safer by Default", desc: "Read-only connections, row limits, and guardrails to prevent heavy loads." },
            { icon: <Layout />, title: "Saved Insights", desc: "Save complex queries as dashboard widgets to share with your team." },
            { icon: <Database />, title: "Postgres & MySQL", desc: "Native support for the world's most popular relational databases." },
            { icon: <Zap />, title: "Schema Aware", desc: "QueryIO reads your schema structure (not your data) to understand relationships." },
            { icon: <ChevronRight />, title: "Export in One Click", desc: "Download results to CSV or JSON instantly for further analysis." },
          ].map((feature, idx) => (
            <div key={idx} className="bg-[#10141A] border border-white/10 p-8 rounded-2xl hover:border-white/20 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/60 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 5. Comparison Section */}
      <Section className="bg-gradient-to-b from-[#0B0D10] to-[#10141A] rounded-3xl border border-white/5">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Old Way */}
          <div className="p-8 rounded-2xl bg-red-500/5 border border-red-500/10">
            <h3 className="text-xl font-bold mb-6 text-red-400">Typical Approach</h3>
            <ul className="space-y-4">
              {[
                "Wait days for an analyst ticket",
                "Copy/paste unverified SQL from ChatGPT",
                "Accidentally run DELETE queries",
                "Hard to trust or verify results"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/60">
                  <X size={18} className="text-red-500 shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* New Way */}
          <div className="p-8 rounded-2xl bg-blue-500/5 border border-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-blue-500 text-xs font-bold uppercase text-white rounded-bl-lg">
              With QueryIO
            </div>
            <h3 className="text-xl font-bold mb-6 text-blue-400">The QueryIO Way</h3>
            <ul className="space-y-4">
              {[
                "Ask in plain English, get instant answers",
                "Readable SQL + explanations included",
                "Guardrails enforce read-only access",
                "Save & reuse questions safely"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white">
                  <Check size={18} className="text-blue-500 shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-center mt-8 text-white/40 text-sm">Built for teams that want speed without breaking production.</div>
      </Section>

      {/* 6. How It Works */}
      <Section id="how-it-works">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {[
            { step: "01", title: "Connect", desc: "Securely connect your database using read-only credentials." },
            { step: "02", title: "Ask", desc: "Type your question in plain English. We handle the complex joins." },
            { step: "03", title: "Review", desc: "Verify the generated SQL, view results, and save the insight." },
          ].map((item, i) => (
            <div key={i} className="relative">
              <div className="text-6xl font-bold text-white/[0.03] absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 select-none">
                {item.step}
              </div>
              <div className="relative z-10 pt-8">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/60">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 7. Pricing */}
      <Section id="pricing">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Simple plans for teams</h2>
          <p className="text-white/60 text-lg">Start for free, upgrade as you scale.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Basic */}
          <div className="p-8 rounded-2xl bg-[#0B0D10] border border-white/10 flex flex-col">
            <div className="text-white/60 font-medium mb-4">Basic</div>
            <div className="text-4xl font-bold mb-2">Free</div>
            <p className="text-sm text-white/40 mb-8">Best for hobbyists.</p>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex gap-2 text-sm text-white/70"><Check size={16} /> 1 Database Connection</li>
              <li className="flex gap-2 text-sm text-white/70"><Check size={16} /> 50 Queries / mo</li>
            </ul>
            <Button variant="outline" className="w-full">Join Waitlist</Button>
          </div>

          {/* Standard */}
          <div className="p-8 rounded-2xl bg-[#151921] border border-white/20 relative shadow-2xl flex flex-col transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white text-black px-3 py-1 rounded-b-lg text-xs font-bold uppercase tracking-wide">
              Most Popular
            </div>
            <div className="text-blue-400 font-medium mb-4 mt-2">Standard</div>
            <div className="text-4xl font-bold mb-2">$29<span className="text-lg text-white/40 font-normal">/mo</span></div>
            <p className="text-sm text-white/40 mb-8">For growing startups.</p>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex gap-2 text-sm text-white"><Check size={16} className="text-blue-400" /> 5 Database Connections</li>
              <li className="flex gap-2 text-sm text-white"><Check size={16} className="text-blue-400" /> Unlimited Queries</li>
              <li className="flex gap-2 text-sm text-white"><Check size={16} className="text-blue-400" /> Save & Share Dashboards</li>
            </ul>
            <Button variant="primary" className="w-full">Get Early Access</Button>
          </div>

          {/* Pro */}
          <div className="p-8 rounded-2xl bg-[#0B0D10] border border-white/10 flex flex-col">
            <div className="text-white/60 font-medium mb-4">Pro</div>
            <div className="text-4xl font-bold mb-2">Custom</div>
            <p className="text-sm text-white/40 mb-8">For enterprise security.</p>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex gap-2 text-sm text-white/70"><Check size={16} /> SSO & Audit Logs</li>
              <li className="flex gap-2 text-sm text-white/70"><Check size={16} /> On-premise deployment</li>
            </ul>
            <Button variant="outline" className="w-full">Talk to us</Button>
          </div>
        </div>
      </Section>

      {/* 8. FAQ */}
      <Section id="faq" className="max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "Is it safe to connect my database?", a: "Yes. QueryIO connects using Read-Only credentials that you provide. We cannot modify or delete your data." },
            { q: "Do you store my data?", a: "No. We only store your schema structure (table names, column types) to generate accurate queries. Your actual row data passes through to your browser and is not persisted." },
            { q: "Which databases are supported?", a: "We currently support Postgres and MySQL. Support for Snowflake and BigQuery is coming soon." },
            { q: "How accurate is the SQL generation?", a: "We use advanced LLMs fine-tuned on SQL dialects. However, we always show you the generated SQL for review before execution." }
          ].map((faq, i) => (
            <div key={i} className="border border-white/10 rounded-lg bg-[#10141A] overflow-hidden">
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                  <span className="font-medium text-white/90">{faq.q}</span>
                  <ChevronDown className="transition-transform group-open:rotate-180 text-white/40" />
                </summary>
                <div className="px-6 pb-6 text-white/60 leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              </details>
            </div>
          ))}
        </div>
      </Section>

      {/* 9. Final CTA */}
      <div className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Get early access to QueryIO.</h2>
          <p className="text-xl text-white/60 mb-10">Join the waitlist and be first to try natural language SQL with guardrails.</p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-[#10141A] border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-white text-white placeholder:text-white/40"
            />
            <Button variant="primary">Join Waitlist</Button>
          </form>
          <p className="mt-4 text-xs text-white/30">No spam. Unsubscribe anytime.</p>
        </div>
      </div>

      {/* 10. Footer */}
      <footer className="border-t border-white/10 bg-[#050608] pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center text-black text-xs">Q</div>
              QueryIO
            </div>
            <p className="text-white/40 max-w-xs">
              Making databases accessible to everyone through natural language. Safe, secure, and fast.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">Changelog</a></li>
              <li><a href="#" className="hover:text-white">Docs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/30">
          <p>© 2024 QueryIO Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#">Twitter</a>
            <a href="#">GitHub</a>
            <a href="#">LinkedIn</a>
          </div>
        </div>
      </footer>

    </div>
  );
}