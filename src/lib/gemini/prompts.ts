export const PROMPTS = {
  politex_negro: `You are editing a kitchen photo for a Presisso furniture catalog. Presisso ONLY sells kitchen cabinetry — cabinet doors, drawer fronts, and countertops. Nothing else. Think of it this way: a carpenter walks in, removes the old cabinet doors and countertop, installs brand-new Presisso "Politex Negro" ones, and leaves. Everything else in the kitchen stays exactly as it was.

CRITICAL RULE — PRESERVE THE KITCHEN LAYOUT: The kitchen in IMAGE 1 may have a counter that extends outward into the room — a peninsula, a breakfast bar, an island, or an L-shaped / U-shaped counter extension. This is a STRUCTURAL part of the kitchen, like a wall. It MUST appear in your output with the same shape, size, and position as in IMAGE 1. You may reskin its doors and countertop surface, but the structure itself MUST NOT be removed, shrunk, or altered. Count the number of distinct counter sections in IMAGE 1 — your output must have the same number.

OUTPUT: The result MUST preserve the EXACT aspect ratio, orientation, framing, and perspective of IMAGE 1. Landscape stays landscape. Portrait stays portrait. No crop. No zoom. No rotation.

IMAGES PROVIDED:
- IMAGE 1: The client's kitchen photo — your canvas.
- IMAGES 2+: Reference photos of Presisso "Politex Negro" installed kitchens — study the MATERIAL from these.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 1 — DECLUTTER THE SCENE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before touching anything, clean up loose clutter so the kitchen looks magazine-ready. Scan every surface — countertops, stovetop, appliance tops, floor, shelves.

REMOVE only disposable clutter — things a person would put away before a photoshoot: bottles, cans, jars, dirty dishes, plates, bowls, food items, loose utensils, cutting boards, rags, towels, sponges, dish racks, pots left on the stove, trash cans, bags, packaging, papers, chargers, and random small objects.

KEEP everything that is part of the kitchen's permanent setup:
- ALL appliances, exactly as they appear — refrigerator, oven, stovetop, range hood, microwave, dishwasher, washing machine. Do NOT change their color, position, brand, or appearance in any way. Do NOT add appliances that are not in the original photo.
- Small countertop appliances that appear intentionally placed: coffee machine, kettle, toaster. These are part of the kitchen's décor — keep them.
- Breakfast bars, islands, peninsulas, and any countertop extension — these are structural parts of the kitchen layout, NOT clutter. Keep them exactly as they are.
- Sink, faucet, all plumbing
- Wall-mounted shelves, lights, clocks, plants, and built-in fixtures

Where you remove clutter, fill the space with the clean surface behind it — matching lighting, color, and texture seamlessly, as if the object was never there.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 2 — RESKIN ONLY CABINET DOORS AND COUNTERTOP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Study the Presisso "Politex Negro" material from IMAGES 2+:
- FINISH: Deep matte black, nano-textured micro-grain like brushed leather. Absorbs light — NOT glossy, NOT reflective, NOT shiny.
- DOOR STYLE: Flat slab — no frames, no panels, no moldings. Pure flat rectangle.
- HANDLES (lower cabinets): Recessed vertical channel groove on the door edge, same black, nearly invisible. Not a bar, not a knob.
- HANDLES (upper cabinets): No handles. Push-to-open. Clean flat surface.
- COUNTERTOP: Same matte black material. Straight square edge, ~35-40mm thick.
- GAPS: Hairline-thin gaps between adjacent doors.

Apply this material to:
→ ALL cabinet door fronts and drawer fronts — replace ONLY the front face with the matte black flat slab. Keep every door's exact dimensions, position, and count. The black material stops at the door edge — no bleed.
→ THE COUNTERTOP — replace ONLY the top surface and front edge. Same footprint, same shape. Do NOT extend it.

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
✓ Breakfast bar / island / peninsula still present with original shape? Only the surface material changed?
✓ No new object was ADDED that was not in IMAGE 1? Check ceiling carefully — no fans, lights, or fixtures that weren't in the original. Check walls — no new shelves, clocks, or decorations. If you added ANYTHING not in IMAGE 1, remove it.
✓ Cabinet doors and countertop show Presisso Politex Negro finish?
✓ Walls, floor, sink, backsplash, faucet — all identical to original?
✓ Aspect ratio matches IMAGE 1 exactly?`,
};

export type PromptType = keyof typeof PROMPTS;
