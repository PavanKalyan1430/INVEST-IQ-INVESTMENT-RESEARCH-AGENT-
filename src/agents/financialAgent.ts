import { askGeminiJSON } from '../services/gemini';
import { getFMPFinancials } from '../services/fmp';
import { financialSystemInstruction } from '../prompts/financialPrompt';
import { GraphState, FinancialAnalysis } from '../types/graph';

export async function runFinancialAgent(state: GraphState): Promise<Partial<GraphState>> {
  const { companyName, research } = state;
  console.log(`[FinancialAgent] Starting financial analysis for: ${companyName}`);

  // Determine standard ticker symbol
  const ticker = companyName.toUpperCase().replace(/\s/g, '');
  const financialData = await getFMPFinancials(ticker);

  const contextStr = `
Company: ${companyName}
Industry Sector: ${research?.industry || 'Technology'}
Income / Debt Data:
- Historical Revenue: ${JSON.stringify(financialData.revenue)}
- Historical Profit: ${JSON.stringify(financialData.profit)}
- Historical Debt: ${JSON.stringify(financialData.debt)}
- Historical Operating Cash Flow: ${JSON.stringify(financialData.cashFlow)}
- TTM PE Ratio: ${financialData.peRatio}
- TTM ROE: ${financialData.roe}%
- EPS: $${financialData.eps}
- YoY Growth rate: ${financialData.growth}%
  `;

  // Standard realistic fallback mock data
  const mockFallback: FinancialAnalysis = {
    revenue: financialData.revenue,
    profit: financialData.profit,
    peRatio: financialData.peRatio,
    roe: financialData.roe,
    debt: financialData.debt,
    eps: financialData.eps,
    cashFlow: financialData.cashFlow,
    growth: financialData.growth,
    score: 82,
    reasoning: `The company exhibits strong operating growth and clean balance sheet metrics, with a reasonable PE ratio of ${financialData.peRatio} and high return on equity of ${financialData.roe}%.`
  };

  const financial = await askGeminiJSON<FinancialAnalysis>(
    financialSystemInstruction,
    contextStr,
    mockFallback
  );

  return { financial };
}
