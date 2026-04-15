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
    finish: "WHITE CREAM melamine — a clean white with a very subtle warm/cream undertone. The color is WHITE, not gray. Think of it as white paper with a 5% warm cream tint. Smooth, uniform matte surface with NO wood grain — clean, even, solid color. NOT gray at all — NOT light gray, NOT medium gray, NOT any shade of gray. The cabinets in the reference photos are WHITE with warmth, like ivory or cream-white. The countertop is the SAME white-cream color. NOT glossy, NOT reflective, NOT shiny. Look carefully at the reference photos: the color is clearly white, not gray.",
    apply: `Apply this material to:
→ ALL cabinet door fronts and drawer fronts — replace ONLY the front face with the Melamina Litio flat slab. Keep every door's exact dimensions, position, and count. The material stops at the door edge — no bleed.
→ THE COUNTERTOP — replace ONLY the top surface and front edge. Same footprint, same shape. Do NOT extend it.`,
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
  return `You are editing a kitchen photo for a Presisso furniture catalog. Presisso ONLY sells kitchen cabinetry — cabinet doors, drawer fronts, and countertops. Nothing else. Think of it this way: a carpenter walks in, removes the old cabinet doors and countertop, installs brand-new Presisso "${mat.name}" ones, and leaves. Everything else in the kitchen stays exactly as it was.

CRITICAL RULE — PRESERVE THE KITCHEN LAYOUT:
⚠️ ABSOLUTELY DO NOT REMOVE ANY ISLAND, PENINSULA, BREAKFAST BAR, OR COUNTER EXTENSION. ⚠️
The kitchen in IMAGE 1 may have a counter that extends outward into the room — a peninsula, a breakfast bar, an island, or an L-shaped / U-shaped counter extension. Look carefully at the FOREGROUND of IMAGE 1: if there is a countertop surface extending toward the camera, that is an island or peninsula and it is STRUCTURAL — like a wall. It MUST appear in your output with the EXACT same shape, size, position, and proportions as in IMAGE 1. You may ONLY reskin its door fronts and countertop surface with the new material, but the structure itself MUST NOT be removed, shrunk, moved, hidden, or altered in any way. Count the number of distinct counter sections in IMAGE 1 — your output MUST have the exact same number. If you remove an island or peninsula, your output is WRONG.

⚠️ ABSOLUTELY DO NOT ADD ANY ISLAND, PENINSULA, BREAKFAST BAR, OR COUNTER EXTENSION THAT IS NOT IN IMAGE 1. ⚠️
If IMAGE 1 does NOT have an island or peninsula, your output must NOT have one either. Do NOT invent or add kitchen structures that do not exist in the original photo.

OUTPUT RULES — DO NOT VIOLATE:
- The output MUST have the EXACT same aspect ratio, dimensions, orientation, and framing as IMAGE 1.
- Show the COMPLETE scene from edge to edge — everything visible in IMAGE 1 must be visible in your output. Do NOT crop any side.
- Do NOT zoom in. If the fridge is on the left edge and the oven is on the right edge in IMAGE 1, both must be fully visible in your output at the same positions.
- Landscape stays landscape. Portrait stays portrait. No rotation.

IMAGES PROVIDED:
- IMAGE 1: The client's kitchen photo — your canvas.
- IMAGES 2+: Reference photos of Presisso "${mat.name}" installed kitchens — study the MATERIAL from these. Do NOT copy their kitchen layout — only copy the material finish and door style.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 1 — DECLUTTER THE SCENE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before touching anything, clean up loose clutter so the kitchen looks magazine-ready. Scan every surface — countertops, stovetop, appliance tops, floor, shelves.

REMOVE only disposable clutter — things a person would put away before a photoshoot: bottles, cans, jars, dirty dishes, plates, bowls, food items, loose utensils, cutting boards, rags, towels, sponges, dish racks, pots left on the stove, trash cans, bags, packaging, papers, chargers, and random small objects.

KEEP everything that is part of the kitchen's permanent setup:
- ALL appliances, exactly as they appear — refrigerator, oven, stovetop, range hood, microwave, dishwasher, washing machine. Do NOT change their color, position, brand, or appearance in any way. Do NOT add appliances that are not in the original photo.
- Small countertop appliances that appear intentionally placed: coffee machine, kettle, toaster. These are part of the kitchen's décor — keep them.
- ⚠️ Breakfast bars, islands, peninsulas, and ANY countertop extension (including those in the foreground of the photo) — these are STRUCTURAL parts of the kitchen layout, like a wall. They are NOT clutter. NEVER remove them. Keep their exact shape, size, and position. You may only reskin their surfaces with the new material.
- Sink, faucet, all plumbing
- Wall-mounted shelves, lights, clocks, plants, and built-in fixtures

Where you remove clutter, fill the space with the clean surface behind it — matching lighting, color, and texture seamlessly, as if the object was never there.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 2 — RESKIN ONLY CABINET DOORS AND COUNTERTOP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Study the Presisso "${mat.name}" material from IMAGES 2+:
- FINISH: ${mat.finish}
- DOOR STYLE: Flat slab — no frames, no panels, no moldings. Pure flat rectangle.
- HANDLES (lower cabinets): Recessed vertical channel groove on the door edge, same color as the door, nearly invisible. Not a bar, not a knob.
- HANDLES (upper cabinets): No handles. Push-to-open. Clean flat surface.
- COUNTERTOP: Same material as the doors. Straight square edge, ~35-40mm thick.
- GAPS: Hairline-thin gaps between adjacent doors.

${mat.apply}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DO NOT TOUCH — EVERYTHING ELSE STAYS IDENTICAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Presisso does NOT sell appliances, sinks, faucets, range hoods, walls, floors, or anything other than cabinet fronts and countertops. Therefore, do NOT modify:
- Appliances — the refrigerator, oven, microwave, range hood, washing machine, dishwasher MUST remain exactly as they appear in IMAGE 1. Same color, same brand, same position. Do NOT replace, recolor, or redesign any appliance.
- Small countertop appliances (coffee machine, kettle, toaster) — if already present, keep as-is
- Breakfast bar, island, or peninsula — these are structural. Keep shape, size, and position unchanged. Only reskin their cabinet fronts and countertop surface.
- Sink and faucet
- Walls, tiles, backsplash, paint
- Floor, ceiling, windows, doors, lights
- Room layout, camera angle, or lighting

Do NOT add large appliances (refrigerator, oven, microwave, dishwasher) that are not in IMAGE 1. Do NOT remove any appliance or structural element. Do NOT add cabinets where none existed. Do NOT extend the countertop beyond its original footprint. Do NOT add an island or peninsula that is not in IMAGE 1.

EXCEPTION — you MAY place 1-2 small countertop items on the clean counter for a lived-in, realistic look: a coffee machine, an electric kettle, or a toaster. Place them naturally on the countertop, away from the sink. These are the ONLY new objects you may add.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINAL VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before outputting, compare your result against IMAGE 1 and verify:
✓ Loose clutter removed? Check counters, stovetop, floor.
✓ Small appliances (coffee machine, kettle, toaster) still present? They must stay.
✓ ALL large appliances identical to IMAGE 1? Compare the fridge — same color, same brand, same magnets. Compare the oven, microwave, range hood. Nothing changed?
✓ ⚠️ ISLAND / PENINSULA / BREAKFAST BAR CHECK: Look at IMAGE 1 foreground — is there a counter extending toward the camera? If yes, it MUST be in your output with the same shape and size. If you removed it, your output is WRONG — add it back immediately. Only the surface material should change, not the structure.
✓ ⚠️ NOTHING ADDED CHECK: Did you ADD an island, peninsula, counter extension, or any structure that was NOT in IMAGE 1? If yes, REMOVE IT immediately. The kitchen layout must be identical to IMAGE 1.
✓ No new object was ADDED that was not in IMAGE 1? Check ceiling carefully — no fans, lights, or fixtures that weren't in the original. Check walls — no new shelves, clocks, or decorations. If you added ANYTHING not in IMAGE 1, remove it.
✓ Cabinet doors and countertop show Presisso ${mat.name} finish?
✓ Walls, floor, sink, backsplash, faucet — all identical to original?
✓ Aspect ratio matches IMAGE 1 exactly?`;
}

/* ── Export generated prompts ───────────────────────────────────────── */

export const PROMPTS: Record<string, string> = {};
for (const [key, mat] of Object.entries(MATERIALS)) {
  PROMPTS[key] = buildPrompt(mat);
}

export type PromptType = keyof typeof MATERIALS;
