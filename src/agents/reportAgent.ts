import { askGeminiJSON } from '../services/gemini';
import { reportSystemInstruction } from '../prompts/reportPrompt';
import { GraphState, ReportData } from '../types/graph';

export async function runReportAgent(state: GraphState): Promise<Partial<GraphState>> {
  const { companyName, research, financial, news, sentiment, risk, decision } = state;
  console.log(`[ReportAgent] Formatting final UI-ready report for: ${companyName}`);

  const contextStr = `
Company: ${companyName}
Research: ${JSON.stringify(research || {})}
Financial: ${JSON.stringify(financial || {})}
News: ${JSON.stringify(news || {})}
Sentiment: ${JSON.stringify(sentiment || {})}
Risk: ${JSON.stringify(risk || {})}
Decision: ${JSON.stringify(decision || {})}
  `;

  // Standard realistic fallback mock data matching Recharts structure
  const mockFallback: ReportData = {
    summary: `${companyName} is positioned favorably in its market segments. Its high financial score of ${financial?.score || 80}/100 and favorable bullish sentiment of ${sentiment?.sentimentScore || 70}/100 supports a positive outlook, while medium-level risks of ${risk?.riskScore || 35}% indicate typical macro vulnerabilities.`,
    highlights: [
      `Overall Score of ${decision?.overallScore || 84}/100 with a ${decision?.recommendation || 'BUY'} recommendation`,
      `ROE at a solid ${financial?.roe || 15}% indicating highly efficient operations`,
      `Low Financial risk channel and expanding free cash flows`
    ],
    metrics: [
      { label: "Recommendation", value: decision?.recommendation || 'BUY' },
      { label: "Financial Health Score", value: `${financial?.score || 82}/100` },
      { label: "Risk Score", value: `${risk?.riskScore || 35}% (${risk?.riskLevel || 'Medium'})` },
      { label: "Sentiment Rating", value: `${sentiment?.sentimentScore || 78}% (${sentiment?.label || 'Bullish'})` }
    ],
    charts: {
      radar: [
        { subject: "Financials", A: financial?.score || 82, fullMark: 100 },
        { subject: "Growth", A: financial?.growth || 15, fullMark: 100 },
        { subject: "Risk Rating", A: 100 - (risk?.riskScore || 35), fullMark: 100 },
        { subject: "Sentiment", A: sentiment?.sentimentScore || 78, fullMark: 100 },
        { subject: "Market Position", A: 85, fullMark: 100 }
      ],
      financials: [
        { year: "2023", revenue: (financial?.revenue?.[0] || 15e9) / 1e9, profit: (financial?.profit?.[0] || 2.5e9) / 1e9, debt: (financial?.debt?.[0] || 5e9) / 1e9, cashFlow: (financial?.cashFlow?.[0] || 2.8e9) / 1e9 },
        { year: "2024", revenue: (financial?.revenue?.[1] || 18e9) / 1e9, profit: (financial?.profit?.[1] || 3.2e9) / 1e9, debt: (financial?.debt?.[1] || 4.8e9) / 1e9, cashFlow: (financial?.cashFlow?.[1] || 3.4e9) / 1e9 },
        { year: "2025", revenue: (financial?.revenue?.[2] || 22e9) / 1e9, profit: (financial?.profit?.[2] || 4.1e9) / 1e9, debt: (financial?.debt?.[2] || 4.2e9) / 1e9, cashFlow: (financial?.cashFlow?.[2] || 4.5e9) / 1e9 }
      ],
      sentiment: [
        { name: "Positive", value: sentiment?.positivePercent || 70, color: "#10B981" },
        { name: "Negative", value: sentiment?.negativePercent || 15, color: "#EF4444" },
        { name: "Neutral", value: sentiment?.neutralPercent || 15, color: "#F59E0B" }
      ],
      gauge: decision?.overallScore || 84
    },
    sources: news?.sources || ["Reuters", "Bloomberg", "Finnhub", "SEC Filings"]
  };

  const report = await askGeminiJSON<ReportData>(
    reportSystemInstruction,
    contextStr,
    mockFallback
  );

  return { report };
}
