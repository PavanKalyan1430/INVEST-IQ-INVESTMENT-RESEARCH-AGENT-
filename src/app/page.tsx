"use client";

import { useState, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MissionControl from "@/components/MissionControl";
import Dashboard from "@/components/Dashboard";
import { GraphState, ReportData } from "@/types/graph";

type AppPhase = "idle" | "analyzing" | "done" | "error";

interface AgentStatusUpdate {
  agent: string;
  status: "waiting" | "running" | "completed";
}

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>("idle");
  const [companyName, setCompanyName] = useState("");
  const [statusUpdates, setStatusUpdates] = useState<AgentStatusUpdate[]>([]);
  const [thought, setThought] = useState("");
  const [discovery, setDiscovery] = useState("");
  const [graphState, setGraphState] = useState<GraphState | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const handleAnalyze = async (company: string) => {
    setCompanyName(company);
    setPhase("analyzing");
    setStatusUpdates([]);
    setThought("Initializing research pipeline...");
    setDiscovery("Searching for company data...");
    setGraphState(null);
    setReport(null);
    setErrorMsg("");

    abortRef.current = new AbortController();
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: company }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const json = await response.json().catch(() => ({}));
        throw new Error(json.message || `Server error: ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        const parts = buf.split("\n\n");
        buf = parts.pop() ?? "";

        for (const block of parts) {
          let eventName = "";
          let dataStr = "";

          for (const line of block.split("\n")) {
            if (line.startsWith("event: ")) eventName = line.slice(7).trim();
            else if (line.startsWith("data: ")) dataStr = line.slice(6).trim();
          }

          if (!dataStr) continue;
          let payload: any;
          try {
            payload = JSON.parse(dataStr);
          } catch {
            continue;
          }

          if (eventName === "status") {
            setStatusUpdates((prev) => {
              const exists = prev.findIndex((u) => u.agent === payload.agent);
              if (exists !== -1) {
                const copy = [...prev];
                copy[exists] = payload;
                return copy;
              }
              return [...prev, payload];
            });
          } else if (eventName === "thought") {
            setThought(typeof payload === "string" ? payload : JSON.stringify(payload));
          } else if (eventName === "discovery") {
            setDiscovery(typeof payload === "string" ? payload : JSON.stringify(payload));
          } else if (eventName === "state") {
            setGraphState(payload as GraphState);
          } else if (eventName === "report") {
            setReport(payload as ReportData);
            setPhase("done");
          } else if (eventName === "error") {
            throw new Error(typeof payload === "string" ? payload : "Workflow error");
          }
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setErrorMsg(err.message || "An unexpected error occurred.");
      setPhase("error");
    }
  };

  const handleReset = () => {
    abortRef.current?.abort();
    setPhase("idle");
    setCompanyName("");
    setStatusUpdates([]);
    setGraphState(null);
    setReport(null);
    setErrorMsg("");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Navbar 
          phase={phase} 
          companyName={companyName} 
          onNewSearch={handleReset}
          onAnalyze={handleAnalyze} 
        />

        <main style={{ flex: 1 }}>
          {phase === "idle" && (
            <Hero onAnalyze={handleAnalyze} loading={false} />
          )}

          {phase === "analyzing" && (
            <MissionControl
              statusUpdates={statusUpdates}
              thought={thought}
              discovery={discovery}
            />
          )}

          {phase === "done" && report && (
            <Dashboard
              state={graphState || { companyName }}
              report={report}
              companyName={companyName}
              onReset={handleReset}
            />
          )}

          {phase === "error" && (
            <div
              style={{
                minHeight: "calc(100vh - 64px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
              }}
            >
              <div
                className="card fade-in"
                style={{
                  maxWidth: 480,
                  width: "100%",
                  padding: 32,
                  textAlign: "center",
                  border: "1px solid var(--pass-border)",
                  background: "var(--surface)",
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "var(--pass)" }}>Analysis Failed</h3>
                <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 24, lineHeight: 1.6 }}>
                  {errorMsg || "Could not complete the analysis. Please check the company name and try again."}
                </p>
                <button
                  onClick={handleReset}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
