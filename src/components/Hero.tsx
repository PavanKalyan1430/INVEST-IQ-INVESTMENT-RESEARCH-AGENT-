"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search, ArrowRight, Zap, Shield, BarChart3, Brain,
  Search as SearchIcon, Database, TrendingUp, FileText,
  MessageSquare, AlertTriangle, CheckCircle, ChevronRight
} from "lucide-react";

const COMPANIES = ["Apple", "Tesla", "NVIDIA", "Microsoft", "Google", "Amazon", "Meta", "Netflix"];

interface HeroProps {
  onAnalyze: (company: string) => void;
  loading?: boolean;
}

const AGENTS = [
  { name: "Research Agent", icon: SearchIcon, color: "#4F46E5", desc: "Searches the web and fetches the company profile, business model, and competitive landscape." },
  { name: "Financial Agent", icon: BarChart3, color: "#0891B2", desc: "Ingests 3 years of balance sheets and income statements to score financial health." },
  { name: "News Agent", icon: Database, color: "#7C3AED", desc: "Aggregates the latest global headlines and classifies news tone." },
  { name: "Sentiment Agent", icon: MessageSquare, color: "#D97706", desc: "Scores market sentiment as Bullish, Bearish, or Neutral from news flows." },
  { name: "Risk Agent", icon: AlertTriangle, color: "#DC2626", desc: "Synthesizes all signals into a 5-channel risk matrix and overall risk score." },
  { name: "Decision Agent", icon: CheckCircle, color: "#059669", desc: "Reconciles bull and bear cases to issue a final BUY, HOLD, or PASS recommendation." },
  { name: "Report Agent", icon: FileText, color: "#6B7280", desc: "Compiles everything into a UI-ready interactive report with charts and metrics." },
];

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Enter a Company",
    desc: "Type any publicly listed company name or ticker symbol into the search bar.",
    color: "#4F46E5",
  },
  {
    step: "02",
    title: "Agents Activate",
    desc: "7 specialized AI agents spin up in parallel, fetching data from 5+ external APIs in real time.",
    color: "#7C3AED",
  },
  {
    step: "03",
    title: "Intelligence Synthesized",
    desc: "Each agent reasons over its data and passes structured outputs to the next agent in the pipeline.",
    color: "#0891B2",
  },
  {
    step: "04",
    title: "Report Delivered",
    desc: "An institutional-quality investment thesis with a transparent BUY, HOLD, or PASS recommendation is delivered in under 30 seconds.",
    color: "#059669",
  },
];

export default function Hero({ onAnalyze, loading }: HeroProps) {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) onAnalyze(input.trim());
  };

  const handleChip = (company: string) => {
    setInput(company);
    inputRef.current?.focus();
  };

  return (
    <div style={{ background: "var(--bg)" }}>

      {/* ── SECTION 1: Hero Intro ── */}
      <section
        style={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 24px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 60% 20%, rgba(79,70,229,0.07) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(124,58,237,0.05) 0%, transparent 50%)",
          pointerEvents: "none",
        }} />

        {/* Top badge */}
        <div
          className="fade-in"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "var(--accent-light)", border: "1px solid #C7D2FE",
            borderRadius: 100, padding: "5px 14px", marginBottom: 28,
            fontSize: 12, color: "var(--accent-text)", fontWeight: 600, letterSpacing: "0.02em",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} className="pulse-dot" />
          Live AI Research Platform · InvestIQ AI
        </div>

        {/* Headline */}
        <h1
          className="fade-in"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 900, textAlign: "center", lineHeight: 1.08,
            letterSpacing: "-0.04em", marginBottom: 20, maxWidth: 800,
            color: "var(--text)", animationDelay: "0.05s", opacity: 0, animationFillMode: "forwards",
          }}
        >
          Institutional-Grade Research,{" "}
          <span style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Powered by AI
          </span>
        </h1>

        <p
          className="fade-in"
          style={{
            fontSize: 19, color: "var(--text-3)", textAlign: "center",
            marginBottom: 44, maxWidth: 560, lineHeight: 1.65,
            animationDelay: "0.1s", opacity: 0, animationFillMode: "forwards", fontWeight: 400,
          }}
        >
          7 specialized AI agents analyze any public company in under 30 seconds and deliver a
          transparent <strong style={{ color: "var(--text-2)", fontWeight: 700 }}>BUY</strong>,{" "}
          <strong style={{ color: "var(--text-2)", fontWeight: 700 }}>HOLD</strong>, or{" "}
          <strong style={{ color: "var(--text-2)", fontWeight: 700 }}>PASS</strong> recommendation.
        </p>

        {/* Search box */}
        <form
          onSubmit={handleSubmit}
          className="fade-in"
          style={{ width: "100%", maxWidth: 600, position: "relative", animationDelay: "0.15s", opacity: 0, animationFillMode: "forwards" }}
        >
          <div style={{
            display: "flex", alignItems: "center",
            background: "var(--surface)", border: `1.5px solid ${focused ? "var(--accent)" : "var(--border)"}`,
            borderRadius: 16, padding: "6px 6px 6px 18px", gap: 8,
            transition: "border-color 0.15s, box-shadow 0.15s",
            boxShadow: focused ? "0 0 0 3px rgba(79,70,229,0.12), var(--shadow-md)" : "var(--shadow)",
          }}>
            <Search size={18} color={focused ? "var(--accent)" : "var(--text-4)"} style={{ flexShrink: 0, transition: "color 0.15s" }} />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search a company — e.g. Apple, Tesla, NVIDIA..."
              disabled={loading}
              autoFocus
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: 15, fontFamily: "inherit", fontWeight: 500, padding: "9px 0" }}
            />
            {!focused && !input && (
              <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0, marginRight: 4 }}>
                <span style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 4, padding: "2px 6px", fontSize: 11, color: "var(--text-4)", fontFamily: "monospace" }}>/</span>
              </div>
            )}
            <button
              type="submit"
              disabled={!input.trim() || !!loading}
              className="btn-primary"
              style={{ flexShrink: 0, borderRadius: 11, padding: "10px 22px", fontSize: 14, opacity: !input.trim() ? 0.45 : 1, cursor: !input.trim() ? "not-allowed" : "pointer" }}
            >
              {loading ? (
                <>
                  <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%" }} className="spin" />
                  Analyzing
                </>
              ) : (
                <>Analyze <ArrowRight size={14} /></>
              )}
            </button>
          </div>
        </form>

        {/* Company chips */}
        <div className="fade-in" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 18, animationDelay: "0.2s", opacity: 0, animationFillMode: "forwards" }}>
          <span style={{ fontSize: 12, color: "var(--text-4)", fontWeight: 500 }}>Try:</span>
          {COMPANIES.map((company) => (
            <button
              key={company}
              onClick={() => handleChip(company)}
              style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 100, padding: "4px 14px", fontSize: 12, color: "var(--text-2)", cursor: "pointer", fontFamily: "inherit", fontWeight: 500, transition: "all 0.15s" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--accent-light)"; el.style.borderColor = "#A5B4FC"; el.style.color = "var(--accent-text)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--surface)"; el.style.borderColor = "var(--border)"; el.style.color = "var(--text-2)"; }}
            >
              {company}
            </button>
          ))}
        </div>

        {/* Stats row */}
        <div className="fade-in" style={{ display: "flex", gap: 52, marginTop: 56, flexWrap: "wrap", justifyContent: "center", animationDelay: "0.25s", opacity: 0, animationFillMode: "forwards" }}>
          {[
            { value: "7", label: "AI Agents" },
            { value: "5+", label: "Data Sources" },
            { value: "< 30s", label: "Analysis Time" },
            { value: "3-Way", label: "Decision Model" },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: "var(--accent)", letterSpacing: "-0.04em", lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 13, color: "var(--text-4)", marginTop: 5, fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 2: What is InvestIQ AI? ── */}
      <section style={{ padding: "80px 24px", background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>What is InvestIQ AI?</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 16 }}>
              Your AI-Powered Investment Research Team
            </h2>
            <p style={{ fontSize: 17, color: "var(--text-3)", lineHeight: 1.7, maxWidth: 700, margin: "0 auto" }}>
              InvestIQ AI deploys a coordinated swarm of 7 specialized AI agents that operate in parallel to perform the same analysis a team of financial analysts would spend hours completing — in under 30 seconds. Each agent has a specific role, uses dedicated data sources, and communicates through a deterministic pipeline to eliminate guesswork.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {[
              { icon: Brain, title: "Multi-Agent Orchestration", desc: "7 agents coordinated by a LangGraph Directed Acyclic Graph (DAG) — no hallucinations, no loops." },
              { icon: Database, title: "Real-Time Data Grounding", desc: "Every agent fetches live data from external APIs before reasoning — not from model memory." },
              { icon: Shield, title: "3-Tier Fallback Architecture", desc: "Primary LLM → Fallback LLM → Deterministic Mock. The system never fails silently." },
              { icon: Zap, title: "Streaming Intelligence", desc: "Watch each agent's thoughts and discoveries in real time via live SSE event streaming." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card" style={{ padding: "22px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--accent-light)", border: "1px solid #C7D2FE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={18} color="var(--accent)" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 5 }}>{title}</div>
                  <div style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.55 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: How It Works ── */}
      <section style={{ padding: "80px 24px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Workflow</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.03em", lineHeight: 1.15 }}>
              How InvestIQ AI Works
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 0, position: "relative" }}>
            {WORKFLOW_STEPS.map((step, i) => (
              <div key={step.step} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 20px", position: "relative" }}>
                {i < WORKFLOW_STEPS.length - 1 && (
                  <div style={{ position: "absolute", right: -12, top: 28, zIndex: 1, color: "var(--border-strong)" }}>
                    <ChevronRight size={20} />
                  </div>
                )}
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: `${step.color}18`, border: `2px solid ${step.color}44`,
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
                }}>
                  <span style={{ fontSize: 15, fontWeight: 900, color: step.color }}>{step.step}</span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Meet the Agents ── */}
      <section style={{ padding: "80px 24px", background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>The Swarm</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 12 }}>
              Meet the 7 AI Agents
            </h2>
            <p style={{ fontSize: 16, color: "var(--text-3)", lineHeight: 1.6 }}>
              After running an analysis, click any agent in the left sidebar to see exactly what data it fetched, how it reasoned, and what it output.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {AGENTS.map(({ name, icon: Icon, color, desc }) => (
              <div
                key={name}
                className="card"
                style={{ padding: "20px", borderLeft: `3px solid ${color}`, display: "flex", gap: 14, alignItems: "flex-start" }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: `${color}14`,
                  border: `1px solid ${color}30`, display: "flex", alignItems: "center",
                  justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon size={18} color={color} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 5 }}>{name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.55 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: Final CTA / Search ── */}
      <section style={{ padding: "100px 24px 120px", background: "var(--bg)", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.03em", marginBottom: 16, lineHeight: 1.15 }}>
            Ready to analyze your next investment?
          </h2>
          <p style={{ fontSize: 17, color: "var(--text-3)", marginBottom: 36, lineHeight: 1.65 }}>
            Enter any publicly traded company below and let the AI agents do the work.
          </p>

          <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 600, margin: "0 auto" }}>
            <div style={{
              display: "flex", alignItems: "center",
              background: "var(--surface)", border: `1.5px solid ${focused ? "var(--accent)" : "var(--border)"}`,
              borderRadius: 16, padding: "6px 6px 6px 18px", gap: 8,
              transition: "border-color 0.15s, box-shadow 0.15s",
              boxShadow: focused ? "0 0 0 3px rgba(79,70,229,0.12), var(--shadow-md)" : "var(--shadow-md)",
            }}>
              <Search size={18} color={focused ? "var(--accent)" : "var(--text-4)"} style={{ flexShrink: 0 }} />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Search a company — e.g. Apple, Tesla, NVIDIA..."
                disabled={loading}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: 15, fontFamily: "inherit", fontWeight: 500, padding: "9px 0" }}
              />
              <button
                type="submit"
                disabled={!input.trim() || !!loading}
                className="btn-primary"
                style={{ flexShrink: 0, borderRadius: 11, padding: "10px 22px", fontSize: 14, opacity: !input.trim() ? 0.45 : 1, cursor: !input.trim() ? "not-allowed" : "pointer" }}
              >
                {loading ? <>
                  <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%" }} className="spin" />
                  Analyzing
                </> : <>Analyze <ArrowRight size={14} /></>}
              </button>
            </div>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 16 }}>
            <span style={{ fontSize: 12, color: "var(--text-4)", fontWeight: 500 }}>Try:</span>
            {COMPANIES.map((company) => (
              <button
                key={company}
                onClick={() => { setInput(company); onAnalyze(company); }}
                style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 100, padding: "4px 14px", fontSize: 12, color: "var(--text-2)", cursor: "pointer", fontFamily: "inherit", fontWeight: 500, transition: "all 0.15s" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--accent-light)"; el.style.borderColor = "#A5B4FC"; el.style.color = "var(--accent-text)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--surface)"; el.style.borderColor = "var(--border)"; el.style.color = "var(--text-2)"; }}
              >
                {company}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
