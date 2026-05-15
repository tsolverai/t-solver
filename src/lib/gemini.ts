import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const getApiKey = () => {
  // Use the env var that the build system replaces
  const key = typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : null;
  if (key && key !== "undefined") return key;

  // Fallback to VITE_ prefixed one for standard Vite/Vercel deployments
  const viteKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (viteKey && viteKey !== "undefined") return viteKey;

  // Hardcoded fallback provided by user
  return "AIzaSyAcFsGqTLTrSIgNvm1C7ID60cYkqxaBg1U";
};

const apiKey = getApiKey();
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function askTSolver(prompt: string, imageBase64?: string, useThinking: boolean = false, mode: string = 'general', userLevel?: string) {
  if (!ai) {
    console.error("Gemini API Key is missing. Please set GEMINI_API_KEY in your environment variables.");
    throw new Error("API_KEY_MISSING");
  }

  try {
    const isImageGen = /generate image|create image|draw|image of|photo of|ছবির|ছবি তৈরি করো/i.test(prompt);
    
    let systemInstruction = `You are T-Solver AI Teacher, a world-class educational AI developed by Tachin Ahmed Rion.
    Developer Info:
    - Name: Tachin Ahmed Rion (তাছিন আহমেদ রিয়ন)
    - Identity: Owner & CEO of Vintorex Group, AI Architect, T-Solver Founder.
    
    Pedagogical Goals:
    - Act as an encouraging, patient teacher.
    - Don't just give answers; explain the "why" and "how".
    - Ask questions back to the student to ensure they understand.
    - Give hints if they are stuck.
    - Adapt difficulty based on the provided student level: ${userLevel || 'General'}.
    - If level is 'School', use very simple analogies. If 'University', provide depth and research-level insights.
    - Use LaTeX for all math.
    - Support both English and Bengali seamlessly.`;
    
    if (mode === 'math') {
      systemInstruction += " Use LaTeX for mathematical expressions and provide step-by-step solutions.";
    } else if (mode === 'business') {
      systemInstruction += " Provide professional business insights, data analysis, and strategic advice.";
    } else if (mode === 'education') {
      systemInstruction += " Act as an expert educator, explaining complex concepts in simple terms suitable for students.";
    }

    if (isImageGen) {
      systemInstruction = "You are an AI image generator. Create high quality visual content based on user descriptions.";
    }

    const parts: any[] = [{ text: prompt }];
    
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/png",
          data: imageBase64.split(',')[1] || imageBase64
        }
      });
    }

    const model = isImageGen ? "gemini-2.5-flash-image" : (useThinking ? "gemini-3.1-pro-preview" : "gemini-3-flash-preview");
    const config: any = {
      systemInstruction
    };
    
    if (useThinking && !isImageGen) {
      config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
    }
    
    if (isImageGen) {
      config.imageConfig = { aspectRatio: "1:1" };
    }

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config
    });

    if (isImageGen) {
      // Find the image part
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `__IMAGE__data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    return response.text || "";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to connect to T-Solver AI. Please check your connection.");
  }
}
