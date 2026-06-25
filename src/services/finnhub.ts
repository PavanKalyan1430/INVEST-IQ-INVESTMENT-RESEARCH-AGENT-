import axios from 'axios';
import { env } from '../config/env';

export interface FinnhubProfile {
  name: string;
  ticker: string;
  exchange: string;
  marketCapitalization: number;
  shareOutstanding: number;
  logo: string;
  weburl: string;
  finnhubIndustry: string;
}

export async function getFinnhubProfile(symbol: string): Promise<FinnhubProfile> {
  if (!env.FINNHUB_API_KEY) {
    console.log(`[Finnhub] Mock profile for symbol: ${symbol}`);
    const upperSym = symbol.toUpperCase();
    const mockProfiles: Record<string, FinnhubProfile> = {
      AAPL: {
        name: 'Apple Inc.',
        ticker: 'AAPL',
        exchange: 'NASDAQ',
        marketCapitalization: 3250000,
        shareOutstanding: 15400,
        logo: 'https://logo.clearbit.com/apple.com',
        weburl: 'https://www.apple.com',
        finnhubIndustry: 'Technology'
      },
      TSLA: {
        name: 'Tesla Inc.',
        ticker: 'TSLA',
        exchange: 'NASDAQ',
        marketCapitalization: 820000,
        shareOutstanding: 3180,
        logo: 'https://logo.clearbit.com/tesla.com',
        weburl: 'https://www.tesla.com',
        finnhubIndustry: 'Automotive'
      },
      NVDA: {
        name: 'NVIDIA Corporation',
        ticker: 'NVDA',
        exchange: 'NASDAQ',
        marketCapitalization: 3120000,
        shareOutstanding: 24600,
        logo: 'https://logo.clearbit.com/nvidia.com',
        weburl: 'https://www.nvidia.com',
        finnhubIndustry: 'Semiconductors'
      }
    };
    return mockProfiles[upperSym] || {
      name: `${symbol} Corp`,
      ticker: upperSym,
      exchange: 'NYSE',
      marketCapitalization: 45000,
      shareOutstanding: 250,
      logo: 'https://logo.clearbit.com/clearbit.com',
      weburl: `https://www.${symbol.toLowerCase()}.com`,
      finnhubIndustry: 'Technology'
    };
  }

  try {
    const response = await axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${env.FINNHUB_API_KEY}`);
    return response.data;
  } catch (error) {
    console.error("Finnhub API call failed, returning fallback profile:", error);
    return {
      name: `${symbol} Corporation`,
      ticker: symbol.toUpperCase(),
      exchange: 'NASDAQ',
      marketCapitalization: 120000,
      shareOutstanding: 800,
      logo: '',
      weburl: `https://www.${symbol.toLowerCase()}.com`,
      finnhubIndustry: 'Technology'
    };
  }
}
