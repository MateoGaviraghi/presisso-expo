"use client";

import { useState } from "react";
import type { Solicitud } from "@/types/solicitud";
import type { CreateSolicitudRequest, ApiResponse } from "@/types/api";

export function useSolicitud() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crear = async (
    data: CreateSolicitudRequest,
  ): Promise<Solicitud | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json: ApiResponse<Solicitud> = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data ?? null;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { crear, loading, error };
}
