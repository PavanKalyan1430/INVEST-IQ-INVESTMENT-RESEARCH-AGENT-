"use client";

import { Target, Brain, TrendingUp, Shield, TrendingDown } from "lucide-react";
import { DecisionData, FinancialAnalysis, SentimentAnalysis, RiskAnalysis } from "@/types/graph";

interface RecommendationCardProps {
  companyName: string;
  decision: DecisionData;
  financial?: FinancialAnalysis;
  sentiment?: SentimentAnalysis;
  risk?: RiskAnalysis;
}

export default function RecommendationCard({
  companyName,
  decision,
  financial,
  sentiment,
  risk,
}: RecommendationCardProps) {
  const rec = decision.recommendation;

  const palette = {
    BUY:  { bg: "var(--buy-bg)",  border: "var(--buy-border)",  color: "var(--buy)",  shadow: "rgba(5,150,105,0.12)",  label: "Strong Buy Signal" },
    HOLD: { bg: "var(--hold-bg)", border: "var(--hold-border)", color: "var(--hold)", shadow: "rgba(217,119,6,0.12)",   label: "Hold Position" },
    PASS: { bg: "var(--pass-bg)", border: "var(--pass-border)", color: "var(--pass)", shadow: "rgba(220,38,38,0.12)",   label: "Pass / Avoid" },
  }[rec] ?? { bg: "var(--surface-2)", border: "var(--border)", color: "var(--text)", shadow: "transparent", label: rec };

  const riskColor =
    risk?.riskLevel === "Low" ? "var(--buy)" : risk?.riskLevel === "High" ? "var(--pass)" : "var(--hold)";

  const scores = [
    { label: "Overall Score",    value: `${decision.overallScore}`, suffix: "/100", color: "var(--accent)",  icon: <Target size={15} /> },
    { label: "AI Confidence",    value: `${decision.confidence}`,   suffix: "%",    color: "#7C3AED",        icon: <Brain size={15} /> },
    { label: "Financial Health", value: `${financial?.score ?? 0}`, suffix: "/100", color: "var(--buy)",     icon: <TrendingUp size={15} /> },
    { label: "Sentiment Score",  value: `${sentiment?.sentimentScore ?? 0}`, suffix: "/100", color: "var(--hold)", icon: <TrendingUp size={15} /> },
    { label: "Risk Level",       value: risk?.riskLevel ?? "Medium", suffix: "",   color: riskColor,         icon: <Shield size={15} /> },
  ];

  return (
    <div
      className="card fade-in"
      style={{
        padding: "28px 32px",
        border: `1.5px solid ${palette.border}`,
        boxShadow: `0 0 0 1px ${palette.border}, 0 8px 32px ${palette.shadow}`,
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
        {/* Big recommendation block */}
        <div
          style={{
            background: palette.bg,
            border: `2px solid ${palette.border}`,
            borderRadius: 14,
            padding: "20px 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexShrink: 0,
            minWidth: 140,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, color: palette.color, letterSpacing: "0.12em", marginBottom: 6 }}>
            RECOMMENDATION
          </span>
          <span
            style={{
              fontSize: 40,
              fontWeight: 900,
              color: palette.color,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            {rec}
          </span>
          <span style={{ fontSize: 11, color: palette.color, opacity: 0.7, marginTop: 6, fontWeight: 500 }}>
            {palette.label}
          </span>
        </div>

        {/* Company + reasoning */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "var(--text-4)", fontWeight: 500 }}>Analysis for </span>
            <span style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>
              {companyName}
            </span>
          </div>
          {decision.reasoning && (
            <p
              style={{
                fontSize: 13,
                color: "var(--text-3)",
                lineHeight: 1.65,
                maxWidth: 520,
              }}
            >
              {decision.reasoning.length > 240
                ? decision.reasoning.slice(0, 240) + "..."
                : decision.reasoning}
            </p>
          )}

          {/* Confidence bar */}
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
              <span style={{ color: "var(--text-4)", fontWeight: 500 }}>AI Confidence</span>
              <span style={{ color: palette.color, fontWeight: 700 }}>{decision.confidence}%</span>
            </div>
            <div style={{ height: 7, background: "var(--surface-2)", borderRadius: 100, border: "1px solid var(--border)", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${decision.confidence}%`,
                  borderRadius: 100,
                  background: `linear-gradient(90deg, ${palette.color}88, ${palette.color})`,
                  transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Score pills */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginTop: 24,
          paddingTop: 20,
          borderTop: "1px solid var(--border)",
        }}
      >
        {scores.map(({ label, value, suffix, color, icon }) => (
          <div
            key={label}
            style={{
              flex: "1 1 120px",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: "12px 14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6, color: "var(--text-4)", fontSize: 11 }}>
              <span style={{ color }}>{icon}</span>
              {label}
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color, letterSpacing: "-0.02em", lineHeight: 1 }}>
              {value}
              {suffix && (
                <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-4)", marginLeft: 2 }}>
                  {suffix}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
