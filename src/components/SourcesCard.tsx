"use client";

import { Globe, ExternalLink } from "lucide-react";
import { ReportData } from "@/types/graph";

export default function SourcesCard({ sources }: { sources: string[] }) {
  return (
    <div className="glass-card fade-in" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--bg-border)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(37,99,235,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Globe size={18} color="#2563EB" />
        </div>
        <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>Sources & References</div>
      </div>
      <div style={{ padding: "16px 20px", display: "flex", flexWrap: "wrap", gap: 8 }}>
        {sources.map((source, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(37,99,235,0.08)",
              border: "1px solid rgba(37,99,235,0.25)",
              borderRadius: 100,
              padding: "6px 14px",
              fontSize: 13,
              color: "#60A5FA",
              fontWeight: 500,
            }}
          >
            <ExternalLink size={11} />
            {source}
          </div>
        ))}
      </div>
    </div>
  );
}
