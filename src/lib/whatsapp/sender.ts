import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!,
);

interface SendWhatsAppParams {
  to: string;
  nombre: string;
  tipoCocina: "moderna" | "premium";
  pdfUrl: string;
}

export async function sendWhatsApp({ to, nombre, tipoCocina, pdfUrl }: SendWhatsAppParams) {
  const linea = tipoCocina === "moderna" ? "Moderna" : "Premium";
  const numero = normalizeArgentineNumber(to);

  const message = await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM!,
    to: `whatsapp:${numero}`,
    body: `¡Hola ${nombre}!

Tu cocina con muebles *Presisso Línea ${linea}* ya está lista.

Descargá tu diseño en PDF:
${pdfUrl}

Te esperamos en nuestro stand para conocer los muebles en persona.

_Presisso — Amoblamientos de diseño_`,
  });

  return message.sid;
}

function normalizeArgentineNumber(phone: string): string {
  let cleaned = phone.replace(/[^\d+]/g, "");
  if (!cleaned.startsWith("+")) {
    // Números argentinos sin código de país
    if (cleaned.startsWith("0")) cleaned = cleaned.slice(1);
    if (cleaned.startsWith("15")) cleaned = cleaned.slice(2);
    cleaned = "+54" + cleaned;
  }
  return cleaned;
}
