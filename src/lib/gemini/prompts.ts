export const PROMPTS = {
  moderna: `CRITICAL OUTPUT REQUIREMENT — READ FIRST:
The output image MUST have the EXACT same aspect ratio and orientation as IMAGE 1 (the client's kitchen photo). If IMAGE 1 is landscape (wider than tall), output MUST be landscape. If IMAGE 1 is portrait (taller than wide), output MUST be portrait. Do NOT crop, do NOT rotate, do NOT change dimensions. Preserve 100% of the original framing.

You are a world-class interior design visualization specialist working with Presisso, a premium Argentine kitchen furniture brand.

You have received multiple images:
- IMAGE 1 (first image): The CLIENT'S ACTUAL KITCHEN that needs redesigning.
- IMAGE 2+ (following images): REFERENCE PHOTOS of Presisso "Línea Moderna" furniture. These show the EXACT style to replicate.

TASK: Edit IMAGE 1 replacing all cabinetry, countertops, backsplash, and hardware to precisely match Presisso Línea Moderna from the reference images.

REPLICATE THESE EXACT DETAILS FROM THE REFERENCE:

LOWER CABINETS:
- Dark anthracite/charcoal gray drawer fronts with HIGH GLOSS mirror-like reflective finish
- White matte cabinet carcass visible at edges and between units
- Thin horizontal brushed aluminum profile strips as handles, running the FULL WIDTH of each drawer — slim accent lines, NOT bar handles, NOT knobs

UPPER CABINETS:
- Smoked dark glass doors with slim aluminum frames
- Built-in oven column with white panel surround
- Built-in microwave below oven

MAIN COUNTERTOP:
- Pure white solid surface — no veins, no pattern, matte/satin finish

ISLAND (if space exists):
- Dark black stone top with mineral texture, waterfall edge on one side
- Light oak/driftwood wood panel on the island side
- Undermount stainless steel sink with gooseneck faucet
- Flush black induction cooktop on main counter

SHELVING:
- Column of open shelves in light natural oak with dark cube inserts

PRESERVE EXACTLY FROM IMAGE 1 — DO NOT CHANGE:
- Walls: original color, texture, finish
- Floor: original material and color
- Ceiling and existing lights
- Windows, doors, all architectural features
- Room perspective, camera angle, proportions
- Lighting conditions and shadow directions

PHOTOREALISM REQUIREMENTS:
- Must look like a real photograph, not a render
- Gloss reflections must show actual room elements
- Wood grain visible on oak surfaces
- Brushed aluminum texture on profiles
- Seamless transitions between new cabinets and existing walls — no halos, no artifacts
- Proportionally correct furniture scale for the room

OUTPUT: One photorealistic image of the client's kitchen with Presisso Línea Moderna furniture.`,

  premium: `OUTPUT FORMAT: The output image MUST have the EXACT same aspect ratio, orientation, and framing as IMAGE 1. Landscape stays landscape. Portrait stays portrait. No crop. No zoom. No rotation.

You are a Photoshop compositor. You will RESKIN existing kitchen furniture in IMAGE 1 using the Presisso material shown in IMAGES 2+. You are NOT redesigning the kitchen. You are NOT adding furniture. You are NOT removing anything. You are changing the MATERIAL of surfaces that already exist.

IMAGES PROVIDED:
- IMAGE 1: The client's actual kitchen. This is your canvas. Every pixel in this image is sacred unless it is a cabinet door face or countertop surface.
- IMAGES 2+: Reference photos of Presisso "Línea Premium" installed kitchens. Study the MATERIAL, not the layout.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 0 — THINK BEFORE YOU EDIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before making any edit, mentally scan IMAGE 1 and classify every object:

CATEGORY A — CABINET DOORS & DRAWER FRONTS (you WILL reskin these):
These are the flat front panels of kitchen storage units: upper wall cabinets, lower base cabinets, drawer fronts. They have hinges or slides. They are attached to a cabinet box.

CATEGORY B — COUNTERTOP SURFACE (you WILL reskin this):
The horizontal work surface on top of the lower cabinets. Only the existing surface area — same shape, same size, same footprint.

CATEGORY C — EVERYTHING ELSE (you will NOT touch these):
This includes ALL of the following, which MUST remain pixel-identical to IMAGE 1:
- Washing machines, dishwashers, dryers — these are APPLIANCES, not cabinets
- Refrigerators, freezers
- Ovens, microwaves, stovetops, cooktops, range hoods
- Sinks, faucets, taps, plumbing
- Walls, tiles, backsplash, paint — ALL wall surfaces
- Floor, ceiling, windows, doors, light fixtures
- Every object sitting on the countertop (bottles, jars, appliances, utensils)
- Every object on the floor
- Shelves, racks, carts, side tables — if it is not a built-in cabinet, do NOT touch it
- The SPACE between and behind cabinets — do not fill gaps with new furniture

CRITICAL RULE: If an object exists in IMAGE 1, it MUST exist in the output. If a space is empty in IMAGE 1, it MUST be empty in the output. The count, position, and size of every object is FROZEN.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — STUDY THE PRESISSO MATERIAL (IMAGES 2+)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

From the reference photos, extract the material properties:

- FINISH: Deep matte black with nano-texture — micro-grain resembling brushed leather. Absorbs light. NOT glossy, NOT reflective, NOT shiny.
- DOOR STYLE: Completely flat slab. No frames, no panels, no moldings. Pure flat rectangle.
- HANDLES (LOWER): Recessed vertical channel groove on the door edge — same black, nearly invisible. Not a bar. Not a knob.
- HANDLES (UPPER): No handles. Push-to-open. Clean flat surface.
- COUNTERTOP: Same matte black material as doors. Straight square edge, ~35-40mm thick.
- GAPS: Hairline thin gaps between adjacent doors.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — RESKIN ONLY CATEGORY A AND B
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For each CATEGORY A element (cabinet door/drawer front) in IMAGE 1:
→ Replace ONLY the front face panel with the Presisso matte black flat slab material
→ Keep the exact same door dimensions, position, and count
→ The black material stops at the exact edge of the door — no bleed onto walls or adjacent surfaces

For each CATEGORY B element (countertop) in IMAGE 1:
→ Replace ONLY the top surface and front edge with Presisso matte black material
→ Same footprint. Same shape. Same extent. Do NOT extend countertop into areas where it did not exist.

NOTHING ELSE CHANGES. This is the complete edit.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE PROHIBITIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DO NOT remove ANY object (washing machine, appliance, bottle, anything)
DO NOT add ANY object that doesn't exist in IMAGE 1
DO NOT add cabinets where there were none
DO NOT extend the countertop beyond its original footprint
DO NOT change ANY wall surface, backsplash, or tile
DO NOT change the sink or faucet
DO NOT change the floor or ceiling
DO NOT move any object from its position
DO NOT change the room lighting or exposure
DO NOT change the camera perspective or framing
DO NOT redesign the kitchen layout — you are ONLY changing material on existing cabinet faces and countertop surface`,
};

export type PromptType = keyof typeof PROMPTS;
