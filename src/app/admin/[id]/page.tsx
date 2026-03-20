"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ESTADO_LABELS } from "@/lib/utils/constants";
import { EstadoBadge } from "@/components/admin/EstadoBadge";
import { createClient } from "@/lib/supabase/client";
import type { Solicitud, EstadoSolicitud } from "@/types/solicitud";

// ── State pipeline ────────────────────────────────────────────────────────────

const STATE_FLOW = ["generando", "revision", "aprobada"] as const;

const ADMIN_ESTADOS = ["generando", "revision", "aprobada"] as const;

function StatePipeline({ estado }: { estado: string }) {
  const isTerminal = estado === "error" || estado === "rechazada";
  const currentIdx = STATE_FLOW.indexOf(estado as (typeof STATE_FLOW)[number]);

  const steps = STATE_FLOW.map((step, idx) => {
    const isPast = !isTerminal && currentIdx > idx;
    const isCurrent = !isTerminal && currentIdx === idx;
    return { step, idx, isPast, isCurrent };
  });

  return (
    <div className="rounded-2xl border border-presisso-border bg-white p-4 sm:p-5">
      {/* Pipeline: 3 circles connected by lines */}
      <div className="relative flex items-start justify-between">
        {/* Background connector line — spans from center of first to center of last circle */}
        <div className="pointer-events-none absolute top-[13px] left-[14px] right-[14px] h-0.5 bg-presisso-border" />
        {/* Filled portion of the line */}
        {currentIdx > 0 && !isTerminal && (
          <div
            className={`pointer-events-none absolute top-[13px] left-[14px] h-0.5 bg-presisso-black ${
              currentIdx >= STATE_FLOW.length - 1 ? "right-[14px]" : "right-1/2"
            }`}
          />
        )}

        {steps.map(({ step, idx, isPast, isCurrent }) => (
          <div
            key={step}
            className="relative z-10 flex flex-col items-center gap-1"
          >
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-all ${
                isCurrent
                  ? "bg-presisso-red text-white shadow-sm ring-2 ring-presisso-red/20"
                  : isPast
                    ? "bg-presisso-black text-white"
                    : "bg-presisso-border text-presisso-gray-mid"
              }`}
            >
              {isPast ? (
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              ) : (
                idx + 1
              )}
            </div>
            <span
              className={`hidden text-[10px] whitespace-nowrap sm:block ${
                isCurrent
                  ? "font-semibold text-presisso-red"
                  : isPast
                    ? "text-presisso-gray-dark"
                    : "text-presisso-gray-mid"
              }`}
            >
              {ESTADO_LABELS[step]}
            </span>
          </div>
        ))}

        {isTerminal && (
          <div className="absolute -right-2 top-0 z-10 flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            {ESTADO_LABELS[estado] ?? estado}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminSolicitudPage() {
  const { id } = useParams<{ id: string }>();
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "ok" | "error";
  } | null>(null);
  const [notas, setNotas] = useState("");
  const [nuevoEstado, setNuevoEstado] = useState<EstadoSolicitud>("pendiente");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const supabase = useMemo(() => createClient(), []);

  // Imágenes disponibles para el lightbox
  const lightboxImages: { src: string; label: string }[] = [];
  if (solicitud?.foto_original) {
    lightboxImages.push({ src: solicitud.foto_original, label: "Original" });
  }
  if (solicitud?.imagen_generada) {
    lightboxImages.push({
      src: solicitud.imagen_generada,
      label: `Generada — ${solicitud.tipo_cocina}`,
    });
  }

  function showToast(msg: string, type: "ok" | "error" = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  const openLightbox = (src: string) => {
    const idx = lightboxImages.findIndex((img) => img.src === src);
    setLightboxIdx(idx >= 0 ? idx : 0);
  };

  const navigateLightbox = useCallback(
    (dir: 1 | -1) => {
      if (lightboxIdx === null || lightboxImages.length < 2) return;
      setLightboxIdx(
        (lightboxIdx + dir + lightboxImages.length) % lightboxImages.length,
      );
    },
    [lightboxIdx, lightboxImages.length],
  );

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIdx === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowLeft") navigateLightbox(-1);
      if (e.key === "ArrowRight") navigateLightbox(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx, navigateLightbox]);

  // Initial load
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/solicitudes/${id}`);
        if (!res.ok) throw new Error("Solicitud no encontrada");
        const data: Solicitud = await res.json();
        setSolicitud(data);
        setNotas(data.notas_admin ?? "");
        setNuevoEstado(data.estado);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // Supabase realtime — auto-update when estado changes (e.g. generando → revision)
  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`solicitud-detail-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "solicitudes",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          const updated = payload.new as Solicitud;
          setSolicitud(updated);
          setNuevoEstado(updated.estado);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, supabase]);

  async function handleUpdate() {
    if (!solicitud) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/solicitudes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estado: nuevoEstado,
          notas_admin: notas || null,
        }),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      const updated: Solicitud = await res.json();
      setSolicitud(updated);
      showToast("Guardado correctamente");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Error inesperado",
        "error",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleGenerate() {
    if (!solicitud?.foto_original) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/generar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solicitud_id: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error en generación");
      const updated = await fetch(`/api/solicitudes/${id}`);
      if (updated.ok) {
        const sol: Solicitud = await updated.json();
        setSolicitud(sol);
        setNuevoEstado(sol.estado);
      }
      showToast(
        `Imagen generada con ${data.model} en ${Math.round(data.time_ms / 1000)}s`,
      );
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Error al generar",
        "error",
      );
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-[76px] animate-pulse rounded-2xl bg-presisso-border" />
        <div className="h-64 animate-pulse rounded-2xl bg-presisso-border" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-48 animate-pulse rounded-2xl bg-presisso-border" />
          <div className="h-48 animate-pulse rounded-2xl bg-presisso-border" />
        </div>
      </div>
    );
  }

  if (error || !solicitud) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error ?? "Solicitud no encontrada"}
        </div>
        <Link href="/admin" className="text-presisso-red hover:underline">
          ← Volver al dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-medium shadow-lg transition-all ${
            toast.type === "ok"
              ? "bg-presisso-black text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIdx !== null && lightboxImages[lightboxIdx] && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/70">
            {lightboxImages[lightboxIdx].label}
            <span className="ml-2 text-white/40">
              ({lightboxIdx + 1}/{lightboxImages.length})
            </span>
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxImages[lightboxIdx].src}
            alt={lightboxImages[lightboxIdx].label}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {lightboxImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox(-1);
                }}
                aria-label="Imagen anterior"
                className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox(1);
                }}
                aria-label="Imagen siguiente"
                className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </>
          )}
          <button
            onClick={() => setLightboxIdx(null)}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          {lightboxImages.length > 1 && (
            <p className="mt-3 text-xs text-white/40">
              ← → para navegar · Esc para cerrar
            </p>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/admin"
          className="flex items-center gap-1 text-sm text-presisso-gray-mid hover:text-presisso-black"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Dashboard
        </Link>
        <h2 className="font-heading text-2xl font-bold text-presisso-black">
          {solicitud.nombre}
        </h2>
        <span className="rounded-full bg-presisso-gray-light px-3 py-1 text-xs font-medium capitalize text-presisso-gray-dark">
          {solicitud.tipo_cocina}
        </span>
        <EstadoBadge estado={solicitud.estado} />
      </div>

      {/* State pipeline */}
      <StatePipeline estado={solicitud.estado} />

      {/* State-specific banners */}
      {solicitud.estado === "generando" && (
        <div className="flex items-center gap-3 rounded-xl border border-presisso-border bg-presisso-gray-light px-4 py-3 text-sm text-presisso-gray-dark">
          <span className="h-2 w-2 animate-pulse rounded-full bg-presisso-red" />
          <span className="font-medium">Generando imagen con IA…</span>
        </div>
      )}
      {solicitud.estado === "error" && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span className="font-medium">
            Hubo un error en la generación. Podés intentar regenerar la imagen
            desde el panel de acciones.
          </span>
        </div>
      )}

      {/* Antes y Después */}
      {solicitud.foto_original && solicitud.imagen_generada && (
        <div className="space-y-4 rounded-2xl border border-presisso-border bg-white p-6">
          <h3 className="text-center font-heading text-lg font-bold text-presisso-black">
            Antes y Después
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-center text-xs font-semibold uppercase tracking-wider text-presisso-gray-mid">
                Original
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={solicitud.foto_original}
                alt="Cocina original"
                onClick={() => openLightbox(solicitud.foto_original!)}
                className="w-full cursor-zoom-in rounded-xl object-contain transition-transform hover:scale-[1.02]"
              />
            </div>
            <div className="space-y-2">
              <p className="text-center text-xs font-semibold uppercase tracking-wider text-presisso-red">
                Generada — Presisso {solicitud.tipo_cocina}
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={solicitud.imagen_generada}
                alt="Cocina generada"
                onClick={() => openLightbox(solicitud.imagen_generada!)}
                className="w-full cursor-zoom-in rounded-xl object-contain transition-transform hover:scale-[1.02]"
              />
            </div>
          </div>
          {solicitud.modelo_ia && (
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-presisso-gray-mid">
              <span>
                Modelo:{" "}
                <strong className="text-presisso-black">
                  {solicitud.modelo_ia}
                </strong>
              </span>
              {solicitud.tiempo_generacion_ms && (
                <span>
                  Tiempo:{" "}
                  <strong className="text-presisso-black">
                    {Math.round(solicitud.tiempo_generacion_ms / 1000)}s
                  </strong>
                </span>
              )}
              {solicitud.intentos_generacion > 0 && (
                <span>
                  Intentos:{" "}
                  <strong className="text-presisso-black">
                    {solicitud.intentos_generacion}
                  </strong>
                </span>
              )}
            </div>
          )}
          <p className="text-center text-xs text-presisso-gray-mid">
            Click en cualquier imagen para ver en pantalla completa
          </p>
        </div>
      )}

      {/* Solo foto original (sin generada) */}
      {solicitud.foto_original && !solicitud.imagen_generada && (
        <div className="space-y-3 rounded-2xl border border-presisso-border bg-white p-6">
          <h3 className="font-semibold text-presisso-black">Foto original</h3>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={solicitud.foto_original}
            alt="Cocina original"
            onClick={() => openLightbox(solicitud.foto_original!)}
            className="w-full cursor-zoom-in rounded-xl object-contain transition-transform hover:scale-[1.02]"
          />
          <p className="text-center text-xs text-presisso-gray-mid">
            Click para ver en pantalla completa
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Datos del cliente */}
        <div className="space-y-3 rounded-2xl border border-presisso-border bg-white p-6">
          <h3 className="font-semibold text-presisso-black">
            Datos del cliente
          </h3>
          <div className="divide-y divide-presisso-border/60">
            <Row label="WhatsApp" value={solicitud.whatsapp} />
            <Row label="Email" value={solicitud.email ?? "—"} />
            <Row label="Estilo" value={solicitud.tipo_cocina} capitalize />
            <Row label="PDF" value={solicitud.enviar_pdf ? "Sí" : "No"} />
            <Row
              label="Fecha"
              value={new Date(solicitud.created_at).toLocaleString("es-AR")}
            />
            <Row
              label="Estado actual"
              value={ESTADO_LABELS[solicitud.estado] ?? solicitud.estado}
              badge={<EstadoBadge estado={solicitud.estado} />}
            />
          </div>
        </div>

        {/* Acciones admin */}
        <div className="space-y-4 rounded-2xl border border-presisso-border bg-white p-6">
          <h3 className="font-semibold text-presisso-black">Acciones</h3>

          <div>
            <label
              htmlFor="nuevo-estado"
              className="mb-1 block text-sm font-medium text-presisso-gray-dark"
            >
              Cambiar estado
            </label>
            <select
              id="nuevo-estado"
              value={nuevoEstado}
              onChange={(e) =>
                setNuevoEstado(e.target.value as EstadoSolicitud)
              }
              className="w-full rounded-xl border border-presisso-border px-3 py-2.5 text-sm text-presisso-black focus:border-presisso-red focus:outline-none focus:ring-1 focus:ring-presisso-red/30"
            >
              {ADMIN_ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {ESTADO_LABELS[e] ?? e}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-presisso-gray-dark">
              Notas internas
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              placeholder="Notas sobre esta solicitud…"
              className="w-full rounded-xl border border-presisso-border px-3 py-2.5 text-sm text-presisso-black placeholder:text-presisso-gray-mid/50 focus:border-presisso-red focus:outline-none focus:ring-1 focus:ring-presisso-red/30"
            />
          </div>

          <button
            onClick={handleUpdate}
            disabled={saving}
            className="w-full rounded-xl bg-presisso-red py-3 font-semibold text-white transition-colors hover:bg-presisso-red-hover disabled:opacity-50"
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>

          {solicitud.foto_original && (
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full rounded-xl border-2 border-presisso-red py-3 font-semibold text-presisso-red transition-colors hover:bg-presisso-red hover:text-white disabled:opacity-50"
            >
              {generating
                ? "Generando imagen… (puede tardar ~30s)"
                : solicitud.imagen_generada
                  ? "Regenerar imagen IA"
                  : "Generar imagen IA"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  capitalize,
  badge,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-presisso-gray-mid">{label}</span>
      {badge ?? (
        <span
          className={`text-sm font-medium text-presisso-black ${capitalize ? "capitalize" : ""}`}
        >
          {value}
        </span>
      )}
    </div>
  );
}
