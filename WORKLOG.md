# WORKLOG — Presisso Expo

Registro de trabajo. **ESTADO** se sobrescribe completo en cada cierre. **REGISTRO** es append: nunca se borra nada.
Decisiones, trampas, deuda y preguntas abiertas: `MEMORY.md`. Textos para terceros: `mensajes-pendientes.md`.

---

## ESTADO

| Campo | Valor |
|---|---|
| **Tarea actual** | Calidad de las imágenes generadas con IA (Renovar): arreglar la cocina "en obra", donde los 3 materiales con guía de color fallan. El diagnóstico ya está hecho (ver REGISTRO 2026-10-16 tarde). |
| **Status real** | En producción (PR #36): muestras oficiales + guía de color para Litio, Gris Grafito y Negro. Aprobado por Mateo en su cocina con isla. En la cocina en obra los 3 salen mal. Diagnóstico terminado: la falla principal es que el **render final inventa muebles** (alacenas, columnas) porque no recibe la foto original. El arreglo **no está hecho**. Registro (`WORKLOG.md`, `MEMORY.md`, `mensajes-pendientes.md`) en `main` desde el PR #37. |
| **Último chat** | 2026-10-16 (empezó 2026-10-08) |
| **Espera de Mateo** | OK para aplicar y probar el arreglo (gasta generaciones de imagen: pedir el número). Pendiente desde antes: correr las consultas SQL A–E (cifras de la expo) si las quiere en el video; compartir el brief con Épica. |
| **Espera de terceros** | Ninguna. (Épica: recibe el brief y el prompt del video cuando Mateo los comparta.) |
| **Próxima acción** | Aplicar el arreglo de OQ-004 (`MEMORY.md`) en una rama desde `main`: 1) pasar la foto original al render final (`buildRefinePrompt` + `callGemini` del paso 3 en `src/lib/gemini/generate.ts`) como referencia de estructura y prohibir agregar alacenas/columnas/tramos que no están; 2) que el control de calidad (`src/lib/gemini/verify.ts`) compare la cantidad de frentes antes y después (se puede reusar el conteo de `getQuads` de `color-guide.ts`) y que **nunca** se entregue un resultado que agregue muebles; 3) reforzar la limpieza para objetos grandes de obra (hormigonera, escombros). Probar con la cocina en obra (`originales/1776443551957-djbfq5bbeur.jpeg`) y con la de isla (`originales/1792158224506-1ika76b0cjg.jpg`) para no romper lo que ya anda. |
| **Qué no se toca** | Producción de datos (Supabase) sin preguntar. Nunca crear/modificar `.env.example`. La rama `diag/obra` NO se publica (tiene un hook de depuración). No mergear ni deployar sin OK de Mateo. |

**Ramas locales vivas:** `diag/obra` (1 commit `ba74844`, sin push; hook `debugSave` que guarda pasos intermedios si `GEMINI_DEBUG_DIR` está definida — sirve para volver a diagnosticar). La carpeta de trabajo quedó en esa rama: antes de seguir, `git switch main && git pull` (los archivos sin trackear `WORKLOG.md`, `MEMORY.md`, `mensajes-pendientes.md` del disco ya están en `main`; borrarlos o pisarlos al cambiar). `PROJECT-BRAIN.md` y `CLAUDE.md` siguen sin trackear a propósito.

---

## REGISTRO

### 2026-10-08 → 2026-10-16 — Brief del video, marca 2026, seguridad e imágenes de IA

**Pedido** (en orden, literal donde importa):
1. `/memorizar-proyecto`.
2. Material para guionar y grabar dos videos de motion (16:9 y 9:16) "para Nodo" → luego aclaró: el video es de **Épica**, el sistema se acredita a **Nodo**, la expo ya pasó y "anduvo bien", se graba en producción sin demo, la cocina de prueba es suya.
3. "armamre un docemtno con todo completo ordenado y prolijo" → brief publicado como artifact.
4. "ahora dame el /prompt" → prompt para el chat de producción del video.
5. Manual de marca Presisso 2026 en `Downloads\Manual Presisso 2026…`: "deberiamos actulizar los colores logos, etc del sistema" → "dale, usá Jost, aplicá la crema y el dorado como decís" → "Commit + PR + merge" + cambiar "menos de 3 minutos" por "en minutos".
6. "arreglá el test que fallaq" → "dale, commit PR y merge y luego cuando termines con todo arregla el brief y el prompt para enviarle".
7. Texto para explicarle el sistema a la agencia → "armamelo en un odf con un buen diseñrelamente hecho bien a medida con capturas del sistema etc" (PDF).
8. Imágenes de IA que "no esta respetando las reglas" → "dale, es el prompt principal, autorizo las pruebas" → varias rondas: "los materiales son cmpletmante distntos…", "dale, corregí los tres y probá Gloss y Scotch", "dale, probá la opción 1", "dale, probá solo con los primeros planos", "ok".
9. Revisión de seguridad pegada desde otro chat → "ok arrancá seguridad, sin Upstash" → borrar políticas del bucket en Supabase (lo hizo Mateo) → "ok push y merge seguridad".
10. "anda todo peero emperor MUCHISIMO los prompt…" (borró la isla en Litio) → "ok etapa 1, autorizo 60 generaciones" → "ok push y merge etapa 1".
11. Litio seguía gris → "ok push y merge litio" → link a presisso.com.ar Línea Siena → "probá corrección de color, autorizo 10 generaciones" + error de Gris Grafito (mesada) → "no me gusta lo de la corecion de color debe vbenri de la genreacion de imagen" → "estos estan eprfectos" (render final con guía) → "ok probá el flujo completo, autorizo 25 generaciones" → "los de la primer captura slalieron bien / la de la cocina de la segunda captura no" → **"publicá lo que hay y diagnosticá obra, autorizo 18 y /cerrar porque debo compactar"**.

**Hecho:**
- **Brain del proyecto** (`PROJECT-BRAIN.md`, raíz, sin trackear) reescrito como router; ancla en `CLAUDE.md` (raíz, sin trackear); puntero en la auto-memoria.
- **Brief de producción para Épica** publicado como artifact: https://claude.ai/artifact/FZisKtdkywaXFsjjhRVNjp (versión 3 "Versión para Épica"; privado, Mateo tiene que compartirlo). Incluye historia, números verificados, marca 2026, cómo se graban las capturas, pantallas y momentos, qué decir y qué no, créditos, prompt completo para el chat de producción y qué falta. Fuente local: `scratchpad\brief-video-presisso.html` (temporal).
- **Prompt del video** (para Claude Code + HyperFrames): dentro del brief, sección 09, y literal en `mensajes-pendientes.md`.
- **PDF "Presisso Expo — El sistema"** para la agencia: 10 páginas A4 con capturas reales del sistema (formulario, panel con datos de visitantes difuminados, PDF de ejemplo generado por el código real con datos ficticios). Archivo: `scratchpad\doc\Presisso-Expo-Sistema.pdf` (temporal; se le mandó a Mateo por el chat). Las capturas del panel se sacaron con un servidor local y una contraseña de prueba generada para esa sesión, no la de producción.
- **PR #30 — marca 2026** (merge 2026-10-09): paleta rojo `#8B0001`, crema `#EDE7E0` (fondo), dorado `#CB9F71` (detalles), negro `#161616`; Jost Medium/Light (no hay archivos de Futura Medium/Light); logo sin punto, isotipo "p" en círculo; PDF y email con colores y logo nuevos; el logo del email se sirve desde el sitio; landing "toma minutos"; se borra `src/lib/utils/colors.ts`. Incluyó el `vercel.json` con `regions: ["gru1"]` (ver MEMORY G-001).
- **PR #31 — test** (merge 2026-10-09): fixtures de `clientFormSchema` con `modo`; test nuevo "rejects missing modo".
- **PR #32 — prompts v1** (merge 2026-10-09): "Renovar" en 2 pasos (limpiar, cambiar material); prompt principal sin contradicciones; materiales descritos desde fotos; cobertura total del mueble; no agregar filas de alacenas; Scotch con primeros planos.
- **PR #33 — seguridad** (merge 2026-10-16): `/api/stats` con token admin; tope de 150 solicitudes/24 h (`MAX_SOLICITUDES_24H`); anti-SSRF de `foto_original`; extensión desde el MIME; comparación en tiempo constante (`safeEqual`) + 800 ms por login fallido; SQL del repo alineado con producción (`sql/007`, bucket `cocinas` sin políticas abiertas). En Supabase Mateo borró "Allow anon read from cocinas" (dejaba listar 56 fotos de visitantes, 37 PDFs, 133 imágenes con la clave pública) y "Allow anon upload to cocinas".
- **PR #34 — etapa 1** (merge 2026-10-16): modelos estables `gemini-3-pro-image` (+ respaldo `gemini-nano-banana-2.1`); la limpieza nunca borra islas; el paso 2 recibe la foto original; control de calidad automático (`verify.ts`) con un reintento.
- **PR #35 — Litio** (merge 2026-10-16): más referencias de Litio, rótulo de referencias, el control de calidad ve las referencias y falla si se agregan objetos.
- **PR #36 — muestras oficiales + guía de color** (merge 2026-10-16 15:43 UTC): muestras de presisso.com.ar/productos/materiales en `public/materiales-oficiales/`; Litio = "Metálicos: Litio" (champagne cálido claro); Grafito = frente pizarra + mesada Cuarzo Gris Cemento; `color-guide.ts` (boceto interno + render final) para Litio, Grafito y Negro; reintento que no tira el primer resultado ante un 503; si el render con guía rompe la estructura y la imagen sin guía pasa el control, se entrega la sin guía.

**Archivos** (todos bajo `C:\Users\mateo\Desktop\presisso-expo\`):
- PR #30: `public/logo-p-presisso.jpg`, `public/logo-p-presisso.png`, `public/logo-presisso-blanco.png` (nuevo), `public/logo-presisso.png`, `src/app/admin/[id]/page.tsx` (sombra rgba), `src/app/favicon.ico`, `src/app/global-error.tsx` (hex), `src/app/globals.css` (vars, Jost, pesos), `src/app/gracias/page.tsx` (ícono rojo), `src/app/icon.png`, `src/app/layout.tsx` (Jost 300–500, OG 772×772), `src/app/nuevo/page.tsx`, `src/app/page.tsx` (props de logo, dorado, copy "toma minutos"), `src/components/cliente/{ClientForm,KitchenTypeSelector,ModeSelector,PhotoUpload,StepIndicator}.tsx` (sombras), `src/lib/email/sender.ts` (colores, logo desde el sitio), `src/lib/pdf/generator.ts` (colores, fallback "presisso"), `src/lib/utils/colors.ts` (borrado), `tailwind.config.ts` (tokens, fontWeight 500), `vercel.json` (`regions: ["gru1"]`).
- PR #31: `src/__tests__/validations.test.ts`.
- PR #32: `src/lib/gemini/generate.ts`, `src/lib/gemini/prompts-diseno.ts`, `src/lib/gemini/prompts-rediseno.ts`.
- PR #33: `src/lib/security.ts` (nuevo: `safeEqual`, `isOwnOriginalPhotoUrl`, `dailyCapReached`), `src/__tests__/security.test.ts` (nuevo), `src/app/api/admin/auth/route.ts`, `src/app/api/generar-imagen/route.ts`, `src/app/api/solicitudes/route.ts`, `src/app/api/stats/route.ts`, `src/app/api/upload/route.ts`, `src/lib/gemini/generate.ts` (descarga validada, sin redirecciones), `sql/007-add-polimero-blanco-gloss.sql` (nuevo, documental), `supabase/migrations/001_initial_schema.sql` (bucket `cocinas`, sin políticas anon).
- PR #34: `src/lib/gemini/client.ts`, `src/lib/gemini/generate.ts`, `src/lib/gemini/prompts-rediseno.ts`, `src/lib/gemini/verify.ts` (nuevo).
- PR #35: `src/lib/gemini/generate.ts`, `src/lib/gemini/prompts-rediseno.ts`, `src/lib/gemini/verify.ts`.
- PR #36: `public/materiales-oficiales/*.jpg` (7 muestras), `public/melamina-litio/linea-siena-presisso.jpg`, `src/lib/gemini/client.ts` (`QC_MODELS`, `SEG_MODELS`), `src/lib/gemini/color-guide.ts` (nuevo), `src/lib/gemini/generate.ts`, `src/lib/gemini/prompts-rediseno.ts` (`colorGuide`, `buildRefinePrompt`).
- Rama `diag/obra` (sin push): `src/lib/gemini/generate.ts` (`debugSave` con `GEMINI_DEBUG_DIR`). Sin trackear: `src/__tests__/tmp-diag.test.ts`.
- Fuera de git: `PROJECT-BRAIN.md`, `CLAUDE.md` (actualizados), `WORKLOG.md`, `MEMORY.md`, `mensajes-pendientes.md` (nuevos).

**Verificado:**
- Marca: capturas locales a 375, 1440 y 1920 (landing, `/nuevo`, `/gracias`, login admin) y PDF de muestra; producción sirve el logo nuevo (471×120) y Jost. El panel con datos y el email **sin verificar** visualmente.
- Seguridad en producción con pedidos que no escriben: stats sin token → 401; solicitud con URL ajena → 400; login incorrecto → 401 en ~1,1 s; generar sin secreto → 401; landing 200. Con la clave pública, listar `cocinas` → 0 archivos; fotos, imágenes, logo, PDF directo y `/p/` → 200. **Sin verificar:** una solicitud real de punta a punta tras los cambios (Mateo regeneró después y "anda todo").
- Imágenes: pruebas con la cocina de Mateo (isla) y la cocina en obra de junio (`originales/1776443551957-djbfq5bbeur.jpeg`). Con el flujo completo integrado: isla → Litio y Negro OK (aprobado por Mateo); obra → los 3 mal (rechazado por Mateo). Isla + Grafito en el flujo integrado **no completó** (503 en el reintento; arreglado después en código, sin re-probar).
- Generaciones de imagen usadas: 20 (prompts v1) + ~54 (etapa 1, de 60) + 8 (de 10) + **27 (de 25 autorizadas: me pasé 2)** + diagnóstico obra en curso (≤ 18).

**Resuelto en el camino:**
- `pnpm` 12 global no lee el lockfile v6 y vació `node_modules` → reinstalado con `npx pnpm@8.15.9 install --frozen-lockfile`.
- Deploy fallaba con `upgrade_required`: el equipo de Vercel pasó a Hobby y el proyecto tenía 2 regiones → `vercel.json` con `regions: ["gru1"]`.
- El optimizador de imágenes de Next en local tenía en caché el logo viejo (solo en capturas; producción OK).
- El paso de limpieza borró una isla con cosas encima: la lista nombraba "the island" entre lugares a limpiar.
- Litio salía gris: el color se midió en una zona en sombra de la foto, y las reglas de aplicación seguían diciendo "light gray". La muestra oficial es champagne cálido.
- `sharp` devuelve 3 canales al desenfocar un raw de 1 canal → franjas en el boceto; se agregó `extractChannel(0)`.
- `gemini-2.5-flash` ya no existe para claves nuevas (era el respaldo del control de calidad).
- Un 503 en el reintento tiraba el primer resultado válido.

**Gates** (último estado, rama `fix/litio-blanco` antes del merge de #36): `npx tsc --noEmit` OK; `npx vitest run` 34/34; `npx next lint` sin errores (1 warning previo: fuente custom en `layout.tsx`). `next build` local OK en el PR #30; en Vercel, preview y producción "success" en #30–#36.

**Sigue:** ver ESTADO → Próxima acción.

### 2026-10-16 (tarde) — Publicación de la guía de color, registro y diagnóstico de la cocina en obra

**Pedido:** "publicá lo que hay y diagnosticá obra, autorizo 18 y /cerrar porque debo compactar" → "commiteá el registro" → "ok push y merge registro" → "anotá el diagnóstico en el registro".

**Hecho:**
- PR #36 (guía de color + muestras oficiales) mergeado y en producción.
- Registro creado (`WORKLOG.md`, `MEMORY.md`, `mensajes-pendientes.md`) y mergeado en `main` con el PR #37. Se commiteó desde un worktree aparte para no cambiar la rama mientras corría el diagnóstico; el worktree se borró después.
- Diagnóstico de la cocina en obra (`originales/1776443551957-djbfq5bbeur.jpeg`) con la rama `diag/obra`: Negro, Litio y Gris Grafito, guardando cada paso. **18 generaciones** (las 18 autorizadas): los 3 casos hicieron reintento (2 intentos × 3 pasos).

**Resultado del diagnóstico, paso por paso** (imágenes en la carpeta temporal `scratchpad\diag-obra\<material>\`, `sheet-<material>.jpg`; pueden no existir en otra sesión):
- **Paso 1, limpieza:** bien en 5 de 6 intentos. En el segundo intento de Gris Grafito **dejó la hormigonera** y el paso 2 la conservó.
- **Paso 2, cambio de material:** colores bien en los 3 (Negro negro mate, Litio champagne, Grafito pizarra con mesada cemento). En Litio y en Gris Grafito agregó un **retorno en L** de mesada y bajos sobre la pared derecha, que no existe.
- **Paso 3, boceto:** sigue bien al resultado del paso 2 (incluido el retorno en L cuando está).
- **Paso 4, render final:** en los 3 materiales **inventó muebles**: alacenas en Negro y Litio, una columna alta en Gris Grafito. Recibe solo el boceto y las muestras, no la foto original, y en una pared vacía "completa" la cocina.
- **Qué se entregó:** Negro y Litio, la imagen **sin guía** del segundo intento. El control de calidad rechazó el render y el respaldo de "imagen sin guía" funcionó: sin muebles inventados, pero el control igual marcó en Negro "gris oscuro en lugar de negro mate". Gris Grafito entregó el **render con la columna inventada**, porque los dos intentos tenían problemas y quedó el de menos.

**Archivos:** `WORKLOG.md` (ESTADO reescrito, esta entrada), `MEMORY.md` (G-010..G-012, OQ-004). Rama `diag/obra`: `src/lib/gemini/generate.ts` (`debugSave`, sin push). Borrado: `src/__tests__/tmp-diag.test.ts`.

**Verificado:** el diagnóstico se revisó mirando cada paso intermedio. El arreglo **no está hecho ni probado**.

**Gates:** no se tocó código publicable en esta entrada. La rama `diag/obra` pasa `tsc`.

**Sigue:** ESTADO → Próxima acción (arreglo de OQ-004).
