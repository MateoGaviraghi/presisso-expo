import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// GET /api/stats — Estadísticas del dashboard admin
export async function GET() {
  try {
    // Intentar con la vista stats_expo (se crea en Supabase junto con el schema)
    const { data: statsView, error: viewError } = await supabaseAdmin
      .from("stats_expo")
      .select("*")
      .single();

    if (!viewError && statsView) {
      return NextResponse.json(statsView);
    }

    // Fallback: calcular stats manualmente si la vista no existe aún
    const [totalResult, estadosResult, hoyResult] = await Promise.all([
      supabaseAdmin
        .from("solicitudes")
        .select("*", { count: "exact", head: true }),
      supabaseAdmin
        .from("solicitudes")
        .select("estado"),
      supabaseAdmin
        .from("solicitudes")
        .select("*", { count: "exact", head: true })
        .gte("created_at", new Date().toISOString().split("T")[0]),
    ]);

    const total = totalResult.count ?? 0;
    const hoy = hoyResult.count ?? 0;

    // Contar por estado
    const estados: Record<string, number> = {};
    if (estadosResult.data) {
      for (const row of estadosResult.data) {
        estados[row.estado] = (estados[row.estado] ?? 0) + 1;
      }
    }

    return NextResponse.json({
      total_solicitudes: total,
      solicitudes_hoy: hoy,
      pendientes: estados["pendiente"] ?? 0,
      generando: estados["generando"] ?? 0,
      revision: estados["revision"] ?? 0,
      aprobadas: estados["aprobada"] ?? 0,
      enviadas: estados["enviada"] ?? 0,
      errores: estados["error"] ?? 0,
      rechazadas: estados["rechazada"] ?? 0,
    });
  } catch (err) {
    console.error("GET /api/stats error:", err);
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 });
  }
}
