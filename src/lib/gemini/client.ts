import { GoogleGenAI } from "@google/genai";

// Timeout por intento: 55s — deja margen para 2–3 intentos dentro del maxDuration=180s de Vercel
export const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  httpOptions: { timeout: 55_000 },
});

// Solo los modelos *-image-preview hacen transformaciones de estilo completas (redesign real)
// gemini-2.5-flash-image NO sirve — hace ediciones superficiales, no remodelaciones
export const MODELS = {
  primary: "gemini-3.1-flash-image-preview",
  fallback1: "gemini-3-pro-image-preview",
} as const;

export type ModelKey = keyof typeof MODELS;
