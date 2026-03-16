"use client";

import { KITCHEN_TYPES } from "@/lib/utils/constants";
import type { KitchenType } from "@/lib/utils/constants";

interface ConfirmStepProps {
  photoPreview: string;
  kitchenType: KitchenType;
  nombre: string;
  whatsapp: string;
  email: string;
  enviarPdf: boolean;
}

export default function ConfirmStep({
  photoPreview,
  kitchenType,
  nombre,
  whatsapp,
  email,
  enviarPdf,
}: ConfirmStepProps) {
  const kitchen = KITCHEN_TYPES[kitchenType];

  return (
    <div>
      <h2 className="mb-2 font-heading text-3xl font-bold text-presisso-black sm:text-4xl">
        Confirmá tu solicitud
      </h2>
      <p className="mb-8 text-base leading-relaxed text-presisso-gray-mid">
        Revisá que todo esté correcto antes de enviar.
      </p>

      <div className="space-y-5">
        {/* Photo preview */}
        <div className="overflow-hidden rounded-xl border border-presisso-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoPreview}
            alt="Tu cocina"
            className="max-h-72 w-full object-contain sm:max-h-80"
          />
        </div>

        {/* Summary items */}
        <div className="space-y-4 rounded-xl border border-presisso-border bg-presisso-gray-light/50 p-6">
          <SummaryRow label="Estilo" value={kitchen.label} />
          <SummaryRow label="Nombre" value={nombre} />
          <SummaryRow label="WhatsApp" value={whatsapp} />
          {email && <SummaryRow label="Email" value={email} />}
          <SummaryRow label="Recibir PDF" value={enviarPdf ? "Sí" : "No"} />
        </div>

        <p className="text-center text-sm text-presisso-gray-mid">
          Al enviar, aceptás que procesemos tu foto para generar el diseño.
        </p>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium uppercase tracking-wider text-presisso-gray-mid">
        {label}
      </span>
      <span className="text-base font-medium text-presisso-black">{value}</span>
    </div>
  );
}
