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

HOME STAGING CLEANUP (do this BEFORE replacing furniture):
Before applying new furniture, clean up the scene like a professional home stager preparing for a magazine photo shoot. Remove ALL loose clutter from every surface:
- ALL bottles, cans, jars, glasses, cups, food items, packages
- ALL dirty dishes, dish racks, pots/pans left on counters or stove
- ALL rags, towels, sponges, cleaning products
- ALL loose utensils, cutting boards, random small items
- ALL trash cans/bins, bags, boxes on the floor
- ALL items sitting on top of appliances (trays on oven, stuff on fridge)
Fill cleared areas with clean countertop or backsplash surface. The scene should look pristine.
You MAY add 1-2 minimal decorative elements (a plant, a wine glass, a fruit bowl) for a styled look.

PRESERVE EXACTLY FROM IMAGE 1 — DO NOT CHANGE:
- Walls: original color, texture, finish
- Floor: original material and color
- Ceiling and existing lights
- Windows, doors, all architectural features
- Room perspective, camera angle, proportions
- Lighting conditions and shadow directions
- Large appliances: refrigerator, oven, microwave, washing machine, range hood

PHOTOREALISM REQUIREMENTS:
- Must look like a real photograph, not a render
- Gloss reflections must show actual room elements
- Wood grain visible on oak surfaces
- Brushed aluminum texture on profiles
- Seamless transitions between new cabinets and existing walls — no halos, no artifacts
- Proportionally correct furniture scale for the room

OUTPUT: One photorealistic image of the client's kitchen with Presisso Línea Moderna furniture.`,

  premium: `OUTPUT FORMAT: The output image MUST have the EXACT same aspect ratio, orientation, and framing as IMAGE 1. Landscape stays landscape. Portrait stays portrait. No crop. No zoom. No rotation.

You are a professional real estate photographer editing a kitchen photo for a Presisso furniture catalog. Your job has TWO parts: (1) stage the scene like a magazine shoot, and (2) reskin the cabinet doors and countertop with Presisso material.

IMAGES PROVIDED:
- IMAGE 1: The client's actual kitchen photo. This is your canvas.
- IMAGES 2+: Reference photos of Presisso "Línea Premium" installed kitchens. Study the MATERIAL from these.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — HOME STAGING CLEANUP (DO THIS FIRST)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is the MOST IMPORTANT step. Imagine a professional home stager walked into this kitchen before the photo shoot and cleaned up EVERYTHING that looks messy, cluttered, or lived-in. The goal is a MAGAZINE-READY scene.

Scan the ENTIRE image systematically — left to right, top to bottom. Check every surface: countertops, tables, islands, the top of appliances, the floor around cabinets, open shelves.

★ MUST REMOVE — every single one of these, no exceptions:
- ALL bottles (water, oil, wine, cleaning products, ANY bottle)
- ALL cans, jars, containers left on counters
- ALL glasses, cups, mugs that are sitting out
- ALL plates, bowls, dirty dishes, dish drying racks
- ALL food items (bread, fruit, packages, milk cartons, leftovers)
- ALL loose utensils (spatulas, knives, spoons, ladles)
- ALL cutting boards and wooden boards on counters
- ALL rags, cloths, sponges, towels on surfaces
- ALL trash bags, packaging, cardboard, plastic bags
- ALL pots, pans, skillets, baking trays left on stove or counter
- ALL portable trash cans and bins (especially open/lidless ones)
- ALL random small items (keys, pills, medicine, papers, chargers, bags)
- ALL items sitting ON TOP of appliances (trays on the oven, things on the fridge top, items on the microwave)
- ALL items on the floor that are not furniture (buckets, bags, boxes)

★ MUST KEEP — these are permanent fixtures, do NOT remove:
- Refrigerator, freezer (large appliances that Presisso does not sell)
- Oven, stove, cooktop, range hood, microwave
- Washing machine, dishwasher
- Sink, faucet, all plumbing
- Coffee machine, toaster, kettle — ONLY if they appear intentionally placed and plugged in (treat them as part of the décor)
- Wall-mounted shelves, clocks, lights, racks
- Plants in pots
- Built-in or attached fixtures

★ AFTER REMOVING clutter, the cleared surfaces should show CLEAN countertop/backsplash. Fill the empty space with the natural surface that would be behind the removed object — matching the lighting, color, texture, and perspective seamlessly. It should look like those items were NEVER there.

★ OPTIONAL MINIMAL STAGING — after cleanup, you may place 1-2 small decorative elements to make the scene feel styled (NOT cluttered):
- A small plant or herb pot
- A clean wine glass or two
- A decorative bowl with fruit (styled, not random)
- A nice cutting board leaning against the wall
These are OPTIONAL. Only add if it looks natural. Less is more. If in doubt, leave the surface clean.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — STUDY THE PRESISSO MATERIAL (IMAGES 2+)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

From the reference photos, extract the material properties:

- FINISH: Deep matte black with nano-texture — micro-grain resembling brushed leather. Absorbs light. NOT glossy, NOT reflective, NOT shiny.
- DOOR STYLE: Completely flat slab. No frames, no panels, no moldings. Pure flat rectangle.
- HANDLES (LOWER): Recessed vertical channel groove on the door edge — same black, nearly invisible. Not a bar. Not a knob.
- HANDLES (UPPER): No handles. Push-to-open. Clean flat surface.
- COUNTERTOP: Same matte black material as doors. Straight square edge, ~35-40mm thick.
- GAPS: Hairline thin gaps between adjacent doors.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — RESKIN CABINETS AND COUNTERTOP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Now, on the CLEANED scene from Step 1, apply the Presisso material:

RESKIN these (Category A — CABINET DOORS & DRAWER FRONTS):
→ Replace ONLY the front face panel with Presisso matte black flat slab
→ Keep exact same door dimensions, position, and count
→ The black material stops at the exact edge of the door — no bleed

RESKIN these (Category B — COUNTERTOP):
→ Replace ONLY the top surface and front edge with Presisso matte black material
→ Same footprint, same shape. Do NOT extend countertop.

DO NOT RESKIN (Category C — everything else):
- Appliances (fridge, oven, microwave, range hood, washing machine, dishwasher)
- Sinks, faucets, plumbing
- Walls, tiles, backsplash, paint
- Floor, ceiling, windows, doors, lights
- Shelves, racks, carts that are not built-in cabinets
- The space between cabinets — do not fill gaps with new furniture

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — FINAL CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before outputting, verify:
✓ Are ALL bottles removed? Scan again.
✓ Are ALL random items on counters removed? Scan again.
✓ Is the trash can removed or replaced? Check floor area.
✓ Are items on top of appliances removed? Check oven top, fridge top.
✓ Does the scene look like a PROFESSIONAL magazine photo?
✓ Are all large appliances (fridge, oven, microwave) still present and untouched?
✓ Is the aspect ratio preserved — same as IMAGE 1?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE PROHIBITIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DO NOT remove the refrigerator, oven, microwave, washing machine, or any large appliance
DO NOT add cabinets where there were none
DO NOT extend the countertop beyond its original footprint
DO NOT change any wall, backsplash, or tile
DO NOT change the sink or faucet
DO NOT change the floor or ceiling
DO NOT change the room lighting or camera perspective
DO NOT redesign the kitchen layout`,
};

export type PromptType = keyof typeof PROMPTS;
