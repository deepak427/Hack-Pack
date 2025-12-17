import { GoogleGenAI } from "@google/genai";
import { Hackathon } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateHackathonIdeas = async (hackathon: Hackathon): Promise<string> => {
  try {
    const prompt = `
      I am participating in a hackathon titled "${hackathon.title}".
      The deadline is ${new Date(hackathon.deadline).toLocaleDateString()}.
      
      Please generate 3 winning project ideas for this hackathon.
      For each idea, provide:
      1. A catchy project name.
      2. A brief description of the problem it solves.
      3. A recommended tech stack (Frontend, Backend, AI, Database).
      4. A "Wow Factor" feature that will impress judges.

      Format the output in clean Markdown.
      Keep the tone encouraging and professional.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster ideation
      }
    });

    return response.text || "Could not generate ideas at this time.";
  } catch (error) {
    console.error("Error generating ideas:", error);
    return "Error connecting to AI service. Please check your API key.";
  }
};