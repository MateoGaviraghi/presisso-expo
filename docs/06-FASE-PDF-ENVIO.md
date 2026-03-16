# FASE 6 — Generación PDF + Envío WhatsApp + Email

> **Duración:** Semana 3, Días 3-5  
> **Responsable:** Backend Developer  
> **Entregable:** PDF branded generado automáticamente, envío funcional por WhatsApp y Email

---

## ⚙️ SKILLS REQUERIDAS — Leer antes de ejecutar

> **Documento de referencia:** [`09-SKILLS.md`](./09-SKILLS.md)

| Skill                    | Rol       | Nivel           |
| ------------------------ | --------- | --------------- |
| Desarrollador Full Stack | Principal | Senior 10+ años |
| Diseñador Gráfico        | Principal | Senior 10+ años |
| Arquitecto de Software   | Soporte   | Senior 15+ años |

### 📖 Skills del proyecto — LEER antes de ejecutar esta fase:

| Skill (archivo)                                                                                             | Propósito en esta fase                   |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| [`.agents/skills/nextjs-react-typescript/SKILL.md`](../.agents/skills/nextjs-react-typescript/SKILL.md)     | API Routes para PDF, WhatsApp, Email     |
| [`.agents/skills/ui-ux-pro-max/SKILL.md`](../.agents/skills/ui-ux-pro-max/SKILL.md)                         | Diseño editorial PDF, email HTML branded |
| [`.agents/skills/typescript-advanced-types/SKILL.md`](../.agents/skills/typescript-advanced-types/SKILL.md) | Tipado de integraciones Twilio, Resend   |

### Prompt de contexto — COPIAR antes de iniciar esta fase:

```
Actuá como un equipo integrado por:
- Desarrollador Full Stack Senior (10+ años) con experiencia en generación de PDF
  server-side (Puppeteer/Chromium), integración con Twilio WhatsApp Business API
  y servicios de email transaccional (Resend).
- Diseñador Gráfico Senior (10+ años) con experiencia en diseño editorial,
  maquetación de documentos PDF con identidad corporativa, y diseño de
  emails HTML responsive.
- Arquitecto de Software Senior que asegura que el flujo PDF → WhatsApp → Email
  sea robusto, con manejo de errores y tracking de envíos.

MARCA: Presisso. Paleta: #D42B2B (rojo acento), #1A1A1A (negro), #F5F5F3 (gris).
TIPOGRAFÍA: Plus Jakarta Sans (headings), DM Sans (body).
TAREA: Implementar generación de PDF branded, envío por WhatsApp Business API
con mensaje personalizado, y email HTML con preview de imagen y link de descarga.
```

---

## 6.1 Generación de PDF — `src/lib/pdf/generator.ts`

```typescript
import puppeteer from "puppeteer";
import type { Solicitud } from "@/types/solicitud";

/**
 * Genera un PDF branded con la imagen de la cocina generada por IA.
 *
 * Layout del PDF (A4 portrait):
 * ┌─────────────────────────────┐
 * │  LOGO PRESISSO              │  ← Header con logo rojo
 * │  Línea [Moderna/Premium]    │
 * ├─────────────────────────────┤
 * │                             │
 * │  [IMAGEN GENERADA IA]       │  ← Imagen principal grande
 * │                             │
 * ├─────────────────────────────┤
 * │  "Así podría quedar tu      │
 * │   cocina con muebles        │
 * │   Presisso"                 │  ← Texto marketing
 * ├─────────────────────────────┤
 * │  Nombre: María López        │
 * │  Contacto: +54 9 11...      │  ← Datos del cliente
 * ├─────────────────────────────┤
 * │  presisso.com.ar            │
 * │  Tel: (011) XXXX-XXXX       │  ← Footer con contacto empresa
 * └─────────────────────────────┘
 */

export async function generatePDF(solicitud: Solicitud): Promise<Buffer> {
  const tipoLabel = solicitud.tipo_cocina === "moderna" ? "Moderna" : "Premium";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'DM Sans', sans-serif;
      color: #333333;
      background: #FFFFFF;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 20mm 18mm;
      display: flex;
      flex-direction: column;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 15mm;
      border-bottom: 2px solid #D42B2B;
    }

    .logo {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 28pt;
      font-weight: 700;
      color: #1A1A1A;
    }

    .logo span { color: #D42B2B; }

    .linea-tag {
      font-size: 10pt;
      font-weight: 600;
      color: #D42B2B;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      border: 1.5px solid #D42B2B;
      padding: 4px 14px;
      border-radius: 20px;
    }

    .image-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 12mm 0;
    }

    .kitchen-image {
      width: 100%;
      max-height: 140mm;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }

    .tagline {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 16pt;
      font-weight: 600;
      color: #1A1A1A;
      text-align: center;
      margin-top: 10mm;
      line-height: 1.4;
    }

    .tagline em {
      color: #D42B2B;
      font-style: normal;
    }

    .client-info {
      background: #F5F5F3;
      border-radius: 8px;
      padding: 5mm 6mm;
      margin-top: 8mm;
      font-size: 10pt;
      color: #6B6B6B;
    }

    .client-info strong { color: #333333; }

    .footer {
      margin-top: auto;
      padding-top: 8mm;
      border-top: 1px solid #E5E5E5;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9pt;
      color: #6B6B6B;
    }

    .footer-brand {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 700;
      color: #1A1A1A;
      font-size: 11pt;
    }

    .footer-brand span { color: #D42B2B; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="logo">presisso<span>.</span></div>
      <div class="linea-tag">Línea ${tipoLabel}</div>
    </div>

    <div class="image-section">
      <img
        src="${solicitud.imagen_generada}"
        alt="Tu cocina con muebles Presisso"
        class="kitchen-image"
      />
      <p class="tagline">
        Así podría quedar tu cocina<br>
        con muebles <em>Presisso</em>
      </p>
    </div>

    <div class="client-info">
      Preparado para <strong>${solicitud.nombre}</strong>
      ${solicitud.email ? ` • ${solicitud.email}` : ""}
    </div>

    <div class="footer">
      <div class="footer-brand">presisso<span>.</span></div>
      <div>
        presisso.com.ar • Tel: (011) XXXX-XXXX • Instagram: @presisso
      </div>
    </div>
  </div>
</body>
</html>`;

  // Generar PDF con Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();

  return Buffer.from(pdfBuffer);
}
```

---

## 6.2 API Route: Generar PDF — `src/app/api/generar-pdf/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generatePDF } from "@/lib/pdf/generator";

export async function POST(req: NextRequest) {
  const { solicitud_id } = await req.json();

  const { data: solicitud } = await supabaseAdmin
    .from("solicitudes")
    .select("*")
    .eq("id", solicitud_id)
    .single();

  if (!solicitud?.imagen_generada) {
    return NextResponse.json({ error: "Sin imagen generada" }, { status: 400 });
  }

  const pdfBuffer = await generatePDF(solicitud);

  // Subir PDF a Storage
  const fileName = `pdfs/${solicitud_id}.pdf`;
  await supabaseAdmin.storage
    .from("fotos-cocinas")
    .upload(fileName, pdfBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  const { data: urlData } = supabaseAdmin.storage
    .from("fotos-cocinas")
    .getPublicUrl(fileName);

  await supabaseAdmin
    .from("solicitudes")
    .update({ pdf_url: urlData.publicUrl })
    .eq("id", solicitud_id);

  return NextResponse.json({ pdf_url: urlData.publicUrl });
}
```

---

## 6.3 Integración WhatsApp — `src/lib/whatsapp/sender.ts`

```typescript
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!,
);

interface SendWhatsAppParams {
  to: string; // Número del cliente (ej: +5491112345678)
  nombre: string;
  tipoCocina: string;
  pdfUrl: string;
}

export async function sendWhatsApp({
  to,
  nombre,
  tipoCocina,
  pdfUrl,
}: SendWhatsAppParams) {
  // Normalizar número argentino
  const normalizedTo = normalizeArgentineNumber(to);

  const message = await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM!,
    to: `whatsapp:${normalizedTo}`,
    body: `¡Hola ${nombre}! 👋

Acá tenés tu cocina con muebles *Presisso Línea ${tipoCocina === "moderna" ? "Moderna" : "Premium"}*.

📎 Descargá tu PDF con la imagen acá:
${pdfUrl}

¿Te gustó? Visitanos en nuestro stand para conocer los muebles en persona.

_Presisso — Amoblamientos de diseño_
presisso.com.ar`,
    // También se puede enviar el PDF como media:
    // mediaUrl: [pdfUrl],
  });

  return message.sid;
}

function normalizeArgentineNumber(phone: string): string {
  // Limpiar caracteres no numéricos excepto +
  let cleaned = phone.replace(/[^\d+]/g, "");

  // Si no empieza con +, asumir Argentina
  if (!cleaned.startsWith("+")) {
    cleaned = "+54" + cleaned;
  }

  return cleaned;
}
```

---

## 6.4 Integración Email — `src/lib/email/sender.ts`

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

interface SendEmailParams {
  to: string;
  nombre: string;
  tipoCocina: string;
  pdfUrl: string;
  imagenUrl: string;
}

export async function sendEmail({
  to,
  nombre,
  tipoCocina,
  pdfUrl,
  imagenUrl,
}: SendEmailParams) {
  const tipoLabel = tipoCocina === "moderna" ? "Moderna" : "Premium";

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: `${nombre}, tu cocina Presisso Línea ${tipoLabel} está lista`,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FFFFFF;">
        <!-- Header -->
        <div style="padding: 24px 32px; border-bottom: 3px solid #D42B2B;">
          <h1 style="font-size: 24px; font-weight: 700; color: #1A1A1A; margin: 0;">
            presisso<span style="color: #D42B2B;">.</span>
          </h1>
        </div>

        <!-- Content -->
        <div style="padding: 32px;">
          <h2 style="font-size: 20px; color: #333333; margin: 0 0 8px;">
            ¡Hola ${nombre}!
          </h2>
          <p style="font-size: 15px; color: #6B6B6B; line-height: 1.6; margin: 0 0 24px;">
            Acá tenés tu cocina con muebles Presisso
            <strong style="color: #D42B2B;">Línea ${tipoLabel}</strong>.
          </p>

          <!-- Image preview -->
          <img
            src="${imagenUrl}"
            alt="Tu cocina con muebles Presisso"
            style="width: 100%; border-radius: 8px; margin-bottom: 24px;"
          />

          <!-- CTA -->
          <a
            href="${pdfUrl}"
            style="display: inline-block; padding: 14px 32px; background: #D42B2B;
                   color: #FFFFFF; text-decoration: none; border-radius: 8px;
                   font-weight: 600; font-size: 15px;"
          >
            Descargar PDF
          </a>

          <p style="font-size: 13px; color: #6B6B6B; margin-top: 24px; line-height: 1.5;">
            ¿Te gustó el resultado? Visitanos en nuestro stand para ver los muebles en persona.
          </p>
        </div>

        <!-- Footer -->
        <div style="padding: 20px 32px; background: #F5F5F3; border-top: 1px solid #E5E5E5;">
          <p style="font-size: 12px; color: #6B6B6B; margin: 0;">
            presisso.com.ar • Instagram: @presisso
          </p>
        </div>
      </div>
    `,
  });

  if (error) throw error;
  return data?.id;
}
```

---

## 6.5 API Routes de envío

`src/app/api/enviar-whatsapp/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendWhatsApp } from "@/lib/whatsapp/sender";

export async function POST(req: NextRequest) {
  const { solicitud_id } = await req.json();

  const { data: solicitud } = await supabaseAdmin
    .from("solicitudes")
    .select("*")
    .eq("id", solicitud_id)
    .single();

  if (!solicitud?.pdf_url) {
    return NextResponse.json({ error: "PDF no generado aún" }, { status: 400 });
  }

  try {
    const sid = await sendWhatsApp({
      to: solicitud.whatsapp,
      nombre: solicitud.nombre,
      tipoCocina: solicitud.tipo_cocina,
      pdfUrl: solicitud.pdf_url,
    });

    await supabaseAdmin
      .from("solicitudes")
      .update({ whatsapp_sid: sid })
      .eq("id", solicitud_id);

    return NextResponse.json({ success: true, sid });
  } catch (error) {
    console.error("WhatsApp send error:", error);
    return NextResponse.json(
      { error: "Error enviando WhatsApp" },
      { status: 500 },
    );
  }
}
```

`src/app/api/enviar-email/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/sender";

export async function POST(req: NextRequest) {
  const { solicitud_id } = await req.json();

  const { data: solicitud } = await supabaseAdmin
    .from("solicitudes")
    .select("*")
    .eq("id", solicitud_id)
    .single();

  if (!solicitud?.email || !solicitud?.pdf_url) {
    return NextResponse.json({ error: "Sin email o PDF" }, { status: 400 });
  }

  try {
    const emailId = await sendEmail({
      to: solicitud.email,
      nombre: solicitud.nombre,
      tipoCocina: solicitud.tipo_cocina,
      pdfUrl: solicitud.pdf_url,
      imagenUrl: solicitud.imagen_generada!,
    });

    await supabaseAdmin
      .from("solicitudes")
      .update({ email_id: emailId })
      .eq("id", solicitud_id);

    return NextResponse.json({ success: true, emailId });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "Error enviando email" },
      { status: 500 },
    );
  }
}
```

---

## 6.6 Verificación de la fase

| Check | Criterio                                                            |
| ----- | ------------------------------------------------------------------- |
| ✅    | PDF se genera con branding Presisso correcto                        |
| ✅    | PDF contiene: logo, imagen IA, datos cliente, footer                |
| ✅    | PDF se sube a Supabase Storage                                      |
| ✅    | WhatsApp envía mensaje con link al PDF                              |
| ✅    | Email envía HTML branded con preview de imagen + link PDF           |
| ✅    | Flujo completo: Aprobar → PDF → WhatsApp + Email → estado "enviada" |
| ✅    | Manejo de errores en cada paso del envío                            |
