"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { adminFetch } from "@/lib/auth/admin-fetch";
import type { Solicitud } from "@/types/solicitud";

// Singleton client reference to avoid re-creating on every render
let _client: ReturnType<typeof createClient> | null = null;
function getClient() {
  if (!_client) _client = createClient();
  return _client;
}

const POLL_INTERVAL = 5_000; // 5s fallback polling

export function useSupabaseRealtime() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loaded, setLoaded] = useState(false);
  const subscribedRef = useRef(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await adminFetch("/api/solicitudes?limit=100");
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

    // Initial fetch
    console.log("[Dashboard] Fetch inicial...");
    fetchData();

    // Subscribe to realtime changes
    const supabase = getClient();

    const channel = supabase
      .channel("solicitudes-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "solicitudes" },
        (payload) => {
          console.log(`[Realtime] Evento: ${payload.eventType}`, payload.new);
          if (payload.eventType === "INSERT") {
            setSolicitudes((prev) => {
              if (prev.some((s) => s.id === (payload.new as Solicitud).id)) {
                console.log("[Realtime] INSERT duplicado, ignorando");
                return prev;
              }
              console.log("[Realtime] INSERT — nueva solicitud agregada");
              return [payload.new as Solicitud, ...prev];
            });
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as Solicitud;
            console.log(`[Realtime] UPDATE — id: ${updated.id}, estado: ${updated.estado}`);
            setSolicitudes((prev) =>
              prev.map((s) => s.id === updated.id ? updated : s),
            );
          } else if (payload.eventType === "DELETE") {
            console.log("[Realtime] DELETE — removiendo solicitud");
            setSolicitudes((prev) =>
              prev.filter((s) => s.id !== (payload.old as { id: string }).id),
            );
          }
        },
      )
      .subscribe((status, err) => {
        console.log(`[Realtime] Conexión: ${status}`, err ? `Error: ${err.message}` : "");
      });

    // Polling fallback — catches anything realtime might miss
    pollRef.current = setInterval(() => {
      console.log("[Dashboard] Polling fallback...");
      fetchData();
    }, POLL_INTERVAL);

    return () => {
      subscribedRef.current = false;
      supabase.removeChannel(channel);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchData]);

  return { solicitudes, loaded, refetch: fetchData };
}
