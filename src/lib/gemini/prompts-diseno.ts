import { MATERIALS } from "./prompts-rediseno";
import type { PromptType } from "./prompts-rediseno";

/* ── Step 1 prompt: CLEAN the photo (no furniture changes) ──────────── */

export const CLEAN_PROMPT = `Edit this image. Prepare this kitchen space for a professional interior design photoshoot. Same dimensions, same aspect ratio, same orientation.

REMOVE everything that is not permanent structure: all construction debris, clutter, tools, bags, boxes, temporary objects, loose items on counters and floor. Scan every surface left to right, top to bottom. Fill cleaned areas seamlessly with the clean surface behind them.

CLEAN ALL WALLS: Scan every wall — back, sides, corners, ceiling. If tiles exist, make them look clean and uniform. If walls are damaged, peeling, or bare concrete, give them a fresh smooth painted finish in soft white or warm cream. Apply the SAME color to ALL walls uniformly — do not paint some walls one color and others a different color. The ceiling should look clean and finished.

KEEP exactly as-is: the floor (just clean it), all doors, windows, structural openings, and the room's shape. If any cabinets, countertops, sinks, or appliances exist, keep them in place unchanged.

The output should look like a clean, empty kitchen space ready for a furniture installation — like a professional real estate photo of a newly finished room.`;

/* ── Step 2 prompt: INSERT furniture into the cleaned photo ─────────── */

function buildDesignPrompt(mat: { name: string; finish: string }): string {
  return `Edit this image. Install Presisso "${mat.name}" kitchen furniture into this room, creating a photorealistic result that looks like a professional interior design magazine photo — real, aspirational, and premium.

IMAGES (in order):
- FIRST: The client's clean kitchen space — this is the room you are furnishing.
- MIDDLE: Reference photos of Presisso "${mat.name}" installed kitchens — study the material finish, door style, and overall aesthetic. Copy the material quality, not their room layout.
- LAST: The client's kitchen again — your output must match this exact framing, dimensions, and aspect ratio.

WHAT TO INSTALL:

1. LOWER CABINETS along existing walls where counter space makes sense:
   - "${mat.name}" flat slab doors. ${mat.finish}
   - Straight square-edge countertop, ~35mm thick, same material family.
   - Lower handles: recessed vertical groove, same color as door.
   - If cabinets already exist, reskin their surfaces — keep their exact position and count.

2. UPPER CABINETS on clear wall sections above the lower cabinets:
   - Same "${mat.name}" flat slab, no handles (push-to-open).
   - ~55cm gap between countertop and upper cabinet bottom.
   - Place only on solid wall — never over windows or doors.
   - Add a matching backsplash in the strip between countertop and uppers.

3. ESSENTIAL APPLIANCES to make the kitchen look complete and lived-in:
   - A cooktop on the counter (induction or gas, flush-mounted).
   - A slim range hood mounted above the cooktop.
   - A stainless steel refrigerator at one end of the cabinet run if there is open floor space.
   - A built-in oven if there is cabinet space for it.
   - 1-2 small countertop items: coffee machine, kettle, or toaster.
   - Keep any existing appliance exactly as-is.

RULES — the room structure is sacred:
- WALLS: Keep every wall exactly as it appears in the cleaned photo — same color, same paint, same tiles, same texture across the ENTIRE wall. Do not repaint, recolor, or darken any wall or section of a wall. If a wall is cream, every part of that wall stays cream. The only thing that may cover a wall section is the backsplash strip between countertop and upper cabinets.
- The room shape, floor, ceiling, doors, windows stay exactly as they are.
- Cabinets sit flush against walls and floor, following the room's perspective and vanishing points.
- Output dimensions and aspect ratio must match the input photo exactly.
- Do not add islands, peninsulas, or counter extensions that don't fit naturally in the space.

PHOTOREALISM — this must look like a real installed kitchen, not a render:
- Match the room's existing natural light: warm where light enters from windows, darker in corners and shadows.
- Cabinets cast realistic shadows on walls and floor — soft, directional, consistent with the light source.
- Materials respond to light naturally: highlights on surfaces facing the light, subtle reflections on countertops, depth in recessed handle grooves.
- The furniture should feel grounded and heavy — flush against walls, touching the floor, integrated into the space as if it was always there.
- Think of a high-end interior design photoshoot: clean, warm, aspirational, but completely believable.`;
}

/* ── Export generated design prompts ───────────────────────────────── */

export const DESIGN_PROMPTS: Record<string, string> = {};
for (const [key, mat] of Object.entries(MATERIALS)) {
  DESIGN_PROMPTS[key] = buildDesignPrompt(mat);
}

export type { PromptType };
