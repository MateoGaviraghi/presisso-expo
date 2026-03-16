import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Presisso — Diseñá tu cocina ideal",
  description:
    "Visualizá cómo quedarían los muebles Presisso en tu cocina con inteligencia artificial",
  openGraph: {
    title: "Presisso — Diseñá tu cocina ideal",
    description: "Visualizá cómo quedarían los muebles Presisso en tu cocina",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-presisso-gray-light text-presisso-gray-dark antialiased">
        {children}
      </body>
    </html>
  );
}
