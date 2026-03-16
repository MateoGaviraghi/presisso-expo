"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const STEPS = [
  {
    number: "01",
    title: "Sacá una foto",
    desc: "Fotografiá tu cocina actual desde el ángulo que prefieras.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Elegí tu estilo",
    desc: "Seleccioná el tipo de mueble que más te guste.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Diseño Presisso",
    desc: "Recibí el render de tu cocina con muebles Presisso.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  },
];

export default function Home() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <main className="flex min-h-screen flex-col bg-white selection:bg-presisso-red/20">
      {/* Nav */}
      <nav className="flex items-center justify-center px-8 py-10 sm:px-12 sm:py-14">
        <Image
          src="/logo-presisso.png"
          alt="Presisso"
          width={400}
          height={100}
          className="h-16 w-auto sm:h-20 md:h-24"
          priority
        />
      </nav>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 pb-12 pt-4 sm:pt-0">
        <h1 className="max-w-3xl text-center font-heading text-4xl font-bold leading-tight tracking-tight text-presisso-black sm:text-5xl md:text-6xl md:leading-[1.1]">
          Visualizá tu cocina
          <br />
          <span className="text-presisso-red">con Presisso</span>
        </h1>

        <p className="mx-auto mt-6 max-w-md text-center text-base leading-relaxed text-presisso-gray-mid sm:text-lg">
          Sacá una foto, elegí el estilo y recibí el diseño
          de tu cocina en minutos.
        </p>

        {/* CTA */}
        <Link
          href="/nuevo"
          className="group mt-10 inline-flex h-14 items-center gap-3 rounded-full bg-presisso-red px-10 font-heading text-[15px] font-semibold tracking-wide text-white transition-all duration-200 hover:bg-presisso-red-hover hover:shadow-lg hover:shadow-presisso-red/20 active:scale-[0.98]"
        >
          EMPEZAR AHORA
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          >
            <path
              fillRule="evenodd"
              d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </section>

      {/* Steps */}
      <section className="border-t border-presisso-black/[0.06] bg-presisso-gray-light/40 px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              onMouseEnter={() => setHoveredStep(i)}
              onMouseLeave={() => setHoveredStep(null)}
              className={`group cursor-default rounded-2xl border bg-white p-8 transition-all duration-300 sm:p-10 ${
                hoveredStep === i
                  ? "border-presisso-red/20 shadow-xl shadow-presisso-red/[0.06] -translate-y-1"
                  : "border-presisso-black/[0.05] shadow-sm"
              }`}
            >
              <div
                className={`mb-5 inline-flex rounded-xl p-3 transition-colors duration-300 ${
                  hoveredStep === i
                    ? "bg-presisso-red text-white"
                    : "bg-presisso-gray-light text-presisso-gray-mid"
                }`}
              >
                {step.icon}
              </div>

              <span className="mb-2 block font-heading text-xs font-semibold tracking-widest text-presisso-red">
                PASO {step.number}
              </span>

              <h3 className="font-heading text-xl font-bold text-presisso-black sm:text-2xl">
                {step.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-presisso-gray-mid">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-presisso-black/[0.06] py-6 text-center text-[11px] tracking-wider text-presisso-gray-mid/50">
        PRESISSO AMOBLAMIENTOS &copy; {new Date().getFullYear()}
      </footer>
    </main>
  );
}
