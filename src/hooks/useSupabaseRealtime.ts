"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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

  const fetchData = useCallback(async () => {
    try {
      // Fetch via API route — uses service role, bypasses RLS
      const res = await fetch("/api/solicitudes?limit=100");
      if (!res.ok) throw new Error("fetch failed");
      const { data } = await res.json();
      if (data) setSolicitudes(data as Solicitud[]);
    } catch (err) {
      console.error("Error fetching solicitudes:", err);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (subscribedRef.current) return;
    subscribedRef.current = true;

    // Initial fetch via API
    fetchData();

    // Subscribe to realtime changes for live updates
    const supabase = getClient();
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
  }, [fetchData]);

  return { solicitudes, loaded, refetch: fetchData };
}
