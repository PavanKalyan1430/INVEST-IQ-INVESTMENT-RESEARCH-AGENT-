"use client";

import { DollarSign, ChevronDown, ChevronUp } from "lucide-react";
import { FinancialAnalysis } from "@/types/graph";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface FinancialCardProps {
  financial: FinancialAnalysis;
  chartData: { year: string; revenue: number; profit: number; debt: number; cashFlow: number }[];
}

export default function FinancialCard({ financial, chartData }: FinancialCardProps) {
  const [expanded, setExpanded] = useState(true);

  const metrics = [
    { label: "PE Ratio", value: financial.peRatio?.toFixed(1) || "N/A", unit: "x" },
    { label: "ROE", value: financial.roe?.toFixed(1) || "N/A", unit: "%" },
    { label: "EPS", value: `$${financial.eps?.toFixed(2) || "N/A"}` },
    { label: "YoY Growth", value: financial.growth?.toFixed(1) || "N/A", unit: "%" },
  ];

  return (
    <div className="card fade-in" style={{ padding: 0, overflow: "hidden", marginBottom: "16px" }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "20px 24px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          borderBottom: expanded ? "1px solid var(--border)" : "none",
        }}
      >
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--buy-bg)", border: "1px solid var(--buy-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <DollarSign size={20} color="var(--buy)" />
        </div>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Financial Analysis</div>
          <div style={{ fontSize: 13, color: "var(--text-3)" }}>
            Health Score: {" "}
            <span style={{ color: "var(--buy)", fontWeight: 700 }}>{financial.score}/100</span>
          </div>
        </div>
        {expanded ? <ChevronUp size={20} color="var(--text-4)" /> : <ChevronDown size={20} color="var(--text-4)" />}
      </button>

      {expanded && (
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Key Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 12 }}>
            {metrics.map(({ label, value, unit }) => (
              <div key={label} style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-4)", marginBottom: 8 }}>{label}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>
                  {value}<span style={{ fontSize: 14, color: "var(--text-4)", marginLeft: 2, fontWeight: 500 }}>{unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bar Chart */}
          {chartData && chartData.length > 0 && (
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>Revenue, Profit & Debt (in $B)</div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--text-4)", fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--text-4)", fontWeight: 500 }} tickFormatter={(v) => `$${v.toFixed(0)}B`} />
                  <Tooltip
                    cursor={{ fill: "var(--surface-2)" }}
                    contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
                    formatter={(value: any, name: any) => [`$${value}B`, name]}
                    labelStyle={{ fontWeight: 600, color: "var(--text)", marginBottom: 4 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 13, paddingTop: 10 }} iconType="circle" />
                  <Bar dataKey="revenue" name="Revenue" fill="var(--accent)" radius={[4, 4, 0, 0]} barSize={24} />
                  <Bar dataKey="profit" name="Profit" fill="var(--buy)" radius={[4, 4, 0, 0]} barSize={24} />
                  <Bar dataKey="debt" name="Debt" fill="var(--pass)" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Reasoning */}
          <div style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.6, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Financial Context</div>
            {financial.reasoning}
          </div>
        </div>
      )}
    </div>
  );
}
