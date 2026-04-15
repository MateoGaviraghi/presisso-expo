"use client";

import { MODO_OPTIONS } from "@/lib/utils/constants";

type ModoKey = keyof typeof MODO_OPTIONS;

interface ModeSelectorProps {
  selected: ModoKey | null;
  onSelect: (mode: ModoKey) => void;
}

export default function ModeSelector({ selected, onSelect }: ModeSelectorProps) {
  const modes = Object.values(MODO_OPTIONS);

  return (
    <div>
      <div className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-presisso-red mb-2">
          Paso 1 de 5
        </p>
        <h2 className="font-heading text-3xl font-bold text-presisso-black sm:text-4xl leading-tight">
          ¿Qué querés hacer?
        </h2>
        <p className="mt-3 text-base leading-relaxed text-presisso-gray-mid">
          Elegí si querés renovar tu cocina actual o diseñar una nueva desde cero.
        </p>
      </div>

      <div className="grid gap-4">
        {modes.map((mode) => {
          const isSelected = selected === mode.id;

          return (
            <button
              type="button"
              key={mode.id}
              onClick={() => onSelect(mode.id as ModoKey)}
              className={`group w-full overflow-hidden rounded-2xl border-2 text-left transition-all duration-300 active:scale-[0.99] ${
                isSelected
                  ? "border-presisso-red shadow-[0_0_0_4px_rgba(212,43,43,0.12)]"
                  : "border-gray-100 bg-white hover:border-presisso-red/40 hover:shadow-lg"
              }`}
            >
              <div
                className={`flex items-center gap-5 px-6 py-7 transition-colors duration-300 ${
                  isSelected ? "bg-red-50" : "bg-white"
                }`}
              >
                {/* Icon */}
                <div
                  className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${
                    isSelected
                      ? "bg-presisso-red shadow-[0_4px_16px_rgba(212,43,43,0.3)]"
                      : "bg-gray-50 group-hover:bg-presisso-red/5"
                  }`}
                >
                  {mode.icon === "refresh" ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      className={`h-7 w-7 transition-colors duration-300 ${
                        isSelected ? "text-white" : "text-gray-400 group-hover:text-presisso-red"
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M21.015 4.356v4.992"
                      />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      className={`h-7 w-7 transition-colors duration-300 ${
                        isSelected ? "text-white" : "text-gray-400 group-hover:text-presisso-red"
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
                      />
                    </svg>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-heading text-lg font-bold transition-colors duration-300 ${
                      isSelected ? "text-presisso-red" : "text-presisso-black"
                    }`}
                  >
                    {mode.label}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">
                    {mode.description}
                  </p>
                </div>

                {/* Radio indicator */}
                <div
                  className={`flex-shrink-0 h-7 w-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? "border-presisso-red bg-presisso-red"
                      : "border-gray-200 group-hover:border-presisso-red/60"
                  }`}
                >
                  {isSelected && (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-white">
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
