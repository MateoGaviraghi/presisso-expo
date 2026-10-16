# MEMORY — Presisso Expo

Decisiones (`D-NNN`), trampas (`G-NNN`), deuda técnica (`TD-NNN`) y preguntas abiertas (`OQ-NNN`).
Append: no se edita lo viejo. Si una decisión reemplaza a otra, se escribe "reemplaza D-0NN".
Empieza el 2026-10-16. Lo anterior a esa fecha no tiene registro (los `docs/` son planes previos a la construcción).

---

## Decisiones

**D-001 — Marca Presisso 2026 aplicada al sistema (2026-10-09).** Fuente: manual de marca 2026 (PDF y PNG entregados por Mateo, fuera del repo). Rojo `#8B0001`, crema `#EDE7E0` como fondo general, dorado `#CB9F71` solo en detalles finos, negro `#161616`, logo sin punto, isotipo "p" en círculo. Tipografía: **Jost** Medium/Light reemplazando a Futura (no hay archivos de Futura Medium/Light con licencia en el repo). Los pesos `font-bold/extrabold/black/semibold` de Tailwind se remapean a 500. El PDF sigue usando `public/fonts/Futura-Bold.otf`. Se reabriría si Presisso entrega los archivos de Futura.

**D-002 — Créditos del video (2026-10-09).** Producción: Épica. Sistema creado por: **Nodo**, aunque lo construyó Mateo. Cliente: Presisso. Se graba en producción con solicitudes propias, sin proyecto de demo.

**D-003 — Seguridad de la API sin límite por IP (2026-10-16).** Mateo eligió "sin Upstash". Freno de costo: tope de 150 solicitudes cada 24 h en `src/lib/security.ts` (`MAX_SOLICITUDES_24H`). Se descartó un límite en memoria porque no funciona en serverless (cada instancia tiene su propio contador). Se reabriría con abuso real o si se conecta Upstash (variables `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` o `KV_REST_API_URL`/`KV_REST_API_TOKEN`).

**D-004 — Bucket `cocinas` sin políticas para anon (2026-10-16).** Mateo borró en Supabase "Allow anon read from cocinas" y "Allow anon upload to cocinas". Los links públicos siguen funcionando porque el bucket es público. Las subidas y los borrados los hace el servidor con la service role.

**D-005 — Imágenes de IA: las muestras oficiales mandan (2026-10-16).** La autoridad de color y textura de cada material son las muestras de presisso.com.ar/productos/materiales, guardadas en `public/materiales-oficiales/`. Van primero entre las referencias y no se usan hex medidos en fotos de ambientes. Litio = "Metálicos: Litio", champagne cálido claro. Gris Grafito = frente Politex Grafito (pizarra) + mesada Cuarzo Gris Cemento.

**D-006 — Guía de color con render final de la IA (2026-10-16), reemplaza la propuesta de corrección de color directa.** Mateo rechazó entregar una imagen retocada: "debe venir de la generación de imagen". El retoque queda como **boceto interno**: un modelo de texto marca las esquinas de frentes y mesadas, se pinta el color de la muestra y el modelo de imagen genera la foto final a partir de ese boceto (`src/lib/gemini/color-guide.ts`). El boceto nunca llega al cliente. Solo aplica a materiales de un tono con muestra (Litio, Grafito, Negro). Gloss (sin muestra oficial, es polímero) y Scotch (dos tonos) siguen con el flujo de 2 pasos. Mateo lo aprobó en su cocina con isla. En cocinas en obra falla (ver OQ-002).

**D-007 — Modelos de imagen estables (2026-10-16).** Principal `gemini-3-pro-image`, respaldo `gemini-nano-banana-2.1`. Los `-preview` están dados de baja por Google. En la prueba comparativa, nano-banana-2.1 dejó huecos sin frente y un Litio azulado, por eso queda como respaldo.

**D-008 — Control de calidad automático (2026-10-16).** `src/lib/gemini/verify.ts` (modelos de texto `QC_MODELS`) compara original contra resultado: islas, electrodomésticos, filas de alacenas, ambiente, material, color contra referencias y objetos agregados. Si falla, regenera una vez, solo si van menos de 130 s, y se queda con el intento con menos problemas. El veredicto queda en `solicitudes.prompt_usado` (`[QC ok]` / `[QC con problemas: …]`).

---

## Gotchas

**G-001 — Vercel en plan Hobby: una sola región.** El proyecto tenía `iad1` + `gru1` y los deploys fallaban con `upgrade_required` en el paso `patchBuild`. `vercel.json` fija `regions: ["gru1"]`, al lado de Supabase `sa-east-1`. Un cron de Vercel con frecuencia menor a diaria también rompe el deploy en Hobby.

**G-002 — `pnpm` 12 global vacía `node_modules`.** No lee el lockfile v6 del repo. Instalar con `npx pnpm@8.15.9 install --frozen-lockfile`. Para el servidor de desarrollo usar `node node_modules/next/dist/bin/next dev`.

**G-003 — El modelo de imagen hereda la superficie original.** No reemplaza el material: pinta encima de las puertas del cliente y conserva su brillo, sus reflejos (por ejemplo, el de la lámpara) y sus vetas. Por eso existe D-006.

**G-004 — Las fotos de cocina completa enseñan distribución.** Gemini copia la cantidad de filas de alacenas y los muebles de las referencias aunque el texto lo prohíba. Para Scotch se usan solo primeros planos.

**G-005 — Reglas contradictorias = no cambia nada.** Si dos reglas del prompt chocan (por ejemplo, una regla global de tiradores contra la del material, o "dejá todo igual" contra "limpiá"), el modelo resuelve no tocar nada. Los tiradores viven solo en el campo `handles` de cada material.

**G-006 — `sharp`: desenfocar un raw de 1 canal devuelve 3 canales.** Siempre `.extractChannel(0)` antes de `.raw()`, si no el boceto sale con franjas.

**G-007 — `gemini-2.5-flash` no existe para claves nuevas (404).** Los modelos de texto disponibles incluyen `gemini-3.5-flash` y `gemini-3.8-flash`.

**G-008 — El control de calidad es permisivo con el color.** Aprobó Litio gris plateado y la mesada de granito frío de Grafito. Ver OQ-003.

**G-009 — Optimizador de imágenes de Next en local.** Guarda en caché versiones viejas de `/logo-presisso.png`. En producción cada deploy tiene su propia caché.

---

## Deuda técnica

**TD-001 — Gloss y Scotch sin guía de color.** Gloss no tiene muestra oficial y Scotch es de dos tonos (grafito + nogal), lo que necesita distinguir alacenas de bajos en las máscaras. Se paga en la próxima unidad de trabajo de imágenes.

**TD-002 — "Diseñar desde cero" sin control de calidad ni guía de color, y sin probar** con los cambios del 2026-10-16.

**TD-003 — Tiempo y costo por solicitud con guía de color:** 3 generaciones (6 con reintento) y entre 100 y 215 s, cerca del límite de 300 s de `generar-imagen`.

**TD-004 — Rama `diag/obra` y `src/__tests__/tmp-diag.test.ts`.** Herramienta de diagnóstico local que no se publica. Borrar al cerrar el diagnóstico de la cocina en obra.

---

## Preguntas abiertas

**OQ-001 — Cifras de la expo para el video.** Hay que correr las consultas A–E (están en este chat y en versiones viejas del brief) en el SQL Editor de Supabase. Decide Mateo.

**OQ-002 — Cocinas en obra / con poca estructura.** Con la guía de color: Litio sale como acero, la mesada de Grafito sale granito frío y Negro inventa muebles. El diagnóstico con pasos intermedios quedó corriendo el 2026-10-16. Falta decidir el arreglo.

**OQ-003 — Endurecer el control de calidad:** que compare la mesada contra su propia muestra y que penalice un acabado metálico excesivo.
