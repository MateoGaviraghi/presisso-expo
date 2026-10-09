"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ padding: 40, textAlign: "center", fontFamily: "system-ui" }}>
          <h2>Algo salió mal</h2>
          <p style={{ color: "#6E6862" }}>Ocurrió un error inesperado.</p>
          <button
            onClick={reset}
            style={{
              marginTop: 16,
              padding: "10px 24px",
              background: "#8B0001",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
