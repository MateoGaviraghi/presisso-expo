"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ESTADO_LABELS, getMaterialLabel } from "@/lib/utils/constants";
import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime";
import { EstadoBadge } from "@/components/admin/EstadoBadge";
import type { EstadoSolicitud } from "@/types/solicitud";

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

export default function AdminPage() {
  const router = useRouter();
  const { solicitudes, loaded } = useSupabaseRealtime();
  const [activeFilter, setActiveFilter] = useState<EstadoSolicitud | "all">("all");

  const stats = useMemo(() => {
    if (!loaded) return null;
    const today = new Date().toISOString().split("T")[0];
    const estados: Record<string, number> = {};
    let hoy = 0;
    for (const s of solicitudes) {
      estados[s.estado] = (estados[s.estado] ?? 0) + 1;
      if (s.created_at.startsWith(today)) hoy++;
    }
    return {
      total: solicitudes.length,
      hoy,
      generando: estados["generando"] ?? 0,
      revision: estados["revision"] ?? 0,
      aprobadas: estados["aprobada"] ?? 0,
      enviadas: estados["enviada"] ?? 0,
      errores: estados["error"] ?? 0,
    };
  }, [solicitudes, loaded]);

  const filtered = useMemo(
    () =>
      activeFilter === "all"
        ? solicitudes
        : solicitudes.filter((s) => s.estado === activeFilter),
    [solicitudes, activeFilter],
  );

  const countByState = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of solicitudes) map[s.estado] = (map[s.estado] ?? 0) + 1;
    return map;
  }, [solicitudes]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-presisso-black sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-presisso-gray-mid">
          {loaded
            ? `${solicitudes.length} solicitudes · actualización en tiempo real`
            : "Cargando solicitudes…"}
        </p>
      </div>

      {/* ── Stats Grid ──────────────────────────────────────────────────────── */}
      {!loaded ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-presisso-border" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            value={stats.total}
            label="Total"
            sub={`${stats.hoy} hoy`}
            accent="default"
          />
          <StatCard
            value={stats.generando}
            label="Generando"
            accent={stats.generando > 0 ? "blue" : "default"}
            pulse={stats.generando > 0}
          />
          <StatCard
            value={stats.revision}
            label="En Revisión"
            accent={stats.revision > 0 ? "violet" : "default"}
          />
          <StatCard
            value={stats.errores}
            label="Errores"
            accent={stats.errores > 0 ? "red" : "default"}
          />
        </div>
      ) : null}

      {/* ── Filter Tabs ─────────────────────────────────────────────────────── */}
      <div className="border-b border-presisso-border">
        <nav className="-mb-px flex gap-1 overflow-x-auto" aria-label="Filtros">
          {FILTERS.map(({ key, label }) => {
            const count = key === "all" ? solicitudes.length : (countByState[key] ?? 0);
            const active = activeFilter === key;
            return (
              <button
                type="button"
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors sm:px-5 ${
                  active
                    ? "border-presisso-red text-presisso-black"
                    : "border-transparent text-presisso-gray-mid hover:text-presisso-gray-dark"
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

      {/* ── Table / List ────────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-presisso-border bg-white shadow-card">
        {!loaded ? (
          <div className="divide-y divide-presisso-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="h-3.5 w-32 animate-pulse rounded bg-presisso-border" />
                <div className="h-3.5 w-20 animate-pulse rounded bg-presisso-border" />
                <div className="ml-auto h-5 w-20 animate-pulse rounded-full bg-presisso-border" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-presisso-gray-mid">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-presisso-gray-light">
              <svg className="h-6 w-6 text-presisso-gray-mid/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <p className="text-sm font-medium">
              {activeFilter === "all"
                ? "No hay solicitudes aún"
                : `Sin solicitudes en "${ESTADO_LABELS[activeFilter] ?? activeFilter}"`}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden w-full text-sm sm:table">
              <thead>
                <tr className="border-b border-presisso-border bg-presisso-surface">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-presisso-gray-mid">
                    Nombre
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-presisso-gray-mid">
                    WhatsApp
                  </th>
                  <th className="hidden px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-presisso-gray-mid md:table-cell">
                    Email
                  </th>
                  <th className="hidden px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-presisso-gray-mid lg:table-cell">
                    Estilo
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-presisso-gray-mid">
                    Estado
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-presisso-gray-mid">
                    Fecha
                  </th>
                  <th className="w-10 px-3 py-3">
                    <span className="sr-only">Ver</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-presisso-border">
                {filtered.map((s) => (
                  <tr
                    key={s.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => router.push(`/admin/${s.id}`)}
                    onKeyDown={(e) => e.key === "Enter" && router.push(`/admin/${s.id}`)}
                    className="group cursor-pointer transition-colors hover:bg-presisso-surface/80 focus:bg-presisso-surface focus:outline-none"
                  >
                    <td className="px-5 py-3.5 font-medium text-presisso-black">
                      {s.nombre}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-presisso-gray-mid">
                      {s.whatsapp}
                    </td>
                    <td className="hidden px-5 py-3.5 md:table-cell">
                      {s.email ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          Sí
                        </span>
                      ) : (
                        <span className="text-presisso-gray-mid/30">—</span>
                      )}
                    </td>
                    <td className="hidden px-5 py-3.5 text-xs text-presisso-gray-mid lg:table-cell">
                      {getMaterialLabel(s.tipo_cocina)}
                    </td>
                    <td className="px-5 py-3.5">
                      <EstadoBadge estado={s.estado} />
                    </td>
                    <td className="px-5 py-3.5 text-xs text-presisso-gray-mid">
                      {timeAgo(s.created_at)}
                    </td>
                    <td className="px-3 py-3.5">
                      <svg
                        className="h-4 w-4 text-presisso-gray-mid/30 transition-all group-hover:translate-x-0.5 group-hover:text-presisso-red"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile list */}
            <div className="divide-y divide-presisso-border sm:hidden">
              {filtered.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => router.push(`/admin/${s.id}`)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-presisso-surface"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-presisso-black">
                      {s.nombre}
                    </p>
                    <p className="mt-0.5 text-[11px] text-presisso-gray-mid">
                      {getMaterialLabel(s.tipo_cocina)} · {timeAgo(s.created_at)}
                    </p>
                  </div>
                  <EstadoBadge estado={s.estado} />
                  <svg className="h-4 w-4 flex-shrink-0 text-presisso-gray-mid/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Row count */}
      {loaded && filtered.length > 0 && (
        <p className="text-right text-[11px] text-presisso-gray-mid">
          {filtered.length} solicitud{filtered.length !== 1 ? "es" : ""}
          {activeFilter !== "all" && ` · ${ESTADO_LABELS[activeFilter] ?? activeFilter}`}
        </p>
      )}
    </div>
  );
}

/* ── Stat Card ──────────────────────────────────────────────────────────────── */

function StatCard({
  value,
  label,
  sub,
  accent = "default",
  pulse = false,
}: {
  value: number;
  label: string;
  sub?: string;
  accent?: "default" | "blue" | "violet" | "red";
  pulse?: boolean;
}) {
  const accents = {
    default: {
      border: "border-presisso-border",
      bg: "bg-white",
      value: "text-presisso-black",
      indicator: "",
    },
    blue: {
      border: "border-blue-200",
      bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
      value: "text-blue-700",
      indicator: "bg-blue-500",
    },
    violet: {
      border: "border-violet-200",
      bg: "bg-gradient-to-br from-violet-50 to-purple-50",
      value: "text-violet-700",
      indicator: "bg-violet-500",
    },
    red: {
      border: "border-red-200",
      bg: "bg-gradient-to-br from-red-50 to-orange-50",
      value: "text-red-600",
      indicator: "bg-red-500",
    },
  };

  const a = accents[accent];

  return (
    <div className={`rounded-2xl border p-4 shadow-card sm:p-5 ${a.border} ${a.bg}`}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-presisso-gray-mid">
          {label}
        </p>
        {pulse && (
          <span className={`h-2 w-2 animate-pulse rounded-full ${a.indicator}`} />
        )}
      </div>
      <p className={`mt-2 text-3xl font-bold tracking-tight sm:text-4xl ${a.value}`}>
        {value}
      </p>
      {sub && (
        <p className="mt-0.5 text-[11px] text-presisso-gray-mid">{sub}</p>
      )}
    </div>
  );
}
