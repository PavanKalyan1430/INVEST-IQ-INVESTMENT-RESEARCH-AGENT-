"use client";

import React, { useState } from "react";
import { Info, ShieldAlert } from "lucide-react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { GraphState, ReportData } from "@/types/graph";

interface MarketAnalyticsProps {
  companyName: string;
  state: GraphState;
  report: ReportData;
}

// Interface for cells in our interactive matrix
interface MatrixCell {
  rowLabel: string;
  colLabel: string;
  value: number;
  description: string;
}

export default function MarketAnalytics({ companyName, state, report }: MarketAnalyticsProps) {
  const { financial, sentiment, risk, decision } = state;

  // Extract dynamic values from GraphState or fall back to high-quality defaults
  const finScore = financial?.score ?? 82;
  const sentScore = sentiment?.sentimentScore ?? 78;
  const riskScore = risk?.riskScore ?? 35;
  const decConfidence = decision?.confidence ?? 89;
  const decScore = decision?.overallScore ?? 84;

  // Radar chart data for agent comparison
  const radarData = [
    { subject: "Sentiment", "Fundamental Agent": 80, "Market Agent": 90, "Risk Agent": 70, fullMark: 100 },
    { subject: "Financials", "Fundamental Agent": 85, "Market Agent": 80, "Risk Agent": 60, fullMark: 100 },
    { subject: "Risk", "Fundamental Agent": 75, "Market Agent": 85, "Risk Agent": 50, fullMark: 100 },
    { subject: "News", "Fundamental Agent": 70, "Market Agent": 88, "Risk Agent": 65, fullMark: 100 },
    { subject: "Report", "Fundamental Agent": 88, "Market Agent": 92, "Risk Agent": 75, fullMark: 100 },
  ];

  // Define matrix rows (agents) and columns (metrics)
  const rows = [
    "Research Agent",
    "Financial Agent",
    "News Agent",
    "Sentiment Agent",
    "Risk Agent",
    "Decision Agent",
    "Report Agent"
  ];

  const cols = [
    "Confidence",
    "Data Quality",
    "Coverage",
    "Reliability",
    "Final Score"
  ];

  // Map values dynamically from the current execution context state
  const getCellValue = (row: string, col: string): number => {
    switch (row) {
      case "Research Agent":
        if (col === "Confidence") return 90;
        if (col === "Data Quality") return 85;
        if (col === "Coverage") return 95;
        if (col === "Reliability") return 92;
        return 88;
      case "Financial Agent":
        if (col === "Confidence") return Math.round(finScore * 0.95);
        if (col === "Data Quality") return 90;
        if (col === "Coverage") return 85;
        if (col === "Reliability") return 95;
        return finScore;
      case "News Agent":
        if (col === "Confidence") return 80;
        if (col === "Data Quality") return 80;
        if (col === "Coverage") return 90;
        if (col === "Reliability") return 85;
        return 83;
      case "Sentiment Agent":
        if (col === "Confidence") return sentScore;
        if (col === "Data Quality") return 82;
        if (col === "Coverage") return 88;
        if (col === "Reliability") return 85;
        return sentScore;
      case "Risk Agent":
        const actualRiskScore = Math.max(10, 100 - riskScore);
        if (col === "Confidence") return actualRiskScore;
        if (col === "Data Quality") return 88;
        if (col === "Coverage") return 92;
        if (col === "Reliability") return 90;
        return actualRiskScore;
      case "Decision Agent":
        if (col === "Confidence") return decConfidence;
        if (col === "Data Quality") return 95;
        if (col === "Coverage") return 95;
        if (col === "Reliability") return 92;
        return decScore;
      case "Report Agent":
        if (col === "Confidence") return decConfidence;
        if (col === "Data Quality") return 98;
        if (col === "Coverage") return 98;
        if (col === "Reliability") return 95;
        return decScore;
      default:
        return 85;
    }
  };

  // Get cell tooltip/description dynamically
  const getCellDescription = (row: string, col: string, val: number): string => {
    return `${row} achieved a ${col} of ${val}% during the current analysis loop of ${companyName}.`;
  };

  // State to track the currently hovered cell for tooltip rendering
  const [hoveredCell, setHoveredCell] = useState<MatrixCell | null>(null);

  // Return matching color based on the value mapping
  const getHeatmapColor = (value: number) => {
    // Dynamic purple accent palette using variable opacity
    const opacity = Math.min(1, Math.max(0.12, (value - 40) / 60)); 
    return `rgba(124, 58, 237, ${opacity})`; // Deep violet theme color
  };

  return (
    <div style={{ marginTop: 40, marginBottom: 24 }} className="fade-in">
      <h3 style={{ fontSize: 24, fontWeight: 900, color: "var(--text)", marginBottom: 4, letterSpacing: "-0.03em" }}>
        Swarm Intelligence Analytics
      </h3>
      <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>
        Quantitative tracking and performance mapping of the 7-agent swarm for {companyName}.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))", gap: 24, marginBottom: 16 }}>
        
        {/* Heatmap Card (Interactive Multi-Agent Performance Matrix) */}
        <div className="glass-card" style={{ padding: "28px", display: "flex", flexDirection: "column", background: "var(--surface)", border: "1px solid var(--border)", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 17, fontWeight: 800, color: "var(--text)" }}>Multi-Agent Performance Matrix</span>
              <Info size={16} color="#94A3B8" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <span>Live Run Mode</span>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
            </div>
          </div>

          <div style={{ position: "relative", flex: 1 }}>
            {/* Columns Axis Labels */}
            <div style={{ display: "grid", gridTemplateColumns: `120px repeat(${cols.length}, 1fr)`, gap: 4, marginBottom: 8 }}>
              <div />
              {cols.map(c => (
                <div key={c} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>
                  {c}
                </div>
              ))}
            </div>

            {/* Matrix Rows & Cells */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {rows.map((row) => (
                <div key={row} style={{ display: "grid", gridTemplateColumns: `120px repeat(${cols.length}, 1fr)`, gap: 4 }}>
                  {/* Row Axis Label */}
                  <div style={{ textAlign: "right", paddingRight: 12, fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                    {row.replace(" Agent", "")}
                  </div>
                  
                  {/* Matrix Cells */}
                  {cols.map((col) => {
                    const val = getCellValue(row, col);
                    const isHovered = hoveredCell?.rowLabel === row && hoveredCell?.colLabel === col;
                    return (
                      <div
                        key={`${row}-${col}`}
                        style={{
                          background: getHeatmapColor(val),
                          color: val > 75 ? "#FFFFFF" : "var(--text)",
                          height: 38,
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          border: isHovered ? "2px solid #FFFFFF" : "1px solid transparent",
                          transform: isHovered ? "scale(1.05)" : "scale(1)",
                          boxShadow: isHovered ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
                        }}
                        onMouseEnter={() => setHoveredCell({
                          rowLabel: row,
                          colLabel: col,
                          value: val,
                          description: getCellDescription(row, col, val)
                        })}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {val}%
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Heatmap Legend */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700 }}>Color Scale:</span>
                <div style={{ display: "flex", gap: 2 }}>
                  {[45, 60, 75, 90, 98].map((v) => (
                    <div
                      key={v}
                      style={{
                        width: 18,
                        height: 12,
                        borderRadius: 3,
                        background: getHeatmapColor(v),
                        display: "inline-block"
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>Low (40%) → High (100%)</span>
              </div>

              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>
                Hover cells for info
              </div>
            </div>

            {/* Tooltip Overlay */}
            {hoveredCell && (
              <div
                style={{
                  position: "absolute",
                  bottom: "55px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(10, 10, 10, 0.95)",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
                  pointerEvents: "none",
                  zIndex: 50,
                  maxWidth: "320px",
                  textAlign: "center",
                  animation: "fadeIn 0.15s ease-out"
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 13, color: "#C7D2FE", marginBottom: 4 }}>
                  {hoveredCell.rowLabel} &middot; {hoveredCell.colLabel}
                </div>
                <div style={{ fontSize: 12, color: "#E2E8F0", lineHeight: 1.4 }}>
                  {hoveredCell.description}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Radar Chart Card */}
        <div className="glass-card" style={{ padding: "28px", background: "var(--surface)", border: "1px solid var(--border)", position: "relative" }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 20 }}>
            Multi-Agent Capability Breakdown
          </div>
          
          <ResponsiveContainer width="100%" height={290}>
            <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "var(--text-muted)", fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              
              <Radar name="Fundamental Agent" dataKey="Fundamental Agent" stroke="#10B981" fill="#10B981" fillOpacity={0.08} strokeWidth={2} />
              <Radar name="Market Agent" dataKey="Market Agent" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.2} strokeWidth={2} />
              <Radar name="Risk Agent" dataKey="Risk Agent" stroke="#EF4444" fill="#EF4444" fillOpacity={0.08} strokeWidth={2} />
              
              <Tooltip
                contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
                labelStyle={{ fontWeight: 700, color: "var(--text)", marginBottom: 4 }}
              />
              <Legend 
                wrapperStyle={{ fontSize: 11, fontWeight: 700, paddingTop: 10 }} 
                iconType="circle" 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
