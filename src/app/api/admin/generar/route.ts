import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300;

// Proxy server-side para que el admin pueda regenerar sin exponer el INTERNAL_API_SECRET
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const solicitud_id = body?.solicitud_id;

  if (!solicitud_id) {
    return NextResponse.json({ error: "solicitud_id requerido" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const res = await fetch(`${appUrl}/api/generar-imagen`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-secret": process.env.INTERNAL_API_SECRET ?? "",
    },
    body: JSON.stringify({ solicitud_id }),
    signal: AbortSignal.timeout(280_000),
  });

  const data = await res.json().catch(() => ({ error: "Error parsing response" }));
  return NextResponse.json(data, { status: res.status });
}
