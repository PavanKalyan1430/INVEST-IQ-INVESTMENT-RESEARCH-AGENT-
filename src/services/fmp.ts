import axios from 'axios';
import { env } from '../config/env';

export interface FMPFinancials {
  revenue: number[];
  profit: number[];
  debt: number[];
  cashFlow: number[];
  peRatio: number;
  roe: number;
  eps: number;
  growth: number;
}

export async function getFMPFinancials(symbol: string): Promise<FMPFinancials> {
  if (!env.FMP_API_KEY) {
    console.log(`[FMP] Mock financials for symbol: ${symbol}`);
    // Return realistic mocked data based on company symbol
    const isBigTech = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'GOOG'].includes(symbol.toUpperCase());
    return {
      revenue: isBigTech ? [320e9, 345e9, 385e9] : [12e9, 14.5e9, 18.4e9],
      profit: isBigTech ? [80e9, 90e9, 105e9] : [2.1e9, 2.8e9, 3.9e9],
      debt: isBigTech ? [110e9, 95e9, 85e9] : [4.5e9, 4.2e9, 3.8e9],
      cashFlow: isBigTech ? [95e9, 108e9, 115e9] : [1.8e9, 2.2e9, 3.1e9],
      peRatio: isBigTech ? 28.5 : 19.8,
      roe: isBigTech ? 32.4 : 14.5,
      eps: isBigTech ? 6.42 : 1.85,
      growth: isBigTech ? 11.5 : 18.4
    };
  }

  try {
    const response = await axios.get(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=3&apikey=${env.FMP_API_KEY}`);
    const keyMetrics = await axios.get(`https://financialmodelingprep.com/api/v3/key-metrics-ttm/${symbol}?apikey=${env.FMP_API_KEY}`);
    const data = response.data;
    const metrics = keyMetrics.data[0] || {};

    if (!data || data.length === 0) {
      throw new Error("No FMP data found");
    }

    const revenue = data.map((d: any) => d.revenue).reverse();
    const profit = data.map((d: any) => d.netIncome).reverse();
    const eps = data[0]?.eps || 0;
    const growth = data.length > 1 ? ((data[0].revenue - data[1].revenue) / data[1].revenue) * 100 : 0;

    return {
      revenue,
      profit,
      debt: data.map((d: any) => d.totalDebt || 0).reverse(),
      cashFlow: data.map((d: any) => d.operatingCashFlow || 0).reverse(),
      peRatio: metrics.peRatioTTM || 20,
      roe: (metrics.roeTTM || 0.15) * 100,
      eps,
      growth
    };
  } catch (error) {
    console.error("FMP API call failed, falling back to mock:", error);
    return {
      revenue: [15e9, 18e9, 22e9],
      profit: [2.5e9, 3.2e9, 4.1e9],
      debt: [5e9, 4.8e9, 4.2e9],
      cashFlow: [2.8e9, 3.4e9, 4.5e9],
      peRatio: 22.4,
      roe: 18.5,
      eps: 2.15,
      growth: 15.2
    };
  }
}
