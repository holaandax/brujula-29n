/**
 * Datos del proceso electoral.
 *
 * CALENDARIO PROVISIONAL: fechas de trabajo pendientes de contrastar con el Real Decreto de
 * convocatoria (BOE 06/10/2026) y con la Junta Electoral Central. Mientras calendarProvisional
 * sea true, la web lo indica junto al calendario. Al verificarlas, cambiar a false y rellenar BOE_URL.
 */
export type CalendarPhase = 'convocatoria' | 'candidaturas' | 'voto-correo' | 'campana' | 'votacion' | 'despues';

export interface CalendarEvent {
  date: string;
  /** Último día, si es un plazo. */
  end?: string;
  label: string;
  detail?: string;
  phase: CalendarPhase;
  /** Aparece en la cuenta atrás de la portada. */
  key?: boolean;
}

export const PHASES: Record<CalendarPhase, string> = {
  convocatoria: 'Convocatoria',
  candidaturas: 'Candidaturas',
  'voto-correo': 'Voto por correo',
  campana: 'Campaña',
  votacion: 'Votación',
  despues: 'Después del 29N',
};

export const ELECTION = {
  name: 'Elecciones generales',
  date: '2026-11-29',
  chambers: ['Congreso de los Diputados', 'Senado'] as const,
  calendarProvisional: true,
  calendar: [
    { date: '2026-10-06', label: 'Publicación del decreto de convocatoria en el BOE', detail: 'Se disuelven el Congreso y el Senado y se constituye la Diputación Permanente.', phase: 'convocatoria', key: true },
    { date: '2026-10-06', end: '2026-11-19', label: 'Plazo para pedir el voto por correo', detail: 'En cualquier oficina de Correos o en su web, con DNI electrónico o certificado digital.', phase: 'voto-correo', key: true },
    { date: '2026-10-13', end: '2026-10-20', label: 'Consulta del censo electoral', detail: 'Puedes comprobar que estás inscrito y reclamar si hay algún error.', phase: 'convocatoria' },
    { date: '2026-10-16', label: 'Último día para comunicar coaliciones', phase: 'candidaturas', key: true },
    { date: '2026-10-21', end: '2026-10-26', label: 'Presentación de candidaturas', detail: 'Los partidos entregan sus listas a las juntas electorales provinciales.', phase: 'candidaturas', key: true },
    { date: '2026-10-28', label: 'Publicación en el BOE de las candidaturas presentadas', phase: 'candidaturas' },
    { date: '2026-11-03', label: 'Proclamación de candidaturas en el BOE', detail: 'A partir de aquí se conoce la lista definitiva de candidaturas en cada provincia.', phase: 'candidaturas', key: true },
    { date: '2026-11-09', end: '2026-11-22', label: 'Envío a casa de la documentación del voto por correo', phase: 'voto-correo' },
    { date: '2026-11-13', label: 'Empieza la campaña electoral', detail: 'Arranca a las 00:00 y dura 15 días.', phase: 'campana', key: true },
    { date: '2026-11-23', label: 'Último día para publicar encuestas', phase: 'campana' },
    { date: '2026-11-26', label: 'Último día para entregar el voto por correo en Correos', detail: 'Hay que identificarse al entregarlo.', phase: 'voto-correo', key: true },
    { date: '2026-11-27', label: 'Termina la campaña electoral', detail: 'A las 24:00 del viernes.', phase: 'campana' },
    { date: '2026-11-28', label: 'Jornada de reflexión', phase: 'votacion', key: true },
    { date: '2026-11-29', label: 'Jornada electoral', detail: 'Los colegios abren de 9:00 a 20:00.', phase: 'votacion', key: true },
    { date: '2026-12-02', label: 'Escrutinio general', detail: 'Las juntas electorales revisan y validan los resultados provisionales.', phase: 'despues' },
    { date: '2026-12-23', label: 'Constitución de las nuevas Cortes', phase: 'despues', key: true },
  ] satisfies CalendarEvent[] as CalendarEvent[],
  /** Rellenar con la URL del BOE una vez verificada. Vacío = no se muestra enlace. */
  BOE_URL: '',
};

/** Días naturales entre hoy y una fecha (negativo si ya pasó). */
export function daysUntil(iso: string, today = new Date()): number {
  const [y, m, d] = iso.split('-').map(Number);
  const target = Date.UTC(y!, m! - 1, d!);
  const now = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((target - now) / 86_400_000);
}

/** Próximo hito clave (o en curso) a partir de hoy. */
export function nextKeyEvent(today = new Date()): CalendarEvent | undefined {
  return ELECTION.calendar.find((e) => e.key && daysUntil(e.end ?? e.date, today) >= 0 && daysUntil(e.date, today) >= 0)
    ?? ELECTION.calendar.find((e) => e.key && daysUntil(e.end ?? e.date, today) >= 0);
}

/** 52 circunscripciones del Congreso (código INE de provincia). */
export const circunscripciones: { code: string; name: string }[] = [
  ['01', 'Araba/Álava'], ['02', 'Albacete'], ['03', 'Alicante/Alacant'], ['04', 'Almería'],
  ['05', 'Ávila'], ['06', 'Badajoz'], ['07', 'Illes Balears'], ['08', 'Barcelona'],
  ['09', 'Burgos'], ['10', 'Cáceres'], ['11', 'Cádiz'], ['12', 'Castellón/Castelló'],
  ['13', 'Ciudad Real'], ['14', 'Córdoba'], ['15', 'A Coruña'], ['16', 'Cuenca'],
  ['17', 'Girona'], ['18', 'Granada'], ['19', 'Guadalajara'], ['20', 'Gipuzkoa'],
  ['21', 'Huelva'], ['22', 'Huesca'], ['23', 'Jaén'], ['24', 'León'], ['25', 'Lleida'],
  ['26', 'La Rioja'], ['27', 'Lugo'], ['28', 'Madrid'], ['29', 'Málaga'], ['30', 'Murcia'],
  ['31', 'Navarra'], ['32', 'Ourense'], ['33', 'Asturias'], ['34', 'Palencia'],
  ['35', 'Las Palmas'], ['36', 'Pontevedra'], ['37', 'Salamanca'],
  ['38', 'Santa Cruz de Tenerife'], ['39', 'Cantabria'], ['40', 'Segovia'], ['41', 'Sevilla'],
  ['42', 'Soria'], ['43', 'Tarragona'], ['44', 'Teruel'], ['45', 'Toledo'],
  ['46', 'Valencia/València'], ['47', 'Valladolid'], ['48', 'Bizkaia'], ['49', 'Zamora'],
  ['50', 'Zaragoza'], ['51', 'Ceuta'], ['52', 'Melilla'],
].map(([code, name]) => ({ code: code as string, name: name as string }));
