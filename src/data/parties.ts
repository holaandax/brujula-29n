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
 * Los programas 2026 aún no se han publicado: program apunta al programa de las generales de 2023, del que salen
 * las posiciones (ver data/positions.ts). verified:true solo cuando el PDF está en el dominio oficial del partido.
 * Los colores son los habituales de cada formación (los mismos que en data/results.ts), solo para gráficos y marcas pequeñas.
 */
const U = '2026-10-07';
const pending = { status: 'pendiente' as const, updatedAt: U };
const desc = 'Formación con representación en el Congreso en la XV legislatura. Candidatura al 29N pendiente de proclamación.';
const NOTE = 'Posiciones tomadas del programa de las generales de 2023 hasta que se publique el del 29N. Cuando el programa no se pronuncia, se usa su actuación en el Congreso y la posición se marca como estimada.';
const p23 = (url: string, verified: boolean, title = 'Programa electoral elecciones generales 2023', methodologyNotes = NOTE) =>
  ({ program: { title, url, verified }, methodologyNotes });

export const realParties: Party[] = [
  { id: 'psoe', name: 'Partido Socialista Obrero Español', shortName: 'PSOE', acronym: 'PSOE', description: desc, scope: 'estatal', circunscripciones: 'all', color: '#E30613', website: { url: 'https://www.psoe.es', verified: false }, ...p23('https://www.psoe.es/media-content/2023/07/PROGRAMA_ELECTORAL-GENERALES-2023.pdf', true), ...pending },
  { id: 'pp', name: 'Partido Popular', shortName: 'PP', acronym: 'PP', description: desc, scope: 'estatal', circunscripciones: 'all', color: '#1D84CE', website: { url: 'https://www.pp.es', verified: false }, ...p23('https://www.pp.es/wp-content/uploads/2023/07/programa_electoral_pp_23j_feijoo_2023.pdf', true), ...pending },
  { id: 'vox', name: 'VOX', shortName: 'Vox', acronym: 'VOX', description: desc, scope: 'estatal', circunscripciones: 'all', color: '#63BE21', website: { url: 'https://www.voxespana.es', verified: false }, ...p23('https://theobjective.com/wp-content/uploads/2023/07/programa-vox-23j.pdf', false, 'Programa electoral elecciones generales 2023 (copia de The Objective)'), ...pending },
  { id: 'sumar', name: 'Sumar', shortName: 'Sumar', acronym: 'SUMAR', description: desc + ' En 2026 se refunda como Frente Amplio (Movimiento Sumar, IU, Más Madrid y Comuns); nombre y candidato por confirmar.', scope: 'coalicion', circunscripciones: 'all', color: '#E51C55', ...p23('https://verdesequo.es/wp-content/uploads/2023/07/Un-programa-para-ti.pdf', false, 'Un programa para ti, generales 2023 (copia de Verdes Equo)'), ...pending },
  { id: 'podemos', name: 'Podemos', shortName: 'Podemos', acronym: 'PODEMOS', description: desc, scope: 'estatal', circunscripciones: 'all', color: '#6C2A6A', website: { url: 'https://podemos.info', verified: false }, ...p23('https://verdesequo.es/wp-content/uploads/2023/07/Un-programa-para-ti.pdf', false, 'Programa de Sumar 2023, con el que concurrió Podemos', 'En 2023 Podemos concurrió dentro de Sumar: sus posiciones salen de aquel programa y, donde se ha separado de Sumar, de su actuación en el Congreso (marcadas como estimadas).'), ...pending },
  { id: 'erc', name: 'Esquerra Republicana de Catalunya', shortName: 'ERC', acronym: 'ERC', description: desc, scope: 'autonomico', circunscripciones: ['08', '17', '25', '43'], color: '#F5A800', website: { url: 'https://www.esquerra.cat', verified: false }, ...p23('https://static.esquerra.cat/uploads/20230905/e2023-programa.pdf', true, 'Defensa Catalunya! Programa eleccions espanyoles 2023'), ...pending },
  { id: 'junts', name: 'Junts per Catalunya', shortName: 'Junts', acronym: 'JUNTS', description: desc, scope: 'autonomico', circunscripciones: ['08', '17', '25', '43'], color: '#20B8AA', website: { url: 'https://junts.cat', verified: false }, ...p23('https://img.beteve.cat/wp-content/uploads/2023/07/programa-junts-per-catalunya-eleccions-generals-2023.pdf', false, 'Programa eleccions generals 2023 (copia de betevé)'), ...pending },
  { id: 'bildu', name: 'Euskal Herria Bildu', shortName: 'EH Bildu', acronym: 'EH BILDU', description: desc, scope: 'autonomico', circunscripciones: ['01', '20', '48', '31'], color: '#A6C83C', website: { url: 'https://ehbildu.eus', verified: false }, ...p23('https://www.elnacional.cat/uploads/s1/42/81/42/33/programa-electoral-eh-bildu-eleccions-generals-2023.pdf', false, 'Compromiso de EH Bildu, generales 2023 (copia de El Nacional)'), ...pending },
  { id: 'pnv', name: 'Partido Nacionalista Vasco / Euzko Alderdi Jeltzalea', shortName: 'PNV', acronym: 'EAJ-PNV', description: desc, scope: 'autonomico', circunscripciones: ['01', '20', '48'], color: '#1E7B3C', website: { url: 'https://www.eaj-pnv.eus', verified: false }, ...p23('https://www.eaj-pnv.eus/es/adjuntos-documentos/20945/pdf/con-voz-propia-programa-electoral-23-j', true, 'Con voz propia. Programa electoral 23-J'), ...pending },
  { id: 'bng', name: 'Bloque Nacionalista Galego', shortName: 'BNG', acronym: 'BNG', description: desc, scope: 'autonomico', circunscripciones: ['15', '27', '32', '36'], color: '#7DB8E0', website: { url: 'https://www.bng.gal', verified: false }, ...p23('https://www.bng.gal/media/bnggaliza/files/2023/07/05/23_bng_xerais_programa.pdf', true, 'Que Galiza conte! Programa eleccións xerais 2023'), ...pending },
  { id: 'cc', name: 'Coalición Canaria', shortName: 'CC', acronym: 'CC', description: desc, scope: 'autonomico', circunscripciones: ['35', '38'], color: '#F2CB05', ...p23('https://coalicioncanaria.org/wp-content/uploads/cc-pdf/programas-electorales/00_COALICION%20POR%20CANARIAS.pdf', true, 'Manifiesto de Coalición por Canarias, generales 2023', 'En 2023 Coalición Canaria concurrió con un manifiesto breve centrado en Canarias, que no se pronuncia sobre la mayoría de las preguntas del test. Hasta que publique su programa del 29N no tiene datos suficientes para entrar en el ranking.'), ...pending },
  { id: 'upn', name: 'Unión del Pueblo Navarro', shortName: 'UPN', acronym: 'UPN', description: desc, scope: 'autonomico', circunscripciones: ['31'], color: '#2C4B9B', ...p23('https://elecciones.upn.org/wp-content/uploads/2023/05/lecturafacil_ok.pdf', true, 'Banderas, programa de UPN 2023–2027 (elecciones forales)', 'UPN no publicó programa propio para las generales de 2023: sus posiciones salen de su programa para las elecciones forales de mayo de 2023 y de su actuación en el Congreso (marcadas como estimadas).'), ...pending },
];
