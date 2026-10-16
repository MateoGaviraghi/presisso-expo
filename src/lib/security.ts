import { createHash, timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Compara dos secretos en tiempo constante.
 * Se comparan los SHA-256 de cada uno: siempre miden lo mismo, así que
 * timingSafeEqual nunca falla por largo y no se filtra el largo del secreto.
 */
export function safeEqual(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return false;
  const ha = createHash("sha256").update(a, "utf8").digest();
  const hb = createHash("sha256").update(b, "utf8").digest();
  return timingSafeEqual(ha, hb);
}

/**
 * true solo si la URL apunta a una foto subida por /api/upload a nuestro bucket.
 * Evita que el servidor descargue URLs arbitrarias (SSRF).
 */
export function isOwnOriginalPhotoUrl(raw: string): boolean {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return false;
  try {
    const url = new URL(raw);
    const own = new URL(base);
    return (
      url.protocol === "https:" &&
      url.origin === own.origin &&
      url.pathname.startsWith("/storage/v1/object/public/cocinas/originales/") &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

/** Tope de solicitudes en 24 h: freno de costo de Gemini y de storage. */
const DEFAULT_MAX_SOLICITUDES_24H = 150;

export function maxSolicitudes24h(): number {
  const fromEnv = Number(process.env.MAX_SOLICITUDES_24H);
  return Number.isFinite(fromEnv) && fromEnv > 0 ? fromEnv : DEFAULT_MAX_SOLICITUDES_24H;
}

export const DAILY_CAP_MESSAGE =
  "Alcanzamos el máximo de diseños por hoy. Acercate al stand de Presisso y te ayudamos.";

/**
 * true si en las últimas 24 h ya se crearon `maxSolicitudes24h()` solicitudes.
 * Si la consulta falla, no bloquea (devuelve false) para no cortar el flujo del stand.
 */
export async function dailyCapReached(): Promise<boolean> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count, error } = await supabaseAdmin
    .from("solicitudes")
    .select("id", { count: "exact", head: true })
    .gte("created_at", since);
  if (error) {
    console.error("[security] No se pudo contar solicitudes de 24 h:", error);
    return false;
  }
  return (count ?? 0) >= maxSolicitudes24h();
}
