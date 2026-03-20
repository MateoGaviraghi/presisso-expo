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
      <div className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-presisso-red mb-2">
          Paso 4 de 4
        </p>
        <h2 className="font-heading text-3xl font-bold text-presisso-black sm:text-4xl leading-tight">
          Todo listo
        </h2>
        <p className="mt-3 text-base leading-relaxed text-presisso-gray-mid">
          Revisá los detalles y enviá tu solicitud. La IA de Presisso va a transformar tu cocina.
        </p>
      </div>

      {/* Foto del cliente */}
      <div className="mb-5 overflow-hidden rounded-xl border border-gray-100">
        <div className="bg-gray-50 px-4 py-2 flex items-center gap-2 border-b border-gray-100">
          <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Tu cocina</span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoPreview}
          alt="Tu cocina actual"
          className="max-h-64 w-full object-contain bg-gray-50 sm:max-h-80"
        />
      </div>

      {/* Summary card */}
      <div className="rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden mb-4">
        <div className="px-5 py-3 border-b border-gray-100 bg-white">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">
            Resumen de tu solicitud
          </p>
        </div>
        <div className="divide-y divide-gray-100">
          <SummaryRow
            icon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-presisso-red">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            }
            label="Estilo elegido"
            value={kitchen.label}
            highlight
          />
          <SummaryRow
            icon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gray-400">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            }
            label="Nombre"
            value={nombre}
          />
          <SummaryRow
            icon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gray-400">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            }
            label="Email"
            value={email}
          />
          {whatsapp && (
            <SummaryRow
              icon={
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-green-500">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              }
              label="WhatsApp"
              value={whatsapp}
            />
          )}
          <SummaryRow
            icon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gray-400">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
            }
            label="PDF del diseño"
            value={enviarPdf ? "Sí, enviame el PDF" : "No por ahora"}
          />
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-gray-400 leading-relaxed">
        Al enviar aceptás que procesemos tu foto para generar el diseño personalizado.
      </p>
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <div className="flex-shrink-0">{icon}</div>
      <span className="text-sm text-gray-500 flex-1">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? "text-presisso-red" : "text-presisso-black"}`}>
        {value}
      </span>
    </div>
  );
}
