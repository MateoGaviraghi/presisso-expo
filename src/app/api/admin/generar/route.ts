import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin-guard";
import { solicitudIdBody, parseBody } from "@/lib/validations/api";
import { logAction } from "@/lib/audit";

export const maxDuration = 60;

// POST /api/admin/generar — Admin proxy to generar-imagen
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const parsed = parseBody(solicitudIdBody, body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const res = await fetch(`${appUrl}/api/generar-imagen`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-secret": process.env.INTERNAL_API_SECRET ?? "",
    },
    body: JSON.stringify({ solicitud_id: parsed.data.solicitud_id }),
    signal: AbortSignal.timeout(280_000),
  });

  const data = await res
    .json()
    .catch(() => ({ error: "Error parsing response" }));

  if (res.ok) {
    logAction(parsed.data.solicitud_id, "generar_imagen", {
      model: data.model,
      time_ms: data.time_ms,
    });
  }

  return NextResponse.json(data, { status: res.status });
}
