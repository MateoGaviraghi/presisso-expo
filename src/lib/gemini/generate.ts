import * as fs from "node:fs";
import * as path from "node:path";
import imageSize from "image-size";
import { genAI, MODELS } from "./client";
import { isOwnOriginalPhotoUrl } from "@/lib/security";
import { PROMPTS, CLEAN_EXISTING_PROMPT, MATERIALS, buildRefinePrompt, type PromptType } from "./prompts-rediseno";
import { buildColorGuide, swatchParts } from "./color-guide";
import { verifyRedesign, describeStructure, structureNote, originalFurnitureMask, addedFurnitureRatio, withFurnitureCheck, type QcResult } from "./verify";
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
    // Muestra oficial (presisso.com.ar/productos/materiales) primero: es la autoridad del color
    "materiales-oficiales/frentes-politex-negro.jpg",
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
    "materiales-oficiales/frentes-melaminas-metalicos-litio.jpg", // muestra oficial: "Metálicos: Litio"
    "materiales-oficiales/mesadas-cuarzo-blanco-puro.jpg", // mesada blanca
    // Foto oficial de la Línea Siena (presisso.com.ar/productos/cocinas): el color de referencia
    "melamina-litio/linea-siena-presisso.jpg",
    // Full kitchen view (best overall reference), medium detail, artistic close-up
    "melamina-litio/MPucci_Presisso_20210323_082.jpg",
    "melamina-litio/MPucci_Presisso_20210323_085.jpg",
    "melamina-litio/MPucci_Presisso_20210323_009.jpg",
    "melamina-litio/MPucci_Presisso_20210323_081.jpg", // frentes bajos con mesada blanca, luz pareja
    "melamina-litio/MPucci_Presisso_20210323_011.jpg", // cajón con perfil de aluminio
    "melamina-litio/MPucci_Presisso_20210323_047.jpg", // mesada blanca
    // Removed 036__ and 070: extreme close-ups of hardware/base, not useful for material color
  ],
  politex_gris_grafito: [
    "materiales-oficiales/frentes-politex-grafito.jpg", // muestra oficial del frente
    "materiales-oficiales/mesadas-cuarzo-gris-cemento.jpg", // mesada oficial: Cuarzo Gris Cemento (Línea Milán)
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
    "materiales-oficiales/frentes-melaminas-lisos-grafito.jpg", // muestra oficial grafito
    "materiales-oficiales/frentes-melaminas-blend-scotch.jpg", // muestra oficial nogal Scotch
    // Solo primeros planos del material: las fotos de cocina entera tienen las alacenas en dos filas
    // y el modelo copiaba esa distribución (agregaba filas y muebles que el cliente no tiene).
    "melamina-grafito-scotch/DSC05119.jpg", // cajones grafito
    "melamina-grafito-scotch/DSC05089.jpg", // nogal
    "melamina-grafito-scotch/DSC05102.jpg", // nogal, canto
    "melamina-grafito-scotch/DSC05114.jpg", // mesada con vetas + lateral grafito
    "melamina-grafito-scotch/DSC05029.jpg", // mesada, textura
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
  // Segunda barrera anti-SSRF: solo fotos de nuestro bucket, sin seguir redirecciones
  if (!isOwnOriginalPhotoUrl(url)) throw new Error("URL de foto del cliente no permitida");
  const res = await fetch(url, { redirect: "error" });
  if (!res.ok) throw new Error(`Error descargando foto del cliente: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return {
    base64: buf.toString("base64"),
    mime: res.headers.get("content-type") || "image/jpeg",
    buffer: buf,
  };
}

/* ── Main generation (supports 1-step rediseño and 2-step diseño) ── */

export async function generateKitchenImage(
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
    // ── REDESIGN MODE: 2-step process + quality control ──
    // Un cambio grande por pedido: en un solo paso el modelo priorizaba "no tocar nada"
    // y dejaba todo el desorden. El paso 2 recibe también la ORIGINAL como referencia
    // de estructura: si la limpieza borra un mueble (pasó con una isla), el paso 2 lo repone.
    const mat = MATERIALS[tipoCocina];
    // El control recibe el material completo (incluye reglas de dos tonos y filas de alacenas)
    const materialSummary = [mat.finish, mat.apply, `Handles: ${mat.handles}`].join("\n");
    const redesignPrompt = PROMPTS[tipoCocina] + dimInfo.promptNote;
    // Dónde hay muebles en la original: se calcula una sola vez, en paralelo con la generación
    const originalMask = originalFurnitureMask(clientPart);
    // Inventario de muebles fijos de la original (texto), también en paralelo: va a los pasos 2 y 3
    const structure = describeStructure(clientPart).then(structureNote);

    // Un resultado que agrega muebles pierde siempre contra uno que no, aunque tenga peor color
    const score = (qc: QcResult) => (qc.addsFurniture ? 1000 : 0) + (qc.ok ? 0 : 1 + qc.problems.length);

    const runOnce = async (): Promise<{ image: string; qc: QcResult; guided: boolean }> => {
      console.log(`[Gemini] Rediseño paso 1/2: limpiando foto con ${model}...`);
      const cleanedBase64 = await callGemini(model, [
        clientPart,
        { text: CLEAN_EXISTING_PROMPT + dimInfo.promptNote },
      ], dimInfo.apiAspectRatio);

      console.log(`[Gemini] Rediseño paso 2/2: aplicando material con ${model}...`);
      const cleanedPart = { inlineData: { mimeType: "image/png", data: cleanedBase64 } };
      const reskinned = await callGemini(model, [
        clientPart,
        cleanedPart,
        { text: `The next images are the REFERENCE PHOTOS of Presisso "${mat.name}". The first ones are OFFICIAL COLOR SWATCHES (flat, evenly lit samples of the real material): they are the authority for color and texture. Copy the door and countertop colors from them, adjusted only for the client's room light.` },
        ...refParts,
        cleanedPart,
        { text: redesignPrompt + (await structure) },
      ], dimInfo.apiAspectRatio);

      // Paso 3 (materiales con muestra oficial): boceto de color interno + render final de la IA.
      // El boceto nunca llega al cliente; la imagen final la genera el modelo de imagen.
      let image = reskinned;
      let guided = false;
      if (mat.colorGuide) {
        const guide = await buildColorGuide(reskinned, mat.colorGuide);
        if (guide) {
          console.log(`[Gemini] Rediseño paso 3/3: render final con guía de color (${model})...`);
          try {
            // La imagen del paso 2 va como IMAGE 4 (estructura): sin ella, en paredes vacías inventaba
            // alacenas y columnas. La original copiaba sus imanes y objetos; la foto limpia, su
            // mesada vieja. La del paso 2 ya tiene el material nuevo y es la base del boceto.
            image = await callGemini(model, [
              { inlineData: { mimeType: "image/png", data: guide } },
              ...swatchParts(mat.colorGuide),
              { inlineData: { mimeType: "image/png", data: reskinned } },
              { text: buildRefinePrompt(mat) + (await structure) + dimInfo.promptNote },
            ], dimInfo.apiAspectRatio);
            guided = true;
          } catch (err) {
            console.warn("[Gemini] Render final falló, se usa la imagen sin guía:", err instanceof Error ? err.message : err);
          }
        }
      }

      const check = async (img: string) => {
        const [qc, ratio] = await Promise.all([
          verifyRedesign(
            refParts.slice(0, 3),
            clientPart,
            { inlineData: { mimeType: "image/png", data: img } },
            mat.name,
            materialSummary,
          ),
          originalMask.then((m) => addedFurnitureRatio(m, img)),
        ]);
        console.log(`[QC muebles] ${ratio === null ? "no se pudo medir" : `${(ratio * 100).toFixed(1)} % de la foto con muebles nuevos`}`);
        return withFurnitureCheck(qc, ratio);
      };
      const qc = await check(image);
      console.log(`[QC] ${qc.checked ? (qc.ok ? "OK" : "FALLA: " + qc.problems.join(" | ")) : "no se pudo correr"}`);

      // Si el render con guía rompió la estructura (p. ej. inventó muebles) y la imagen sin guía
      // sale mejor en el control, se entrega la imagen sin guía.
      if (guided && !qc.ok) {
        const qcPlain = await check(reskinned);
        console.log(`[QC sin guía] ${qcPlain.ok ? "OK" : "FALLA: " + qcPlain.problems.join(" | ")}`);
        if (score(qcPlain) < score(qc)) {
          return { image: reskinned, qc: qcPlain, guided: false };
        }
      }
      return { image, qc, guided };
    };

    // Si el control de calidad falla, se regenera UNA vez y se queda el intento con menos problemas.
    // Con la guía de color cada intento tarda más: solo se reintenta si queda tiempo dentro del límite.
    let best = await runOnce();
    let attempts = 1;
    const elapsedMs = Date.now() - startTime;
    // 120 s: un intento completo con guía y controles tardó hasta ~160 s (283 s en total con reintento)
    if (!best.qc.ok && elapsedMs < 120_000) {
      // Un error en el reintento (p. ej. 503 por demanda) no tira el primer resultado
      try {
        const second = await runOnce();
        attempts = 2;
        if (score(second.qc) < score(best.qc)) best = second;
      } catch (err) {
        console.warn("[Gemini] El reintento falló, se queda el primer resultado:", err instanceof Error ? err.message : err);
      }
    }
    imageBase64 = best.image;
    const qcTag = !best.qc.checked ? "QC sin correr" : best.qc.ok ? "QC ok" : `QC con problemas: ${best.qc.problems.join(" | ")}`;
    promptUsed = `[${best.guided ? "3-step guía de color" : "2-step"} x${attempts}] [${qcTag}] CLEAN_EXISTING + ${redesignPrompt.substring(0, 300)}`;
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
