import { GoogleGenAI, Type } from "@google/genai";
import { VideoMetadata } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
  You are an advanced AI cinema and visual analyst. 
  Your task is to analyze media content—including traditional films, still photography, concept art, surrealist art, and AI-generated experimental videos—and return a structured JSON report.
  
  SPECIAL INSTRUCTIONS:
  - If the input is a **Still Image**:
    - Set 'technical.duration' to "00:00:00".
    - Set 'technical.frameRate' to "Still".
    - Analyze the 'narrative.scenes' as a single scene describing the frozen moment.
    - Focus heavily on composition, rule of thirds, leading lines, and static lighting.
  
  - If the input is **Abstract/Surreal**:
    - Describe visual transformations or static distortions in 'visuals' and 'aesthetic'.
    - If no characters exist, use 'narrative.characters' for recurring motifs.
    - Leave dialogues empty if not applicable.
  
  - Focus heavily on lighting, color palette, and the "uncanny" nature of AI-generated content if detected.
  - Do not refuse analysis if the content is unconventional or non-narrative.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    technical: {
      type: Type.OBJECT,
      properties: {
        duration: { type: Type.STRING },
        quality: { type: Type.STRING },
        aspectRatio: { type: Type.STRING },
        frameRate: { type: Type.STRING },
      },
    },
    aesthetic: {
      type: Type.OBJECT,
      properties: {
        style: { type: Type.ARRAY, items: { type: Type.STRING } },
        genre: { type: Type.ARRAY, items: { type: Type.STRING } },
        mood: { type: Type.STRING },
      },
    },
    environment: {
      type: Type.OBJECT,
      properties: {
        timeOfDay: { type: Type.STRING },
        season: { type: Type.STRING },
        weather: { type: Type.STRING },
        locationType: { type: Type.STRING },
        locationDescription: { type: Type.STRING },
      },
    },
    visuals: {
      type: Type.OBJECT,
      properties: {
        lighting: { type: Type.ARRAY, items: { type: Type.STRING } },
        shotTypes: { type: Type.ARRAY, items: { type: Type.STRING } },
        cameraMovement: { type: Type.ARRAY, items: { type: Type.STRING } },
        focus: { type: Type.STRING },
        lens: { type: Type.STRING },
        colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
        crowdDensity: { type: Type.STRING },
      },
    },
    narrative: {
      type: Type.OBJECT,
      properties: {
        characters: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              appearance: { type: Type.STRING },
              costume: { type: Type.STRING },
              voice: { type: Type.STRING },
              role: { type: Type.STRING },
            },
          },
        },
        scenes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              header: { type: Type.STRING },
              description: { type: Type.STRING },
              dialogues: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    characterId: { type: Type.STRING },
                    characterName: { type: Type.STRING },
                    emotion: { type: Type.STRING },
                    text: { type: Type.STRING },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const waitForFileProcessing = async (fileName: string) => {
  let state = 'PROCESSING';
  while (state === 'PROCESSING') {
    await new Promise(r => setTimeout(r, 5000));
    const fileInfo = await ai.files.get({ name: fileName });
    state = fileInfo.state || 'ACTIVE';
    if (state === 'FAILED') throw new Error('Video processing failed in Gemini.');
  }
};

export const analyzeMediaContent = async (
  file: File,
  mimeType: string,
  onProgress?: (msg: string) => void
): Promise<VideoMetadata> => {
  try {
    let mediaPart;
    const isImage = mimeType.startsWith('image/');
    const isLargeFile = file.size > 5 * 1024 * 1024; // 5MB

    if (isImage && !isLargeFile) {
      if (onProgress) onProgress("Encoding image...");
      const base64EncodedDataPromise = new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
      });
      mediaPart = {
          inlineData: { data: await base64EncodedDataPromise as string, mimeType },
      };
    } else {
      if (onProgress) onProgress("Uploading file to Gemini...");
      
      const uploadedFile = await ai.files.upload({
        file: file,
        config: {
          mimeType: mimeType || 'application/octet-stream',
          displayName: file.name || 'uploaded_media'
        }
      });
      
      if (!uploadedFile.name || !uploadedFile.uri) {
        throw new Error("Failed to retrieve file metadata from Gemini.");
      }

      if (onProgress) onProgress("Processing media...");
      await waitForFileProcessing(uploadedFile.name);
      
      mediaPart = {
        fileData: {
          fileUri: uploadedFile.uri,
          mimeType: uploadedFile.mimeType || mimeType
        }
      };
    }

    if (onProgress) onProgress("Analyzing content...");
    const promptText = isImage 
        ? "Analyze this still image. Provide a comprehensive structured report based on its visual composition, lighting, characters, and environment."
        : "Analyze this video. It may be abstract, surreal, or AI-generated. Provide a comprehensive structured report based on its visual and conceptual properties.";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: {
        parts: [
            mediaPart,
            { text: promptText }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) throw new Error("The AI model returned an empty response. This might be due to safety filters or processing constraints.");
    
    return JSON.parse(text) as VideoMetadata;
  } catch (error: any) {
    console.error("KinoLOG Analysis Error:", error);
    if (error.message?.includes('429')) throw new Error("Rate limit exceeded. Please wait a moment.");
    if (error.message?.includes('safety')) throw new Error("The content was flagged by safety filters. Surreal or anatomical art can sometimes trigger this incorrectly.");
    throw new Error(error.message || "Failed to analyze media.");
  }
};