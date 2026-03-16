"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ESTADO_LABELS, ESTADOS_SOLICITUD } from "@/lib/utils/constants";
import type { Solicitud, EstadoSolicitud } from "@/types/solicitud";

export default function AdminSolicitudPage() {
  const { id } = useParams<{ id: string }>();
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notas, setNotas] = useState("");
  const [nuevoEstado, setNuevoEstado] = useState<EstadoSolicitud>("pendiente");

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
      alert("Guardado correctamente");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSaving(false);
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
      </div>

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
        </div>

        {/* Foto original */}
        <div className="rounded-2xl border border-presisso-border bg-white p-6 space-y-3">
          <h3 className="font-semibold text-presisso-black">Foto original</h3>
          {solicitud.foto_original ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={solicitud.foto_original}
              alt="Cocina original"
              className="w-full rounded-xl object-contain max-h-64"
            />
          ) : (
            <p className="text-presisso-gray-mid">Sin foto</p>
          )}
        </div>

        {/* Imagen generada */}
        {solicitud.imagen_generada && (
          <div className="rounded-2xl border border-presisso-border bg-white p-6 space-y-3">
            <h3 className="font-semibold text-presisso-black">
              Imagen generada
            </h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={solicitud.imagen_generada}
              alt="Cocina generada"
              className="w-full rounded-xl object-contain max-h-64"
            />
          </div>
        )}

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
