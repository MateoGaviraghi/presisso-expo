/* ── Material definitions for prompt generation ─────────────────────── */

import type { ColorGuideSpec } from "./color-guide";

export interface MaterialDef {
  name: string;        // e.g. "Politex Negro"
  finish: string;      // the material as it looks in the reference photos (doors + countertop)
  apply: string;       // where each part of the material goes
  handles: string;     // the only handle rule for this material — no global default competes with it
  colorGuide?: ColorGuideSpec; // muestras oficiales para el boceto de color (materiales de un solo tono)
}

// Descripciones escritas mirando las fotos de referencia de public/<material>/.
// Las fotos mandan: si una descripción no coincide con las fotos, se corrige la descripción.
export const MATERIALS: Record<string, MaterialDef> = {
  politex_negro: {
    name: "Politex Negro",
    colorGuide: { front: "materiales-oficiales/frentes-politex-negro.jpg", top: "materiales-oficiales/frentes-politex-negro.jpg", topTextured: false },
    handles:
      "Lower and tall doors: a slim VERTICAL black pull integrated into a recessed pocket near the door edge, black on black, exactly as in the reference close-ups. Upper cabinets: no handles, flat fronts. No silver, chrome or contrasting hardware.",
    finish:
      "TRUE BLACK matte Politex — the darkest solid black (about #0E1016 in the photos), NOT dark gray, NOT charcoal. Fine nano-textured matte surface like brushed leather; it absorbs light, no gloss, no reflections. The countertop is the SAME black: a thin, straight black slab. In the reference photos every surface of the furniture is black — doors, side panels, island body and countertop.",
    apply: `Apply this material to:
→ EVERY cabinet front: lower doors and drawers, upper doors, tall units — matte black slab, same size, position and count as the original doors.
→ EVERY visible furniture panel: cabinet sides, end panels, the island's body and sides, open-shelf frames and the kickboard — the same matte black. No panel keeps its original color.
→ THE COUNTERTOP and the island top — the same deep black material, top surface and front edge. Same footprint and shape.`,
  },
  melamina_litio: {
    name: "Melamina Litio",
    colorGuide: { front: "materiales-oficiales/frentes-melaminas-metalicos-litio.jpg", top: "materiales-oficiales/mesadas-cuarzo-blanco-puro.jpg", topTextured: false },
    handles:
      "Brushed ALUMINUM profile handle: a slim horizontal aluminum channel along the TOP edge of every lower door and drawer, as in the reference close-ups of the drawers. Upper cabinets: no handles, flat fronts. Kickboard in brushed aluminum.",
    finish:
      "LITIO — Presisso \"Metálicos\" melamine, as in the OFFICIAL SWATCH (first reference image): a LIGHT WARM CHAMPAGNE / GREIGE — a warm beige-gray with a soft, fine pearly sheen. In a bright room it reads as a warm off-white (see the Línea Siena photo); in a dimmer room it reads as light warm beige. It is NEVER cool gray, blue-gray, silver, chrome or medium gray. Smooth and uniform, no wood grain, no brushed lines, never a mirror look. The COUNTERTOP is a DIFFERENT material: solid WHITE quartz (Blanco Puro swatch), whiter and brighter than the champagne doors, with no veining. Only the thin handle profile and the kickboard are aluminum.",
    apply: `Apply this material to:
→ EVERY cabinet front: lower doors and drawers, upper doors, tall units — the warm champagne Litio slab, same size, position and count as the original doors.
→ EVERY visible furniture panel: cabinet sides, end panels, the island's body and sides, open-shelf frames — the same warm champagne Litio. No panel keeps its original color.
→ THE COUNTERTOP and the island top — solid white quartz, top surface and front edge. Same footprint and shape.
→ KICKBOARD — brushed aluminum strip at floor level under the lower cabinets.`,
  },
  politex_gris_grafito: {
    name: "Politex Gris Grafito",
    colorGuide: { front: "materiales-oficiales/frentes-politex-grafito.jpg", top: "materiales-oficiales/mesadas-cuarzo-gris-cemento.jpg", topTextured: true },
    handles:
      "Copy the handle detail from the reference photos: flat handleless fronts with slim recessed grips, same dark color as the door. No knobs, no bar pulls, no chrome.",
    finish:
      "POLITEX GRAFITO, as in the OFFICIAL SWATCH (first reference image): a dark SLATE gray with a cool, slightly blue undertone, super-matte nano-textured surface, no gloss. Darker than medium gray, clearly lighter than black. NO wood anywhere — all fronts are the same graphite.\nThe COUNTERTOP is Presisso CUARZO GRIS CEMENTO (second reference image, official swatch): a warm taupe-gray quartz with a FINE, EVEN granular speckle spread uniformly over the whole surface, like fine sand. Smooth and matte. NO cloudy patches, NO concrete stains, NO veins, NO marble look.",
    apply: `Apply this material to:
→ EVERY cabinet front: lower doors and drawers, upper doors, tall units — the slate graphite Politex slab, same size, position and count as the original doors.
→ EVERY visible furniture panel: cabinet sides, end panels, the island's body and sides, open-shelf frames — the same graphite. No panel keeps its original color.
→ THE COUNTERTOP and the island top — Cuarzo Gris Cemento (uniform fine-grain warm taupe-gray quartz), top surface and front edge. Same footprint and shape.
→ KICKBOARD — brushed aluminum strip at floor level, as in the reference photos.`,
  },
  melamina_grafito_scotch: {
    name: "Melamina Grafito Scotch",
    handles:
      "Copy the handle detail from the reference photos: flat handleless fronts — no knobs, no bar pulls, no chrome on the doors.",
    finish:
      "TWO-TONE SYSTEM, with the colors of the reference photos:\n  1. MAIN COLOR (lower cabinets, tall units, island body): dark matte graphite gray melamine, neutral (no blue tint), smooth and uniform.\n  2. ACCENT: warm WALNUT wood melamine with visible natural grain, medium brown with honey tones — on the upper cabinets, following the placement rules below.\n  3. COUNTERTOP: dark gray sintered stone with fine white marble-like veins, distinct from the cabinets.",
    apply: `Apply this material to:
→ LOWER cabinet fronts, tall units and the island body — dark graphite gray.
→ UPPER cabinets — first count the rows of upper doors in the client's photo, then:
   · ONE row (one door height from top to bottom): every upper door is ONE single piece of walnut from its top edge to its bottom edge. There is NO graphite strip above the walnut and NO new row — the gray top row only exists when the client's kitchen already has two rows.
   · TWO stacked rows already in the photo: the TOP row is graphite gray, the row CLOSEST to the countertop is walnut.
→ EVERY visible furniture panel (cabinet sides, end panels, island sides) — graphite gray. No panel keeps its original color.
→ THE COUNTERTOP and the island top — dark gray stone with fine white veins, top surface and front edge. Same footprint and shape.
Keep every door's size, position and count.`,
  },
  polimero_blanco_gloss: {
    name: "Polímero táctil White Gloss",
    handles:
      "Lower doors and drawers: Gola profile — one slim recessed HORIZONTAL channel in matte BLACK along the TOP edge, running as one continuous line across the whole lower run, flush with the fronts, as in the reference close-ups. Upper cabinets: NO handles and NO black lines at all — push-to-open, clean flat fronts. Tall units may have a short black bar pull, as in the reference photos. No vertical grooves, no knobs, no separate bar handles on lower or upper doors.",
    finish:
      "THREE MATERIALS, exactly as in the reference photos of the Presisso stand:\n  1. MAIN FRONTS: WARM WHITE high-gloss polymer — a soft ivory-white lacquer (about #EEEAE3), NOT cold blue-white. Mirror-like gloss: it shows soft specular highlights from the ceiling lights and faint reflections of the room. A flat white without reflections is wrong.\n  2. ACCENT BAND: TAUPE (warm gray-brown, about #6B615C) — the row of upper cabinets closest to the countertop, satin finish.\n  3. COUNTERTOP: \"PRESTONE Rose\" sintered stone — warm white/ivory base with sparse, thin, long golden-copper veins running diagonally (like Calacatta Gold, with warmer golden-brown veins, never gray). Matte-satin, clearly different from the glossy doors.",
    apply: `Apply this material to:
→ LOWER cabinet fronts, drawers and tall units — warm white high-gloss slab. Replace any wooden, painted, raised-panel or shaker door. Same size, position and count as the original doors.
→ UPPER cabinets — first count the rows of upper doors in the client's photo, then:
   · ONE row (one door height from top to bottom): every upper door is ENTIRELY taupe, top to bottom. Do not split it.
   · TWO stacked rows already in the photo: the TOP row is warm white gloss, the row CLOSEST to the countertop is taupe.
→ EVERY visible furniture panel (cabinet sides, end panels) — warm white gloss. No panel keeps its original color.
→ THE COUNTERTOP — PRESTONE Rose stone, top surface and front edge. Same footprint.
→ THE ISLAND — its top AND its exposed sides and body are clad in the same PRESTONE Rose stone, like the waterfall island in the reference photos. Same footprint and shape.
→ REFERENCE PHOTOS: copy only the materials. Do NOT copy the stand's stone backsplash, walls, lighting niche, glass display cabinet or appliances. Walls, backsplash and floor come from the client's photo.`,
  },
};

/* ── Shared clean-up list (step 1 of both modes) ─────────────────────── */

export const LOOSE_OBJECTS = `Remove every loose, movable object from the scene:
- Sitting ON TOP of countertops, of the island and of the stovetop (remove the objects, never the counter or the island under them): bottles, cartons, cans, jars, cups, glasses, plates, bowls, pots, pans, lids, trays, cutting boards, knives, utensils, food, fruit, dish racks, sponges, rags, towels, bags, boxes, papers, chargers, tablets, phones, cleaning products.
- Small countertop appliances: coffee machines, kettles, toasters, blenders, mixers.
- On the fridge door: magnets, stickers, notes, papers, photos.
- On the floor: trash bins and pedal bins (even large metal ones standing next to the furniture), buckets, bags, boxes, shoes, mats.
- On top of cabinets and appliances: anything stored there.
- Potted plants and decorative objects sitting on counters or on top of cabinets.
- Construction leftovers, in kitchens still being built: cement mixers, sacks of cement, sand or plaster, rubble and debris piles, paint cans, ladders, wheelbarrows and large tools standing on the floor or against the walls.
Scan the photo left to right and top to bottom; if an object is not built in, remove it. Rebuild the surface behind each removed object so it looks continuous and untouched.`;

/* ── Step 1 prompt for REDESIGN mode: declutter only, change nothing else ── */

export const CLEAN_EXISTING_PROMPT = `Edit this image. Declutter this kitchen for a professional interior photoshoot. This step only removes objects; it changes nothing else.

${LOOSE_OBJECTS}

FURNITURE IS NEVER REMOVED. Islands, peninsulas, breakfast bars and every cabinet are built-in furniture, even when they are covered with objects: clear what is on top and keep the furniture itself, whole.

Keep exactly as they are, with no change in color, shape, size or position:
- Every cabinet door, drawer, countertop, island, peninsula and breakfast bar.
- Every large appliance: fridge, oven, cooktop, range hood, microwave, dishwasher, washing machine.
- Sink, faucet, light fixtures, outlets, windows, doors.
- Walls, backsplash, tiles, floor, ceiling.
- Camera angle, framing, lighting and aspect ratio — no crop, no zoom, no reframing.

The result is the same photo of the same kitchen, just tidy, with every surface clear.`;

/* ── Step 2 prompt for REDESIGN mode: reskin the decluttered kitchen ─── */

function buildPrompt(mat: MaterialDef): string {
  return `Edit this image. Replace the cabinet fronts and the countertop of this kitchen with Presisso "${mat.name}". Everything else in the photo stays exactly as it is.

IMAGES, in order:
0. The client's ORIGINAL photo, before clean-up — the STRUCTURE REFERENCE. Every island, peninsula, breakfast bar, cabinet run and large appliance visible in it must exist in your output, in the same place. Only its small loose objects are gone.
1. The client's kitchen after clean-up — the photo you edit. Its surfaces are already clear.
2. Reference photos of Presisso "${mat.name}" — THE AUTHORITY for the material: copy their exact colors, gloss, texture and handle detail. If anything written below seems to differ from these photos, match the photos. Ignore their rooms, walls, backsplash, floor, appliances, objects and camera angle — and NEVER copy their cabinet layout: their number of door rows, door sizes and divisions are not the client's.
3. The client's kitchen again — your output matches its framing and aspect ratio exactly.

KEEP EXACTLY AS IN THE CLIENT'S PHOTO:
- Camera angle, framing and aspect ratio. No crop, no zoom, no reframing.
- Walls, backsplash, tiles, floor, ceiling, windows, doors and light fixtures.
- Every appliance (fridge, oven, cooktop, range hood, microwave, dishwasher): same model, color and position.
- Sink and faucet.
- Every cabinet and counter section — including islands, peninsulas and breakfast bars — with the same count, size, shape and position as in the ORIGINAL photo (image 0). Nothing added, nothing removed, nothing extended. If the cleaned photo is missing a piece of furniture that the original has, put it back. A wall that is bare in the original stays bare: a side wall is never a counter return, and a bare wall above the counter never gets upper cabinets.
- Clear surfaces. Do not add any object: no coffee machine, kettle, bottles, plants, bowls, decor, stools or chairs. If a loose object is still visible — a trash bin, bottle or bag — remove it as well.

CHANGE ONLY THIS — the Presisso "${mat.name}" material:
${mat.finish}

${mat.apply}

Door style: flat slab fronts with no frames, panels or moldings. Keep every door's exact size, position and count — never split a door into two, never add a new row or a horizontal division that is not in the client's photo.
Full coverage: every visible part of the furniture — fronts, sides, end panels, island body, shelf frames — ends up in the Presisso material. No part of the furniture keeps the old color or finish, except where the material defines a two-tone layout.
Handles: ${mat.handles}
Countertop edge: straight and square, about 35–40 mm thick.

REALISM — the new surfaces must look installed, not pasted on:
- They take the room's real light: the same highlights, shadows and color shifts the original cabinets had.
- They follow the room's perspective: farther doors look smaller and darker.
- Gaps between doors, edges and shadow lines read as three-dimensional.

CHECK BEFORE YOU ANSWER — redo the image if any line is false:
1. Only the furniture changed: fronts, panels, handles and countertop.
1b. The colors match the reference photos, and no piece of furniture keeps its old color.
2. Same number of cabinet and counter sections, door rows and doors as the original, in the same places. Count the rows of upper doors in the original and in your image: the numbers must be equal.
3. Every appliance is identical to the original.
4. Walls, backsplash, floor and ceiling are identical to the original.
5. Every countertop and the island are clear — no objects anywhere.
6. The handles follow the rule above and nothing else.
7. Same framing and aspect ratio as the original.`;
}

/* ── Step 3 prompt for REDESIGN mode: final render from the color guide ── */

export function buildRefinePrompt(mat: MaterialDef): string {
  return `Edit IMAGE 1. It is a kitchen where the cabinet fronts and countertops were roughly painted with the exact colors of Presisso "${mat.name}". The colors are correct but the surfaces look flat and pasted on.
Re-render it as a real, professional interior photo: the cabinets and countertops must look like real installed furniture made of this material, with natural soft shadows, crisp straight edges, visible gaps between doors, correct perspective and the room's real light.
IMAGE 4 is the client's kitchen before the new material — the STRUCTURE REFERENCE only (ignore its colors). Furniture exists ONLY where IMAGE 4 has furniture: every wall area that is bare in IMAGE 4 stays a bare wall in your output. Never add upper cabinets, tall units, columns, shelves or a counter return that IMAGE 4 does not have.
KEEP EXACTLY: the colors and hue of the fronts and countertops (match IMAGE 2 for the fronts and IMAGE 3 for the countertop), every door, the island, every appliance, the walls, backsplash, floor and framing. Do not add any object. Handles: ${mat.handles}
No mirror reflections on the doors; the finish follows the material: ${mat.finish.split("\n")[0].slice(0, 260)}`;
}

/* ── Export generated prompts ───────────────────────────────────────── */

export const PROMPTS: Record<string, string> = {};
for (const [key, mat] of Object.entries(MATERIALS)) {
  PROMPTS[key] = buildPrompt(mat);
}

export type PromptType = keyof typeof MATERIALS;
