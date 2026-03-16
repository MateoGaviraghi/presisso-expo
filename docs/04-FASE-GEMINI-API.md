# FASE 4 — Integración Gemini Imagen API

> **Duración:** Semana 2, Días 2-5  
> **Responsable:** Lead Developer  
> **Entregable:** Generación de imagen IA funcional con prompts calibrados  
> **Documentación oficial:** https://ai.google.dev/gemini-api/docs/imagen  

---

## ⚙️ SKILLS REQUERIDAS — Leer antes de ejecutar

> **Documento de referencia:** [`09-SKILLS.md`](./09-SKILLS.md)  
> **⚠️ FASE CRÍTICA:** Esta es la fase más técnicamente compleja del proyecto.

| Skill | Rol | Nivel |
|-------|-----|-------|
| Ingeniero de IA | Principal | Senior 10+ años |
| Desarrollador Full Stack | Principal | Senior 10+ años |
| Arquitecto de Software | Principal | Senior 15+ años |
| Líder Técnico | Principal | Senior 15+ años |

### 📖 Skills del proyecto — LEER antes de ejecutar esta fase:

| Skill (archivo) | Propósito en esta fase |
|------------------|------------------------|
| [`.agents/skills/nextjs-react-typescript/SKILL.md`](../.agents/skills/nextjs-react-typescript/SKILL.md) | API Routes para endpoint de generación |
| [`.agents/skills/typescript-advanced-types/SKILL.md`](../.agents/skills/typescript-advanced-types/SKILL.md) | Tipado de respuestas Gemini, retry logic |

### Prompt de contexto — COPIAR antes de iniciar esta fase:

```
Actuá como un equipo integrado por:
- Ingeniero de IA Senior (10+ años) especializado en prompt engineering para 
  generación de imágenes, APIs de IA generativa (Google Gemini, Imagen 4), 
  y calibración de calidad de outputs con métricas objetivas.
- Arquitecto de Software Senior (15+ años) con experiencia en integración de 
  APIs externas, patrones de retry/fallback, y diseño resiliente.
- Desarrollador Full Stack Senior que implementa la integración técnica con 
  SDKs, manejo de base64, storage de imágenes y flujos asíncronos.
- Líder Técnico Senior que toma decisiones de trade-off entre calidad de imagen, 
  velocidad de generación y costo por request.

PROYECTO: Integración con Google Gemini API para fotomontaje de cocinas.
API: Gemini 2.5 Flash Image (edición conversacional) + Imagen 4 (fallback).
SDK: @google/genai (oficial de Google)
OBJETIVO: Enviar foto del cliente + prompt → recibir foto con muebles Presisso.
VOLUMEN: 30-80 generaciones/día durante 3-5 días de expo.
TAREA: Implementar integración completa con Gemini, diseñar prompts para línea 
Moderna y Premium, implementar fallback y preparar calibración iterativa.
```

---

## 4.1 Obtener API Key de Gemini

1. Ir a [Google AI Studio](https://aistudio.google.com/apikey)
2. Click en "Create API key"
3. Seleccionar o crear un proyecto de Google Cloud
4. Copiar la key generada → `GEMINI_API_KEY` en `.env.local`

> **Rate limits (free tier):** ~15 RPM (requests por minuto).  
> **Plan de pago:** Se activa automáticamente con billing en Google Cloud.  
> **Costo estimado:** ~$0.03–$0.06 USD por imagen generada.

---

## 4.2 Instalar SDK oficial

```bash
pnpm add @google/genai
```

---

## 4.3 Cliente Gemini — `src/lib/gemini/client.ts`

```typescript
import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY no configurada en .env.local");
}

export const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Modelos disponibles
export const MODELS = {
  // Imagen 4 — Generación de imágenes standalone (sin edición)
  imagen4: "imagen-4.0-generate-001",

  // Gemini 2.5 Flash Image (Nano Banana) — Edición conversacional de imágenes
  // Este es el modelo que usamos para editar la foto del cliente
  geminiFlashImage: "gemini-2.5-flash-preview-image-generation",
} as const;
```

---

## 4.4 Prompts predeterminados — `src/lib/gemini/prompts.ts`

```typescript
/**
 * PROMPTS PARA GENERACIÓN DE IMÁGENES PRESISSO
 *
 * ESTRATEGIA: Usamos Gemini 2.5 Flash Image (Nano Banana) porque permite
 * edición conversacional de imágenes existentes. Le enviamos la foto del
 * cliente + un prompt describiendo los muebles Presisso que queremos insertar.
 *
 * IMPORTANTE: Los prompts deben estar en inglés para mejor calidad.
 */

export const SYSTEM_CONTEXT = `You are a professional interior designer specializing 
in high-end kitchen renovations. You work exclusively with Presisso kitchen furniture, 
an Argentine premium brand known for elegant, durable designs.

CRITICAL RULES:
- Keep the original kitchen walls, floor, ceiling, windows, and lighting EXACTLY as they are
- ONLY replace the kitchen cabinets, countertops, and hardware
- Maintain photorealistic quality — the result must look like a real photograph
- Ensure consistent lighting and shadows between original elements and new furniture
- Preserve the perspective and proportions of the original photo
- The result should look like a professional kitchen showroom photo`;

export const PROMPTS = {
  moderna: {
    label: "Línea Moderna",
    prompt: `${SYSTEM_CONTEXT}

Replace all kitchen cabinets and countertops in this photo with Presisso "Línea Moderna" furniture:

CABINET STYLE:
- Flat-panel (slab) doors with no visible frames
- Matte white lacquer finish as primary color
- Handleless design with integrated J-pull channels in brushed aluminum
- Soft-close hinges and full-extension drawers

COUNTERTOP:
- Light gray quartz with subtle veining (similar to Silestone Eternal Calacatta Gold)
- Waterfall edge on kitchen island if present
- Integrated undermount sink in stainless steel

UPPER CABINETS:
- Same matte white as base cabinets
- LED strip lighting underneath upper cabinets (warm white 3000K glow)
- Glass-front cabinets with smoked glass for display sections

BACKSPLASH:
- Large-format white porcelain tiles with minimal grout lines
- Matte finish to complement the cabinet doors

HARDWARE & DETAILS:
- Brushed aluminum accents on edges and toe kicks
- Integrated appliance panels matching cabinet finish
- Clean, minimal aesthetic — no ornamental details

Make the overall look clean, Scandinavian-inspired, and contemporary. 
The kitchen should feel spacious, bright, and sophisticated.`,
  },

  premium: {
    label: "Línea Premium",
    prompt: `${SYSTEM_CONTEXT}

Replace all kitchen cabinets and countertops in this photo with Presisso "Línea Premium" furniture:

CABINET STYLE:
- Shaker-style doors with a refined, slim frame profile
- Rich dark walnut wood grain finish (natural wood veneer, not laminate)
- Antiqued brass knob handles on doors, brass bar pulls on drawers
- Soft-close European hinges, dovetail drawer construction

COUNTERTOP:
- Dark green marble (similar to Verde Guatemala) with dramatic white veining
- Polished finish, eased edge profile
- Undermount farmhouse-style sink in hammered copper

UPPER CABINETS:
- Mix of closed dark walnut cabinets and open shelving in matching wood
- Brass-framed glass cabinet doors for display sections
- Integrated accent lighting with warm amber tone

BACKSPLASH:
- Herringbone-pattern marble tiles matching the countertop family
- Polished finish for contrast with the matte wood

HARDWARE & DETAILS:
- All hardware in antiqued/brushed brass
- Crown molding along upper cabinet line
- Decorative corbels under open shelving
- Visible wood grain texture on all surfaces

Make the overall look luxurious, warm, and timeless — like a high-end 
European kitchen in a country estate. Rich materials, artisan quality.`,
  },
} as const;

export type PromptType = keyof typeof PROMPTS;
```

---

## 4.5 Función de generación — `src/lib/gemini/generate.ts`

```typescript
import { genAI, MODELS } from "./client";
import { PROMPTS, PromptType } from "./prompts";
import * as fs from "node:fs";
import * as path from "node:path";

interface GenerateResult {
  success: boolean;
  imageBase64?: string;
  promptUsed?: string;
  model?: string;
  timeMs?: number;
  error?: string;
}

/**
 * Genera una imagen editada usando Gemini 2.5 Flash Image
 *
 * Este modelo soporta edición conversacional: le enviamos la foto
 * original del cliente + el prompt describiendo los muebles Presisso,
 * y devuelve la imagen editada con los muebles insertados.
 */
export async function generateKitchenImage(
  fotoOriginalUrl: string,
  tipoCocina: PromptType
): Promise<GenerateResult> {
  const startTime = Date.now();
  const promptConfig = PROMPTS[tipoCocina];

  try {
    // 1. Descargar la imagen original del cliente
    const imageResponse = await fetch(fotoOriginalUrl);
    if (!imageResponse.ok) {
      throw new Error(`Error descargando imagen: ${imageResponse.status}`);
    }
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");
    const mimeType = imageResponse.headers.get("content-type") || "image/jpeg";

    // 2. Llamar a Gemini con la imagen + prompt
    const response = await genAI.models.generateContent({
      model: MODELS.geminiFlashImage,
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Image,
              },
            },
            {
              text: promptConfig.prompt,
            },
          ],
        },
      ],
      config: {
        responseModalities: ["image", "text"],
        responseMimeType: "image/png",
      },
    });

    // 3. Extraer la imagen generada de la respuesta
    const generatedImage = response.candidates?.[0]?.content?.parts?.find(
      (part: any) => part.inlineData
    );

    if (!generatedImage?.inlineData?.data) {
      throw new Error("Gemini no devolvió una imagen en la respuesta");
    }

    const timeMs = Date.now() - startTime;

    return {
      success: true,
      imageBase64: generatedImage.inlineData.data,
      promptUsed: promptConfig.prompt.substring(0, 500) + "...",
      model: MODELS.geminiFlashImage,
      timeMs,
    };
  } catch (error) {
    const timeMs = Date.now() - startTime;
    console.error("Error generando imagen:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
      timeMs,
    };
  }
}

/**
 * Fallback: Genera imagen con Imagen 4 (text-to-image puro)
 * Si la edición conversacional falla, genera una cocina "inspirada"
 * en el tipo seleccionado (no edita la foto del cliente directamente)
 */
export async function generateKitchenImageFallback(
  tipoCocina: PromptType
): Promise<GenerateResult> {
  const startTime = Date.now();

  try {
    const response = await genAI.models.generateImages({
      model: MODELS.imagen4,
      prompt: `Photorealistic interior photograph of a modern kitchen with Presisso ${
        tipoCocina === "moderna" ? "Moderna" : "Premium"
      } furniture. ${PROMPTS[tipoCocina].prompt.substring(PROMPTS[tipoCocina].prompt.indexOf("CABINET STYLE"))}`,
      config: {
        numberOfImages: 1,
        aspectRatio: "4:3",
      },
    });

    const generatedImage = response.generatedImages?.[0];
    if (!generatedImage?.image?.imageBytes) {
      throw new Error("Imagen 4 no devolvió imagen");
    }

    const base64 = Buffer.from(generatedImage.image.imageBytes).toString("base64");

    return {
      success: true,
      imageBase64: base64,
      promptUsed: "[FALLBACK] Imagen 4 text-to-image",
      model: MODELS.imagen4,
      timeMs: Date.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error en fallback",
      timeMs: Date.now() - startTime,
    };
  }
}
```

---

## 4.6 API Route: Generar imagen — `src/app/api/generar-imagen/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  generateKitchenImage,
  generateKitchenImageFallback,
} from "@/lib/gemini/generate";
import type { PromptType } from "@/lib/gemini/prompts";

export const maxDuration = 60; // Vercel: timeout 60s para generación IA

export async function POST(req: NextRequest) {
  const { solicitud_id } = await req.json();

  // 1. Obtener solicitud
  const { data: solicitud, error } = await supabaseAdmin
    .from("solicitudes")
    .select("*")
    .eq("id", solicitud_id)
    .single();

  if (error || !solicitud) {
    return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
  }

  // 2. Actualizar estado a "generando"
  await supabaseAdmin
    .from("solicitudes")
    .update({
      estado: "generando",
      intentos_generacion: solicitud.intentos_generacion + 1,
    })
    .eq("id", solicitud_id);

  // 3. Intentar generar con Gemini Flash Image (edición)
  let result = await generateKitchenImage(
    solicitud.foto_original,
    solicitud.tipo_cocina as PromptType
  );

  // 4. Si falla, intentar con fallback Imagen 4
  if (!result.success) {
    console.warn("Gemini Flash Image falló, intentando fallback Imagen 4...");
    result = await generateKitchenImageFallback(solicitud.tipo_cocina as PromptType);
  }

  if (!result.success) {
    // Ambos fallaron
    await supabaseAdmin
      .from("solicitudes")
      .update({
        estado: "error",
        notas_admin: `Error generación: ${result.error}`,
      })
      .eq("id", solicitud_id);

    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  // 5. Guardar imagen generada en Supabase Storage
  const imageBuffer = Buffer.from(result.imageBase64!, "base64");
  const fileName = `generadas/${solicitud_id}-${Date.now()}.png`;

  const { error: uploadError } = await supabaseAdmin
    .storage
    .from("fotos-cocinas")
    .upload(fileName, imageBuffer, {
      contentType: "image/png",
      upsert: true,
    });

  if (uploadError) {
    console.error("Error subiendo imagen generada:", uploadError);
    return NextResponse.json({ error: "Error almacenando imagen" }, { status: 500 });
  }

  const { data: urlData } = supabaseAdmin
    .storage
    .from("fotos-cocinas")
    .getPublicUrl(fileName);

  // 6. Actualizar solicitud con la imagen generada
  await supabaseAdmin
    .from("solicitudes")
    .update({
      estado: "revision",
      imagen_generada: urlData.publicUrl,
      prompt_usado: result.promptUsed,
      modelo_ia: result.model,
      tiempo_generacion_ms: result.timeMs,
    })
    .eq("id", solicitud_id);

  return NextResponse.json({
    success: true,
    imagen_url: urlData.publicUrl,
    model: result.model,
    time_ms: result.timeMs,
  });
}
```

---

## 4.7 Calibración de prompts — Proceso iterativo

```
SEMANA 2, DÍAS 4-5: CALIBRACIÓN

1. Preparar 10 fotos de cocinas reales variadas:
   - Cocina chica departamento
   - Cocina grande casa
   - Cocina con isla
   - Cocina lineal
   - Cocina en L
   - Distintas iluminaciones (natural, artificial)
   - Distintos colores de pared

2. Correr cada foto con prompt Moderna Y Premium
   → 20 generaciones totales

3. Evaluar cada resultado:
   - ¿Se mantiene la estructura original?
   - ¿Los muebles se ven realistas?
   - ¿La iluminación es coherente?
   - ¿Las proporciones son correctas?

4. Ajustar prompts según resultados:
   - Si pierde la estructura → reforzar "keep original walls/floor"
   - Si muebles se ven artificiales → agregar detalles de textura
   - Si proporciones malas → agregar "maintain exact perspective"

5. Repetir hasta tasa de aprobación > 70%
```

---

## 4.8 Manejo de errores y retry

```typescript
// En generate.ts — agregar retry con exponential backoff
export async function generateWithRetry(
  fotoUrl: string,
  tipo: PromptType,
  maxRetries = 3
): Promise<GenerateResult> {
  for (let i = 0; i < maxRetries; i++) {
    const result = await generateKitchenImage(fotoUrl, tipo);
    if (result.success) return result;

    // Esperar antes de reintentar (1s, 2s, 4s)
    if (i < maxRetries - 1) {
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }

  // Último intento con fallback
  return generateKitchenImageFallback(tipo);
}
```

---

## 4.9 Verificación de la fase

| Check | Criterio |
|-------|----------|
| ✅ | API key de Gemini configurada y funcional |
| ✅ | Generación con Gemini Flash Image produce imagen editada |
| ✅ | Fallback con Imagen 4 produce imagen text-to-image |
| ✅ | Imagen generada se sube a Supabase Storage |
| ✅ | Estado de solicitud se actualiza correctamente (generando → revision) |
| ✅ | Error handling con retry funciona |
| ✅ | Prompts calibrados con al menos 10 fotos de prueba |
| ✅ | Tasa de aprobación de imágenes > 70% |
| ✅ | Tiempo de generación promedio < 30 segundos |
