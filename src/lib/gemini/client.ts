import { GoogleGenAI } from "@google/genai";

export const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const MODELS = {
  // gemini-3-pro-image-preview está en alta demanda (503 frecuentes) — cuando estabilice, volver a ponerlo primero
  primary: "gemini-3.1-flash-image-preview",
  fallback1: "gemini-3-pro-image-preview",
  fallback2: "gemini-2.5-flash-preview-image-generation",
} as const;
