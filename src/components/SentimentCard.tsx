"use client";

import { PieChart as PieChartIcon, ChevronDown, ChevronUp } from "lucide-react";
import { SentimentAnalysis } from "@/types/graph";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function SentimentCard({ sentiment }: { sentiment: SentimentAnalysis }) {
  const [expanded, setExpanded] = useState(true);

  const data = [
    { name: "Positive", value: sentiment.positivePercent, color: "var(--buy)" },
    { name: "Neutral", value: sentiment.neutralPercent, color: "var(--hold)" },
    { name: "Negative", value: sentiment.negativePercent, color: "var(--pass)" },
  ];

  const labelColor =
    sentiment.label === "Bullish" ? "var(--buy)" : sentiment.label === "Bearish" ? "var(--pass)" : "var(--hold)";

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
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--accent-light)", border: "1px solid #C7D2FE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <PieChartIcon size={20} color="var(--accent)" />
        </div>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Sentiment Analysis</div>
          <div style={{ fontSize: 13, color: labelColor, fontWeight: 700 }}>{sentiment.label} — {sentiment.sentimentScore}/100</div>
        </div>
        {expanded ? <ChevronUp size={20} color="var(--text-4)" /> : <ChevronDown size={20} color="var(--text-4)" />}
      </button>

      {expanded && (
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "center" }}>
            {/* Pie Chart */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px" }}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
                    formatter={(v: any) => [`${v}%`, undefined]}
                    labelStyle={{ fontWeight: 600, color: "var(--text)", marginBottom: 4 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Sentiment bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {data.map(({ name, value, color }) => (
                <div key={name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                    <span style={{ color: "var(--text-3)", fontWeight: 600 }}>{name}</span>
                    <span style={{ color, fontWeight: 800 }}>{value}%</span>
                  </div>
                  <div style={{ height: 6, background: "var(--surface-2)", borderRadius: 100, border: "1px solid var(--border)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${value}%`, borderRadius: 100, background: color, transition: "width 1s ease" }} />
                  </div>
                </div>
              ))}

              {/* Score */}
              <div style={{ marginTop: 12, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px", textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-4)", marginBottom: 4 }}>Sentiment Score</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: labelColor, letterSpacing: "-0.02em" }}>{sentiment.sentimentScore}</div>
                <div style={{ fontSize: 13, color: labelColor, fontWeight: 700, marginTop: 2 }}>{sentiment.label}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
