"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ESTADO_LABELS } from "@/lib/utils/constants";
import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime";
import { EstadoBadge } from "@/components/admin/EstadoBadge";
import type { EstadoSolicitud } from "@/types/solicitud";

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

const FILTERS: Array<{ key: EstadoSolicitud | "all"; label: string }> = [
  { key: "all", label: "Todos" },
  { key: "generando", label: "Generando" },
  { key: "revision", label: "En Revisión" },
  { key: "aprobada", label: "Aprobada" },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `hace ${days}d`;
  return new Date(dateStr).toLocaleDateString("es-AR");
}

function StatCard({
  label,
  value,
  sub,
  pulse = false,
  highlight = false,
}: {
  label: string;
  value: number;
  sub?: string;
  pulse?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-card ${
        highlight
          ? "border-presisso-red/20 bg-presisso-red-light"
          : "border-presisso-border bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-presisso-gray-mid">
          {label}
        </p>
        {pulse && (
          <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
        )}
      </div>
      <p
        className={`mt-3 text-4xl font-bold tracking-tight ${
          highlight ? "text-presisso-red" : "text-presisso-black"
        }`}
      >
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-presisso-gray-mid">{sub}</p>}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const { solicitudes, loaded: solicitudesLoaded } = useSupabaseRealtime();
  const [activeFilter, setActiveFilter] = useState<EstadoSolicitud | "all">(
    "all",
  );

  // Stats calculados directamente de las solicitudes en tiempo real
  const stats = useMemo<Stats | null>(() => {
    if (!solicitudesLoaded) return null;
    const today = new Date().toISOString().split("T")[0];
    const estados: Record<string, number> = {};
    let hoy = 0;
    for (const s of solicitudes) {
      estados[s.estado] = (estados[s.estado] ?? 0) + 1;
      if (s.created_at.startsWith(today)) hoy++;
    }
    return {
      total_solicitudes: solicitudes.length,
      solicitudes_hoy: hoy,
      pendientes: estados["pendiente"] ?? 0,
      generando: estados["generando"] ?? 0,
      revision: estados["revision"] ?? 0,
      aprobadas: estados["aprobada"] ?? 0,
      enviadas: estados["enviada"] ?? 0,
      errores: estados["error"] ?? 0,
    };
  }, [solicitudes, solicitudesLoaded]);

  const filtered = useMemo(
    () =>
      activeFilter === "all"
        ? solicitudes
        : solicitudes.filter((s) => s.estado === activeFilter),
    [solicitudes, activeFilter],
  );

  const countByState = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of solicitudes) {
      map[s.estado] = (map[s.estado] ?? 0) + 1;
    }
    return map;
  }, [solicitudes]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-bold text-presisso-black">
          Dashboard
        </h2>
        <p className="mt-0.5 text-sm text-presisso-gray-mid">
          {solicitudesLoaded
            ? `${solicitudes.length} solicitudes · tiempo real`
            : "Cargando solicitudes…"}
        </p>
      </div>

      {/* Stats */}
      {!solicitudesLoaded ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[100px] animate-pulse rounded-2xl bg-presisso-border"
            />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label="Total"
            value={stats.total_solicitudes}
            sub={`${stats.solicitudes_hoy} hoy`}
          />
          <StatCard
            label="Generando"
            value={stats.generando}
            pulse={stats.generando > 0}
          />
          <StatCard label="En Revisión" value={stats.revision} />
          <StatCard
            label="Errores"
            value={stats.errores}
            highlight={stats.errores > 0}
          />
        </div>
      ) : null}

      {/* Filter tabs */}
      <div className="border-b border-presisso-border">
        <nav className="-mb-px flex" aria-label="Filtros">
          {FILTERS.map(({ key, label }) => {
            const count =
              key === "all" ? solicitudes.length : (countByState[key] ?? 0);
            const active = activeFilter === key;
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors focus:outline-none ${
                  active
                    ? "border-presisso-red text-presisso-black"
                    : "border-transparent text-presisso-gray-mid hover:border-presisso-border hover:text-presisso-gray-dark"
                }`}
              >
                {label}
                {count > 0 && (
                  <span
                    className={`min-w-[20px] rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold leading-none ${
                      active
                        ? "bg-presisso-red text-white"
                        : "bg-presisso-gray-light text-presisso-gray-mid"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Table */}
      <div>
        <div className="overflow-hidden rounded-2xl border border-presisso-border bg-white shadow-card">
          {!solicitudesLoaded ? (
            <div className="divide-y divide-presisso-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3.5">
                  <div className="h-3.5 w-28 animate-pulse rounded bg-presisso-border" />
                  <div className="h-3.5 w-20 animate-pulse rounded bg-presisso-border" />
                  <div className="ml-auto h-5 w-20 animate-pulse rounded-full bg-presisso-border" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-presisso-gray-mid">
              <svg
                className="h-10 w-10 opacity-25"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
              <p className="text-sm">
                {activeFilter === "all"
                  ? "No hay solicitudes aún"
                  : `Sin solicitudes en "${ESTADO_LABELS[activeFilter] ?? activeFilter}"`}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-presisso-border bg-presisso-surface">
                <tr>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-presisso-gray-mid">
                    Nombre
                  </th>
                  <th className="hidden px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-presisso-gray-mid sm:table-cell">
                    WhatsApp
                  </th>
                  <th className="hidden px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-presisso-gray-mid md:table-cell">
                    Email
                  </th>
                  <th className="hidden px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-presisso-gray-mid lg:table-cell">
                    Estilo
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-presisso-gray-mid">
                    Estado
                  </th>
                  <th className="hidden px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-presisso-gray-mid sm:table-cell">
                    Fecha
                  </th>
                  <th className="w-8 px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-presisso-border">
                {filtered.map((s) => (
                  <tr
                    key={s.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => router.push(`/admin/${s.id}`)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && router.push(`/admin/${s.id}`)
                    }
                    className="group cursor-pointer transition-colors hover:bg-presisso-surface focus:bg-presisso-surface focus:outline-none"
                  >
                    <td className="px-5 py-4 font-medium text-presisso-black">
                      {s.nombre}
                    </td>
                    <td className="hidden px-5 py-4 font-mono text-xs text-presisso-gray-mid sm:table-cell">
                      {s.whatsapp}
                    </td>
                    <td className="hidden px-5 py-4 md:table-cell">
                      {s.email ? (
                        <span
                          title={s.email}
                          className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
                        >
                          <svg
                            className="h-3 w-3 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                            />
                          </svg>
                          Sí
                        </span>
                      ) : (
                        <span className="text-presisso-gray-mid/40">—</span>
                      )}
                    </td>
                    <td className="hidden px-5 py-4 capitalize text-presisso-gray-mid lg:table-cell">
                      {s.tipo_cocina}
                    </td>
                    <td className="px-5 py-4">
                      <EstadoBadge estado={s.estado} />
                    </td>
                    <td className="hidden px-5 py-4 text-presisso-gray-mid sm:table-cell">
                      {timeAgo(s.created_at)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <svg
                        className="ml-auto h-4 w-4 text-presisso-gray-mid/50 transition-transform group-hover:translate-x-0.5 group-hover:text-presisso-gray-dark"
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {solicitudesLoaded && filtered.length > 0 && (
          <p className="mt-2 text-right text-xs text-presisso-gray-mid">
            {filtered.length} solicitud{filtered.length !== 1 ? "es" : ""}
            {activeFilter !== "all" &&
              ` · ${ESTADO_LABELS[activeFilter] ?? activeFilter}`}
          </p>
        )}
      </div>
    </div>
  );
}
