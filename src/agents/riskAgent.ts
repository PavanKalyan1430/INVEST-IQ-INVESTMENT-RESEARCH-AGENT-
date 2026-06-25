import { askGeminiJSON } from '../services/gemini';
import { riskSystemInstruction } from '../prompts/riskPrompt';
import { GraphState, RiskAnalysis } from '../types/graph';

export async function runRiskAgent(state: GraphState): Promise<Partial<GraphState>> {
  const { companyName, research, financial, news, sentiment } = state;
  console.log(`[RiskAgent] Running risk assessment for: ${companyName}`);

  const contextStr = `
Company: ${companyName}
Industry Sector: ${research?.industry || 'Technology'}
Weaknesses: ${JSON.stringify(research?.weaknesses || [])}
Financial Score: ${financial?.score || 0}/100
Financial Reasoning: ${financial?.reasoning || ''}
Sentiment Score: ${sentiment?.sentimentScore || 0}/100
News Concerns: ${JSON.stringify(news?.negativeNews || [])}
  `;

  // Standard realistic fallback mock data
  const mockFallback: RiskAnalysis = {
    businessRisk: `Moderate risks centered on competitive market positioning and reliance on high-growth technology cycles.`,
    financialRisk: `Low risk due to robust free cash flow generating abilities and high liquid asset buffers.`,
    marketRisk: `High interest rates and global macroeconomic adjustments may contract end-user purchasing power.`,
    legalRisk: `Typical ongoing regulatory review regarding data privacy and antitrust across global trade regions.`,
    competitiveRisk: `Intensifying competition from specialized startups in the cloud and AI space.`,
    riskScore: 35,
    riskLevel: 'Medium'
  };

  const risk = await askGeminiJSON<RiskAnalysis>(
    riskSystemInstruction,
    contextStr,
    mockFallback
  );

  return { risk };
}
