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

/**
 * Genera una imagen editada usando Gemini 2.5 Flash Image.
 *
 * Envía dos imágenes al modelo:
 *   1. La foto original del cliente (descargada desde Supabase Storage)
 *   2. La foto de referencia Presisso (leída desde /public)
 *
 * El modelo adapta la cocina del cliente al estilo de la referencia.
 */
export async function generateKitchenImage(
  fotoOriginalUrl: string,
  tipoCocina: PromptType,
): Promise<GenerateResult> {
  const startTime = Date.now();
  const promptConfig = PROMPTS[tipoCocina];

  try {
    // 1. Descargar la foto del cliente
    const clientRes = await fetch(fotoOriginalUrl);
    if (!clientRes.ok) {
      throw new Error(`Error descargando foto del cliente: ${clientRes.status}`);
    }
    const clientBuffer = await clientRes.arrayBuffer();
    const clientBase64 = Buffer.from(clientBuffer).toString("base64");
    const clientMime =
      clientRes.headers.get("content-type") || "image/jpeg";

    // 2. Leer la imagen de referencia Presisso desde /public
    const refPath = path.join(
      process.cwd(),
      "public",
      promptConfig.referenceImage,
    );
    const refBuffer = fs.readFileSync(refPath);
    const refBase64 = refBuffer.toString("base64");
    // Las referencias son JPG
    const refMime = "image/jpeg";

    // 3. Llamar a Gemini con ambas imágenes + prompt
    const response = await genAI.models.generateContent({
      model: MODELS.geminiFlashImage,
      contents: [
        {
          role: "user",
          parts: [
            // Imagen 1: foto del cliente
            {
              inlineData: {
                mimeType: clientMime,
                data: clientBase64,
              },
            },
            // Imagen 2: referencia Presisso
            {
              inlineData: {
                mimeType: refMime,
                data: refBase64,
              },
            },
            // Instrucción
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

    // 4. Extraer la imagen generada
    const parts = response.candidates?.[0]?.content?.parts as
      | { inlineData?: { data?: string; mimeType?: string } }[]
      | undefined;
    const imagePart = parts?.find((p) => p.inlineData?.data);

    if (!imagePart?.inlineData?.data) {
      throw new Error("Gemini no devolvió imagen en la respuesta");
    }

    return {
      success: true,
      imageBase64: imagePart.inlineData.data,
      promptUsed: promptConfig.prompt.substring(0, 500),
      model: MODELS.geminiFlashImage,
      timeMs: Date.now() - startTime,
    };
  } catch (error) {
    console.error("Error en generateKitchenImage:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
      timeMs: Date.now() - startTime,
    };
  }
}

/**
 * Fallback: genera una cocina Presisso con Imagen 4 (text-to-image puro).
 * No edita la foto del cliente — genera una imagen nueva inspirada en el estilo.
 */
export async function generateKitchenImageFallback(
  tipoCocina: PromptType,
): Promise<GenerateResult> {
  const startTime = Date.now();
  const promptConfig = PROMPTS[tipoCocina];

  try {
    const response = await genAI.models.generateImages({
      model: MODELS.imagen4,
      prompt: `Photorealistic interior photo of a kitchen with Presisso ${promptConfig.label} furniture. ${promptConfig.prompt.split("\n").slice(5).join(" ")}`,
      config: {
        numberOfImages: 1,
        aspectRatio: "4:3",
      },
    });

    const generated = response.generatedImages?.[0];
    if (!generated?.image?.imageBytes) {
      throw new Error("Imagen 4 no devolvió imagen");
    }

    const base64 = Buffer.from(generated.image.imageBytes).toString("base64");

    return {
      success: true,
      imageBase64: base64,
      promptUsed: "[FALLBACK Imagen 4]",
      model: MODELS.imagen4,
      timeMs: Date.now() - startTime,
    };
  } catch (error) {
    console.error("Error en fallback Imagen 4:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error en fallback",
      timeMs: Date.now() - startTime,
    };
  }
}

/**
 * Genera con reintentos y backoff exponencial (1s, 2s, 4s).
 * Si los 3 intentos fallan, usa el fallback de Imagen 4.
 */
export async function generateWithRetry(
  fotoUrl: string,
  tipo: PromptType,
  maxRetries = 3,
): Promise<GenerateResult> {
  for (let i = 0; i < maxRetries; i++) {
    const result = await generateKitchenImage(fotoUrl, tipo);
    if (result.success) return result;

    if (i < maxRetries - 1) {
      const waitMs = 1000 * Math.pow(2, i);
      console.warn(`Intento ${i + 1} falló. Reintentando en ${waitMs}ms...`);
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }

  console.warn("Todos los intentos fallaron. Usando fallback Imagen 4...");
  return generateKitchenImageFallback(tipo);
}
