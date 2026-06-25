import { askGeminiJSON } from '../services/gemini';
import { sentimentSystemInstruction } from '../prompts/sentimentPrompt';
import { GraphState, SentimentAnalysis } from '../types/graph';

export async function runSentimentAgent(state: GraphState): Promise<Partial<GraphState>> {
  const { companyName, research, news } = state;
  console.log(`[SentimentAgent] Scoring sentiment for: ${companyName}`);

  const contextStr = `
Company: ${companyName}
Industry: ${research?.industry || 'Technology'}
News Summary: ${news?.summary || ''}
Positive Headlines: ${JSON.stringify(news?.positiveNews || [])}
Negative Headlines: ${JSON.stringify(news?.negativeNews || [])}
  `;

  // Standard realistic fallback mock data
  const mockFallback: SentimentAnalysis = {
    sentimentScore: 78,
    positivePercent: 70,
    negativePercent: 15,
    neutralPercent: 15,
    label: 'Bullish'
  };

  const sentiment = await askGeminiJSON<SentimentAnalysis>(
    sentimentSystemInstruction,
    contextStr,
    mockFallback
  );

  return { sentiment };
}
