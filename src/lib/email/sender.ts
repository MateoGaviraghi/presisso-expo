import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const LOGO_URL =
  "https://rkmenjdjldfpfttkirkn.supabase.co/storage/v1/object/public/cocinas/assets/logo-presisso.png";

interface SendEmailParams {
  to: string;
  nombre: string;
  tipoCocina: "moderna" | "premium";
  pdfUrl: string;
  imagenUrl: string;
}

export async function sendEmail({ to, nombre, tipoCocina, pdfUrl, imagenUrl }: SendEmailParams) {
  const linea = tipoCocina === "moderna" ? "Moderna" : "Premium";
  const red = "#DF0A0A";
  const black = "#1A1A1A";
  const grayMid = "#6B6B6B";

  const info = await transporter.sendMail({
    from: `"Presisso" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject: `${nombre}, tu diseño Presisso Línea ${linea} está listo`,
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#F5F5F3;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F5F3;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;">

          <!-- LÍNEA ROJA TOP punta a punta -->
          <tr><td style="background:${red};height:4px;font-size:0;line-height:0;">&nbsp;</td></tr>

          <!-- HEADER -->
          <tr>
            <td style="padding:24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td><img src="${LOGO_URL}" alt="presisso." width="130" style="display:block;border:0;" /></td>
                  <td align="right" valign="middle"><span style="font-size:10px;font-weight:700;color:${red};letter-spacing:0.1em;">LÍNEA ${linea.toUpperCase()}</span></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- LÍNEA ROJA SEPARADORA HEADER punta a punta -->
          <tr><td style="background:${red};height:3px;font-size:0;line-height:0;">&nbsp;</td></tr>

          <!-- CONTENIDO -->
          <tr>
            <td style="padding:32px 40px 0;">
              <h1 style="font-size:24px;font-weight:700;color:${black};margin:0 0 4px;line-height:1.3;">Tu cocina rediseñada</h1>
              <h2 style="font-size:24px;font-weight:700;color:${red};margin:0 0 14px;line-height:1.3;">con amoblamientos Presisso.</h2>
              <p style="font-size:15px;color:${grayMid};line-height:1.6;margin:0 0 24px;">¡Hola <strong style="color:${black};">${nombre}</strong>! Así podría verse tu cocina con nuestros muebles.</p>
            </td>
          </tr>

          <!-- IMAGEN -->
          <tr>
            <td style="padding:0 40px 28px;">
              <img src="${imagenUrl}" alt="Tu cocina Presisso" width="520" style="width:100%;display:block;" />
            </td>
          </tr>

          <!-- BOTÓN ROJO -->
          <tr>
            <td style="padding:0 40px 12px;" align="center">
              <a href="${pdfUrl}" style="display:inline-block;padding:16px 48px;background:${red};color:#FFFFFF;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.08em;">DESCARGAR PDF</a>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 40px 32px;" align="center">
              <p style="font-size:13px;color:${grayMid};margin:0;line-height:1.5;">¿Te gustó el resultado? Visitanos en nuestro stand para ver los muebles en persona.</p>
            </td>
          </tr>

          <!-- LÍNEA ROJA SEPARADORA FOOTER punta a punta -->
          <tr><td style="background:${red};height:3px;font-size:0;line-height:0;">&nbsp;</td></tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:22px 40px 26px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="middle">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="middle" style="padding-right:6px;"><a href="https://presisso.com.ar" style="text-decoration:none;"><img src="https://cdn-icons-png.flaticon.com/16/1006/1006771.png" alt="" width="14" height="14" style="display:block;border:0;" /></a></td>
                        <td valign="middle"><a href="https://presisso.com.ar" style="font-size:12px;color:${black};text-decoration:none;font-weight:600;">presisso.com.ar</a></td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" valign="middle">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="middle" style="padding-right:6px;"><a href="https://www.instagram.com/presisso_amoblamientos/" style="text-decoration:none;"><img src="https://cdn-icons-png.flaticon.com/16/174/174855.png" alt="" width="14" height="14" style="display:block;border:0;" /></a></td>
                        <td valign="middle"><a href="https://www.instagram.com/presisso_amoblamientos/" style="font-size:12px;color:${black};text-decoration:none;font-weight:600;">presisso_amoblamientos</a></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });

  return info.messageId;
}
