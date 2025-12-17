
import { GoogleGenAI } from "@google/genai";
import { stripBase64Prefix, getMimeTypeFromBase64 } from "./imageUtils";
import { DesignMode, InteriorStyle, VanType } from "../types";
import { CONFIG } from "../config";

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

export const generateRedesign = async (
  base64Image: string,
  mode: DesignMode,
  type: VanType,
  style: InteriorStyle
): Promise<string[]> => {
  
  const apiKey = CONFIG.GEMINI_API_KEY;

  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
    throw new Error("API Key is missing or not configured in config.ts");
  }
  
  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  const mimeType = getMimeTypeFromBase64(base64Image);
  const cleanBase64 = stripBase64Prefix(base64Image);
  const prompt = constructPrompt(mode, type, style);

  try {
    // We request 2 variations by making parallel calls since candidateCount isn't always supported for image models
    const modelId = 'gemini-2.5-flash-image';
    
    // Create a promise for a single generation
    const generateSingle = async () => {
      const response = await ai.models.generateContent({
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
      });

      // Extract image parts
      const images: string[] = [];
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
             if (part.inlineData && part.inlineData.data) {
                images.push(`data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`);
             }
        }
      }
      return images;
    };

    // Run 2 generations in parallel
    const results = await Promise.all([generateSingle(), generateSingle()]);
    
    // Flatten array
    return results.flat();

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
