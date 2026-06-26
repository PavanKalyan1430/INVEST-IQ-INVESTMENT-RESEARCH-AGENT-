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

export async function getFinnhubProfile(symbol: string): Promise<FinnhubProfile | null> {
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
      },
      META: {
        name: 'Meta Platforms, Inc.',
        ticker: 'META',
        exchange: 'NASDAQ',
        marketCapitalization: 1200000,
        shareOutstanding: 2500,
        logo: 'https://logo.clearbit.com/meta.com',
        weburl: 'https://www.meta.com',
        finnhubIndustry: 'Technology'
      },
      MSFT: {
        name: 'Microsoft Corporation',
        ticker: 'MSFT',
        exchange: 'NASDAQ',
        marketCapitalization: 3200000,
        shareOutstanding: 7430,
        logo: 'https://logo.clearbit.com/microsoft.com',
        weburl: 'https://www.microsoft.com',
        finnhubIndustry: 'Technology'
      },
      GOOGL: {
        name: 'Alphabet Inc.',
        ticker: 'GOOGL',
        exchange: 'NASDAQ',
        marketCapitalization: 2200000,
        shareOutstanding: 12000,
        logo: 'https://logo.clearbit.com/google.com',
        weburl: 'https://www.google.com',
        finnhubIndustry: 'Technology'
      },
      AMZN: {
        name: 'Amazon.com, Inc.',
        ticker: 'AMZN',
        exchange: 'NASDAQ',
        marketCapitalization: 1900000,
        shareOutstanding: 10400,
        logo: 'https://logo.clearbit.com/amazon.com',
        weburl: 'https://www.amazon.com',
        finnhubIndustry: 'Retail'
      }
    };
    return mockProfiles[upperSym] || {
      name: `${symbol} Corp`,
      ticker: upperSym,
      exchange: 'NASDAQ',
      marketCapitalization: 150000,
      shareOutstanding: 500,
      logo: '',
      weburl: `https://www.${symbol.toLowerCase()}.com`,
      finnhubIndustry: 'Technology'
    };
  }

  try {
    const response = await axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${env.FINNHUB_API_KEY}`);
    if (!response.data || Object.keys(response.data).length === 0 || !response.data.name) {
      return {
        name: `${symbol} Corp`,
        ticker: symbol.toUpperCase(),
        exchange: 'NASDAQ',
        marketCapitalization: 150000,
        shareOutstanding: 500,
        logo: '',
        weburl: `https://www.${symbol.toLowerCase()}.com`,
        finnhubIndustry: 'Technology'
      };
    }
    return response.data;
  } catch (error) {
    console.error("Finnhub API call failed, returning fallback profile:", error);
    return {
      name: `${symbol} Corp`,
      ticker: symbol.toUpperCase(),
      exchange: 'NASDAQ',
      marketCapitalization: 150000,
      shareOutstanding: 500,
      logo: '',
      weburl: `https://www.${symbol.toLowerCase()}.com`,
      finnhubIndustry: 'Technology'
    };
  }
}
