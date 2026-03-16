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
    <div className="flex items-center justify-center gap-1 px-6 pb-10 sm:gap-2">
      {steps.map((s, i) => {
        const isActive = i === currentStep;
        const isDone = i < currentStep;

        return (
          <div key={s.id} className="flex items-center gap-1 sm:gap-2">
            {/* Step circle */}
            <div className="flex items-center gap-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                  isDone
                    ? "bg-presisso-red text-white"
                    : isActive
                      ? "bg-presisso-red text-white shadow-lg shadow-presisso-red/30"
                      : "bg-presisso-gray-light text-presisso-gray-mid"
                }`}
              >
                {isDone ? (
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`hidden text-sm font-medium tracking-wide sm:block ${
                  isActive
                    ? "text-presisso-black"
                    : isDone
                      ? "text-presisso-gray-dark"
                      : "text-presisso-gray-mid"
                }`}
              >
                {s.label}
              </span>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                className={`h-[2px] w-6 rounded-full transition-colors duration-300 sm:w-10 ${
                  isDone ? "bg-presisso-red" : "bg-presisso-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
