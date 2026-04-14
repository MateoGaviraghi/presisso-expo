import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { requireAdmin } from "@/lib/auth/admin-guard";
import { solicitudIdBody, parseBody } from "@/lib/validations/api";
import { logAction } from "@/lib/audit";

// POST /api/admin/generar — Admin triggers image generation (fire-and-forget)
// La respuesta es inmediata. El admin recibe el resultado via Supabase Realtime.
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const parsed = parseBody(solicitudIdBody, body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { solicitud_id } = parsed.data;

  // Construir origin para la llamada interna
  const origin = req.headers.get("x-forwarded-proto") && req.headers.get("host")
    ? `${req.headers.get("x-forwarded-proto")}://${req.headers.get("host")}`
    : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Fire-and-forget: la función sigue viva en Vercel pero el admin recibe 202 de inmediato
  waitUntil(
    fetch(`${origin}/api/generar-imagen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": process.env.INTERNAL_API_SECRET ?? "",
      },
      body: JSON.stringify({ solicitud_id }),
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          logAction(solicitud_id, "generar_imagen", {
            model: data.model,
            time_ms: data.time_ms,
            source: "admin",
          });
        }
      })
      .catch((err) => console.error("[admin/generar] Fire-and-forget error:", err)),
  );

  return NextResponse.json(
    { message: "Generación iniciada. Recibirás el resultado en tiempo real." },
    { status: 202 },
  );
}
