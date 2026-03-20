"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const STEPS = [
  {
    number: "01",
    title: "Sacá una foto",
    desc: "Fotografiá tu cocina actual desde el ángulo que prefieras. Cuanto mejor la toma, mejor el resultado.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
        />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Elegí tu estilo",
    desc: "Seleccioná entre la Línea Moderna o la Línea Premium de muebles Presisso.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
        />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Recibí tu diseño",
    desc: "En minutos obtenés el render de tu cocina con muebles Presisso reales, directo a tu WhatsApp.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
        />
      </svg>
    ),
  },
];

const TRUST_CHIPS = [
  "Diseño en minutos",
  "Muebles Presisso reales",
  "Gratis en la Expo",
];

export default function Home() {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen font-body">
      {/* ── STICKY NAV ─────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          navScrolled
            ? "bg-white/95 shadow-[0_1px_0_rgba(0,0,0,0.07)] backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Image
            src="/logo-presisso.png"
            alt="Presisso"
            width={200}
            height={52}
            className="h-11 w-auto"
            priority
          />
          <Link
            href="/nuevo"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-presisso-red px-6 font-heading text-[13px] font-bold uppercase tracking-widest text-white transition-all duration-200 hover:bg-presisso-red-hover hover:shadow-red-glow active:scale-[0.97]"
          >
            Empezar
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-3.5 w-3.5"
            >
              <path
                fillRule="evenodd"
                d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 111.06-1.06l4.5 4.5.53.53-.53.53-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-presisso-cream">
        <div className="grid min-h-[100svh] grid-cols-1 lg:grid-cols-2">
          {/* Left: Content */}
          <div className="flex flex-col items-center text-center justify-center px-5 pb-16 pt-28 sm:px-10 lg:items-start lg:text-left lg:pb-24 lg:pl-16 lg:pr-10 xl:pl-[max(2rem,calc((100vw-1440px)/2+6rem))]">
            {/* Expo badge */}
            <div className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-presisso-red/25 bg-presisso-red/[0.07] px-4 py-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-presisso-red" />
              <span className="font-heading text-[11px] font-bold uppercase tracking-[0.15em] text-presisso-red">
                EXPOCON 2026 - Presisso
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-[2.6rem] font-extrabold leading-[1.06] tracking-tight text-presisso-black sm:text-[3.2rem] lg:text-[3.6rem] xl:text-[4rem]">
              Visualizá tu
              <br />
              cocina ideal
              <br />
              <span className="text-presisso-red">con Presisso</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-[20rem] text-[1.05rem] leading-[1.7] text-presisso-gray-mid sm:max-w-sm sm:text-lg">
              Sacá una foto, elegí el estilo y recibí el diseño de tu nueva
              cocina en minutos.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 lg:justify-start">
              <Link
                href="/nuevo"
                className="group inline-flex h-[52px] items-center gap-3 rounded-full bg-presisso-red px-9 font-heading text-[14px] font-bold uppercase tracking-widest text-white shadow-red-glow transition-all duration-300 hover:bg-presisso-red-hover hover:shadow-none active:scale-[0.97]"
              >
                Empezar ahora
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <span className="text-sm text-presisso-gray-mid">
                Sin registro · Sin costo
              </span>
            </div>

            {/* Trust chips */}
            <div className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
              {TRUST_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1.5 rounded-full border border-presisso-border bg-white px-3.5 py-1.5 text-xs font-medium text-presisso-gray-dark shadow-card"
                >
                  <span className="text-presisso-red text-[10px]">✦</span>
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Kitchen image (desktop side-by-side / mobile stacked below) */}
          <div className="relative h-72 lg:h-auto">
            <Image
              src="/header-cocina.jpg"
              fill
              className="object-cover object-left"
              alt="Cocina Presisso premium"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Left-edge gradient (desktop only — blend into cream bg) */}
            <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-presisso-cream via-transparent to-transparent lg:block" />

            {/* Floating AI card */}
            <div className="absolute bottom-3 right-3 z-10 animate-float rounded-xl bg-white/90 p-2.5 shadow-float backdrop-blur-sm sm:bottom-10 sm:right-8 sm:rounded-2xl sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-presisso-red sm:h-10 sm:w-10 sm:rounded-xl">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4 text-white sm:h-5 sm:w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-heading text-[11px] font-bold leading-tight text-presisso-black sm:text-[13px]">
                    Generado con IA
                  </p>
                  <p className="mt-0.5 hidden text-[11px] leading-tight text-presisso-gray-mid sm:block">
                    Diseño personalizado en minutos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────── */}
      <section className="bg-white px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          {/* Section header */}
          <div className="mb-14 text-center">
            <span className="font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-presisso-gray-mid">
              Cómo funciona
            </span>
            <h2 className="mt-3 font-heading text-[1.9rem] font-extrabold leading-tight tracking-tight text-presisso-black sm:text-4xl">
              Tres pasos,
              <span className="text-presisso-red"> tu diseño listo</span>
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-presisso-gray-mid">
              El proceso completo toma menos de 3 minutos. Sin apps, sin
              registro.
            </p>
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                className="group relative overflow-hidden rounded-3xl border border-presisso-border bg-presisso-cream p-8 transition-all duration-300 hover:-translate-y-1 hover:border-presisso-red/25 hover:shadow-warm-lg sm:p-9"
              >
                {/* Large step number (decorative) */}
                <span className="absolute right-6 top-4 select-none font-heading text-8xl font-black leading-none text-presisso-black/[0.04] transition-colors duration-300 group-hover:text-presisso-red/[0.06]">
                  {step.number}
                </span>

                {/* Icon */}
                <div className="relative z-10 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-presisso-red text-white shadow-red-glow transition-transform duration-300 group-hover:scale-110">
                  {step.icon}
                </div>

                {/* Paso label */}
                <span className="mb-1.5 block font-heading text-[10px] font-bold uppercase tracking-[0.18em] text-presisso-red">
                  Paso {step.number}
                </span>

                <h3 className="font-heading text-xl font-bold text-presisso-black sm:text-[1.3rem]">
                  {step.title}
                </h3>

                <p className="mt-2 text-[0.875rem] leading-relaxed text-presisso-gray-mid">
                  {step.desc}
                </p>

                {/* Connector arrow (hidden on last card) */}
                {i < 2 && (
                  <div className="mt-6 hidden items-center gap-1 sm:flex">
                    <div className="h-px flex-1 bg-presisso-border" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-14 text-center">
            <Link
              href="/nuevo"
              className="group inline-flex h-14 items-center gap-3 rounded-full bg-presisso-black px-10 font-heading text-[14px] font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-presisso-red hover:shadow-red-glow active:scale-[0.97]"
            >
              Probalo ahora, es gratis
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
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="bg-white">
        {/* Línea roja divisora */}
        <div className="h-[3px] w-full bg-presisso-red" />

        <div className="mx-auto max-w-7xl px-5 py-10">
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-between">
            {/* Logo + copyright */}
            <div className="flex flex-col items-center sm:items-start gap-3">
              <Image
                src="/logo-presisso.png"
                alt="Presisso"
                width={140}
                height={34}
                className="h-9 w-auto"
              />
              <p className="text-[11px] text-gray-400">
                &copy; {new Date().getFullYear()} Presisso Amoblamientos
              </p>
            </div>

            {/* Redes sociales */}
            <div className="flex flex-col items-center sm:items-start gap-2">
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Seguinos</p>
              <a href="https://www.instagram.com/presisso_amoblamientos/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-presisso-red hover:text-presisso-black transition-colors">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C16.67.014 16.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                @presisso_amoblamientos
              </a>
              <a href="https://www.facebook.com/presisso.muebles" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-presisso-red hover:text-presisso-black transition-colors">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                presisso.muebles
              </a>
              <a href="https://www.youtube.com/channel/UCvBNpHjIJxgNYJaaTXMEOrQ" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-presisso-red hover:text-presisso-black transition-colors">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                Presisso YouTube
              </a>
            </div>

            {/* Contacto */}
            <div className="flex flex-col items-center sm:items-start gap-2">
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Contacto</p>
              <a href="mailto:info@presisso.com.ar" className="flex items-center gap-2 text-sm font-semibold text-presisso-red hover:text-presisso-black transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
                info@presisso.com.ar
              </a>
              <a href="tel:08007773900" className="flex items-center gap-2 text-sm font-semibold text-presisso-red hover:text-presisso-black transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                0800-777 3900
              </a>
              <a href="tel:+5434834440000" className="flex items-center gap-2 text-sm font-semibold text-presisso-red hover:text-presisso-black transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                +54 3483 444 000
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
