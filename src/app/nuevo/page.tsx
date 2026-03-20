"use client";

import { useState } from "react";
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
import Link from "next/link";

export default function NuevoPage() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const formData = new FormData();
      formData.append("file", photoFile);
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!uploadResponse.ok) {
        const uploadErr = await uploadResponse.json().catch(() => ({}));
        throw new Error(uploadErr.error || "Error al subir la foto");
      }
      const { url: fotoUrl } = await uploadResponse.json();

      const response = await fetch("/api/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          whatsapp,
          email: email || undefined,
          tipo_cocina: kitchenType,
          enviar_pdf: enviarPdf,
          foto_original: fotoUrl,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Error al enviar solicitud");
      }

      const result = await response.json();

      router.push(
        `/gracias?id=${result.id}&nombre=${encodeURIComponent(nombre)}&pdf=${enviarPdf}&email=${encodeURIComponent(email || "")}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  function canNext(): boolean {
    switch (step) {
      case 0: return !!photoFile;
      case 1: return !!kitchenType;
      case 2: return nombre.length > 1 && whatsapp.length > 7;
      case 3: return true;
      default: return false;
    }
  }

  function handleNext() {
    setError(null);
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  }

  const ctaLabel = loading
    ? "Enviando..."
    : step === 3
      ? "Enviar solicitud"
      : "Continuar";

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" aria-label="Volver al inicio">
            <Image
              src="/logo-presisso.png"
              alt="Presisso"
              width={160}
              height={42}
              className="h-9 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-2 rounded-full bg-gray-50 border border-gray-100 px-3 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-presisso-red animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">
              Diseñá tu cocina
            </span>
          </div>
        </div>
      </header>

      {/* ── Step indicator ── */}
      <StepIndicator steps={STEPS} currentStep={step} />

      {/* ── Content ── */}
      <main className="mx-auto w-full max-w-lg flex-1 px-5 pt-6 pb-40 sm:px-6">

        {/* Step panels */}
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

        {/* Error */}
        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-presisso-red">
            <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 flex-shrink-0">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </main>

      {/* ── Fixed navigation ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="mx-auto max-w-lg px-5 py-4 sm:px-6">
          <div className="flex gap-3">

            {/* Back button */}
            {step > 0 && (
              <button
                type="button"
                onClick={() => { setError(null); setStep(step - 1); }}
                disabled={loading}
                className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border-2 border-gray-100 bg-white text-gray-400 transition-all duration-200 hover:border-gray-200 hover:text-presisso-black active:scale-95 disabled:opacity-40"
                aria-label="Paso anterior"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
            )}

            {/* Continue / Submit button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={!canNext() || loading}
              className={`flex h-14 flex-1 items-center justify-center gap-2.5 rounded-2xl text-[15px] font-bold uppercase tracking-wider transition-all duration-200 ${
                canNext() && !loading
                  ? "bg-presisso-red text-white shadow-[0_4px_24px_rgba(212,43,43,0.35)] hover:shadow-[0_4px_16px_rgba(212,43,43,0.25)] hover:bg-presisso-red-hover active:scale-[0.98]"
                  : "cursor-not-allowed bg-gray-100 text-gray-300"
              }`}
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  {ctaLabel}
                  {step < 3 && (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  )}
                  {step === 3 && (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                    </svg>
                  )}
                </>
              )}
            </button>
          </div>

          {/* Step counter */}
          <p className="mt-2 text-center text-[11px] text-gray-400">
            {step + 1} de {STEPS.length} pasos completados
          </p>
        </div>
      </nav>
    </div>
  );
}
