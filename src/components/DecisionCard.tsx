"use client";

import { Brain, TrendingUp, TrendingDown, CheckCircle, XCircle } from "lucide-react";
import { DecisionData, CompanyResearch } from "@/types/graph";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChartData } from "@/types/graph";

interface DecisionCardProps {
  decision: DecisionData;
  research?: CompanyResearch;
  radarData: ChartData["radar"];
}

export default function DecisionCard({ decision, research, radarData }: DecisionCardProps) {
  const recColor =
    decision.recommendation === "BUY" ? "var(--buy)" : decision.recommendation === "HOLD" ? "var(--hold)" : "var(--pass)";
  const recBg =
    decision.recommendation === "BUY" ? "var(--buy-bg)" : decision.recommendation === "HOLD" ? "var(--hold-bg)" : "var(--pass-bg)";
  const recBorder =
    decision.recommendation === "BUY" ? "var(--buy-border)" : decision.recommendation === "HOLD" ? "var(--hold-border)" : "var(--pass-border)";

  // Bull vs Bear arguments
  const bullPoints = decision.pros;
  const bearPoints = decision.cons;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Bull vs Bear Debate */}
      <div className="card fade-in" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--accent-light)", border: "1px solid #C7D2FE", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Brain size={20} color="var(--accent)" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Bull vs Bear AI Debate</div>
            <div style={{ fontSize: 13, color: "var(--text-3)" }}>Reconciling all perspectives</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", padding: "24px", gap: 16 }}>
          {/* Bull */}
          <div style={{ background: "var(--buy-bg)", border: "1px solid var(--buy-border)", borderRadius: 12, padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <TrendingUp size={18} color="var(--buy)" />
              <span style={{ fontWeight: 700, color: "var(--buy)", fontSize: 15 }}>🐂 Bull Agent</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {bullPoints.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <CheckCircle size={16} color="var(--buy)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.5 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bear */}
          <div style={{ background: "var(--pass-bg)", border: "1px solid var(--pass-border)", borderRadius: 12, padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <TrendingDown size={18} color="var(--pass)" />
              <span style={{ fontWeight: 700, color: "var(--pass)", fontSize: 15 }}>🐻 Bear Agent</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {bearPoints.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <XCircle size={16} color="var(--pass)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.5 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decision Agent conclusion */}
        <div style={{ padding: "20px 24px", background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Brain size={16} color="var(--accent)" />
            <span style={{ fontWeight: 700, color: "var(--text)", fontSize: 14 }}>Decision Agent Synthesis</span>
          </div>
          <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.6 }}>{decision.reasoning}</p>
        </div>
      </div>

      {/* Radar Chart */}
      {radarData && radarData.length > 0 && (
        <div className="card fade-in" style={{ padding: "24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>Performance Radar</div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "var(--text-3)", fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: "var(--text-4)" }} axisLine={false} />
              <Radar name="Score" dataKey="A" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.15} strokeWidth={2} />
              <Tooltip
                contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
                formatter={(v: any) => [`${v}`, "Score"]}
                labelStyle={{ fontWeight: 600, color: "var(--text)", marginBottom: 4 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Final Decision card */}
      <div className="card fade-in" style={{ padding: "32px", border: `2px solid ${recBorder}`, background: "var(--surface)", boxShadow: `0 10px 15px -3px ${recBg}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: recBg,
            border: `1px solid ${recBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: recColor }}>
              {decision.recommendation === "BUY" ? "↑" : decision.recommendation === "HOLD" ? "→" : "↓"}
            </span>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: 4 }}>Final Verdict</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: recColor, letterSpacing: "-0.03em", lineHeight: 1 }}>
              {decision.recommendation}
            </div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right", background: "var(--surface-2)", padding: "12px 16px", borderRadius: 12, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12, color: "var(--text-4)", fontWeight: 600, marginBottom: 2 }}>Confidence Level</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "var(--accent)", letterSpacing: "-0.02em" }}>{decision.confidence}%</div>
          </div>
        </div>
        <div style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.6, background: "var(--surface-2)", padding: "20px", borderRadius: 12, border: "1px solid var(--border)" }}>
          <span style={{ fontWeight: 700, color: "var(--text)", marginRight: 8 }}>Verdict Rationale:</span>
          {decision.reasoning}
        </div>
      </div>
    </div>
  );
}
