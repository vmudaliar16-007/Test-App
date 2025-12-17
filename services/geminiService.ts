
import { GoogleGenAI } from "@google/genai";
import { stripBase64Prefix, getMimeTypeFromBase64 } from "./imageUtils";
import { DesignMode, InteriorStyle, VanType } from "../types";

// Robustly retrieve API Key for different build environments (Vite, Webpack, CRA)
const getApiKey = (): string => {
  let key = '';

  // 1. Try Vite standard (import.meta.env) - Most likely for this stack
  try {
    // @ts-ignore
    if (import.meta && import.meta.env) {
        // @ts-ignore
        if (import.meta.env.VITE_API_KEY) key = import.meta.env.VITE_API_KEY;
        // @ts-ignore
        else if (import.meta.env.API_KEY) key = import.meta.env.API_KEY;
    }
  } catch (e) {}

  // 2. Try Standard process.env (Webpack/Node)
  if (!key) {
    try {
      if (typeof process !== 'undefined' && process.env) {
        if (process.env.API_KEY) key = process.env.API_KEY;
        // Support Create React App style
        else if (process.env.REACT_APP_API_KEY) key = process.env.REACT_APP_API_KEY;
      }
    } catch (e) {}
  }

  // Debug log (masked)
  if (key) {
    console.log("Gemini Service: API Key found (" + key.substring(0, 4) + "...)");
  } else {
    console.warn("Gemini Service: No API Key found in environment variables.");
  }

  return key;
};

const getSystemInstruction = () => {
  return `You are a world-class interior designer specializing in camper vans and RV conversions. 
  Your goal is to generate photorealistic visualization concepts based on user interior photos.
  
  CRITICAL RULE: You must strictly maintain the exact camera angle, perspective, and field of view of the uploaded image. 
  - If the image looks towards the back doors (Rear View), the redesign MUST look towards the back.
  - If the image looks towards the driver's cab (Front View), the redesign MUST look towards the front.
  - If it is a Side View, maintain that side angle.
  
  Do not rotate or shift the camera view. The output must overlay perfectly with the input perspective.
  Focus on spatial efficiency, aesthetics, and practical materials suitable for vehicle interiors.`;
};

const constructPrompt = (mode: DesignMode, type: VanType, style: InteriorStyle) => {
  let modeInstruction = "";
  switch (mode) {
    case DesignMode.EMPTY:
      modeInstruction = "The space is an empty shell. Build a complete layout.";
      break;
    case DesignMode.FULL:
      modeInstruction = "Completely replace the existing furniture and layout with a new design.";
      break;
    case DesignMode.PARTIAL:
      modeInstruction = "Keep the general layout and major structural elements, but update surfaces, textiles, colors, and decor.";
      break;
  }

  return `Redesign this vehicle interior.
  Target Vehicle Type: ${type}.
  Design Style: ${style}.
  Remodel Mode: ${mode}.
  
  Task:
  1. Analyze the input image to determine the viewpoint (e.g., Rear View, Front View, Side View).
  2. Generate a redesign that strictly adheres to this identified viewpoint.
  
  Design Instructions: ${modeInstruction}
  
  Requirements:
  - High quality, photorealistic 8k render.
  - Lighting must match the original photo's environment.
  - Use materials and furniture practical for a moving vehicle.
  - Make it look inviting, spacious, and professional.`;
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
  
  // Strict check
  if (!apiKey || apiKey.includes("YOUR_")) {
    console.error("API Key is missing or invalid. Please check Netlify Environment Variables.");
    throw new Error("API Key missing. Please set VITE_API_KEY in Netlify settings.");
  }

  // Initialize AI
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
        {
          inlineData: {
            mimeType: mimeType,
            data: cleanBase64
          }
        },
        {
          text: prompt
        }
      ]
    },
    config: {
      systemInstruction: getSystemInstruction(),
      temperature: 0.7 
    }
  };

  // RETRY LOGIC: Try up to 3 times with exponential backoff
  let attempts = 0;
  const maxAttempts = 3;
  let lastError: any = null;

  while (attempts < maxAttempts) {
    try {
      console.log(`Attempting generation (${attempts + 1}/${maxAttempts})...`);
      
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
        // If successful API call but no image (content safety filters?), don't retry, just fail.
        console.warn("No images returned. Response text:", response.text);
        throw new Error("The AI could not generate an image for this input. Please try a different photo.");
      }

      return images;

    } catch (error: any) {
      lastError = error;
      console.error(`Gemini API Error (Attempt ${attempts + 1}):`, error);

      // Check for Rate Limits (429) or Server Errors (503)
      if (error.status === 429 || error.status === 503 || (error.message && (error.message.includes("429") || error.message.includes("quota") || error.message.includes("overloaded")))) {
        attempts++;
        if (attempts < maxAttempts) {
          const delay = 2000 * Math.pow(2, attempts - 1); // 2s, 4s, 8s
          console.log(`Waiting ${delay}ms before retry...`);
          await wait(delay);
          continue; // Retry loop
        }
      } else {
        // If it's a 400 (Bad Request) or 401 (Auth), don't retry.
        throw error;
      }
    }
  }

  // If we fell through the loop, we failed.
  if (lastError) {
     if (lastError.status === 429 || (lastError.message && lastError.message.includes("quota"))) {
       throw new Error("High traffic. The free tier daily limit may be reached. Please try again later.");
     }
     if (lastError.message) throw new Error(lastError.message);
  }
  
  throw new Error("Failed to generate image after multiple attempts.");
};
