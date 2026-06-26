"use client";

import React from "react";
import { Info } from "lucide-react";
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

interface MarketAnalyticsProps {
  companyName: string;
}

// Data for Radar Chart (comparing our AI Agents' confidence levels)
const radarData = [
  { subject: "Sentiment", "Fundamental Agent": 80, "Market Agent": 90, "Risk Agent": 70, fullMark: 100 },
  { subject: "Financials", "Fundamental Agent": 85, "Market Agent": 80, "Risk Agent": 60, fullMark: 100 },
  { subject: "Risk", "Fundamental Agent": 75, "Market Agent": 85, "Risk Agent": 50, fullMark: 100 },
  { subject: "News", "Fundamental Agent": 70, "Market Agent": 88, "Risk Agent": 65, fullMark: 100 },
  { subject: "Report", "Fundamental Agent": 88, "Market Agent": 92, "Risk Agent": 75, fullMark: 100 },
];

const rows = ["Sector", "Economy", "Company", "Financials", "Health", "Sentiments", "Technology"];
const cols = ["Micro", "Small", "Mid", "Large", "Mega"];

// Hardcoded pattern to roughly match the visual density in the user's image
const heatmapData = [
  [0.4, 0.7, 0.8, 0.5, 0.0], // Sector
  [0.4, 0.0, 0.0, 0.4, 0.7], // Economy
  [0.4, 0.7, 0.8, 0.5, 0.0], // Company
  [0.5, 0.0, 0.0, 0.4, 0.7], // Financials
  [0.4, 0.7, 0.8, 0.5, 0.0], // Health
  [0.4, 0.0, 0.0, 0.4, 0.7], // Sentiments
  [0.5, 0.7, 0.8, 0.5, 0.0], // Technology
];

const getHeatmapColor = (intensity: number) => {
  if (intensity === 0) return "#F8FAFC"; // Very light grey/white for empty
  // Use the exact purple theme gradient logic
  return `rgba(99, 102, 241, ${intensity})`; // Indigo-500 equivalent with opacity
};

export default function MarketAnalytics({ companyName }: MarketAnalyticsProps) {
  return (
    <div style={{ marginTop: 40, marginBottom: 24 }} className="fade-in">
      <h3 style={{ fontSize: 24, fontWeight: 900, color: "var(--text)", marginBottom: 24, letterSpacing: "-0.02em" }}>
        Analytics & Visualization
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 24, marginBottom: 16 }}>
        
        {/* Heatmap Card */}
        <div className="card" style={{ padding: "32px", display: "flex", flexDirection: "column", background: "var(--surface)", borderRadius: 16, border: "1px solid var(--border)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: "var(--text)" }}>Sector Performance</span>
              <Info size={16} color="#94A3B8" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#64748B" }}>Date 2026</span>
              <div style={{ width: 120, height: 4, background: "#EEF2FF", borderRadius: 4, position: "relative" }}>
                <div style={{ position: "absolute", left: "20%", top: -6, width: 16, height: 16, borderRadius: "50%", background: "var(--surface)", border: "3px solid var(--accent)", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} />
                <div style={{ width: "20%", height: "100%", background: "var(--accent)", borderRadius: 4 }} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 24 }}>
            {/* Main Grid Area */}
            <div style={{ flex: 1 }}>
              {/* Top Columns (X-axis) */}
              <div style={{ display: "grid", gridTemplateColumns: `80px repeat(${cols.length}, 1fr)`, gap: 4, marginBottom: 12 }}>
                <div /> {/* Empty top-left */}
                {cols.map(c => (
                  <div key={c} style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: "#64748B" }}>
                    {c}
                  </div>
                ))}
              </div>

              {/* Rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {rows.map((row, rIdx) => (
                  <div key={row} style={{ display: "grid", gridTemplateColumns: `80px repeat(${cols.length}, 1fr)`, gap: 4 }}>
                    {/* Y-axis Label */}
                    <div style={{ textAlign: "right", paddingRight: 16, fontSize: 13, fontWeight: 600, color: "#475569", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                      {row}
                    </div>
                    
                    {/* Heatmap Cells */}
                    {cols.map((_, cIdx) => (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        style={{
                          background: getHeatmapColor(heatmapData[rIdx][cIdx]),
                          height: 48, // Taller square blocks
                          borderRadius: 2,
                          transition: "opacity 0.2s",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.8")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Gradient Legend on Right */}
            <div style={{ width: 16, background: "linear-gradient(to bottom, #4F46E5, #E0E7FF, #F8FAFC)", borderRadius: 8 }} />
          </div>
        </div>

        {/* Radar Chart Card */}
        <div className="card" style={{ padding: "32px", background: "var(--surface)", borderRadius: 16, border: "1px solid var(--border)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", position: "relative" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 24, textAlign: "center" }}>
            Multi-Agent Confidence Breakdown
          </div>
          
          <ResponsiveContainer width="100%" height={360}>
            <RadarChart data={radarData} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 13, fill: "#64748B", fontWeight: 600 }} />
              {/* Hide the default radius axis lines to match the clean image look */}
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              
              <Radar name="Fundamental Agent" dataKey="Fundamental Agent" stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.1} strokeWidth={2} />
              <Radar name="Market Agent" dataKey="Market Agent" stroke="#6366F1" fill="#6366F1" fillOpacity={0.3} strokeWidth={2} />
              <Radar name="Risk Agent" dataKey="Risk Agent" stroke="#F43F5E" fill="#F43F5E" fillOpacity={0.1} strokeWidth={2} />
              
              <Tooltip
                contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                labelStyle={{ fontWeight: 700, color: "var(--text)", marginBottom: 4 }}
              />
              <Legend 
                wrapperStyle={{ fontSize: 13, fontWeight: 700, paddingTop: 20 }} 
                iconType="square" 
              />
            </RadarChart>
          </ResponsiveContainer>

          {/* Right side manual labels matching the image (0.15, 0.05, 0) */}
          <div style={{ position: "absolute", right: 24, top: 120, height: 200, display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: 11, fontWeight: 700, color: "#94A3B8" }}>
            <span>0.15</span>
            <span>0.05</span>
            <span>0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
