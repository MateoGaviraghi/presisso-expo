# FASE 2 — Frontend Cliente

> **Duración:** Semana 1, Días 2-5  
> **Responsable:** Frontend Developer  
> **Entregable:** Wizard completo funcional, responsive tablet + mobile  

---

## ⚙️ SKILLS REQUERIDAS — Leer antes de ejecutar

> **Documento de referencia:** [`09-SKILLS.md`](./09-SKILLS.md)

| Skill | Rol | Nivel |
|-------|-----|-------|
| Desarrollador Full Stack | Principal | Senior 10+ años |
| Diseñador Gráfico | Principal | Senior 10+ años |
| Ingeniero Industrial | Soporte | Optimización de flujos UX |

### 📖 Skills del proyecto — LEER antes de ejecutar esta fase:

| Skill (archivo) | Propósito en esta fase |
|------------------|------------------------|
| [`.agents/skills/nextjs-react-typescript/SKILL.md`](../.agents/skills/nextjs-react-typescript/SKILL.md) | Componentes React 18, App Router, Server Components |
| [`.agents/skills/ui-ux-pro-max/SKILL.md`](../.agents/skills/ui-ux-pro-max/SKILL.md) | Diseño UI/UX mobile-first, paleta, tipografía |
| [`.agents/skills/tailwindcss-advanced-layouts/SKILL.md`](../.agents/skills/tailwindcss-advanced-layouts/SKILL.md) | Layouts con Tailwind CSS, Grid, Flexbox |
| [`.agents/skills/tailwindcss-mobile-first/SKILL.md`](../.agents/skills/tailwindcss-mobile-first/SKILL.md) | Diseño mobile-first para tablets/expo |
| [`.agents/skills/typescript-advanced-types/SKILL.md`](../.agents/skills/typescript-advanced-types/SKILL.md) | Tipado estricto de componentes y props |

### Prompt de contexto — COPIAR antes de iniciar esta fase:

```
Actuá como un equipo integrado por:
- Desarrollador Full Stack Senior (10+ años) especializado en React 18, Next.js 14 
  App Router, TypeScript estricto y desarrollo mobile-first.
- Diseñador Gráfico Senior (10+ años) especializado en UI/UX para dispositivos 
  táctiles, identidad de marca y diseño de experiencias en eventos/expos.
- Ingeniero Industrial con experiencia en ergonomía y flujos de usuario optimizados 
  para reducir fricción en entornos de alta rotación (stands de expo).

PROYECTO: Wizard de 4 pasos para que clientes en una expo suban foto de su cocina, 
elijan estilo de muebles y reciban un fotomontaje por WhatsApp.
MARCA: Presisso. Paleta: #D42B2B, #1A1A1A, #F5F5F3, #333333, #6B6B6B.
DISPOSITIVOS: Tablet en stand + celular del cliente vía QR.
PRIORIDADES: Velocidad de uso > estética > features. Cada segundo cuenta en la expo.
TAREA: Construir el frontend completo del wizard cliente con carga de foto, 
selector de tipo de cocina, formulario de datos mínimos y pantalla de confirmación.
```

---

## 2.1 Layout raíz — `src/app/layout.tsx`

```typescript
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Presisso — Diseñá tu cocina ideal",
  description: "Visualizá cómo quedarían los muebles Presisso en tu cocina con inteligencia artificial",
  openGraph: {
    title: "Presisso — Diseñá tu cocina ideal",
    description: "Visualizá cómo quedarían los muebles Presisso en tu cocina",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,   // Evitar zoom accidental en expo
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-presisso-gray-light text-presisso-gray-dark antialiased">
        {children}
      </body>
    </html>
  );
}
```

---

## 2.2 Constantes de configuración — `src/lib/utils/constants.ts`

```typescript
export const KITCHEN_TYPES = {
  moderna: {
    id: "moderna",
    label: "Línea Moderna",
    tag: "Tendencia 2026",
    description: "Líneas limpias, acabados minimalistas, tiradores integrados",
    image: "/kitchens/moderna-preview.jpg",
  },
  premium: {
    id: "premium",
    label: "Línea Premium",
    tag: "Exclusiva",
    description: "Materiales nobles, detalles de lujo, herrajes importados",
    image: "/kitchens/premium-preview.jpg",
  },
} as const;

export type KitchenType = keyof typeof KITCHEN_TYPES;

export const STEPS = [
  { id: 0, label: "Foto", icon: "camera" },
  { id: 1, label: "Estilo", icon: "palette" },
  { id: 2, label: "Datos", icon: "user" },
  { id: 3, label: "Enviar", icon: "check" },
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
```

---

## 2.3 Tipos — `src/types/solicitud.ts`

```typescript
export type EstadoSolicitud =
  | "pendiente"
  | "generando"
  | "revision"
  | "aprobada"
  | "enviada"
  | "rechazada"
  | "error";

export interface Solicitud {
  id: string;
  created_at: string;
  updated_at: string;
  nombre: string;
  whatsapp: string;
  email: string | null;
  tipo_cocina: "moderna" | "premium";
  enviar_pdf: boolean;
  foto_original: string;
  imagen_generada: string | null;
  imagen_generada_2: string | null;
  estado: EstadoSolicitud;
  prompt_usado: string | null;
  modelo_ia: string;
  intentos_generacion: number;
  tiempo_generacion_ms: number | null;
  pdf_url: string | null;
  whatsapp_sid: string | null;
  email_id: string | null;
  enviado_at: string | null;
  notas_admin: string | null;
}

export interface CreateSolicitudPayload {
  nombre: string;
  whatsapp: string;
  email?: string;
  tipo_cocina: "moderna" | "premium";
  enviar_pdf: boolean;
  foto_original: string;
}
```

---

## 2.4 Validaciones — `src/lib/utils/validators.ts`

```typescript
import { z } from "zod";
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from "./constants";

export const clientFormSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "Nombre demasiado largo"),
  whatsapp: z
    .string()
    .min(8, "Número de WhatsApp inválido")
    .max(20, "Número demasiado largo")
    .regex(/^[\d\s+\-()]+$/, "Solo números, espacios y + permitidos"),
  email: z
    .string()
    .email("Email inválido")
    .optional()
    .or(z.literal("")),
  tipo_cocina: z.enum(["moderna", "premium"]),
  enviar_pdf: z.boolean(),
});

export const validateImageFile = (file: File): string | null => {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Solo se aceptan imágenes JPG, PNG o WebP";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "La imagen no puede superar los 10MB";
  }
  return null;
};
```

---

## 2.5 Cliente Supabase (browser) — `src/lib/supabase/client.ts`

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

---

## 2.6 Página principal del wizard — `src/app/nuevo/page.tsx`

```typescript
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { validateImageFile } from "@/lib/utils/validators";
import { STEPS, KITCHEN_TYPES } from "@/lib/utils/constants";
import type { KitchenType } from "@/lib/utils/constants";
import StepIndicator from "@/components/cliente/StepIndicator";
import PhotoUpload from "@/components/cliente/PhotoUpload";
import KitchenTypeSelector from "@/components/cliente/KitchenTypeSelector";
import ClientForm from "@/components/cliente/ClientForm";
import ConfirmStep from "@/components/cliente/ConfirmStep";
import { useRouter } from "next/navigation";

export default function NuevoPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [kitchenType, setKitchenType] = useState<KitchenType | null>(null);
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [enviarPdf, setEnviarPdf] = useState(true);

  const handlePhotoSelect = (file: File) => {
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!photoFile || !kitchenType) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Subir foto a Supabase Storage
      const fileName = `${Date.now()}-${photoFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from("fotos-cocinas")
        .upload(`originales/${fileName}`, photoFile, {
          contentType: photoFile.type,
          upsert: false,
        });

      if (uploadError) throw new Error("Error al subir la foto");

      // 2. Obtener URL pública
      const { data: urlData } = supabase
        .storage
        .from("fotos-cocinas")
        .getPublicUrl(uploadData.path);

      // 3. Crear solicitud via API
      const response = await fetch("/api/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          whatsapp,
          email: email || undefined,
          tipo_cocina: kitchenType,
          enviar_pdf: enviarPdf,
          foto_original: urlData.publicUrl,
        }),
      });

      if (!response.ok) throw new Error("Error al enviar solicitud");

      const result = await response.json();

      // 4. Redirigir a pantalla de gracias
      router.push(`/gracias?id=${result.id}&nombre=${encodeURIComponent(nombre)}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const canNext = (): boolean => {
    switch (step) {
      case 0: return !!photoFile;
      case 1: return !!kitchenType;
      case 2: return nombre.length > 1 && whatsapp.length > 7;
      case 3: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-presisso-black">
      {/* Header */}
      <header className="text-center pt-8 pb-5">
        <h1 className="font-heading text-3xl font-bold text-white tracking-tight">
          presisso<span className="text-presisso-red">.</span>
        </h1>
        <p className="text-presisso-gray-mid text-xs tracking-[0.15em] uppercase mt-1">
          Diseñá tu cocina ideal
        </p>
      </header>

      {/* Step indicator */}
      <StepIndicator steps={STEPS} currentStep={step} />

      {/* Content */}
      <main className="max-w-md mx-auto px-5 pb-32">
        {step === 0 && (
          <PhotoUpload
            preview={photoPreview}
            onSelect={handlePhotoSelect}
            onRemove={() => { setPhotoFile(null); setPhotoPreview(null); }}
          />
        )}
        {step === 1 && (
          <KitchenTypeSelector
            selected={kitchenType}
            onSelect={setKitchenType}
          />
        )}
        {step === 2 && (
          <ClientForm
            nombre={nombre}
            whatsapp={whatsapp}
            email={email}
            enviarPdf={enviarPdf}
            onNombreChange={setNombre}
            onWhatsappChange={setWhatsapp}
            onEmailChange={setEmail}
            onEnviarPdfChange={setEnviarPdf}
          />
        )}
        {step === 3 && (
          <ConfirmStep
            photoPreview={photoPreview!}
            kitchenType={kitchenType!}
            nombre={nombre}
            whatsapp={whatsapp}
            email={email}
            enviarPdf={enviarPdf}
          />
        )}

        {/* Error display */}
        {error && (
          <div className="mt-4 p-3 bg-presisso-red-light border border-presisso-red/20 rounded-presisso text-sm text-presisso-red">
            {error}
          </div>
        )}
      </main>

      {/* Navigation buttons - fixed bottom */}
      <nav className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-presisso-black via-presisso-black to-transparent">
        <div className="max-w-md mx-auto flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-4 rounded-presisso border border-white/10 text-white font-medium transition-colors hover:bg-white/5"
            >
              Atrás
            </button>
          )}
          <button
            onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
            disabled={!canNext() || loading}
            className={`flex-[2] py-4 rounded-presisso font-semibold transition-all ${
              canNext()
                ? "bg-presisso-red text-white shadow-lg shadow-presisso-red/30 hover:bg-presisso-red-hover"
                : "bg-white/5 text-white/30 cursor-not-allowed"
            }`}
          >
            {loading ? "Enviando..." : step === 3 ? "Enviar solicitud" : "Continuar"}
          </button>
        </div>
      </nav>
    </div>
  );
}
```

---

## 2.7 Componentes clave del cliente

### PhotoUpload — `src/components/cliente/PhotoUpload.tsx`

```typescript
"use client";

import { useRef } from "react";

interface Props {
  preview: string | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

export default function PhotoUpload({ preview, onSelect, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onSelect(file);
  };

  return (
    <div>
      <h2 className="font-heading text-2xl text-white font-semibold mb-2">
        Tu cocina actual
      </h2>
      <p className="text-presisso-gray-mid text-sm mb-6 leading-relaxed">
        Subí una foto frontal de tu cocina. Cuanto mejor la foto, mejor el resultado.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        onChange={handleChange}
        className="hidden"
      />

      {!preview ? (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-white/15 rounded-2xl p-16 text-center
                     hover:border-presisso-red hover:bg-presisso-red/5 transition-all cursor-pointer"
        >
          {/* Camera icon SVG */}
          <p className="text-white font-medium mt-4">Tocá para sacar o subir una foto</p>
          <p className="text-presisso-gray-mid text-xs mt-1">JPG, PNG o WebP • Máx 10MB</p>
        </button>
      ) : (
        <div className="relative rounded-2xl overflow-hidden">
          <img src={preview} alt="Tu cocina" className="w-full h-60 object-cover" />
          <button
            onClick={onRemove}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white
                       flex items-center justify-center hover:bg-black/80"
          >
            ✕
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-green-300 text-sm font-medium">✓ Foto cargada</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 2.8 Responsive: breakpoints clave

```
Mobile (celular QR):    < 640px   → padding 16px, cards full-width
Tablet (stand):         640-1024px → padding 24px, cards centradas max-w-md
Desktop (admin):        > 1024px  → sidebar + content grid
```

El wizard del cliente siempre usa `max-w-md mx-auto` para estar centrado tanto en móvil como tablet.

---

## 2.9 Optimizaciones para la expo

```typescript
// src/app/nuevo/page.tsx — agregar al <head> via metadata
export const metadata = {
  other: {
    "mobile-web-app-capable": "yes",          // PWA-like en Android
    "apple-mobile-web-app-capable": "yes",     // PWA-like en iOS
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};
```

- `capture="environment"` en el input abre la cámara trasera directamente
- `userScalable: false` evita zoom accidental
- `position: fixed` en los botones de navegación para acceso rápido
- Imágenes optimizadas con `sharp` antes de subir a Supabase

---

## 2.10 Verificación de la fase

| Check | Criterio |
|-------|----------|
| ✅ | Wizard de 4 pasos navega correctamente |
| ✅ | Carga de foto funciona desde cámara y galería |
| ✅ | Selector de tipo cocina muestra ambas opciones |
| ✅ | Formulario valida nombre y WhatsApp |
| ✅ | Pantalla de confirmación muestra resumen completo |
| ✅ | Submit sube foto a Supabase Storage |
| ✅ | Submit crea registro en tabla `solicitudes` |
| ✅ | Redirect a `/gracias` post-envío |
| ✅ | Responsive correcto en iPhone SE, iPad, tablet 10" |
| ✅ | Colores Presisso (#D42B2B) aplicados correctamente |
