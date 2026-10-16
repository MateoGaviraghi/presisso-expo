import { NextRequest, NextResponse } from "next/server";
import { generateAdminToken } from "@/lib/auth/admin-guard";
import { safeEqual } from "@/lib/security";

// Demora fija ante una contraseña incorrecta: frena la prueba masiva de contraseñas
const FAIL_DELAY_MS = 800;

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({}));

  if (!password) {
    return NextResponse.json(
      { error: "Contraseña requerida" },
      { status: 400 },
    );
  }

  const correctPass = process.env.ADMIN_PASSWORD;
  if (!correctPass) {
    console.error("ADMIN_PASSWORD no configurada");
    return NextResponse.json(
      { error: "Error de configuración" },
      { status: 500 },
    );
  }

  if (typeof password !== "string" || !safeEqual(password, correctPass)) {
    await new Promise((r) => setTimeout(r, FAIL_DELAY_MS));
    return NextResponse.json(
      { error: "Contraseña incorrecta" },
      { status: 401 },
    );
  }

  const token = generateAdminToken();
  return NextResponse.json({ ok: true, token });
}
