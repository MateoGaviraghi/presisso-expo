# FASE 1 — Setup del Proyecto

> **Duración:** Semana 1, Días 1-2  
> **Responsable:** Lead Developer  
> **Entregable:** Proyecto base deployado en Vercel con Supabase conectado

---

## ⚙️ SKILLS REQUERIDAS — Leer antes de ejecutar

> **Documento de referencia:** [`09-SKILLS.md`](./09-SKILLS.md)

| Skill                    | Rol       | Nivel           |
| ------------------------ | --------- | --------------- |
| Arquitecto de Software   | Principal | Senior 15+ años |
| Desarrollador Full Stack | Principal | Senior 10+ años |
| Líder Técnico            | Principal | Senior 15+ años |
| Diseñador Gráfico        | Soporte   | Senior 10+ años |

### 📖 Skills del proyecto — LEER antes de ejecutar esta fase:

| Skill (archivo)                                                                                                           | Propósito en esta fase                        |
| ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| [`.agents/skills/supabase-postgres-best-practices/SKILL.md`](../.agents/skills/supabase-postgres-best-practices/SKILL.md) | Setup de PostgreSQL, schema, Storage, RLS     |
| [`.agents/skills/nextjs-react-typescript/SKILL.md`](../.agents/skills/nextjs-react-typescript/SKILL.md)                   | Estructura Next.js 14, App Router, TypeScript |
| [`.agents/skills/typescript-advanced-types/SKILL.md`](../.agents/skills/typescript-advanced-types/SKILL.md)               | Configuración TypeScript estricto             |
| [`.agents/skills/deploy-to-vercel/SKILL.md`](../.agents/skills/deploy-to-vercel/SKILL.md)                                 | Primer deploy a Vercel                        |

### Prompt de contexto — COPIAR antes de iniciar esta fase:

```
Actuá como un equipo integrado por:
- Arquitecto de Software Senior (15+ años) especializado en sistemas serverless,
  diseño de bases de datos PostgreSQL y arquitectura de proyectos Next.js 14.
- Desarrollador Full Stack Senior (10+ años) con dominio de TypeScript,
  Supabase, Tailwind CSS y configuración de entornos de desarrollo.
- Líder Técnico Senior que define estándares de código, estructura de carpetas
  y convenciones de naming para equipos de desarrollo.

PROYECTO: Sistema de visualización de cocinas con IA para expo presencial.
MARCA: Presisso — Amoblamientos. Colores: #D42B2B (rojo), #1A1A1A (negro), #F5F5F3 (gris).
STACK: Next.js 14 + TypeScript + Tailwind + Supabase + Vercel.
DEADLINE: 4 semanas hasta la expo. Esta es la Semana 1, días 1-2.
TAREA: Configurar el proyecto base desde cero con estructura profesional,
variables de entorno, schema de base de datos y primer deploy.
```

---

## 1.1 Instalación de herramientas globales

```bash
# Verificar versiones mínimas
node --version   # >= 20.x
npm --version    # >= 10.x
git --version    # >= 2.40

# Instalar pnpm (package manager recomendado por velocidad)
npm install -g pnpm@latest

# Instalar Vercel CLI
npm install -g vercel

# Instalar Supabase CLI
npm install -g supabase
```

---

## 1.2 Crear el proyecto Next.js

```bash
# Crear proyecto con App Router + TypeScript + Tailwind + ESLint
npx create-next-app@14 presisso-expo \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd presisso-expo
```

---

## 1.3 Estructura de carpetas

```
presisso-expo/
├── .env.local                    # Variables de entorno (NO commitear)
├── .env.example                  # Template de variables (SÍ commitear)
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── public/
│   ├── logo-presisso.svg         # Logo vectorial
│   ├── logo-presisso-white.svg   # Logo blanco para fondos oscuros
│   ├── favicon.ico
│   └── og-image.jpg              # Open Graph para compartir
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Layout raíz con fonts + metadata
│   │   ├── page.tsx              # Landing / redirect a /nuevo
│   │   ├── globals.css           # Variables CSS Presisso + Tailwind
│   │   ├── nuevo/
│   │   │   └── page.tsx          # Flujo cliente: wizard paso a paso
│   │   ├── gracias/
│   │   │   └── page.tsx          # Pantalla post-envío
│   │   ├── admin/
│   │   │   ├── layout.tsx        # Layout admin con auth guard
│   │   │   ├── page.tsx          # Dashboard principal
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Vista detalle/revisión de solicitud
│   │   └── api/
│   │       ├── solicitudes/
│   │       │   ├── route.ts      # GET (listar) + POST (crear)
│   │       │   └── [id]/
│   │       │       └── route.ts  # GET (detalle) + PATCH (actualizar estado)
│   │       ├── generar-imagen/
│   │       │   └── route.ts      # POST: llama a Gemini Imagen API
│   │       ├── generar-pdf/
│   │       │   └── route.ts      # POST: genera PDF con la imagen
│   │       ├── enviar-whatsapp/
│   │       │   └── route.ts      # POST: envía PDF por WhatsApp
│   │       ├── enviar-email/
│   │       │   └── route.ts      # POST: envía PDF por email
│   │       └── webhook/
│   │           └── route.ts      # Webhook Supabase real-time (opcional)
│   ├── components/
│   │   ├── ui/                   # Componentes base reutilizables
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── Toggle.tsx
│   │   ├── cliente/              # Componentes del wizard cliente
│   │   │   ├── StepIndicator.tsx
│   │   │   ├── PhotoUpload.tsx
│   │   │   ├── KitchenTypeSelector.tsx
│   │   │   ├── ClientForm.tsx
│   │   │   └── ConfirmStep.tsx
│   │   └── admin/                # Componentes del panel admin
│   │       ├── StatsCards.tsx
│   │       ├── RequestList.tsx
│   │       ├── RequestDetail.tsx
│   │       ├── ReviewModal.tsx
│   │       └── ImageComparison.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # Supabase browser client
│   │   │   ├── server.ts         # Supabase server client (cookies)
│   │   │   └── admin.ts          # Supabase service role client
│   │   ├── gemini/
│   │   │   ├── client.ts         # Google GenAI client init
│   │   │   ├── prompts.ts        # Prompts predeterminados por tipo cocina
│   │   │   └── generate.ts       # Función de generación de imagen
│   │   ├── pdf/
│   │   │   └── generator.ts      # Generación PDF con branding
│   │   ├── whatsapp/
│   │   │   └── sender.ts         # Integración Twilio WhatsApp
│   │   ├── email/
│   │   │   └── sender.ts         # Integración Resend
│   │   └── utils/
│   │       ├── constants.ts      # Constantes globales
│   │       ├── colors.ts         # Paleta Presisso exportada
│   │       └── validators.ts     # Validaciones de formulario
│   ├── hooks/
│   │   ├── useSupabaseRealtime.ts
│   │   └── useSolicitud.ts
│   └── types/
│       ├── solicitud.ts          # Tipos de solicitud
│       ├── database.ts           # Tipos generados por Supabase
│       └── api.ts                # Tipos de request/response
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Schema inicial de la DB
└── docs/                         # Esta documentación
    ├── 00-INDICE.md
    ├── 01-FASE-SETUP.md
    ├── ...
    └── 08-FASE-DEPLOY.md
```

---

## 1.4 Instalar dependencias

```bash
# Dependencias principales
pnpm add @google/genai            # SDK oficial Gemini API
pnpm add @supabase/supabase-js    # Supabase client
pnpm add @supabase/ssr            # Supabase SSR helpers para Next.js
pnpm add puppeteer                # Generación de PDF
pnpm add twilio                   # WhatsApp Business API
pnpm add resend                   # Email transaccional
pnpm add sharp                    # Procesamiento de imágenes (resize, optimize)
pnpm add zod                      # Validación de schemas
pnpm add nanoid                   # IDs únicos para solicitudes
pnpm add date-fns                 # Formateo de fechas

# Dependencias de desarrollo
pnpm add -D @types/node
pnpm add -D prettier prettier-plugin-tailwindcss
```

---

## 1.5 Variables de entorno

Crear archivo `.env.local` en la raíz (NUNCA commitear):

```env
# ============================================
# PRESISSO EXPO — Variables de Entorno
# ============================================

# --- Entorno ---
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# --- Supabase ---
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# --- Google Gemini API ---
GEMINI_API_KEY=AIzaSy...

# --- Twilio (WhatsApp) ---
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# --- Resend (Email) ---
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=cocinas@presisso.com.ar

# --- Admin ---
ADMIN_PASSWORD=presisso-expo-2026
```

Crear `.env.example` (SÍ commitear):

```env
# Copiar a .env.local y completar valores reales
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
ADMIN_PASSWORD=
```

---

## 1.6 Configuración de Tailwind con paleta Presisso

Editar `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        presisso: {
          red: "#D42B2B",
          "red-hover": "#B82424",
          "red-light": "#FDF2F2",
          black: "#1A1A1A",
          white: "#FFFFFF",
          "gray-light": "#F5F5F3",
          "gray-mid": "#6B6B6B",
          "gray-dark": "#333333",
          border: "#E5E5E5",
          surface: "#FAFAF9",
        },
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', "sans-serif"],
        body: ['"DM Sans"', "sans-serif"],
      },
      borderRadius: {
        presisso: "12px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 1.7 CSS global con variables Presisso

Editar `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap");

:root {
  /* Presisso Colors */
  --presisso-red: #d42b2b;
  --presisso-red-hover: #b82424;
  --presisso-red-light: #fdf2f2;
  --presisso-black: #1a1a1a;
  --presisso-white: #ffffff;
  --presisso-gray-light: #f5f5f3;
  --presisso-gray-mid: #6b6b6b;
  --presisso-gray-dark: #333333;
  --presisso-border: #e5e5e5;
  --presisso-surface: #fafaf9;

  /* Spacing */
  --container-max: 1200px;
  --container-padding: 20px;
}

body {
  font-family: "DM Sans", sans-serif;
  background-color: var(--presisso-gray-light);
  color: var(--presisso-gray-dark);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Plus Jakarta Sans", sans-serif;
}

/* Status badges */
.badge-pendiente {
  background: #fef3c7;
  color: #92400e;
}
.badge-generando {
  background: #ede9fe;
  color: #6d28d9;
}
.badge-revision {
  background: #dbeafe;
  color: #1e40af;
}
.badge-enviado {
  background: #d1fae5;
  color: #065f46;
}
.badge-rechazado {
  background: #fee2e2;
  color: #991b1b;
}
```

---

## 1.8 Setup de Supabase

### 1.8.1 Crear proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com) → New Project
2. Nombre: `presisso-expo`
3. Región: South America (São Paulo) o US East
4. Copiar `URL`, `anon key` y `service_role key` a `.env.local`

### 1.8.2 Schema de base de datos

Crear archivo `supabase/migrations/001_initial_schema.sql`:

```sql
-- ============================================
-- PRESISSO EXPO — Schema Inicial
-- ============================================

-- Tabla principal de solicitudes
CREATE TABLE solicitudes (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- Datos del cliente
  nombre          TEXT NOT NULL,
  whatsapp        TEXT NOT NULL,
  email           TEXT,

  -- Configuración
  tipo_cocina     TEXT NOT NULL CHECK (tipo_cocina IN ('moderna', 'premium')),
  enviar_pdf      BOOLEAN DEFAULT true,

  -- Imágenes
  foto_original   TEXT NOT NULL,         -- URL en Supabase Storage
  imagen_generada TEXT,                  -- URL imagen IA generada
  imagen_generada_2 TEXT,                -- URL backup/alternativa

  -- Estado del flujo
  estado          TEXT DEFAULT 'pendiente' NOT NULL
                  CHECK (estado IN (
                    'pendiente',         -- recién creada
                    'generando',         -- IA procesando
                    'revision',          -- imagen lista para revisión humana
                    'aprobada',          -- aprobada, generando PDF
                    'enviada',           -- PDF enviado al cliente
                    'rechazada',         -- imagen rechazada
                    'error'              -- error en algún paso
                  )),

  -- Metadatos IA
  prompt_usado    TEXT,                  -- prompt exacto enviado a Gemini
  modelo_ia       TEXT DEFAULT 'imagen-4.0-generate-001',
  intentos_generacion INT DEFAULT 0,
  tiempo_generacion_ms INT,

  -- Metadatos envío
  pdf_url         TEXT,                  -- URL del PDF generado
  whatsapp_sid    TEXT,                  -- SID de Twilio (tracking)
  email_id        TEXT,                  -- ID de Resend (tracking)
  enviado_at      TIMESTAMPTZ,

  -- Notas internas
  notas_admin     TEXT
);

-- Índices para queries frecuentes
CREATE INDEX idx_solicitudes_estado ON solicitudes(estado);
CREATE INDEX idx_solicitudes_created ON solicitudes(created_at DESC);
CREATE INDEX idx_solicitudes_tipo ON solicitudes(tipo_cocina);

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER solicitudes_updated_at
  BEFORE UPDATE ON solicitudes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Storage bucket para fotos
INSERT INTO storage.buckets (id, name, public)
VALUES ('fotos-cocinas', 'fotos-cocinas', true);

-- Policy: cualquiera puede subir fotos (público para la expo)
CREATE POLICY "Público puede subir fotos"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'fotos-cocinas');

-- Policy: cualquiera puede ver fotos
CREATE POLICY "Público puede ver fotos"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'fotos-cocinas');

-- Habilitar Realtime para la tabla solicitudes
ALTER PUBLICATION supabase_realtime ADD TABLE solicitudes;

-- Vista para estadísticas del dashboard
CREATE VIEW stats_expo AS
SELECT
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE estado IN ('pendiente', 'generando', 'revision')) AS en_proceso,
  COUNT(*) FILTER (WHERE estado = 'enviada') AS enviadas,
  COUNT(*) FILTER (WHERE estado = 'rechazada') AS rechazadas,
  COUNT(*) FILTER (WHERE estado = 'error') AS errores,
  AVG(tiempo_generacion_ms) FILTER (WHERE tiempo_generacion_ms IS NOT NULL) AS promedio_generacion_ms,
  COUNT(*) FILTER (WHERE created_at > now() - INTERVAL '1 day') AS total_hoy
FROM solicitudes;
```

### 1.8.3 Ejecutar migración

```bash
# Opción A: Desde Supabase CLI
supabase db push

# Opción B: Copiar el SQL y ejecutar en Supabase Dashboard → SQL Editor
```

---

## 1.9 Configurar Git

```bash
git init
git add .
git commit -m "chore: setup inicial proyecto presisso-expo"

# Crear repo en GitHub/GitLab y conectar
git remote add origin git@github.com:presisso/presisso-expo.git
git push -u origin main
```

`.gitignore` debe incluir:

```
node_modules/
.next/
.env.local
.env.*.local
*.tsbuildinfo
```

---

## 1.10 Primer deploy a Vercel (preview)

```bash
# Login en Vercel
vercel login

# Deploy inicial
vercel

# Configurar variables de entorno en Vercel Dashboard:
# Settings → Environment Variables → copiar todas las de .env.local
```

---

## 1.11 Verificación de la fase

| Check | Criterio                                            |
| ----- | --------------------------------------------------- |
| ✅    | `pnpm dev` levanta en `localhost:3000` sin errores  |
| ✅    | Tailwind renderiza colores Presisso correctamente   |
| ✅    | Supabase conecta (verificar en console del browser) |
| ✅    | Tabla `solicitudes` creada en Supabase              |
| ✅    | Storage bucket `fotos-cocinas` creado               |
| ✅    | Deploy en Vercel funciona (URL de preview)          |
| ✅    | Variables de entorno configuradas en Vercel         |
| ✅    | `.env.local` en `.gitignore`                        |
