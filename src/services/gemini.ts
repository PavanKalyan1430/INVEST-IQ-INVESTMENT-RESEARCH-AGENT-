import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import { env } from '../config/env';

let genAI: any = null;

if (env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
}

export async function askGeminiJSON<T>(systemInstruction: string, prompt: string, mockFallback: T): Promise<T> {
  const fullPrompt = systemInstruction + "\n\nInput Data:\n" + prompt;

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
      });

      const result = await model.generateContent({
        contents: [
          { role: 'user', parts: [{ text: fullPrompt }] }
        ],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = result.response.text();
      return JSON.parse(responseText) as T;
    } catch (error) {
      console.error("Gemini API Error, trying Groq fallback:", error);
    }
  }

  if (env.GROQ_API_KEY) {
    try {
      console.log("Using Groq API as fallback...");
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: "You must output strictly valid JSON matching the user's requested schema. Do not include markdown blocks or any other text." },
            { role: 'user', content: fullPrompt }
          ],
          response_format: { type: "json_object" }
        },
        {
          headers: {
            'Authorization': `Bearer ${env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const responseText = response.data.choices[0].message.content;
      return JSON.parse(responseText) as T;
    } catch (error) {
      console.error("Groq API Error, falling back to mock:", error);
    }
  }

  console.warn("Returning mock fallback.");
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate networking
  return mockFallback;
}

export async function validateCompanyQuery(query: string): Promise<{ isValid: boolean; ticker: string | null; correctName: string | null }> {
  const systemInstruction = `You are a financial query parser. Your job is to verify if a user's query represents a real, publicly traded company (either by name, ticker, or close misspelling).
Respond STRICTLY with a JSON object matching this schema:
{
  "isValid": boolean,
  "ticker": "standard stock ticker (e.g. AAPL, TSLA, G4S, META) or null if invalid",
  "correctName": "official company name (e.g. Apple Inc., Tesla, Inc.) or null if invalid"
}
If the query is gibberish, nonsense text, or not a public company, set isValid to false and ticker/correctName to null.`;

  const cleanQuery = query.trim().toUpperCase();
  const mockMapping: Record<string, { ticker: string; correctName: string }> = {
    AAPL: { ticker: 'AAPL', correctName: 'Apple Inc.' },
    APPLE: { ticker: 'AAPL', correctName: 'Apple Inc.' },
    TSLA: { ticker: 'TSLA', correctName: 'Tesla, Inc.' },
    TESLA: { ticker: 'TSLA', correctName: 'Tesla, Inc.' },
    NVDA: { ticker: 'NVDA', correctName: 'NVIDIA Corporation' },
    NVIDIA: { ticker: 'NVDA', correctName: 'NVIDIA Corporation' },
    META: { ticker: 'META', correctName: 'Meta Platforms, Inc.' },
    FACEBOOK: { ticker: 'META', correctName: 'Meta Platforms, Inc.' },
    MSFT: { ticker: 'MSFT', correctName: 'Microsoft Corporation' },
    MICROSOFT: { ticker: 'MSFT', correctName: 'Microsoft Corporation' },
    GOOGL: { ticker: 'GOOGL', correctName: 'Alphabet Inc.' },
    GOOGLE: { ticker: 'GOOGL', correctName: 'Alphabet Inc.' },
    AMZN: { ticker: 'AMZN', correctName: 'Amazon.com, Inc.' },
    AMAZON: { ticker: 'AMZN', correctName: 'Amazon.com, Inc.' },
    G4S: { ticker: 'G4S', correctName: 'G4S plc' }
  };

  const mockFallback = mockMapping[cleanQuery] 
    ? { isValid: true, ticker: mockMapping[cleanQuery].ticker, correctName: mockMapping[cleanQuery].correctName }
    : { isValid: false, ticker: null, correctName: null };

  return askGeminiJSON<{ isValid: boolean; ticker: string | null; correctName: string | null }>(
    systemInstruction,
    `Query: "${query}"`,
    mockFallback
  );
}
