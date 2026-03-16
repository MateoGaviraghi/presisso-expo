# PRESISSO EXPO — Documentación Técnica Completa

> **Proyecto:** Sistema de Visualización de Cocinas con IA  
> **Versión:** 1.0  
> **Fecha:** Marzo 2026  
> **Stack:** Next.js 14 + Supabase + Gemini API (Imagen 4) + Tailwind CSS  

---

## Índice de Fases

| # | Fase | Archivo | Semana |
|---|------|---------|--------|
| 0 | **Skills y Roles Profesionales** | [`09-SKILLS.md`](./09-SKILLS.md) | **LEER PRIMERO** |
| 1 | Setup del Proyecto | [`01-FASE-SETUP.md`](./01-FASE-SETUP.md) | S1 — Días 1-2 |
| 2 | Frontend Cliente | [`02-FASE-FRONTEND.md`](./02-FASE-FRONTEND.md) | S1 — Días 2-5 |
| 3 | Backend y API | [`03-FASE-BACKEND.md`](./03-FASE-BACKEND.md) | S2 — Días 1-2 |
| 4 | Integración Gemini Imagen | [`04-FASE-GEMINI-API.md`](./04-FASE-GEMINI-API.md) | S2 — Días 2-5 |
| 5 | Panel Administrador | [`05-FASE-ADMIN-PANEL.md`](./05-FASE-ADMIN-PANEL.md) | S3 — Días 1-3 |
| 6 | PDF + WhatsApp + Email | [`06-FASE-PDF-ENVIO.md`](./06-FASE-PDF-ENVIO.md) | S3 — Días 3-5 |
| 7 | Testing y QA | [`07-FASE-TESTING.md`](./07-FASE-TESTING.md) | S4 — Días 1-3 |
| 8 | Deploy a Producción | [`08-FASE-DEPLOY.md`](./08-FASE-DEPLOY.md) | S4 — Días 3-5 |

---

## Paleta de colores oficial Presisso

```
PRINCIPALES:
  Rojo Presisso (logo):        #D42B2B
  Negro/Charcoal (fondos):     #1A1A1A
  Blanco:                      #FFFFFF
  Gris claro (fondo body):     #F5F5F3
  Gris medio (texto sec.):     #6B6B6B
  Gris oscuro (texto ppal.):   #333333

SECUNDARIOS:
  Rojo hover:                  #B82424
  Rojo suave (badges):         #FDF2F2
  Borde sutil:                 #E5E5E5
  Fondo surface:               #FAFAF9

MARCA EXTENDIDA:
  Prestone by Presisso → tipografía espaciada uppercase
  Bagno by Presisso   → sub-marca baños (script font)
```

---

## Requisitos previos del equipo

- Node.js >= 20.x
- npm >= 10.x o pnpm >= 9.x
- Git instalado
- Cuenta en Google AI Studio con API Key de Gemini
- Cuenta en Supabase (free tier)
- Cuenta en Vercel
- Cuenta en Twilio (WhatsApp Business API)
- Cuenta en Resend (email transaccional)
- Editor: VS Code recomendado con extensiones ESLint + Tailwind CSS IntelliSense
