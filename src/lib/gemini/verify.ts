import { genAI, QC_MODELS } from "./client";
import { furnitureMask, FURNITURE_GRID } from "./color-guide";

/* ── Control de calidad: compara la foto original con el resultado ──────
 * Un modelo de texto (barato, no genera imágenes) revisa que el resultado
 * conserve la estructura de la cocina y use el material pedido.
 * Si el control falla por un error del propio control, no bloquea: devuelve ok.
 */

export interface QcResult {
  ok: boolean;
  problems: string[];
  checked: boolean; // false si el control no pudo correr
  addsFurniture?: boolean; // el resultado tiene muebles donde la original no tiene
}

/* ── Muebles agregados ──────────────────────────────────────────────────
 * El control por texto deja pasar alacenas y retornos inventados en cocinas con
 * poca estructura. Este chequeo marca frentes y mesadas en la original y en el
 * resultado y mide qué parte de la foto tiene muebles que antes no estaban.
 */

// Fracción de la foto con muebles nuevos a partir de la cual se considera que agregó muebles.
// Medido en la cocina en obra: resultados correctos 2,1–2,5 % (ruido del marcado); columna o
// alacenas inventadas 6,5–19 %. Un retorno en L (2,5–2,9 %) no se distingue por área: lo marca
// el control por texto (regla 3).
const ADDED_FURNITURE_LIMIT = 0.05;

/** Máscara de la original, dilatada para tolerar el ruido del marcado. null si no se pudo armar. */
export function originalFurnitureMask(original: Part) {
  return furnitureMask(original.inlineData.data, original.inlineData.mimeType, 4);
}

/** Fracción de la foto con muebles nuevos, o null si no se pudo medir. */
export async function addedFurnitureRatio(originalMask: Float32Array | null, resultBase64: string): Promise<number | null> {
  if (!originalMask) return null;
  const result = await furnitureMask(resultBase64);
  if (!result) return null;
  let added = 0;
  for (let i = 0; i < result.length; i++) if (result[i] > 0.5 && originalMask[i] < 0.1) added++;
  return added / (FURNITURE_GRID * FURNITURE_GRID);
}

/** Suma el chequeo de muebles agregados al veredicto del control. */
export function withFurnitureCheck(qc: QcResult, ratio: number | null): QcResult {
  if (ratio === null || ratio <= ADDED_FURNITURE_LIMIT) return qc;
  if (qc.addsFurniture) return { ...qc, ok: false };
  return {
    ok: false,
    checked: true,
    addsFurniture: true,
    problems: [`Agrega muebles que no están en la foto original (${Math.round(ratio * 100)} % de la foto).`, ...qc.problems],
  };
}

type Part = { inlineData: { mimeType: string; data: string } };

/* ── Inventario de la estructura ────────────────────────────────────────
 * El paso de material convertía una pared vacía en un retorno en L o una columna.
 * Un modelo de texto describe los muebles fijos de la original (tramos, paredes
 * vacías, isla) y ese inventario se agrega a los prompts de generación.
 */
const STRUCTURE_PROMPT = `List ONLY the built-in kitchen furniture visible in this photo, ignoring loose objects and appliances:
- each cabinet run: which wall it is on (back, left, right), straight or L-shaped, and whether it has base cabinets, upper cabinets and/or tall units;
- island, peninsula or breakfast bar: yes or no;
- every visible wall or wall section that has NO cabinets.
Be literal: if there are no upper cabinets, say so. Answer ONLY with JSON: {"inventory": string} — at most 70 English words.`;

/** Inventario de los muebles fijos de la original, o "" si no se pudo armar. */
export async function describeStructure(original: Part): Promise<string> {
  for (const model of QC_MODELS) {
    try {
      const response = await genAI.models.generateContent({
        model,
        contents: [{ role: "user", parts: [original, { text: STRUCTURE_PROMPT }] }],
        config: { responseMimeType: "application/json", temperature: 0 },
      });
      const parsed = JSON.parse(response.text ?? "") as { inventory?: unknown };
      if (typeof parsed.inventory === "string" && parsed.inventory.trim()) return parsed.inventory.trim();
    } catch (err) {
      console.warn(`[Estructura] ${model} falló:`, err instanceof Error ? err.message : err);
    }
  }
  return "";
}

/** Nota para los prompts de generación con el inventario de la original. */
export function structureNote(inventory: string): string {
  if (!inventory) return "";
  return `\n\nTHE CLIENT'S FURNITURE, exactly (from the original photo): ${inventory}\nYour output has exactly this furniture — no extra cabinet run, counter return, L-shape, column, tall unit or upper cabinet. A wall without cabinets in this list stays a bare wall.`;
}

const QC_PROMPT = (materialName: string, materialSummary: string) => `You are a strict quality inspector for a kitchen-redesign tool.

IMAGE 1 is the client's ORIGINAL kitchen photo. IMAGE 2 is the EDITED result. The images after those are REFERENCE PHOTOS of the real Presisso material.
The edit was supposed to: remove loose clutter, then replace ONLY the cabinet fronts, furniture panels, handles and countertops with the material "${materialName}". Everything else must stay.

MATERIAL SPEC (follow its two-tone and row rules exactly; a color the spec asks for is correct):
${materialSummary}

Compare the two images and check each rule:
1. ISLANDS / PENINSULAS / BREAKFAST BARS: every one visible in IMAGE 1 still exists in IMAGE 2, same position and size. None added, none removed.
2. LARGE APPLIANCES: fridge, oven, cooktop, range hood, microwave and dishwasher visible in IMAGE 1 are still in IMAGE 2, same place.
3. CABINET LAYOUT: same cabinet runs, same number of rows of upper cabinets, no new tall units, no new rows or horizontal splits.
4. ROOM: walls, backsplash, floor, windows and camera framing are the same.
5. MATERIAL: the fronts in IMAGE 2 follow the MATERIAL SPEC (colors, two-tone placement, handles), with no leftover cabinet in the old color and no missing fronts or open gaps.
6. COLOR MATCH: the door and countertop colors in IMAGE 2 look like the REFERENCE PHOTOS (same lightness, tone and finish). Clearly darker, bluer, more metallic or a different hue than the references is a FAIL. The first reference is the official door swatch; when the second reference is a countertop swatch (stone or quartz), the countertop must match THAT swatch, not the doors.
6b. FINISH: unless the MATERIAL SPEC asks for gloss, doors that look like stainless steel, brushed metal or chrome, or that show shiny reflections or bright light streaks, are a FAIL.
7. NOTHING ADDED: IMAGE 2 has no object that is not in IMAGE 1 — no coffee machine, kettle, toaster, bowl, plant, decor, stool or chair placed on counters or around the kitchen.

Small loose objects (bottles, cups, coffee machines, rags, trash bins) disappearing is CORRECT, not a problem.

Answer ONLY with JSON: {"ok": boolean, "addedFurniture": boolean, "problems": string[]} — "addedFurniture" is true if IMAGE 2 has ANY cabinet run, counter return or L-shape, column, tall unit or upper cabinet that IMAGE 1 does not have. "ok" is true only if every rule passes. Each problem is one short sentence in Spanish.`;

export async function verifyRedesign(
  references: Part[],
  original: Part,
  result: Part,
  materialName: string,
  materialSummary: string,
): Promise<QcResult> {
  for (const model of QC_MODELS) {
    try {
      const response = await genAI.models.generateContent({
        model,
        contents: [
          {
            role: "user",
            parts: [
              original,
              result,
              { text: "The following images are REFERENCE PHOTOS of the real material:" },
              ...references,
              { text: QC_PROMPT(materialName, materialSummary) },
            ],
          },
        ],
        config: { responseMimeType: "application/json", temperature: 0 },
      });
      const text = response.text ?? "";
      const parsed = JSON.parse(text) as { ok?: unknown; addedFurniture?: unknown; problems?: unknown };
      const problems = Array.isArray(parsed.problems) ? parsed.problems.map(String) : [];
      // Muebles agregados pesa más que cualquier otro problema al elegir entre intentos
      const addsFurniture = parsed.addedFurniture === true;
      return { ok: parsed.ok === true && !addsFurniture, problems, checked: true, ...(addsFurniture ? { addsFurniture } : {}) };
    } catch (err) {
      console.warn(`[QC] ${model} falló:`, err instanceof Error ? err.message : err);
    }
  }
  return { ok: true, problems: [], checked: false };
}
