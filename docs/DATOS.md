# Datos: qué falta y cómo completarlo

## Lo que falta (a 07/10/2026)
1. **Lista oficial de candidaturas** — tras la proclamación (BOE, 03/11/2026). Actualizar `src/data/parties.ts`: `status`, `scope`, `circunscripciones`, coaliciones nuevas, altas y bajas.
2. **Programas electorales 2026** — añadir `program: { title, url, date, verified: true }` a cada partido cuando se publiquen.
3. **Posiciones** — en `src/data/positions.ts` hay 242, tomadas de los programas de 2023 (tabla `ROWS`: pregunta, valor, `'p'` programa o `'v'` actuación en el Congreso, página, nota). Sustituirlas por las de 2026 cuando salgan los programas.
4. **Verificar webs oficiales** — todas están en `verified: false`. Sumar, CC y UPN no tienen URL todavía.
5. **URL del BOE** del Real Decreto de convocatoria en `src/data/electoral.ts` (`BOE_URL`).
6. Dominio final en `config.ts`, `index.html`, `robots.txt`, `sitemap.xml`.

## Protocolo para cada posición
1. Buscar la medida en el programa 2026 (prioridad 1). Si no aparece: documento programático, web oficial, documento oficial, propuesta/intervención oficial, en ese orden.
2. Asignar valor: -1, -0,5, 0, 0,5 o 1. Usar 0 **solo** si la fuente defiende expresamente una posición intermedia.
3. Si no hay fuente clara: no añadir la posición (o `value: null`). Nunca inferir por ideología general.
4. `confidence` según tipo de fuente (ver `lib/constants.ts`).
5. Rellenar `reference` con página o apartado, y `note` si la codificación requiere explicación.
6. Doble codificación recomendada: dos personas codifican por separado y se revisan discrepancias.
7. `npm test` debe pasar.

## Ejemplo
```ts
// src/data/positions.ts
export const realSources: Source[] = [
  { id: 'psoe-prog-2026', party: 'psoe', type: 'programa', title: 'Programa electoral generales 2026',
    url: 'https://…', date: '2026-11-..', reference: '' },
];
export const realPositions: Position[] = [
  { party: 'psoe', question: 'q05', value: 1, confidence: 1, sourceId: 'psoe-prog-2026',
    note: 'Apartado de vivienda, p. NN', updatedAt: '2026-11-..' },
];
```

## Activar el dataset real
`VITE_DATASET=real` en el entorno de build. Mientras una candidatura no tenga posiciones sobre al menos el 50 % de las respuestas del usuario, no entra en el ranking y se lista como "sin datos suficientes".

## Guía electoral: calendario, pactos, propuestas y candidatos

| Qué | Archivo | Estado a 07/10/2026 |
| --- | --- | --- |
| Calendario | `src/data/electoral.ts` | **Provisional** (`calendarProvisional: true`). Contrastar cada fecha con el BOE y la JEC, poner `false` y rellenar `BOE_URL`. `key: true` = aparece en la cuenta atrás de la portada. |
| Calculadora de pactos | `src/data/results.ts` | Escaños oficiales de 2023. Para 2026, añadir otra entrada a `ELECTION_RESULTS` con los escaños proclamados; aparece un selector de elección automáticamente. `PACT_PRESETS` son votaciones reales de investidura. |
| Propuestas por tema | `src/data/positions.ts` → `realProposals` | Se generan de las filas `'p'` de `ROWS` (programas 2023), con su página. Cada propuesta necesita `party`, `topic`, `text` y `sourceId` de su programa. El validador falla si falta la fuente o es de otro partido. |
| Candidatos | `src/data/candidates.ts` | **Provisional**: solo nombres anunciados con fuente. `previous` = cabeza de lista en 2023 (BOE-A-2023-15066), que se muestra etiquetado «En 2023». Fotos en `public/candidatos/<apellido>.jpg` (4:5, 480×600, solo con licencia libre) con `photoCredit`. Sin `url`, se enlaza la web oficial del partido. |

Los colores de cada partido están en `parties.ts` y `results.ts` (mismos valores) y solo se usan en gráficos y marcas pequeñas.
