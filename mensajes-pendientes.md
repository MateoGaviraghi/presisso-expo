# Mensajes pendientes — Presisso Expo

Textos para terceros redactados en los chats, literales y en su última versión.
Estado: **sin enviar** / **enviado AAAA-MM-DD**. Los enviados se marcan, no se borran.

---

## 1. Brief de producción del video

- **Destinatario:** Épica (producción del video).
- **Para qué:** todo lo necesario para guionar y editar los dos videos (16:9 y 9:16): historia, números verificados, marca 2026, capturas, pantallas, qué decir y qué no, créditos y prompt.
- **Dónde está:** artifact privado https://claude.ai/artifact/FZisKtdkywaXFsjjhRVNjp (versión 3, "Versión para Épica"). Para que Épica lo pueda abrir, Mateo lo tiene que compartir desde el menú Share.
- **Ojo:** la sección de marca no describe el color de Litio. Desde el 2026-10-16, Litio es champagne cálido claro, según la muestra oficial.
- **Estado:** sin enviar.

---

## 2. Prompt para el chat de producción del video

- **Destinatario:** el chat de Claude Code que use Épica para armar los videos (va junto con el brief, las capturas y los logos `public/logo-presisso.png`, `public/logo-presisso-blanco.png`, `public/logo-p-presisso.png`).
- **Para qué:** que arme los dos videos con HyperFrames sin inventar pantallas ni cifras.
- **Estado:** sin enviar.

```
<rol>
Sos director de motion y editor de videos de producto. Hacés demos de software que muestran el resultado antes que la interfaz, con ritmo rápido y texto en pantalla legible sin sonido. Trabajás con HyperFrames: arrancá por la skill /hyperframes, que te lleva al flujo que corresponde.
</rol>

<contexto>
- Sistema: Presisso Expo, una app para el stand de Presisso (amoblamientos de cocina) en EXPOCON 2026. El visitante saca una foto de su cocina, elige un material y un modo, y la IA de Google (Gemini) genera cómo quedaría con muebles Presisso. Un operador revisa la imagen en un panel, la aprueba y le manda al visitante un PDF con la marca por email y un link corto por WhatsApp.
- Sitio en producción: presisso-expo.vercel.app
- Créditos: sistema creado por NODO, video producido por ÉPICA, cliente PRESISSO.
- Objetivo: promocionar el sistema y contar la experiencia. La expo ya pasó y anduvo bien.
- Fuente de verdad: el brief de producción que viene con este prompt (pegado abajo o adjunto). Leelo entero antes de escribir nada: tiene la historia, los números verificados, la marca, las pantallas con duraciones, qué tapar en cada toma y qué se puede decir y qué no. Si algo de este prompt choca con el brief, gana el brief.
- Material visual: SOLO las capturas y grabaciones de pantalla REALES que pasa Nodo, más los logos. Las imágenes generadas también son reales.
- Marca Presisso (manual 2026): logo "presisso" SIN punto (rojo sobre claro, blanco sobre rojo o negro); isotipo "p" en círculo rojo. Colores: rojo #8B0001, crema #EDE7E0, dorado #CB9F71 (solo detalles finos), negro #161616, blanco. Tipografía Futura Medium para títulos y Light para textos (si no está, Jost 500 y 300). Nunca el rojo viejo #DF0A0A ni el logo con punto.
</contexto>

<tarea>
Hacé dos videos:
1. HORIZONTAL 16:9, 60 a 75 s, para web y LinkedIn. Recorrido completo: visitante → IA → operador → cliente.
2. VERTICAL 9:16, 25 a 35 s, para Reels, TikTok y Shorts. Más corto y más rápido, centrado en los momentos fuertes.

El vertical se arma con su propio encuadre: zoom al panel que importa y la acción en el centro, lejos de las zonas de arriba y abajo que tapa la interfaz de cada red. No es un recorte del horizontal.

Arco para los dos:
- GANCHO (1–3 s): resultado primero. Antes y Después de una cocina real.
- CONTEXTO: un stand en una expo, el visitante saca una foto.
- FLUJO: 5 pasos del visitante → la IA genera en segundo plano → el panel la recibe en vivo → el operador aprueba.
- MOMENTOS FUERTES (no pueden faltar): el Antes y Después lado a lado; la imagen generada a pantalla completa; el link corto abriendo el PDF con la marca en un celular.
- CIERRE: "Sistema creado por Nodo" y el logo de Épica. Presisso aparece como cliente.
</tarea>

<proceso>
Paso 1. Leé el brief completo y revisá las capturas. Listá qué toma del brief (sección "Pantallas y momentos") cubre cada archivo y cuál falta.
Paso 2. Proponé, para cada formato, una tabla: segundo | captura (archivo) | movimiento o animación | texto en pantalla | nota. Agregá el texto completo en pantalla y la música o el ritmo sugerido. PARÁ y esperá el GO.
Paso 3. Con el GO, armá las composiciones en HyperFrames, renderizá los dos videos y mirá vos mismo cada render antes de mostrarlo.
Paso 4. Entregá los dos archivos y una lista de lo que no pudiste resolver.
</proceso>

<restricciones>
- No recrees, no redibujes y no inventes ninguna pantalla. Sobre las capturas reales solo se permite: zoom, recorte, máscara, desenfoque, resaltado, cursor y texto encima.
- Tapá o desenfocá: la barra de direcciones en /gracias (lleva nombre y email); el campo de contraseña del admin; el remitente del mail; cualquier fila de visitante real en el dashboard.
- Cifras: solo las del brief marcadas como verificadas (5 materiales, 2 modos, 5 pasos, unas 4,5 semanas de construcción). Ninguna cifra de visitantes, solicitudes ni tiempos hasta que la pase Nodo.
- Prohibido decir o sugerir: que el mail o el WhatsApp salen solos (los envía el operador); "en 3 minutos", "al instante" o cualquier tiempo concreto; que el PDF trae el antes y el después; "presupuesto", "cotización" o "medidas exactas"; "cualquier material del catálogo" (son 5); Imagen 4, DALL·E o Resend.
- Sí se puede decir: IA de Google, materiales reales de Presisso, el visitante no espera, un operador revisa cada imagen antes de enviarla, "el proceso completo toma minutos", la expo anduvo bien.
- Ninguna contraseña, clave ni dato personal en el video ni en el chat.
- Textos en español rioplatense, cortos (en vertical, cada placa con menos de 12 palabras) y legibles sin sonido.
</restricciones>

<formato_respuesta>
Primera respuesta: solo el Paso 1 y el Paso 2, con las tablas. Sin preámbulo. Lo que te falte, en una lista numerada al final.
</formato_respuesta>
```

---

## 3. Texto para explicarle el sistema a la agencia

- **Destinatario:** Épica.
- **Para qué:** explicar qué se hizo y cómo funciona por dentro, para quien no es técnico. Hay una versión diseñada en PDF de 10 páginas con capturas reales ("Presisso Expo — El sistema"), que se le mandó a Mateo por el chat el 2026-10-16. El archivo vivía en una carpeta temporal.
- **Desactualizado desde el 2026-10-16:** la sección 4 describe 2 pasos de IA. Hoy, para Litio, Grafito y Negro, hay además un control de calidad automático y un render final guiado por las muestras oficiales de color. Conviene sumarlo antes de enviar.
- **Estado:** sin enviar.

```
## Presisso Expo: qué hicimos y cómo funciona

### 1. Para qué lo hicimos
Para el stand de Presisso en EXPOCON 2026 queríamos que el visitante no se fuera solo con un folleto. La idea era que viera su propia cocina con muebles Presisso en pocos minutos, desde su celular, y que se la llevara en un PDF con la marca.

Eso resolvía tres cosas:
- Para el visitante: deja de imaginar cómo quedaría y lo ve sobre la foto de su propia cocina.
- Para Presisso: cada persona que usa el sistema deja nombre, email y, si quiere, WhatsApp. Es un contacto calificado de alguien que ya está pensando en renovar la cocina.
- Para el equipo del stand: un panel desde donde controlan cada diseño antes de mandarlo. Nada sale sin que una persona lo revise.

### 2. De qué se compone
Es un sistema web con tres partes:
1. La página pública, que usa el visitante desde el celular.
2. El panel de administración, que usa el equipo del stand.
3. Lo que recibe el cliente: un PDF con su diseño, por email y por un link de WhatsApp.

### 3. La página pública
La portada presenta la propuesta: "Visualizá tu cocina ideal con Presisso". Abajo explica en tres pasos cómo funciona: sacá una foto, elegí tu material, recibí tu diseño. Todos los botones llevan al mismo lugar, el formulario guiado.

El formulario guiado tiene 5 pasos, uno por pantalla, con una barra de progreso arriba:
1. Qué querés hacer: "Renovar mi cocina", para quien ya tiene muebles y quiere cambiarlos, o "Diseñar desde cero", para quien tiene el espacio vacío.
2. Foto: el visitante saca o sube una foto de su cocina actual.
3. Material: elige uno de los 5 materiales reales de Presisso. Cada tarjeta muestra una foto real de ese material instalado: Politex Negro, Polímero táctil White Gloss, Politex Gris Grafito, Melamina Litio y Melamina Grafito Scotch.
4. Datos: nombre, email, WhatsApp (opcional) y si quiere recibir el PDF.
5. Confirmar: un resumen con todo lo que eligió y el botón "Enviar solicitud".

Al enviar ve una pantalla de agradecimiento con su nombre que le avisa que su cocina se está generando con IA. No tiene que esperar en la pantalla: puede seguir recorriendo el stand.

### 4. Qué pasa por detrás
Esta es la parte más técnica, explicada simple:
- La foto se guarda en un almacenamiento en la nube y se crea una "solicitud" con los datos del visitante.
- La inteligencia artificial de Google (Gemini) genera el diseño en segundo plano, en dos pasos:
  1. Limpia la foto: saca todo lo suelto (botellas, cafetera, ollas, imanes de la heladera, tachos) para que la cocina se vea como en una revista.
  2. Cambia los muebles: reemplaza puertas, cajones, laterales y mesada por el material elegido. Para hacerlo, la IA recibe fotos reales de cocinas Presisso con ese material, y copia de ellas el color, el brillo, la textura y los tiradores. Las paredes, el piso, los electrodomésticos y el encuadre de la foto original no se tocan.
- Si un modelo de IA está saturado, el sistema pasa solo a un modelo de respaldo.
- Todo se actualiza en tiempo real: apenas la imagen está lista, aparece en el panel del equipo sin recargar la página.

### 5. El panel de administración
Se entra con contraseña. Tiene dos pantallas.

El tablero general muestra:
- Contadores en vivo: solicitudes totales y de hoy, cuántas se están generando, cuántas esperan revisión y cuántas tuvieron error.
- Una lista de todas las solicitudes con nombre, WhatsApp, si dejó email, material, modo, estado y fecha.
- Filtros por estado: Todos, Generando, En Revisión, Aprobada.

El detalle de cada solicitud muestra:
- El Antes y Después lado a lado: la foto original y el diseño generado, cada uno ampliable a pantalla completa, con el tiempo que tardó la IA.
- Las acciones del operador:
  - Aprobar Imagen, si el resultado está bien.
  - Regenerar Imagen, si no convence; la IA hace una versión nueva.
  - Reintentar, si hubo un error.
  - Generar PDF, con vista previa dentro del panel.
  - Enviar Email, que le manda al cliente el mail con su diseño y el PDF.
  - Enviar por WhatsApp, que abre WhatsApp con un mensaje ya escrito y el link corto al PDF. El operador lo revisa y lo envía.
  - Notas internas y Eliminar solicitud.
- Los estados: cada solicitud pasa por Generando IA → En revisión → Aprobada → Enviada, o Error si algo falló. El equipo siempre sabe en qué punto está cada una.

Cada acción del panel queda registrada (quién hizo qué y cuándo).

### 6. Lo que recibe el cliente
- Un PDF con la marca Presisso: su cocina rediseñada, el material elegido, su nombre, un aviso de que la imagen es ilustrativa y generada con IA, y los datos de contacto de Presisso.
- Un email con el asunto "{Nombre}, tu diseño Presisso {material} está listo", la imagen y un botón para descargar el PDF.
- Un link corto con la forma presisso-expo.vercel.app/p/Nombre-Presisso-código, pensado para WhatsApp: se abre directo en el celular y descarga el PDF con un nombre prolijo.

### 7. Con qué está hecho (para el que pregunte)
- Sitio y panel: una sola aplicación web moderna (Next.js), publicada en Vercel.
- Base de datos, fotos y actualizaciones en vivo: Supabase.
- Inteligencia artificial: Gemini, de Google, con dos modelos de generación de imágenes: uno principal y uno de respaldo.
- PDF y emails: se generan en el servidor del sistema.
- Marca: el sitio, el PDF y el email ya tienen el manual de marca Presisso 2026.
```
