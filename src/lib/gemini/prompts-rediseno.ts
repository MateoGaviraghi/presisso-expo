/* ── Material definitions for prompt generation ─────────────────────── */

interface MaterialDef {
  name: string;        // e.g. "Politex Negro"
  finish: string;      // FINISH line in TASK 2
  apply: string;       // "Apply this material to:" paragraph
}

export const MATERIALS: Record<string, MaterialDef> = {
  politex_negro: {
    name: "Politex Negro",
    finish: "TRUE BLACK matte Politex — a deep, rich, solid black with nano-textured micro-grain surface like brushed leather. The darkest possible black — NOT dark gray, NOT charcoal, but pure deep black. Absorbs light completely — NOT glossy, NOT reflective, NOT shiny. Look at the reference photos: the cabinets are jet black, matching the black backsplash and black countertop.",
    apply: `Apply this material to:
→ ALL cabinet door fronts and drawer fronts — replace ONLY the front face with the matte black flat slab. Keep every door's exact dimensions, position, and count. The black material stops at the door edge — no bleed.
→ THE COUNTERTOP — replace ONLY the top surface and front edge with the same deep black material. Same footprint, same shape. Do NOT extend it.`,
  },
  melamina_litio: {
    name: "Melamina Litio",
    finish: "Warm off-white matte melamine — like vanilla ice cream or ivory paper. A soft, luminous white with a gentle warm undertone (never cold/blue). Smooth, perfectly uniform matte surface with zero texture, zero wood grain — just a clean, even, solid color. The cabinets and countertop are the SAME warm off-white color. Study the reference photos: the cabinets look bright white under direct light, and slightly warm/creamy in shadows. Match this exact color behavior in the client's lighting conditions.",
    apply: `Apply this material to:
→ ALL cabinet door fronts and drawer fronts — replace ONLY the front face with the Melamina Litio flat slab. Keep every door's exact dimensions, position, and count. The material stops at the door edge — no bleed.
→ THE COUNTERTOP — replace ONLY the top surface and front edge with the same warm off-white material. Same footprint, same shape. Do NOT extend it.`,
  },
  politex_gris_grafito: {
    name: "Politex Gris Grafito",
    finish: "DARK ANTHRACITE/CHARCOAL matte Politex — a very dark warm gray, like charcoal or dark slate. It is DARKER than medium gray but NOT black — it is clearly a dark gray when seen next to white walls. Warm undertone (slightly brownish), NOT cold or blue. Nano-textured micro-grain matte surface like brushed leather. NOT glossy, NOT reflective. NOT medium gray, NOT light gray, NOT blue-gray, NOT black. NO WOOD — all cabinets are the same dark anthracite, no walnut or oak accents.\nThe COUNTERTOP is a SEPARATE material from the cabinets: a textured dark gray porcelain/stone that looks like polished concrete — medium-dark gray with visible lighter speckles, patches, and cement-like grain pattern. The countertop is LIGHTER than the cabinets and has VISIBLE TEXTURE. Study the close-up countertop reference photos carefully to see this texture.",
    apply: `Apply this material to:
→ ALL cabinet door fronts and drawer fronts — replace ONLY the front face with the dark anthracite/charcoal Politex flat slab. Keep every door's exact dimensions, position, and count. The material stops at the door edge — no bleed.
→ THE COUNTERTOP — replace ONLY the top surface and front edge with a TEXTURED STONE/PORCELAIN that looks like polished dark concrete — medium-dark gray with visible lighter speckles and cement-like grain. It must look DIFFERENT from the cabinets (lighter, textured vs smooth). Same footprint, same shape. Do NOT extend it.`,
  },
  melamina_grafito_scotch: {
    name: "Melamina Grafito Scotch",
    finish: "TWO-TONE SYSTEM — this kitchen uses TWO cabinet materials plus a special countertop:\n  1. MAIN CABINETS (lower doors + upper top row): Dark matte graphite gray melamine — a deep blue-gray charcoal, smooth uniform surface. Similar darkness to dark slate/anthracite. NOT glossy, NOT shiny.\n  2. ACCENT BAND (upper cabinets middle row, between the top grafito row and the countertop): Warm WALNUT WOOD melamine with visible natural wood grain pattern, medium-brown tone with golden/honey undertones.\n  3. COUNTERTOP: \"Armani Dark Gray\" sintered stone — dark gray base with fine white marble-like veining. NOT the same material as the cabinets.\nLook at the reference photos carefully: the upper cabinets have a dark grafito section on top AND a walnut wood section below it. The countertop is a dark veined stone, distinct from the cabinet material.",
    apply: `Apply this material to:
→ LOWER cabinet door fronts and drawer fronts — replace ONLY the front face with the dark graphite gray flat slab.
→ UPPER cabinets TOP ROW — replace with the same dark graphite gray.
→ UPPER cabinets MIDDLE/LOWER ROW (the band closest to the countertop, where the range hood area is) — replace with the warm walnut wood melamine. Study the reference photos to see exactly which upper cabinets are walnut vs grafito.
→ THE COUNTERTOP — replace ONLY the top surface and front edge with "Armani Dark Gray" sintered stone: a dark gray stone with subtle white/light veining, similar to dark marble. Study the close-up countertop reference photos carefully — the surface has fine white veins running through a dark gray base. Same footprint, same shape. Do NOT extend it.
Keep every door's exact dimensions, position, and count. The material stops at the door edge — no bleed.`,
  },
};

/* ── Prompt template for REDESIGN mode (existing kitchen) ────────────── */

function buildPrompt(mat: MaterialDef): string {
  return `Edit this image. Using the provided kitchen photo, change only the cabinet door fronts and countertop to Presisso "${mat.name}" material. Keep everything else in the image exactly the same, preserving the original style, lighting, composition, and every non-cabinet element.

Think of it as a carpenter walking in, swapping the old cabinet doors and countertop for brand-new Presisso "${mat.name}" ones, and leaving. The room, appliances, walls, floor — everything else stays untouched.

IMAGES (in order):
- FIRST: The client's kitchen photo — this is what you are editing.
- MIDDLE: Reference photos of Presisso "${mat.name}" kitchens — study ONLY the material finish and door style. Ignore their room layout, camera angle, and appliance placement.
- LAST: The client's kitchen photo AGAIN — your output must match this exact framing, dimensions, and aspect ratio.

OUTPUT DIMENSIONS: Your output must have the EXACT same aspect ratio, dimensions, orientation, and framing as the client's kitchen photo. Show the complete scene edge to edge. Landscape stays landscape, portrait stays portrait. Do not crop, zoom, or reframe.

STEP 1 — THOROUGHLY CLEAN THE SCENE

Make the kitchen look magazine-ready. Be aggressive — remove ALL loose objects from every surface (countertops, stovetop, floor, appliance tops, shelves). Remove: bottles, cans, jars, dishes, plates, bowls, cups, food, loose utensils, cutting boards, rags, towels, sponges, dish racks, pots, pans, bags, boxes, packaging, papers, chargers, cloths, cleaning products, and any random small objects. Scan left to right, top to bottom — if it's not bolted down or a permanent appliance, remove it. Fill cleaned areas seamlessly with the clean surface behind them.

Keep ONLY permanent fixtures exactly as they appear:
- Appliances (fridge, oven, stovetop, range hood, microwave, dishwasher) — same color, brand, position
- Sink, faucet, plumbing, wall fixtures, lights

STEP 2 — RESKIN CABINET DOORS AND COUNTERTOP

Study the "${mat.name}" material from the reference photos:
- FINISH: ${mat.finish}
- DOOR STYLE: Flat slab — no frames, no panels, no moldings.
- HANDLES (lower cabinets): Recessed vertical channel groove on the door edge, same color as door.
- HANDLES (upper cabinets): No handles — push-to-open, clean flat surface.
- COUNTERTOP: Straight square edge, ~35-40mm thick.

${mat.apply}

PHOTOREALISM — make the new surfaces look naturally installed, not pasted on:
- Match the room's existing lighting: where light falls on cabinets, the new material should show the same highlights and shadows as the original doors did.
- Respect perspective and depth — doors farther from the camera appear smaller and darker, following the room's vanishing points.
- The material color shifts naturally under the room's light: warmer near warm light sources, cooler in shadow. Copy this behavior from how the original cabinets interacted with the light.
- Edges, gaps between doors, and shadow lines should look three-dimensional, not flat.

STRICTLY FORBIDDEN — do not add ANY of these:
- No islands, peninsulas, breakfast bars, or counter extensions that are not in the original photo
- No new appliances, furniture, stools, chairs, or decorative objects
- No new cabinets or countertop sections where none existed
- If the original kitchen does NOT have a bar or peninsula, your output must NOT have one either

KEEP IDENTICAL — everything Presisso does not sell:
- All appliances exactly as they appear (same color, brand, position)
- Sink and faucet
- Walls, tiles, backsplash, paint, floor, ceiling
- Windows, doors, lights, room layout, camera angle, lighting
- If the kitchen has an island or peninsula, keep its exact shape and position — only reskin surfaces

You may place 1-2 small countertop items (coffee machine, kettle, or toaster) for a lived-in look.

VERIFY before outputting:
✓ Output is the same photo with only surfaces changed — not a new image
✓ Count the counter sections in the original — your output must have the SAME number. If the original has no island/bar, your output must have none.
✓ Every appliance identical to the original (check fridge color, oven, range hood)
✓ Countertops are thoroughly clean — no clutter remaining on any surface
✓ Cabinet doors and countertop show Presisso ${mat.name} finish
✓ Walls, floor, sink, backsplash — all identical to original
✓ Aspect ratio and framing match the original exactly`;
}

/* ── Export generated prompts ───────────────────────────────────────── */

export const PROMPTS: Record<string, string> = {};
for (const [key, mat] of Object.entries(MATERIALS)) {
  PROMPTS[key] = buildPrompt(mat);
}

export type PromptType = keyof typeof MATERIALS;
