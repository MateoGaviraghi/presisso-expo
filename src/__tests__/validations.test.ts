import { describe, it, expect } from "vitest";
import {
  solicitudIdBody,
  uuidParam,
  patchSolicitud,
  parseBody,
} from "@/lib/validations/api";
import { clientFormSchema } from "@/lib/utils/validators";

describe("solicitudIdBody", () => {
  it("accepts a valid UUID", () => {
    const result = solicitudIdBody.safeParse({
      solicitud_id: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-UUID string", () => {
    const result = solicitudIdBody.safeParse({ solicitud_id: "not-a-uuid" });
    expect(result.success).toBe(false);
  });

  it("rejects missing solicitud_id", () => {
    const result = solicitudIdBody.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects null", () => {
    const result = solicitudIdBody.safeParse(null);
    expect(result.success).toBe(false);
  });
});

describe("uuidParam", () => {
  it("accepts valid UUID", () => {
    const result = uuidParam.safeParse(
      "550e8400-e29b-41d4-a716-446655440000",
    );
    expect(result.success).toBe(true);
  });

  it("rejects garbage", () => {
    const result = uuidParam.safeParse("abc123");
    expect(result.success).toBe(false);
  });
});

describe("patchSolicitud", () => {
  it("accepts valid estado", () => {
    const result = patchSolicitud.safeParse({ estado: "aprobada" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid estado", () => {
    const result = patchSolicitud.safeParse({ estado: "pendiente" });
    expect(result.success).toBe(false);
  });

  it("accepts notas_admin", () => {
    const result = patchSolicitud.safeParse({
      notas_admin: "Nota de prueba",
    });
    expect(result.success).toBe(true);
  });

  it("rejects notas_admin > 2000 chars", () => {
    const result = patchSolicitud.safeParse({
      notas_admin: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown fields (strict mode)", () => {
    const result = patchSolicitud.safeParse({ hackerField: "malicious" });
    expect(result.success).toBe(false);
  });

  it("accepts null for nullable fields", () => {
    const result = patchSolicitud.safeParse({ notas_admin: null });
    expect(result.success).toBe(true);
  });
});

describe("parseBody helper", () => {
  it("returns success with valid data", () => {
    const result = parseBody(solicitudIdBody, {
      solicitud_id: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.solicitud_id).toBe(
        "550e8400-e29b-41d4-a716-446655440000",
      );
    }
  });

  it("returns error string with invalid data", () => {
    const result = parseBody(solicitudIdBody, { solicitud_id: "bad" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("UUID");
    }
  });
});

describe("clientFormSchema", () => {
  it("accepts valid form data", () => {
    const result = clientFormSchema.safeParse({
      nombre: "Juan Pérez",
      email: "juan@test.com",
      tipo_cocina: "moderna",
      enviar_pdf: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects short nombre", () => {
    const result = clientFormSchema.safeParse({
      nombre: "J",
      email: "juan@test.com",
      tipo_cocina: "moderna",
      enviar_pdf: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = clientFormSchema.safeParse({
      nombre: "Juan",
      email: "not-email",
      tipo_cocina: "moderna",
      enviar_pdf: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid tipo_cocina", () => {
    const result = clientFormSchema.safeParse({
      nombre: "Juan",
      email: "juan@test.com",
      tipo_cocina: "luxury",
      enviar_pdf: true,
    });
    expect(result.success).toBe(false);
  });
});
