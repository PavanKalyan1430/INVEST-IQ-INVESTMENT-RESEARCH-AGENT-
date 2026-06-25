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
