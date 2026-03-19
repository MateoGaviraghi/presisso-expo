"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ESTADO_LABELS, ESTADOS_SOLICITUD } from "@/lib/utils/constants";
import type { Solicitud, EstadoSolicitud } from "@/types/solicitud";

export default function AdminSolicitudPage() {
  const { id } = useParams<{ id: string }>();
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "error" } | null>(null);
  const [notas, setNotas] = useState("");
  const [nuevoEstado, setNuevoEstado] = useState<EstadoSolicitud>("pendiente");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

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

  // Keyboard navigation
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
      showToast(err instanceof Error ? err.message : "Error inesperado", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleGenerate() {
    if (!solicitud?.foto_original) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/generar-imagen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solicitud_id: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error en generación");
      // Recargar la solicitud para ver la imagen
      const updated = await fetch(`/api/solicitudes/${id}`);
      if (updated.ok) {
        const sol: Solicitud = await updated.json();
        setSolicitud(sol);
        setNuevoEstado(sol.estado);
      }
      showToast(`Imagen generada con ${data.model} en ${Math.round(data.time_ms / 1000)}s`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error al generar", "error");
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-presisso-red border-t-transparent" />
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
      {/* Toast de feedback */}
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

      {/* Lightbox fullscreen con navegación */}
      {lightboxIdx !== null && lightboxImages[lightboxIdx] && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4"
          onClick={() => setLightboxIdx(null)}
        >
          {/* Label */}
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/70">
            {lightboxImages[lightboxIdx].label}
            <span className="ml-2 text-white/40">
              ({lightboxIdx + 1}/{lightboxImages.length})
            </span>
          </p>

          {/* Imagen */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxImages[lightboxIdx].src}
            alt={lightboxImages[lightboxIdx].label}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Flechas de navegación */}
          {lightboxImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox(-1);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-2xl font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox(1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-2xl font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              >
                ›
              </button>
            </>
          )}

          {/* Cerrar */}
          <button
            onClick={() => setLightboxIdx(null)}
            className="absolute right-4 top-4 rounded-full bg-white/15 px-3 py-1 text-lg font-bold text-white backdrop-blur-sm hover:bg-white/30"
          >
            ✕
          </button>

          {/* Hint */}
          {lightboxImages.length > 1 && (
            <p className="mt-3 text-xs text-white/40">
              ← → para navegar · Esc para cerrar
            </p>
          )}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Link
          href="/admin"
          className="text-sm text-presisso-gray-mid hover:text-presisso-black"
        >
          ← Dashboard
        </Link>
        <h2 className="font-heading text-2xl font-bold text-presisso-black">
          {solicitud.nombre}
        </h2>
        <span className="rounded-full bg-presisso-gray-light px-3 py-1 text-xs font-medium capitalize text-presisso-gray-dark">
          {solicitud.tipo_cocina}
        </span>
      </div>

      {/* ── ANTES Y DESPUÉS (full width) ── */}
      {solicitud.foto_original && solicitud.imagen_generada && (
        <div className="rounded-2xl border border-presisso-border bg-white p-6 space-y-4">
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
              {solicitud.intentos_generacion && (
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

      {/* ── Si solo hay foto original (sin generada) ── */}
      {solicitud.foto_original && !solicitud.imagen_generada && (
        <div className="rounded-2xl border border-presisso-border bg-white p-6 space-y-3">
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
        <div className="rounded-2xl border border-presisso-border bg-white p-6 space-y-4">
          <h3 className="font-semibold text-presisso-black">
            Datos del cliente
          </h3>
          <Row label="WhatsApp" value={solicitud.whatsapp} />
          <Row label="Email" value={solicitud.email ?? "—"} />
          <Row label="Estilo" value={solicitud.tipo_cocina} />
          <Row label="PDF" value={solicitud.enviar_pdf ? "Sí" : "No"} />
          <Row
            label="Fecha"
            value={new Date(solicitud.created_at).toLocaleString("es-AR")}
          />
          <Row
            label="Estado"
            value={ESTADO_LABELS[solicitud.estado] ?? solicitud.estado}
          />
        </div>

        {/* Acciones admin */}
        <div className="rounded-2xl border border-presisso-border bg-white p-6 space-y-4">
          <h3 className="font-semibold text-presisso-black">Acciones</h3>

          <div>
            <label className="mb-1 block text-sm font-medium text-presisso-gray-dark">
              Estado
            </label>
            <select
              value={nuevoEstado}
              onChange={(e) =>
                setNuevoEstado(e.target.value as EstadoSolicitud)
              }
              className="w-full rounded-xl border border-presisso-border px-3 py-2 text-sm text-presisso-black focus:border-presisso-red focus:outline-none"
            >
              {ESTADOS_SOLICITUD.map((e) => (
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
              placeholder="Notas internas sobre esta solicitud..."
              className="w-full rounded-xl border border-presisso-border px-3 py-2 text-sm text-presisso-black placeholder:text-presisso-gray-mid/50 focus:border-presisso-red focus:outline-none"
            />
          </div>

          <button
            onClick={handleUpdate}
            disabled={saving}
            className="w-full rounded-xl bg-presisso-red py-3 font-semibold text-white transition-colors hover:bg-presisso-red-hover disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-presisso-gray-mid">{label}</span>
      <span className="text-sm font-medium text-presisso-black">{value}</span>
    </div>
  );
}
