import * as fs from "node:fs";
import * as path from "node:path";
import imageSize from "image-size";
import { genAI, MODELS } from "./client";
import { PROMPTS, type PromptType } from "./prompts-rediseno";
import { DESIGN_PROMPTS, CLEAN_PROMPT } from "./prompts-diseno";

export type ModoSolicitud = "rediseno" | "diseno";

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
    "politex-negro/Presisso_28022026_12.jpg",
    "politex-negro/Presisso_28022026_03.jpg",
    "politex-negro/Presisso_28022026_04.jpg",
    "politex-negro/Presisso_28022026_05.jpg",
    "politex-negro/Presisso_28022026_06.jpg",
    "politex-negro/Presisso_28022026_08.jpg",
    "politex-negro/Presisso_28022026_10.jpg",
    "politex-negro/Presisso_28022026_13.jpg",
  ],
  melamina_litio: [
    // Full kitchen view (best overall reference), medium detail, artistic close-up
    "melamina-litio/MPucci_Presisso_20210323_082.jpg",
    "melamina-litio/MPucci_Presisso_20210323_085.jpg",
    "melamina-litio/MPucci_Presisso_20210323_009.jpg",
    // Removed 036__ and 070: extreme close-ups of hardware/base, not useful for material color
  ],
  politex_gris_grafito: [
    "politex-gris-grafito/IMG_7549-Pano.jpg.jpg",
    "politex-gris-grafito/IMG_7552-Pano.jpg.jpg",
    "politex-gris-grafito/IMG_7554.jpg.jpg",
    "politex-gris-grafito/IMG_7555.jpg.jpg",
    "politex-gris-grafito/IMG_7571-Pano.jpg 2.jpg",
    "politex-gris-grafito/Cocinas mayo 233.png",
    // Close-ups showing countertop stone texture (different from cabinet color)
    "politex-gris-grafito/Screenshot 2026-04-15 181648.png",
    "politex-gris-grafito/Screenshot 2026-04-15 181657.png",
    "politex-gris-grafito/Screenshot 2026-04-15 181705.png",
  ],
  melamina_grafito_scotch: [
    "melamina-grafito-scotch/DSC05054.jpg",
    "melamina-grafito-scotch/DSC05162.jpg",
    "melamina-grafito-scotch/DSC05029.jpg",
    "melamina-grafito-scotch/DSC05114.jpg",
    "melamina-grafito-scotch/DSC05058.jpg",
    "melamina-grafito-scotch/DSC05077.jpg",
    "melamina-grafito-scotch/DSC05080.jpg",
    "melamina-grafito-scotch/DSC05089.jpg",
  ],
  polimero_blanco_gloss: [
    // Full kitchen view (best overall reference for layout + material context)
    "polimero-tactil-white-gloss/IMG_2317.jpeg",
    // Close-ups of high-gloss door surfaces showing specular highlights & reflections
    "polimero-tactil-white-gloss/IMG_2320.jpeg",
    "polimero-tactil-white-gloss/IMG_2323.jpeg",
    "polimero-tactil-white-gloss/IMG_2324.jpeg",
    "polimero-tactil-white-gloss/IMG_2319.jpeg",
    "polimero-tactil-white-gloss/IMG_2321.jpeg",
    "polimero-tactil-white-gloss/IMG_2322.jpeg",
    "polimero-tactil-white-gloss/IMG_2325.jpeg",
    // Close-ups of PRESTONE Rose sintered-stone countertop (golden-copper veining)
    "polimero-tactil-white-gloss/IMG_2318.jpeg",
    "polimero-tactil-white-gloss/IMG_2327.jpeg",
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

/* ── Helper: find closest supported aspect ratio ── */

const SUPPORTED_RATIOS = [
  { label: "1:1",  value: 1 },
  { label: "4:5",  value: 4 / 5 },
  { label: "5:4",  value: 5 / 4 },
  { label: "3:4",  value: 3 / 4 },
  { label: "4:3",  value: 4 / 3 },
  { label: "2:3",  value: 2 / 3 },
  { label: "3:2",  value: 3 / 2 },
  { label: "9:16", value: 9 / 16 },
  { label: "16:9", value: 16 / 9 },
  { label: "21:9", value: 21 / 9 },
];

function closestAspectRatio(width: number, height: number): string | undefined {
  if (!width || !height) return undefined;
  const ratio = width / height;
  let best = SUPPORTED_RATIOS[0];
  let bestDiff = Math.abs(ratio - best.value);
  for (const r of SUPPORTED_RATIOS) {
    const diff = Math.abs(ratio - r.value);
    if (diff < bestDiff) {
      best = r;
      bestDiff = diff;
    }
  }
  console.log(`[Gemini] Foto ${width}x${height} (ratio ${ratio.toFixed(3)}) → API aspectRatio: ${best.label}`);
  return best.label;
}

/* ── Helper: single Gemini call ── */

async function callGemini(
  model: string,
  parts: { inlineData?: { mimeType: string; data: string }; text?: string }[],
  aspectRatio?: string,
): Promise<string> {
  const response = await genAI.models.generateContent({
    model,
    contents: [{ role: "user", parts }],
    config: {
      responseModalities: ["image", "text"],
      ...(aspectRatio ? { imageConfig: { aspectRatio } } : {}),
    },
  });

  const responseParts = response.candidates?.[0]?.content?.parts as
    | InlinePart[]
    | undefined;
  const imagePart = responseParts?.find((p) => p.inlineData?.data);

  if (!imagePart?.inlineData?.data) {
    throw new Error("Gemini no devolvió imagen en la respuesta");
  }
  return imagePart.inlineData.data;
}

/* ── Build dimension note from image buffer ── */

interface DimensionInfo {
  width: number;
  height: number;
  orientation: string;
  apiAspectRatio?: string;
  promptNote: string;
}

function getDimensionInfo(buf: Buffer): DimensionInfo {
  try {
    const dims = imageSize(buf);
    if (dims.width && dims.height) {
      const orientation =
        dims.width > dims.height
          ? "LANDSCAPE"
          : dims.width < dims.height
            ? "PORTRAIT"
            : "SQUARE";
      const apiAspectRatio = closestAspectRatio(dims.width, dims.height);
      console.log(
        `[Gemini] Foto cliente: ${dims.width}x${dims.height} (${orientation})`,
      );
      return {
        width: dims.width,
        height: dims.height,
        orientation,
        apiAspectRatio,
        promptNote: `\n\nThe input photo is ${dims.width}×${dims.height}px (${orientation}). Your output must match this exact aspect ratio and orientation. Do not crop, zoom, or reframe.`,
      };
    }
  } catch {
    console.warn("[Gemini] No se pudo detectar dimensiones de la imagen");
  }
  return { width: 0, height: 0, orientation: "UNKNOWN", promptNote: "" };
}

/* ── Download client photo ── */

async function downloadClientPhoto(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error descargando foto del cliente: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return {
    base64: buf.toString("base64"),
    mime: res.headers.get("content-type") || "image/jpeg",
    buffer: buf,
  };
}

/* ── Main generation (supports 1-step rediseño and 2-step diseño) ── */

async function generateKitchenImage(
  fotoOriginalUrl: string,
  tipoCocina: PromptType,
  model: string,
  modo: ModoSolicitud = "rediseno",
): Promise<GenerateResult> {
  const startTime = Date.now();

  // 1. Descargar foto del cliente
  const client = await downloadClientPhoto(fotoOriginalUrl);
  const dimInfo = getDimensionInfo(client.buffer);
  const clientPart = { inlineData: { mimeType: client.mime, data: client.base64 } };

  // 2. Referencias Presisso (cacheadas)
  const refs = loadReferences(tipoCocina);
  const refParts = refs.map((r) => ({ inlineData: { mimeType: r.mime, data: r.base64 } }));

  let imageBase64: string;
  let promptUsed: string;

  if (modo === "diseno") {
    // ── DESIGN MODE: 2-step process ──
    // Step 1: Clean the photo (no refs needed — just the photo + clean prompt)
    console.log(`[Gemini] Diseño paso 1/2: limpiando foto con ${model}...`);
    const cleanPrompt = CLEAN_PROMPT + dimInfo.promptNote;
    const cleanedBase64 = await callGemini(model, [
      clientPart,
      { text: cleanPrompt },
    ], dimInfo.apiAspectRatio);
    console.log(`[Gemini] Paso 1 completado — foto limpia obtenida`);

    // Step 2: Insert furniture into the CLEANED photo
    console.log(`[Gemini] Diseño paso 2/2: insertando muebles con ${model}...`);
    const cleanedPart = { inlineData: { mimeType: "image/png", data: cleanedBase64 } };
    const designPrompt = DESIGN_PROMPTS[tipoCocina] + dimInfo.promptNote;
    imageBase64 = await callGemini(model, [
      cleanedPart,
      ...refParts,
      cleanedPart,
      { text: designPrompt },
    ], dimInfo.apiAspectRatio);
    promptUsed = `[2-step] CLEAN + ${designPrompt.substring(0, 400)}`;
  } else {
    // ── REDESIGN MODE: 1-step (bookended — last image locks output dimensions) ──
    const redesignPrompt = PROMPTS[tipoCocina] + dimInfo.promptNote;
    imageBase64 = await callGemini(model, [
      clientPart,
      ...refParts,
      clientPart,
      { text: redesignPrompt },
    ], dimInfo.apiAspectRatio);
    promptUsed = redesignPrompt.substring(0, 500);
  }

  return {
    success: true,
    imageBase64,
    promptUsed,
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
  modo: ModoSolicitud = "rediseno",
): Promise<GenerateResult> {
  const modelKeys = ["primary", "fallback1"] as const;

  for (let i = 0; i < modelKeys.length; i++) {
    const model = MODELS[modelKeys[i]];
    const max503Retries = RETRY_503_WAITS.length; // 3 reintentos por modelo en 503

    let consecutivo503 = 0;

    for (let attempt = 1; attempt <= max503Retries + 1; attempt++) {
      try {
        console.log(`[Gemini] ${model} — intento ${attempt}...`);
        const result = await generateKitchenImage(fotoUrl, tipo, model, modo);
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
