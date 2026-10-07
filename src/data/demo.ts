import type { Party, Position, Proposal, Source } from '../types';

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

/** Propuestas ficticias por área para el comparador. Coherentes con las posiciones de arriba. */
const pr = (party: string, topic: Proposal['topic'], text: string): Proposal => ({ party, topic, text, sourceId: `${party}-src` });
export const demoProposals: Proposal[] = [
  pr('demo-alfa', 'economia', 'Nuevo tramo del IRPF para rentas superiores a 300.000 euros anuales.'),
  pr('demo-alfa', 'economia', 'Jornada laboral máxima de 35 horas semanales sin reducción de salario en 2028.'),
  pr('demo-alfa', 'vivienda', 'Topes al alquiler en todas las zonas tensionadas, revisables cada año.'),
  pr('demo-alfa', 'vivienda', 'Parque público de 500.000 viviendas en alquiler social en diez años.'),
  pr('demo-alfa', 'servicios', 'Revertir a gestión pública los hospitales con concesión privada al vencer sus contratos.'),
  pr('demo-alfa', 'inmigracion', 'Regularización extraordinaria de personas que lleven dos años residiendo en España.'),
  pr('demo-alfa', 'medioambiente', 'Cierre de las centrales nucleares según el calendario actual, sin prórrogas.'),
  pr('demo-beta', 'economia', 'Mantener la presión fiscal y destinar el aumento de recaudación a sanidad y educación.'),
  pr('demo-beta', 'vivienda', 'Avales públicos para la entrada de la primera vivienda de menores de 35 años.'),
  pr('demo-beta', 'servicios', 'Ley de plazos máximos garantizados en listas de espera quirúrgicas.'),
  pr('demo-beta', 'inmigracion', 'Ampliar las vías legales de contratación en origen.'),
  pr('demo-beta', 'medioambiente', 'Reducir un 55% las emisiones en 2030 con ayudas a la industria para electrificarse.'),
  pr('demo-gamma', 'economia', 'Deflactar el IRPF cada año según la inflación.'),
  pr('demo-gamma', 'vivienda', 'Reclasificar suelo público para vivienda protegida y acortar las licencias a seis meses.'),
  pr('demo-gamma', 'servicios', 'Cheque escolar para que las familias elijan centro, público o concertado.'),
  pr('demo-gamma', 'medioambiente', 'Prorrogar la vida útil de las centrales nucleares hasta 2045.'),
  pr('demo-delta', 'economia', 'Rebaja general del IRPF y supresión del impuesto de patrimonio.'),
  pr('demo-delta', 'economia', 'Techo de gasto vinculante para alcanzar el equilibrio presupuestario en cuatro años.'),
  pr('demo-delta', 'vivienda', 'Eliminar los topes al alquiler y agilizar los desalojos de viviendas ocupadas.'),
  pr('demo-delta', 'inmigracion', 'Endurecer los requisitos de arraigo y aumentar las devoluciones.'),
  pr('demo-delta', 'medioambiente', 'Nuevas centrales nucleares y revisión de los objetivos de emisiones.'),
  pr('demo-epsilon', 'economia', 'Concierto económico propio con capacidad normativa sobre todos los impuestos.'),
  pr('demo-epsilon', 'vivienda', 'Competencias plenas de vivienda para la comunidad autónoma.'),
];
