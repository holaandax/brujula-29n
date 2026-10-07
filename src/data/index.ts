import type { Dataset } from '../types';
import { APP } from '../config';
import { topics } from './topics';
import { questions } from './questions';
import { realParties } from './parties';
import { realPositions, realProposals, realSources } from './positions';
import { demoParties, demoPositions, demoProposals, demoSources } from './demo';
import { sanitizeDataset } from '../lib/validate';

export const realDataset: Dataset = {
  meta: {
    id: 'real-2026', label: 'Candidaturas 29N (en verificación)', mode: 'real', updatedAt: '2026-10-07',
    notice: 'Las candidaturas se proclaman el 3 de noviembre. Las posiciones se añaden a medida que se verifican en fuentes primarias.',
  },
  topics, questions, parties: realParties, positions: realPositions, sources: realSources, proposals: realProposals,
};

export const demoDataset: Dataset = {
  meta: {
    id: 'demo', label: 'Datos de demostración', mode: 'demo', updatedAt: '2026-10-07',
    notice: 'Estás usando candidaturas ficticias. Sirven para probar el test; no representan a ningún partido real.',
  },
  topics, questions, parties: demoParties, positions: demoPositions, sources: demoSources, proposals: demoProposals,
};

/** Dataset activo, saneado: entradas inválidas se descartan en lugar de romper la app. */
export const { dataset, issues: datasetIssues } = sanitizeDataset(APP.dataset === 'real' ? realDataset : demoDataset);
