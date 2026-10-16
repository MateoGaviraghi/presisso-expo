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

---

### Agregado 2026-10-16 (tarde) — diagnóstico de la cocina en obra

**G-010 — El render final con guía inventa muebles en espacios vacíos.** Solo recibe el boceto y las muestras, no la foto original, y en paredes vacías agrega alacenas o columnas. Pasó en Negro, Litio y Gris Grafito sobre la cocina en obra. En la cocina con isla (alacenas ya existentes) no pasó.

**G-011 — El paso de cambio de material puede agregar un retorno en L.** En la cocina en obra confundió la pared derecha con un tramo de mesada y agregó bajos ahí (Litio y Gris Grafito). El boceto y el render heredan ese error.

**G-012 — La limpieza puede dejar objetos grandes de obra** (una hormigonera en un intento). La lista `LOOSE_OBJECTS` no nombra materiales ni máquinas de obra.

**OQ-004 — Arreglo propuesto para cocinas en obra (no aplicado, espera OK de Mateo y presupuesto de generaciones):**
1. Pasar la foto original al render final como referencia de estructura, con la regla explícita de no agregar alacenas, columnas ni tramos que no estén.
2. Que el control de calidad compare la cantidad de frentes antes y después (reusar `getQuads` de `color-guide.ts`) y que nunca se entregue un resultado con muebles agregados. Si todo falla, entregar el que no agrega muebles aunque el color sea peor.
3. Sumar a la limpieza los objetos de obra (hormigoneras, bolsas de material, escombros, herramientas grandes).
4. Probar con la cocina en obra y con la de isla.

### Agregado 2026-10-16 (noche) — arreglo de la cocina en obra

**D-009 — OQ-004 aplicado, con la foto limpia como referencia (2026-10-16).** El render final recibe la foto ya limpia, no la original, como referencia de estructura. El control mide muebles agregados con máscaras de `getQuads` (límite 2 % de la foto) y un resultado que agrega muebles nunca gana a uno que no, aunque tenga peor color. Se descartó contar frentes: en una obra los muebles sin puertas pasan a tener puertas y el conteo sube sin que haya muebles nuevos. Se reabriría si el marcado da falsos positivos (resultados buenos rechazados).

**G-013 — Si el render final ve la foto original, copia su desorden.** Con la original como referencia volvió a poner imanes, objetos sobre la heladera y el tacho. Por eso recibe la foto limpia.

**G-014 — vitest no muestra los `console.log` del pipeline** en las pruebas reales con `--env-file`. Para medir, guardar los valores en archivos desde el test.

**OQ-005 — Litio metálico en cocinas en obra.** Con el arreglo de estructura, Litio en la cocina en obra salió una vez champagne y otra como acero (render con guía y también sin guía). Va con OQ-003. Decide Mateo cuántas generaciones.

OQ-004: resuelta por D-009. TD-004: el test temporal ya no existe; la rama `diag/obra` sigue local.

### Agregado 2026-10-16 (noche, 2) — Litio sin acero

**D-010 — Render final con la imagen del paso 2 como estructura; reemplaza la parte de D-009 que decía "foto limpia" (2026-10-16).** La original copiaba el desorden (G-013) y la limpia copiaba la mesada vieja (G-016). La del paso 2 ya tiene el material nuevo y es la base del boceto. Límite de muebles agregados: 5 % (antes 2 %). Reintento solo si van < 120 s.

**G-015 — "Litio acero" es acabado, no color.** El tono medido es el mismo; cambian los brillos y franjas. El nombre de familia "Metálicos" y "pearly sheen" en el texto lo empujaban. Un chequeo numérico de color no lo detecta; lo detecta el control por texto (regla 6b).

**G-016 — Si el render final ve la foto limpia, copia la mesada vieja** (mesada negra en la isla).

**G-017 — El chequeo por área no distingue un retorno en L** (2,5–2,9 %) de un resultado correcto (2,1–2,5 %). Solo detecta alacenas, columnas o reencuadres (6,5–19 %).

**TD-005 — Tiempo:** una solicitud con reintento llegó a 283 s (límite 300 s). Se bajó el corte del reintento a 120 s; sin medir con la versión final.

OQ-005: resuelta por G-015 + D-010 (en las pruebas). G-011 (retorno en L) sigue abierto.

### Agregado 2026-10-16 (noche, 3) — retorno en L

**D-011 — Inventario de estructura en texto contra muebles inventados (2026-10-16).** Antes de generar, un modelo de texto describe los muebles fijos de la original y ese inventario va a los prompts de los pasos 2 y 3; el control por texto marca `addedFurniture`, que pesa como "agrega muebles". Se eligió porque el chequeo por área no distingue un retorno en L (G-017). Se reabriría si el inventario se equivoca (por ejemplo, no ve una isla) y eso hace borrar muebles reales.

**G-018 — El control por texto puede inventar problemas** ("se agregó un microondas" cuando ya estaba). Un falso positivo empuja a la imagen sin guía o al reintento.

G-011: resuelto en las pruebas de la cocina en obra por D-011.

**G-019 — `WORKLOG.md` y `MEMORY.md` usan CRLF.** Un script que busca `"
---
"` no lo encuentra (`indexOf` = -1) y puede cortar el archivo. Normalizar a LF antes de buscar, validar los marcadores y volver a CRLF al escribir; revisar `git diff --numstat` antes de commitear.

