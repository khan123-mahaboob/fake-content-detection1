import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface VerificationResult {
  score: number; // 0 to 100
  rating: 'Reliable' | 'Mixed' | 'Misleading' | 'False' | 'Unverified';
  summary: string;
  reasoning: string;
  sources: { title: string; url: string }[];
}

export async function verifyInformation(content: string): Promise<VerificationResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following information for reliability and potential misinformation. 
    Provide a reliability score (0-100), a rating, a concise summary, and detailed reasoning.
    
    Information to verify:
    "${content}"`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          rating: { type: Type.STRING, enum: ['Reliable', 'Mixed', 'Misleading', 'False', 'Unverified'] },
          summary: { type: Type.STRING },
          reasoning: { type: Type.STRING },
        },
        required: ["score", "rating", "summary", "reasoning"],
      },
    },
  });

  const data = JSON.parse(response.text || "{}");
  
  // Extract URLs from grounding metadata
  const sources: { title: string; url: string }[] = [];
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks) {
    chunks.forEach((chunk: any) => {
      if (chunk.web) {
        sources.push({
          title: chunk.web.title || "Source",
          url: chunk.web.uri,
        });
      }
    });
  }

  return {
    ...data,
    sources,
  };
}
