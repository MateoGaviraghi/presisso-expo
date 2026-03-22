"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Solicitud } from "@/types/solicitud";

// Singleton client reference to avoid re-creating on every render
let _client: ReturnType<typeof createClient> | null = null;
function getClient() {
  if (!_client) _client = createClient();
  return _client;
}

export function useSupabaseRealtime() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loaded, setLoaded] = useState(false);
  const subscribedRef = useRef(false);

  useEffect(() => {
    if (subscribedRef.current) return;
    subscribedRef.current = true;

    const supabase = getClient();

    // Fetch initial data
    supabase
      .from("solicitudes")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setSolicitudes(data as Solicitud[]);
        setLoaded(true);
      });

    // Subscribe to realtime changes
    const channel = supabase
      .channel("solicitudes-realtime")
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
      subscribedRef.current = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { solicitudes, loaded };
}
