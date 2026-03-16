"use client";

import { useRef } from "react";

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onSelect(file);
  }

  return (
    <div>
      <h2 className="mb-2 font-heading text-3xl font-bold text-presisso-black sm:text-4xl">
        Tu cocina actual
      </h2>
      <p className="mb-8 text-base leading-relaxed text-presisso-gray-mid">
        Subí una foto frontal de tu cocina. Cuanto mejor la foto, mejor el
        resultado.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
        aria-label="Subir foto de tu cocina"
      />

      {!preview ? (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full cursor-pointer rounded-2xl border-2 border-dashed border-presisso-border p-16 text-center transition-all hover:border-presisso-red hover:bg-presisso-red-light sm:p-20"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="mx-auto h-14 w-14 text-presisso-gray-mid"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
            />
          </svg>
          <p className="mt-4 text-lg font-medium text-presisso-black">
            Tocá para sacar o subir una foto
          </p>
          <p className="mt-1 text-sm text-presisso-gray-mid">
            JPG, PNG o WebP · Máx 10MB
          </p>
        </button>
      ) : (
        <div className="relative overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Tu cocina"
            className="max-h-[70vh] w-full object-contain"
          />
          <button
            onClick={onRemove}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
            aria-label="Eliminar foto"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-sm font-medium text-green-300">✓ Foto cargada</p>
          </div>
        </div>
      )}
    </div>
  );
}
