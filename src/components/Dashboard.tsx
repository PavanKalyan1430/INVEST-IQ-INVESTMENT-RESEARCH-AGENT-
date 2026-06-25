"use client";

import { GraphState, ReportData } from "@/types/graph";
import RecommendationCard from "./RecommendationCard";
import ScoreCards from "./ScoreCards";
import ResearchCard from "./ResearchCard";
import FinancialCard from "./FinancialCard";
import NewsCard from "./NewsCard";
import SentimentCard from "./SentimentCard";
import RiskCard from "./RiskCard";
import DecisionCard from "./DecisionCard";
import SourcesCard from "./SourcesCard";
import MarketAnalytics from "./MarketAnalytics";
import { Search, RefreshCw } from "lucide-react";

interface DashboardProps {
  state: GraphState;
  report: ReportData;
  companyName: string;
  onReset: () => void;
}

export default function Dashboard({ state, report, companyName, onReset }: DashboardProps) {
  const { financial, research, news, sentiment, risk, decision } = state;
  if (!decision || !report) return null;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 24px 80px" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>Analysis Report</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
            Powered by 7 specialized AI agents • {new Date().toLocaleString()}
          </p>
        </div>
        <button
          onClick={onReset}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "var(--bg-card)",
            border: "1px solid var(--bg-border)",
            borderRadius: 10,
            padding: "8px 16px",
            fontSize: 13,
            color: "var(--text-secondary)",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
        >
          <Search size={14} /> New Search
        </button>
      </div>

      {/* Executive Summary */}
      {report.summary && (
        <div className="glass-card fade-in" style={{ padding: 20, marginBottom: 16, border: "1px solid rgba(37,99,235,0.2)" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            📋 Executive Summary
          </div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>{report.summary}</p>
          {report.highlights?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              {report.highlights.map((h, i) => (
                <span key={i} style={{ background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.25)", borderRadius: 100, padding: "4px 12px", fontSize: 12, color: "#60A5FA" }}>
                  ✦ {h}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Section 1: Recommendation Banner */}
      <div style={{ marginBottom: 16 }}>
        <RecommendationCard
          companyName={companyName}
          decision={decision}
          financial={financial}
          sentiment={sentiment}
          risk={risk}
        />
      </div>

      {/* Section 2: Score Cards */}
      <div style={{ marginBottom: 16 }}>
        <ScoreCards
          financialScore={financial?.score || 0}
          sentimentScore={sentiment?.sentimentScore || 0}
          riskScore={risk?.riskScore || 0}
          growth={financial?.growth || 0}
          riskLevel={risk?.riskLevel || "Medium"}
        />
      </div>

      {/* Section 3: Research + Financial */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {research && <ResearchCard research={research} />}
        {financial && (
          <FinancialCard
            financial={financial}
            chartData={report.charts?.financials || []}
          />
        )}
      </div>

      {/* Section 4: News + Sentiment */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {news && <NewsCard news={news} />}
        {sentiment && <SentimentCard sentiment={sentiment} />}
      </div>

      {/* Section 5: Risk */}
      {risk && (
        <div style={{ marginBottom: 16 }}>
          <RiskCard risk={risk} />
        </div>
      )}

      {/* Section 6 & 7: Decision + Bull/Bear + Radar */}
      <div style={{ marginBottom: 16 }}>
        <DecisionCard
          decision={decision}
          research={research}
          radarData={report.charts?.radar || []}
        />
      </div>

      {/* Section 7: Market Analytics & Visualization */}
      <MarketAnalytics companyName={companyName} />

      {/* Section 8: Sources */}
      {report.sources && report.sources.length > 0 && (
        <SourcesCard sources={report.sources} />
      )}
    </div>
  );
}
