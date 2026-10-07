/**
 * FUENTE ÚNICA DE VERDAD para hechos electorales (calendario, candidatos, convocatoria).
 * Las fuentes de posiciones políticas siguen en positions.ts (ligadas a cada partido).
 *
 * tier: 1 oficial · 2 documento oficial · 3 medio de comunicación fiable · 4 otras.
 * Un hecho apoyado solo en tier 3 se muestra siempre como «según <medio>», nunca como dato oficial.
 */
export interface ElectoralSource {
  id: string;
  title: string;
  entity: string;
  url: string;
  date: string;
  tier: 1 | 2 | 3 | 4;
  description?: string;
}

export const electoralSources: ElectoralSource[] = [
  {
    id: 'rd-806-2026', tier: 1, entity: 'Boletín Oficial del Estado', date: '2026-10-06',
    title: 'Real Decreto 806/2026, de 5 de octubre, de disolución del Congreso de los Diputados y del Senado y de convocatoria de elecciones',
    url: 'https://www.boe.es/boe/dias/2026/10/06/pdfs/BOE-A-2026-20742.pdf',
    description: 'BOE núm. 248. Fija la votación (29/11), la campaña (13–27/11) y la sesión constitutiva de las Cámaras (23/12, 10:00).',
  },
  {
    id: 'loreg', tier: 1, entity: 'Boletín Oficial del Estado', date: '1985-06-20',
    title: 'Ley Orgánica 5/1985, de 19 de junio, del Régimen Electoral General (texto consolidado)',
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-1985-11672',
    description: 'Plazos que se cuentan desde la convocatoria: censo, candidaturas, voto por correo, encuestas y escrutinio.',
  },
  {
    id: 'boe-candidaturas-2023', tier: 1, entity: 'Boletín Oficial del Estado', date: '2023-06-27',
    title: 'Candidaturas proclamadas para las elecciones al Congreso de los Diputados y al Senado convocadas por Real Decreto 400/2023',
    url: 'https://www.boe.es/boe/dias/2023/06/27/pdfs/BOE-A-2023-15066.pdf',
    description: 'BOE núm. 152. Fuente de quién encabezó cada lista en las generales de 2023.',
  },
  {
    id: 'infobae-20261005', tier: 3, entity: 'Infobae (Europa Press)', date: '2026-10-05',
    title: 'Coalición Canaria (CC) propone a Cristina Valido como candidata al Congreso',
    url: 'https://www.infobae.com/espana/agencias/2026/10/05/coalicion-canaria-cc-propone-a-cristina-valido-como-candidata-al-congreso/',
  },
  {
    id: 'eldebate-20261005', tier: 3, entity: 'El Debate', date: '2026-10-05',
    title: '¿Quiénes podrían ser los candidatos en las elecciones generales del próximo 29N?',
    url: 'https://www.eldebate.com/espana/20261005/quienes-podrian-candidatos-elecciones-generales-proximo-29n_466293.html',
  },
  {
    id: 'deia-20261006', tier: 3, entity: 'Deia', date: '2026-10-06',
    title: 'Los partidos mueven ficha para el 29N: Junqueras apuesta por Rufián y Nogueras busca repetir',
    url: 'https://www.deia.eus/politica/2026/10/06/partidos-mueven-ficha-29n-junqueras-11624261.html',
  },
  {
    id: 'articulo14-20261005', tier: 3, entity: 'Artículo 14', date: '2026-10-05',
    title: '¿Quiénes son los 8 posibles candidatos a liderar el Frente Amplio el 29N?',
    url: 'https://www.articulo14.es/politica/quienes-son-los-8-posibles-candidatos-a-liderar-el-frente-amplio-el-29n-20261005.html',
  },
];

export const electoralSource = (id: string) => electoralSources.find((s) => s.id === id);
