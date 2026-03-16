# FASE 8 — Deploy a Producción

> **Duración:** Semana 4, Días 3-5  
> **Responsable:** Lead Developer + DevOps  
> **Entregable:** Sistema en producción, monitoreado y estable para la expo  

---

## ⚙️ SKILLS REQUERIDAS — Leer antes de ejecutar

> **Documento de referencia:** [`09-SKILLS.md`](./09-SKILLS.md)  
> **⚠️ CERO MARGEN DE ERROR:** El sistema debe funcionar desde el minuto 1 de la expo.

| Skill | Rol | Nivel |
|-------|-----|-------|
| Arquitecto de Software | Principal | Senior 15+ años |
| Líder Técnico | Principal | Senior 15+ años |
| Ingeniero Industrial | Principal | Logística operativa expo |
| Desarrollador Full Stack | Principal | Senior 10+ años |
| Diseñador Gráfico | Soporte | QR branding + señalética |
| Ingeniero de IA | Soporte | Warm-up + monitoreo IA |

### 📖 Skills del proyecto — LEER antes de ejecutar esta fase:

| Skill (archivo) | Propósito en esta fase |
|------------------|------------------------|
| [`.agents/skills/deploy-to-vercel/SKILL.md`](../.agents/skills/deploy-to-vercel/SKILL.md) | Deploy production, dominio, env vars |
| [`.agents/skills/nextjs-react-typescript/SKILL.md`](../.agents/skills/nextjs-react-typescript/SKILL.md) | Optimización Next.js para producción |
| [`.agents/skills/typescript-advanced-types/SKILL.md`](../.agents/skills/typescript-advanced-types/SKILL.md) | Validación final de tipos |
| [`.agents/skills/supabase-postgres-best-practices/SKILL.md`](../.agents/skills/supabase-postgres-best-practices/SKILL.md) | Configuración DB producción, índices |

### Prompt de contexto — COPIAR antes de iniciar esta fase:

```
Actuá como un equipo integrado por:
- Arquitecto de Software Senior (15+ años) especializado en deploy a producción, 
  Vercel Serverless, dominios SSL, y diseño de planes de contingencia.
- Líder Técnico Senior que define el checklist de go-live, procedimientos de rollback, 
  y protocolo de soporte técnico durante la expo.
- Ingeniero Industrial que planifica la logística operativa del stand: posición de 
  dispositivos, flujo físico de clientes, backup de conectividad y métricas.
- Desarrollador Full Stack Senior que configura variables de producción, optimiza 
  performance, y prepara el sistema de monitoreo.
- Diseñador Gráfico Senior que valida presentación final: QR branding y señalética.

CONTEXTO: Día de deploy a producción y preparación final para la expo.
CERO MARGEN DE ERROR: el sistema debe funcionar desde el minuto 1.
TAREA: Deploy final, configuración de dominio, Twilio en producción, 
monitoreo, rollback y validación del checklist pre-expo.
```

---

## 8.1 Arquitectura de deploy

```
                    ┌─────────────┐
                    │   Vercel     │ ← Frontend + API Routes
                    │  (Edge/Node) │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────▼─────┐ ┌───▼───┐ ┌─────▼─────┐
        │  Supabase  │ │Gemini │ │  Twilio   │
        │ DB+Storage │ │ API   │ │ WhatsApp  │
        └───────────┘ └───────┘ │  + Resend │
                                └───────────┘
```

---

## 8.2 Configuración Vercel — producción

### 8.2.1 `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Puppeteer requiere serverless functions con más memoria
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
```

### 8.2.2 `vercel.json`

```json
{
  "functions": {
    "src/app/api/generar-imagen/route.ts": {
      "maxDuration": 60,
      "memory": 1024
    },
    "src/app/api/generar-pdf/route.ts": {
      "maxDuration": 30,
      "memory": 1024
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-store" }
      ]
    }
  ]
}
```

### 8.2.3 Variables de entorno en Vercel

```
Ir a: Vercel Dashboard → Project → Settings → Environment Variables

Agregar TODAS las variables de .env.local con valores de PRODUCCIÓN:

Variable                          Scope
─────────────────────────────     ──────────
NEXT_PUBLIC_SUPABASE_URL          Production
NEXT_PUBLIC_SUPABASE_ANON_KEY     Production
SUPABASE_SERVICE_ROLE_KEY         Production
GEMINI_API_KEY                    Production
TWILIO_ACCOUNT_SID                Production
TWILIO_AUTH_TOKEN                 Production
TWILIO_WHATSAPP_FROM              Production
RESEND_API_KEY                    Production
RESEND_FROM_EMAIL                 Production
ADMIN_PASSWORD                    Production
NEXT_PUBLIC_APP_URL               Production  (= URL de producción de Vercel)
```

---

## 8.3 Dominio personalizado

```bash
# Opción A: Subdominio del dominio existente
# expo.presisso.com.ar → Vercel project

# En el registrar DNS:
# CNAME expo → cname.vercel-dns.com

# Opción B: URL corta para QR
# presisso.link/cocina → redirect a expo.presisso.com.ar/nuevo
```

En Vercel:
1. Settings → Domains → Add `expo.presisso.com.ar`
2. Configurar DNS según instrucciones de Vercel
3. SSL se genera automáticamente

---

## 8.4 Puppeteer en Vercel (Serverless)

Puppeteer no funciona directamente en Vercel Serverless. Opciones:

### Opción A: `@sparticuz/chromium` (recomendada)

```bash
pnpm add @sparticuz/chromium puppeteer-core
pnpm remove puppeteer
```

Actualizar `src/lib/pdf/generator.ts`:

```typescript
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function generatePDF(solicitud: Solicitud): Promise<Buffer> {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  // ... resto del código igual
}
```

### Opción B: API externa de PDF (más simple)

Usar un servicio como [html2pdf.app](https://html2pdf.app) o Browserless:

```typescript
export async function generatePDF(solicitud: Solicitud): Promise<Buffer> {
  const html = buildPDFHtml(solicitud);

  const response = await fetch("https://html2pdf.app/api/v1/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.HTML2PDF_API_KEY}`,
    },
    body: JSON.stringify({ html, format: "A4" }),
  });

  return Buffer.from(await response.arrayBuffer());
}
```

---

## 8.5 Twilio WhatsApp: Sandbox → Producción

```
1. SANDBOX (development):
   - El cliente debe enviar "join <keyword>" al número de sandbox
   - Solo funciona con números que hicieron join
   - Suficiente para testing

2. PRODUCCIÓN (expo):
   - Ir a Twilio Console → Messaging → WhatsApp
   - Registrar número de WhatsApp Business
   - Crear template de mensaje aprobado por Meta:

   Template name: presisso_cocina_resultado
   Body: "¡Hola {{1}}! Acá tenés tu cocina con muebles Presisso
          Línea {{2}}. Descargá tu PDF: {{3}}"
   Variables: nombre, tipo_cocina, pdf_url

   - Esperar aprobación (24-48 horas)
   - Actualizar código para usar template en lugar de mensaje libre
```

---

## 8.6 Resend: Configurar dominio

```
1. Ir a Resend Dashboard → Domains → Add Domain
2. Agregar: presisso.com.ar
3. Configurar registros DNS:
   - MX record
   - TXT record (SPF)
   - DKIM record
4. Esperar verificación (< 24 horas)
5. From address: cocinas@presisso.com.ar
```

---

## 8.7 Monitoreo durante la expo

### Vercel Analytics (built-in)

```
Vercel Dashboard → Analytics:
- Web Vitals (LCP, FID, CLS)
- Page views
- Function invocations
- Function errors
- Function duration
```

### Alertas mínimas

```typescript
// src/lib/utils/alerts.ts
// Enviar alerta al equipo si algo falla durante la expo

export async function alertTeam(message: string) {
  // Opción: enviar WhatsApp al equipo técnico
  try {
    await fetch("/api/enviar-whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: process.env.TEAM_WHATSAPP!, // Número del lead dev
        message: `⚠️ PRESISSO EXPO ALERT: ${message}`,
      }),
    });
  } catch {
    console.error("Alert failed:", message);
  }
}
```

### Dashboard de monitoreo en la expo

Tener abierto en una notebook/monitor del stand:
- **Tab 1:** Panel admin (`/admin`) — ver solicitudes en tiempo real
- **Tab 2:** Vercel Dashboard — ver errores
- **Tab 3:** Supabase Dashboard — ver tabla y storage

---

## 8.8 Procedimiento de rollback

```
SI ALGO FALLA DURANTE LA EXPO:

NIVEL 1 — Error puntual (una solicitud falla):
  → Regenerar imagen desde el panel admin
  → Si persiste, marcar como "error" y atender al cliente manualmente

NIVEL 2 — API de Gemini caída:
  → El sistema intenta fallback a Imagen 4 automáticamente
  → Si ambos fallan, notificar al equipo
  → Plan B: Tener 10 renders pre-generados de cada tipo para mostrar

NIVEL 3 — Vercel/Supabase caídos:
  → Verificar status pages:
    - status.vercel.com
    - status.supabase.com
  → Si persiste > 10 min: activar WiFi alternativo
  → Si persiste > 30 min: pasar a modo offline con renders pre-generados

NIVEL 4 — Error crítico en código:
  → Rollback a último deploy estable:
    Vercel Dashboard → Deployments → click "..." → Redeploy
  → Esto restaura el último deploy que funcionaba
```

---

## 8.9 Optimizaciones de performance para la expo

```typescript
// Precalentar la API de Gemini (ejecutar 1 vez antes de la expo)
// Esto asegura que las primeras solicitudes no tengan cold start

async function warmUp() {
  console.log("Precalentando Gemini API...");
  const testResult = await generateKitchenImage(
    "URL_DE_FOTO_DE_PRUEBA",
    "moderna"
  );
  console.log("Warm-up completado:", testResult.success, testResult.timeMs, "ms");
}
```

---

## 8.10 Checklist de deploy final

| # | Check | Estado |
|---|-------|--------|
| 1 | Deploy en Vercel con dominio `expo.presisso.com.ar` | ⬜ |
| 2 | SSL activo (HTTPS) | ⬜ |
| 3 | Variables de entorno de producción configuradas | ⬜ |
| 4 | Supabase con datos limpios (sin datos de testing) | ⬜ |
| 5 | Gemini API key con billing activo | ⬜ |
| 6 | Twilio WhatsApp template aprobado por Meta | ⬜ |
| 7 | Resend dominio verificado | ⬜ |
| 8 | QR generado apuntando a URL de producción | ⬜ |
| 9 | Test E2E en producción (no staging) pasado | ⬜ |
| 10 | Rollback probado (redeploy de versión anterior) | ⬜ |
| 11 | Notebook/monitor para panel admin en el stand | ⬜ |
| 12 | Warm-up de API ejecutado | ⬜ |
| 13 | 4G backup configurado y probado | ⬜ |
| 14 | Renders pre-generados de backup (Plan B) | ⬜ |
| 15 | Equipo técnico con acceso a todos los dashboards | ⬜ |

---

## 8.11 Post-expo

```
DESPUÉS DE LA EXPO:

1. Exportar datos:
   - Descargar CSV de Supabase con todas las solicitudes
   - Descargar todas las imágenes generadas

2. Métricas finales:
   - Total de solicitudes procesadas
   - Tasa de aprobación (aprobadas / total)
   - Tiempo promedio de generación
   - Tasa de envío exitoso (WhatsApp + Email)
   - Costo total de API

3. Decisión:
   - ¿Mantener el sistema activo post-expo?
   - ¿Escalarlo a la web principal de Presisso?
   - ¿Agregar más líneas de productos?

4. Cleanup:
   - Revocar API keys temporales
   - Reducir plan de Vercel si no se mantiene
   - Archivar repo con documentación
```
