"use client";

import { DollarSign, TrendingUp, Shield, BarChart3 } from "lucide-react";

interface ScoreCardsProps {
  financialScore: number;
  sentimentScore: number;
  riskScore: number;
  growth: number;
  riskLevel: string;
}

export default function ScoreCards({ financialScore, sentimentScore, riskScore, growth, riskLevel }: ScoreCardsProps) {
  const riskColor =
    riskLevel === "Low" ? "var(--buy)" : riskLevel === "High" ? "var(--pass)" : "var(--hold)";
  const riskBg =
    riskLevel === "Low" ? "var(--buy-bg)" : riskLevel === "High" ? "var(--pass-bg)" : "var(--hold-bg)";
  const riskBorder =
    riskLevel === "Low" ? "var(--buy-border)" : riskLevel === "High" ? "var(--pass-border)" : "var(--hold-border)";

  const cards = [
    {
      label: "Financial Health",
      value: financialScore,
      suffix: "/100",
      desc: "Balance sheet & profitability",
      icon: DollarSign,
      iconColor: "#0891B2",
      iconBg: "#ECFEFF",
      barColor: "#0891B2",
      borderColor: "#BAE6FD",
    },
    {
      label: "Market Sentiment",
      value: sentimentScore,
      suffix: "/100",
      desc: "Public & analyst sentiment",
      icon: TrendingUp,
      iconColor: "var(--accent)",
      iconBg: "var(--accent-light)",
      barColor: "var(--accent)",
      borderColor: "#C7D2FE",
    },
    {
      label: "Risk Exposure",
      value: riskScore,
      suffix: "/100",
      desc: `${riskLevel} risk · lower is better`,
      icon: Shield,
      iconColor: riskColor,
      iconBg: riskBg,
      barColor: riskColor,
      borderColor: riskBorder,
    },
    {
      label: "Revenue Growth",
      value: Math.abs(parseFloat(growth.toFixed(1))),
      suffix: "%",
      desc: "Year-over-year growth",
      icon: BarChart3,
      iconColor: "#7C3AED",
      iconBg: "#F5F3FF",
      barColor: "#7C3AED",
      borderColor: "#DDD6FE",
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 }}>
      {cards.map(({ label, value, suffix, desc, icon: Icon, iconColor, iconBg, barColor, borderColor }) => (
        <div
          key={label}
          className="card card-hover fade-in"
          style={{ padding: "20px 22px", border: `1px solid ${borderColor}` }}
        >
          {/* Icon + Label */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: iconBg,
                border: `1px solid ${borderColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon size={16} color={iconColor} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)" }}>{label}</span>
          </div>

          {/* Score */}
          <div style={{ fontSize: 32, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 4 }}>
            {value}
            <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-4)", marginLeft: 2 }}>{suffix}</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-4)", marginBottom: 14 }}>{desc}</div>

          {/* Progress bar */}
          <div style={{ height: 5, background: "var(--surface-2)", borderRadius: 100, overflow: "hidden", border: "1px solid var(--border)" }}>
            <div
              style={{
                height: "100%",
                width: `${Math.min(100, Math.abs(value))}%`,
                borderRadius: 100,
                background: barColor,
                transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
