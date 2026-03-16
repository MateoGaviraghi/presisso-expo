"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ESTADO_LABELS } from "@/lib/utils/constants";
import type { Solicitud } from "@/types/solicitud";

interface Stats {
  total_solicitudes: number;
  solicitudes_hoy: number;
  pendientes: number;
  generando: number;
  revision: number;
  aprobadas: number;
  enviadas: number;
  errores: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, solRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/solicitudes?limit=20"),
        ]);

        if (!statsRes.ok || !solRes.ok)
          throw new Error("Error al cargar datos");

        const statsData = await statsRes.json();
        const solData = await solRes.json();

        setStats(statsData);
        setSolicitudes(solData.data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error inesperado");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-presisso-red border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="font-heading text-2xl font-bold text-presisso-black">
        Dashboard
      </h2>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total" value={stats.total_solicitudes} />
          <StatCard label="Hoy" value={stats.solicitudes_hoy} highlight />
          <StatCard label="Pendientes" value={stats.pendientes} />
          <StatCard label="Enviadas" value={stats.enviadas} />
        </div>
      )}

      {/* Solicitudes recientes */}
      <div>
        <h3 className="mb-4 font-heading text-lg font-semibold text-presisso-black">
          Solicitudes recientes
        </h3>
        <div className="overflow-hidden rounded-2xl border border-presisso-border bg-white">
          {solicitudes.length === 0 ? (
            <p className="p-8 text-center text-presisso-gray-mid">
              No hay solicitudes aún
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-presisso-border bg-presisso-gray-light/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-presisso-gray-dark">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-presisso-gray-dark">
                    WhatsApp
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-presisso-gray-dark">
                    Estilo
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-presisso-gray-dark">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-presisso-gray-dark">
                    Fecha
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-presisso-border">
                {solicitudes.map((s) => (
                  <tr key={s.id} className="hover:bg-presisso-gray-light/30">
                    <td className="px-4 py-3 font-medium text-presisso-black">
                      {s.nombre}
                    </td>
                    <td className="px-4 py-3 text-presisso-gray-mid">
                      {s.whatsapp}
                    </td>
                    <td className="px-4 py-3 capitalize text-presisso-gray-mid">
                      {s.tipo_cocina}
                    </td>
                    <td className="px-4 py-3">
                      <EstadoBadge estado={s.estado} />
                    </td>
                    <td className="px-4 py-3 text-presisso-gray-mid">
                      {new Date(s.created_at).toLocaleDateString("es-AR")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/${s.id}`}
                        className="font-medium text-presisso-red hover:underline"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight
          ? "border-presisso-red/20 bg-presisso-red-light"
          : "border-presisso-border bg-white"
      }`}
    >
      <p className="text-sm font-medium text-presisso-gray-mid">{label}</p>
      <p
        className={`mt-1 text-3xl font-bold ${
          highlight ? "text-presisso-red" : "text-presisso-black"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function EstadoBadge({ estado }: { estado: string }) {
  const colors: Record<string, string> = {
    pendiente: "bg-yellow-100 text-yellow-700",
    generando: "bg-blue-100 text-blue-700",
    revision: "bg-purple-100 text-purple-700",
    aprobada: "bg-green-100 text-green-700",
    enviada: "bg-emerald-100 text-emerald-700",
    rechazada: "bg-red-100 text-red-700",
    error: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        colors[estado] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {ESTADO_LABELS[estado] ?? estado}
    </span>
  );
}
