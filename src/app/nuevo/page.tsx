"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { validateImageFile } from "@/lib/utils/validators";
import { STEPS } from "@/lib/utils/constants";
import type { KitchenType } from "@/lib/utils/constants";
import StepIndicator from "@/components/cliente/StepIndicator";
import PhotoUpload from "@/components/cliente/PhotoUpload";
import KitchenTypeSelector from "@/components/cliente/KitchenTypeSelector";
import ClientForm from "@/components/cliente/ClientForm";
import ConfirmStep from "@/components/cliente/ConfirmStep";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

  function handlePhotoSelect(file: File) {
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setError(null);
  }

  async function handleSubmit() {
    if (!photoFile || !kitchenType) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Subir foto a Supabase Storage
      const fileName = `${Date.now()}-${photoFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("fotos-cocinas")
        .upload(`originales/${fileName}`, photoFile, {
          contentType: photoFile.type,
          upsert: false,
        });

      if (uploadError) throw new Error("Error al subir la foto");

      // 2. Obtener URL pública
      const { data: urlData } = supabase.storage
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

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Error al enviar solicitud");
      }

      const result = await response.json();

      // 4. Redirigir a pantalla de gracias
      router.push(
        `/gracias?id=${result.id}&nombre=${encodeURIComponent(nombre)}&pdf=${enviarPdf}&email=${encodeURIComponent(email || "")}`,
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error inesperado");
      }
    } finally {
      setLoading(false);
    }
  }

  function canNext(): boolean {
    switch (step) {
      case 0:
        return !!photoFile;
      case 1:
        return !!kitchenType;
      case 2:
        return nombre.length > 1 && whatsapp.length > 7;
      case 3:
        return true;
      default:
        return false;
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="pb-6 pt-10 text-center">
        <Image
          src="/logo-presisso.png"
          alt="Presisso"
          width={200}
          height={50}
          className="mx-auto h-12 w-auto sm:h-14"
          priority
        />
        <p className="mt-2 text-sm uppercase tracking-[0.15em] text-presisso-gray-mid">
          Diseñá tu cocina ideal
        </p>
      </header>

      {/* Step indicator */}
      <StepIndicator steps={STEPS} currentStep={step} />

      {/* Content */}
      <main className="mx-auto max-w-lg px-6 pb-36">
        {step === 0 && (
          <PhotoUpload
            preview={photoPreview}
            onSelect={handlePhotoSelect}
            onRemove={() => {
              setPhotoFile(null);
              setPhotoPreview(null);
            }}
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
          <div className="mt-4 rounded-xl border border-presisso-red/20 bg-presisso-red-light p-3 text-sm text-presisso-red">
            {error}
          </div>
        )}
      </main>

      {/* Navigation buttons - fixed bottom */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-presisso-border bg-white/95 p-5 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 rounded-xl border border-presisso-border py-4 text-base font-medium text-presisso-black transition-colors hover:bg-presisso-gray-light"
            >
              Atrás
            </button>
          )}
          <button
            onClick={() => (step < 3 ? setStep(step + 1) : handleSubmit())}
            disabled={!canNext() || loading}
            className={`flex-[2] rounded-xl py-4 text-base font-semibold transition-all ${
              canNext()
                ? "bg-presisso-red text-white shadow-lg shadow-presisso-red/30 hover:bg-presisso-red-hover active:scale-[0.98]"
                : "cursor-not-allowed bg-presisso-gray-light text-presisso-gray-mid"
            }`}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Enviando...
              </span>
            ) : step === 3 ? (
              "Enviar solicitud"
            ) : (
              "Continuar"
            )}
          </button>
        </div>
      </nav>
    </div>
  );
}
