import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  generateAdminToken,
  verifyAdminToken,
} from "@/lib/auth/admin-guard";

describe("admin-guard", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  describe("generateAdminToken", () => {
    it("returns null when ADMIN_PASSWORD is not set", () => {
      delete process.env.ADMIN_PASSWORD;
      expect(generateAdminToken()).toBeNull();
    });

    it("returns a hex string when ADMIN_PASSWORD is set", () => {
      process.env.ADMIN_PASSWORD = "test-password-123";
      const token = generateAdminToken();
      expect(token).toBeTruthy();
      expect(token).toMatch(/^[a-f0-9]{64}$/);
    });

    it("returns the same token for the same day", () => {
      process.env.ADMIN_PASSWORD = "test-password-123";
      const token1 = generateAdminToken();
      const token2 = generateAdminToken();
      expect(token1).toBe(token2);
    });
  });

  describe("verifyAdminToken", () => {
    it("returns false for empty token", () => {
      process.env.ADMIN_PASSWORD = "test-password-123";
      expect(verifyAdminToken("")).toBe(false);
    });

    it("returns false when ADMIN_PASSWORD is not set", () => {
      delete process.env.ADMIN_PASSWORD;
      expect(verifyAdminToken("some-token")).toBe(false);
    });

    it("returns true for a valid today token", () => {
      process.env.ADMIN_PASSWORD = "test-password-123";
      const token = generateAdminToken()!;
      expect(verifyAdminToken(token)).toBe(true);
    });

    it("returns false for a garbage token", () => {
      process.env.ADMIN_PASSWORD = "test-password-123";
      expect(verifyAdminToken("definitely-not-valid")).toBe(false);
    });
  });
});
