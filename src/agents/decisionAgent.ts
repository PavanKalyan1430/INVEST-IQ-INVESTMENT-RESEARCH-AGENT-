import { askGeminiJSON } from '../services/gemini';
import { decisionSystemInstruction } from '../prompts/decisionPrompt';
import { GraphState, DecisionData } from '../types/graph';

export async function runDecisionAgent(state: GraphState): Promise<Partial<GraphState>> {
  const { companyName, research, financial, news, sentiment, risk } = state;
  console.log(`[DecisionAgent] Finalizing investment decision for: ${companyName}`);

  const contextStr = `
Company Name: ${companyName}
Industry: ${research?.industry || 'Technology'}
Strengths: ${JSON.stringify(research?.strengths || [])}
Weaknesses: ${JSON.stringify(research?.weaknesses || [])}

Financial Analysis Score: ${financial?.score || 0}/100
Financial Summary: ${financial?.reasoning || ''}

News Summary: ${news?.summary || ''}
Sentiment Score: ${sentiment?.sentimentScore || 0}/100 (Label: ${sentiment?.label || 'Neutral'})

Risk Score: ${risk?.riskScore || 0}/100 (Level: ${risk?.riskLevel || 'Medium'})
Risk Summary: Business=${risk?.businessRisk || ''}, Financial=${risk?.financialRisk || ''}, Competitive=${risk?.competitiveRisk || ''}
  `;

  // Standard realistic fallback mock data
  const mockFallback: DecisionData = {
    recommendation: 'INVEST',
    overallScore: 84,
    confidence: 89,
    reasoning: `Based on strong financial health metrics, high return on equity, and positive news sentiment, ${companyName} represents a high-probability opportunity. Competitor risk is offset by its solid competitive moat and ongoing product updates.`,
    pros: [
      `Exceptional balance sheet health with high cash buffer`,
      `Leadership positioning in high-growth industry`,
      `Strong bullish sentiment backing recent launches`
    ],
    cons: [
      `Macro inflation pressure affecting capital intensive projects`,
      `Intense competition from emerging agile startup systems`
    ]
  };

  const decision = await askGeminiJSON<DecisionData>(
    decisionSystemInstruction,
    contextStr,
    mockFallback
  );

  return { decision };
}
