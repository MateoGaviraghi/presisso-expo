/* ── Material definitions for prompt generation ─────────────────────── */

interface MaterialDef {
  name: string;        // e.g. "Politex Negro"
  finish: string;      // FINISH line in TASK 2
  apply: string;       // "Apply this material to:" paragraph
}

const MATERIALS: Record<string, MaterialDef> = {
  politex_negro: {
    name: "Politex Negro",
    finish: "TRUE BLACK matte Politex — a deep, rich, solid black with nano-textured micro-grain surface like brushed leather. The darkest possible black — NOT dark gray, NOT charcoal, but pure deep black. Absorbs light completely — NOT glossy, NOT reflective, NOT shiny. Look at the reference photos: the cabinets are jet black, matching the black backsplash and black countertop.",
    apply: `Apply this material to:
→ ALL cabinet door fronts and drawer fronts — replace ONLY the front face with the matte black flat slab. Keep every door's exact dimensions, position, and count. The black material stops at the door edge — no bleed.
→ THE COUNTERTOP — replace ONLY the top surface and front edge with the same deep black material. Same footprint, same shape. Do NOT extend it.`,
  },
  melamina_litio: {
    name: "Melamina Litio",
    finish: "VERY LIGHT warm gray melamine — close to off-white, almost white but with a subtle warm/beige undertone. Think 90% white, 10% warm gray. Smooth, uniform matte surface with NO wood grain — clean, even, solid color. NOT medium gray, NOT dark gray, NOT pure white. Look at the reference photos: the cabinets are nearly white with just a hint of warmth. NOT glossy, NOT reflective, NOT shiny.",
    apply: `Apply this material to:
→ ALL cabinet door fronts and drawer fronts — replace ONLY the front face with the Melamina Litio flat slab. Keep every door's exact dimensions, position, and count. The material stops at the door edge — no bleed.
→ THE COUNTERTOP — replace ONLY the top surface and front edge. Same footprint, same shape. Do NOT extend it.`,
  },
  politex_gris_grafito: {
    name: "Politex Gris Grafito",
    finish: "DARK GRAPHITE GRAY matte Politex — a very dark charcoal gray (approximately 85% black, 15% gray), NOT pure black but a rich dark gray with a subtle warm undertone. Nano-textured micro-grain surface like brushed leather. Almost black but when you look closely you see it is dark gray, not black. Look at the reference photos: the cabinets are very dark gray with a stone-like countertop that has visible texture. NOT glossy, NOT reflective, NOT shiny. NOT medium gray — this is VERY dark, close to black.",
    apply: `Apply this material to:
→ ALL cabinet door fronts and drawer fronts — replace ONLY the front face with the dark graphite gray flat slab. Keep every door's exact dimensions, position, and count. The gray material stops at the door edge — no bleed.
→ THE COUNTERTOP — replace ONLY the top surface and front edge with a matching dark stone-textured surface. Same footprint, same shape. Do NOT extend it.`,
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

/* ── Prompt template (identical rules for all materials) ────────────── */

function buildPrompt(mat: MaterialDef): string {
  return `You are editing a kitchen photo for a Presisso furniture catalog. Presisso ONLY sells kitchen cabinetry — cabinet doors, drawer fronts, and countertops. Nothing else. Think of it this way: a carpenter walks in, removes the old cabinet doors and countertop, installs brand-new Presisso "${mat.name}" ones, and leaves. Everything else in the kitchen stays exactly as it was.

CRITICAL RULE — PRESERVE THE KITCHEN LAYOUT:
⚠️ ABSOLUTELY DO NOT REMOVE ANY ISLAND, PENINSULA, BREAKFAST BAR, OR COUNTER EXTENSION. ⚠️
The kitchen in IMAGE 1 may have a counter that extends outward into the room — a peninsula, a breakfast bar, an island, or an L-shaped / U-shaped counter extension. Look carefully at the FOREGROUND of IMAGE 1: if there is a countertop surface extending toward the camera, that is an island or peninsula and it is STRUCTURAL — like a wall. It MUST appear in your output with the EXACT same shape, size, position, and proportions as in IMAGE 1. You may ONLY reskin its door fronts and countertop surface with the new material, but the structure itself MUST NOT be removed, shrunk, moved, hidden, or altered in any way. Count the number of distinct counter sections in IMAGE 1 — your output MUST have the exact same number. If you remove an island or peninsula, your output is WRONG.

OUTPUT RULES — DO NOT VIOLATE:
- The output MUST have the EXACT same aspect ratio, dimensions, orientation, and framing as IMAGE 1.
- Show the COMPLETE scene from edge to edge — everything visible in IMAGE 1 must be visible in your output. Do NOT crop any side.
- Do NOT zoom in. If the fridge is on the left edge and the oven is on the right edge in IMAGE 1, both must be fully visible in your output at the same positions.
- Landscape stays landscape. Portrait stays portrait. No rotation.

IMAGES PROVIDED:
- IMAGE 1: The client's kitchen photo — your canvas.
- IMAGES 2+: Reference photos of Presisso "${mat.name}" installed kitchens — study the MATERIAL from these.

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
- Small countertop appliances (coffee machine, kettle, toaster) — keep as-is
- Breakfast bar, island, or peninsula — these are structural. Keep shape, size, and position unchanged. Only reskin their cabinet fronts and countertop surface.
- Sink and faucet
- Walls, tiles, backsplash, paint
- Floor, ceiling, windows, doors, lights
- Room layout, camera angle, or lighting

Do NOT add any object, appliance, or piece of furniture that is not in IMAGE 1. Do NOT remove any appliance or structural element. Do NOT add cabinets where none existed. Do NOT extend the countertop beyond its original footprint.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINAL VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before outputting, compare your result against IMAGE 1 and verify:
✓ Loose clutter removed? Check counters, stovetop, floor.
✓ Small appliances (coffee machine, kettle, toaster) still present? They must stay.
✓ ALL large appliances identical to IMAGE 1? Compare the fridge — same color, same brand, same magnets. Compare the oven, microwave, range hood. Nothing changed?
✓ ⚠️ ISLAND / PENINSULA / BREAKFAST BAR CHECK: Look at IMAGE 1 foreground — is there a counter extending toward the camera? If yes, it MUST be in your output with the same shape and size. If you removed it, your output is WRONG — add it back immediately. Only the surface material should change, not the structure.
✓ No new object was ADDED that was not in IMAGE 1? Check ceiling carefully — no fans, lights, or fixtures that weren't in the original. Check walls — no new shelves, clocks, or decorations. If you added ANYTHING not in IMAGE 1, remove it.
✓ Cabinet doors and countertop show Presisso ${mat.name} finish?
✓ Walls, floor, sink, backsplash, faucet — all identical to original?
✓ Aspect ratio matches IMAGE 1 exactly?`;
}

/* ── Prompt template for DESIGN mode (empty kitchen) ────────────────── */

function buildDesignPrompt(mat: MaterialDef): string {
  return `Edit this image. Insert Presisso "${mat.name}" kitchen furniture into this EXACT photo.

CRITICAL: You are NOT generating a new image. You are EDITING IMAGE 1. Every pixel of the room that is not a cabinet, countertop, or backsplash area must remain IDENTICAL — same room, same walls, same floor, same perspective, same camera angle, same doors, same windows, same dimensions. If you compare your output with IMAGE 1, the room structure must match perfectly. Only the furniture changes.

IMAGE 1: The client's kitchen — your base photo. Do not change this room.
IMAGES 2+: Presisso "${mat.name}" reference — copy the material finish and cabinet style from these photos.

STEP 1 — CLEAN THE PHOTO:
Remove construction debris and clutter from IMAGE 1: rolled carpets, tools, bicycle parts, loose objects on counters and floor. Fill those areas with the clean wall/floor surface behind them. Clean up wall imperfections — keep the same wall color and tile pattern, just make them look freshly maintained. A subtle complementary wall color is acceptable where walls are visibly unfinished (bare concrete, peeling paint). The floor stays exactly as-is.

STEP 2 — RESKIN EXISTING CABINETS:
If IMAGE 1 already has lower cabinets and/or a countertop, they stay in their EXACT position, size, and shape. Only change the surface:
- Replace door fronts with Presisso "${mat.name}" flat slab doors. FINISH: ${mat.finish}
- Replace countertop surface with matching material. Straight square edge, ~35-40mm thick.
- Lower cabinet handles: recessed vertical channel groove, same color as door.

STEP 3 — INSERT UPPER CABINETS:
If there are no upper cabinets in IMAGE 1, insert them on the wall above the existing countertop:
- ~55cm gap between countertop and bottom of upper cabinets.
- Same "${mat.name}" flat slab finish. No handles (push-to-open).
- They must align with the lower cabinets below — same width coverage.
- Do NOT place over windows or doors.
- Insert a backsplash panel (same "${mat.name}" material) covering ONLY the wall strip between countertop and upper cabinets. Wall above and beside cabinets stays as the original wall.

STEP 4 — INSERT APPLIANCES (only what fits):
Look at the ACTUAL available space in IMAGE 1. Only insert appliances that physically fit:
- COOKTOP: Black induction, flush in countertop. Only if there is counter space for it.
- RANGE HOOD: Slim, dark, above the cooktop. Only if there is wall space.
- SMALL OVEN or MICROWAVE: Built into the cabinet run. Only if there is a gap or space for it.
- SMALL COUNTER APPLIANCES: A coffee machine, kettle, or toaster on the countertop — 1 or 2 items max.
- REFRIGERATOR: Only if IMAGE 1 has a clearly open area at one end large enough for a fridge. If the space is narrow or there is no room, do NOT add a fridge.
- If an appliance already exists in IMAGE 1, keep it exactly where it is.
- Do NOT force any appliance into a space where it does not fit. Leave gaps around appliances — a real kitchen has breathing room.

STEP 5 — PHOTOREALISM:
- Lighting on new elements must match IMAGE 1's existing light sources and direction.
- New cabinets cast realistic shadows on walls and floor.
- Cabinets sit flush on the existing floor and against existing walls.
- All new edges follow IMAGE 1's exact perspective and vanishing points.
- The result should look like a real photograph of a finished kitchen, not a 3D render.

REMEMBER: IMAGE 1 is the base. You are inserting furniture INTO it, like placing furniture in an architectural floor plan. The room does not change. The camera does not move. Only furniture and appliances are added or reskinned.`;
}

/* ── Export generated prompts ───────────────────────────────────────── */

export const PROMPTS: Record<string, string> = {};
export const DESIGN_PROMPTS: Record<string, string> = {};
for (const [key, mat] of Object.entries(MATERIALS)) {
  PROMPTS[key] = buildPrompt(mat);
  DESIGN_PROMPTS[key] = buildDesignPrompt(mat);
}

export type PromptType = keyof typeof MATERIALS;
