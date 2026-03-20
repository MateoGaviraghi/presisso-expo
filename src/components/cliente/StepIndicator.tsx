"use client";

import { STEPS } from "@/lib/utils/constants";

interface StepIndicatorProps {
  steps: typeof STEPS;
  currentStep: number;
}

export default function StepIndicator({
  steps,
  currentStep,
}: StepIndicatorProps) {
  return (
    <div className="bg-white border-b border-gray-100 px-5 pt-5 pb-6 sm:px-8">
      <div className="mx-auto max-w-lg">
        <div className="flex items-start">
          {steps.map((s, i) => {
            const isActive = i === currentStep;
            const isDone = i < currentStep;

            return (
              <div key={s.id} className="flex flex-1 flex-col items-center">
                {/* Row: dot + connector */}
                <div className="flex w-full items-center">
                  {/* Step dot */}
                  <div
                    className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                      isDone
                        ? "bg-presisso-red text-white shadow-[0_0_0_4px_rgba(212,43,43,0.15)]"
                        : isActive
                          ? "bg-presisso-red text-white shadow-[0_0_0_5px_rgba(212,43,43,0.18)] scale-110"
                          : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isDone ? (
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span>{i + 1}</span>
                    )}
                  </div>

                  {/* Connector line (not after last step) */}
                  {i < steps.length - 1 && (
                    <div className="mx-1 h-[2px] flex-1 rounded-full bg-gray-100 transition-colors duration-500 sm:mx-2">
                      <div
                        className={`h-full rounded-full bg-presisso-red transition-all duration-500 ${
                          isDone ? "w-full" : "w-0"
                        }`}
                      />
                    </div>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`mt-2 text-[10px] font-bold uppercase tracking-[0.12em] transition-colors duration-300 ${
                    isActive
                      ? "text-presisso-red"
                      : isDone
                        ? "text-gray-500"
                        : "text-gray-300"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
