import Image from "next/image";
import Link from "next/link";

export default function GraciasPage({
  searchParams,
}: {
  searchParams: { id?: string; nombre?: string; pdf?: string; email?: string };
}) {
  const nombre = searchParams.nombre || "visitante";
  const recibirPdf = searchParams.pdf === "true";
  const tieneEmail = !!searchParams.email;

  return (
    <div className="flex min-h-screen flex-col bg-presisso-cream">
      {/* Header */}
      <header className="border-b border-presisso-border bg-white px-5 py-5">
        <div className="mx-auto max-w-lg">
          <Image
            src="/logo-presisso.png"
            alt="Presisso"
            width={200}
            height={52}
            className="h-11 w-auto"
          />
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-16">
        {/* Success icon */}
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-presisso-red/10 ring-8 ring-presisso-red/5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="h-10 w-10 text-presisso-red"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        {/* Message */}
        <h1 className="mb-3 text-center font-heading text-4xl font-extrabold text-presisso-black sm:text-5xl">
          ¡Gracias, {nombre}!
        </h1>
        <p className="mx-auto max-w-sm text-center text-lg leading-relaxed text-presisso-gray-mid">
          Tu cocina{" "}
          <span className="font-bold text-presisso-red">Presisso</span> está
          siendo generada con IA.
        </p>
        <p className="mx-auto mt-2 max-w-sm text-center text-base leading-relaxed text-presisso-gray-mid">
          Recibirás el diseño personalizado en unos minutos.
        </p>

        {/* Delivery cards */}
        <div className="mt-10 w-full max-w-sm space-y-3">
          {/* WhatsApp card */}
          <div className="flex items-center gap-4 rounded-2xl border border-presisso-border bg-white p-5 shadow-card">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-green-500/10">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6 text-green-600"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              </svg>
            </div>
            <div>
              <p className="font-heading text-[15px] font-bold text-presisso-black">
                WhatsApp
              </p>
              <p className="text-sm text-presisso-gray-mid">
                Te enviamos el diseño una vez que esté listo
              </p>
            </div>
          </div>

          {/* Email + PDF card */}
          {recibirPdf && tieneEmail && (
            <div className="flex items-center gap-4 rounded-2xl border border-presisso-border bg-white p-5 shadow-card">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="h-6 w-6 text-blue-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <div>
                <p className="font-heading text-[15px] font-bold text-presisso-black">
                  PDF por email
                </p>
                <p className="text-sm text-presisso-gray-mid">
                  También te enviamos el diseño completo en PDF
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Thank you note */}
        <div className="mx-auto mt-10 w-full max-w-sm rounded-2xl border border-presisso-red/15 bg-presisso-red-light px-6 py-5 text-center">
          <p className="text-[15px] leading-relaxed text-presisso-gray-dark">
            Gracias por visitar{" "}
            <span className="font-bold text-presisso-red">Presisso</span>.
            Esperamos que te encante tu nueva cocina.
          </p>
        </div>

        {/* Back link */}
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-widest text-presisso-gray-mid transition-colors hover:text-presisso-red"
        >
          <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-3 w-3 rotate-180"
          >
            <path
              fillRule="evenodd"
              d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 111.06-1.06l4.5 4.5.53.53-.53.53-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
