"use client";

import { Shield, ChevronDown, ChevronUp } from "lucide-react";
import { RiskAnalysis } from "@/types/graph";
import { useState } from "react";

export default function RiskCard({ risk }: { risk: RiskAnalysis }) {
  const [expanded, setExpanded] = useState(true);

  const riskColor =
    risk.riskLevel === "Low" ? "var(--buy)" : risk.riskLevel === "High" ? "var(--pass)" : "var(--hold)";
  const riskBg =
    risk.riskLevel === "Low" ? "var(--buy-bg)" : risk.riskLevel === "High" ? "var(--pass-bg)" : "var(--hold-bg)";
  const riskBorder =
    risk.riskLevel === "Low" ? "var(--buy-border)" : risk.riskLevel === "High" ? "var(--pass-border)" : "var(--hold-border)";

  const riskCategories = [
    { label: "Business Risk", value: risk.businessRisk },
    { label: "Financial Risk", value: risk.financialRisk },
    { label: "Market Risk", value: risk.marketRisk },
    { label: "Legal Risk", value: risk.legalRisk },
    { label: "Competitive Risk", value: risk.competitiveRisk },
  ];

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
        }}
      >
        <div style={{ width: 40, height: 40, borderRadius: 10, background: riskBg, border: `1px solid ${riskBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Shield size={20} color={riskColor} />
        </div>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Risk Assessment</div>
          <div style={{ fontSize: 13, color: riskColor, fontWeight: 700 }}>
            {risk.riskLevel} Risk — Score: {risk.riskScore}/100
          </div>
        </div>
        {expanded ? <ChevronUp size={20} color="var(--text-4)" /> : <ChevronDown size={20} color="var(--text-4)" />}
      </button>

      {expanded && (
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Risk meter */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 13 }}>
              <span style={{ color: "var(--text-3)", fontWeight: 600 }}>Overall Risk Exposure</span>
              <span style={{ color: riskColor, fontWeight: 800 }}>{risk.riskScore}/100</span>
            </div>
            <div style={{ height: 10, background: "var(--surface-2)", borderRadius: 100, border: "1px solid var(--border)", overflow: "hidden", display: "flex" }}>
              <div style={{ width: "33.33%", background: risk.riskScore <= 33 ? "var(--buy)" : "var(--surface-2)", transition: "background 0.5s" }} />
              <div style={{ width: "33.33%", background: risk.riskScore > 33 && risk.riskScore <= 66 ? "var(--hold)" : "var(--surface-2)", transition: "background 0.5s", borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)" }} />
              <div style={{ width: "33.33%", background: risk.riskScore > 66 ? "var(--pass)" : "var(--surface-2)", transition: "background 0.5s" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "var(--text-4)", fontWeight: 600, textTransform: "uppercase" }}>
              <span style={{ color: risk.riskScore <= 33 ? "var(--buy)" : "var(--text-4)" }}>Low</span>
              <span style={{ color: risk.riskScore > 33 && risk.riskScore <= 66 ? "var(--hold)" : "var(--text-4)" }}>Medium</span>
              <span style={{ color: risk.riskScore > 66 ? "var(--pass)" : "var(--text-4)" }}>High</span>
            </div>
          </div>

          {/* Risk Categories */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Risk Breakdown</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              {riskCategories.map(({ label, value }) => (
                <div key={label} style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.5 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
