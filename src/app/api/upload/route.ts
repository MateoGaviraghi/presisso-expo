import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];
const MAX_RETRIES = 2;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No se recibió archivo" },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido" },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Archivo demasiado grande (máx 10MB)" },
        { status: 400 },
      );
    }

    const ext = file.name.split(".").pop() ?? "jpg";
    const fileName = `originales/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const nodeBuffer = Buffer.from(await file.arrayBuffer());

    let lastError: unknown = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        // Instancia fresca por intento para evitar conexiones stale
        const supabase = createAdminClient();

        const { data, error } = await supabase.storage
          .from("cocinas")
          .upload(fileName, nodeBuffer, {
            contentType: file.type,
            upsert: false,
          });

        if (error) {
          lastError = error;
          console.error(`Storage upload error (intento ${attempt + 1}):`, error);
          if (attempt < MAX_RETRIES) continue;
          return NextResponse.json(
            { error: "Error al subir la foto" },
            { status: 500 },
          );
        }

        const { data: urlData } = supabase.storage
          .from("cocinas")
          .getPublicUrl(data.path);

        return NextResponse.json({ url: urlData.publicUrl }, { status: 201 });
      } catch (err) {
        lastError = err;
        console.error(`Upload attempt ${attempt + 1} failed:`, err);
        if (attempt < MAX_RETRIES) continue;
      }
    }

    console.error("Upload failed after all retries:", lastError);
    return NextResponse.json({ error: "Error al subir la foto" }, { status: 500 });
  } catch (err) {
    console.error("Upload API error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
