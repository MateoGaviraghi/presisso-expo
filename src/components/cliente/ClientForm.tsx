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
      <div className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-presisso-red mb-2">
          Paso 3 de 4
        </p>
        <h2 className="font-heading text-3xl font-bold text-presisso-black sm:text-4xl leading-tight">
          Tus datos
        </h2>
        <p className="mt-3 text-base leading-relaxed text-presisso-gray-mid">
          Solo necesitamos tu nombre y correo para enviarte el diseño.
        </p>
      </div>

      <div className="space-y-4">
        {/* Nombre */}
        <div className="group">
          <label
            htmlFor="nombre"
            className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-presisso-red">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Nombre <span className="text-presisso-red">*</span>
          </label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => onNombreChange(e.target.value)}
            placeholder="Tu nombre completo"
            autoComplete="name"
            className="w-full rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-4 text-base text-presisso-black placeholder:text-gray-300 transition-all duration-200 focus:border-presisso-red focus:bg-white focus:outline-none focus:shadow-[0_0_0_4px_rgba(212,43,43,0.08)]"
          />
        </div>

        {/* Email */}
        <div className="group">
          <label
            htmlFor="email"
            className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-gray-400">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Email <span className="text-presisso-red">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="tu@email.com"
            autoComplete="email"
            className="w-full rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-4 text-base text-presisso-black placeholder:text-gray-300 transition-all duration-200 focus:border-presisso-red focus:bg-white focus:outline-none focus:shadow-[0_0_0_4px_rgba(212,43,43,0.08)]"
          />
        </div>

        {/* WhatsApp */}
        <div className="group">
          <label
            htmlFor="whatsapp"
            className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-green-500">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp <span className="ml-0.5 text-[10px] font-normal normal-case tracking-normal text-gray-400">(opcional)</span>
          </label>
          <input
            id="whatsapp"
            type="tel"
            value={whatsapp}
            onChange={(e) => onWhatsappChange(e.target.value)}
            placeholder="+54 9 11 1234-5678"
            autoComplete="tel"
            className="w-full rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-4 text-base text-presisso-black placeholder:text-gray-300 transition-all duration-200 focus:border-presisso-red focus:bg-white focus:outline-none focus:shadow-[0_0_0_4px_rgba(212,43,43,0.08)]"
          />
        </div>

        {/* PDF Toggle */}
        <div
          className={`flex items-center justify-between rounded-2xl border-2 p-5 transition-all duration-300 cursor-pointer ${
            enviarPdf
              ? "border-presisso-red/30 bg-red-50"
              : "border-gray-100 bg-gray-50"
          }`}
          onClick={() => onEnviarPdfChange(!enviarPdf)}
        >
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${enviarPdf ? "bg-presisso-red" : "bg-gray-200"}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <p className={`text-sm font-semibold transition-colors duration-300 ${enviarPdf ? "text-presisso-black" : "text-gray-600"}`}>
                Recibir PDF del diseño
              </p>
              <p className="mt-0.5 text-xs text-gray-400">
                Te enviamos un catálogo con todos los detalles
              </p>
            </div>
          </div>

          {/* Toggle switch */}
          <label
            aria-label="Recibir PDF por email"
            className="ml-3 flex-shrink-0 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={enviarPdf}
              onChange={(e) => onEnviarPdfChange(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`relative h-7 w-12 rounded-full border-2 border-transparent transition-colors duration-200 ${
                enviarPdf ? "bg-presisso-red" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                  enviarPdf ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </label>
        </div>

        {/* Trust note */}
        <p className="flex items-center gap-2 text-xs text-gray-400 pt-1">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 flex-shrink-0 text-gray-300">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
          </svg>
          Tus datos son privados y solo se usan para enviarte el diseño.
        </p>
      </div>
    </div>
  );
}
