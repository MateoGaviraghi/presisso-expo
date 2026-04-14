import * as fs from "node:fs";
import * as path from "node:path";
import imageSize from "image-size";
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
  politex_negro: [
    "Politex - Negro/Presisso_28022026_02.jpg",
    "Politex - Negro/Presisso_28022026_03.jpg",
    "Politex - Negro/Presisso_28022026_04.jpg",
    "Politex - Negro/Presisso_28022026_05.jpg",
    "Politex - Negro/Presisso_28022026_06.jpg",
    "Politex - Negro/Presisso_28022026_07.jpg",
    "Politex - Negro/Presisso_28022026_08.jpg",
    "Politex - Negro/Presisso_28022026_10.jpg",
    "Politex - Negro/Presisso_28022026_12.jpg",
    "Politex - Negro/Presisso_28022026_13.jpg",
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
  const clientBuf = Buffer.from(clientBuffer);
  const clientBase64 = clientBuf.toString("base64");
  const clientMime = clientRes.headers.get("content-type") || "image/jpeg";

  // 1b. Detectar dimensiones y orientación de la foto del cliente
  let dimensionNote = "";
  try {
    const dims = imageSize(clientBuf);
    if (dims.width && dims.height) {
      const orientation =
        dims.width > dims.height
          ? "LANDSCAPE"
          : dims.width < dims.height
            ? "PORTRAIT"
            : "SQUARE";
      dimensionNote = `\n\nIMAGE 1 DIMENSIONS: ${dims.width}x${dims.height}px — ${orientation}.\nYour output MUST be ${orientation} with the EXACT same aspect ratio (${dims.width}:${dims.height}). Do NOT crop, rotate, or change orientation under any circumstance.`;
      console.log(
        `[Gemini] Foto cliente: ${dims.width}x${dims.height} (${orientation})`,
      );
    }
  } catch {
    console.warn("[Gemini] No se pudo detectar dimensiones de la imagen");
  }

  // 2. Referencias Presisso (cacheadas)
  const refs = loadReferences(tipoCocina);

  // 3. Armar parts: foto cliente + todas las referencias + prompt con dimensiones
  const promptWithDimensions = PROMPTS[tipoCocina] + dimensionNote;

  const parts: {
    inlineData?: { mimeType: string; data: string };
    text?: string;
  }[] = [
    { inlineData: { mimeType: clientMime, data: clientBase64 } },
    ...refs.map((r) => ({ inlineData: { mimeType: r.mime, data: r.base64 } })),
    { text: promptWithDimensions },
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
    promptUsed: promptWithDimensions.substring(0, 500),
    model,
    timeMs: Date.now() - startTime,
  };
}

/* ── Cascade fallback: primary → fallback1 → fallback2 ── */

function is503(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes('"code":503') || msg.includes('"status":"UNAVAILABLE"');
}

// Jitter backoff: base + variación aleatoria para evitar thundering herd
function jitterWait(baseMs: number): Promise<void> {
  const jitter = Math.random() * baseMs * 0.3; // ±30%
  const total = Math.round(baseMs + jitter);
  console.log(`[Gemini] Esperando ${total}ms...`);
  return new Promise((r) => setTimeout(r, total));
}

// 503 backoff: 1 solo reintento rápido (5s) y luego cae al siguiente modelo.
// gemini-3-pro-image-preview funciona bien → no tiene sentido gastar 80s en el modelo roto.
const RETRY_503_WAITS = [5_000];

export async function generateWithFallback(
  fotoUrl: string,
  tipo: PromptType,
): Promise<GenerateResult> {
  const modelKeys = ["primary", "fallback1"] as const;

  for (let i = 0; i < modelKeys.length; i++) {
    const model = MODELS[modelKeys[i]];
    const max503Retries = RETRY_503_WAITS.length; // 3 reintentos por modelo en 503

    let consecutivo503 = 0;

    for (let attempt = 1; attempt <= max503Retries + 1; attempt++) {
      try {
        console.log(`[Gemini] ${model} — intento ${attempt}...`);
        const result = await generateKitchenImage(fotoUrl, tipo, model);
        if (result.success) {
          console.log(`[Gemini] Éxito con ${model} en ${result.timeMs}ms`);
          return result;
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`[Gemini] ${model} (intento ${attempt}) falló: ${msg}`);

        if (is503(err) && consecutivo503 < max503Retries) {
          // 503 = sobrecarga temporal — esperar tiempo creciente y reintentar mismo modelo
          await jitterWait(RETRY_503_WAITS[consecutivo503]);
          consecutivo503++;
          continue;
        }

        // Error definitivo (404, timeout) o se agotaron los reintentos 503
        break;
      }
    }

    // Pausa breve antes de intentar el siguiente modelo
    if (i < modelKeys.length - 1) {
      console.log(`[Gemini] Pasando a modelo fallback...`);
      await jitterWait(2_000);
    }
  }

  return {
    success: false,
    error:
      "Todos los modelos fallaron. Los modelos de generación de imágenes están experimentando alta demanda. Reintentá en unos minutos.",
    timeMs: 0,
  };
}
