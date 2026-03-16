# FASE 7 — Testing y QA

> **Duración:** Semana 4, Días 1-3  
> **Responsable:** Todo el equipo  
> **Entregable:** Sistema validado con tasa de error < 5%, listo para producción

---

## ⚙️ SKILLS REQUERIDAS — Leer antes de ejecutar

> **Documento de referencia:** [`09-SKILLS.md`](./09-SKILLS.md)  
> **⚠️ TODAS las skills activas:** Esta fase requiere el equipo completo.

| Skill                    | Rol       | Nivel                        |
| ------------------------ | --------- | ---------------------------- |
| Ingeniero de IA          | Principal | Evaluación de calidad IA     |
| Desarrollador Full Stack | Principal | Testing E2E + integraciones  |
| Líder Técnico            | Principal | Go/no-go decisions           |
| Ingeniero Industrial     | Principal | Flujo operativo + throughput |
| Diseñador Gráfico        | Soporte   | Validación visual PDF/email  |

### 📖 Skills del proyecto — LEER antes de ejecutar esta fase:

| Skill (archivo)                                                                                               | Propósito en esta fase                      |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [`.agents/skills/javascript-typescript-jest/SKILL.md`](../.agents/skills/javascript-typescript-jest/SKILL.md) | Testing con Jest, mocking, test structure   |
| [`.agents/skills/typescript-advanced-types/SKILL.md`](../.agents/skills/typescript-advanced-types/SKILL.md)   | Tipado de tests, mocks tipados              |
| [`.agents/skills/nextjs-react-typescript/SKILL.md`](../.agents/skills/nextjs-react-typescript/SKILL.md)       | Testing de API Routes y componentes Next.js |

### Prompt de contexto — COPIAR antes de iniciar esta fase:

```
Actuá como un equipo integrado por:
- Ingeniero de IA Senior que evalúa calidad de imágenes generadas con criterios
  objetivos (realismo, coherencia lumínica, fidelidad estructural).
- Líder Técnico Senior que define la matriz de testing, prioriza casos críticos
  y toma decisiones de go/no-go para la expo.
- Ingeniero Industrial que analiza el flujo operativo completo, identifica cuellos
  de botella, calcula throughput y optimiza el proceso de revisión.
- Desarrollador Full Stack Senior que ejecuta tests E2E, simula condiciones adversas
  (WiFi inestable, concurrencia) y valida integraciones.
- Diseñador Gráfico Senior que valida calidad visual del PDF, email y experiencia.

CONTEXTO: Faltan días para la expo. Testing exhaustivo pero eficiente.
PRIORIDAD: Flujo E2E completo > Calidad IA > Edge cases > Performance.
TAREA: Ejecutar plan de testing completo: banco de 15 fotos de prueba para IA,
flujo E2E, testing de resiliencia, y completar checklist pre-expo.
```

---

## 7.1 Matriz de testing

| Área               | Tipo                | Prioridad | Responsable  |
| ------------------ | ------------------- | --------- | ------------ |
| Upload de fotos    | Funcional           | CRÍTICA   | Frontend dev |
| Generación IA      | Calidad + Funcional | CRÍTICA   | Lead dev     |
| Flujo completo E2E | Integración         | CRÍTICA   | QA           |
| Panel admin        | Funcional           | ALTA      | Frontend dev |
| PDF                | Visual + Funcional  | ALTA      | Backend dev  |
| WhatsApp           | Integración         | ALTA      | Backend dev  |
| Email              | Integración         | MEDIA     | Backend dev  |
| Responsive         | Visual              | ALTA      | Frontend dev |
| Performance        | No funcional        | MEDIA     | Lead dev     |
| WiFi inestable     | Resiliencia         | ALTA      | Lead dev     |

---

## 7.2 Test plan: Upload de fotos

```
CASO 1: Foto desde cámara (Android tablet)
  - Abrir /nuevo en tablet Samsung Galaxy Tab A
  - Tocar "subir foto" → debería abrir cámara trasera
  - Tomar foto → preview debe aparecer
  ✅ PASS si: preview se muestra, tamaño < 10MB

CASO 2: Foto desde cámara (iPad)
  - Abrir /nuevo en iPad
  - Tocar "subir foto" → debería abrir cámara
  - Tomar foto → preview debe aparecer
  ✅ PASS si: funciona igual que Android

CASO 3: Foto desde galería (mobile)
  - Abrir /nuevo en celular vía QR
  - Tocar "subir foto" → elegir de galería
  - Seleccionar foto existente
  ✅ PASS si: foto se carga correctamente

CASO 4: Foto demasiado grande (> 10MB)
  - Intentar subir foto > 10MB
  ✅ PASS si: muestra error "La imagen no puede superar 10MB"

CASO 5: Formato inválido
  - Intentar subir archivo .gif o .pdf
  ✅ PASS si: muestra error "Solo se aceptan JPG, PNG o WebP"

CASO 6: Eliminar foto y subir otra
  - Subir foto → tocar ✕ → subir otra diferente
  ✅ PASS si: nueva foto reemplaza a la anterior
```

---

## 7.3 Test plan: Generación IA — Banco de pruebas

```
PREPARAR 15 FOTOS DE PRUEBA:

 #  | Descripción                    | Dificultad
----|--------------------------------|-----------
 1  | Cocina chica depto monoambiente| Fácil
 2  | Cocina lineal blanca           | Fácil
 3  | Cocina en L madera             | Media
 4  | Cocina con isla central        | Media
 5  | Cocina con ventana grande      | Media
 6  | Cocina oscura (poca luz)       | Difícil
 7  | Cocina muy chica (2m)          | Difícil
 8  | Cocina con objetos (platos)    | Media
 9  | Cocina semi-industrial         | Difícil
10  | Cocina con barra desayunadora  | Media
11  | Cocina abierta al living       | Media
12  | Cocina con azulejos coloridos  | Media
13  | Foto borrosa (simular celular) | Edge case
14  | Foto con ángulo raro           | Edge case
15  | Foto con persona en cuadro     | Edge case

PARA CADA FOTO, GENERAR CON AMBOS TIPOS:
→ 30 generaciones totales (15 × moderna + 15 × premium)

CRITERIOS DE EVALUACIÓN (1-5 por criterio):
  A. Realismo: ¿se ve como una foto real?
  B. Coherencia: ¿la iluminación y perspectiva son consistentes?
  C. Fidelidad: ¿se mantiene la estructura original (paredes, piso)?
  D. Calidad muebles: ¿los muebles Presisso se ven correctos?
  E. Impresión general: ¿el cliente quedaría satisfecho?

UMBRAL DE APROBACIÓN:
  - Promedio ≥ 3.5/5 → Prompt aprobado
  - Promedio < 3.5/5 → Iterar prompt y re-testear
```

---

## 7.4 Test plan: Flujo E2E completo

```
TEST E2E: "Happy path" completo

PRECONDICIÓN: Sistema desplegado en Vercel (staging)

PASOS:
1. Abrir URL del proyecto en celular (QR scan)
2. Paso 1: Subir foto de cocina
3. Paso 2: Seleccionar "Línea Moderna"
4. Paso 3: Ingresar nombre + WhatsApp real de tester
5. Paso 4: Confirmar → Enviar
6. Verificar: registro aparece en tabla Supabase con estado "pendiente"
7. Verificar: estado cambia a "generando" automáticamente
8. Esperar 10-30s: estado cambia a "revision"
9. Abrir panel admin (/admin)
10. Verificar: solicitud aparece en la lista con estado "Para revisar"
11. Click en la solicitud → Modal de revisión
12. Verificar: foto original y generada se muestran lado a lado
13. Click "Aprobar y enviar"
14. Verificar: estado cambia a "enviada"
15. Verificar: WhatsApp llega al celular del tester
16. Verificar: Email llega (si se proporcionó)
17. Verificar: PDF se descarga correctamente desde el link
18. Verificar: PDF tiene branding Presisso + imagen correcta

RESULTADO ESPERADO: TODO funciona sin intervención manual
TIEMPO TOTAL ESPERADO: < 3 minutos desde envío hasta WhatsApp recibido
```

---

## 7.5 Test de resiliencia: WiFi inestable

```
SIMULAR CONDICIONES DE EXPO:

1. Test con throttling 3G:
   - Chrome DevTools → Network → Slow 3G
   - Completar flujo completo
   ✅ PASS si: funciona aunque más lento, sin errores

2. Test offline momentáneo:
   - Subir foto → desconectar WiFi → reconectar → continuar
   ✅ PASS si: no pierde datos ingresados

3. Test de 4G backup:
   - Desconectar WiFi del stand
   - Conectar tablet a hotspot 4G del celular
   - Completar flujo
   ✅ PASS si: funciona normalmente

4. Test de concurrencia:
   - 5 personas simultáneas enviando solicitudes
   ✅ PASS si: todas se procesan sin conflictos
```

---

## 7.6 Checklist pre-expo

```
INFRAESTRUCTURA:
[ ] WiFi del stand probado y estable
[ ] 4G/5G backup configurado (hotspot)
[ ] Tablet cargada al 100% + cargador conectado
[ ] QR impreso y visible en el stand
[ ] URL corta configurada (ej: presisso.link/cocina)

SISTEMA:
[ ] Vercel deploy en producción (no preview)
[ ] Variables de entorno de producción configuradas
[ ] Supabase en plan pagado (si free tier no alcanza)
[ ] API key de Gemini con billing activo
[ ] Twilio WhatsApp sandbox → producción
[ ] Resend dominio verificado (presisso.com.ar)

CONTENIDO:
[ ] Logo Presisso en SVG subido a /public
[ ] Fotos de referencia de muebles disponibles
[ ] Prompts calibrados y aprobados
[ ] PDF template verificado con diseño

EQUIPO:
[ ] Operador de admin capacitado (sabe aprobar/regenerar)
[ ] Contacto técnico disponible durante la expo
[ ] Procedimiento de rollback documentado
[ ] Número de WhatsApp Business verificado
```

---

## 7.7 Verificación de la fase

| Check | Criterio                                        |
| ----- | ----------------------------------------------- |
| ✅    | 30 generaciones de prueba completadas           |
| ✅    | Tasa de aprobación IA ≥ 70%                     |
| ✅    | Flujo E2E funciona en < 3 minutos               |
| ✅    | PDF se genera y descarga correctamente          |
| ✅    | WhatsApp llega al celular de prueba             |
| ✅    | Email llega con diseño correcto                 |
| ✅    | Funciona en tablet Samsung + iPad + celular     |
| ✅    | Funciona con conexión 3G (lento pero funcional) |
| ✅    | 5 solicitudes simultáneas procesadas sin error  |
| ✅    | Checklist pre-expo completo al 100%             |
