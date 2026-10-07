/**
 * Datos del proceso electoral. Fuente del calendario: Real Decreto de disolución y convocatoria
 * publicado en el BOE el 6 de octubre de 2026 (comprobar el número de BOE y actualizar BOE_URL).
 */
export const ELECTION = {
  name: 'Elecciones generales',
  date: '2026-11-29',
  chambers: ['Congreso de los Diputados', 'Senado'] as const,
  calendar: [
    { date: '2026-10-06', label: 'Publicación del decreto de convocatoria en el BOE' },
    { date: '2026-10-16', label: 'Último día para comunicar coaliciones' },
    { date: '2026-10-26', label: 'Fin del plazo de presentación de candidaturas' },
    { date: '2026-11-03', label: 'Publicación en el BOE de las candidaturas proclamadas' },
    { date: '2026-11-13', label: 'Inicio de la campaña electoral' },
    { date: '2026-11-29', label: 'Jornada electoral' },
  ],
  /** Rellenar con la URL del BOE una vez verificada. Vacío = no se muestra enlace. */
  BOE_URL: '',
};

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
