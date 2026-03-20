import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({}));

  if (!password) {
    return NextResponse.json({ error: "Contraseña requerida" }, { status: 400 });
  }

  const correctPass = process.env.ADMIN_PASSWORD;
  if (!correctPass) {
    console.error("ADMIN_PASSWORD no configurada");
    return NextResponse.json({ error: "Error de configuración" }, { status: 500 });
  }

  if (password !== correctPass) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
