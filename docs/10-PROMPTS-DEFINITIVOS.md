# PRESISSO EXPO — Prompts Definitivos para Nano Banana Pro

> **Versión:** 3.0 — Optimizado para Nano Banana Pro  
> **Modelo:** `gemini-3-pro-image-preview` (Nano Banana Pro / Gemini 3 Pro Image)  
> **Fallback 1:** `gemini-3.1-flash-image-preview` (Nano Banana 2)  
> **Fallback 2:** `gemini-2.5-flash-preview-image-generation` (Nano Banana original)  

---

## Comparación de modelos

| Capacidad | Nano Banana Pro | Nano Banana 2 | Nano Banana |
|-----------|:-:|:-:|:-:|
| Model string | `gemini-3-pro-image-preview` | `gemini-3.1-flash-image-preview` | `gemini-2.5-flash-image` |
| Resolución máxima | 4K | 2K | 1K |
| Imágenes de referencia | Hasta 14 | Hasta 14 | Limitado |
| Thinking (razonamiento visual) | Sí | No | No |
| Multi-image fusion | Profesional | Bueno | Básico |
| Fidelidad de materiales | Studio-quality | Buena | Aceptable |
| Velocidad | 15-40 seg | 8-15 seg | 5-10 seg |
| Costo aprox. por imagen | ~$0.08-0.15 | ~$0.03-0.06 | ~$0.02-0.04 |

---

## Cliente Gemini — `src/lib/gemini/client.ts`

```typescript
import { GoogleGenAI } from "@google/genai";

export const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const MODELS = {
  primary: "gemini-3-pro-image-preview",
  fallback1: "gemini-3.1-flash-image-preview",
  fallback2: "gemini-2.5-flash-preview-image-generation",
} as const;
```

---

## Función de generación — `src/lib/gemini/generate.ts`

```typescript
import { genAI, MODELS } from "./client";
import { PROMPTS, type PromptType } from "./prompts";

const referenceCache: Record<string, { base64: string; mime: string }[]> = {};

const REFERENCE_URLS: Record<string, string[]> = {
  moderna: [
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/fotos-cocinas/referencias/moderna/moderna-01.jpg`,
  ],
  premium: [
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/fotos-cocinas/referencias/premium/premium-01.jpg`,
  ],
};

export async function loadReferenceImages() {
  for (const [tipo, urls] of Object.entries(REFERENCE_URLS)) {
    referenceCache[tipo] = [];
    for (const url of urls) {
      const res = await fetch(url);
      const buffer = await res.arrayBuffer();
      referenceCache[tipo].push({
        base64: Buffer.from(buffer).toString("base64"),
        mime: res.headers.get("content-type") || "image/jpeg",
      });
    }
  }
}

interface GenerateResult {
  success: boolean;
  imageBase64?: string;
  promptUsed?: string;
  model?: string;
  timeMs?: number;
  error?: string;
}

export async function generateKitchenImage(
  fotoOriginalUrl: string,
  tipoCocina: PromptType,
  model?: string
): Promise<GenerateResult> {
  const startTime = Date.now();
  const useModel = model || MODELS.primary;

  try {
    const clientRes = await fetch(fotoOriginalUrl);
    const clientBuffer = await clientRes.arrayBuffer();
    const clientBase64 = Buffer.from(clientBuffer).toString("base64");
    const clientMime = clientRes.headers.get("content-type") || "image/jpeg";

    const refs = referenceCache[tipoCocina];
    if (!refs?.length) throw new Error(`Sin referencias para: ${tipoCocina}`);

    const parts: any[] = [];

    // Part 1: Foto del cliente
    parts.push({ inlineData: { mimeType: clientMime, data: clientBase64 } });

    // Parts 2+: Referencias Presisso
    for (const ref of refs) {
      parts.push({ inlineData: { mimeType: ref.mime, data: ref.base64 } });
    }

    // Última part: Prompt
    parts.push({ text: PROMPTS[tipoCocina] });

    const response = await genAI.models.generateContent({
      model: useModel,
      contents: [{ role: "user", parts }],
      config: {
        responseModalities: ["image", "text"],
        responseMimeType: "image/png",
      },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(
      (p: any) => p.inlineData
    );

    if (!imagePart?.inlineData?.data) {
      throw new Error("No image in response");
    }

    return {
      success: true,
      imageBase64: imagePart.inlineData.data,
      promptUsed: PROMPTS[tipoCocina].substring(0, 300) + "...",
      model: useModel,
      timeMs: Date.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      model: useModel,
      timeMs: Date.now() - startTime,
    };
  }
}

export async function generateWithFallback(
  fotoUrl: string,
  tipo: PromptType
): Promise<GenerateResult> {
  let result = await generateKitchenImage(fotoUrl, tipo, MODELS.primary);
  if (result.success) return result;

  result = await generateKitchenImage(fotoUrl, tipo, MODELS.fallback1);
  if (result.success) return result;

  return generateKitchenImage(fotoUrl, tipo, MODELS.fallback2);
}
```

---

## PROMPT MODERNA

```typescript
export const PROMPTS = {
  moderna: `You are a world-class interior design visualization specialist working with Presisso, a premium Argentine kitchen furniture brand.

You have received multiple images:
- IMAGE 1 (first image): The CLIENT'S ACTUAL KITCHEN that needs redesigning.
- IMAGE 2+ (following images): REFERENCE PHOTOS of Presisso "Línea Moderna" furniture. These show the EXACT style to replicate.

TASK: Edit IMAGE 1 replacing all cabinetry, countertops, backsplash, and hardware to precisely match Presisso Línea Moderna from the reference images.

REPLICATE THESE EXACT DETAILS FROM THE REFERENCE:

LOWER CABINETS:
- Dark anthracite/charcoal gray drawer fronts with HIGH GLOSS mirror-like reflective finish
- White matte cabinet carcass visible at edges and between units
- Thin horizontal brushed aluminum profile strips as handles, running the FULL WIDTH of each drawer — slim accent lines, NOT bar handles, NOT knobs

UPPER CABINETS:
- Smoked dark glass doors with slim aluminum frames
- Built-in oven column with white panel surround
- Built-in microwave below oven

MAIN COUNTERTOP:
- Pure white solid surface — no veins, no pattern, matte/satin finish

ISLAND (if space exists):
- Dark black stone top with mineral texture, waterfall edge on one side
- Light oak/driftwood wood panel on the island side
- Undermount stainless steel sink with gooseneck faucet
- Flush black induction cooktop on main counter

SHELVING:
- Column of open shelves in light natural oak with dark cube inserts

PRESERVE EXACTLY FROM IMAGE 1 — DO NOT CHANGE:
- Walls: original color, texture, finish
- Floor: original material and color
- Ceiling and existing lights
- Windows, doors, all architectural features
- Room perspective, camera angle, proportions
- Lighting conditions and shadow directions

PHOTOREALISM REQUIREMENTS:
- Must look like a real photograph, not a render
- Gloss reflections must show actual room elements
- Wood grain visible on oak surfaces
- Brushed aluminum texture on profiles
- Seamless transitions between new cabinets and existing walls — no halos, no artifacts
- Proportionally correct furniture scale for the room

OUTPUT: One photorealistic image of the client's kitchen with Presisso Línea Moderna furniture.`,


  premium: `You are a world-class interior design visualization specialist working with Presisso, a premium Argentine kitchen furniture brand.

You have received multiple images:
- IMAGE 1 (first image): The CLIENT'S ACTUAL KITCHEN that needs redesigning.
- IMAGE 2+ (following images): REFERENCE PHOTOS of Presisso "Línea Premium" furniture. These show the EXACT style to replicate.

TASK: Edit IMAGE 1 replacing all cabinetry, countertops, backsplash, and hardware to precisely match Presisso Línea Premium from the reference images.

REPLICATE THESE EXACT DETAILS FROM THE REFERENCE:

ALL CABINETS (upper and lower):
- Flat slab doors in dark anthracite/charcoal gray with full MATTE finish — no gloss, no shine
- COMPLETELY HANDLELESS — no knobs, no bars, no pulls visible. Uses push-to-open or invisible finger channel
- Uniform single color on ALL cabinets, uppers and lowers identical
- Upper cabinets form one continuous straight horizontal line, no height variation

BACKSPLASH:
- Black reflective glass panel (dark mirror glass) spanning between upper and lower cabinets
- Shows soft dark reflections — semi-reflective, not opaque

COUNTERTOP:
- Same dark anthracite matte as cabinets — seamless monochromatic flow from cabinet to counter
- Straight/square edge profile

ISLAND (if space exists):
- Large rectangular block in same anthracite matte
- Minimal clean lines, no waterfall, no ornamentation

PENDANT LIGHTS (add these):
- Three industrial-style pendants hanging in a line over island/work area
- Dark metal bell-shaped shades with small brass/gold accent at top
- ADD to existing ceiling lights, do not remove originals

COLOR PHILOSOPHY: Entire cabinet system is ONE monochromatic dark anthracite mass. Only contrast comes from the client's original floor and the brass pendant accents.

⚠️ CRITICAL — WALLS: The reference showroom has dark walls — this is SHOWROOM STYLING, not the furniture style. KEEP the client's ORIGINAL wall color from IMAGE 1. Dark cabinets against lighter walls is the standard beautiful real-world installation.

PRESERVE EXACTLY FROM IMAGE 1 — DO NOT CHANGE:
- Walls: KEEP ORIGINAL color — do NOT paint dark
- Floor: original material and color
- Ceiling: keep original, add pendant lights as complement
- Windows, doors, architectural features
- Room perspective, camera angle, proportions
- Lighting conditions

PHOTOREALISM REQUIREMENTS:
- Must look like a real photograph
- Matte surfaces show subtle micro-texture under directional light
- Black glass backsplash shows soft reflections of room elements
- Brass pendant accents have warm metallic luminosity
- Seamless transitions, no artifacts, no halos
- Proportionally correct scale
- Overall mood: dramatic, sophisticated, architectural

OUTPUT: One photorealistic image of the client's kitchen with Presisso Línea Premium furniture.`,
};

export type PromptType = keyof typeof PROMPTS;
```

---

## Cascada de fallbacks para la expo

```
Solicitud → Nano Banana Pro (gemini-3-pro-image-preview)
               ↓ falla?
            Nano Banana 2 (gemini-3.1-flash-image-preview)
               ↓ falla?
            Nano Banana (gemini-2.5-flash-preview-image-generation)
               ↓ falla?
            Estado: "error" → notificar operador
```

---

## Setup de referencias en Supabase Storage

```
fotos-cocinas/
  └── referencias/
      ├── moderna/
      │   └── moderna-01.jpg    ← cocina-moderna-presisso.jpg
      └── premium/
          └── premium-01.jpg    ← cocina-premiun-presisso.jpg
```

---

## Ventajas de Nano Banana Pro para Presisso

1. **Thinking:** Planifica perspectiva y geometría antes de generar
2. **Multi-image fusion:** Copia detalles fieles de las fotos de referencia
3. **4K output:** Alta resolución para el PDF impreso
4. **Corrección interna:** Detecta y arregla errores de perspectiva
5. **Fidelidad de materiales:** Distingue gloss vs matte, aluminio vs cromo, roble vs nogal
