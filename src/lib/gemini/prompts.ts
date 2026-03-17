/**
 * PROMPTS PARA GENERACIÓN DE IMÁGENES PRESISSO
 *
 * ESTRATEGIA: Enviamos la foto del cliente + la foto de referencia Presisso
 * (moderna o premium) a Gemini. El modelo edita la foto del cliente para que
 * los muebles coincidan con el estilo de la referencia.
 *
 * IMPORTANTE: Los prompts están en inglés para mejor calidad de generación.
 */

export const PROMPTS = {
  moderna: {
    label: "Línea Moderna",
    // Nombre del archivo de referencia en /public
    referenceImage: "cocina-moderna-presisso.jpg",
    prompt: `You will receive two images:
- Image 1: The client's current kitchen (to be transformed)
- Image 2: A reference photo of Presisso "Línea Moderna" kitchen furniture

Your task: Edit Image 1 so that all kitchen cabinets, countertops, and hardware 
are replaced with the furniture style shown in Image 2 (the Presisso Moderna reference).

CRITICAL RULES:
- Keep the original kitchen walls, floor, ceiling, windows, and lighting EXACTLY as they are
- ONLY replace the kitchen cabinets, countertops, drawers, and hardware
- Match the exact furniture style, colors, and finishes from the reference image
- Maintain photorealistic quality — the result must look like a real photograph
- Ensure consistent lighting and shadows between original elements and new furniture
- Preserve the perspective and proportions of the original photo
- The result should be indistinguishable from a real kitchen renovation photograph`,
  },

  premium: {
    label: "Línea Premium",
    // Nombre del archivo de referencia en /public
    referenceImage: "cocina-premiun-presisso.jpg",
    prompt: `You will receive two images:
- Image 1: The client's current kitchen (to be transformed)
- Image 2: A reference photo of Presisso "Línea Premium" kitchen furniture

Your task: Edit Image 1 so that all kitchen cabinets, countertops, and hardware 
are replaced with the furniture style shown in Image 2 (the Presisso Premium reference).

CRITICAL RULES:
- Keep the original kitchen walls, floor, ceiling, windows, and lighting EXACTLY as they are
- ONLY replace the kitchen cabinets, countertops, drawers, and hardware
- Match the exact furniture style, colors, and finishes from the reference image
- Maintain photorealistic quality — the result must look like a real photograph
- Ensure consistent lighting and shadows between original elements and new furniture
- Preserve the perspective and proportions of the original photo
- The result should be indistinguishable from a real kitchen renovation photograph`,
  },
} as const;

export type PromptType = keyof typeof PROMPTS;
