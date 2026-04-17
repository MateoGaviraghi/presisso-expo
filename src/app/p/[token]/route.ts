import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getMaterialLabel } from "@/lib/utils/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOKEN_REGEX = /^[0-9A-Za-z]{8,16}$/;

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function extractToken(param: string): string | null {
  const lastDash = param.lastIndexOf("-");
  const candidate = lastDash === -1 ? param : param.slice(lastDash + 1);
  return TOKEN_REGEX.test(candidate) ? candidate : null;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } },
) {
  const token = extractToken(params.token);

  if (!token) {
    return new NextResponse("Link inválido", { status: 400 });
  }

  const { data: solicitud, error } = await supabaseAdmin
    .from("solicitudes")
    .select("nombre, tipo_cocina, pdf_url")
    .eq("short_token", token)
    .maybeSingle();

  if (error || !solicitud?.pdf_url) {
    return new NextResponse("PDF no encontrado", { status: 404 });
  }

  const pdfRes = await fetch(solicitud.pdf_url, { cache: "no-store" });
  if (!pdfRes.ok || !pdfRes.body) {
    return new NextResponse("No se pudo recuperar el PDF", { status: 502 });
  }

  const nombreSlug = slugify(solicitud.nombre) || "cliente";
  const materialSlug = slugify(getMaterialLabel(solicitud.tipo_cocina)) || "cocina";
  const filename = `Presisso-${nombreSlug}-${materialSlug}.pdf`;

  return new NextResponse(pdfRes.body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "public, max-age=604800, immutable",
      "X-Robots-Tag": "noindex",
    },
  });
}
