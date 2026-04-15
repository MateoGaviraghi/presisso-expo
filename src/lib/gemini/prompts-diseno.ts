import { MATERIALS } from "./prompts-rediseno";
import type { PromptType } from "./prompts-rediseno";

/* ── Step 1 prompt: CLEAN the photo (no furniture changes) ──────────── */

export const CLEAN_PROMPT = `Edit this image. Clean this kitchen photo for a professional photoshoot. Preserve layout, keep perspective, retain structure. Same dimensions, same aspect ratio, same orientation.

REMOVE: All construction debris, clutter, and temporary objects — rolled carpets, tools, bicycle parts, wheelbarrows, bags, loose items on counters and floor. Fill those areas with the clean surface behind them.

CLEAN ALL WALLS: Every wall in the image — back wall, side walls, corners, ceiling. If tiles exist, make them look clean and uniform (same color, no stains). If walls are damaged, peeling, or bare concrete, give them a fresh smooth painted finish in soft white or warm cream. The ceiling should look clean.

KEEP: The floor exactly as-is (just clean). All doors, windows, and structural openings exactly where they are. Any existing cabinets, countertops, sinks, or appliances — keep them in place, unchanged. The room layout does not change.

OUTPUT: The same photo, cleaned and ready for a kitchen installation photoshoot. Same room, same framing, no new objects added.`;

/* ── Step 2 prompt: INSERT furniture into the cleaned photo ─────────── */

function buildDesignPrompt(mat: { name: string; finish: string }): string {
  return `Edit this image. Preserve layout, keep perspective, retain structure. Insert Presisso "${mat.name}" kitchen furniture into this clean room.

BEFORE EDITING — ANALYZE IMAGE 1:
Look at IMAGE 1. What is the kitchen layout? (linear? L-shaped? U-shaped?) Where are walls, doors, windows, existing cabinets? This layout is FIXED — do not change it.

⚠️ DO NOT:
- Generate a new room or change the layout
- Change image dimensions, aspect ratio, orientation, or camera angle
- Add an island, peninsula, L-extension, or any structure NOT in IMAGE 1
- Move, resize, or remove doors, windows, or walls
- Place cabinets over or in front of any window
- Invent pipes, tubes, or structural elements not in IMAGE 1
- Add decorative items (no plants, vases, fruit, stools)
- Crop, zoom, or reframe

IMAGES:
- IMAGE 1 (first): Client's clean kitchen — edit this room. Do not change its structure.
- MIDDLE: Presisso "${mat.name}" kitchens — copy ONLY material finish and door style. Do NOT copy their layout.
- LAST: Client's kitchen again — confirms framing and dimensions.

STEP 1 — RESKIN EXISTING CABINETS (if any):
Keep EXACT position, shape, count. Change ONLY surfaces:
- Door fronts → "${mat.name}" flat slab. ${mat.finish}
- Countertop → same material, straight square edge, ~35mm thick.
- Lower handles: recessed vertical groove, same color as door.

STEP 2 — ADD UPPER CABINETS:
Mount above countertop ONLY on clear wall (no windows, no doors):
- ~55cm gap. Same "${mat.name}" flat slab, no handles.
- Align above lower cabinets. STOP before any window.
- Backsplash: only the strip between countertop and uppers.

STEP 3 — ADD APPLIANCES (important — a finished kitchen needs these):
Place these on the countertop: a black induction cooktop (flush-mounted), a coffee machine, and an electric kettle or toaster.
Mount a slim dark range hood on the wall above the cooktop.
Place a modern stainless steel refrigerator at one end of the cabinet run if there is open floor space for it.
If there is cabinet space, add a small built-in oven.
Keep any appliance already in IMAGE 1 exactly as-is.

STEP 4 — PHOTOREALISM:
Match IMAGE 1 lighting. Realistic shadows. Flush against walls and floor. Follow room's vanishing points.

OUTPUT: The SAME photo, same room, same layout, same dimensions — with Presisso "${mat.name}" furniture inserted. This is the same photograph, edited.`;
}

/* ── Export generated design prompts ───────────────────────────────── */

export const DESIGN_PROMPTS: Record<string, string> = {};
for (const [key, mat] of Object.entries(MATERIALS)) {
  DESIGN_PROMPTS[key] = buildDesignPrompt(mat);
}

export type { PromptType };
