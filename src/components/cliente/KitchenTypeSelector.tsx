"use client";

import Image from "next/image";
import { KITCHEN_TYPES } from "@/lib/utils/constants";
import type { KitchenType } from "@/lib/utils/constants";

interface KitchenTypeSelectorProps {
  selected: KitchenType | null;
  onSelect: (type: KitchenType) => void;
}

export default function KitchenTypeSelector({
  selected,
  onSelect,
}: KitchenTypeSelectorProps) {
  const types = Object.values(KITCHEN_TYPES);

  return (
    <div>
      <div className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-presisso-red mb-2">
          Paso 2 de 4
        </p>
        <h2 className="font-heading text-3xl font-bold text-presisso-black sm:text-4xl leading-tight">
          Elegí tu color
        </h2>
        <p className="mt-3 text-base leading-relaxed text-presisso-gray-mid">
          Seleccioná el color Presisso para tus amoblamientos.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {types.map((type) => {
          const isSelected = selected === type.id;

          return (
            <button
              type="button"
              key={type.id}
              onClick={() => onSelect(type.id as KitchenType)}
              className={`group w-full overflow-hidden rounded-2xl border-2 text-left transition-all duration-300 active:scale-[0.99] ${
                isSelected
                  ? "border-presisso-red shadow-[0_0_0_4px_rgba(212,43,43,0.12)]"
                  : "border-gray-100 bg-white hover:border-presisso-red/40 hover:shadow-lg"
              }`}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden bg-gray-100 sm:h-72">
                <Image
                  src={type.image}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  alt={type.label}
                  sizes="(max-width: 640px) 100vw, 512px"
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Selected overlay */}
                {isSelected && (
                  <div className="absolute inset-0 bg-presisso-red/8" />
                )}

                {/* Tag */}
                <span
                  className={`absolute left-4 top-4 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm ${
                    isSelected
                      ? "bg-presisso-red text-white"
                      : "bg-white/95 text-gray-700 backdrop-blur-sm"
                  }`}
                >
                  {type.tag}
                </span>

                {/* Checkmark */}
                {isSelected && (
                  <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-presisso-red shadow-lg">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-white">
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                {/* Title on image */}
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
                  <h3 className="font-heading text-xl font-bold text-white drop-shadow-md">
                    {type.label}
                  </h3>
                </div>
              </div>

              {/* Card body */}
              <div
                className={`px-5 py-4 flex items-center justify-between transition-colors duration-300 ${
                  isSelected ? "bg-red-50" : "bg-white"
                }`}
              >
                <p className="text-sm leading-relaxed text-gray-500 flex-1 pr-4">
                  {type.description}
                </p>
                <div
                  className={`flex-shrink-0 h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? "border-presisso-red bg-presisso-red"
                      : "border-gray-200 group-hover:border-presisso-red/60"
                  }`}
                >
                  {isSelected ? (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-white">
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gray-300 group-hover:text-presisso-red/50 transition-colors">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
