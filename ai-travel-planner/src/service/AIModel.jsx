import { GoogleGenerativeAI } from "@google/generative-ai";

const USE_OLLAMA = import.meta.env.VITE_USE_OLLAMA === 'true';
const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434';

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;

let chatSession;

if (USE_OLLAMA) {
  const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'llama3';
  
  chatSession = {
    sendMessage: async (message) => {
      const response = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt: message + "\n\nRespond ONLY with valid JSON. No markdown formatting.",
          stream: false,
          format: 'json'
        })
      });
      const data = await response.json();
      return {
        response: {
          text: () => data.response
        }
      };
    }
  };
} else {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };

  chatSession = model.startChat({
    generationConfig,
    history: [],
  });
}

export { chatSession };