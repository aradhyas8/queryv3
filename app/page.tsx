"use client";

import React, { useState, useEffect } from "react";
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
  X,
  ArrowRight,
  Sparkles,
  Lock,
  Play
} from "lucide-react";

// --- Enhanced Components ---

const Button = ({
  children,
  variant = "primary",
  size = "default",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "default" | "lg" | "sm";
}) => {
  const baseStyles = "rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group";

  const sizes = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variants = {
    primary: "bg-white text-black hover:bg-white/90 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20",
    outline: "border-2 border-white/20 text-white hover:bg-white/5 hover:border-white/30",
    ghost: "text-white/70 hover:text-white hover:bg-white/5",
  };

  return (
    <button className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Section = ({ children, className = "", id = "" }: { children: React.ReactNode; className?: string, id?: string }) => (
  <section id={id} className={`px-6 py-24 md:py-32 lg:py-40 max-w-7xl mx-auto ${className}`}>
    {children}
  </section>
);

const Badge = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-semibold tracking-wide text-blue-300 uppercase bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-400/30 backdrop-blur-sm ${className}`}>
    <Sparkles size={12} className="animate-pulse" />
    {children}
  </span>
);

const GradientBlur = ({ className = "", color = "blue" }: { className?: string; color?: string }) => {
  const colors = {
    blue: "bg-blue-500/30",
    purple: "bg-purple-500/30",
    pink: "bg-pink-500/30",
  };

  return <div className={`absolute ${colors[color as keyof typeof colors]} opacity-20 blur-[150px] rounded-full pointer-events-none ${className}`} />;
};

// --- Main Page Component ---

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Active section detection
      const sections = ["features", "how-it-works", "pricing", "faq"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D10] text-white/90 selection:bg-white/20 overflow-x-hidden">

      {/* 1. Enhanced Sticky Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${isScrolled
            ? "bg-[#0B0D10]/70 backdrop-blur-xl border-white/10 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            : "bg-transparent border-transparent py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight cursor-pointer group">
            <div className="w-9 h-9 bg-gradient-to-br from-white via-gray-200 to-gray-400 rounded-xl flex items-center justify-center text-black shadow-lg group-hover:shadow-white/20 transition-all group-hover:scale-110">
              Q
            </div>
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">QueryIO</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium">
            {[
              { name: "Features", id: "features" },
              { name: "How it works", id: "how-it-works" },
              { name: "Pricing", id: "pricing" },
              { name: "FAQ", id: "faq" }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${activeSection === item.id
                    ? "text-white bg-white/10"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm">Log in</Button>
            <Button variant="primary" size="sm" className="shadow-lg">
              Join Waitlist
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Enhanced Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#0B0D10]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
            <div className="p-6 flex flex-col gap-2">
              {["Features", "How it works", "Pricing", "FAQ"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replace(/\s/g, "-"))}
                  className="text-white/80 py-3 px-4 text-left hover:bg-white/5 rounded-lg transition-colors"
                >
                  {item}
                </button>
              ))}
              <div className="h-px bg-white/10 my-2" />
              <Button variant="primary" className="w-full justify-center">
                Join Waitlist
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* 2. Enhanced Hero Section */}
      <div className="relative pt-32 pb-20 md:pt-44 md:pb-32 lg:pt-52 px-6 max-w-7xl mx-auto">
        {/* Enhanced Background Effects */}
        <GradientBlur className="top-0 left-1/4 w-[800px] h-[800px]" color="blue" />
        <GradientBlur className="top-40 right-1/4 w-[600px] h-[600px]" color="purple" />

        <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8">
            <Badge>Coming Soon • Early Access</Badge>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
              Ask your database in{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                  plain English.
                </span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-lg -z-10" />
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-xl leading-relaxed">
              QueryIO converts natural language into safe, readable SQL for Postgres & MySQL—so anyone can get answers without writing queries.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <form className="flex w-full sm:max-w-md group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-white/5 border border-white/20 rounded-l-xl px-5 py-3.5 focus:outline-none focus:border-white/40 focus:bg-white/[0.07] text-white placeholder:text-white/40 transition-all backdrop-blur-sm"
                />
                <Button variant="primary" className="rounded-l-none">
                  Join Waitlist
                </Button>
              </form>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-white/40 uppercase tracking-wider font-semibold">
              <div className="flex items-center gap-2">
                <Database size={14} className="text-blue-400" />
                <span>Postgres & MySQL</span>
              </div>
              <div className="w-1 h-1 bg-white/30 rounded-full" />
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-green-400" />
                <span>Read-Only Safe</span>
              </div>
              <div className="w-1 h-1 bg-white/30 rounded-full" />
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-purple-400" />
                <span>No Spam</span>
              </div>
            </div>
          </div>

          {/* Enhanced Dashboard Preview */}
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500" />

            <div className="relative bg-gradient-to-br from-[#10141A] to-[#0B0D10] border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
              {/* Window controls */}
              <div className="bg-gradient-to-r from-[#0B0D10] to-[#10141A] px-5 py-4 border-b border-white/10 flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.3)]" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/30 border border-yellow-500/50 shadow-[0_0_8px_rgba(234,179,8,0.3)]" />
                  <div className="w-3 h-3 rounded-full bg-green-500/30 border border-green-500/50 shadow-[0_0_8px_rgba(34,197,94,0.3)]" />
                </div>
                <div className="ml-3 text-xs text-white/30 font-mono tracking-tight">QueryIO Dashboard</div>
              </div>

              <div className="p-8 space-y-6">
                {/* User query */}
                <div className="flex items-start gap-3 animate-fade-in">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-lg">
                    <Database size={18} />
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-[#1C2029] to-[#151921] p-5 rounded-xl rounded-tl-none border border-white/10 text-base shadow-lg">
                    What were revenue and churn last 30 days?
                  </div>
                </div>

                {/* Generated SQL */}
                <div className="border border-white/10 rounded-xl overflow-hidden bg-black/30 backdrop-blur-sm shadow-inner">
                  <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-green-500/5 to-emerald-500/5 border-b border-white/5">
                    <span className="text-xs text-green-400 font-mono flex items-center gap-2 font-semibold">
                      <Check size={14} className="animate-pulse" /> Generated SQL
                    </span>
                    <span className="text-xs text-white/40 flex items-center gap-1.5">
                      <Lock size={12} />
                      Read-only mode
                    </span>
                  </div>
                  <pre className="font-mono text-sm text-white/80 overflow-x-auto p-5 leading-relaxed">
                    <span className="text-purple-400">SELECT</span> <span className="text-blue-300">SUM</span>(amount) <span className="text-white/50">as</span> revenue,{"\n"}
                    {"       "}<span className="text-blue-300">COUNT</span>(id) <span className="text-white/50">as</span> churn{"\n"}
                    <span className="text-purple-400">FROM</span> subscriptions{"\n"}
                    <span className="text-purple-400">WHERE</span> status = <span className="text-green-400">'cancelled'</span>{"\n"}
                    <span className="text-purple-400">AND</span> date {'>'} <span className="text-blue-300">NOW</span>() - <span className="text-purple-400">INTERVAL</span> <span className="text-green-400">'30 days'</span>;
                  </pre>
                </div>

                {/* Blurred Results */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">Results</span>
                    <span className="text-xs text-white/30">2 rows</span>
                  </div>
                  <div className="space-y-2 opacity-40 blur-sm select-none">
                    <div className="h-10 bg-gradient-to-r from-white/10 to-white/5 rounded-lg border border-white/10" />
                    <div className="h-10 bg-gradient-to-r from-white/5 to-white/10 rounded-lg border border-white/10" />
                    <div className="h-10 bg-gradient-to-r from-white/10 to-white/5 rounded-lg border border-white/10 w-3/4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Enhanced Social Proof */}
      <div className="border-y border-white/5 bg-gradient-to-r from-white/[0.01] to-white/[0.03] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <p className="text-center text-xs text-white/30 mb-10 font-semibold uppercase tracking-widest">Trusted by teams from</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-8 w-28 bg-gradient-to-r from-white/10 to-white/20 rounded-lg animate-pulse opacity-30 hover:opacity-50 transition-opacity"
              />
            ))}
          </div>
        </div>
      </div>

      {/* 4. Enhanced Features Grid */}
      <Section id="features">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Get answers fast.{" "}
            <span className="bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
              Keep control.
            </span>
          </h2>
          <p className="text-white/60 text-lg md:text-xl leading-relaxed">
            QueryIO helps you explore data safely without becoming a SQL expert.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[
            {
              icon: <Code />,
              title: "Natural Language → SQL",
              desc: "Type in English, get production-ready SQL you can inspect before running.",
              gradient: "from-blue-500/10 to-cyan-500/10",
              iconBg: "from-blue-500/20 to-cyan-500/20",
              iconColor: "text-blue-300"
            },
            {
              icon: <ShieldCheck />,
              title: "Safer by Default",
              desc: "Read-only connections, row limits, and guardrails to prevent heavy loads.",
              gradient: "from-green-500/10 to-emerald-500/10",
              iconBg: "from-green-500/20 to-emerald-500/20",
              iconColor: "text-green-300"
            },
            {
              icon: <Layout />,
              title: "Saved Insights",
              desc: "Save complex queries as dashboard widgets to share with your team.",
              gradient: "from-purple-500/10 to-pink-500/10",
              iconBg: "from-purple-500/20 to-pink-500/20",
              iconColor: "text-purple-300"
            },
            {
              icon: <Database />,
              title: "Postgres & MySQL",
              desc: "Native support for the world's most popular relational databases.",
              gradient: "from-orange-500/10 to-red-500/10",
              iconBg: "from-orange-500/20 to-red-500/20",
              iconColor: "text-orange-300"
            },
            {
              icon: <Zap />,
              title: "Schema Aware",
              desc: "QueryIO reads your schema structure (not your data) to understand relationships.",
              gradient: "from-yellow-500/10 to-amber-500/10",
              iconBg: "from-yellow-500/20 to-amber-500/20",
              iconColor: "text-yellow-300"
            },
            {
              icon: <ChevronRight />,
              title: "Export in One Click",
              desc: "Download results to CSV or JSON instantly for further analysis.",
              gradient: "from-indigo-500/10 to-violet-500/10",
              iconBg: "from-indigo-500/20 to-violet-500/20",
              iconColor: "text-indigo-300"
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="group relative bg-gradient-to-br from-[#10141A] to-[#0B0D10] border border-white/10 p-8 rounded-2xl hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5 hover:-translate-y-1"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />

              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.iconBg} border border-white/10 flex items-center justify-center mb-6 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 5. Enhanced Comparison Section */}
      <Section className="relative">
        <GradientBlur className="top-1/2 left-0 w-[600px] h-[600px]" color="pink" />

        <div className="relative bg-gradient-to-b from-[#0B0D10] via-[#10141A] to-[#0B0D10] rounded-3xl border border-white/10 p-8 md:p-12 lg:p-16 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Old Way */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative p-8 lg:p-10 rounded-2xl bg-gradient-to-br from-red-500/5 to-orange-500/5 border border-red-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                    <X size={16} className="text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-red-300">Typical Approach</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Wait days for an analyst ticket",
                    "Copy/paste unverified SQL from ChatGPT",
                    "Accidentally run DELETE queries",
                    "Hard to trust or verify results"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/70 leading-relaxed">
                      <X size={18} className="text-red-400 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* New Way */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-8 lg:p-10 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 shadow-xl">
                <div className="absolute top-0 right-0 px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-xs font-bold uppercase text-white rounded-bl-xl rounded-tr-2xl shadow-lg">
                  With QueryIO
                </div>
                <div className="flex items-center gap-3 mb-6 mt-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/30 border border-blue-400/50 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Check size={16} className="text-blue-300" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-300">The QueryIO Way</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Ask in plain English, get instant answers",
                    "Readable SQL + explanations included",
                    "Guardrails enforce read-only access",
                    "Save & reuse questions safely"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white leading-relaxed">
                      <Check size={18} className="text-blue-400 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 pt-8 border-t border-white/5">
            <p className="text-white/50 text-sm md:text-base font-medium">
              Built for teams that want <span className="text-white">speed</span> without breaking <span className="text-white">production</span>.
            </p>
          </div>
        </div>
      </Section>

      {/* 6. Enhanced How It Works */}
      <Section id="how-it-works" className="relative">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Three steps to <span className="bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">better insights</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connection lines */}
          <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50" />

          {[
            {
              step: "01",
              title: "Connect",
              desc: "Securely connect your database using read-only credentials. We never modify your data.",
              icon: <Database />,
              color: "blue"
            },
            {
              step: "02",
              title: "Ask",
              desc: "Type your question in plain English. We handle the complex joins and aggregations.",
              icon: <Sparkles />,
              color: "purple"
            },
            {
              step: "03",
              title: "Review",
              desc: "Verify the generated SQL, view results instantly, and save the insight for your team.",
              icon: <Check />,
              color: "pink"
            },
          ].map((item, i) => (
            <div key={i} className="relative text-center group">
              {/* Large step number background */}
              <div className="text-[140px] font-black text-white/[0.02] absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 select-none leading-none">
                {item.step}
              </div>

              <div className="relative z-10 pt-12">
                {/* Icon circle */}
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-${item.color}-500/20 to-${item.color}-600/20 border border-${item.color}-400/30 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-${item.color}-500/20 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`text-${item.color}-300`}>
                    {item.icon}
                  </div>
                </div>

                <div className={`inline-block px-3 py-1 rounded-full bg-${item.color}-500/10 border border-${item.color}-400/30 text-${item.color}-300 text-xs font-bold uppercase tracking-wider mb-4`}>
                  Step {item.step}
                </div>

                <h3 className="text-2xl font-bold mb-4 text-white">{item.title}</h3>
                <p className="text-white/60 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 7. Enhanced Pricing */}
      <Section id="pricing" className="relative">
        <GradientBlur className="top-0 right-0 w-[800px] h-[800px]" color="purple" />

        <div className="relative text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Simple plans for <span className="bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">every team</span>
          </h2>
          <p className="text-white/60 text-lg md:text-xl">Start for free, upgrade as you scale.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
          {/* Basic */}
          <div className="p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-[#0B0D10] to-[#10141A] border border-white/10 flex flex-col hover:border-white/20 transition-all duration-300 group">
            <div className="text-white/50 font-semibold mb-2 text-sm uppercase tracking-wider">Basic</div>
            <div className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Free</div>
            <p className="text-sm text-white/40 mb-8 pb-8 border-b border-white/5">Perfect for hobbyists and side projects.</p>

            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-3 text-sm text-white/70">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Check size={12} className="text-white/50" />
                </div>
                1 Database Connection
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Check size={12} className="text-white/50" />
                </div>
                50 Queries / month
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Check size={12} className="text-white/50" />
                </div>
                Basic support
              </li>
            </ul>

            <Button variant="outline" className="w-full group-hover:border-white/30">
              Join Waitlist
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Standard - Featured */}
          <div className="relative md:-mt-4 md:mb-4">
            <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity" />

            <div className="relative p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-[#151921] via-[#10141A] to-[#0B0D10] border-2 border-white/30 flex flex-col shadow-2xl group hover:border-white/40 transition-all duration-300">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                Most Popular
              </div>

              <div className="text-blue-400 font-semibold mb-2 mt-2 text-sm uppercase tracking-wider">Standard</div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-5xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">$29</span>
                <span className="text-lg text-white/40 font-normal">/month</span>
              </div>
              <p className="text-sm text-white/50 mb-8 pb-8 border-b border-white/10">Ideal for growing startups and teams.</p>

              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-sm text-white">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-400/30">
                    <Check size={12} className="text-blue-400" />
                  </div>
                  5 Database Connections
                </li>
                <li className="flex items-center gap-3 text-sm text-white">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-400/30">
                    <Check size={12} className="text-blue-400" />
                  </div>
                  Unlimited Queries
                </li>
                <li className="flex items-center gap-3 text-sm text-white">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-400/30">
                    <Check size={12} className="text-blue-400" />
                  </div>
                  Save & Share Dashboards
                </li>
                <li className="flex items-center gap-3 text-sm text-white">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-400/30">
                    <Check size={12} className="text-blue-400" />
                  </div>
                  Priority support
                </li>
              </ul>

              <Button variant="primary" className="w-full text-lg shadow-2xl shadow-white/10">
                Get Early Access
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Pro */}
          <div className="p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-[#0B0D10] to-[#10141A] border border-white/10 flex flex-col hover:border-white/20 transition-all duration-300 group">
            <div className="text-white/50 font-semibold mb-2 text-sm uppercase tracking-wider">Pro</div>
            <div className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Custom</div>
            <p className="text-sm text-white/40 mb-8 pb-8 border-b border-white/5">Enterprise-grade security and scale.</p>

            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-3 text-sm text-white/70">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Check size={12} className="text-white/50" />
                </div>
                Unlimited Connections
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Check size={12} className="text-white/50" />
                </div>
                SSO & Audit Logs
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Check size={12} className="text-white/50" />
                </div>
                On-premise deployment
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Check size={12} className="text-white/50" />
                </div>
                Dedicated support
              </li>
            </ul>

            <Button variant="outline" className="w-full group-hover:border-white/30">
              Talk to us
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </Section>

      {/* 8. Enhanced FAQ */}
      <Section id="faq" className="max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          Frequently Asked <span className="bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">Questions</span>
        </h2>

        <div className="space-y-4">
          {[
            {
              q: "Is it safe to connect my database?",
              a: "Yes. QueryIO connects using Read-Only credentials that you provide. We cannot modify or delete your data. All connections are encrypted and we enforce row limits to prevent accidental heavy queries."
            },
            {
              q: "Do you store my data?",
              a: "No. We only store your schema structure (table names, column types) to generate accurate queries. Your actual row data passes through to your browser and is not persisted on our servers."
            },
            {
              q: "Which databases are supported?",
              a: "We currently support Postgres and MySQL with full compatibility. Support for Snowflake, BigQuery, and other data warehouses is coming soon. Let us know what you need!"
            },
            {
              q: "How accurate is the SQL generation?",
              a: "We use advanced LLMs fine-tuned on SQL dialects with extensive testing. While accuracy is high, we always show you the generated SQL for review before execution, so you maintain full control."
            },
            {
              q: "Can I limit what QueryIO can access?",
              a: "Absolutely. You provide read-only credentials and can scope access to specific schemas or tables. QueryIO respects your database permissions and adds additional safety guardrails on top."
            }
          ].map((faq, i) => (
            <div
              key={i}
              className="border border-white/10 rounded-2xl bg-gradient-to-br from-[#10141A] to-[#0B0D10] overflow-hidden hover:border-white/20 transition-all duration-300 group"
            >
              <details className="group/details">
                <summary className="flex justify-between items-center p-6 lg:p-8 cursor-pointer list-none group-hover:bg-white/[0.02]">
                  <span className="font-semibold text-white/90 pr-8 text-lg">{faq.q}</span>
                  <ChevronDown className="transition-transform duration-300 group-open/details:rotate-180 text-white/40 shrink-0" size={20} />
                </summary>
                <div className="px-6 lg:px-8 pb-6 lg:pb-8 text-white/60 leading-relaxed border-t border-white/5 pt-6">
                  {faq.a}
                </div>
              </details>
            </div>
          ))}
        </div>
      </Section>

      {/* 9. Enhanced Final CTA */}
      <div className="py-32 px-6 text-center relative overflow-hidden">
        <GradientBlur className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px]" color="blue" />
        <GradientBlur className="top-1/2 right-1/4 w-[600px] h-[600px]" color="purple" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <Badge className="mx-auto">Limited Early Access</Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            Get early access to{" "}
            <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              QueryIO
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-white/60 mb-12 leading-relaxed max-w-2xl mx-auto">
            Join the waitlist and be first to try natural language SQL with enterprise-grade guardrails.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-6">
            <input
              type="email"
              placeholder="Enter your work email"
              className="flex-1 bg-white/5 border-2 border-white/20 rounded-xl px-6 py-4 focus:outline-none focus:border-white/40 focus:bg-white/[0.07] text-white placeholder:text-white/40 text-lg transition-all backdrop-blur-sm"
            />
            <Button variant="primary" size="lg" className="sm:w-auto whitespace-nowrap">
              Join Waitlist
              <ArrowRight size={20} />
            </Button>
          </form>

          <div className="flex items-center justify-center gap-6 text-xs text-white/30">
            <div className="flex items-center gap-2">
              <Check size={14} className="text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            <div className="flex items-center gap-2">
              <Lock size={14} className="text-blue-400" />
              <span>No spam, ever</span>
            </div>
          </div>
        </div>
      </div>

      {/* 10. Enhanced Footer */}
      <footer className="border-t border-white/10 bg-gradient-to-b from-[#050608] to-black pt-20 pb-10 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.015]" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 lg:gap-16 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2.5 font-bold text-xl mb-5">
                <div className="w-8 h-8 bg-gradient-to-br from-white via-gray-200 to-gray-400 rounded-xl flex items-center justify-center text-black shadow-lg">
                  Q
                </div>
                <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">QueryIO</span>
              </div>
              <p className="text-white/50 max-w-sm leading-relaxed mb-6">
                Making databases accessible to everyone through natural language. Safe, secure, and blazingly fast.
              </p>
              <div className="flex gap-4">
                {["Twitter", "GitHub", "LinkedIn"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center transition-all text-white/40 hover:text-white"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-white/20 rounded" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-5 text-white">Product</h4>
              <ul className="space-y-3 text-sm text-white/50">
                {["Features", "Pricing", "Changelog", "Roadmap", "Docs"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors inline-flex items-center gap-1 group">
                      {item}
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-5 text-white">Company</h4>
              <ul className="space-y-3 text-sm text-white/50">
                {["About", "Blog", "Careers", "Contact", "Privacy", "Terms"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors inline-flex items-center gap-1 group">
                      {item}
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/30">
            <p>© 2024 QueryIO Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Status</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}