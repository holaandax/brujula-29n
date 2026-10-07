/**
 * Resultados oficiales del Congreso para la calculadora de pactos.
 * Fuente: Ministerio del Interior, resultados definitivos de las elecciones generales del 23 de julio de 2023
 * (escrutinio general, incluido el voto CERA). Porcentajes sobre voto válido, redondeados a un decimal.
 *
 * Para añadir 2026: otra entrada en ELECTION_RESULTS con los escaños proclamados. Los ids coinciden con
 * los de data/parties.ts cuando la formación es la misma, para reutilizar color y ficha.
 */
export interface SeatResult {
  party: string;
  name: string;
  shortName: string;
  seats: number;
  votePct: number;
  color: string;
  note?: string;
}

export interface ElectionResult {
  id: string;
  label: string;
  date: string;
  totalSeats: number;
  source: string;
  sourceUrl?: string;
  results: SeatResult[];
}

export const ELECTION_RESULTS: ElectionResult[] = [
  {
    id: '2023',
    label: 'Elecciones generales 2023',
    date: '2023-07-23',
    totalSeats: 350,
    source: 'Ministerio del Interior, resultados definitivos',
    sourceUrl: 'https://infoelectoral.interior.gob.es',
    results: [
      { party: 'pp', name: 'Partido Popular', shortName: 'PP', seats: 137, votePct: 33.1, color: '#1D84CE' },
      { party: 'psoe', name: 'Partido Socialista Obrero Español', shortName: 'PSOE', seats: 121, votePct: 31.7, color: '#E30613' },
      { party: 'vox', name: 'VOX', shortName: 'Vox', seats: 33, votePct: 12.4, color: '#63BE21' },
      { party: 'sumar', name: 'Sumar', shortName: 'Sumar', seats: 31, votePct: 12.3, color: '#E51C55', note: 'En 2023 Podemos concurrió dentro de Sumar.' },
      { party: 'erc', name: 'Esquerra Republicana de Catalunya', shortName: 'ERC', seats: 7, votePct: 1.9, color: '#F5A800' },
      { party: 'junts', name: 'Junts per Catalunya', shortName: 'Junts', seats: 7, votePct: 1.6, color: '#20B8AA' },
      { party: 'bildu', name: 'Euskal Herria Bildu', shortName: 'EH Bildu', seats: 6, votePct: 1.4, color: '#A6C83C' },
      { party: 'pnv', name: 'Partido Nacionalista Vasco', shortName: 'PNV', seats: 5, votePct: 1.1, color: '#1E7B3C' },
      { party: 'bng', name: 'Bloque Nacionalista Galego', shortName: 'BNG', seats: 1, votePct: 0.6, color: '#7DB8E0' },
      { party: 'cc', name: 'Coalición Canaria', shortName: 'CC', seats: 1, votePct: 0.5, color: '#F2CB05' },
      { party: 'upn', name: 'Unión del Pueblo Navarro', shortName: 'UPN', seats: 1, votePct: 0.2, color: '#2C4B9B' },
    ],
  },
];

/** Votaciones reales, como punto de partida de la calculadora. */
export const PACT_PRESETS: { id: string; label: string; detail: string; yes: string[]; abstain?: string[] }[] = [
  { id: 'sanchez-2023', label: 'Investidura de Sánchez', detail: '16 de noviembre de 2023: 179 síes y 171 noes.', yes: ['psoe', 'sumar', 'erc', 'junts', 'bildu', 'pnv', 'bng', 'cc'] },
  { id: 'feijoo-2023', label: 'Investidura de Feijóo', detail: '27 de septiembre de 2023: 172 síes y 178 noes.', yes: ['pp', 'vox', 'upn', 'cc'] },
];
