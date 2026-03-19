"use client";

import { useState, useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem("presisso-admin");
    if (saved === "true") setAuthed(true);
    setChecking(false);
  }, []);

  async function handleLogin() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        sessionStorage.setItem("presisso-admin", "true");
        setAuthed(true);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-presisso-gray-light">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-presisso-red border-t-transparent" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-presisso-gray-light px-6">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="font-heading text-xl font-bold text-presisso-black">
            presisso<span className="text-presisso-red">.</span>
          </h1>
          <p className="mt-1 text-sm text-presisso-gray-mid">
            Panel de administración
          </p>

          <div className="mt-8 space-y-3">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleLogin()}
              className={`w-full rounded-xl border px-4 py-3 text-base text-presisso-black outline-none transition-colors focus:border-presisso-red focus:ring-1 focus:ring-presisso-red/50 ${
                error ? "border-red-400 bg-red-50" : "border-presisso-border"
              }`}
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-500">Contraseña incorrecta</p>
            )}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full rounded-xl bg-presisso-red py-3 font-semibold text-white transition-colors hover:bg-presisso-red-hover disabled:opacity-60"
            >
              {loading ? "Verificando..." : "Ingresar"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-presisso-gray-light">
      <header className="border-b border-presisso-border bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="font-heading text-lg font-bold text-presisso-black">
            presisso<span className="text-presisso-red">.</span>{" "}
            <span className="text-sm font-normal text-presisso-gray-mid">
              admin
            </span>
          </h1>
          <button
            onClick={() => {
              sessionStorage.removeItem("presisso-admin");
              setAuthed(false);
            }}
            className="text-sm text-presisso-gray-mid hover:text-presisso-black"
          >
            Salir
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
