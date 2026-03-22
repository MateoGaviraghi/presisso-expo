import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/admin-guard";
import { logAction } from "@/lib/audit";

const STUCK_THRESHOLD_MINUTES = 10;

/**
 * POST /api/admin/recovery
 * Recovers solicitudes stuck in "generando" state for more than 10 minutes.
 * Marks them as "error" with a descriptive admin note.
 */
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const cutoff = new Date(
    Date.now() - STUCK_THRESHOLD_MINUTES * 60 * 1000,
  ).toISOString();

  const { data: stuck, error: fetchError } = await supabaseAdmin
    .from("solicitudes")
    .select("id, nombre, created_at")
    .eq("estado", "generando")
    .lt("updated_at", cutoff);

  if (fetchError) {
    console.error("Recovery fetch error:", fetchError);
    return NextResponse.json(
      { error: "Error consultando solicitudes" },
      { status: 500 },
    );
  }

  if (!stuck || stuck.length === 0) {
    return NextResponse.json({ recovered: 0, message: "No hay solicitudes stuck" });
  }

  const ids = stuck.map((s) => s.id);

  const { error: updateError } = await supabaseAdmin
    .from("solicitudes")
    .update({
      estado: "error",
      notas_admin: `Recovery automático: stuck en "generando" por más de ${STUCK_THRESHOLD_MINUTES} minutos`,
    })
    .in("id", ids);

  if (updateError) {
    console.error("Recovery update error:", updateError);
    return NextResponse.json(
      { error: "Error actualizando solicitudes" },
      { status: 500 },
    );
  }

  for (const id of ids) {
    logAction(id, "recovery", { threshold_minutes: STUCK_THRESHOLD_MINUTES });
  }

  return NextResponse.json({
    recovered: ids.length,
    ids,
    message: `${ids.length} solicitud(es) recuperada(s) del estado "generando"`,
  });
}
