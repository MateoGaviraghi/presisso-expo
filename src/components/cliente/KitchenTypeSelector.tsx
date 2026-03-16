"use client";

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
      <h2 className="mb-2 font-heading text-3xl font-bold text-presisso-black sm:text-4xl">
        Elegí tu estilo
      </h2>
      <p className="mb-8 text-base leading-relaxed text-presisso-gray-mid">
        Seleccioná el tipo de mueble que más te guste para tu cocina.
      </p>

      <div className="grid gap-4">
        {types.map((type) => {
          const isSelected = selected === type.id;

          return (
            <button
              key={type.id}
              onClick={() => onSelect(type.id as KitchenType)}
              className={`group w-full rounded-2xl border-2 p-7 text-left transition-all duration-200 ${
                isSelected
                  ? "border-presisso-red bg-presisso-red-light shadow-lg shadow-presisso-red/10"
                  : "border-presisso-border bg-white hover:border-presisso-gray-mid/30 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                      isSelected
                        ? "bg-presisso-red/15 text-presisso-red"
                        : "bg-presisso-gray-light text-presisso-gray-mid"
                    }`}
                  >
                    {type.tag}
                  </span>
                  <h3 className="mt-3 font-heading text-2xl font-bold text-presisso-black">
                    {type.label}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-presisso-gray-mid">
                    {type.description}
                  </p>
                </div>

                {/* Radio indicator */}
                <div
                  className={`mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                    isSelected
                      ? "border-presisso-red bg-presisso-red"
                      : "border-presisso-border"
                  }`}
                >
                  {isSelected && (
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4 text-white"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
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
