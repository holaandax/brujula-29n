/**
 * QUIÉN ES QUIÉN — CANDIDATURAS A LA PRESIDENCIA DEL GOBIERNO.
 *
 * Estados:
 *  - 'proclamado': figura en las candidaturas proclamadas (BOE, 03/11/2026). Fuente tier 1.
 *  - 'anunciado':  el partido lo ha anunciado públicamente; pendiente de proclamación.
 *  - 'pendiente':  no hay candidato confirmado. name queda vacío; note resume el estado con su fuente.
 *
 * Nunca se rellena un nombre por suposición (quién encabezó en 2023, quién es portavoz…).
 *
 * Fotos: solo con licencia compatible (Wikimedia Commons con CC BY/CC BY-SA, fotos oficiales con
 * permiso de uso). Guardar en public/candidatos/<party>.webp y completar photoCredit.
 */
export type CandidateStatus = 'proclamado' | 'anunciado' | 'pendiente';

export interface Candidate {
  party: string;
  status: CandidateStatus;
  name?: string;
  role: string;
  note?: string;
  sourceId: string;
  updatedAt: string;
  photo?: string;
  photoCredit?: { author: string; license: string; url: string };
  url?: string;
}

const U = '2026-10-07';
const role = 'Candidatura a la Presidencia del Gobierno';

export const candidates: Candidate[] = [
  { party: 'psoe', status: 'anunciado', name: 'Pedro Sánchez', role, sourceId: 'eldebate-20261005', updatedAt: U },
  { party: 'pp', status: 'anunciado', name: 'Alberto Núñez Feijóo', role, sourceId: 'eldebate-20261005', updatedAt: U },
  { party: 'vox', status: 'anunciado', name: 'Santiago Abascal', role, sourceId: 'eldebate-20261005', updatedAt: U },
  { party: 'sumar', status: 'pendiente', role: 'Candidatura del Frente Amplio', note: 'Movimiento Sumar, IU, Más Madrid y Comuns tienen previsto presentar el proyecto y su cabeza de cartel el 17 de octubre.', sourceId: 'articulo14-20261005', updatedAt: U },
  { party: 'podemos', status: 'pendiente', role, note: 'Podemos propone primarias abiertas el 14 y el 15 de octubre, a las que se presentaría Irene Montero.', sourceId: 'deia-20261006', updatedAt: U },
  { party: 'erc', status: 'pendiente', role, note: 'Oriol Junqueras ha dicho que Gabriel Rufián será el candidato; Rufián no lo ha confirmado.', sourceId: 'deia-20261006', updatedAt: U },
  { party: 'junts', status: 'pendiente', role, note: 'Míriam Nogueras ha anunciado que quiere repetir como candidata.', sourceId: 'deia-20261006', updatedAt: U },
  { party: 'bildu', status: 'pendiente', role, note: 'Los procesos internos para elegir cabezas de lista están en marcha.', sourceId: 'deia-20261006', updatedAt: U },
  { party: 'pnv', status: 'pendiente', role, note: 'Los procesos internos para elegir cabezas de lista están en marcha.', sourceId: 'deia-20261006', updatedAt: U },
  { party: 'bng', status: 'pendiente', role, sourceId: 'loreg', updatedAt: U },
  { party: 'cc', status: 'pendiente', role, sourceId: 'loreg', updatedAt: U },
  { party: 'upn', status: 'pendiente', role, sourceId: 'loreg', updatedAt: U },
];
