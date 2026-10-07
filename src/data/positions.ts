import type { Position, Proposal, Source } from '../types';

/**
 * POSICIONES REALES — VACÍO A PROPÓSITO.
 *
 * No se ha introducido ninguna posición porque los programas electorales del 29N
 * todavía no están publicados y no se ha completado la verificación contra fuente primaria.
 * Una posición ausente se trata como "no disponible" (nunca como neutral).
 *
 * Plantilla para añadir una posición (ver docs/DATOS.md):
 *
 * { party: 'psoe', question: 'q05', value: 1, confidence: 1, sourceId: 'psoe-programa-2026',
 *   note: 'Apartado X, p. NN', updatedAt: '2026-11-05' }
 */
export const realPositions: Position[] = [];

/**
 * Fuentes. Una por documento; cada Position.sourceId apunta a una de ellas.
 *
 * { id: 'psoe-programa-2026', party: 'psoe', type: 'programa',
 *   title: 'Programa electoral elecciones generales 2026', url: 'https://…', date: '2026-11-..' }
 */
export const realSources: Source[] = [];

/**
 * Propuestas para el comparador, por área. Texto literal o resumen fiel del programa, con su fuente.
 *
 * { party: 'psoe', topic: 'vivienda', text: '…', sourceId: 'psoe-programa-2026', reference: 'p. 34' }
 */
export const realProposals: Proposal[] = [];
