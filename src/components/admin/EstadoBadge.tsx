"use client";

import { ESTADO_LABELS } from "@/lib/utils/constants";

const CONFIG: Record<string, { dot: string; badge: string; animate?: true }> = {
  pendiente: {
    dot: "bg-amber-400",
    badge: "bg-amber-50 border-amber-200 text-amber-800",
  },
  generando: {
    dot: "bg-blue-500",
    badge: "bg-blue-50 border-blue-200 text-blue-800",
    animate: true,
  },
  revision: {
    dot: "bg-violet-500",
    badge: "bg-violet-50 border-violet-200 text-violet-800",
  },
  aprobada: {
    dot: "bg-green-500",
    badge: "bg-green-50 border-green-200 text-green-800",
  },
  enviada: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 border-emerald-200 text-emerald-800",
  },
  rechazada: {
    dot: "bg-red-400",
    badge: "bg-red-50 border-red-200 text-red-700",
  },
  error: {
    dot: "bg-gray-400",
    badge: "bg-gray-100 border-gray-200 text-gray-600",
  },
};

const FALLBACK = {
  dot: "bg-gray-400",
  badge: "bg-gray-100 border-gray-200 text-gray-600",
};

export function EstadoBadge({ estado }: { estado: string }) {
  const cfg = CONFIG[estado] ?? FALLBACK;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cfg.badge}`}
    >
      <span
        className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${cfg.dot}${cfg.animate ? " animate-pulse" : ""}`}
      />
      {ESTADO_LABELS[estado] ?? estado}
    </span>
  );
}
