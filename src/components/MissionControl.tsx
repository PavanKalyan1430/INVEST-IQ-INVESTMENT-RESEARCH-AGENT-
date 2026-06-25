"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Clock, Activity } from "lucide-react";

type AgentStatus = "waiting" | "running" | "completed";

interface AgentState {
  id: string;
  label: string;
  desc: string;
  status: AgentStatus;
  log?: string;
}

interface MissionControlProps {
  statusUpdates: { agent: string; status: AgentStatus }[];
  thought: string;
  discovery: string;
}

const INITIAL_AGENTS: AgentState[] = [
  { id: "research", label: "Research Agent", desc: "Company profile & web intelligence", status: "waiting" },
  { id: "financial", label: "Financial Agent", desc: "Balance sheet, revenue & cash flow", status: "waiting" },
  { id: "news", label: "News Agent", desc: "Latest news & press releases", status: "waiting" },
  { id: "sentiment", label: "Sentiment Agent", desc: "Market & investor sentiment", status: "waiting" },
  { id: "risk", label: "Risk Agent", desc: "Risk scoring & exposure analysis", status: "waiting" },
  { id: "decision", label: "Decision Agent", desc: "Bull vs Bear synthesis", status: "waiting" },
  { id: "report", label: "Report Agent", desc: "Final report compilation", status: "waiting" },
];

const AGENT_LOGS: Record<string, string> = {
  research: "Company profile retrieved · Industry mapped · Competitors identified",
  financial: "Revenue analyzed · Balance sheet scored · Cash flow calculated",
  news: "Articles collected · Earnings news retrieved · Regulatory updates scanned",
  sentiment: "Positive signals scored · Negative flags detected · Mood assessed",
  risk: "Business risk evaluated · Legal exposure assessed · Competitive risk mapped",
  decision: "Bull case constructed · Bear case weighted · Final verdict synthesized",
  report: "Charts formatted · Executive summary written · Sources compiled",
};

export default function MissionControl({ statusUpdates, thought, discovery }: MissionControlProps) {
  const [agents, setAgents] = useState<AgentState[]>(INITIAL_AGENTS);
  const [logs, setLogs] = useState<string[]>(["Initializing AI research pipeline..."]);

  useEffect(() => {
    setAgents((prev) =>
      prev.map((agent) => {
        const update = statusUpdates.find((u) => u.agent === agent.id);
        if (!update) return agent;
        return {
          ...agent,
          status: update.status,
          log: update.status === "completed" ? AGENT_LOGS[agent.id] : undefined,
        };
      })
    );
  }, [statusUpdates]);

  useEffect(() => {
    if (discovery && discovery !== "Gathering data...") {
      setLogs((prev) => {
        const ts = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
        return [`[${ts}] ${discovery}`, ...prev].slice(0, 20);
      });
    }
  }, [discovery]);

  const completed = agents.filter((a) => a.status === "completed").length;
  const progress = Math.round((completed / agents.length) * 100);

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "32px 24px 60px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Header */}
      <div className="fade-in" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <Activity size={20} color="var(--accent)" />
            <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text)" }}>
              AI Mission Control
            </h2>
            <span className="status-running" style={{ fontSize: 11 }}>
              <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
              Live
            </span>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-3)" }}>
            7 specialized AI agents are collaborating on your analysis
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: "var(--accent)", letterSpacing: "-0.04em" }}>
            {progress}%
          </div>
          <div style={{ fontSize: 12, color: "var(--text-4)" }}>Complete</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="card" style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13 }}>
          <span style={{ color: "var(--text-3)", fontWeight: 500 }}>Overall Progress</span>
          <span style={{ color: "var(--text-2)", fontWeight: 600 }}>{completed} / {agents.length} agents</span>
        </div>
        <div style={{ height: 8, background: "var(--surface-2)", borderRadius: 100, overflow: "hidden", border: "1px solid var(--border)" }}>
          <div
            className="shimmer"
            style={{
              height: "100%",
              width: `${Math.max(4, progress)}%`,
              borderRadius: 100,
              transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </div>
      </div>

      {/* Agent grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 12,
        }}
      >
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="card"
            style={{
              padding: "16px 18px",
              border: agent.status === "running"
                ? "1.5px solid #A5B4FC"
                : agent.status === "completed"
                ? "1px solid var(--buy-border)"
                : "1px solid var(--border)",
              background: agent.status === "running"
                ? "var(--accent-light)"
                : agent.status === "completed"
                ? "var(--buy-bg)"
                : "var(--surface)",
              transition: "all 0.3s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 3 }}>
                  {agent.label}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-4)" }}>{agent.desc}</div>
              </div>
              <div style={{ flexShrink: 0, marginTop: 1 }}>
                {agent.status === "completed" && <CheckCircle2 size={18} color="var(--buy)" />}
                {agent.status === "running" && <Loader2 size={18} color="var(--accent)" className="spin" />}
                {agent.status === "waiting" && <Clock size={18} color="var(--text-4)" />}
              </div>
            </div>

            {agent.status !== "waiting" && (
              <div style={{ marginTop: 10 }}>
                {agent.status === "running" ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ flex: 1, height: 3, background: "rgba(79,70,229,0.15)", borderRadius: 100, overflow: "hidden" }}>
                      <div className="shimmer" style={{ height: "100%", borderRadius: 100 }} />
                    </div>
                    <span className="status-running" style={{ fontSize: 10, padding: "1px 7px" }}>Running</span>
                  </div>
                ) : (
                  <span className="status-completed" style={{ fontSize: 10, padding: "1px 7px" }}>
                    <CheckCircle2 size={10} />
                    Done
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom row: live thought + activity log */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Current thought */}
        <div className="card" style={{ padding: 20 }}>
          <div className="section-label" style={{ marginBottom: 12 }}>Current AI Thought</div>
          <div
            style={{
              fontSize: 14,
              color: "var(--text-2)",
              fontStyle: "italic",
              lineHeight: 1.6,
              minHeight: 42,
            }}
          >
            "{thought || "Initializing research pipeline..."}"
          </div>
          {discovery && discovery !== "Gathering data..." && (
            <div
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTop: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--buy)", flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "var(--buy)", fontWeight: 600 }}>{discovery}</span>
            </div>
          )}
        </div>

        {/* Activity log */}
        <div className="card" style={{ padding: 20 }}>
          <div className="section-label" style={{ marginBottom: 12 }}>Activity Log</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: 160, overflowY: "auto" }}>
            {logs.map((log, i) => (
              <div
                key={i}
                className={i === 0 ? "slide-in" : ""}
                style={{
                  fontSize: 11,
                  color: i === 0 ? "var(--text-2)" : "var(--text-4)",
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                  lineHeight: 1.4,
                  transition: "color 0.3s",
                }}
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
