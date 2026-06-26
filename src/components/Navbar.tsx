"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Search, RotateCcw, Moon, Sun } from "lucide-react";

type AppPhase = "idle" | "analyzing" | "done" | "error";

interface NavbarProps {
  phase: AppPhase;
  companyName?: string;
  onNewSearch: () => void;
  onAnalyze?: (company: string) => void;
}

export default function Navbar({ phase, companyName, onNewSearch, onAnalyze }: NavbarProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    }
  }, []);

  const toggleDark = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header
      style={{
        height: 64,
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: 16,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "linear-gradient(135deg, var(--accent) 0%, #9333EA 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 2px 8px rgba(79,70,229,0.35)",
          }}
        >
          <TrendingUp size={17} color="white" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.02em", color: "var(--text)", lineHeight: 1 }}>
            InvestIQ<span style={{ color: "var(--accent)" }}> AI</span>
          </div>
          <div style={{ fontSize: 10, color: "var(--text-4)", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Research Platform
          </div>
        </div>
      </div>

      {/* Center — company breadcrumb or tagline */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {phase === "idle" && (
          <span style={{ fontSize: 13, color: "var(--text-4)", fontWeight: 500 }}>
            Autonomous Multi-Agent Investment Intelligence
          </span>
        )}
        {(phase === "analyzing" || phase === "done") && companyName && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: phase === "analyzing" ? "var(--accent)" : "var(--buy)",
              }}
              className={phase === "analyzing" ? "pulse-dot" : ""}
            />
            <span style={{ fontSize: 13, color: "var(--text-3)", fontWeight: 500 }}>
              {phase === "analyzing" ? "Analyzing" : "Report for"}
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
              {companyName}
            </span>
          </div>
        )}
        {phase === "error" && (
          <span style={{ fontSize: 13, color: "var(--pass)", fontWeight: 600 }}>
            Analysis failed
          </span>
        )}
      </div>

      {/* Right — actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        {phase !== "idle" && (
          <button
            onClick={onNewSearch}
            className="btn-ghost"
            style={{ gap: 6, fontSize: 13 }}
          >
            <Search size={14} />
            New Search
          </button>
        )}
        {phase === "done" && (
          <button
            onClick={onNewSearch}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-3)",
              transition: "all 0.15s",
            }}
            title="Refresh"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--accent-light)";
              (e.currentTarget as HTMLElement).style.color = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--surface-2)";
              (e.currentTarget as HTMLElement).style.color = "var(--text-3)";
            }}
          >
            <RotateCcw size={14} />
          </button>
        )}
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDark}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--text-3)",
            transition: "all 0.15s",
          }}
          title="Toggle Dark Mode"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--accent-light)";
            (e.currentTarget as HTMLElement).style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--surface-2)";
            (e.currentTarget as HTMLElement).style.color = "var(--text-3)";
          }}
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* GitHub */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-3)",
            transition: "all 0.15s",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--text)";
            (e.currentTarget as HTMLElement).style.color = "var(--bg)";
            (e.currentTarget as HTMLElement).style.borderColor = "var(--text)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--surface-2)";
            (e.currentTarget as HTMLElement).style.color = "var(--text-3)";
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.603-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
        </a>
      </div>
    </header>
  );
}
