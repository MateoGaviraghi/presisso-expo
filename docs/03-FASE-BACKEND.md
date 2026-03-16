# FASE 3 — Backend y API

> **Duración:** Semana 2, Días 1-2  
> **Responsable:** Backend Developer  
> **Entregable:** API REST funcional con CRUD de solicitudes  

---

## ⚙️ SKILLS REQUERIDAS — Leer antes de ejecutar

> **Documento de referencia:** [`09-SKILLS.md`](./09-SKILLS.md)

| Skill | Rol | Nivel |
|-------|-----|-------|
| Desarrollador Full Stack | Principal | Senior 10+ años |
| Arquitecto de Software | Principal | Senior 15+ años |
| Líder Técnico | Soporte | Senior 15+ años |

### 📖 Skills del proyecto — LEER antes de ejecutar esta fase:

| Skill (archivo) | Propósito en esta fase |
|------------------|------------------------|
| [`.agents/skills/nextjs-react-typescript/SKILL.md`](../.agents/skills/nextjs-react-typescript/SKILL.md) | API Routes Next.js, Server Components |
| [`.agents/skills/supabase-postgres-best-practices/SKILL.md`](../.agents/skills/supabase-postgres-best-practices/SKILL.md) | Queries, RLS, Storage, Realtime |
| [`.agents/skills/nextjs-supabase-auth/SKILL.md`](../.agents/skills/nextjs-supabase-auth/SKILL.md) | Autenticación admin con Supabase |
| [`.agents/skills/typescript-advanced-types/SKILL.md`](../.agents/skills/typescript-advanced-types/SKILL.md) | Tipado estricto, Zod schemas, contratos API |

### Prompt de contexto — COPIAR antes de iniciar esta fase:

```
Actuá como un equipo integrado por:
- Desarrollador Full Stack Senior (10+ años) especializado en APIs REST con 
  Next.js API Routes, validación con Zod, y Supabase server-side.
- Arquitecto de Software Senior (15+ años) con experiencia en diseño de APIs, 
  manejo de estados asíncronos, patterns de error handling y seguridad.
- Líder Técnico Senior que asegura calidad de código, tipado estricto 
  y contratos de API bien definidos.

PROYECTO: API backend para sistema de visualización de cocinas con IA.
BASE DE DATOS: Supabase (PostgreSQL) con tabla solicitudes y flujo de estados.
ESTADOS: pendiente → generando → revision → aprobada → enviada (o error/rechazada).
TAREA: Implementar los API Routes de CRUD de solicitudes, estadísticas del dashboard 
y middleware de autenticación simple para el panel admin.
```

---

## 3.1 Cliente Supabase server-side — `src/lib/supabase/admin.ts`

```typescript
import { createClient } from "@supabase/supabase-js";

// Service role client — solo usar en API routes (server-side)
// NUNCA exponer al browser
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
```

---

## 3.2 API Route: Crear y listar solicitudes

`src/app/api/solicitudes/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { clientFormSchema } from "@/lib/utils/validators";
import { z } from "zod";

// POST /api/solicitudes — Crear nueva solicitud
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validar payload
    const createSchema = clientFormSchema.extend({
      foto_original: z.string().url(),
    });
    const validated = createSchema.parse(body);

    // Insertar en Supabase
    const { data, error } = await supabaseAdmin
      .from("solicitudes")
      .insert({
        nombre: validated.nombre,
        whatsapp: validated.whatsapp,
        email: validated.email || null,
        tipo_cocina: validated.tipo_cocina,
        enviar_pdf: validated.enviar_pdf,
        foto_original: validated.foto_original,
        estado: "pendiente",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Error al crear solicitud" },
        { status: 500 }
      );
    }

    // Disparar generación de imagen automáticamente
    // (fire-and-forget, no bloquea la respuesta al cliente)
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/generar-imagen`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ solicitud_id: data.id }),
    }).catch(console.error);

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: err.errors },
        { status: 400 }
      );
    }
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}

// GET /api/solicitudes — Listar solicitudes (admin)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const estado = searchParams.get("estado");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  let query = supabaseAdmin
    .from("solicitudes")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (estado) {
    query = query.eq("estado", estado);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count, limit, offset });
}
```

---

## 3.3 API Route: Detalle y actualización de solicitud

`src/app/api/solicitudes/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// GET /api/solicitudes/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { data, error } = await supabaseAdmin
    .from("solicitudes")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Solicitud no encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}

// PATCH /api/solicitudes/:id — Actualizar estado
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  // Campos permitidos para actualizar
  const allowedFields = [
    "estado",
    "imagen_generada",
    "imagen_generada_2",
    "prompt_usado",
    "modelo_ia",
    "intentos_generacion",
    "tiempo_generacion_ms",
    "pdf_url",
    "whatsapp_sid",
    "email_id",
    "enviado_at",
    "notas_admin",
  ];

  const updateData: Record<string, any> = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  }

  const { data, error } = await supabaseAdmin
    .from("solicitudes")
    .update(updateData)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
```

---

## 3.4 API Route: Estadísticas (admin dashboard)

`src/app/api/stats/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("stats_expo")
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
```

---

## 3.5 Middleware de autenticación admin

`src/app/admin/layout.tsx`:

```typescript
"use client";

import { useState, useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("presisso-admin");
    if (saved === "true") setAuthed(true);
  }, []);

  const handleLogin = () => {
    // Simple auth para la expo (no requiere sistema de usuarios completo)
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASS || password === "presisso2026") {
      sessionStorage.setItem("presisso-admin", "true");
      setAuthed(true);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-presisso-gray-light">
        <div className="bg-white rounded-2xl p-8 shadow-card max-w-sm w-full">
          <h1 className="font-heading text-xl font-bold text-presisso-black mb-1">
            presisso<span className="text-presisso-red">.</span>
          </h1>
          <p className="text-presisso-gray-mid text-sm mb-6">Panel de administración</p>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full px-4 py-3 border border-presisso-border rounded-presisso mb-3"
          />
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-presisso-red text-white rounded-presisso font-semibold
                       hover:bg-presisso-red-hover transition-colors"
          >
            Ingresar
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
```

---

## 3.6 Verificación de la fase

| Check | Criterio |
|-------|----------|
| ✅ | `POST /api/solicitudes` crea registro correctamente |
| ✅ | `GET /api/solicitudes` lista con paginación y filtro por estado |
| ✅ | `GET /api/solicitudes/:id` retorna detalle |
| ✅ | `PATCH /api/solicitudes/:id` actualiza estado |
| ✅ | `GET /api/stats` retorna estadísticas del dashboard |
| ✅ | Validación Zod rechaza payloads inválidos con error 400 |
| ✅ | Fire-and-forget a `/api/generar-imagen` se dispara al crear |
| ✅ | Auth admin funciona con contraseña de sesión |
