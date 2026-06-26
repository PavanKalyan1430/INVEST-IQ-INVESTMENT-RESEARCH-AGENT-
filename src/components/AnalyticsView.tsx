"use client";

import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import { TrendingUp, TrendingDown, Minus, BarChart3, Shield, Brain, Activity } from "lucide-react";
import { GraphState } from "@/types/graph";

interface AnalyticsViewProps {
  state: GraphState;
  companyName: string;
}

const COLORS = ["#059669", "#DC2626", "#D97706"];

function MetricCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div
      className="card"
      style={{ padding: "20px 24px", flex: 1, minWidth: 160 }}
    >
      <div style={{ fontSize: 12, color: "var(--text-4)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: color || "var(--text)", letterSpacing: "-0.03em" }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: "var(--text-4)", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export default function AnalyticsView({ state, companyName }: AnalyticsViewProps) {
  const { financial, sentiment, risk, decision, report } = state;

  // Build financial bar chart data
  const finData = report?.charts?.financials ?? [
    { year: "2023", revenue: 0, profit: 0, debt: 0, cashFlow: 0 },
    { year: "2024", revenue: 0, profit: 0, debt: 0, cashFlow: 0 },
    { year: "2025", revenue: 0, profit: 0, debt: 0, cashFlow: 0 },
  ];

  // Radar data
  const radarData = report?.charts?.radar ?? [];

  // Sentiment pie data
  const sentData = report?.charts?.sentiment ?? [
    { name: "Positive", value: sentiment?.positivePercent ?? 50, color: "#059669" },
    { name: "Negative", value: sentiment?.negativePercent ?? 30, color: "#DC2626" },
    { name: "Neutral", value: sentiment?.neutralPercent ?? 20, color: "#D97706" },
  ];

  const finScore = financial?.score ?? 0;
  const sentScore = sentiment?.sentimentScore ?? 0;
  const riskScore = risk?.riskScore ?? 0;
  const rec = decision?.recommendation ?? "—";
  const recColor = rec === "INVEST" ? "var(--buy)" : rec === "PASS" ? "var(--pass)" : "var(--text)";

  const growth = financial?.growth ?? 0;
  const GrowthIcon = growth > 0 ? TrendingUp : growth < 0 ? TrendingDown : Minus;
  const growthColor = growth > 0 ? "var(--buy)" : growth < 0 ? "var(--pass)" : "var(--text-4)";

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }} className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Activity size={20} color="var(--accent)" />
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.03em" }}>
            Analytics
          </h1>
        </div>
        <p style={{ fontSize: 14, color: "var(--text-3)" }}>
          Deep-dive financial and sentiment analytics for <strong>{companyName}</strong>
        </p>
      </div>

      {/* Score Cards Row */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <MetricCard label="Recommendation" value={rec} color={recColor} sub={`${decision?.confidence ?? 0}% confidence`} />
        <MetricCard label="Financial Health" value={`${finScore}/100`} color={finScore > 70 ? "var(--buy)" : finScore > 40 ? "var(--hold)" : "var(--pass)"} sub="AI-scored fundamentals" />
        <MetricCard label="Sentiment Score" value={`${sentScore}/100`} color={sentScore > 65 ? "var(--buy)" : sentScore > 40 ? "var(--hold)" : "var(--pass)"} sub={`Label: ${sentiment?.label ?? "—"}`} />
        <MetricCard label="Risk Score" value={`${riskScore}/100`} color={riskScore < 35 ? "var(--buy)" : riskScore < 65 ? "var(--hold)" : "var(--pass)"} sub={`Level: ${risk?.riskLevel ?? "—"}`} />
        <MetricCard
          label="Revenue Growth"
          value={`${growth > 0 ? "+" : ""}${growth.toFixed(1)}%`}
          color={growthColor}
          sub="YoY Growth Rate"
        />
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Financial Bar Chart */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <BarChart3 size={16} color="var(--accent)" />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Revenue & Profit Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={finData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: "var(--text-4)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-4)" }} tickFormatter={(v) => `$${v}B`} />
              <Tooltip
                contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                formatter={(v: any) => [`$${Number(v).toFixed(1)}B`, ""]}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="revenue" name="Revenue" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" name="Profit" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="debt" name="Debt" fill="#DC2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment Pie */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <Brain size={16} color="var(--accent)" />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Sentiment Distribution</h3>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <ResponsiveContainer width="60%" height={180}>
              <PieChart>
                <Pie data={sentData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {sentData.map((entry: any, i: number) => (
                    <Cell key={i} fill={entry.color ?? COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              {sentData.map((s: any, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color ?? COLORS[i % COLORS.length], flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "var(--text-3)", flex: 1 }}>{s.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Radar */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <Shield size={16} color="var(--accent)" />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Multi-Dimension Score Radar</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "var(--text-3)" }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: "var(--text-4)" }} />
              <Radar name={companyName} dataKey="A" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Key Metrics Table */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <Activity size={16} color="var(--accent)" />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Key Financial Metrics</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { label: "P/E Ratio", value: financial?.peRatio?.toFixed(1) ?? "—" },
              { label: "Return on Equity (ROE)", value: financial?.roe ? `${financial.roe.toFixed(1)}%` : "—" },
              { label: "Earnings Per Share (EPS)", value: financial?.eps ? `$${financial.eps.toFixed(2)}` : "—" },
              { label: "Revenue Growth (YoY)", value: financial?.growth ? `${financial.growth.toFixed(1)}%` : "—" },
              { label: "Overall Investment Score", value: `${decision?.overallScore ?? 0}/100` },
              { label: "Decision Confidence", value: `${decision?.confidence ?? 0}%` },
              { label: "Risk Level", value: risk?.riskLevel ?? "—" },
              { label: "Sentiment Label", value: sentiment?.label ?? "—" },
            ].map((row, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: i < 7 ? "1px solid var(--border)" : "none",
                }}
              >
                <span style={{ fontSize: 13, color: "var(--text-3)" }}>{row.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Reasoning */}
      {financial?.reasoning && (
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>Financial Analyst Reasoning</h3>
          <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7 }}>{financial.reasoning}</p>
        </div>
      )}
    </div>
  );
}
