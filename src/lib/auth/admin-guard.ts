import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const HMAC_PREFIX = "admin-session";

/**
 * Generates a daily admin session token.
 * Token = HMAC-SHA256(ADMIN_PASSWORD, "admin-session:<YYYY-MM-DD>")
 * Valid for the current day + previous day (midnight rollover).
 */
export function generateAdminToken(): string | null {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return null;

  const day = new Date().toISOString().slice(0, 10);
  return createHmac("sha256", secret)
    .update(`${HMAC_PREFIX}:${day}`)
    .digest("hex");
}

export function verifyAdminToken(token: string): boolean {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret || !token) return false;

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000)
    .toISOString()
    .slice(0, 10);

  const validToday = createHmac("sha256", secret)
    .update(`${HMAC_PREFIX}:${today}`)
    .digest("hex");

  const validYesterday = createHmac("sha256", secret)
    .update(`${HMAC_PREFIX}:${yesterday}`)
    .digest("hex");

  try {
    const tokenBuf = Buffer.from(token, "utf-8");
    const todayBuf = Buffer.from(validToday, "utf-8");
    const yesterdayBuf = Buffer.from(validYesterday, "utf-8");

    return (
      (tokenBuf.length === todayBuf.length &&
        timingSafeEqual(tokenBuf, todayBuf)) ||
      (tokenBuf.length === yesterdayBuf.length &&
        timingSafeEqual(tokenBuf, yesterdayBuf))
    );
  } catch {
    return false;
  }
}

/**
 * Middleware guard for admin API routes.
 * Returns null if authorized, or a 401 Response if not.
 *
 * Usage:
 *   const denied = requireAdmin(req);
 *   if (denied) return denied;
 */
export function requireAdmin(req: NextRequest): NextResponse | null {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const token = header.slice(7);
  if (!verifyAdminToken(token)) {
    return NextResponse.json(
      { error: "Token inválido o expirado" },
      { status: 401 },
    );
  }

  return null;
}
