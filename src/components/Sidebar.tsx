"use client";

import { LayoutDashboard, TrendingUp, Activity, ChevronRight, Bot, Cpu } from "lucide-react";

export type ActiveView = "dashboard" | "analytics" | "market-trends" | "agent-detail";

export const AGENT_KEYS = [
  "research",
  "financial",
  "news",
  "sentiment",
  "risk",
  "decision",
  "report",
] as const;
export type AgentKey = (typeof AGENT_KEYS)[number];

const navItems: { label: string; icon: any; view: ActiveView }[] = [
  { label: "Dashboard", icon: LayoutDashboard, view: "dashboard" },
  { label: "Analytics", icon: Activity, view: "analytics" },
  { label: "Market Trends", icon: TrendingUp, view: "market-trends" },
];

const agents: { label: string; key: AgentKey; color: string; role: string }[] = [
  { label: "Research Agent", key: "research", color: "var(--accent)", role: "Foundation Builder" },
  { label: "Financial Agent", key: "financial", color: "#0891B2", role: "Quant Analyst" },
  { label: "News Agent", key: "news", color: "#7C3AED", role: "Info Scraper" },
  { label: "Sentiment Agent", key: "sentiment", color: "#D97706", role: "NLP Classifier" },
  { label: "Risk Agent", key: "risk", color: "#DC2626", role: "Risk Officer" },
  { label: "Decision Agent", key: "decision", color: "#059669", role: "Portfolio Manager" },
  { label: "Report Agent", key: "report", color: "#6B7280", role: "Publisher" },
];

interface SidebarProps {
  activeView: ActiveView;
  selectedAgent: AgentKey | null;
  analysisComplete: boolean;
  onViewChange: (view: ActiveView) => void;
  onAgentClick: (agent: AgentKey) => void;
}

export default function Sidebar({
  activeView,
  selectedAgent,
  analysisComplete,
  onViewChange,
  onAgentClick,
}: SidebarProps) {
  return (
    <aside
      className="hidden lg:flex flex-col"
      style={{
        width: 240,
        minHeight: "100vh",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
        flexShrink: 0,
      }}
    >
      {/* Logo area */}
      <div
        style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, var(--accent) 0%, #9333EA 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(79,70,229,0.3)",
            }}
          >
            <TrendingUp size={18} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.02em", color: "var(--text)" }}>
              InvestIQ
            </div>
            <div style={{ fontSize: 10, color: "var(--text-4)", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              AI Research
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: "12px 12px 0", flex: 1 }}>
        <div className="section-label" style={{ padding: "0 8px 8px" }}>
          Navigation
        </div>
        {navItems.map(({ label, icon: Icon, view }) => {
          const active = activeView === view;
          const disabled = !analysisComplete && view !== "dashboard";
          return (
            <button
              key={label}
              onClick={() => !disabled && onViewChange(view)}
              className={`sidebar-item ${active ? "active" : ""}`}
              style={{
                marginBottom: 2,
                opacity: disabled ? 0.45 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
              }}
              title={disabled ? "Analyze a company first" : undefined}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 2} />
              <span style={{ flex: 1 }}>{label}</span>
              {active && <ChevronRight size={14} style={{ opacity: 0.5 }} />}
            </button>
          );
        })}

        {/* Divider */}
        <div style={{ borderTop: "1px solid var(--border)", margin: "16px 0 12px" }} />

        {/* AI Agents section */}
        <div className="section-label" style={{ padding: "0 8px 10px" }}>
          AI Agents
        </div>
        {!analysisComplete && (
          <div
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              marginBottom: 8,
            }}
          >
            <p style={{ fontSize: 11, color: "var(--text-4)", lineHeight: 1.4, textAlign: "center" }}>
              Run an analysis to explore each agent's data &amp; reasoning
            </p>
          </div>
        )}
        {agents.map(({ label, key, color, role }) => {
          const isActive = selectedAgent === key && activeView === "agent-detail";
          return (
            <button
              key={key}
              onClick={() => analysisComplete && onAgentClick(key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "7px 10px",
                borderRadius: 8,
                marginBottom: 2,
                width: "100%",
                border: isActive ? `1px solid ${color}33` : "1px solid transparent",
                background: isActive ? `${color}12` : "transparent",
                cursor: analysisComplete ? "pointer" : "not-allowed",
                opacity: analysisComplete ? 1 : 0.45,
                transition: "all 0.15s ease",
                textAlign: "left",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                if (analysisComplete && !isActive) {
                  (e.currentTarget as HTMLElement).style.background = "var(--surface-2)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }
              }}
              title={!analysisComplete ? "Analyze a company first" : `View ${label} details`}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: color,
                  flexShrink: 0,
                  boxShadow: isActive ? `0 0 6px ${color}88` : "none",
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: isActive ? "var(--text)" : "var(--text-3)", fontWeight: isActive ? 600 : 500, lineHeight: 1.2 }}>
                  {label}
                </div>
                <div style={{ fontSize: 10, color: "var(--text-4)", lineHeight: 1 }}>
                  {role}
                </div>
              </div>
              {isActive && <ChevronRight size={12} style={{ color, flexShrink: 0 }} />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--accent-light)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "10px 12px",
          }}
        >
          <Bot size={14} color="var(--accent)" />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--accent-text)" }}>
              InvestIQ AI Engine
            </div>
            <div style={{ fontSize: 10, color: "var(--text-4)" }}>Multi-Agent Orchestration</div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-4)", textAlign: "center" }}>
          InvestIQ AI v1.0.0
        </div>
      </div>
    </aside>
  );
}
