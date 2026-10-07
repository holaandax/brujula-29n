import type { Party, Position, Source } from '../types';

/**
 * DATASET DE DEMOSTRACIÓN — CANDIDATURAS FICTICIAS.
 * Sirve para probar la aplicación de extremo a extremo mientras no haya posiciones reales verificadas.
 * Ningún nombre, posición o fuente de este archivo corresponde a un partido real.
 */
const U = '2026-10-07';
const base = { scope: 'estatal' as const, circunscripciones: 'all' as const, status: 'ficticia' as const, isDemo: true, updatedAt: U };

export const demoParties: Party[] = [
  { id: 'demo-alfa', name: 'Candidatura Alfa (ficticia)', shortName: 'Alfa', acronym: 'ALFA', description: 'Perfil ficticio de demostración.', color: '#7A5C8E', ...base },
  { id: 'demo-beta', name: 'Candidatura Beta (ficticia)', shortName: 'Beta', acronym: 'BETA', description: 'Perfil ficticio de demostración.', color: '#3E7C9A', ...base },
  { id: 'demo-gamma', name: 'Candidatura Gamma (ficticia)', shortName: 'Gamma', acronym: 'GAMMA', description: 'Perfil ficticio de demostración.', color: '#4E8A5B', ...base },
  { id: 'demo-delta', name: 'Candidatura Delta (ficticia)', shortName: 'Delta', acronym: 'DELTA', description: 'Perfil ficticio de demostración.', color: '#9A6B3A', ...base },
  { id: 'demo-epsilon', name: 'Candidatura Épsilon (ficticia)', shortName: 'Épsilon', acronym: 'ÉPSILON', description: 'Perfil ficticio de ámbito autonómico, con datos incompletos para mostrar cómo se gestiona la cobertura.', color: '#A3793F', ...base, scope: 'autonomico', circunscripciones: ['08', '17', '25', '43'] },
];

// Valores por pregunta q01…q30. null = no disponible.
const table: Record<string, (number | null)[]> = {
  'demo-alfa':    [1, 1, -0.5, 1, 1, -0.5, 1, -1, 1, 1, 1, -0.5, 1, -0.5, -1, 1, 0.5, 0.5, 0.5, -0.5, -1, 1, -1, 0.5, 1, 1, -1, 1, 0.5, 1],
  'demo-beta':    [0.5, 0.5, 0, 0.5, 0.5, 0, 0.5, -0.5, 1, 1, 0.5, 0, 0.5, 0, 0, 1, 0.5, -0.5, 1, 0.5, -0.5, 1, -0.5, 0, 0.5, -0.5, -0.5, 0.5, 0.5, 1],
  'demo-gamma':   [-0.5, -0.5, 0.5, -1, -1, 1, -0.5, 1, 0.5, 0.5, 0, 0.5, 0, 0.5, 1, 0.5, -0.5, -1, 1, 1, 0.5, 0, 0.5, -1, -0.5, -1, 1, -0.5, 1, 0.5],
  'demo-delta':   [-1, -1, 1, -1, -1, 1, -1, 1, -1, -1, -1, 1, -1, 1, 1, -1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, 1, 0, -0.5, -1],
  'demo-epsilon': [0.5, 0.5, null, 0.5, 0.5, null, 0.5, null, 0.5, 1, null, 0, 0.5, 0, null, 0.5, 1, 1, 0.5, null, null, 0.5, null, 1, 1, null, -0.5, 1, 0, 0.5],
};

export const demoSources: Source[] = demoParties.map((p) => ({
  id: `${p.id}-src`, party: p.id, type: 'demo', title: 'Dato ficticio de demostración', date: U,
}));

export const demoPositions: Position[] = Object.entries(table).flatMap(([party, values]) =>
  values.map((value, i) => ({
    party,
    question: `q${String(i + 1).padStart(2, '0')}`,
    value,
    confidence: 1,
    sourceId: value === null ? undefined : `${party}-src`,
    updatedAt: U,
  })),
);
