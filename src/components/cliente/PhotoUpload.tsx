"use client";

import { useRef, useState } from "react";

interface PhotoUploadProps {
  preview: string | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

export default function PhotoUpload({
  preview,
  onSelect,
  onRemove,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onSelect(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onSelect(file);
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-presisso-red mb-2">
          Paso 2 de 5
        </p>
        <h2 className="font-heading text-3xl font-bold text-presisso-black sm:text-4xl leading-tight">
          Tu cocina actual
        </h2>
        <p className="mt-3 text-base leading-relaxed text-presisso-gray-mid">
          Fotografiá de frente. Cuanto mejor la foto, más preciso el resultado.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
        aria-label="Subir foto de tu cocina"
      />

      {!preview ? (
        <>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`group relative w-full cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
              dragging
                ? "border-presisso-red bg-presisso-red/5 scale-[1.01]"
                : "border-gray-200 bg-gray-50 hover:border-presisso-red hover:bg-presisso-red/[0.03]"
            }`}
          >
            {/* Animated corner accents */}
            <div className={`absolute top-0 left-0 h-5 w-5 border-t-2 border-l-2 rounded-tl-2xl transition-colors duration-300 ${dragging ? "border-presisso-red" : "border-transparent group-hover:border-presisso-red"}`} />
            <div className={`absolute top-0 right-0 h-5 w-5 border-t-2 border-r-2 rounded-tr-2xl transition-colors duration-300 ${dragging ? "border-presisso-red" : "border-transparent group-hover:border-presisso-red"}`} />
            <div className={`absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 rounded-bl-2xl transition-colors duration-300 ${dragging ? "border-presisso-red" : "border-transparent group-hover:border-presisso-red"}`} />
            <div className={`absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 rounded-br-2xl transition-colors duration-300 ${dragging ? "border-presisso-red" : "border-transparent group-hover:border-presisso-red"}`} />

            <div className="flex flex-col items-center justify-center px-8 py-16 sm:py-20">
              {/* Icon */}
              <div className={`mb-5 flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300 ${dragging ? "bg-presisso-red/10" : "bg-white shadow-md group-hover:shadow-lg group-hover:bg-presisso-red/5"}`}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className={`h-9 w-9 transition-colors duration-300 ${dragging ? "text-presisso-red" : "text-gray-400 group-hover:text-presisso-red"}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>

              <p className={`text-lg font-semibold transition-colors duration-300 ${dragging ? "text-presisso-red" : "text-presisso-black group-hover:text-presisso-red"}`}>
                {dragging ? "Soltá la foto aquí" : "Tocá para subir una foto"}
              </p>
              <p className="mt-1.5 text-sm text-gray-400">
                o arrastrá desde tu dispositivo
              </p>
              <p className="mt-4 text-xs text-gray-400 bg-white rounded-full px-4 py-1.5 border border-gray-100">
                JPG · PNG · WebP · Máx 10MB
              </p>
            </div>
          </button>

        </>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border-2 border-presisso-red/20 shadow-[0_0_0_4px_rgba(212,43,43,0.06)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Tu cocina"
            className="max-h-[65vh] w-full object-contain bg-gray-50"
          />

          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent px-4 pt-4 pb-8">
            <div className="flex items-center gap-2 rounded-full bg-green-500 px-3 py-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-bold text-white">Foto lista</span>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 active:scale-95"
              aria-label="Cambiar foto"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>

          {/* Bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-5 py-5">
            <p className="text-sm text-white/80 font-medium">
              La IA va a transformar estos amoblamientos con el estilo Presisso
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
