import * as fs from "node:fs";
import * as path from "node:path";
import sharp from "sharp";
import { genAI, SEG_MODELS } from "./client";

/* ── Guía de color ─────────────────────────────────────────────────────
 * El modelo de imagen hereda el brillo, los reflejos y el tono de las puertas
 * originales. Para que el color salga como la muestra oficial:
 *   1. un modelo de texto marca las 4 esquinas de cada frente y mesada;
 *   2. se arma un BOCETO interno con el color exacto de la muestra (nunca se
 *      muestra al cliente);
 *   3. el modelo de imagen genera la foto final usando ese boceto como guía.
 * Si cualquier paso falla, se devuelve null y se usa la imagen sin guía.
 */

export interface ColorGuideSpec {
  front: string; // swatch del frente, relativo a public/
  top: string; // swatch de la mesada, relativo a public/
  topTextured: boolean; // copiar el grano de la mesada (cuarzo)
}

interface Quad {
  kind: "front" | "top" | "exclude";
  points: [number, number][]; // [y, x] normalizado 0-1000
}

const QUADS_PROMPT = `You are a precise annotator. In this kitchen photo, find every visible:
- "front": cabinet door, drawer front, cabinet side/end panel, and each visible face of the island body (front and sides).
- "top": countertop top surface, countertop front edge, island top surface, island top edges.
- "exclude": the sink basin, the cooktop / stove top and any appliance that overlaps a countertop.
Do NOT include the fridge, walls, backsplash or floor.
For each one return its outline as a polygon of 4 corner points in clockwise order, following the real perspective edges exactly.
Coordinates are [y, x] normalized to 0-1000.
Answer ONLY JSON: [{"kind":"front"|"top"|"exclude","label":string,"points":[[y,x],[y,x],[y,x],[y,x]]}]`;

export async function getQuads(imageBase64: string, mimeType = "image/png"): Promise<Quad[] | null> {
  for (const model of SEG_MODELS) {
    try {
      const res = await genAI.models.generateContent({
        model,
        contents: [{ role: "user", parts: [{ inlineData: { mimeType, data: imageBase64 } }, { text: QUADS_PROMPT }] }],
        config: { responseMimeType: "application/json", temperature: 0 },
      });
      const match = (res.text ?? "").match(/\[[\s\S]*\]/);
      if (!match) continue;
      const quads = (JSON.parse(match[0]) as Quad[]).filter(
        (q) => ["front", "top", "exclude"].includes(q.kind) && Array.isArray(q.points) && q.points.length >= 3,
      );
      if (quads.some((q) => q.kind === "front")) return quads;
    } catch (err) {
      console.warn(`[ColorGuide] ${model} falló:`, err instanceof Error ? err.message : err);
    }
  }
  return null;
}

/* ── Color: sRGB <-> Lab ── */

function srgbToLab(r: number, g: number, b: number): [number, number, number] {
  const lin = (c: number) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const R = lin(r), G = lin(g), B = lin(b);
  const x = (0.4124 * R + 0.3576 * G + 0.1805 * B) / 0.95047;
  const y = 0.2126 * R + 0.7152 * G + 0.0722 * B;
  const z = (0.0193 * R + 0.1192 * G + 0.9505 * B) / 1.08883;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = f(x), fy = f(y), fz = f(z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

function labToSrgb(L: number, a: number, b: number): [number, number, number] {
  const fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - b / 200;
  const inv = (t: number) => (t > 0.206893 ? t ** 3 : (t - 16 / 116) / 7.787);
  const x = inv(fx) * 0.95047, y = inv(fy), z = inv(fz) * 1.08883;
  const out = [
    3.2406 * x - 1.5372 * y - 0.4986 * z,
    -0.9689 * x + 1.8758 * y + 0.0415 * z,
    0.0557 * x - 0.204 * y + 1.057 * z,
  ].map((c) => {
    c = Math.min(1, Math.max(0, c));
    c = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
    return Math.round(Math.min(1, Math.max(0, c)) * 255);
  });
  return [out[0], out[1], out[2]];
}

/* ── Helpers de imagen (sharp) ── */

async function polygonMask(quads: Quad[], w: number, h: number, blurSigma: number): Promise<Float32Array> {
  const polys = quads
    .map((q) => `<polygon points="${q.points.map(([y, x]) => `${(x / 1000) * w},${(y / 1000) * h}`).join(" ")}" fill="white"/>`)
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="black"/>${polys}</svg>`;
  let img = sharp(Buffer.from(svg)).resize(w, h).greyscale();
  if (blurSigma > 0) img = img.blur(blurSigma);
  const raw = await img.extractChannel(0).raw().toBuffer();
  const m = new Float32Array(w * h);
  for (let i = 0; i < m.length; i++) m[i] = raw[i] / 255;
  return m;
}

async function blurChannel(values: Float32Array, w: number, h: number, sigma: number): Promise<Float32Array> {
  const buf = Buffer.alloc(w * h);
  for (let i = 0; i < buf.length; i++) buf[i] = Math.max(0, Math.min(255, Math.round((values[i] / 100) * 255)));
  // sharp devuelve 3 canales al desenfocar un raw de 1 canal: se extrae el primero
  const raw = await sharp(buf, { raw: { width: w, height: h, channels: 1 } }).blur(sigma).extractChannel(0).raw().toBuffer();
  const out = new Float32Array(w * h);
  for (let i = 0; i < out.length; i++) out[i] = (raw[i] / 255) * 100;
  return out;
}

interface Swatch { L: number; a: number; b: number; tex: Float32Array; tw: number; th: number }

async function loadSwatch(rel: string): Promise<Swatch> {
  const buf = fs.readFileSync(path.join(process.cwd(), "public", rel));
  const meta = await sharp(buf).metadata();
  const W = meta.width ?? 1, H = meta.height ?? 1;
  const left = Math.floor(W / 4), top = Math.floor(H / 4), tw = Math.floor(W / 2), th = Math.floor(H / 2);
  const raw = await sharp(buf).extract({ left, top, width: tw, height: th }).removeAlpha().raw().toBuffer();
  const Ls: number[] = [], As: number[] = [], Bs: number[] = [];
  const tex = new Float32Array(tw * th);
  for (let i = 0; i < tw * th; i++) {
    const [L, a, b] = srgbToLab(raw[i * 3], raw[i * 3 + 1], raw[i * 3 + 2]);
    tex[i] = L; Ls.push(L); As.push(a); Bs.push(b);
  }
  const med = (arr: number[]) => arr.sort((x, y) => x - y)[Math.floor(arr.length / 2)];
  const L = med(Ls), a = med(As), b = med(Bs);
  for (let i = 0; i < tex.length; i++) tex[i] -= L;
  return { L, a, b, tex, tw, th };
}

/** Pinta el color de la muestra dentro de la máscara, conservando la luz general y las juntas oscuras. */
function paint(
  lab: Float32Array, Lbig: Float32Array, Lsmall: Float32Array, mask: Float32Array,
  sw: Swatch, textured: boolean, w: number,
) {
  const sel: number[] = [];
  for (let i = 0; i < mask.length; i++) if (mask[i] > 0.5) sel.push(Lbig[i]);
  if (sel.length === 0) return;
  sel.sort((x, y) => x - y);
  const medBig = sel[Math.floor(sel.length / 2)] || 1;
  for (let i = 0; i < mask.length; i++) {
    const m = mask[i];
    if (m <= 0) continue;
    const L0 = lab[i * 3];
    const s = Math.min(1.08, Math.max(0.72, Lbig[i] / medBig));
    const detail = Math.min(0, L0 - Lsmall[i]); // solo juntas y sombras finas, sin brillos
    let L = Math.min(sw.L + 4, sw.L * s) + 0.8 * detail;
    if (textured) {
      const x = i % w, y = Math.floor(i / w);
      L += sw.tex[(y % sw.th) * sw.tw + (x % sw.tw)] * 0.9;
    }
    lab[i * 3] = L0 * (1 - m) + L * m;
    lab[i * 3 + 1] = lab[i * 3 + 1] * (1 - m) + sw.a * m;
    lab[i * 3 + 2] = lab[i * 3 + 2] * (1 - m) + sw.b * m;
  }
}

/* ── Máscara de muebles (para detectar muebles agregados) ──
 * Las coordenadas de getQuads están normalizadas, así que la máscara se arma en una
 * grilla fija: sirve para comparar la original con el resultado aunque midan distinto.
 */
export const FURNITURE_GRID = 200;

/** Frentes + mesadas en una grilla de FURNITURE_GRID², o null si no se encontraron frentes. */
export async function furnitureMask(imageBase64: string, mimeType = "image/png", dilate = 0): Promise<Float32Array | null> {
  try {
    const quads = await getQuads(imageBase64, mimeType);
    if (!quads) return null;
    return await polygonMask(quads.filter((q) => q.kind !== "exclude"), FURNITURE_GRID, FURNITURE_GRID, dilate);
  } catch (err) {
    console.warn("[ColorGuide] no se pudo armar la máscara de muebles:", err instanceof Error ? err.message : err);
    return null;
  }
}

/** Devuelve el boceto de color en base64 (PNG), o null si no se pudo armar. */
export async function buildColorGuide(imageBase64: string, spec: ColorGuideSpec): Promise<string | null> {
  try {
    const quads = await getQuads(imageBase64);
    if (!quads) return null;
    const input = Buffer.from(imageBase64, "base64");
    const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const w = info.width, h = info.height;

    const lab = new Float32Array(w * h * 3);
    const Lch = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) {
      const [L, a, b] = srgbToLab(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]);
      lab[i * 3] = L; lab[i * 3 + 1] = a; lab[i * 3 + 2] = b; Lch[i] = L;
    }
    const Lbig = await blurChannel(Lch, w, h, Math.max(8, Math.round(w / 60)));
    const Lsmall = await blurChannel(Lch, w, h, 2);

    const exclude = await polygonMask(quads.filter((q) => q.kind === "exclude"), w, h, 3);
    const fronts = await polygonMask(quads.filter((q) => q.kind === "front"), w, h, 1.2);
    const tops = await polygonMask(quads.filter((q) => q.kind === "top"), w, h, 1.2);
    for (let i = 0; i < w * h; i++) {
      const keep = exclude[i] > 0.02 ? 0 : 1; // la bacha y el anafe no se pintan
      fronts[i] *= keep;
      tops[i] *= keep * (1 - fronts[i]);
    }

    paint(lab, Lbig, Lsmall, fronts, await loadSwatch(spec.front), false, w);
    paint(lab, Lbig, Lsmall, tops, await loadSwatch(spec.top), spec.topTextured, w);

    const out = Buffer.alloc(w * h * 3);
    for (let i = 0; i < w * h; i++) {
      const [r, g, b] = labToSrgb(lab[i * 3], lab[i * 3 + 1], lab[i * 3 + 2]);
      out[i * 3] = r; out[i * 3 + 1] = g; out[i * 3 + 2] = b;
    }
    const png = await sharp(out, { raw: { width: w, height: h, channels: 3 } }).png().toBuffer();
    return png.toString("base64");
  } catch (err) {
    console.warn("[ColorGuide] no se pudo armar el boceto:", err instanceof Error ? err.message : err);
    return null;
  }
}

/** Swatches como partes de imagen para el render final. */
export function swatchParts(spec: ColorGuideSpec) {
  return [spec.front, spec.top].map((rel) => ({
    inlineData: { mimeType: "image/jpeg", data: fs.readFileSync(path.join(process.cwd(), "public", rel)).toString("base64") },
  }));
}
