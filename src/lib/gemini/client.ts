import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY no configurada en .env.local");
}

export const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const MODELS = {
  // Gemini 2.5 Flash Preview — edición conversacional de imágenes (principal)
  // REQUIERE billing habilitado en Google Cloud
  geminiFlashImage: "gemini-2.5-flash-preview-image-generation",
  // Imagen 4 — generación text-to-image (fallback)
  // REQUIERE billing habilitado en Google Cloud
  imagen4: "imagen-4.0-generate-001",
} as const;
