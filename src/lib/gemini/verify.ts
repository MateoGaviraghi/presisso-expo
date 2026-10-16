import { genAI, QC_MODELS } from "./client";

/* ── Control de calidad: compara la foto original con el resultado ──────
 * Un modelo de texto (barato, no genera imágenes) revisa que el resultado
 * conserve la estructura de la cocina y use el material pedido.
 * Si el control falla por un error del propio control, no bloquea: devuelve ok.
 */

export interface QcResult {
  ok: boolean;
  problems: string[];
  checked: boolean; // false si el control no pudo correr
}

type Part = { inlineData: { mimeType: string; data: string } };

const QC_PROMPT = (materialName: string, materialSummary: string) => `You are a strict quality inspector for a kitchen-redesign tool.

IMAGE 1 is the client's ORIGINAL kitchen photo. IMAGE 2 is the EDITED result.
The edit was supposed to: remove loose clutter, then replace ONLY the cabinet fronts, furniture panels, handles and countertops with the material "${materialName}". Everything else must stay.

MATERIAL SPEC (follow its two-tone and row rules exactly; a color the spec asks for is correct):
${materialSummary}

Compare the two images and check each rule:
1. ISLANDS / PENINSULAS / BREAKFAST BARS: every one visible in IMAGE 1 still exists in IMAGE 2, same position and size. None added, none removed.
2. LARGE APPLIANCES: fridge, oven, cooktop, range hood, microwave and dishwasher visible in IMAGE 1 are still in IMAGE 2, same place.
3. CABINET LAYOUT: same cabinet runs, same number of rows of upper cabinets, no new tall units, no new rows or horizontal splits.
4. ROOM: walls, backsplash, floor, windows and camera framing are the same.
5. MATERIAL: the fronts in IMAGE 2 follow the MATERIAL SPEC (colors, two-tone placement, handles), with no leftover cabinet in the old color and no missing fronts or open gaps.

Small loose objects (bottles, cups, coffee machines, rags, trash bins) disappearing is CORRECT, not a problem.

Answer ONLY with JSON: {"ok": boolean, "problems": string[]} — "ok" is true only if all 5 rules pass. Each problem is one short sentence in Spanish.`;

export async function verifyRedesign(
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
            parts: [original, result, { text: QC_PROMPT(materialName, materialSummary) }],
          },
        ],
        config: { responseMimeType: "application/json", temperature: 0 },
      });
      const text = response.text ?? "";
      const parsed = JSON.parse(text) as { ok?: unknown; problems?: unknown };
      const problems = Array.isArray(parsed.problems) ? parsed.problems.map(String) : [];
      return { ok: parsed.ok === true, problems, checked: true };
    } catch (err) {
      console.warn(`[QC] ${model} falló:`, err instanceof Error ? err.message : err);
    }
  }
  return { ok: true, problems: [], checked: false };
}
