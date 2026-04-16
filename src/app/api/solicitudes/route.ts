import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/admin-guard";
import { clientFormSchema } from "@/lib/utils/validators";
import { z } from "zod";

export const dynamic = "force-dynamic";

// POST /api/solicitudes — Crear nueva solicitud
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validar payload con Zod
    const createSchema = clientFormSchema.extend({
      foto_original: z.string().url("URL de foto inválida"),
    });
    const validated = createSchema.parse(body);

    // Insertar en Supabase
    const { data, error } = await supabaseAdmin
      .from("solicitudes")
      .insert({
        nombre: validated.nombre,
        whatsapp: validated.whatsapp,
        email: validated.email || null,
        tipo_cocina: validated.tipo_cocina,
        modo: validated.modo,
        enviar_pdf: validated.enviar_pdf,
        foto_original: validated.foto_original,
        estado: "generando",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Error al crear solicitud" },
        { status: 500 },
      );
    }

    // Disparar generación de imagen automáticamente.
    // waitUntil() mantiene la función viva en Vercel hasta que el fetch termine,
    // sin bloquear la respuesta 201 al cliente.
    const origin = req.headers.get("x-forwarded-proto") && req.headers.get("host")
      ? `${req.headers.get("x-forwarded-proto")}://${req.headers.get("host")}`
      : new URL(req.url).origin;

    waitUntil(
      fetch(`${origin}/api/generar-imagen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-secret": process.env.INTERNAL_API_SECRET ?? "",
        },
        body: JSON.stringify({ solicitud_id: data.id }),
      }).catch((err) => console.error("Error disparando generar-imagen:", err)),
    );

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: err.issues },
        { status: 400 },
      );
    }
    console.error("POST /api/solicitudes error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// GET /api/solicitudes — Listar solicitudes (admin only)
export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const { searchParams } = new URL(req.url);
  const estado = searchParams.get("estado");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
  const offset = Math.max(parseInt(searchParams.get("offset") || "0"), 0);

  let query = supabaseAdmin
    .from("solicitudes")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (estado) {
    query = query.eq("estado", estado);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("GET /api/solicitudes error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count, limit, offset });
}
