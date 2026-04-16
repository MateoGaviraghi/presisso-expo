import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://presisso.vercel.app"),
  title: "Presisso — Diseñá tu cocina ideal",
  description:
    "Visualizá cómo quedarían los amoblamientos Presisso en tu cocina con inteligencia artificial",
  openGraph: {
    title: "Presisso — Diseñá tu cocina ideal",
    description: "Visualizá cómo quedarían los amoblamientos Presisso en tu cocina",
    images: [
      {
        url: "/logo-p-presisso.png",
        width: 1080,
        height: 1080,
        alt: "Presisso",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    images: ["/logo-p-presisso.png"],
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
      <head>
<link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:wght@400;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-presisso-gray-light text-presisso-gray-dark antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
