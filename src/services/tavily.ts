import axios from 'axios';
import { env } from '../config/env';

export interface TavilyResult {
  title: string;
  url: string;
  content: string;
}

export async function searchTavily(query: string): Promise<TavilyResult[]> {
  if (!env.TAVILY_API_KEY) {
    console.log(`[Tavily] Mock search for query: "${query}"`);
    return [
      {
        title: `${query} Latest Overview & Business Model`,
        url: 'https://example.com/company-overview',
        content: `Detailed overview about ${query} including operational footprint, key competitors, and main business segments.`
      },
      {
        title: `${query} Financial Performance & Market Cap`,
        url: 'https://example.com/finance-report',
        content: `${query} reports strong year-over-year revenue growth, expanding gross margins, and dominant cash flow conversion.`
      }
    ];
  }

  let attempts = 3;
  while (attempts > 0) {
    try {
      const response = await axios.post('https://api.tavily.com/search', {
        api_key: env.TAVILY_API_KEY,
        query: query,
        search_depth: 'advanced',
        max_results: 5
      });
      return response.data.results || [];
    } catch (error) {
      attempts--;
      console.warn(`Tavily search failed. Remaining attempts: ${attempts}. Error:`, error);
      if (attempts === 0) {
        return [
          {
            title: `Fallback results for: ${query}`,
            url: 'https://fallback.com',
            content: `Fallback search content for ${query} due to Tavily connection failure.`
          }
        ];
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  return [];
}
