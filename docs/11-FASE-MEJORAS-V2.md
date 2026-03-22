# FASE 11 — Mejoras V2: Robustez, Seguridad y Calidad

> **Prioridad:** Post-expo o pre-producción real
> **Responsable:** Lead Developer
> **Objetivo:** Llevar el MVP a un producto sólido, seguro y escalable

---

## Resumen de Mejoras

| # | Área | Prioridad | Esfuerzo | Impacto |
|---|------|-----------|----------|---------|
| 1 | Validación de Inputs (Zod) | ALTA | 2-3h | Previene crashes en producción |
| 2 | Recovery de estados stuck | ALTA | 1-2h | Elimina solicitudes colgadas |
| 3 | Seguridad Admin (Auth real) | ALTA | 4-6h | Protege el panel de accesos no autorizados |
| 4 | Row Level Security (RLS) | ALTA | 2-3h | Protege la base de datos |
| 5 | Optimización de imágenes | MEDIA | 1-2h | Mejora performance y carga |
| 6 | Monitoreo y error tracking | MEDIA | 1-2h | Visibilidad de errores en producción |
| 7 | Email profesional (dominio propio) | MEDIA | 1-2h | Deliverability y confianza |
| 8 | Notificaciones admin en tiempo real | BAJA | 1-2h | Mejor UX operativa |
| 9 | Audit log de acciones | BAJA | 2-3h | Trazabilidad completa |
| 10 | Tests unitarios y de integración | BAJA | 4-6h | Estabilidad a largo plazo |
| 11 | Migración de estado "pendiente" en DB | ALTA | 0.5h | Consistencia de datos |
| 12 | Timeout y queue para generación IA | ALTA | 3-4h | Evita solicitudes colgadas en Vercel |
| 13 | Protección de API secrets | ALTA | 1h | Previene llamadas no autorizadas |
| 14 | Tipos discriminados por estado | MEDIA | 2-3h | Type safety, menos bugs |
| 15 | Preview de PDF antes de enviar | MEDIA | 2-3h | Admin verifica antes de mandar |

---

## 1. Validación de Inputs con Zod

**Problema:** Las API routes no validan los datos que reciben. Un payload malformado causa errores 500 sin contexto.

**Solución:** Instalar `zod` y validar cada endpoint.

### Archivos a modificar:

```
src/app/api/solicitudes/route.ts          — POST: validar nombre, whatsapp, tipo_cocina, foto_original
src/app/api/solicitudes/[id]/route.ts     — PATCH: validar estado (union), notas_admin (optional string)
src/app/api/admin/generar/route.ts        — POST: validar solicitud_id (uuid)
src/app/api/generar-pdf/route.ts          — POST: validar solicitud_id (uuid)
src/app/api/enviar-email/route.ts         — POST: validar solicitud_id (uuid)
src/app/api/admin/auth/route.ts           — POST: validar password (string)
```

### Implementación:

```bash
pnpm add zod
```

Crear `src/lib/validations/solicitud.ts`:

```typescript
import { z } from "zod";

export const createSolicitudSchema = z.object({
  nombre: z.string().min(1).max(100),
  whatsapp: z.string().min(6).max(20),
  email: z.string().email().optional().or(z.literal("")),
  tipo_cocina: z.enum(["moderna", "premium"]),
  enviar_pdf: z.boolean(),
  foto_original: z.string().url(),
});

export const updateSolicitudSchema = z.object({
  estado: z.enum(["generando", "revision", "aprobada", "enviada", "error"]).optional(),
  notas_admin: z.string().nullable().optional(),
});

export const solicitudIdSchema = z.object({
  solicitud_id: z.string().uuid(),
});
```

En cada API route, validar al inicio:

```typescript
const parsed = createSolicitudSchema.safeParse(body);
if (!parsed.success) {
  return NextResponse.json(
    { error: "Datos inválidos", details: parsed.error.flatten() },
    { status: 400 }
  );
}
// Usar parsed.data en vez de body
```

### Checklist:
- [ ] Instalar zod
- [ ] Crear schemas en `src/lib/validations/solicitud.ts`
- [ ] Aplicar validación en POST `/api/solicitudes`
- [ ] Aplicar validación en PATCH `/api/solicitudes/[id]`
- [ ] Aplicar validación en POST `/api/admin/generar`
- [ ] Aplicar validación en POST `/api/generar-pdf`
- [ ] Aplicar validación en POST `/api/enviar-email`

---

## 2. Recovery de Estados Stuck

**Problema:** Si la generación de imagen falla silenciosamente (timeout de Vercel, error de red), la solicitud queda en "generando" para siempre. El admin no tiene forma de saber que está colgada.

**Solución:** Crear un endpoint que detecte y resetee solicitudes stuck.

### Archivos a crear:

```
src/app/api/admin/recovery/route.ts
```

### Implementación:

```typescript
// GET /api/admin/recovery — detecta y resetea solicitudes stuck
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  const { data, error } = await supabaseAdmin
    .from("solicitudes")
    .update({ estado: "error" })
    .eq("estado", "generando")
    .lt("updated_at", fiveMinutesAgo)
    .select("id, nombre");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    recovered: data?.length ?? 0,
    solicitudes: data,
  });
}
```

**Opción avanzada:** Configurar un Vercel Cron Job que ejecute esto cada 5 minutos:

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/admin/recovery",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

> Nota: Vercel Cron Jobs usa GET por defecto. Adaptar a GET si se usa cron, o proteger con un token.

### Checklist:
- [ ] Crear endpoint `/api/admin/recovery`
- [ ] Agregar botón "Recuperar stuck" en dashboard admin (opcional)
- [ ] Configurar Vercel Cron Job (opcional, requiere plan Pro)
- [ ] Agregar columna `updated_at` con trigger en Supabase si no existe

---

## 3. Seguridad Admin — Auth Real

**Problema:** El admin se protege con un password plano comparado contra una env var. Se guarda en `sessionStorage` sin expiración. No hay rate limiting. Cualquier persona con DevTools puede bypasearlo.

**Solución:** Implementar autenticación con Supabase Auth.

### Archivos a modificar:

```
src/app/admin/layout.tsx              — Reemplazar password check por Supabase Auth
src/app/api/admin/auth/route.ts       — Reemplazar por Supabase sign-in
src/lib/supabase/client.ts            — Ya existe, solo usar onAuthStateChange
```

### Implementación:

1. **Crear usuario admin en Supabase Dashboard:**
   - Authentication > Users > Invite user
   - Email: admin@presisso.com.ar (o el que quieran)
   - Password: una contraseña segura

2. **Reemplazar el login:**

```typescript
// En layout.tsx — usar supabase.auth.signInWithPassword
const { error } = await supabase.auth.signInWithPassword({
  email: emailInput,
  password: passwordInput,
});
```

3. **Verificar sesión:**

```typescript
// En layout.tsx — verificar si hay sesión activa
const { data: { session } } = await supabase.auth.getSession();
if (session) setAuthed(true);
```

4. **Proteger API routes** con middleware o verificación de sesión.

### Checklist:
- [ ] Crear usuario admin en Supabase
- [ ] Actualizar login form para usar email + password
- [ ] Usar `supabase.auth.getSession()` para verificar autenticación
- [ ] Agregar middleware de Next.js para proteger rutas `/admin/*`
- [ ] Logout real con `supabase.auth.signOut()`
- [ ] Remover `ADMIN_PASSWORD` de env vars

---

## 4. Row Level Security (RLS)

**Problema:** Todas las API routes usan `supabaseAdmin` (service role) que bypasea RLS. Si alguien descubre un endpoint, tiene acceso total.

**Solución:** Configurar RLS policies en la tabla `solicitudes`.

### Implementación en Supabase SQL Editor:

```sql
-- Habilitar RLS
ALTER TABLE solicitudes ENABLE ROW LEVEL SECURITY;

-- Policy: el servicio (service_role) siempre tiene acceso total
-- (ya es así por defecto, service_role bypasea RLS)

-- Policy: usuarios anónimos solo pueden INSERT (crear solicitudes)
CREATE POLICY "Anon can insert solicitudes"
  ON solicitudes FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: usuarios anónimos NO pueden leer, actualizar ni borrar
-- (no se crean policies = deny por defecto)

-- Policy: usuarios autenticados (admin) pueden todo
CREATE POLICY "Authenticated users full access"
  ON solicitudes FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

### Checklist:
- [ ] Habilitar RLS en tabla `solicitudes`
- [ ] Crear policy INSERT para anon
- [ ] Crear policy ALL para authenticated
- [ ] Testear que el form del cliente siga funcionando
- [ ] Testear que el admin siga funcionando
- [ ] Considerar migrar API routes de admin a usar client con auth en vez de service_role

---

## 5. Optimización de Imágenes

**Problema:** Las fotos originales y generadas se cargan directamente desde Supabase Storage sin optimización. En mobile, cargar imágenes de 2-5MB es lento.

**Solución:** Usar `next/image` con `remotePatterns` para Supabase.

### Archivos a modificar:

```
next.config.mjs                      — Agregar remotePatterns para Supabase
src/app/admin/[id]/page.tsx           — Reemplazar <img> por <Image>
```

### Implementación:

```javascript
// next.config.mjs
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rkmenjdjldfpfttkirkn.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};
```

En los componentes, reemplazar:
```tsx
// Antes
<img src={solicitud.foto_original} alt="..." className="w-full" />

// Después
<Image
  src={solicitud.foto_original}
  alt="..."
  width={800}
  height={600}
  className="w-full object-cover"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### Checklist:
- [ ] Configurar `remotePatterns` en `next.config.mjs`
- [ ] Reemplazar `<img>` por `<Image>` en página de detalle admin
- [ ] Reemplazar `<img>` por `<Image>` en lightbox (si es posible)
- [ ] Verificar que las imágenes se optimizan y cargan más rápido

---

## 6. Monitoreo y Error Tracking

**Problema:** Si algo falla en producción no hay forma de enterarse hasta que un usuario se queja. No hay logs estructurados ni alertas.

**Solución:** Integrar Sentry (free tier: 5K events/mes).

### Implementación:

```bash
pnpm add @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Esto crea automáticamente:
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- Modifica `next.config.mjs`

### Captura manual en API routes críticas:

```typescript
import * as Sentry from "@sentry/nextjs";

try {
  // ... generación de imagen
} catch (err) {
  Sentry.captureException(err, {
    extra: { solicitud_id: id, estado: solicitud.estado },
  });
  // ... manejar error
}
```

### Checklist:
- [ ] Instalar Sentry SDK
- [ ] Configurar con wizard
- [ ] Agregar `SENTRY_DSN` a env vars (local + Vercel)
- [ ] Agregar capturas manuales en `/api/generar-imagen`, `/api/generar-pdf`, `/api/enviar-email`
- [ ] Verificar que errores aparecen en el dashboard de Sentry

---

## 7. Email Profesional (Dominio Propio)

**Problema:** Se usa Gmail personal para enviar emails. Tiene límite de 500/día, puede ser bloqueado por Google, y los emails pueden caer en spam porque el dominio no coincide.

**Solución:** Cuando se tenga acceso al DNS de presisso.com.ar, migrar a Resend o seguir con SMTP pero con dominio propio.

### Opción A: Resend (recomendado)

```bash
pnpm add resend
```

1. Crear cuenta en resend.com
2. Verificar dominio `presisso.com.ar` (agregar registros DNS: DKIM, SPF, DMARC)
3. Reemplazar nodemailer por Resend SDK

```typescript
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: "Presisso <noreply@presisso.com.ar>",
  to: email,
  subject: "...",
  html: "...",
});
```

### Opción B: Gmail con dominio (Google Workspace)

Si ya tienen Google Workspace con @presisso.com.ar:
- Crear un email como `notificaciones@presisso.com.ar`
- Generar app password para ese email
- Actualizar las env vars SMTP

### Checklist:
- [ ] Decidir entre Resend vs Gmail con dominio
- [ ] Configurar DNS (SPF, DKIM, DMARC)
- [ ] Actualizar `src/lib/email/sender.ts`
- [ ] Actualizar env vars en Vercel
- [ ] Enviar email de prueba y verificar que no cae en spam
- [ ] Verificar que el logo se renderiza correctamente

---

## 8. Notificaciones Admin en Tiempo Real

**Problema:** Cuando llega una nueva solicitud, el admin no se entera a menos que esté mirando el dashboard. En una expo con flujo constante, esto genera demoras.

**Solución:** Agregar indicadores visuales y sonido cuando llega una nueva solicitud.

### Archivos a modificar:

```
src/hooks/useSupabaseRealtime.ts      — Detectar INSERTs y notificar
src/app/admin/page.tsx                — Badge en tab + sonido
```

### Implementación:

```typescript
// En useSupabaseRealtime.ts — agregar callback de nueva solicitud
const [newCount, setNewCount] = useState(0);

// En el handler de INSERT:
if (payload.eventType === "INSERT") {
  setSolicitudes((prev) => [payload.new as Solicitud, ...prev]);
  setNewCount((c) => c + 1);
  // Sonido de notificación
  new Audio("/notification.mp3").play().catch(() => {});
}
```

```typescript
// En page.tsx — badge en título del tab
useEffect(() => {
  if (newCount > 0) {
    document.title = `(${newCount}) Presisso Admin`;
  } else {
    document.title = "Presisso Admin";
  }
}, [newCount]);
```

### Checklist:
- [ ] Agregar archivo de sonido `public/notification.mp3` (corto, sutil)
- [ ] Detectar INSERTs y reproducir sonido
- [ ] Actualizar título del tab con contador
- [ ] Resetear contador cuando el admin hace scroll o click
- [ ] Testear con solicitudes reales

---

## 9. Audit Log de Acciones

**Problema:** No hay registro de quién aprobó una imagen, cuándo se regeneró, cuántas veces se envió el email. Si algo sale mal, no hay forma de investigar.

**Solución:** Crear tabla `audit_log` en Supabase.

### Implementación SQL:

```sql
CREATE TABLE audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  solicitud_id uuid REFERENCES solicitudes(id) ON DELETE CASCADE,
  accion text NOT NULL,        -- 'aprobar', 'regenerar', 'generar_pdf', 'enviar_email'
  detalle jsonb DEFAULT '{}'   -- metadata extra
);

CREATE INDEX idx_audit_solicitud ON audit_log(solicitud_id);
```

### Helper en código:

```typescript
// src/lib/audit.ts
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function logAction(
  solicitudId: string,
  accion: string,
  detalle?: Record<string, unknown>
) {
  await supabaseAdmin.from("audit_log").insert({
    solicitud_id: solicitudId,
    accion,
    detalle: detalle ?? {},
  });
}
```

Usar en cada API route:

```typescript
await logAction(id, "aprobar");
await logAction(id, "generar_pdf", { pdf_url: url });
await logAction(id, "enviar_email", { email: solicitud.email });
```

### Checklist:
- [ ] Crear tabla `audit_log` en Supabase
- [ ] Crear helper `src/lib/audit.ts`
- [ ] Agregar logs en: aprobar, regenerar, generar PDF, enviar email
- [ ] Mostrar timeline de acciones en la página de detalle admin (opcional)

---

## 10. Tests Unitarios y de Integración

**Problema:** Cero cobertura de tests. Si se cambia algo, no hay forma de saber si se rompió otra cosa.

**Solución:** Agregar tests con Vitest (más rápido que Jest para Next.js).

### Implementación:

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
```

### Tests prioritarios:

| Archivo | Qué testear |
|---------|-------------|
| `src/lib/validations/solicitud.test.ts` | Schemas de Zod aceptan/rechazan datos correctos |
| `src/lib/pdf/generator.test.ts` | Generación de PDF no tira error con datos válidos |
| `src/app/api/solicitudes/route.test.ts` | POST rechaza datos inválidos, crea con datos válidos |
| `src/components/admin/EstadoBadge.test.tsx` | Renderiza cada estado con el color correcto |

### Checklist:
- [ ] Instalar Vitest + Testing Library
- [ ] Configurar vitest.config.ts
- [ ] Escribir tests para validaciones (Zod schemas)
- [ ] Escribir tests para EstadoBadge component
- [ ] Escribir tests para API route de solicitudes (mock Supabase)
- [ ] Agregar script `"test": "vitest"` en package.json
- [ ] Ejecutar tests en CI (GitHub Actions) — opcional

---

## 11. Migración de Estado "pendiente" en DB

**Problema:** Se eliminó "pendiente" del type system y del flujo, pero en la DB siguen existiendo registros con ese estado. Esto causa inconsistencias: el badge muestra "Pendiente" con fallback, y la página de detalle necesita un workaround especial.

**Solución:** Migrar todos los registros con estado "pendiente" a "generando" o "error", y prevenir que se creen nuevos.

### Implementación SQL (ejecutar en Supabase SQL Editor):

```sql
-- Migrar pendientes existentes a "error" (requieren acción manual del admin)
UPDATE solicitudes
SET estado = 'error', updated_at = now()
WHERE estado = 'pendiente';

-- Agregar constraint para prevenir estados inválidos
ALTER TABLE solicitudes
ADD CONSTRAINT valid_estado
CHECK (estado IN ('generando', 'revision', 'aprobada', 'enviada', 'error'));
```

### Después de migrar — limpiar código:

```
src/app/admin/[id]/page.tsx           — Eliminar el caso isPendiente y su banner
src/components/admin/EstadoBadge.tsx   — Eliminar config de "pendiente"
src/lib/utils/constants.ts             — Eliminar "pendiente" de ESTADO_LABELS
```

### Checklist:
- [ ] Ejecutar UPDATE en Supabase SQL Editor
- [ ] Agregar constraint CHECK en tabla
- [ ] Limpiar código del workaround "pendiente"
- [ ] Verificar que el form del cliente nunca inserte "pendiente"
- [ ] Verificar que el admin funciona correctamente

---

## 12. Timeout y Queue para Generación de IA

**Problema:** Vercel free plan tiene un límite de 60 segundos para funciones serverless. Gemini puede tardar más. Si el timeout se cumple, la solicitud queda en "generando" para siempre sin que nadie se entere. Además, el POST de `/api/solicitudes` hace un fire-and-forget a `/api/generar-imagen` con un `fetch()` sin `await` — si Vercel mata el proceso, la generación nunca arranca.

**Solución:** Implementar un sistema de queue o, como mínimo, un mecanismo robusto de retry.

### Opción A: Queue con QStash (Upstash) — Recomendado

QStash es un servicio de mensajería HTTP que reintenta automáticamente. Free tier: 500 mensajes/día.

```bash
pnpm add @upstash/qstash
```

```typescript
// src/app/api/solicitudes/route.ts — reemplazar fire-and-forget
import { Client } from "@upstash/qstash";

const qstash = new Client({ token: process.env.QSTASH_TOKEN! });

// En vez de fetch fire-and-forget:
await qstash.publishJSON({
  url: `${process.env.NEXT_PUBLIC_APP_URL}/api/generar-imagen`,
  body: { solicitud_id: id },
  retries: 3,
  delay: 0,
});
```

Beneficios:
- **Retry automático** — si falla, reintenta 3 veces
- **No depende del proceso original** — la cola es externa
- **Timeout independiente** — QStash espera la respuesta del endpoint

### Opción B: Timeout handling manual (sin servicios externos)

Agregar manejo de timeout en el endpoint de generación:

```typescript
// src/app/api/generar-imagen/route.ts
export const maxDuration = 60;

// Wrap la llamada a Gemini con un timeout
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 55_000); // 55s safety margin

try {
  const result = await generateWithGemini(solicitud, { signal: controller.signal });
  clearTimeout(timeout);
  // ...actualizar estado a "revision"
} catch (err) {
  clearTimeout(timeout);
  if (err instanceof DOMException && err.name === "AbortError") {
    // Timeout — marcar como error
    await supabaseAdmin
      .from("solicitudes")
      .update({ estado: "error" })
      .eq("id", solicitud_id);
  }
  throw err;
}
```

### Combinar con Recovery (Mejora #2):

Independientemente de la opción elegida, el endpoint de recovery (mejora #2) actúa como red de seguridad para cualquier caso que se escape.

### Checklist:
- [ ] Decidir entre QStash vs timeout manual
- [ ] Si QStash: crear cuenta en Upstash, obtener token, agregar env vars
- [ ] Reemplazar fire-and-forget por queue o timeout handling
- [ ] Testear con generaciones que tardan >30s
- [ ] Verificar que solicitudes stuck se recuperan correctamente
- [ ] Agregar logging de timeouts para monitoreo

---

## 13. Protección de API Secrets

**Problema:** El endpoint `/api/generar-imagen` acepta llamadas de cualquier origen. Aunque tiene un `INTERNAL_API_SECRET`, hay que verificar que se valide correctamente y que todos los endpoints internos (server-to-server) estén protegidos.

**Solución:** Verificar y reforzar la validación del secret en todos los endpoints internos.

### Archivos a verificar:

```
src/app/api/generar-imagen/route.ts   — Debe validar INTERNAL_API_SECRET
src/app/api/admin/generar/route.ts    — Endpoint público, debe verificar sesión admin
src/app/api/admin/recovery/route.ts   — Debe estar protegido
```

### Implementación — middleware de protección:

```typescript
// src/lib/auth/api-guard.ts
export function validateInternalSecret(req: Request): boolean {
  const auth = req.headers.get("authorization");
  const expected = `Bearer ${process.env.INTERNAL_API_SECRET}`;
  return auth === expected;
}

export function validateAdminSession(req: Request): boolean {
  // Para endpoints admin, verificar que viene de una sesión autenticada
  // Cuando se implemente Supabase Auth (mejora #3), esto verificará el JWT
  const auth = req.headers.get("authorization");
  return !!auth; // placeholder hasta implementar auth real
}
```

### En cada endpoint interno:

```typescript
// src/app/api/generar-imagen/route.ts
if (!validateInternalSecret(req)) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

### Variables en Vercel:

Verificar que estas env vars NO son `NEXT_PUBLIC_` (no se exponen al browser):
- `INTERNAL_API_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SMTP_PASS`
- `GEMINI_API_KEY`

### Checklist:
- [ ] Crear helper `src/lib/auth/api-guard.ts`
- [ ] Verificar que `/api/generar-imagen` valida el secret
- [ ] Verificar que `/api/admin/*` endpoints están protegidos
- [ ] Auditar env vars en Vercel — ninguna con `NEXT_PUBLIC_` que sea sensible
- [ ] Testear que llamadas sin auth retornan 401

---

## 14. Tipos Discriminados por Estado

**Problema:** El tipo `Solicitud` tiene campos como `imagen_generada: string | null` y `pdf_url: string | null`, pero no hay garantía a nivel de tipos de que si el estado es "aprobada", `imagen_generada` siempre existe. Esto causa checks innecesarios en el código (`solicitud.imagen_generada!`) y posibles bugs.

**Solución:** Crear tipos discriminados por estado usando union types de TypeScript.

### Archivo a modificar:

```
src/types/solicitud.ts
```

### Implementación:

```typescript
// Base compartida
interface SolicitudBase {
  id: string;
  created_at: string;
  updated_at: string;
  nombre: string;
  whatsapp: string;
  email: string | null;
  tipo_cocina: "moderna" | "premium";
  enviar_pdf: boolean;
  foto_original: string;
  modelo_ia: string;
  intentos_generacion: number;
  notas_admin: string | null;
}

// Discriminated unions por estado
interface SolicitudGenerando extends SolicitudBase {
  estado: "generando";
  imagen_generada: null;
  tiempo_generacion_ms: null;
  pdf_url: null;
  whatsapp_sid: null;
  email_id: null;
  enviado_at: null;
  prompt_usado: string | null;
}

interface SolicitudRevision extends SolicitudBase {
  estado: "revision";
  imagen_generada: string;           // SIEMPRE existe
  tiempo_generacion_ms: number;      // SIEMPRE existe
  pdf_url: string | null;
  whatsapp_sid: null;
  email_id: null;
  enviado_at: null;
  prompt_usado: string;
}

interface SolicitudAprobada extends SolicitudBase {
  estado: "aprobada";
  imagen_generada: string;
  tiempo_generacion_ms: number;
  pdf_url: string | null;
  whatsapp_sid: null;
  email_id: null;
  enviado_at: null;
  prompt_usado: string;
}

interface SolicitudEnviada extends SolicitudBase {
  estado: "enviada";
  imagen_generada: string;
  tiempo_generacion_ms: number;
  pdf_url: string;                   // SIEMPRE existe
  whatsapp_sid: string | null;
  email_id: string | null;
  enviado_at: string;                // SIEMPRE existe
  prompt_usado: string;
}

interface SolicitudError extends SolicitudBase {
  estado: "error";
  imagen_generada: string | null;
  tiempo_generacion_ms: number | null;
  pdf_url: string | null;
  whatsapp_sid: null;
  email_id: null;
  enviado_at: null;
  prompt_usado: string | null;
}

export type Solicitud =
  | SolicitudGenerando
  | SolicitudRevision
  | SolicitudAprobada
  | SolicitudEnviada
  | SolicitudError;

// Type guards
export function isAprobada(s: Solicitud): s is SolicitudAprobada {
  return s.estado === "aprobada";
}

export function isEnviada(s: Solicitud): s is SolicitudEnviada {
  return s.estado === "enviada";
}
```

### Beneficio en código:

```typescript
// Antes (unsafe)
if (solicitud.estado === "aprobada") {
  generatePdf(solicitud.imagen_generada!); // ! assertion
}

// Después (type-safe)
if (solicitud.estado === "aprobada") {
  generatePdf(solicitud.imagen_generada); // TypeScript sabe que es string
}
```

### Checklist:
- [ ] Reescribir `src/types/solicitud.ts` con discriminated unions
- [ ] Agregar type guards (`isAprobada`, `isEnviada`, etc.)
- [ ] Actualizar componentes que usan `Solicitud` para aprovechar narrowing
- [ ] Eliminar assertions `!` innecesarias en el código
- [ ] Verificar que el build de TypeScript pasa sin errores

---

## 15. Preview de PDF antes de Enviar

**Problema:** El admin genera el PDF y lo envía al cliente sin poder verificar cómo se ve. Si la imagen no se embebió bien, el layout está roto o los datos son incorrectos, el cliente recibe un PDF defectuoso.

**Solución:** Mostrar un preview del PDF embebido en la página de detalle antes de permitir el envío.

### Archivos a modificar:

```
src/app/admin/[id]/page.tsx           — Agregar iframe/embed de preview
```

### Implementación:

Después de generar el PDF, mostrar un preview inline usando un `<iframe>`:

```tsx
{/* Preview del PDF */}
{solicitud.pdf_url && (
  <div className="overflow-hidden rounded-2xl border border-presisso-border bg-white shadow-card">
    <div className="border-b border-presisso-border bg-presisso-surface px-5 py-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-presisso-gray-mid">
        Preview del PDF
      </h3>
    </div>
    <iframe
      src={solicitud.pdf_url}
      className="h-[600px] w-full"
      title="Preview del PDF generado"
    />
  </div>
)}
```

### Mejora adicional — preview antes del primer envío:

Agregar un paso de confirmación antes de enviar por email:

```tsx
const [confirmSend, setConfirmSend] = useState(false);

// Botón "Enviar Email" abre un modal de confirmación con preview
{confirmSend && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="max-w-lg rounded-2xl bg-white p-6 shadow-xl">
      <h3 className="font-semibold">Confirmar envío</h3>
      <p className="mt-2 text-sm text-presisso-gray-mid">
        Se enviará el PDF a <strong>{solicitud.email}</strong>
      </p>
      <iframe src={solicitud.pdf_url} className="mt-4 h-[400px] w-full rounded-lg border" />
      <div className="mt-4 flex gap-3">
        <button onClick={() => setConfirmSend(false)} className="...">Cancelar</button>
        <button onClick={() => { handleEnviarEmail(); setConfirmSend(false); }} className="...">
          Confirmar y Enviar
        </button>
      </div>
    </div>
  </div>
)}
```

### Checklist:
- [ ] Agregar iframe de preview en página de detalle (cuando pdf_url existe)
- [ ] Agregar modal de confirmación antes de enviar email (opcional)
- [ ] Verificar que el PDF se renderiza correctamente en iframe
- [ ] Testear en mobile (iframe puede necesitar scroll)

---

## Orden de Implementación Recomendado

```
SPRINT 1 (1-2 días) — Seguridad básica + estabilidad
├── 1. Validación con Zod
├── 2. Recovery de estados stuck
├── 4. RLS en Supabase
├── 11. Migración de "pendiente" en DB
└── 13. Protección de API secrets

SPRINT 2 (1-2 días) — Performance + monitoreo
├── 5. Optimización de imágenes (next/image)
├── 6. Sentry error tracking
└── 12. Timeout/queue para generación IA

SPRINT 3 (1-2 días) — UX operativa
├── 8. Notificaciones admin
├── 9. Audit log
└── 15. Preview de PDF

SPRINT 4 (cuando haya dominio) — Email profesional
└── 7. Migrar a Resend/dominio propio

SPRINT 5 (continuo) — Calidad de código
├── 3. Auth real con Supabase Auth
├── 10. Tests con Vitest
└── 14. Tipos discriminados por estado
```

---

> **Nota:** Todas estas mejoras son incrementales. El sistema funciona como está para la expo. Estas fases convierten el MVP en un producto sólido de producción.
