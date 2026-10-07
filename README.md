# Brújula 29N — test de afinidad política (elecciones generales, 29 de noviembre de 2026)

Web estática, 100% client-side: test rápido (20 preguntas) o completo (30, con «esto me importa»), cálculo de afinidad multidimensional en el navegador,
sin backend, sin cookies, sin analítica y sin almacenar respuestas.

## Estado de los datos (léelo antes de publicar)

| Qué | Estado a 07/10/2026 |
| --- | --- |
| Infraestructura, algoritmo, UI, tests | Completos |
| Preguntas (20 rápido + 10 completo, 14 áreas) | Completas, revisadas por sesgo |
| Candidaturas oficiales 29N | **Pendientes**: el plazo de presentación acaba el 26/10 y la proclamación se publica en el BOE el 03/11 |
| Programas electorales 2026 | **No publicados todavía** |
| Posiciones reales con fuente | **0 introducidas** (no se ha inventado ninguna) |
| Webs oficiales | Introducidas con `verified: false`, pendientes de comprobación manual |

Por eso el proyecto trae **dos datasets**:

- `demo` (por defecto): 5 candidaturas **ficticias** para que el producto funcione de extremo a extremo. La web muestra un aviso permanente.
- `real`: formaciones con representación en la XV legislatura, estado *pendiente*, sin posiciones. Si lo activas hoy, la página de resultados explica que aún no hay posiciones verificadas en lugar de inventarlas.

Detalle de lo que falta y cómo añadirlo: [`docs/DATOS.md`](docs/DATOS.md).

## Funcionalidades

- Test rápido (20) y completo (30). En el completo, cada pregunta se puede marcar como importante (peso ×2).
- Resultado general, ranking, afinidad por área, «¿por qué coincides?», respuestas más influyentes, mapa, comparador y tarjeta para compartir.
- Explorar sin hacer el test: **Partidos** (ficha con cada posición y su fuente), **Temas** (espectro de posiciones por pregunta) y **Brújula**.
- Guía electoral: **Calendario** (fases, plazos y cuenta atrás), **Cómo votar** (en persona, papeletas, blanco y nulo, correo, extranjero, mesas), **Calculadora de pactos** (hemiciclo con los escaños de 2023 e investiduras reales como punto de partida), **Compara propuestas** (por tema y partido) y **Quién es quién** (candidatos con foto y enlace).
- Posiciones **documentadas** frente a **estimadas** (etiqueta visible y confianza máxima 0,6).
- Fuentes, datos auditables, metodología y privacidad.

## Ejecutar

```bash
npm install
npm run dev            # http://localhost:5173
npm test               # tests del algoritmo y validación del dataset
npm run build          # tsc + build de producción en dist/
VITE_DATASET=real npm run build   # build con el dataset real
```

Requiere Node 20 o superior.

## Desplegar

- **Vercel**: importa el repo. `vercel.json` ya define build (`npm run build`), salida (`dist`) y cabeceras de seguridad. Para el dataset real añade la variable `VITE_DATASET=real`.
- **Netlify**: importa el repo. `netlify.toml` ya define build, salida y cabeceras. Misma variable de entorno.

Antes de publicar, sustituye `https://example.org` en `src/config.ts`, `index.html`, `public/robots.txt` y `public/sitemap.xml` por tu dominio.

Las rutas usan hash (`#/resultado`), así que no hace falta configurar reescrituras en el servidor. Las páginas de resultado no son indexables porque no existen en el servidor: solo hay una URL pública.

## Arquitectura

```
src/
  config.ts            nombre de la app, dataset activo, umbrales del algoritmo
  types/               Party, Question, Position, Source, Topic, Dataset…
  data/                SOLO datos (nada de lógica ni JSX)
    topics.ts          áreas y pesos
    questions.ts       las 20 preguntas, peso y eje del mapa
    parties.ts         candidaturas reales (estado pendiente)
    positions.ts       posiciones, fuentes y propuestas reales (vacío, con plantilla)
    demo.ts            dataset ficticio
    electoral.ts       calendario (provisional) y 52 circunscripciones
    results.ts         escaños oficiales por elección y votaciones de investidura (calculadora de pactos)
    candidates.ts      quién es quién: nombre, cargo, foto y enlace por partido
    index.ts           selección y saneado del dataset activo
  lib/
    scoring.ts         algoritmo (puro, sin React)
    pacts.ts           recuento de investidura y geometría del hemiciclo (puro)
    validate.ts        validación y saneado del dataset
    labels.ts, share.ts, router.ts, hooks.ts, constants.ts
  state/quiz.tsx       estado del test en memoria (useReducer + Context)
  components/          Landing, Quiz, Results, Hemicycle, IdeologyChart, PartyComparison, ShareSection, Layout
  pages/               Calendar, HowToVote, Pacts, Proposals, Candidates, Explore, Methodology, Sources, DataView, Privacy
tests/                 scoring.test.ts, dataset.test.ts, pacts.test.ts
docs/                  METODOLOGIA.md, DATOS.md
```

Cambiar una posición, añadir un partido o reescribir una pregunta = editar un archivo de `src/data/`. Los tests validan el dataset; si introduces un dato incoherente (valor fuera de rango, fuente ausente, URL inválida, duplicado…), `npm test` falla.

## Privacidad (verificable)

- Respuestas solo en memoria de React. Ni `localStorage`, ni cookies, ni `fetch`.
- CSP con `connect-src 'none'`: aunque alguien añadiera código de red, el navegador lo bloquearía.
- Tipografías autoalojadas (`@fontsource`), sin Google Fonts ni CDNs.
- Compartir envía solo un resumen agregado, y solo si el usuario lo pulsa.

## Circunscripciones y Senado

El modelo de datos ya admite `circunscripciones` por candidatura y el algoritmo acepta un filtro. El selector está desactivado (`enableCircunscripcion: false`) hasta que se publiquen las candidaturas proclamadas. El Senado no se mezcla con el cálculo.
