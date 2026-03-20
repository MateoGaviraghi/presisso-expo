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

  premium: `CRITICAL OUTPUT REQUIREMENT — READ FIRST:
The output image MUST have the EXACT same aspect ratio and orientation as IMAGE 1 (the client's kitchen photo). If IMAGE 1 is landscape (wider than tall), output MUST be landscape. If IMAGE 1 is portrait (taller than wide), output MUST be portrait. Do NOT crop, do NOT rotate, do NOT change dimensions. Preserve 100% of the original framing.

You are a digital compositor specializing in architectural product visualization. Your job is to show a client how their kitchen would look with Presisso "Línea Premium" furniture installed — using their own kitchen photo as the base and the Presisso reference photos as the product to install.

You have received:
- IMAGE 1: the client's real kitchen photo. This defines the space: room layout, perspective, walls, floor, ceiling, appliances, objects. Everything in this image that is NOT kitchen furniture stays exactly as-is.
- IMAGES 2+: official photos of the Presisso Línea Premium product as it exists in real installations. Study these carefully — they are the product you are installing.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — STUDY THE PRESISSO PRODUCT (IMAGES 2+)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before touching IMAGE 1, extract these exact product details from the reference photos:

MATERIAL: The cabinet doors and countertop have a unified deep matte black finish with a nano-texture surface — a micro-grain that resembles soft brushed leather or matte lacquer with a directional grain. Under raking light it shows a very subtle soft sheen, NOT glossy, NOT reflective, NOT mirror-like. The surface absorbs light.

DOOR STYLE: Completely flat slab fronts — no frames, no profiles, no raised panels, no moldings. Pure flat rectangular face. The color is uniform deep black across the entire face.

HANDLES — LOWER CABINETS: A recessed vertical channel groove cut into the side edge of each door, approximately 12–18 cm tall, the same black as the door. It is embedded INTO the edge — nearly invisible. Not a bar handle. Not a knob. Not a protruding element of any kind.

HANDLES — UPPER CABINETS: No handles visible. Doors open by pushing (hydraulic lift). Clean uninterrupted flat black face.

COUNTERTOP: Same nano-texture matte black material as the doors. Straight square edge profile, approximately 35–40mm thick. The visual result is that doors and countertop read as one continuous dark mass — no contrast between them.

GAPS: Hairline thin gaps between all doors, uniform throughout.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — INSTALL THE PRODUCT INTO IMAGE 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Now apply the Presisso product to IMAGE 1. Replace ONLY these two surface types:

SURFACE A — CABINET DOOR AND DRAWER FRONT FACES
Replace the front face of every kitchen cabinet door and drawer in IMAGE 1 with the Presisso flat slab matte black nano-texture door described above.
Boundaries: only the face panel itself. Not the wall behind it. Not the frame around it. Not any adjacent surface. The edge of the door face is a hard mask — black stops exactly where the door face ends.

SURFACE B — COUNTERTOP TOP FACE
Replace the horizontal top surface and front edge of every countertop in IMAGE 1 with the Presisso matte black nano-texture material.
Boundaries: only the horizontal top face and the front edge strip. The countertop footprint, shape, and position are IDENTICAL to IMAGE 1. Do not extend it. Do not shorten it. Do not move it.

That is the full installation. Two surfaces replaced. The Presisso product is now installed in the client's kitchen.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — LOCK EVERYTHING ELSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Everything in IMAGE 1 that is NOT a cabinet door face or countertop top surface stays pixel-identical. Including:

- ALL wall surfaces (backsplash, side walls, back wall, any painted/tiled/stone surface) → unchanged
- Sink and faucet → exact original, no change
- Range hood / extractor → exact original
- Refrigerator → exact original position and finish
- Oven, microwave, stove, cooktop → exact original
- Floor → unchanged
- Ceiling → unchanged
- Windows, blinds, curtains → unchanged
- All objects on the counter → unchanged positions
- Bar stools, chairs, furniture → unchanged
- Room perspective, camera angle, framing → pixel-identical to IMAGE 1
- Image aspect ratio and orientation → IDENTICAL to IMAGE 1 — see top of prompt
- Room exposure and brightness → identical to IMAGE 1. Do NOT darken the room.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHOTOREALISM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The new Presisso surfaces must be lit by the same light sources as IMAGE 1 — matching light direction, shadow angles, and ambient brightness. The nano-texture absorbs light: no gloss reflections, no mirror spots.
Edges where new surfaces meet existing walls: seamless, no halos, no color bleed.
All cabinet geometry follows the vanishing points of IMAGE 1.

NEGATIVE: no wall painting, no wall darkening, no backsplash change, no sink change, no faucet change, no hood change, no fridge change, no oven change, no floor change, no ceiling change, no room darkening, no layout change, no perspective change, no zoom, no crop, no added objects, no removed objects`,
};

export type PromptType = keyof typeof PROMPTS;
