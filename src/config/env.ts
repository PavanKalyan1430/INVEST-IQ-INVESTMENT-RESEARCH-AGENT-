export const env = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  TAVILY_API_KEY: process.env.TAVILY_API_KEY || '',
  FMP_API_KEY: process.env.FMP_API_KEY || '',
  FINNHUB_API_KEY: process.env.FINNHUB_API_KEY || '',
  NEWS_API_KEY: process.env.NEWS_API_KEY || '',
  IS_MOCK: process.env.NODE_ENV !== 'production' && !process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY
};

export function validateEnv() {
  if (!env.GEMINI_API_KEY) {
    console.warn("WARNING: GEMINI_API_KEY is not defined. Running in MOCK mode.");
  }
}
