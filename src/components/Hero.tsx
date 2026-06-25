"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ArrowRight, Zap, Shield, BarChart3, Brain } from "lucide-react";

const COMPANIES = ["Apple", "Tesla", "NVIDIA", "Microsoft", "Google", "Amazon", "Meta", "Netflix"];

const FEATURES = [
  { icon: Brain, label: "7 AI Agents", desc: "Specialized research, financial, sentiment & more" },
  { icon: BarChart3, label: "Financial Data", desc: "Balance sheet, revenue, cash flow analysis" },
  { icon: Shield, label: "Risk Assessment", desc: "Multi-dimensional risk profiling & scoring" },
  { icon: Zap, label: "< 30 Seconds", desc: "Full institutional-grade report in seconds" },
];

interface HeroProps {
  onAnalyze: (company: string) => void;
  loading?: boolean;
}

export default function Hero({ onAnalyze, loading }: HeroProps) {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: "/" focuses the search
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
    <section
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px 80px",
        background: "var(--bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 60% 20%, rgba(79,70,229,0.06) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(124,58,237,0.04) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      {/* Top badge */}
      <div
        className="fade-in"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "var(--accent-light)",
          border: "1px solid #C7D2FE",
          borderRadius: 100,
          padding: "5px 14px",
          marginBottom: 28,
          fontSize: 12,
          color: "var(--accent-text)",
          fontWeight: 600,
          letterSpacing: "0.02em",
        }}
      >
        <span
          style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }}
          className="pulse-dot"
        />
        Live AI Research Platform · Powered by Gemini 2.5 Flash
      </div>

      {/* Headline */}
      <h1
        className="fade-in"
        style={{
          fontSize: "clamp(2rem, 5vw, 3.25rem)",
          fontWeight: 900,
          textAlign: "center",
          lineHeight: 1.1,
          letterSpacing: "-0.04em",
          marginBottom: 16,
          maxWidth: 760,
          color: "var(--text)",
          animationDelay: "0.05s",
          opacity: 0,
          animationFillMode: "forwards",
        }}
      >
        Institutional-Grade Research,{" "}
        <span
          style={{
            background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Powered by AI
        </span>
      </h1>

      <p
        className="fade-in"
        style={{
          fontSize: 17,
          color: "var(--text-3)",
          textAlign: "center",
          marginBottom: 40,
          maxWidth: 540,
          lineHeight: 1.65,
          animationDelay: "0.1s",
          opacity: 0,
          animationFillMode: "forwards",
          fontWeight: 400,
        }}
      >
        7 specialized AI agents analyze any public company in under 30 seconds and deliver a
        transparent <strong style={{ color: "var(--text-2)", fontWeight: 600 }}>BUY</strong>,{" "}
        <strong style={{ color: "var(--text-2)", fontWeight: 600 }}>HOLD</strong>, or{" "}
        <strong style={{ color: "var(--text-2)", fontWeight: 600 }}>PASS</strong> recommendation.
      </p>

      {/* Search box */}
      <form
        onSubmit={handleSubmit}
        className="fade-in"
        style={{
          width: "100%",
          maxWidth: 580,
          position: "relative",
          animationDelay: "0.15s",
          opacity: 0,
          animationFillMode: "forwards",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "var(--surface)",
            border: `1.5px solid ${focused ? "var(--accent)" : "var(--border)"}`,
            borderRadius: 14,
            padding: "6px 6px 6px 16px",
            gap: 8,
            transition: "border-color 0.15s, box-shadow 0.15s",
            boxShadow: focused
              ? "0 0 0 3px rgba(79,70,229,0.12), var(--shadow-md)"
              : "var(--shadow)",
          }}
        >
          <Search
            size={18}
            color={focused ? "var(--accent)" : "var(--text-4)"}
            style={{ flexShrink: 0, transition: "color 0.15s" }}
          />
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
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text)",
              fontSize: 15,
              fontFamily: "inherit",
              fontWeight: 500,
              padding: "8px 0",
            }}
          />
          {/* Keyboard hint */}
          {!focused && !input && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                flexShrink: 0,
                marginRight: 4,
              }}
            >
              <span
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  padding: "2px 6px",
                  fontSize: 11,
                  color: "var(--text-4)",
                  fontFamily: "monospace",
                }}
              >
                /
              </span>
            </div>
          )}
          <button
            type="submit"
            disabled={!input.trim() || !!loading}
            className="btn-primary"
            style={{
              flexShrink: 0,
              borderRadius: 10,
              padding: "9px 20px",
              fontSize: 14,
              opacity: !input.trim() ? 0.45 : 1,
              cursor: !input.trim() ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "white",
                    borderRadius: "50%",
                  }}
                  className="spin"
                />
                Analyzing
              </>
            ) : (
              <>
                Analyze
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Company chips */}
      <div
        className="fade-in"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: 18,
          animationDelay: "0.2s",
          opacity: 0,
          animationFillMode: "forwards",
        }}
      >
        <span style={{ fontSize: 12, color: "var(--text-4)", fontWeight: 500 }}>Try:</span>
        {COMPANIES.map((company) => (
          <button
            key={company}
            onClick={() => handleChip(company)}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 100,
              padding: "4px 14px",
              fontSize: 12,
              color: "var(--text-2)",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 500,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "var(--accent-light)";
              el.style.borderColor = "#A5B4FC";
              el.style.color = "var(--accent-text)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "var(--surface)";
              el.style.borderColor = "var(--border)";
              el.style.color = "var(--text-2)";
            }}
          >
            {company}
          </button>
        ))}
      </div>

      {/* Feature cards */}
      <div
        className="fade-in"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
          maxWidth: 900,
          width: "100%",
          marginTop: 60,
          animationDelay: "0.25s",
          opacity: 0,
          animationFillMode: "forwards",
        }}
      >
        {FEATURES.map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className="card"
            style={{ padding: "18px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "var(--accent-light)",
                border: "1px solid #C7D2FE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon size={17} color="var(--accent)" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 3 }}>
                {label}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.5 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div
        className="fade-in"
        style={{
          display: "flex",
          gap: 48,
          marginTop: 52,
          flexWrap: "wrap",
          justifyContent: "center",
          animationDelay: "0.3s",
          opacity: 0,
          animationFillMode: "forwards",
        }}
      >
        {[
          { value: "7", label: "AI Agents" },
          { value: "5+", label: "Data Sources" },
          { value: "< 30s", label: "Analysis Time" },
          { value: "3-Way", label: "Decision Model" },
        ].map(({ value, label }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: "var(--accent)",
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              {value}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-4)", marginTop: 5, fontWeight: 500 }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
