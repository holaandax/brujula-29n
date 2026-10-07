/**
 * QUIÉN ES QUIÉN — CANDIDATURAS A LA PRESIDENCIA DEL GOBIERNO.
 *
 * Estados:
 *  - 'proclamado': figura en las candidaturas proclamadas (BOE, 03/11/2026). Fuente tier 1.
 *  - 'anunciado':  el partido lo ha anunciado públicamente; pendiente de proclamación.
 *  - 'pendiente':  no hay candidato confirmado. name queda vacío; note resume el estado con su fuente.
 *
 * Nunca se rellena un nombre por suposición (quién encabezó en 2023, quién es portavoz…).
 * Para dar contexto, `previous` recoge quién encabezó la lista en 2023 (BOE-A-2023-15066) y se muestra
 * siempre etiquetado como tal, nunca como candidato del 29N.
 *
 * Fotos: solo con licencia compatible (Wikimedia Commons con CC0, dominio público, CC BY o CC BY-SA).
 * Se guardan en public/candidatos/<apellido>.jpg (4:5, 480×600) con su photoCredit.
 */
export type CandidateStatus = 'proclamado' | 'anunciado' | 'pendiente';

export interface PhotoCredit { author: string; license: string; url: string }

export interface Candidate {
  party: string;
  status: CandidateStatus;
  name?: string;
  role: string;
  note?: string;
  sourceId: string;
  updatedAt: string;
  photo?: string;
  photoCredit?: PhotoCredit;
  url?: string;
  /** Cabeza de lista en las generales de 2023, como referencia mientras no hay candidato. */
  previous?: { name: string; list: string; photo?: string; photoCredit?: PhotoCredit };
}

const U = '2026-10-07';
const role = 'Candidatura a la Presidencia del Gobierno';
const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, '_'))}`;
const photo = (slug: string, file: string, author: string, license: string) =>
  ({ photo: `/candidatos/${slug}.jpg`, photoCredit: { author, license, url: commons(file) } });

export const candidates: Candidate[] = [
  { party: 'psoe', status: 'anunciado', name: 'Pedro Sánchez', role, sourceId: 'eldebate-20261005', updatedAt: U,
    ...photo('sanchez', 'Pedro Sánchez 2024 (cropped).jpg', 'Gobierno de Eslovenia', 'Dominio público') },
  { party: 'pp', status: 'anunciado', name: 'Alberto Núñez Feijóo', role, sourceId: 'eldebate-20261005', updatedAt: U,
    ...photo('feijoo', 'Alberto Núñez Feijóo 2024 (cropped).jpg', 'European People\'s Party', 'CC BY 2.0') },
  { party: 'vox', status: 'anunciado', name: 'Santiago Abascal', role, sourceId: 'eldebate-20261005', updatedAt: U,
    ...photo('abascal', 'Santiago Abascal CPAC 2024.jpg', 'Vox España', 'CC0') },
  { party: 'sumar', status: 'pendiente', role: 'Candidatura del Frente Amplio', note: 'Movimiento Sumar, IU, Más Madrid y Comuns tienen previsto presentar el proyecto y su cabeza de cartel el 17 de octubre.', sourceId: 'articulo14-20261005', updatedAt: U,
    previous: { name: 'Yolanda Díaz', list: 'Madrid', ...photo('diaz', 'Yolanda Díaz 2023 (cropped).jpg', 'La Moncloa – Gobierno de España', 'Reconocimiento') } },
  { party: 'podemos', status: 'pendiente', role, note: 'Podemos propone primarias abiertas el 14 y el 15 de octubre, a las que se presentaría Irene Montero.', sourceId: 'deia-20261006', updatedAt: U },
  { party: 'erc', status: 'pendiente', role, note: 'Oriol Junqueras ha dicho que Gabriel Rufián será el candidato; Rufián no lo ha confirmado.', sourceId: 'deia-20261006', updatedAt: U,
    previous: { name: 'Gabriel Rufián', list: 'Barcelona', ...photo('rufian', 'Gabriel Rufián Portavoz de Esquerra Republicana en el Congreso de los diputados (cropped).jpg', 'Marcpuigperez', 'CC BY-SA 4.0') } },
  { party: 'junts', status: 'pendiente', role, note: 'Míriam Nogueras ha anunciado que quiere repetir como candidata.', sourceId: 'deia-20261006', updatedAt: U,
    previous: { name: 'Míriam Nogueras', list: 'Barcelona', ...photo('nogueras', 'Míriam Nogueras 2015 (cropped).jpg', 'Convergència Democràtica de Catalunya', 'CC BY 2.0') } },
  { party: 'bildu', status: 'pendiente', role, note: 'Los procesos internos para elegir cabezas de lista están en marcha.', sourceId: 'deia-20261006', updatedAt: U,
    previous: { name: 'Mertxe Aizpurua', list: 'Gipuzkoa', ...photo('aizpurua', 'AMP 4418 (cropped).jpg', 'Álvaro Minguito', 'CC BY-SA 3.0 ES') } },
  { party: 'pnv', status: 'pendiente', role, note: 'Los procesos internos para elegir cabezas de lista están en marcha.', sourceId: 'deia-20261006', updatedAt: U,
    previous: { name: 'Aitor Esteban', list: 'Bizkaia', ...photo('esteban', 'Aitor Esteban 2019 (cropped).jpg', 'EAJ-PNV Gipuzkoa', 'CC BY-SA 2.0') } },
  { party: 'bng', status: 'pendiente', role, sourceId: 'loreg', updatedAt: U,
    previous: { name: 'Néstor Rego', list: 'A Coruña', ...photo('rego', 'Néstor Rego 2016 (cropped).jpg', 'Elisardojm (recorte de Impru20)', 'CC BY-SA 4.0') } },
  { party: 'cc', status: 'anunciado', name: 'Cristina Valido', role: 'Cabeza de lista al Congreso por Santa Cruz de Tenerife', note: 'Propuesta por el Comité Ejecutivo Nacional de CC; falta la autorización de su Consejo Político Nacional.', sourceId: 'infobae-20261005', updatedAt: U,
    ...photo('valido', 'Cristina Valido 2023.jpg', 'Canal 10 Televisión', 'CC BY 3.0') },
  { party: 'upn', status: 'pendiente', role, sourceId: 'loreg', updatedAt: U,
    previous: { name: 'Alberto Catalán', list: 'Navarra', ...photo('catalan', 'Alberto Catalán 2023 (cropped).jpg', 'Vox Congreso', 'CC0') } },
];
