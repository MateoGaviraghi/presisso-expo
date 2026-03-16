"use client";

interface ClientFormProps {
  nombre: string;
  whatsapp: string;
  email: string;
  enviarPdf: boolean;
  onNombreChange: (v: string) => void;
  onWhatsappChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onEnviarPdfChange: (v: boolean) => void;
}

export default function ClientForm({
  nombre,
  whatsapp,
  email,
  enviarPdf,
  onNombreChange,
  onWhatsappChange,
  onEmailChange,
  onEnviarPdfChange,
}: ClientFormProps) {
  return (
    <div>
      <h2 className="mb-2 font-heading text-3xl font-bold text-presisso-black sm:text-4xl">
        Tus datos
      </h2>
      <p className="mb-8 text-base leading-relaxed text-presisso-gray-mid">
        Solo necesitamos tu nombre y WhatsApp para enviarte el diseño.
      </p>

      <div className="space-y-6">
        {/* Nombre */}
        <div>
          <label
            htmlFor="nombre"
            className="mb-2 block text-sm font-semibold uppercase tracking-wider text-presisso-gray-dark"
          >
            Nombre *
          </label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => onNombreChange(e.target.value)}
            placeholder="Tu nombre"
            autoComplete="name"
            className="w-full rounded-xl border border-presisso-border bg-presisso-gray-light/50 px-4 py-4 text-base text-presisso-black placeholder:text-presisso-gray-mid/50 transition-colors focus:border-presisso-red focus:outline-none focus:ring-1 focus:ring-presisso-red/50"
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label
            htmlFor="whatsapp"
            className="mb-2 block text-sm font-semibold uppercase tracking-wider text-presisso-gray-dark"
          >
            WhatsApp *
          </label>
          <input
            id="whatsapp"
            type="tel"
            value={whatsapp}
            onChange={(e) => onWhatsappChange(e.target.value)}
            placeholder="+54 9 11 1234-5678"
            autoComplete="tel"
            className="w-full rounded-xl border border-presisso-border bg-presisso-gray-light/50 px-4 py-4 text-base text-presisso-black placeholder:text-presisso-gray-mid/50 transition-colors focus:border-presisso-red focus:outline-none focus:ring-1 focus:ring-presisso-red/50"
          />
        </div>

        {/* Email (opcional) */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold uppercase tracking-wider text-presisso-gray-dark"
          >
            Email <span className="text-presisso-gray-mid">(opcional)</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="tu@email.com"
            autoComplete="email"
            className="w-full rounded-xl border border-presisso-border bg-presisso-gray-light/50 px-4 py-4 text-base text-presisso-black placeholder:text-presisso-gray-mid/50 transition-colors focus:border-presisso-red focus:outline-none focus:ring-1 focus:ring-presisso-red/50"
          />
        </div>

        {/* Toggle PDF */}
        <div className="flex items-center justify-between rounded-xl border border-presisso-border bg-presisso-gray-light/50 p-5">
          <div>
            <p className="text-base font-medium text-presisso-black">
              Recibir PDF
            </p>
            <p className="mt-0.5 text-sm text-presisso-gray-mid">
              Te enviamos un PDF con el diseño a tu email
            </p>
          </div>
          <label
            aria-label="Recibir PDF por email"
            className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-within:ring-2 focus-within:ring-presisso-red focus-within:ring-offset-1 ${
              enviarPdf ? "bg-presisso-red" : "bg-presisso-gray-mid/30"
            }`}
          >
            <input
              type="checkbox"
              checked={enviarPdf}
              onChange={(e) => onEnviarPdfChange(e.target.checked)}
              className="sr-only"
            />
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-200 ${
                enviarPdf ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
