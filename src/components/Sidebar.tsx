"use client";

import { LayoutDashboard, TrendingUp, Activity, Settings, Sparkles, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Analytics", icon: Activity, href: "/" },
  { label: "Market Trends", icon: TrendingUp, href: "/" },
];

const agents = [
  { label: "Research Agent", color: "#4F46E5" },
  { label: "Financial Agent", color: "#0891B2" },
  { label: "News Agent", color: "#7C3AED" },
  { label: "Sentiment Agent", color: "#D97706" },
  { label: "Risk Agent", color: "#DC2626" },
  { label: "Decision Agent", color: "#059669" },
  { label: "Report Agent", color: "#374151" },
];

export default function Sidebar() {
  const pathname = usePathname();

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
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
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
        {navItems.map(({ label, icon: Icon, href }) => {
          const active = pathname === href && label === "Dashboard";
          return (
            <a
              key={label}
              href={href}
              className={`sidebar-item ${active ? "active" : ""}`}
              style={{ marginBottom: 2 }}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 2} />
              <span style={{ flex: 1 }}>{label}</span>
              {active && <ChevronRight size={14} style={{ opacity: 0.5 }} />}
            </a>
          );
        })}

        {/* Divider */}
        <div style={{ borderTop: "1px solid var(--border)", margin: "16px 0 12px" }} />

        {/* AI Agents section */}
        <div className="section-label" style={{ padding: "0 8px 10px" }}>
          AI Agents
        </div>
        {agents.map(({ label, color }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 8px",
              borderRadius: 6,
              marginBottom: 2,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 12, color: "var(--text-3)", fontWeight: 500 }}>
              {label}
            </span>
          </div>
        ))}
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
            border: "1px solid #C7D2FE",
            borderRadius: 8,
            padding: "10px 12px",
          }}
        >
          <Sparkles size={14} color="var(--accent)" />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--accent-text)" }}>
              Gemini 2.5 Flash
            </div>
            <div style={{ fontSize: 10, color: "var(--text-4)" }}>+ Groq fallback</div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-4)", textAlign: "center" }}>
          InvestIQ AI v1.0.0
        </div>
      </div>
    </aside>
  );
}
