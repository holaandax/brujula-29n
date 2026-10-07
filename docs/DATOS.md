# Datos: qué falta y cómo completarlo

## Lo que falta (a 07/10/2026)
1. **Lista oficial de candidaturas** — tras la proclamación (BOE, 03/11/2026). Actualizar `src/data/parties.ts`: `status`, `scope`, `circunscripciones`, coaliciones nuevas, altas y bajas.
2. **Programas electorales 2026** — añadir `program: { title, url, date, verified: true }` a cada partido cuando se publiquen.
3. **Posiciones** — 20 por candidatura en `src/data/positions.ts`, cada una con `sourceId`. Ninguna introducida.
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
