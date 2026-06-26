"use client";

import { GraphState } from "@/types/graph";
import { AgentKey } from "@/components/Sidebar";
import {
  Search, DollarSign, Newspaper, MessageCircle,
  ShieldAlert, Gavel, FileText, ChevronLeft,
  Database, Cpu, ArrowRight, CheckCircle2
} from "lucide-react";

interface AgentDetailViewProps {
  state: GraphState;
  selectedAgent: AgentKey;
  onBack: () => void;
}

const AGENT_META: Record<AgentKey, {
  label: string;
  role: string;
  color: string;
  icon: any;
  description: string;
  workflow: string;
  apis: { name: string; endpoint: string; purpose: string }[];
  outputKey: keyof GraphState;
  stateFields: string[];
}> = {
  research: {
    label: "Research Agent",
    role: "Foundation Builder",
    color: "#4F46E5",
    icon: Search,
    description: "The first agent to execute in the pipeline. It maps the company's entire public footprint — business model, products, competitors, strengths, and weaknesses — by combining real-time web search with structured company profile data.",
    workflow: "1. Calls Tavily Search API with `search_depth: advanced` returning 5 optimized results.\n2. Calls Finnhub Company Profile API to get name, industry, market cap, exchange.\n3. Concatenates both into a grounded context string (~1,200 tokens).\n4. Sends context to Gemini 2.5 Flash with a CFA analyst persona and strict JSON schema enforcement.\n5. Returns structured CompanyResearch object to LangGraph state.",
    apis: [
      { name: "Tavily Search", endpoint: "https://api.tavily.com/search", purpose: "LLM-optimized web search. Returns clean, structured text (not HTML) about the company — ideal for LLM grounding." },
      { name: "Finnhub Profile", endpoint: "https://finnhub.io/api/v1/stock/profile2", purpose: "Returns company name, ticker, exchange, market cap, industry, and logo URL." },
    ],
    outputKey: "research",
    stateFields: ["overview", "businessModel", "products", "competitors", "industry", "strengths", "weaknesses"],
  },
  financial: {
    label: "Financial Agent",
    role: "Quantitative Analyst",
    color: "#0891B2",
    icon: DollarSign,
    description: "Ingests 3 years of historical financial statements and trailing-twelve-months key metrics to produce a comprehensive financial health score (0-100) with structured reasoning. Uses FMP's institutional-grade API.",
    workflow: "1. Calls FMP Income Statement API for 3 years of revenue, profit, debt, cash flow.\n2. Calls FMP Key Metrics TTM for PE Ratio, ROE.\n3. Formats data into a structured financial context string (~1,000 tokens).\n4. Sends to Gemini with a CFA persona that scores financials and provides reasoning.\n5. Returns FinancialAnalysis object including score and written reasoning.",
    apis: [
      { name: "FMP Income Statement", endpoint: "financialmodelingprep.com/api/v3/income-statement/{symbol}", purpose: "3 years of revenue, net income, total debt, operating cash flow." },
      { name: "FMP Key Metrics TTM", endpoint: "financialmodelingprep.com/api/v3/key-metrics-ttm/{symbol}", purpose: "Trailing twelve months PE Ratio and Return on Equity." },
    ],
    outputKey: "financial",
    stateFields: ["revenue", "profit", "peRatio", "roe", "debt", "eps", "cashFlow", "growth", "score", "reasoning"],
  },
  news: {
    label: "News Agent",
    role: "Information Scraper",
    color: "#7C3AED",
    icon: Newspaper,
    description: "Fetches the latest global news articles for the company from the past 7 days, then classifies each article as positive, negative, or neutral using Gemini's language understanding capabilities.",
    workflow: "1. Calls NewsData.io API with compound query `{companyName} OR {ticker}`.\n2. Limits results to 5 English-language articles.\n3. Formats each article (source, title, summary, URL) into a context block.\n4. Sends to Gemini with a news intelligence analyst persona.\n5. Returns structured NewsAnalysis with classification and editorial summary.",
    apis: [
      { name: "NewsData.io", endpoint: "https://newsdata.io/api/1/news", purpose: "Real-time news from 30,000+ global sources. Filtered by language and company name/ticker." },
    ],
    outputKey: "news",
    stateFields: ["latestNews", "positiveNews", "negativeNews", "summary", "sources"],
  },
  sentiment: {
    label: "Sentiment Agent",
    role: "NLP Classifier",
    color: "#D97706",
    icon: MessageCircle,
    description: "A pure reasoning agent — it makes zero external API calls. Instead, it reads the classified news output from the News Agent and performs deep semantic analysis to produce a sentiment score and distribution.",
    workflow: "1. Reads `news.summary`, `news.positiveNews`, `news.negativeNews` from LangGraph state.\n2. Constructs a compact context (~600 tokens) with all sentiment signals.\n3. Sends to Gemini with a market sentiment analyst persona.\n4. Prompt explicitly enforces: positivePercent + negativePercent + neutralPercent = 100.\n5. Returns SentimentAnalysis with score (0-100), percentages, and Bullish/Bearish/Neutral label.",
    apis: [],
    outputKey: "sentiment",
    stateFields: ["sentimentScore", "positivePercent", "negativePercent", "neutralPercent", "label"],
  },
  risk: {
    label: "Risk Agent",
    role: "Risk Officer",
    color: "#DC2626",
    icon: ShieldAlert,
    description: "The synchronization point of the pipeline — it waits for all three parallel agents (Financial, News, Sentiment) to complete before executing. Synthesizes their outputs to produce a five-channel risk matrix and overall risk score.",
    workflow: "1. Acts as the JOIN node in the LangGraph DAG — waits for Financial, News, and Sentiment agents.\n2. Reads weaknesses from Research, score and reasoning from Financial, score from Sentiment, and negativeNews from News.\n3. Sends aggregated risk signals (~800 tokens) to Gemini with a Risk Manager persona.\n4. Gemini scores 5 risk channels: Business, Financial, Market, Legal, Competitive.\n5. Returns RiskAnalysis with riskScore (0-100) and riskLevel (Low/Medium/High).",
    apis: [],
    outputKey: "risk",
    stateFields: ["businessRisk", "financialRisk", "marketRisk", "legalRisk", "competitiveRisk", "riskScore", "riskLevel"],
  },
  decision: {
    label: "Decision Agent",
    role: "Portfolio Manager",
    color: "#059669",
    icon: Gavel,
    description: "The most critical agent in the pipeline — the only one authorized to issue a final investment recommendation. Reconciles bull vs. bear cases across all prior agent outputs and produces a transparent, evidence-backed BUY, HOLD, or PASS signal.",
    workflow: "1. Reads the complete output of all 5 prior agents from LangGraph state.\n2. Constructs a rich decision context (~1,000 tokens) with all scores, summaries, and risk factors.\n3. Sends to Gemini with an Investment Director persona.\n4. Prompt explicitly requires: reconciliation of both bullish and bearish perspectives before deciding.\n5. Returns DecisionData with recommendation, overallScore (0-100), confidence (0-100), reasoning, pros[], and cons[].",
    apis: [],
    outputKey: "decision",
    stateFields: ["recommendation", "overallScore", "confidence", "reasoning", "pros", "cons"],
  },
  report: {
    label: "Report Agent",
    role: "Visual Formatter",
    color: "#6B7280",
    icon: FileText,
    description: "The final agent — responsible for compiling all disparate agent outputs into a single, UI-ready JSON report payload. It generates Recharts-compatible data structures for every visualization in the dashboard.",
    workflow: "1. Reads the full GraphState (all 6 prior agent outputs).\n2. Constructs a comprehensive context string (~2,000 tokens) with all serialized data.\n3. Sends to Gemini with a financial reporter persona.\n4. Generates nested chart data: radar[], financials[], sentiment[], and gauge (0-100).\n5. Returns ReportData which is streamed directly to the frontend as the final SSE `report` event.",
    apis: [],
    outputKey: "report",
    stateFields: ["summary", "highlights", "metrics", "charts", "sources"],
  },
};

function renderValue(val: any, depth = 0): React.ReactNode {
  if (val === null || val === undefined) return <span style={{ color: "var(--text-4)" }}>—</span>;
  if (typeof val === "string") return <span style={{ color: "var(--text-2)" }}>{val}</span>;
  if (typeof val === "number") return <span style={{ color: "#4F46E5", fontWeight: 700 }}>{val}</span>;
  if (Array.isArray(val)) {
    if (val.length === 0) return <span style={{ color: "var(--text-4)" }}>[ ]</span>;
    if (typeof val[0] === "string") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {val.map((v, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{ color: "var(--accent)", fontSize: 12, marginTop: 1 }}>•</span>
              <span style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.5 }}>{v}</span>
            </div>
          ))}
        </div>
      );
    }
    if (typeof val[0] === "object") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {val.slice(0, 5).map((item: any, i: number) => (
            <div key={i} style={{ padding: "8px 10px", background: "var(--surface-2)", borderRadius: 6, border: "1px solid var(--border)", fontSize: 12, color: "var(--text-3)" }}>
              {Object.entries(item).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(" · ")}
            </div>
          ))}
        </div>
      );
    }
  }
  if (typeof val === "object") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: depth > 0 ? 12 : 0 }}>
        {Object.entries(val).map(([k, v]) => (
          <div key={k}>
            <span style={{ fontSize: 11, color: "var(--text-4)", fontWeight: 600, textTransform: "uppercase" }}>{k}: </span>
            {renderValue(v, depth + 1)}
          </div>
        ))}
      </div>
    );
  }
  return String(val);
}

export default function AgentDetailView({ state, selectedAgent, onBack }: AgentDetailViewProps) {
  const meta = AGENT_META[selectedAgent];
  const Icon = meta.icon;
  const outputData = state[meta.outputKey] as any;

  return (
    <div style={{ padding: 32, maxWidth: 1100, margin: "0 auto" }} className="fade-in">
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "transparent", border: "1px solid var(--border)",
          borderRadius: 8, padding: "6px 14px", fontSize: 13,
          color: "var(--text-3)", cursor: "pointer", marginBottom: 24,
          fontFamily: "inherit", transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "var(--surface-2)";
          (e.currentTarget as HTMLElement).style.color = "var(--text)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color = "var(--text-3)";
        }}
      >
        <ChevronLeft size={14} />
        Back to Dashboard
      </button>

      {/* Agent Header */}
      <div className="card" style={{ padding: 28, marginBottom: 20, borderLeft: `4px solid ${meta.color}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: `${meta.color}18`, border: `1px solid ${meta.color}33`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Icon size={24} color={meta.color} />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.03em" }}>{meta.label}</h1>
            <span style={{
              display: "inline-block", fontSize: 11, fontWeight: 700,
              padding: "2px 10px", borderRadius: 100,
              background: `${meta.color}18`, color: meta.color, letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}>
              {meta.role}
            </span>
          </div>
        </div>
        <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7 }}>{meta.description}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* How It Works */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Cpu size={16} color={meta.color} />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Execution Workflow</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {meta.workflow.split("\n").map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  background: `${meta.color}18`, border: `1px solid ${meta.color}33`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: meta.color }}>{i + 1}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6, marginTop: 2 }}>
                  {step.replace(/^\d+\.\s*/, "")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* APIs Used */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Database size={16} color={meta.color} />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Data Sources & APIs</h3>
          </div>
          {meta.apis.length === 0 ? (
            <div style={{ padding: "20px 16px", background: "var(--surface-2)", borderRadius: 10, border: "1px solid var(--border)", textAlign: "center" }}>
              <ArrowRight size={20} color="var(--text-4)" style={{ margin: "0 auto 8px" }} />
              <p style={{ fontSize: 13, color: "var(--text-3)", fontWeight: 600, marginBottom: 4 }}>No External APIs</p>
              <p style={{ fontSize: 12, color: "var(--text-4)", lineHeight: 1.5 }}>
                This agent is a pure reasoning agent. It reads prior agent outputs from the LangGraph state and performs LLM inference only.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {meta.apis.map((api, i) => (
                <div key={i} style={{ padding: "14px 16px", background: "var(--surface-2)", borderRadius: 10, border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <CheckCircle2 size={13} color={meta.color} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{api.name}</span>
                  </div>
                  <code style={{ fontSize: 11, color: "var(--text-4)", background: "var(--surface)", padding: "2px 8px", borderRadius: 4, display: "block", marginBottom: 6, wordBreak: "break-all" }}>
                    {api.endpoint}
                  </code>
                  <p style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.5 }}>{api.purpose}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reasoning (where applicable) */}
      {selectedAgent === "financial" && (outputData as any)?.reasoning && (
        <div className="card" style={{ padding: 24, marginBottom: 20, borderLeft: `3px solid ${meta.color}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>LLM Reasoning</h3>
          <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7 }}>{(outputData as any).reasoning}</p>
        </div>
      )}
      {selectedAgent === "decision" && (outputData as any)?.reasoning && (
        <div className="card" style={{ padding: 24, marginBottom: 20, borderLeft: `3px solid ${meta.color}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>Investment Decision Reasoning</h3>
          <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7 }}>{(outputData as any).reasoning}</p>
        </div>
      )}

      {/* Raw Output */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <FileText size={16} color={meta.color} />
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Agent Output — Raw State Data</h3>
        </div>
        {outputData ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {meta.stateFields.map((field, i) => {
              const val = (outputData as any)[field];
              if (val === undefined) return null;
              return (
                <div
                  key={field}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "180px 1fr",
                    gap: 16,
                    padding: "14px 0",
                    borderBottom: i < meta.stateFields.length - 1 ? "1px solid var(--border)" : "none",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.05em", paddingTop: 2 }}>
                    {field}
                  </div>
                  <div style={{ fontSize: 13 }}>
                    {renderValue(val)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ fontSize: 13, color: "var(--text-4)", textAlign: "center", padding: 20 }}>
            No output data available for this agent.
          </p>
        )}
      </div>
    </div>
  );
}
