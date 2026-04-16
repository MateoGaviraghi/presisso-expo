import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/admin-guard";
import { uuidParam, patchSolicitud, parseBody } from "@/lib/validations/api";
import { logAction } from "@/lib/audit";

// GET /api/solicitudes/:id — Admin only
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const idResult = uuidParam.safeParse(params.id);
  if (!idResult.success) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("solicitudes")
    .select("*")
    .eq("id", idResult.data)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Solicitud no encontrada" },
      { status: 404 },
    );
  }

  return NextResponse.json(data);
}

// PATCH /api/solicitudes/:id — Admin only, Zod-validated
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const idResult = uuidParam.safeParse(params.id);
  if (!idResult.success) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const parsed = parseBody(patchSolicitud, body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    if (Object.keys(parsed.data).length === 0) {
      return NextResponse.json(
        { error: "No hay campos válidos para actualizar" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("solicitudes")
      .update(parsed.data)
      .eq("id", idResult.data)
      .select()
      .single();

    if (error) {
      console.error("PATCH /api/solicitudes/:id error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { error: "Solicitud no encontrada" },
        { status: 404 },
      );
    }

    // Audit: log significant state changes
    if (parsed.data.estado) {
      const action = parsed.data.estado === "aprobada" ? "aprobar" as const : "guardar_notas" as const;
      logAction(idResult.data, action, { estado: parsed.data.estado });
    } else if (parsed.data.notas_admin !== undefined) {
      logAction(idResult.data, "guardar_notas", { notas: parsed.data.notas_admin });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("PATCH /api/solicitudes/:id unexpected error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// DELETE /api/solicitudes/:id — Admin only
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const idResult = uuidParam.safeParse(params.id);
  if (!idResult.success) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  // Obtener solicitud para limpiar archivos de Storage
  const { data: solicitud } = await supabaseAdmin
    .from("solicitudes")
    .select("foto_original, imagen_generada, pdf_url")
    .eq("id", idResult.data)
    .single();

  // Eliminar archivos de Storage (best-effort)
  if (solicitud) {
    const filesToDelete: string[] = [];
    const bucketUrl = supabaseAdmin.storage.from("cocinas").getPublicUrl("").data.publicUrl;

    for (const url of [solicitud.foto_original, solicitud.imagen_generada, solicitud.pdf_url]) {
      if (url && url.startsWith(bucketUrl)) {
        filesToDelete.push(url.replace(bucketUrl, ""));
      }
    }

    if (filesToDelete.length > 0) {
      await supabaseAdmin.storage.from("cocinas").remove(filesToDelete).catch(() => {});
    }
  }

  // Eliminar de la base de datos
  const { error } = await supabaseAdmin
    .from("solicitudes")
    .delete()
    .eq("id", idResult.data);

  if (error) {
    console.error("DELETE /api/solicitudes/:id error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  logAction(idResult.data, "eliminar", { accion: "solicitud eliminada" });
  return NextResponse.json({ success: true });
}
