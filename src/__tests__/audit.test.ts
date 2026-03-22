import { describe, it, expect, vi } from "vitest";

// Mock supabaseAdmin before importing audit
vi.mock("@/lib/supabase/admin", () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

import { logAction } from "@/lib/audit";
import { supabaseAdmin } from "@/lib/supabase/admin";

describe("logAction", () => {
  it("inserts an audit record with correct data", async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(supabaseAdmin.from).mockReturnValue({
      insert: mockInsert,
    } as never);

    await logAction("test-id-123", "aprobar", { extra: "data" });

    expect(supabaseAdmin.from).toHaveBeenCalledWith("audit_log");
    expect(mockInsert).toHaveBeenCalledWith({
      solicitud_id: "test-id-123",
      accion: "aprobar",
      detalle: { extra: "data" },
    });
  });

  it("does not throw on insert error", async () => {
    vi.mocked(supabaseAdmin.from).mockReturnValue({
      insert: vi.fn().mockRejectedValue(new Error("DB error")),
    } as never);

    // Should not throw
    await expect(logAction("id", "aprobar")).resolves.toBeUndefined();
  });

  it("defaults detalle to empty object when not provided", async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(supabaseAdmin.from).mockReturnValue({
      insert: mockInsert,
    } as never);

    await logAction("id", "generar_pdf");

    expect(mockInsert).toHaveBeenCalledWith({
      solicitud_id: "id",
      accion: "generar_pdf",
      detalle: {},
    });
  });
});
