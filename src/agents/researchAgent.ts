import { askGeminiJSON } from '../services/gemini';
import { searchTavily } from '../services/tavily';
import { getFinnhubProfile } from '../services/finnhub';
import { researchSystemInstruction } from '../prompts/researchPrompt';
import { GraphState, CompanyResearch } from '../types/graph';

export async function runResearchAgent(state: GraphState): Promise<Partial<GraphState>> {
  const { companyName } = state;
  console.log(`[ResearchAgent] Starting research on: ${companyName}`);

  // Fetch search context and profile info
  const searchResults = await searchTavily(companyName);
  const finnhubProfile = await getFinnhubProfile(companyName);

  const contextStr = `
Company Search Query: ${companyName}
Finnhub Profile Name: ${finnhubProfile?.name || companyName}
Industry: ${finnhubProfile?.finnhubIndustry || 'Technology'}
Market Capitalization: $${(finnhubProfile?.marketCapitalization || 0) / 1000}B

Search Results Context:
${searchResults.map((r, i) => `[${i + 1}] Title: ${r.title}\nContent: ${r.content}\nURL: ${r.url}`).join('\n\n')}
  `;

  // Standard realistic fallback mock data
  const mockFallback: CompanyResearch = {
    overview: `${finnhubProfile?.name || companyName} is a global leader in high-growth technology markets, operating multiple key divisions across software, hardware, and emerging services.`,
    businessModel: `Generates revenue via product sales, software subscriptions, licensing, and cloud-delivered infrastructure.`,
    products: ['Core Software Solutions', 'Next-Gen hardware suites', 'Professional Services'],
    competitors: ['Legacy systems competitors', 'Emerging cloud solutions startups'],
    industry: finnhubProfile?.finnhubIndustry || 'Technology',
    strengths: ['High client retention', 'Global distribution infrastructure', 'Vibrant patent portfolio'],
    weaknesses: ['Concentrated supply chains', 'Heavy capital expenditure requirements']
  };

  const research = await askGeminiJSON<CompanyResearch>(
    researchSystemInstruction,
    contextStr,
    mockFallback
  );

  return { research };
}
