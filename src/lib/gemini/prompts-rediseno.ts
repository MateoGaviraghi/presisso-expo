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
    finish: "TWO-TONE SYSTEM — this kitchen uses TWO cabinet materials plus a special countertop:\n  1. MAIN CABINETS (lower doors + upper top row): Dark matte graphite gray melamine — a neutral dark charcoal, like graphite pencil lead or dark slate. The gray is NEUTRAL — absolutely NO blue tint, NO blue undertone, NO blue-gray. It is a pure dark gray, warm-neutral. Smooth uniform matte surface.\n  2. ACCENT BAND (upper cabinets middle row, between the top grafito row and the countertop): Warm WALNUT WOOD melamine with visible natural wood grain pattern, medium-brown tone with golden/honey undertones.\n  3. COUNTERTOP: \"Armani Dark Gray\" sintered stone — dark gray base with fine white marble-like veining. NOT the same material as the cabinets.\nLook at the reference photos carefully: the upper cabinets have a dark grafito section on top AND a walnut wood section below it. The countertop is a dark veined stone, distinct from the cabinet material.",
    apply: `Apply this material to:
→ LOWER cabinet door fronts and drawer fronts — replace ONLY the front face with the dark graphite gray flat slab.
→ UPPER cabinets TOP ROW — replace with the same dark graphite gray.
→ UPPER cabinets MIDDLE/LOWER ROW (the band closest to the countertop, where the range hood area is) — replace with the warm walnut wood melamine. Study the reference photos to see exactly which upper cabinets are walnut vs grafito.
→ THE COUNTERTOP — replace ONLY the top surface and front edge with "Armani Dark Gray" sintered stone: a dark gray stone with subtle white/light veining, similar to dark marble. Study the close-up countertop reference photos carefully — the surface has fine white veins running through a dark gray base. Same footprint, same shape. Do NOT extend it.
Keep every door's exact dimensions, position, and count. The material stops at the door edge — no bleed.`,
  },
  polimero_blanco_gloss: {
    name: "Polímero táctil White Gloss",
    finish: "ULTRA HIGH-GLOSS pure white polymer — a brilliant, mirror-like lacquered surface similar to piano-lacquer or polished enamel. The color is PURE COLD WHITE (like fresh snow or bright paper) — NOT cream, NOT ivory, NOT warm off-white, NOT beige. The surface is HIGHLY REFLECTIVE: it catches and reflects light sources as soft specular highlights and subtly mirrors the room around it, like a polished mirror or wet paint. A flat uniform white WITHOUT visible reflections would be WRONG — visible gloss with soft environmental reflections is the signature of this material. NOT matte, NOT satin, NOT semi-gloss — fully glossy lacquer finish. Study the reference photos: notice the clear specular highlights from overhead lights on each door panel and how the surface mirrors its surroundings.\nThe COUNTERTOP is a COMPLETELY SEPARATE material from the doors: \"PRESTONE Rose\" sintered stone — a soft white / warm ivory base with sparse, elegant golden-copper marble veins flowing diagonally across the surface (like Calacatta Gold marble, but with warmer golden-brown tones, NOT cold gray veining). The veins are thin, long and natural-looking — NOT busy, NOT uniformly distributed. Soft matte-to-satin finish, clearly distinguishable from the mirror-gloss doors.",
    apply: `Apply this material to:
→ ALL cabinet door fronts and drawer fronts — replace every front (including any wooden, painted, raised-panel, or shaker-style doors) with a smooth flat ultra-gloss white polymer slab. Mirror-bright surface, visible specular highlights. Keep every door's exact dimensions, position, and count.
→ THE COUNTERTOP — replace ONLY the top surface and front edge with PRESTONE Rose sintered stone as described in the FINISH above. Matte-satin, clearly a different material from the glossy doors. Same footprint — do NOT extend it.
→ HANDLES — OVERRIDE: this material uses the Gola profile — a slim recessed HORIZONTAL channel in matte BLACK at the TOP edge of every lower door and the BOTTOM edge of every upper door. NO vertical grooves, NO knobs, NO pulls on door faces.
→ REFERENCE PHOTOS: extract ONLY the white gloss door texture and Gola handle detail. Do NOT copy the showroom's marble walls, marble backsplash, or any background surfaces into the output. Walls, backsplash, and floor come from IMAGE 1 only.`,
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

BEFORE EDITING — CATALOG THE ORIGINAL PHOTO:
Look at the client's kitchen photo and identify these elements. Your output MUST contain every single one:
- How many separate counter/cabinet sections are there? (Count islands, peninsulas, L-shapes separately)
- What appliances are visible? (fridge, oven, microwave, range hood, dishwasher, washing machine — note each one's color and position)
- What structural elements are in the foreground? (islands, breakfast bars, peninsulas)
- What is the camera angle and framing? (your output must match it exactly)
Every element you identify here MUST appear in your output, unchanged except for cabinet door fronts and countertop surfaces.

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

MANDATORY — every item below MUST be true in your output (verify each one):
1. Output is the SAME photo with only cabinet door fronts and countertop surfaces changed
2. Every counter section from the original (islands, peninsulas, L-shapes) appears with SAME shape, size, position — count them
3. Every appliance from the original appears identical — same color, brand, position (check: fridge, oven, range hood, microwave)
4. ALL cabinet doors show the correct Presisso ${mat.name} finish from the reference photos — match the material exactly
5. Walls, floor, ceiling, tiles, backsplash, sink, faucet — all identical to original
6. Aspect ratio, framing, and camera angle match the original exactly
7. All loose clutter removed from surfaces — countertops are clean

PROHIBITIONS — if ANY of these appear, the output is WRONG:
1. NO islands, peninsulas, bars, or counter extensions that are NOT in the original photo
2. NO removed islands, peninsulas, or counter sections that ARE in the original photo
3. NO new appliances, furniture, stools, chairs, or decorative objects not in the original
4. NO changed appliance colors, brands, or positions
5. NO modified walls, floor, tiles, or backsplash
6. NO cropping, zooming, reframing, or aspect ratio change
7. NO single-material cabinets if the material spec defines multiple tones — follow the FINISH description exactly
8. NO flat, pasted-on look — surfaces must show realistic lighting, shadows, and depth

You may place 1-2 small countertop items (coffee machine, kettle, or toaster) for a lived-in look.`;
}

/* ── Export generated prompts ───────────────────────────────────────── */

export const PROMPTS: Record<string, string> = {};
for (const [key, mat] of Object.entries(MATERIALS)) {
  PROMPTS[key] = buildPrompt(mat);
}

export type PromptType = keyof typeof MATERIALS;
