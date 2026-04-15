"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ESTADO_LABELS, getMaterialLabel, getModoLabel } from "@/lib/utils/constants";
import { EstadoBadge } from "@/components/admin/EstadoBadge";
import { createClient } from "@/lib/supabase/client";
import { adminFetch } from "@/lib/auth/admin-fetch";
import type { Solicitud } from "@/types/solicitud";

/* ── State pipeline visual ──────────────────────────────────────────────────── */

const STATE_FLOW: readonly string[] = ["generando", "revision", "aprobada"];

function StatePipeline({ estado }: { estado: string }) {
  const isTerminal = estado === "error";
  const currentIdx = STATE_FLOW.indexOf(estado);
  const progress =
    isTerminal ? 0 : currentIdx < 0 ? 0 : currentIdx / (STATE_FLOW.length - 1);

  return (
    <div className="rounded-2xl border border-presisso-border bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-presisso-gray-mid">
          Progreso
        </p>
        {isTerminal && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[11px] font-bold text-red-600">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Error
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="relative mb-5">
        <div className="h-1 rounded-full bg-presisso-border" />
        <div
          className="absolute inset-y-0 left-0 h-1 rounded-full bg-presisso-red transition-all duration-500"
          style={{ width: `${progress * 100}%` }}
        />
        {/* Dots */}
        <div className="absolute inset-x-0 -top-[5px] flex justify-between">
          {STATE_FLOW.map((step, idx) => {
            const isPast = !isTerminal && currentIdx > idx;
            const isCurrent = !isTerminal && currentIdx === idx;
            return (
              <div
                key={step}
                className={`flex h-[11px] w-[11px] items-center justify-center rounded-full border-2 transition-all ${
                  isCurrent
                    ? "border-presisso-red bg-presisso-red shadow-[0_0_0_3px_rgba(223,10,10,0.15)]"
                    : isPast
                      ? "border-presisso-red bg-presisso-red"
                      : "border-presisso-border bg-white"
                }`}
              >
                {isPast && (
                  <svg className="h-2 w-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between">
        {STATE_FLOW.map((step, idx) => {
          const isCurrent = !isTerminal && currentIdx === idx;
          const isPast = !isTerminal && currentIdx > idx;
          return (
            <p
              key={step}
              className={`text-[11px] font-medium ${
                isCurrent
                  ? "text-presisso-red"
                  : isPast
                    ? "text-presisso-black"
                    : "text-presisso-gray-mid/60"
              }`}
            >
              {ESTADO_LABELS[step]}
            </p>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────────────────── */

export default function AdminSolicitudPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [approving, setApproving] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "error" } | null>(null);
  const [notas, setNotas] = useState("");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const supabase = useMemo(() => createClient(), []);

  const lightboxImages: { src: string; label: string }[] = [];
  if (solicitud?.foto_original)
    lightboxImages.push({ src: solicitud.foto_original, label: "Original" });
  if (solicitud?.imagen_generada)
    lightboxImages.push({ src: solicitud.imagen_generada, label: `Generada — ${getMaterialLabel(solicitud.tipo_cocina)}` });

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
      setLightboxIdx((lightboxIdx + dir + lightboxImages.length) % lightboxImages.length);
    },
    [lightboxIdx, lightboxImages.length],
  );

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

  /* Load */
  useEffect(() => {
    (async () => {
      try {
        const res = await adminFetch(`/api/solicitudes/${id}`);
        if (!res.ok) throw new Error("Solicitud no encontrada");
        const data: Solicitud = await res.json();
        setSolicitud(data);
        setNotas(data.notas_admin ?? "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* Realtime + polling fallback */
  const generatingRef = useRef(generating);
  generatingRef.current = generating;
  const generateStartRef = useRef<string | null>(null);

  useEffect(() => {
    if (!id) return;

    // Callback reutilizable para procesar actualizaciones
    function handleUpdate(updated: Solicitud) {
      setSolicitud(updated);
      setNotas(updated.notas_admin ?? "");
      if (updated.estado === "revision" && generatingRef.current) {
        setGenerating(false);
        generateStartRef.current = null;
        const timeStr = updated.tiempo_generacion_ms
          ? ` en ${Math.round(updated.tiempo_generacion_ms / 1000)}s`
          : "";
        const modelStr = updated.modelo_ia ? ` (${updated.modelo_ia})` : "";
        showToast(`Imagen generada${timeStr}${modelStr} — lista para revisión`);
      }
      if (updated.estado === "error" && generatingRef.current) {
        setGenerating(false);
        generateStartRef.current = null;
        showToast(updated.notas_admin || "Error en la generación de imagen", "error");
      }
    }

    // Realtime subscription
    const channel = supabase
      .channel(`solicitud-detail-${id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "solicitudes", filter: `id=eq.${id}` },
        (payload) => handleUpdate(payload.new as Solicitud),
      )
      .subscribe();

    // Polling fallback: cada 5s mientras se está generando
    // Solo acepta resultados si updated_at es posterior al inicio de la generación
    const poll = setInterval(async () => {
      if (!generatingRef.current || !generateStartRef.current) return;
      try {
        const res = await adminFetch(`/api/solicitudes/${id}`);
        if (!res.ok) return;
        const data: Solicitud = await res.json();
        const updatedAfterStart = data.updated_at > generateStartRef.current;
        if (updatedAfterStart && data.estado !== "generando") {
          handleUpdate(data);
        }
      } catch { /* silent */ }
    }, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(poll);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, supabase]);

  /* ── Actions ──────────────────────────────────────────────────────────────── */

  async function handleGenerate() {
    if (!solicitud?.foto_original) return;
    setGenerating(true);
    setError(null);
    generateStartRef.current = new Date().toISOString();
    try {
      const res = await adminFetch("/api/admin/generar", {
        method: "POST",
        body: JSON.stringify({ solicitud_id: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al iniciar generación");
      showToast("Generación iniciada — esperá el resultado en tiempo real");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error al generar", "error");
      setGenerating(false);
      generateStartRef.current = null;
    }
  }

  async function handleApprove() {
    if (!solicitud) return;
    setApproving(true);
    try {
      const res = await adminFetch(`/api/solicitudes/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ estado: "aprobada" }),
      });
      if (!res.ok) throw new Error("Error al aprobar");
      setSolicitud(await res.json());
      showToast("Imagen aprobada");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error", "error");
    } finally {
      setApproving(false);
    }
  }

  async function handleGenerarPdf() {
    setGeneratingPdf(true);
    try {
      const res = await adminFetch("/api/generar-pdf", {
        method: "POST",
        body: JSON.stringify({ solicitud_id: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error generando PDF");
      const updated = await adminFetch(`/api/solicitudes/${id}`);
      if (updated.ok) setSolicitud(await updated.json());
      showToast("PDF generado correctamente");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error al generar PDF", "error");
    } finally {
      setGeneratingPdf(false);
    }
  }

  async function handleEnviarEmail() {
    setSendingEmail(true);
    try {
      const res = await adminFetch("/api/enviar-email", {
        method: "POST",
        body: JSON.stringify({ solicitud_id: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error enviando email");
      showToast("Email enviado correctamente");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error al enviar email", "error");
    } finally {
      setSendingEmail(false);
    }
  }

  async function handleSaveNotes() {
    if (!solicitud) return;
    setSavingNotes(true);
    try {
      const res = await adminFetch(`/api/solicitudes/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ notas_admin: notas || null }),
      });
      if (!res.ok) throw new Error("Error al guardar");
      showToast("Notas guardadas");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error", "error");
    } finally {
      setSavingNotes(false);
    }
  }

  async function handleDelete() {
    if (!confirm("¿Estás seguro de eliminar esta solicitud? Se borrarán las imágenes y el PDF. Esta acción no se puede deshacer.")) return;
    setDeleting(true);
    try {
      const res = await adminFetch(`/api/solicitudes/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al eliminar");
      }
      showToast("Solicitud eliminada");
      setTimeout(() => router.push("/admin"), 500);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error al eliminar", "error");
      setDeleting(false);
    }
  }

  /* ── Loading / Error ──────────────────────────────────────────────────────── */

  if (loading) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-presisso-border" />
        <div className="h-20 animate-pulse rounded-2xl bg-presisso-border" />
        <div className="h-72 animate-pulse rounded-2xl bg-presisso-border" />
      </div>
    );
  }

  if (error || !solicitud) {
    return (
      <div className="mx-auto max-w-md space-y-6 py-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-presisso-black">{error ?? "Solicitud no encontrada"}</p>
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-medium text-presisso-red hover:underline">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Volver al dashboard
        </Link>
      </div>
    );
  }

  /* State helpers */
  const estado = solicitud.estado;
  const isGenerando = estado === "generando" || generating;
  const isRevision = estado === "revision" && !generating;
  const isAprobada = estado === "aprobada" || estado === "enviada";
  const isError = estado === "error";
  // Handle legacy "pendiente" entries — treat as needing generation
  const isPendiente = estado === "pendiente" as string;

  const whatsappUrl =
    solicitud.whatsapp && solicitud.pdf_url
      ? `https://wa.me/${solicitud.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${solicitud.nombre}!\n\nTu cocina rediseñada con amoblamientos *Presisso ${getMaterialLabel(solicitud.tipo_cocina)}* ya está lista.\n\nPodés descargar tu diseño en PDF desde el siguiente enlace:\n\n${solicitud.pdf_url}\n\nSi tenés alguna consulta, estamos a tu disposición en el stand.\n\n_Presisso — Amoblamientos de cocina_`)}`
      : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-medium shadow-lg backdrop-blur-sm ${
            toast.type === "ok"
              ? "bg-presisso-black/95 text-white"
              : "bg-red-600/95 text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIdx !== null && lightboxImages[lightboxIdx] && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4" onClick={() => setLightboxIdx(null)}>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/70">
            {lightboxImages[lightboxIdx].label}
            <span className="ml-2 text-white/40">({lightboxIdx + 1}/{lightboxImages.length})</span>
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
              <button type="button" onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }} aria-label="Anterior" className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }} aria-label="Siguiente" className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </button>
            </>
          )}
          <button type="button" onClick={() => setLightboxIdx(null)} aria-label="Cerrar" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div>
        <Link
          href="/admin"
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-presisso-gray-mid transition-colors hover:text-presisso-red"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Dashboard
        </Link>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-presisso-black sm:text-3xl">
            {solicitud.nombre}
          </h1>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-presisso-gray-light px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-presisso-gray-dark">
              {getMaterialLabel(solicitud.tipo_cocina)}
            </span>
            <span className="rounded-md bg-blue-50 border border-blue-200 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-700">
              {getModoLabel(solicitud.modo)}
            </span>
            <EstadoBadge estado={solicitud.estado} />
          </div>
        </div>
      </div>

      {/* ── Pipeline ────────────────────────────────────────────────────────── */}
      <StatePipeline estado={solicitud.estado} />

      {/* ── Status banners ──────────────────────────────────────────────────── */}
      {isGenerando && (
        <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-900">Generando imagen con IA</p>
            <p className="text-xs text-blue-600">
              Procesando con Gemini — se actualiza automáticamente cuando termine.
              {solicitud.intentos_generacion > 1 && (
                <span className="ml-1 font-semibold">Intento #{solicitud.intentos_generacion}</span>
              )}
            </p>
          </div>
        </div>
      )}
      {isError && (
        <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-gradient-to-r from-red-50 to-orange-50 px-5 py-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-red-100">
            <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-red-900">Error en la generación</p>
            <p className="text-xs text-red-600 break-words">
              {solicitud.notas_admin || "Podés reintentar desde el panel de acciones"}
            </p>
          </div>
        </div>
      )}
      {isPendiente && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
            <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-900">Pendiente de generación</p>
            <p className="text-xs text-amber-600">Iniciá la generación de imagen desde las acciones</p>
          </div>
        </div>
      )}

      {/* ── Main grid ───────────────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Left: Images (2/3) ────────────────────────────────────────────── */}
        <div className="space-y-6 lg:col-span-2">
          {/* Before / After */}
          {solicitud.foto_original && solicitud.imagen_generada && !isGenerando && (
            <div className="overflow-hidden rounded-2xl border border-presisso-border bg-white shadow-card">
              <div className="border-b border-presisso-border bg-presisso-surface px-5 py-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-presisso-gray-mid">
                  Antes y Después
                </h3>
              </div>
              <div className="grid gap-px bg-presisso-border sm:grid-cols-2">
                <div className="group relative bg-white">
                  <div className="absolute left-3 top-3 z-10 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                    Original
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={solicitud.foto_original}
                    alt="Cocina original"
                    onClick={() => openLightbox(solicitud.foto_original!)}
                    className="w-full cursor-zoom-in object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="group relative bg-white">
                  <div className="absolute left-3 top-3 z-10 rounded-md bg-presisso-red/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                    Presisso {getMaterialLabel(solicitud.tipo_cocina)}
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={solicitud.imagen_generada}
                    alt="Cocina generada"
                    onClick={() => openLightbox(solicitud.imagen_generada!)}
                    className="w-full cursor-zoom-in object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
              </div>
              {/* Meta row */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-presisso-border px-5 py-2.5">
                <div className="flex flex-wrap gap-4 text-[11px] text-presisso-gray-mid">
                  {solicitud.modelo_ia && (
                    <span>Modelo: <strong className="text-presisso-black">{solicitud.modelo_ia}</strong></span>
                  )}
                  {solicitud.tiempo_generacion_ms != null && (
                    <span>Tiempo: <strong className="text-presisso-black">{Math.round(solicitud.tiempo_generacion_ms / 1000)}s</strong></span>
                  )}
                  {solicitud.intentos_generacion > 0 && (
                    <span>Intentos: <strong className="text-presisso-black">{solicitud.intentos_generacion}</strong></span>
                  )}
                </div>
                <p className="text-[10px] text-presisso-gray-mid/60">Click para ampliar</p>
              </div>
            </div>
          )}

          {/* Only original — no generated yet */}
          {solicitud.foto_original && !solicitud.imagen_generada && !isGenerando && (
            <div className="overflow-hidden rounded-2xl border border-presisso-border bg-white shadow-card">
              <div className="border-b border-presisso-border bg-presisso-surface px-5 py-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-presisso-gray-mid">
                  Foto Original
                </h3>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={solicitud.foto_original}
                alt="Cocina original"
                onClick={() => openLightbox(solicitud.foto_original!)}
                className="w-full cursor-zoom-in object-cover"
              />
            </div>
          )}

          {/* Generating placeholder */}
          {solicitud.foto_original && isGenerando && (
            <div className="overflow-hidden rounded-2xl border border-presisso-border bg-white shadow-card">
              <div className="border-b border-presisso-border bg-presisso-surface px-5 py-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-presisso-gray-mid">
                  Generando Imagen
                </h3>
              </div>
              <div className="grid gap-px bg-presisso-border sm:grid-cols-2">
                <div className="relative bg-white">
                  <div className="absolute left-3 top-3 z-10 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                    Original
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={solicitud.foto_original} alt="Original" className="w-full object-cover" />
                </div>
                <div className="flex items-center justify-center bg-presisso-surface p-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-presisso-border border-t-presisso-red" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-presisso-black">Procesando…</p>
                      <p className="mt-0.5 text-xs text-presisso-gray-mid">IA generando tu cocina</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Client data ──────────────────────────────────────────────────── */}
          <div className="overflow-hidden rounded-2xl border border-presisso-border bg-white shadow-card">
            <div className="border-b border-presisso-border bg-presisso-surface px-5 py-3">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-presisso-gray-mid">
                Datos del Cliente
              </h3>
            </div>
            <div className="grid gap-px bg-presisso-border sm:grid-cols-2">
              <DataCell label="WhatsApp" value={solicitud.whatsapp} mono />
              <DataCell label="Email" value={solicitud.email ?? "—"} />
              <DataCell label="Color" value={getMaterialLabel(solicitud.tipo_cocina)} />
              <DataCell label="PDF solicitado" value={solicitud.enviar_pdf ? "Sí" : "No"} />
              <DataCell label="Fecha" value={new Date(solicitud.created_at).toLocaleString("es-AR")} />
              <DataCell label="Estado" badge={<EstadoBadge estado={solicitud.estado} />} />
            </div>
          </div>
        </div>

        {/* ── Right: Actions (1/3) ──────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Action Panel */}
          <div className="overflow-hidden rounded-2xl border border-presisso-border bg-white shadow-card">
            <div className="border-b border-presisso-border bg-presisso-surface px-5 py-3">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-presisso-gray-mid">
                Acciones
              </h3>
            </div>
            <div className="space-y-3 p-5">
              {/* PENDIENTE: Generate for first time */}
              {isPendiente && (
                <ActionButton
                  onClick={handleGenerate}
                  disabled={generating}
                  variant="primary"
                  icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>}
                >
                  {generating ? "Generando…" : "Generar Imagen IA"}
                </ActionButton>
              )}

              {/* GENERANDO: just status */}
              {isGenerando && (
                <div className="flex items-center justify-center gap-2.5 rounded-xl bg-presisso-surface py-4 text-sm text-presisso-gray-dark">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-presisso-red border-t-transparent" />
                  <span className="font-medium">Procesando imagen…</span>
                </div>
              )}

              {/* REVISION: Approve + Regenerate */}
              {isRevision && (
                <>
                  <ActionButton
                    onClick={handleApprove}
                    disabled={approving}
                    variant="success"
                    icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                  >
                    {approving ? "Aprobando…" : "Aprobar Imagen"}
                  </ActionButton>
                  <ActionButton
                    onClick={handleGenerate}
                    disabled={generating}
                    variant="outline"
                    icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.182-3.182" /></svg>}
                  >
                    {generating ? "Regenerando…" : "Regenerar Imagen"}
                  </ActionButton>
                </>
              )}

              {/* ERROR: Retry */}
              {isError && (
                <ActionButton
                  onClick={handleGenerate}
                  disabled={generating}
                  variant="primary"
                  icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.182-3.182" /></svg>}
                >
                  {generating ? "Regenerando…" : "Reintentar Generación"}
                </ActionButton>
              )}

              {/* APROBADA: Full delivery toolkit */}
              {isAprobada && (
                <>
                  <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-semibold text-green-700">Imagen aprobada</span>
                  </div>

                  <div className="h-px bg-presisso-border" />
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-presisso-gray-mid">
                    Envío al cliente
                  </p>

                  <ActionButton
                    onClick={handleGenerarPdf}
                    disabled={generatingPdf}
                    variant="dark"
                    icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                  >
                    {generatingPdf ? "Generando PDF…" : solicitud.pdf_url ? "Regenerar PDF" : "Generar PDF"}
                  </ActionButton>

                  {solicitud.pdf_url && (
                    <a
                      href={solicitud.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-presisso-border py-2.5 text-xs font-semibold text-presisso-gray-dark transition-colors hover:bg-presisso-surface"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                      Ver PDF generado
                    </a>
                  )}

                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe5d]"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                      Enviar por WhatsApp
                    </a>
                  )}

                  {solicitud.email && (
                    <ActionButton
                      onClick={handleEnviarEmail}
                      disabled={sendingEmail || !solicitud.pdf_url}
                      variant="outline"
                      icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>}
                    >
                      {sendingEmail ? "Enviando…" : "Enviar Email"}
                    </ActionButton>
                  )}

                  <div className="h-px bg-presisso-border" />

                  <ActionButton
                    onClick={handleGenerate}
                    disabled={generating}
                    variant="outline"
                    icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.182-3.182" /></svg>}
                  >
                    {generating ? "Regenerando…" : "Regenerar Imagen"}
                  </ActionButton>
                </>
              )}
            </div>
          </div>

          {/* ── PDF Preview ──────────────────────────────────────────────────── */}
          {solicitud.pdf_url && (
            <div className="overflow-hidden rounded-2xl border border-presisso-border bg-white shadow-card">
              <div className="border-b border-presisso-border bg-presisso-surface px-5 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-presisso-gray-mid">
                  Preview del PDF
                </p>
              </div>
              <iframe
                src={solicitud.pdf_url}
                className="h-[500px] w-full"
                title="Preview del PDF generado"
              />
            </div>
          )}

          {/* ── Notes ────────────────────────────────────────────────────────── */}
          <div className="overflow-hidden rounded-2xl border border-presisso-border bg-white shadow-card">
            <div className="border-b border-presisso-border bg-presisso-surface px-5 py-3">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-presisso-gray-mid">
                Notas Internas
              </h3>
            </div>
            <div className="p-5">
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={3}
                placeholder="Notas sobre esta solicitud…"
                className="w-full resize-none rounded-lg border border-presisso-border px-3 py-2.5 text-sm text-presisso-black placeholder:text-presisso-gray-mid/40 focus:border-presisso-red focus:outline-none focus:ring-1 focus:ring-presisso-red/20"
              />
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="mt-2 w-full rounded-lg border border-presisso-border py-2 text-xs font-semibold text-presisso-gray-dark transition-colors hover:bg-presisso-surface disabled:opacity-50"
              >
                {savingNotes ? "Guardando…" : "Guardar notas"}
              </button>
            </div>
          </div>

          {/* ── Eliminar ─────────────────────────────────────────────────── */}
          <div className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-card">
            <div className="border-b border-red-200 bg-red-50 px-5 py-3">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-red-500">
                Zona de peligro
              </h3>
            </div>
            <div className="p-5">
              <p className="mb-3 text-xs text-presisso-gray-mid">
                Eliminar esta solicitud borrará todos los datos, imágenes generadas y PDF asociados. Esta acción no se puede deshacer.
              </p>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-200 py-3 text-sm font-semibold text-red-600 transition-all hover:border-red-500 hover:bg-red-50 disabled:opacity-50 disabled:pointer-events-none"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                {deleting ? "Eliminando…" : "Eliminar solicitud"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Reusable components ────────────────────────────────────────────────────── */

function ActionButton({
  onClick,
  disabled,
  variant,
  icon,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  variant: "primary" | "success" | "dark" | "outline";
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const styles = {
    primary:
      "bg-presisso-red text-white hover:bg-presisso-red-hover shadow-sm hover:shadow-red-glow",
    success:
      "bg-green-600 text-white hover:bg-green-700 shadow-sm",
    dark:
      "bg-presisso-black text-white hover:bg-presisso-gray-dark shadow-sm",
    outline:
      "border-2 border-presisso-border text-presisso-black hover:border-presisso-red hover:text-presisso-red",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none ${styles[variant]}`}
    >
      {icon}
      {children}
    </button>
  );
}

function DataCell({
  label,
  value,
  mono,
  capitalize,
  badge,
}: {
  label: string;
  value?: string;
  mono?: boolean;
  capitalize?: boolean;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between bg-white px-5 py-3">
      <span className="text-xs text-presisso-gray-mid">{label}</span>
      {badge ?? (
        <span
          className={`text-sm font-medium text-presisso-black ${mono ? "font-mono text-xs" : ""} ${capitalize ? "capitalize" : ""}`}
        >
          {value}
        </span>
      )}
    </div>
  );
}
