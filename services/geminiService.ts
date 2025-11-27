import { GoogleGenAI, Chat } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `You are a helpful and encouraging AI Study Tutor for a coding community. 
Your goal is to explain complex programming concepts simply, provide code examples, and debug issues.
If context is provided, use it to answer the question. Keep answers concise but informative.`;

export const askGeminiTutor = async (prompt: string, context?: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please provide a valid API key to use the AI Tutor.";
  }

  try {
    const fullPrompt = context 
      ? `Context: ${context}\n\nQuestion: ${prompt}`
      : prompt;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while trying to reach the study assistant.";
  }
};

export const createChatSession = (): Chat | null => {
  if (!apiKey) return null;
  
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    }
  });
};

export const generateQuiz = async (topic: string): Promise<string> => {
  if (!apiKey) return "API Key missing.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a short 3-question quiz about ${topic} in JSON format.`,
      config: {
        responseMimeType: "application/json",
      }
    });
    return response.text || "{}";
  } catch (error) {
    console.error(error);
    return "{}";
  }
};