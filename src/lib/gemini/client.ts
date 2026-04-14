import { GoogleGenAI } from "@google/genai";

// Timeout por intento: 120s — margen amplio con Vercel Pro (300s maxDuration)
export const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  httpOptions: { timeout: 120_000 },
});

// Pro como primary — mayor calidad y precisión siguiendo instrucciones del prompt
// Flash como fallback si Pro falla
export const MODELS = {
  primary: "gemini-3-pro-image-preview",
  fallback1: "gemini-3.1-flash-image-preview",
} as const;

export type ModelKey = keyof typeof MODELS;
