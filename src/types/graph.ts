export interface CompanyResearch {
  overview: string;
  businessModel: string;
  products: string[];
  competitors: string[];
  industry: string;
  strengths: string[];
  weaknesses: string[];
}

export interface FinancialAnalysis {
  revenue: number[];
  profit: number[];
  peRatio: number;
  roe: number;
  debt: number[];
  eps: number;
  cashFlow: number[];
  growth: number;
  score: number;
  reasoning: string;
}

export interface NewsArticle {
  title: string;
  url: string;
  source: string;
  summary: string;
}

export interface NewsAnalysis {
  latestNews: NewsArticle[];
  positiveNews: string[];
  negativeNews: string[];
  summary: string;
  sources: string[];
}

export interface SentimentAnalysis {
  sentimentScore: number;
  positivePercent: number;
  negativePercent: number;
  neutralPercent: number;
  label: string;
}

export interface RiskAnalysis {
  businessRisk: string;
  financialRisk: string;
  marketRisk: string;
  legalRisk: string;
  competitiveRisk: string;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface DecisionData {
  recommendation: 'BUY' | 'HOLD' | 'PASS';
  overallScore: number;
  confidence: number;
  reasoning: string;
  pros: string[];
  cons: string[];
}

export interface ChartData {
  radar: { subject: string; A: number; fullMark: number }[];
  financials: { year: string; revenue: number; profit: number; debt: number; cashFlow: number }[];
  sentiment: { name: string; value: number; color: string }[];
  gauge: number;
}

export interface ReportData {
  summary: string;
  highlights: string[];
  metrics: { label: string; value: string | number }[];
  charts: ChartData;
  sources: string[];
}

export interface GraphState {
  companyName: string;
  research?: CompanyResearch;
  financial?: FinancialAnalysis;
  news?: NewsAnalysis;
  sentiment?: SentimentAnalysis;
  risk?: RiskAnalysis;
  decision?: DecisionData;
  report?: ReportData;
}
