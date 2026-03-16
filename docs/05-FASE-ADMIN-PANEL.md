# FASE 5 — Panel de Administración

> **Duración:** Semana 3, Días 1-3  
> **Responsable:** Frontend Developer  
> **Entregable:** Dashboard funcional con revisión, aprobación y regeneración  

---

## ⚙️ SKILLS REQUERIDAS — Leer antes de ejecutar

> **Documento de referencia:** [`09-SKILLS.md`](./09-SKILLS.md)

| Skill | Rol | Nivel |
|-------|-----|-------|
| Desarrollador Full Stack | Principal | Senior 10+ años |
| Diseñador Gráfico | Principal | Senior 10+ años |
| Ingeniero Industrial | Soporte | Optimización operativa |

### 📖 Skills del proyecto — LEER antes de ejecutar esta fase:

| Skill (archivo) | Propósito en esta fase |
|------------------|------------------------|
| [`.agents/skills/nextjs-react-typescript/SKILL.md`](../.agents/skills/nextjs-react-typescript/SKILL.md) | Componentes React, Server/Client Components |
| [`.agents/skills/ui-ux-pro-max/SKILL.md`](../.agents/skills/ui-ux-pro-max/SKILL.md) | Dashboard UI, diseño operativo eficiente |
| [`.agents/skills/tailwindcss-advanced-layouts/SKILL.md`](../.agents/skills/tailwindcss-advanced-layouts/SKILL.md) | Layout del dashboard, grid de stats |
| [`.agents/skills/supabase-postgres-best-practices/SKILL.md`](../.agents/skills/supabase-postgres-best-practices/SKILL.md) | Realtime subscriptions, queries |
| [`.agents/skills/nextjs-supabase-auth/SKILL.md`](../.agents/skills/nextjs-supabase-auth/SKILL.md) | Auth guard del panel admin |
| [`.agents/skills/typescript-advanced-types/SKILL.md`](../.agents/skills/typescript-advanced-types/SKILL.md) | Tipado de estado, props, respuestas |

### Prompt de contexto — COPIAR antes de iniciar esta fase:

```
Actuá como un equipo integrado por:
- Desarrollador Full Stack Senior (10+ años) con experiencia en dashboards 
  real-time, Supabase Realtime subscriptions, y UIs de gestión operativa.
- Diseñador Gráfico Senior (10+ años) especializado en diseño de interfaces 
  de administración eficientes, con foco en velocidad operativa y claridad visual.
- Ingeniero Industrial con experiencia en diseño de puestos de trabajo operativos 
  y optimización de flujos de aprobación/rechazo.

PROYECTO: Panel de administración para operadores en el stand de la expo Presisso.
CONTEXTO: El operador debe revisar imágenes IA, aprobar o regenerar, y enviar 
el resultado al cliente. Todo en menos de 60 segundos por solicitud.
PRIORIDADES: Velocidad operativa > features > estética. Cada click cuenta.
TAREA: Construir dashboard admin con stats real-time, lista de solicitudes 
con estados, modal de revisión con comparación lado a lado, y botones de acción.
```

---

## 5.1 Dashboard principal — `src/app/admin/page.tsx`

```typescript
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import StatsCards from "@/components/admin/StatsCards";
import RequestList from "@/components/admin/RequestList";
import ReviewModal from "@/components/admin/ReviewModal";
import type { Solicitud } from "@/types/solicitud";

export default function AdminDashboard() {
  const supabase = createClient();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos iniciales
  useEffect(() => {
    fetchData();
  }, []);

  // Suscripción real-time para actualizaciones automáticas
  useEffect(() => {
    const channel = supabase
      .channel("solicitudes-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "solicitudes" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setSolicitudes((prev) => [payload.new as Solicitud, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setSolicitudes((prev) =>
              prev.map((s) =>
                s.id === payload.new.id ? (payload.new as Solicitud) : s
              )
            );
          }
          // Refrescar stats
          fetchStats();
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchSolicitudes(), fetchStats()]);
    setLoading(false);
  };

  const fetchSolicitudes = async () => {
    const res = await fetch("/api/solicitudes?limit=100");
    const { data } = await res.json();
    setSolicitudes(data || []);
  };

  const fetchStats = async () => {
    const res = await fetch("/api/stats");
    const data = await res.json();
    setStats(data);
  };

  const selected = solicitudes.find((s) => s.id === selectedId);

  return (
    <div className="min-h-screen bg-presisso-gray-light">
      {/* Header */}
      <header className="bg-white border-b border-presisso-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-heading text-xl font-bold text-presisso-black">
            presisso<span className="text-presisso-red">.</span>
          </h1>
          <span className="text-xs font-medium text-presisso-gray-mid bg-presisso-gray-light px-3 py-1 rounded-full">
            Panel Admin
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-presisso-gray-mid">Expo en vivo</span>
          <button
            onClick={fetchData}
            className="ml-4 text-sm text-presisso-red hover:underline"
          >
            Refrescar
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* Stats */}
        {stats && <StatsCards stats={stats} />}

        {/* Request List */}
        <RequestList
          solicitudes={solicitudes}
          loading={loading}
          onSelect={setSelectedId}
        />
      </main>

      {/* Review Modal */}
      {selected && (
        <ReviewModal
          solicitud={selected}
          onClose={() => setSelectedId(null)}
          onRefresh={fetchData}
        />
      )}
    </div>
  );
}
```

---

## 5.2 Tarjetas de estadísticas — `src/components/admin/StatsCards.tsx`

```typescript
interface Props {
  stats: {
    total_hoy: number;
    en_proceso: number;
    enviadas: number;
    errores: number;
    promedio_generacion_ms: number | null;
  };
}

export default function StatsCards({ stats }: Props) {
  const cards = [
    { label: "Total hoy", value: stats.total_hoy, color: "text-presisso-black" },
    { label: "En proceso", value: stats.en_proceso, color: "text-amber-600" },
    { label: "Enviadas", value: stats.enviadas, color: "text-green-600" },
    { label: "Errores", value: stats.errores, color: "text-presisso-red" },
    {
      label: "Promedio IA",
      value: stats.promedio_generacion_ms
        ? `${(stats.promedio_generacion_ms / 1000).toFixed(1)}s`
        : "—",
      color: "text-presisso-gray-dark",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      {cards.map((c) => (
        <div
          key={c.label}
          className="bg-white rounded-xl p-4 border border-presisso-border"
        >
          <p className="text-xs font-medium text-presisso-gray-mid uppercase tracking-wider mb-1">
            {c.label}
          </p>
          <p className={`text-2xl font-semibold ${c.color}`}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 5.3 Modal de revisión — `src/components/admin/ReviewModal.tsx`

```typescript
"use client";

import { useState } from "react";
import type { Solicitud } from "@/types/solicitud";

interface Props {
  solicitud: Solicitud;
  onClose: () => void;
  onRefresh: () => void;
}

export default function ReviewModal({ solicitud, onClose, onRefresh }: Props) {
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<string | null>(null);

  const handleApprove = async () => {
    setLoading(true);
    setAction("approve");

    // 1. Generar PDF
    await fetch("/api/generar-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ solicitud_id: solicitud.id }),
    });

    // 2. Enviar por WhatsApp y/o Email
    if (solicitud.enviar_pdf) {
      await fetch("/api/enviar-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solicitud_id: solicitud.id }),
      });

      if (solicitud.email) {
        await fetch("/api/enviar-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ solicitud_id: solicitud.id }),
        });
      }
    }

    // 3. Actualizar estado a enviada
    await fetch(`/api/solicitudes/${solicitud.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        estado: "enviada",
        enviado_at: new Date().toISOString(),
      }),
    });

    setLoading(false);
    onRefresh();
    onClose();
  };

  const handleRegenerate = async () => {
    setLoading(true);
    setAction("regenerate");

    await fetch("/api/generar-imagen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ solicitud_id: solicitud.id }),
    });

    setLoading(false);
    onRefresh();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-presisso-border flex justify-between items-start">
          <div>
            <h3 className="font-heading text-lg font-bold">
              Revisión — {solicitud.nombre}
            </h3>
            <p className="text-sm text-presisso-gray-mid mt-1">
              Línea {solicitud.tipo_cocina === "moderna" ? "Moderna" : "Premium"} •{" "}
              {solicitud.whatsapp}
            </p>
          </div>
          <button onClick={onClose} className="text-presisso-gray-mid hover:text-presisso-black">
            ✕
          </button>
        </div>

        {/* Image comparison */}
        <div className="p-5">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold text-presisso-gray-mid uppercase tracking-wider mb-2">
                Foto original
              </p>
              <img
                src={solicitud.foto_original}
                alt="Original"
                className="w-full rounded-xl border border-presisso-border object-cover aspect-[4/3]"
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-presisso-gray-mid uppercase tracking-wider mb-2">
                Imagen generada por IA
              </p>
              {solicitud.imagen_generada ? (
                <img
                  src={solicitud.imagen_generada}
                  alt="Generada"
                  className="w-full rounded-xl border-2 border-green-200 object-cover aspect-[4/3]"
                />
              ) : (
                <div className="w-full aspect-[4/3] bg-presisso-gray-light rounded-xl flex items-center justify-center">
                  <span className="text-presisso-gray-mid text-sm">Generando...</span>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          {solicitud.tiempo_generacion_ms && (
            <p className="text-xs text-presisso-gray-mid mb-4">
              Modelo: {solicitud.modelo_ia} • Tiempo: {(solicitud.tiempo_generacion_ms / 1000).toFixed(1)}s •
              Intentos: {solicitud.intentos_generacion}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleApprove}
              disabled={loading || !solicitud.imagen_generada}
              className="flex-[2] py-3 bg-presisso-red text-white rounded-xl font-semibold
                         hover:bg-presisso-red-hover disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors flex items-center justify-center gap-2"
            >
              {loading && action === "approve" ? "Enviando..." : "✓ Aprobar y enviar"}
            </button>
            <button
              onClick={handleRegenerate}
              disabled={loading}
              className="flex-1 py-3 border border-presisso-border rounded-xl font-medium
                         hover:bg-presisso-gray-light disabled:opacity-50 transition-colors
                         flex items-center justify-center gap-2"
            >
              {loading && action === "regenerate" ? "Regenerando..." : "↻ Regenerar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 5.4 Verificación de la fase

| Check | Criterio |
|-------|----------|
| ✅ | Dashboard muestra stats en tiempo real |
| ✅ | Lista de solicitudes con filtro por estado |
| ✅ | Real-time via Supabase: nuevas solicitudes aparecen solas |
| ✅ | Modal de revisión con comparación lado a lado |
| ✅ | Botón "Aprobar y enviar" genera PDF + envía |
| ✅ | Botón "Regenerar" relanza la generación IA |
| ✅ | Estados se actualizan correctamente en la lista |
| ✅ | Auth admin funcional |
| ✅ | Colores Presisso (#D42B2B) en todo el panel |
