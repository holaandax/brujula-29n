# Estado de los datos — 07/10/2026

## ✅ Verificado
- Convocatoria: Real Decreto 806/2026 (BOE núm. 248, 06/10/2026). Votación el 29/11, campaña del 13 al 27/11, sesión constitutiva el 23/12 a las 10:00.
- Calendario completo: fechas del decreto y plazos de la LOREG contados desde la convocatoria. Corregida la consulta del censo (12–19/10) y separadas la proclamación (02/11) y su publicación en el BOE (03/11).
- Resultados de 2023 y votaciones de investidura (Sánchez 179–171, Feijóo 172–178), marcados como históricos.
- Candidatos anunciados por su partido, con fuente periodística (tier 3) y fecha: Sánchez (PSOE), Feijóo (PP), Abascal (Vox) y Cristina Valido (CC, propuesta por su ejecutiva el 05/10, pendiente de ratificar). Pendientes de proclamación.
- Cabezas de lista de 2023 (BOE-A-2023-15066), mostrados solo como referencia «En 2023» donde aún no hay candidato.
- Fotos: 11 retratos de Wikimedia Commons con licencia libre (CC0, dominio público, CC BY, CC BY-SA), con autor, licencia y enlace en cada tarjeta.

## 🟠 Provisional: posiciones de los programas de 2023
- 241 posiciones en las 30 preguntas, codificadas el 07/10/2026 a partir de los programas de las generales de 2023 (con página del PDF) y, cuando el programa no se pronuncia, de la actuación en el Congreso (marcadas como estimadas, confianza 0,6).
- Cobertura (de 30): PSOE 28, Vox 26, Podemos 25, PP 24, Sumar 24, ERC 23, EH Bildu 22, BNG 20, Junts 15, PNV 15, UPN 15, CC 4.
- Podemos usa el programa de Sumar 2023 (concurrió dentro). UPN usa su programa foral de 2023 (no publicó uno para las generales). CC solo tiene un manifiesto: queda fuera del ranking por falta de datos.
- Vox, Sumar, Junts y EH Bildu enlazan a copias de su programa en medios o partidos aliados (`verified: false`): sustituir por la URL oficial si aparece.
- Pendiente: segunda codificación independiente y revisión de las posiciones estimadas.
- 199 propuestas en el comparador, las mismas medidas de cada posición con su página.

## 🟡 Pendiente (aún no es público)
- Candidaturas proclamadas: BOE del 03/11/2026. Hasta entonces, ninguna figura como definitiva.
- Candidatos de Frente Amplio (presentación prevista el 17/10), Podemos (primarias propuestas el 14 y 15/10), ERC, Junts, EH Bildu, PNV, BNG, CC y UPN.
- Programas electorales 2026: ninguno publicado a esta fecha.
- Posiciones y propuestas de los programas de 2026: sustituirán a las de 2023 cuando se publiquen.
- Logos: sin incorporar.
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
