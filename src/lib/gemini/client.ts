import { GoogleGenAI } from "@google/genai";

// Timeout por intento: 120s — margen amplio con Vercel Pro (300s maxDuration)
export const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  httpOptions: { timeout: 120_000 },
});

// Versiones estables (GA). Las "-preview" que se usaban están dadas de baja por Google
// y pueden apagarse sin otro aviso (ver docs de deprecations, 2026-10).
export const MODELS = {
  primary: "gemini-3-pro-image",
  fallback1: "gemini-nano-banana-2.1",
} as const;

// Modelos de texto para el control de calidad (no generan imágenes; baratos)
export const QC_MODELS = ["gemini-3.5-flash", "gemini-2.5-flash"] as const;

export type ModelKey = keyof typeof MODELS;
