import axios from 'axios';
import { env } from '../config/env';
import { NewsArticle } from '../types/graph';

export async function fetchCompanyNews(companyName: string, ticker: string): Promise<NewsArticle[]> {
  if (!env.NEWS_API_KEY) {
    console.log(`[NewsAPI] Mock news for: ${companyName} (${ticker})`);
    return [
      {
        title: `${companyName} Announces Revolutionary Next-Gen AI Integration`,
        url: 'https://example.com/news/1',
        source: 'Reuters',
        summary: `${companyName} has unveiled a new system powered by advanced AI agents, expected to boost operational efficiency by 30%.`
      },
      {
        title: `Analysts Upgraded ${ticker} to Strong Buy Following Outstanding Quarterly Growth`,
        url: 'https://example.com/news/2',
        source: 'Bloomberg',
        summary: `Wall Street analysts have raised price targets for ${companyName} as revenue grew by 18.4% Year-over-Year.`
      },
      {
        title: `Competitor Challenges ${companyName}'s Market Leadership With New Product Launch`,
        url: 'https://example.com/news/3',
        source: 'Financial Times',
        summary: `A rival has launched a competing product line, sparking debate over whether ${companyName} can maintain its market share.`
      }
    ];
  }

  try {
    const query = encodeURIComponent(`${companyName} OR ${ticker}`);
    const response = await axios.get(
      `https://newsdata.io/api/1/news?apikey=${env.NEWS_API_KEY}&q=${query}&language=en`
    );
    const articles = response.data.results || [];
    return articles.slice(0, 5).map((art: any) => ({
      title: art.title || 'Untitled Article',
      url: art.link || '',
      source: art.source_id || 'News',
      summary: art.description || art.content || ''
    }));
  } catch (error) {
    console.error("NewsAPI call failed, falling back to mock:", error);
    return [
      {
        title: `${companyName} Launches New Product Line`,
        url: 'https://example.com/news/fallback',
        source: 'TechCrunch',
        summary: `${companyName} continues expanding its footprint with a new strategic project launched this week.`
      }
    ];
  }
}
