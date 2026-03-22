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
  const grayLight = "#A0A0A0";

  const info = await transporter.sendMail({
    from: `"Presisso" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject: `${nombre}, tu diseño Presisso Línea ${linea} está listo`,
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu cocina Presisso</title>
  <!--[if mso]>
  <style>table,td{font-family:Arial,Helvetica,sans-serif!important;}</style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background:#F5F5F3;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F5F3;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <!-- CONTENEDOR PRINCIPAL — max-width para responsive -->
        <table role="presentation" cellpadding="0" cellspacing="0" style="background:#FFFFFF;width:100%;max-width:600px;border-collapse:collapse;">

          <!-- LÍNEA ROJA TOP -->
          <tr><td style="background:${red};height:4px;font-size:0;line-height:0;">&nbsp;</td></tr>

          <!-- HEADER -->
          <tr>
            <td style="padding:20px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:50%;"><img src="${LOGO_URL}" alt="presisso." width="120" style="display:block;border:0;max-width:120px;height:auto;" /></td>
                  <td align="right" valign="middle" style="width:50%;"><span style="font-size:10px;font-weight:700;color:${red};letter-spacing:0.1em;white-space:nowrap;">L&Iacute;NEA ${linea.toUpperCase()}</span></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- LÍNEA ROJA SEPARADORA -->
          <tr><td style="background:${red};height:3px;font-size:0;line-height:0;">&nbsp;</td></tr>

          <!-- CONTENIDO -->
          <tr>
            <td style="padding:28px 32px 0;">
              <h1 style="font-size:22px;font-weight:700;color:${black};margin:0 0 2px;line-height:1.3;">Tu cocina redise&ntilde;ada</h1>
              <h2 style="font-size:22px;font-weight:700;color:${red};margin:0 0 14px;line-height:1.3;">con amoblamientos Presisso.</h2>
              <p style="font-size:15px;color:${grayMid};line-height:1.6;margin:0 0 24px;">&iexcl;Hola <strong style="color:${black};">${nombre}</strong>! As&iacute; podr&iacute;a verse tu cocina con nuestros muebles.</p>
            </td>
          </tr>

          <!-- IMAGEN -->
          <tr>
            <td style="padding:0 32px 24px;">
              <img src="${imagenUrl}" alt="Tu cocina Presisso" width="536" style="display:block;width:100%;max-width:536px;height:auto;border:0;" />
            </td>
          </tr>

          <!-- BOTÓN -->
          <tr>
            <td align="center" style="padding:0 32px 10px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background:${red};border-radius:6px;">
                    <a href="${pdfUrl}" target="_blank" style="display:inline-block;padding:14px 40px;color:#FFFFFF;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.08em;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">DESCARGAR PDF</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- TEXTO CTA -->
          <tr>
            <td align="center" style="padding:10px 32px 28px;">
              <p style="font-size:13px;color:${grayMid};margin:0;line-height:1.5;">&iquest;Te gust&oacute; el resultado? Visitanos en nuestro stand para ver los muebles en persona.</p>
            </td>
          </tr>

          <!-- LÍNEA ROJA SEPARADORA FOOTER -->
          <tr><td style="background:${red};height:3px;font-size:0;line-height:0;">&nbsp;</td></tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:24px 32px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <!-- Logo footer -->
                <tr>
                  <td align="center" style="padding-bottom:16px;">
                    <img src="${LOGO_URL}" alt="presisso." width="100" style="display:block;border:0;max-width:100px;height:auto;" />
                  </td>
                </tr>

                <!-- Contacto -->
                <tr>
                  <td align="center" style="padding-bottom:6px;">
                    <a href="mailto:info@presisso.com.ar" style="font-size:12px;color:${grayMid};text-decoration:none;">info@presisso.com.ar</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:14px;">
                    <span style="font-size:12px;color:${grayLight};">0800-777 3900&nbsp;&nbsp;&middot;&nbsp;&nbsp;+54 3483 444 000</span>
                  </td>
                </tr>

                <!-- Separador -->
                <tr>
                  <td align="center" style="padding-bottom:14px;">
                    <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="width:40px;height:1px;background:#E0E0E0;font-size:0;line-height:0;">&nbsp;</td></tr></table>
                  </td>
                </tr>

                <!-- Redes sociales -->
                <tr>
                  <td align="center" style="padding-bottom:6px;">
                    <a href="https://www.instagram.com/presisso_amoblamientos/" style="font-size:12px;color:${black};text-decoration:none;font-weight:600;">@presisso_amoblamientos</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:6px;">
                    <a href="https://www.facebook.com/presisso.muebles" style="font-size:12px;color:${black};text-decoration:none;font-weight:600;">presisso.muebles</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:0;">
                    <a href="https://presisso.com.ar" style="font-size:12px;color:${red};text-decoration:none;font-weight:700;">presisso.com.ar</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- FIN CONTENEDOR -->

      </td>
    </tr>
  </table>
</body>
</html>`,
  });

  return info.messageId;
}
