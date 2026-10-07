import type { Party } from '../types';

/**
 * DATASET REAL — ESTADO A 7/10/2026
 *
 * Lista de partida: formaciones con representación en el Congreso en la XV legislatura.
 * NO es la lista de candidaturas del 29N: el plazo de presentación termina el 26/10/2026
 * y la proclamación se publica en el BOE el 03/11/2026. Hasta entonces status = 'pendiente'.
 * Puede haber coaliciones nuevas, cambios de nombre o formaciones que no concurran.
 *
 * Las URLs de web oficial están marcadas verified:false hasta su comprobación manual.
 * Los programas 2026 aún no se han publicado: program se deja sin rellenar.
 * Los colores son una paleta categórica neutra; no reproducen la identidad de cada partido.
 */
const U = '2026-10-07';
const pending = { status: 'pendiente' as const, updatedAt: U };
const desc = 'Formación con representación en el Congreso en la XV legislatura. Candidatura al 29N pendiente de proclamación.';

export const realParties: Party[] = [
  { id: 'psoe', name: 'Partido Socialista Obrero Español', shortName: 'PSOE', acronym: 'PSOE', description: desc, scope: 'estatal', circunscripciones: 'all', color: '#7A5C8E', website: { url: 'https://www.psoe.es', verified: false }, ...pending },
  { id: 'pp', name: 'Partido Popular', shortName: 'PP', acronym: 'PP', description: desc, scope: 'estatal', circunscripciones: 'all', color: '#3D7F78', website: { url: 'https://www.pp.es', verified: false }, ...pending },
  { id: 'vox', name: 'VOX', shortName: 'Vox', acronym: 'VOX', description: desc, scope: 'estatal', circunscripciones: 'all', color: '#9A6B3A', website: { url: 'https://www.voxespana.es', verified: false }, ...pending },
  { id: 'sumar', name: 'Sumar', shortName: 'Sumar', acronym: 'SUMAR', description: desc + ' Su composición como coalición en 2026 está por confirmar.', scope: 'coalicion', circunscripciones: 'all', color: '#4C6A9A', ...pending },
  { id: 'podemos', name: 'Podemos', shortName: 'Podemos', acronym: 'PODEMOS', description: desc, scope: 'estatal', circunscripciones: 'all', color: '#8A4F5F', website: { url: 'https://podemos.info', verified: false }, ...pending },
  { id: 'erc', name: 'Esquerra Republicana de Catalunya', shortName: 'ERC', acronym: 'ERC', description: desc, scope: 'autonomico', circunscripciones: ['08', '17', '25', '43'], color: '#B08A2E', website: { url: 'https://www.esquerra.cat', verified: false }, ...pending },
  { id: 'junts', name: 'Junts per Catalunya', shortName: 'Junts', acronym: 'JUNTS', description: desc, scope: 'autonomico', circunscripciones: ['08', '17', '25', '43'], color: '#4E8A5B', website: { url: 'https://junts.cat', verified: false }, ...pending },
  { id: 'bildu', name: 'Euskal Herria Bildu', shortName: 'EH Bildu', acronym: 'EH BILDU', description: desc, scope: 'autonomico', circunscripciones: ['01', '20', '48', '31'], color: '#5E7F3A', website: { url: 'https://ehbildu.eus', verified: false }, ...pending },
  { id: 'pnv', name: 'Partido Nacionalista Vasco / Euzko Alderdi Jeltzalea', shortName: 'PNV', acronym: 'EAJ-PNV', description: desc, scope: 'autonomico', circunscripciones: ['01', '20', '48'], color: '#6B7F2E', website: { url: 'https://www.eaj-pnv.eus', verified: false }, ...pending },
  { id: 'bng', name: 'Bloque Nacionalista Galego', shortName: 'BNG', acronym: 'BNG', description: desc, scope: 'autonomico', circunscripciones: ['15', '27', '32', '36'], color: '#3E7C9A', website: { url: 'https://www.bng.gal', verified: false }, ...pending },
  { id: 'cc', name: 'Coalición Canaria', shortName: 'CC', acronym: 'CC', description: desc, scope: 'autonomico', circunscripciones: ['35', '38'], color: '#A3793F', ...pending },
  { id: 'upn', name: 'Unión del Pueblo Navarro', shortName: 'UPN', acronym: 'UPN', description: desc, scope: 'autonomico', circunscripciones: ['31'], color: '#5A6F8C', ...pending },
];
