import * as fs from "node:fs";
import * as path from "node:path";
import { genAI, MODELS } from "./client";
import { PROMPTS, PromptType } from "./prompts";

export interface GenerateResult {
  success: boolean;
  imageBase64?: string;
  promptUsed?: string;
  model?: string;
  timeMs?: number;
  error?: string;
}

/* ── Caché de imágenes de referencia (se leen una sola vez del disco) ── */

type RefEntry = { base64: string; mime: string };

const REFERENCE_FILES: Record<PromptType, string[]> = {
  moderna: ["cocina-moderna-presisso.jpg"],
  premium: [
    "modelo-premiun/Presisso_28022026_02.jpg",
    "modelo-premiun/Presisso_28022026_03.jpg",
    "modelo-premiun/Presisso_28022026_04.jpg",
    "modelo-premiun/Presisso_28022026_05.jpg",
    "modelo-premiun/Presisso_28022026_06.jpg",
    "modelo-premiun/Presisso_28022026_07.jpg",
    "modelo-premiun/Presisso_28022026_08.jpg",
    "modelo-premiun/Presisso_28022026_10.jpg",
    "modelo-premiun/Presisso_28022026_12.jpg",
    "modelo-premiun/Presisso_28022026_13.jpg",
  ],
};

const referenceCache = new Map<string, RefEntry[]>();

function loadReferences(tipo: PromptType): RefEntry[] {
  if (referenceCache.has(tipo)) return referenceCache.get(tipo)!;

  const entries = REFERENCE_FILES[tipo].map((file) => {
    const refPath = path.join(process.cwd(), "public", file);
    const buf = fs.readFileSync(refPath);
    return { base64: buf.toString("base64"), mime: "image/jpeg" };
  });
  referenceCache.set(tipo, entries);
  console.log(
    `[Gemini] Cargadas ${entries.length} fotos de referencia para "${tipo}"`,
  );
  return entries;
}

/* ── Generación con un modelo específico ── */

type InlinePart = { inlineData?: { data?: string; mimeType?: string } };

async function generateKitchenImage(
  fotoOriginalUrl: string,
  tipoCocina: PromptType,
  model: string,
): Promise<GenerateResult> {
  const startTime = Date.now();

  // 1. Descargar foto del cliente
  const clientRes = await fetch(fotoOriginalUrl);
  if (!clientRes.ok) {
    throw new Error(`Error descargando foto del cliente: ${clientRes.status}`);
  }
  const clientBuffer = await clientRes.arrayBuffer();
  const clientBase64 = Buffer.from(clientBuffer).toString("base64");
  const clientMime = clientRes.headers.get("content-type") || "image/jpeg";

  // 2. Referencias Presisso (cacheadas)
  const refs = loadReferences(tipoCocina);

  // 3. Armar parts: foto cliente + todas las referencias + prompt
  const parts: {
    inlineData?: { mimeType: string; data: string };
    text?: string;
  }[] = [
    { inlineData: { mimeType: clientMime, data: clientBase64 } },
    ...refs.map((r) => ({ inlineData: { mimeType: r.mime, data: r.base64 } })),
    { text: PROMPTS[tipoCocina] },
  ];

  // 4. Llamar a Gemini con foto del cliente + referencias + prompt
  const response = await genAI.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts,
      },
    ],
    config: {
      responseModalities: ["image", "text"],
    },
  });

  // 5. Extraer imagen generada
  const responseParts = response.candidates?.[0]?.content?.parts as
    | InlinePart[]
    | undefined;
  const imagePart = responseParts?.find((p) => p.inlineData?.data);

  if (!imagePart?.inlineData?.data) {
    throw new Error("Gemini no devolvió imagen en la respuesta");
  }

  return {
    success: true,
    imageBase64: imagePart.inlineData.data,
    promptUsed: PROMPTS[tipoCocina].substring(0, 500),
    model,
    timeMs: Date.now() - startTime,
  };
}

/* ── Cascade fallback: primary → fallback1 → fallback2 ── */

export async function generateWithFallback(
  fotoUrl: string,
  tipo: PromptType,
): Promise<GenerateResult> {
  const modelKeys = ["primary", "fallback1", "fallback2"] as const;

  for (let i = 0; i < modelKeys.length; i++) {
    const model = MODELS[modelKeys[i]];
    try {
      console.log(`[Gemini] Intento con modelo ${model}...`);
      const result = await generateKitchenImage(fotoUrl, tipo, model);
      if (result.success) {
        console.log(`[Gemini] Éxito con ${model} en ${result.timeMs}ms`);
        return result;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const detail = err instanceof Error && (err as { status?: number }).status
        ? ` (HTTP ${(err as { status?: number }).status})`
        : "";
      console.warn(`[Gemini] ${model} falló: ${msg}${detail}`);

      if (i < modelKeys.length - 1) {
        const waitMs = 1000 * Math.pow(2, i);
        console.log(
          `[Gemini] Esperando ${waitMs}ms antes del siguiente modelo...`,
        );
        await new Promise((r) => setTimeout(r, waitMs));
      }
    }
  }

  return {
    success: false,
    error: "Todos los modelos fallaron",
    timeMs: 0,
  };
}
