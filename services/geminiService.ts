
import { GoogleGenAI } from "@google/genai";
import { stripBase64Prefix, getMimeTypeFromBase64 } from "./imageUtils";
import { DesignMode, InteriorStyle, VanType } from "../types";

// Robustly retrieve API Key for different build environments (Vite, Webpack, CRA)
const getApiKey = (): string => {
  let key = '';

  // 1. Try Vite standard (import.meta.env)
  try {
    // @ts-ignore
    if (import.meta && import.meta.env) {
        // @ts-ignore
        if (import.meta.env.VITE_API_KEY) key = import.meta.env.VITE_API_KEY;
        // @ts-ignore
        else if (import.meta.env.API_KEY) key = import.meta.env.API_KEY;
    }
  } catch (e) {}

  // 2. Try Standard process.env
  if (!key) {
    try {
      if (typeof process !== 'undefined' && process.env) {
        if (process.env.API_KEY) key = process.env.API_KEY;
        else if (process.env.REACT_APP_API_KEY) key = process.env.REACT_APP_API_KEY;
      }
    } catch (e) {}
  }

  return key;
};

const getSystemInstruction = () => {
  return `Expert van interior designer. 
  CRITICAL: Maintain exact camera angle/perspective of input. 
  Rear View -> Rear View. Front View -> Front View.
  Output: Photorealistic 8k render.`;
};

const constructPrompt = (mode: DesignMode, type: VanType, style: InteriorStyle) => {
  return `Redesign interior. Type: ${type}. Style: ${style}. Mode: ${mode}.
  Keep viewpoint identical to input. Make it spacious and practical.`;
};

// Helper: Wait function
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateRedesign = async (
  base64Image: string,
  mode: DesignMode,
  type: VanType,
  style: InteriorStyle
): Promise<string[]> => {
  
  const apiKey = getApiKey();
  
  if (!apiKey || apiKey.includes("YOUR_")) {
    throw new Error("API Key missing. Check Netlify settings.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const mimeType = getMimeTypeFromBase64(base64Image);
  const cleanBase64 = stripBase64Prefix(base64Image);
  const prompt = constructPrompt(mode, type, style);

  // Using 'gemini-2.5-flash-image' for general image tasks
  const modelId = 'gemini-2.5-flash-image';
  
  const generateOptions = {
    model: modelId,
    contents: {
      parts: [
        { inlineData: { mimeType: mimeType, data: cleanBase64 } },
        { text: prompt }
      ]
    },
    config: {
      systemInstruction: getSystemInstruction(),
      temperature: 0.7 
    }
  };

  // RETRY LOGIC
  let attempts = 0;
  const maxAttempts = 2; // Reduced attempts to avoid jamming the queue

  while (attempts < maxAttempts) {
    try {
      const response = await ai.models.generateContent(generateOptions);

      // Extract image parts
      const images: string[] = [];
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
             if (part.inlineData && part.inlineData.data) {
                images.push(`data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`);
             }
        }
      }
      
      if (images.length === 0) {
        throw new Error("AI returned no images. Please try a different photo.");
      }

      return images;

    } catch (error: any) {
      console.error(`Gemini Attempt ${attempts + 1} Failed:`, error);
      
      const errorMessage = error.message || "";

      // 1. CHECK FOR EXPLICIT WAIT TIME
      // Example: "Please retry in 53.388717958s."
      const retryMatch = errorMessage.match(/retry in ([0-9.]+)s/);
      if (retryMatch) {
        const secondsToWait = Math.ceil(parseFloat(retryMatch[1]));
        // If the API explicitly tells us to wait, DO NOT retry in the background.
        // It's better to tell the user immediately than to hang the app for 50s.
        throw new Error(`Traffic limit reached. Please wait ${secondsToWait} seconds before trying again.`);
      }

      // 2. CHECK FOR GENERIC 429
      if (error.status === 429 || errorMessage.includes("429") || errorMessage.includes("quota")) {
        // If it's the last attempt, fail
        if (attempts === maxAttempts - 1) {
           throw new Error("Server is busy (High Traffic). Please wait 1 minute.");
        }
        
        // Otherwise, wait a conservative 5 seconds and try once more
        attempts++;
        await wait(5000);
        continue;
      }
      
      // Other errors (400, 401, 500) -> Fail immediately
      if (errorMessage) throw new Error(errorMessage);
      throw error;
    }
  }

  throw new Error("Failed to generate.");
};
