"use client";

import { TrendingUp, Newspaper, Users, AlertTriangle, CheckCircle, XCircle, Globe } from "lucide-react";
import { GraphState } from "@/types/graph";

interface MarketTrendsViewProps {
  state: GraphState;
  companyName: string;
}

export default function MarketTrendsView({ state, companyName }: MarketTrendsViewProps) {
  const { research, news, sentiment, risk, decision } = state;

  const sentLabel = sentiment?.label ?? "Neutral";
  const sentColor =
    sentLabel === "Bullish" ? "var(--buy)" : sentLabel === "Bearish" ? "var(--pass)" : "var(--hold)";

  const riskLevel = risk?.riskLevel ?? "Medium";
  const riskColor =
    riskLevel === "Low" ? "var(--buy)" : riskLevel === "High" ? "var(--pass)" : "var(--hold)";

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }} className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <TrendingUp size={20} color="var(--accent)" />
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.03em" }}>
            Market Trends
          </h1>
        </div>
        <p style={{ fontSize: 14, color: "var(--text-3)" }}>
          Market context, news flow, and competitive positioning for <strong>{companyName}</strong>
        </p>
      </div>

      {/* Summary Banners */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: 20, borderLeft: `3px solid ${sentColor}` }}>
          <div style={{ fontSize: 11, color: "var(--text-4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Market Sentiment</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: sentColor }}>{sentLabel}</div>
          <div style={{ fontSize: 12, color: "var(--text-4)", marginTop: 4 }}>
            {sentiment?.positivePercent ?? 0}% positive · {sentiment?.negativePercent ?? 0}% negative
          </div>
        </div>
        <div className="card" style={{ padding: 20, borderLeft: `3px solid ${riskColor}` }}>
          <div style={{ fontSize: 11, color: "var(--text-4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Risk Exposure</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: riskColor }}>{riskLevel}</div>
          <div style={{ fontSize: 12, color: "var(--text-4)", marginTop: 4 }}>
            Risk Score: {risk?.riskScore ?? 0}/100
          </div>
        </div>
        <div className="card" style={{ padding: 20, borderLeft: "3px solid var(--accent)" }}>
          <div style={{ fontSize: 11, color: "var(--text-4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Investment Signal</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: decision?.recommendation === "INVEST" ? "var(--buy)" : "var(--pass)" }}>
            {decision?.recommendation ?? "—"}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-4)", marginTop: 4 }}>
            {decision?.confidence ?? 0}% confidence
          </div>
        </div>
      </div>

      {/* Industry & Positioning */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Globe size={16} color="var(--accent)" />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Industry & Positioning</h3>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "var(--text-4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Industry</div>
            <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 600 }}>{research?.industry ?? "Technology"}</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "var(--text-4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Business Model</div>
            <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>{research?.businessModel ?? "—"}</p>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Key Products</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(research?.products ?? []).map((p, i) => (
                <span key={i} className="tag">{p}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Competitor Landscape */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Users size={16} color="var(--accent)" />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Competitor Landscape</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {(research?.competitors ?? []).map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  background: "var(--surface-2)",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: `hsl(${i * 57 + 200}, 60%, 55%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "white" }}>{c[0]?.toUpperCase()}</span>
                </div>
                <span style={{ fontSize: 13, color: "var(--text-2)", fontWeight: 500 }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* News Timeline + Risk Factors */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* News Timeline */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Newspaper size={16} color="var(--accent)" />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Latest News</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(news?.latestNews ?? []).slice(0, 5).map((article, i) => (
              <a
                key={i}
                href={article.url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--surface-2)",
                    cursor: "pointer",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", lineHeight: 1.4, marginBottom: 6 }}>
                    {article.title}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600 }}>{article.source}</span>
                    <span style={{ fontSize: 11, color: "var(--text-4)" }}>{article.summary?.slice(0, 80)}...</span>
                  </div>
                </div>
              </a>
            ))}
            {(!news?.latestNews || news.latestNews.length === 0) && (
              <p style={{ fontSize: 13, color: "var(--text-4)", textAlign: "center", padding: 20 }}>No news data available</p>
            )}
          </div>
        </div>

        {/* Risk Factors */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <AlertTriangle size={16} color="var(--hold)" />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Risk Factor Matrix</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Business Risk", value: risk?.businessRisk },
              { label: "Financial Risk", value: risk?.financialRisk },
              { label: "Market Risk", value: risk?.marketRisk },
              { label: "Legal & Regulatory Risk", value: risk?.legalRisk },
              { label: "Competitive Risk", value: risk?.competitiveRisk },
            ].map((r, i) => (
              <div key={i} style={{ padding: "10px 14px", background: "var(--surface-2)", borderRadius: 8, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--hold)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{r.label}</div>
                <p style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.5 }}>{r.value ?? "—"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bull / Bear Cases */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="card" style={{ padding: 24, borderTop: "3px solid var(--buy)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <CheckCircle size={16} color="var(--buy)" />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--buy)" }}>Bull Case — Strengths</h3>
          </div>
          <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(research?.strengths ?? []).concat(decision?.pros ?? []).map((s, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--text-2)", lineHeight: 1.5 }}>
                <span style={{ color: "var(--buy)", marginTop: 2, flexShrink: 0 }}>✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="card" style={{ padding: 24, borderTop: "3px solid var(--pass)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <XCircle size={16} color="var(--pass)" />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--pass)" }}>Bear Case — Weaknesses</h3>
          </div>
          <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(research?.weaknesses ?? []).concat(decision?.cons ?? []).map((w, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--text-2)", lineHeight: 1.5 }}>
                <span style={{ color: "var(--pass)", marginTop: 2, flexShrink: 0 }}>✗</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
