"use client";

/**
 * Authenticated fetch wrapper for admin API calls.
 * Reads the admin token from sessionStorage and sends it
 * as a Bearer token in the Authorization header.
 */
export function adminFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("presisso-admin-token")
      : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(url, { ...options, headers, cache: "no-store" });
}
