import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/admin", () => ({ supabaseAdmin: {} }));

const BASE = "https://abcdefgh.supabase.co";

describe("safeEqual", () => {
  it("returns true for equal strings", async () => {
    const { safeEqual } = await import("@/lib/security");
    expect(safeEqual("secreto-123", "secreto-123")).toBe(true);
  });

  it("returns false for different strings, including different lengths", async () => {
    const { safeEqual } = await import("@/lib/security");
    expect(safeEqual("secreto-123", "secreto-124")).toBe(false);
    expect(safeEqual("corto", "mucho-mas-largo")).toBe(false);
  });

  it("returns false when either side is empty or missing", async () => {
    const { safeEqual } = await import("@/lib/security");
    expect(safeEqual("", "")).toBe(false);
    expect(safeEqual(null, "x")).toBe(false);
    expect(safeEqual("x", undefined)).toBe(false);
  });
});

describe("isOwnOriginalPhotoUrl", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = BASE;
  });

  it("accepts a photo uploaded to our bucket", async () => {
    const { isOwnOriginalPhotoUrl } = await import("@/lib/security");
    expect(isOwnOriginalPhotoUrl(`${BASE}/storage/v1/object/public/cocinas/originales/123-abc.jpg`)).toBe(true);
  });

  it("rejects other hosts, other folders and tricks", async () => {
    const { isOwnOriginalPhotoUrl } = await import("@/lib/security");
    const bad = [
      "https://evil.example.com/storage/v1/object/public/cocinas/originales/x.jpg",
      `${BASE}/storage/v1/object/public/cocinas/generadas/x.png`,
      `${BASE}/rest/v1/solicitudes`,
      `http://abcdefgh.supabase.co/storage/v1/object/public/cocinas/originales/x.jpg`,
      `https://user:pass@abcdefgh.supabase.co/storage/v1/object/public/cocinas/originales/x.jpg`,
      `${BASE}/storage/v1/object/public/cocinas/originales/../../../rest/v1/x`,
      "http://169.254.169.254/latest/meta-data/",
      "no es una url",
    ];
    for (const url of bad) expect(isOwnOriginalPhotoUrl(url), url).toBe(false);
  });
});
