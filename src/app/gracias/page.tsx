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
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
      {/* Logo */}
      <Image
        src="/logo-presisso.png"
        alt="Presisso"
        width={200}
        height={50}
        className="mb-14 h-12 w-auto sm:h-14"
      />

      {/* Success icon */}
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-presisso-red/10">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="h-12 w-12 text-presisso-red"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>

      {/* Message */}
      <h1 className="mb-4 text-center font-heading text-4xl font-bold text-presisso-black sm:text-5xl">
        ¡Gracias, {nombre}!
      </h1>
      <p className="mx-auto max-w-md text-center text-lg leading-relaxed text-presisso-gray-mid sm:text-xl">
        Tu nueva cocina{" "}
        <span className="font-semibold text-presisso-red">Presisso</span> está
        en camino.
      </p>
      <p className="mx-auto mt-3 max-w-md text-center text-base leading-relaxed text-presisso-gray-mid">
        Estamos generando el diseño personalizado y te lo enviaremos en unos
        minutos.
      </p>

      {/* Delivery cards */}
      <div className="mt-10 w-full max-w-sm space-y-4">
        {/* WhatsApp card */}
        <div className="flex items-center gap-4 rounded-2xl border border-presisso-border bg-presisso-gray-light/50 p-5">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-500/10">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-green-600"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            </svg>
          </div>
          <div>
            <p className="text-base font-semibold text-presisso-black">
              WhatsApp
            </p>
            <p className="text-sm text-presisso-gray-mid">
              Una vez que confirmemos tu diseño, te llegará por WhatsApp
            </p>
          </div>
        </div>

        {/* Email card - only if they opted for PDF */}
        {recibirPdf && tieneEmail && (
          <div className="flex items-center gap-4 rounded-2xl border border-presisso-border bg-presisso-gray-light/50 p-5">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/10">
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
              <p className="text-base font-semibold text-presisso-black">
                Correo electrónico
              </p>
              <p className="text-sm text-presisso-gray-mid">
                También te enviamos un PDF con el diseño completo
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Thank you note */}
      <div className="mx-auto mt-10 max-w-sm rounded-2xl bg-presisso-red-light p-6 text-center">
        <p className="text-base leading-relaxed text-presisso-gray-dark">
          Gracias por elegir{" "}
          <span className="font-bold text-presisso-red">Presisso</span>.
          Esperamos que te encante tu nueva cocina.
        </p>
      </div>

      {/* Back link */}
      <Link
        href="/"
        className="mt-12 text-sm font-medium uppercase tracking-wider text-presisso-gray-mid transition-colors hover:text-presisso-red"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
