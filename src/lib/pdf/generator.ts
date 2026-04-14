import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";
import type { Solicitud } from "@/types/solicitud";

const MATERIAL_LABELS: Record<string, string> = { politex_negro: "Politex Negro" };

/* ── Colores de marca Presisso (escala 0–1) ── */
const RED = rgb(223 / 255, 10 / 255, 10 / 255); // #DF0A0A
const BLACK = rgb(26 / 255, 26 / 255, 26 / 255); // #1A1A1A
const WHITE = rgb(1, 1, 1);
const NEAR_WHITE = rgb(252 / 255, 252 / 255, 251 / 255);
const GRAY_BG = rgb(245 / 255, 245 / 255, 243 / 255);
const GRAY_MID = rgb(130 / 255, 130 / 255, 130 / 255);
const GRAY_LIGHT = rgb(200 / 255, 200 / 255, 200 / 255);

export async function generatePDF(solicitud: Solicitud): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit((await import("@pdf-lib/fontkit")).default);

  // ── Fuentes ──
  const futuraPath = path.join(process.cwd(), "public", "fonts", "Futura-Bold.otf");
  let bold: Awaited<ReturnType<typeof pdfDoc.embedFont>>;
  try {
    bold = await pdfDoc.embedFont(fs.readFileSync(futuraPath));
  } catch {
    bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  }
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // ── Dimensiones A4 ──
  const W = 595;
  const H = 842;
  const M = 40;
  const CW = W - M * 2;

  const page = pdfDoc.addPage([W, H]);

  // Fondo
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: NEAR_WHITE });

  // ═══════════════════════════════════════════════════════════════
  // HEADER — Fondo blanco, línea roja fina como acento, logo negro
  // ═══════════════════════════════════════════════════════════════
  const HEADER_H = 64;
  const RED_LINE_H = 3;

  // Fondo blanco del header
  page.drawRectangle({ x: 0, y: H - HEADER_H, width: W, height: HEADER_H, color: WHITE });

  // Línea roja DEBAJO del header (separa header del contenido)
  page.drawRectangle({ x: 0, y: H - HEADER_H - RED_LINE_H, width: W, height: RED_LINE_H, color: RED });

  // Logo PNG de Presisso
  const logoPath = path.join(process.cwd(), "public", "logo-presisso.png");
  try {
    const logoBytes = fs.readFileSync(logoPath);
    const logoImg = await pdfDoc.embedPng(logoBytes);
    const logoScaled = logoImg.scaleToFit(130, 32);
    page.drawImage(logoImg, {
      x: M,
      y: H - (HEADER_H + logoScaled.height) / 2,
      width: logoScaled.width,
      height: logoScaled.height,
    });
  } catch {
    // Fallback texto si no carga el logo
    page.drawText("presisso.", {
      x: M,
      y: H - 42,
      size: 24,
      font: bold,
      color: BLACK,
    });
  }

  // Badge color en rojo
  const lineaLabel = (MATERIAL_LABELS[solicitud.tipo_cocina] ?? solicitud.tipo_cocina).toUpperCase();
  const badgeFontSize = 9;
  const badgeTextW = bold.widthOfTextAtSize(lineaLabel, badgeFontSize);
  page.drawText(lineaLabel, {
    x: W - M - badgeTextW,
    y: H - 40,
    size: badgeFontSize,
    font: bold,
    color: RED,
  });

  // ═══════════════════════════════════════════════════════════════
  // TÍTULO
  // ═══════════════════════════════════════════════════════════════
  const TITLE_Y = H - HEADER_H - RED_LINE_H - 36;

  const titleLine1 = "Tu cocina rediseñada";
  const t1W = bold.widthOfTextAtSize(titleLine1, 22);
  page.drawText(titleLine1, {
    x: (W - t1W) / 2,
    y: TITLE_Y,
    size: 22,
    font: bold,
    color: BLACK,
  });

  const titleLine2 = "con amoblamientos Presisso.";
  const t2W = bold.widthOfTextAtSize(titleLine2, 22);
  page.drawText(titleLine2, {
    x: (W - t2W) / 2,
    y: TITLE_Y - 30,
    size: 22,
    font: bold,
    color: RED,
  });

  // ═══════════════════════════════════════════════════════════════
  // IMAGEN GENERADA
  // ═══════════════════════════════════════════════════════════════
  const IMG_AREA_TOP = TITLE_Y - 44;
  const IMG_H = 360;
  const IMG_Y = IMG_AREA_TOP - IMG_H;

  let imageLoaded = false;
  let imgBottomY = IMG_Y; // posición inferior de la imagen (para posicionar lo de abajo)

  if (solicitud.imagen_generada) {
    try {
      console.log("[PDF] Descargando imagen:", solicitud.imagen_generada);
      const imgRes = await fetch(solicitud.imagen_generada);

      if (!imgRes.ok) {
        throw new Error(`HTTP ${imgRes.status}`);
      }

      const imgArrayBuffer = await imgRes.arrayBuffer();
      const imgUint8 = new Uint8Array(imgArrayBuffer);

      console.log(`[PDF] Imagen descargada: ${imgUint8.length} bytes`);

      const isPng =
        imgUint8[0] === 0x89 &&
        imgUint8[1] === 0x50 &&
        imgUint8[2] === 0x4e &&
        imgUint8[3] === 0x47;

      const kitchenImg = isPng
        ? await pdfDoc.embedPng(imgArrayBuffer)
        : await pdfDoc.embedJpg(imgArrayBuffer);

      const scaled = kitchenImg.scaleToFit(CW, IMG_H);
      const imgX = M + (CW - scaled.width) / 2;
      const imgYPos = IMG_AREA_TOP - scaled.height;
      imgBottomY = imgYPos;

      // Sombra sutil
      page.drawRectangle({
        x: imgX + 2,
        y: imgYPos - 2,
        width: scaled.width,
        height: scaled.height,
        color: GRAY_LIGHT,
        opacity: 0.35,
      });

      page.drawImage(kitchenImg, {
        x: imgX,
        y: imgYPos,
        width: scaled.width,
        height: scaled.height,
      });

      imageLoaded = true;
      console.log(`[PDF] Imagen embedida OK: ${scaled.width}x${scaled.height}`);
    } catch (err) {
      console.error("[PDF] Error cargando imagen:", err);
    }
  }

  if (!imageLoaded) {
    page.drawRectangle({
      x: M,
      y: IMG_Y,
      width: CW,
      height: IMG_H,
      color: GRAY_BG,
      borderColor: GRAY_LIGHT,
      borderWidth: 0.5,
    });
    const ph = "Imagen no disponible";
    const phW = regular.widthOfTextAtSize(ph, 12);
    page.drawText(ph, {
      x: M + (CW - phW) / 2,
      y: IMG_Y + IMG_H / 2 - 6,
      size: 12,
      font: regular,
      color: GRAY_MID,
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // LÍNEA ROJA DECORATIVA centrada (pegada debajo de la imagen)
  // ═══════════════════════════════════════════════════════════════
  const DECOR_Y = imgBottomY - 18;
  page.drawRectangle({
    x: (W - 50) / 2,
    y: DECOR_Y,
    width: 50,
    height: 3,
    color: RED,
  });

  // ═══════════════════════════════════════════════════════════════
  // TARJETA DATOS DEL CLIENTE
  // ═══════════════════════════════════════════════════════════════
  const CARD_H = 70;
  const CARD_Y = DECOR_Y - 22 - CARD_H;
  const CARD_X = M + 16;
  const CARD_W = CW - 32;

  // Fondo tarjeta
  page.drawRectangle({
    x: CARD_X,
    y: CARD_Y,
    width: CARD_W,
    height: CARD_H,
    color: GRAY_BG,
    borderColor: GRAY_LIGHT,
    borderWidth: 0.5,
  });

  // Acento rojo izquierdo
  page.drawRectangle({
    x: CARD_X,
    y: CARD_Y,
    width: 3,
    height: CARD_H,
    color: RED,
  });

  const cardInnerX = CARD_X + 20;
  const cardMidY = CARD_Y + CARD_H / 2;

  page.drawText("PREPARADO PARA", {
    x: cardInnerX,
    y: cardMidY + 12,
    size: 7,
    font: bold,
    color: GRAY_MID,
  });

  page.drawText(solicitud.nombre, {
    x: cardInnerX,
    y: cardMidY - 8,
    size: 16,
    font: bold,
    color: BLACK,
  });

  const rightX = CARD_X + CARD_W - 20;
  if (solicitud.email) {
    const emailW = regular.widthOfTextAtSize(solicitud.email, 9);
    page.drawText(solicitud.email, {
      x: rightX - emailW,
      y: cardMidY + 10,
      size: 9,
      font: regular,
      color: GRAY_MID,
    });
  }

  const tipoLabel = MATERIAL_LABELS[solicitud.tipo_cocina] ?? solicitud.tipo_cocina;
  const tipoW = bold.widthOfTextAtSize(tipoLabel, 9);
  page.drawText(tipoLabel, {
    x: rightX - tipoW,
    y: cardMidY - 10,
    size: 9,
    font: bold,
    color: RED,
  });

  // ═══════════════════════════════════════════════════════════════
  // FOOTER — fondo blanco, línea roja arriba, logo + links
  // ═══════════════════════════════════════════════════════════════
  const FOOTER_H = 72;

  // Fondo blanco del footer
  page.drawRectangle({ x: 0, y: 0, width: W, height: FOOTER_H, color: WHITE });

  // Línea roja encima del footer
  page.drawRectangle({ x: 0, y: FOOTER_H, width: W, height: RED_LINE_H, color: RED });

  // Logo PNG en el footer
  try {
    const footerLogoBytes = fs.readFileSync(logoPath);
    const footerLogoImg = await pdfDoc.embedPng(footerLogoBytes);
    const footerLogoScaled = footerLogoImg.scaleToFit(90, 22);
    page.drawImage(footerLogoImg, {
      x: M,
      y: FOOTER_H / 2 - footerLogoScaled.height / 2,
      width: footerLogoScaled.width,
      height: footerLogoScaled.height,
    });
  } catch {
    page.drawText("presisso.", {
      x: M,
      y: FOOTER_H / 2 - 5,
      size: 12,
      font: bold,
      color: BLACK,
    });
  }

  // Columna derecha: redes y contacto
  const footerRightX = W - M;
  const footerFontSize = 7;
  const footerLineH = 11;
  let footerY = FOOTER_H / 2 + 22;

  const footerLines = [
    { label: "info@presisso.com.ar", font: regular },
    { label: "0800-777 3900  •  +54 3483 444 000", font: regular },
    { label: "", font: regular },
    { label: "@presisso_amoblamientos  •  presisso.muebles", font: regular },
    { label: "presisso.com.ar", font: bold },
  ];

  for (const line of footerLines) {
    if (line.label === "") { footerY -= 4; continue; }
    const lw = line.font.widthOfTextAtSize(line.label, footerFontSize);
    page.drawText(line.label, {
      x: footerRightX - lw,
      y: footerY,
      size: footerFontSize,
      font: line.font,
      color: GRAY_MID,
    });
    footerY -= footerLineH;
  }

  // ═══════════════════════════════════════════════════════════════
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
