"use client";

import { Newspaper, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { NewsAnalysis } from "@/types/graph";
import { useState } from "react";

export default function NewsCard({ news }: { news: NewsAnalysis }) {
  const [expanded, setExpanded] = useState(true);

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
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--hold-bg)", border: "1px solid var(--hold-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Newspaper size={20} color="var(--hold)" />
        </div>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>News Analysis</div>
          <div style={{ fontSize: 13, color: "var(--text-3)" }}>{news.latestNews.length} articles analyzed</div>
        </div>
        {expanded ? <ChevronUp size={20} color="var(--text-4)" /> : <ChevronDown size={20} color="var(--text-4)" />}
      </button>

      {expanded && (
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Summary */}
          <div style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.6, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
            {news.summary}
          </div>

          {/* Positive / Negative */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
            <div style={{ background: "var(--buy-bg)", border: "1px solid var(--buy-border)", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--buy)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ background: "var(--buy)", color: "white", borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>✓</span> Positive Headlines
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {news.positiveNews.map((n, i) => (
                  <div key={i} style={{ fontSize: 13, color: "var(--text-2)", display: "flex", gap: 8, alignItems: "flex-start", lineHeight: 1.5 }}>
                    <div style={{ color: "var(--buy)", marginTop: 2 }}>•</div>
                    <span>{n}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "var(--pass-bg)", border: "1px solid var(--pass-border)", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--pass)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ background: "var(--pass)", color: "white", borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>✕</span> Negative Headlines
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {news.negativeNews.map((n, i) => (
                  <div key={i} style={{ fontSize: 13, color: "var(--text-2)", display: "flex", gap: 8, alignItems: "flex-start", lineHeight: 1.5 }}>
                    <div style={{ color: "var(--pass)", marginTop: 2 }}>•</div>
                    <span>{n}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Latest Articles */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Latest Articles</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {news.latestNews.slice(0, 3).map((article, i) => (
                <a
                  key={i}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-hover"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: "12px 16px",
                    textDecoration: "none",
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 6, background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Newspaper size={14} color="var(--text-3)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 4, lineHeight: 1.4 }}>{article.title}</div>
                    <div style={{ fontSize: 12, color: "var(--text-4)", fontWeight: 500 }}>{article.source}</div>
                  </div>
                  <ExternalLink size={16} color="var(--text-4)" style={{ flexShrink: 0 }} />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
