# Estado de los datos — 07/10/2026

## ✅ Verificado
- Convocatoria: Real Decreto 806/2026 (BOE núm. 248, 06/10/2026). Votación el 29/11, campaña del 13 al 27/11, sesión constitutiva el 23/12 a las 10:00.
- Calendario completo: fechas del decreto y plazos de la LOREG contados desde la convocatoria. Corregida la consulta del censo (12–19/10) y separadas la proclamación (02/11) y su publicación en el BOE (03/11).
- Resultados de 2023 y votaciones de investidura (Sánchez 179–171, Feijóo 172–178), marcados como históricos.
- Candidatos anunciados por su partido, con fuente periodística (tier 3) y fecha: Sánchez (PSOE), Feijóo (PP), Abascal (Vox). Pendientes de proclamación.

## 🟡 Pendiente (aún no es público)
- Candidaturas proclamadas: BOE del 03/11/2026. Hasta entonces, ninguna figura como definitiva.
- Candidatos de Frente Amplio (presentación prevista el 17/10), Podemos (primarias propuestas el 14 y 15/10), ERC, Junts, EH Bildu, PNV, BNG, CC y UPN.
- Programas electorales 2026: ninguno publicado a esta fecha.
- Posiciones de los partidos en las 30 preguntas: **0**. El test funciona, pero el resultado avisa de que todavía no hay posiciones verificadas.
- Propuestas reales: dependen de los programas.
- Fotos y logos: sin incorporar. Requieren licencia compatible (Wikimedia Commons o material oficial con permiso) y descarga manual.
- Webs oficiales de los partidos: `verified: false` hasta comprobarlas a mano.
- Dominio definitivo (`example.org` en config.ts, index.html, robots.txt y sitemap.xml).

## 🔴 Retirado por no verificable
- Cabezas de lista supuestos (Rufián por Barcelona, Nogueras por Barcelona, Aizpurua por Gipuzkoa, Esteban por Bizkaia, Rego por A Coruña, Valido por Santa Cruz de Tenerife, Catalán por Navarra) y la candidatura de Irene Montero como si fuera definitiva.
- Datos ficticios como dataset por defecto: ahora el dataset por defecto es el real. El de demostración solo se usa con `VITE_DATASET=demo`.

## Cómo actualizar
- Candidatos: `src/data/candidates.ts` (estado + `sourceId`).
- Fuentes de hechos electorales: `src/data/sources-electoral.ts`.
- Posiciones y fuentes de programas: `src/data/positions.ts` (ver docs/DATOS.md).
- `npm test` falla si un candidato apunta a un partido o a una fuente inexistente, si aparece un nombre en estado «pendiente» o si se marca como proclamado sin fuente oficial.
