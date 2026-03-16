"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Solicitud } from "@/types/solicitud";

export function useSupabaseRealtime() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // Fetch initial data
    const fetchSolicitudes = async () => {
      const { data } = await supabase
        .from("solicitudes")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setSolicitudes(data as Solicitud[]);
    };

    fetchSolicitudes();

    // Subscribe to realtime changes
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
                s.id === (payload.new as Solicitud).id
                  ? (payload.new as Solicitud)
                  : s,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setSolicitudes((prev) =>
              prev.filter((s) => s.id !== (payload.old as { id: string }).id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return solicitudes;
}
