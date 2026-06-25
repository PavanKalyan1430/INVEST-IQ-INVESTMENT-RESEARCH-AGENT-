"use client";

import { Building2, Package, Users, TrendingUp, TrendingDown, ChevronDown, ChevronUp } from "lucide-react";
import { CompanyResearch } from "@/types/graph";
import { useState } from "react";

export default function ResearchCard({ research }: { research: CompanyResearch }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="card fade-in" style={{ padding: 0, overflow: "hidden", marginBottom: "16px" }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "20px 24px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          borderBottom: expanded ? "1px solid var(--border)" : "none",
          transition: "background 0.2s",
        }}
      >
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Building2 size={20} color="var(--accent)" />
        </div>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Research Analysis</div>
          <div style={{ fontSize: 13, color: "var(--text-3)" }}>{research.industry}</div>
        </div>
        {expanded ? <ChevronUp size={20} color="var(--text-4)" /> : <ChevronDown size={20} color="var(--text-4)" />}
      </button>

      {expanded && (
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 24, background: "var(--surface)" }}>
          {/* Overview */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Overview</div>
            <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.6 }}>{research.overview}</p>
          </div>

          {/* Business Model */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Business Model</div>
            <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.6 }}>{research.businessModel}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
            {/* Products */}
            <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Package size={16} color="#8B5CF6" />
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Core Products</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {research.products.map((p, i) => (
                  <span key={i} style={{ fontSize: 13, color: "var(--text-2)", background: "var(--surface)", border: "1px solid var(--border)", padding: "4px 10px", borderRadius: 100 }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Competitors */}
            <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Users size={16} color="#F59E0B" />
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Key Competitors</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {research.competitors.map((c, i) => (
                  <span key={i} style={{ fontSize: 13, color: "var(--text-2)", background: "var(--surface)", border: "1px solid var(--border)", padding: "4px 10px", borderRadius: 100 }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
            <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
                <TrendingUp size={16} color="var(--buy)" /> Strengths
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {research.strengths.map((s, i) => (
                  <div key={i} style={{ fontSize: 13, color: "var(--text-2)", display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <div style={{ color: "var(--buy)", marginTop: 2, flexShrink: 0 }}>●</div>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
                <TrendingDown size={16} color="var(--pass)" /> Weaknesses
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {research.weaknesses.map((w, i) => (
                  <div key={i} style={{ fontSize: 13, color: "var(--text-2)", display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <div style={{ color: "var(--pass)", marginTop: 2, flexShrink: 0 }}>●</div>
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
