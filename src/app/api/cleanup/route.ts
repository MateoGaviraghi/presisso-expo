import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { logAction } from "@/lib/audit";

// POST /api/cleanup — Marca solicitudes stuck en "generando" como "error"
// Llamado por el cron de Vercel (protegido por CRON_SECRET) o manualmente por admin
export async function POST(req: NextRequest) {
  // Vercel Cron inyecta Authorization: Bearer <CRON_SECRET>
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Solicitudes en "generando" con updated_at hace más de 10 minutos
  const cutoff = new Date(Date.now() - 10 * 60 * 1000).toISOString();

  const { data: stuck, error: fetchError } = await supabaseAdmin
    .from("solicitudes")
    .select("id, updated_at, intentos_generacion")
    .eq("estado", "generando")
    .lt("updated_at", cutoff);

  if (fetchError) {
    console.error("[cleanup] Error buscando solicitudes stuck:", fetchError);
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!stuck || stuck.length === 0) {
    return NextResponse.json({ cleaned: 0 });
  }

  const ids = stuck.map((s) => s.id);

  const { error: updateError } = await supabaseAdmin
    .from("solicitudes")
    .update({
      estado: "error",
      notas_admin: "Timeout automático: generación sin respuesta tras 10 minutos",
    })
    .in("id", ids);

  if (updateError) {
    console.error("[cleanup] Error actualizando solicitudes stuck:", updateError);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  for (const s of stuck) {
    logAction(s.id, "cleanup", {
      motivo: "stuck_en_generando",
      updated_at: s.updated_at,
      intentos: s.intentos_generacion,
    });
  }

  console.log(`[cleanup] ${stuck.length} solicitudes marcadas como error`);
  return NextResponse.json({ cleaned: stuck.length, ids });
}
