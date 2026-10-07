import type { Question } from '../types';

/**
 * 20 preguntas del test rápido + 10 adicionales del test completo (set: 'completo'). Revisión de sesgo aplicada a cada enunciado (ver docs/METODOLOGIA.md §2):
 * sin adjetivos valorativos, sin partidos, sin presuponer que la medida es buena o mala,
 * y con el coste o la contrapartida explícitos cuando procede.
 * Para kind 'choice', A = -1 y B = +1.
 */
export const questions: Question[] = [
  {
    id: 'q01', topic: 'economia', subtopic: 'Impuestos y gasto', kind: 'choice', weight: 1, set: 'rapido',
    text: '¿Qué priorizarías?',
    options: {
      a: 'Bajar impuestos, aunque implique reducir el gasto público.',
      b: 'Mantener o aumentar el gasto público, aunque implique mantener o subir impuestos.',
    },
    axis: { econ: -1 },
  },
  {
    id: 'q02', topic: 'economia', subtopic: 'Fiscalidad del patrimonio', kind: 'likert', weight: 1, set: 'rapido',
    text: 'Las personas con patrimonios muy elevados deberían pagar más impuestos que ahora.',
    axis: { econ: -1 },
  },
  {
    id: 'q03', topic: 'economia', subtopic: 'Déficit y deuda', kind: 'likert', weight: 1, set: 'rapido',
    text: 'Reducir el déficit y la deuda pública debería ser prioritario, aunque obligue a recortar gastos.',
    axis: { econ: 1 },
  },
  {
    id: 'q04', topic: 'economia', subtopic: 'Jornada laboral', kind: 'likert', weight: 1, set: 'rapido',
    text: 'La ley debería reducir la jornada laboral máxima sin que baje el salario.',
    axis: { econ: -1 },
  },
  {
    id: 'q05', topic: 'vivienda', subtopic: 'Precio del alquiler', kind: 'likert', weight: 1, set: 'rapido',
    text: 'Las administraciones deberían poder limitar el precio del alquiler en zonas con precios muy altos.',
    axis: { econ: -1 },
  },
  {
    id: 'q06', topic: 'vivienda', subtopic: 'Suelo y regulación', kind: 'choice', weight: 1, set: 'rapido',
    text: 'Para que la vivienda sea más accesible, ¿qué priorizarías?',
    options: {
      a: 'Más regulación del mercado y más vivienda pública.',
      b: 'Liberar suelo y reducir trámites para construir más.',
    },
    axis: { econ: 1 },
  },
  {
    id: 'q07', topic: 'servicios', subtopic: 'Gestión sanitaria', kind: 'likert', weight: 1, set: 'rapido',
    text: 'Debería limitarse que empresas privadas gestionen servicios sanitarios financiados con dinero público.',
    axis: { econ: -1 },
  },
  {
    id: 'q08', topic: 'servicios', subtopic: 'Elección de centro educativo', kind: 'likert', weight: 1, set: 'rapido',
    text: 'La financiación pública de la educación debería seguir a la elección de las familias, incluidos los centros concertados.',
    axis: { econ: 1 },
  },
  {
    id: 'q09', topic: 'social', subtopic: 'Igualdad', kind: 'likert', weight: 1, set: 'rapido',
    text: 'Deberían existir medidas obligatorias, como planes de igualdad o cuotas, para reducir la desigualdad entre hombres y mujeres.',
    axis: { social: -1 },
  },
  {
    id: 'q10', topic: 'social', subtopic: 'Eutanasia', kind: 'likert', weight: 1, set: 'rapido',
    text: 'La eutanasia debería seguir siendo legal en los supuestos que regula la ley actual.',
    axis: { social: -1 },
  },
  {
    id: 'q11', topic: 'social', subtopic: 'Cambio de sexo registral', kind: 'likert', weight: 1, set: 'rapido',
    text: 'Una persona adulta debería poder cambiar su sexo en el Registro Civil sin necesidad de informes médicos.',
    axis: { social: -1 },
  },
  {
    id: 'q12', topic: 'inmigracion', subtopic: 'Control migratorio', kind: 'likert', weight: 1, set: 'rapido',
    text: 'España debería aplicar un control más estricto de la inmigración irregular, con más devoluciones a los países de origen.',
    axis: { social: 1 },
  },
  {
    id: 'q13', topic: 'inmigracion', subtopic: 'Regularización', kind: 'likert', weight: 1, set: 'rapido',
    text: 'Debería existir una vía para regularizar a las personas extranjeras que ya viven y trabajan en España sin papeles.',
    axis: { social: -1 },
  },
  {
    id: 'q14', topic: 'seguridad', subtopic: 'Penas y reincidencia', kind: 'likert', weight: 1, set: 'rapido',
    text: 'Deberían endurecerse las penas para quienes cometen delitos de forma reincidente.',
    axis: { social: 1 },
  },
  {
    id: 'q15', topic: 'medioambiente', subtopic: 'Energía nuclear', kind: 'likert', weight: 1, set: 'rapido',
    text: 'Las centrales nucleares deberían seguir funcionando más allá del calendario de cierre previsto.',
  },
  {
    id: 'q16', topic: 'medioambiente', subtopic: 'Emisiones', kind: 'likert', weight: 1, set: 'rapido',
    text: 'Deberían mantenerse los objetivos de reducción de emisiones aunque supongan costes para algunos sectores económicos.',
    axis: { econ: -1 },
  },
  {
    id: 'q17', topic: 'territorial', subtopic: 'Competencias', kind: 'choice', weight: 1, set: 'rapido',
    text: '¿Hacia dónde debería ir la organización territorial del Estado?',
    options: {
      a: 'Que el Estado central recupere algunas competencias.',
      b: 'Que las comunidades autónomas tengan más competencias y autogobierno.',
    },
  },
  {
    id: 'q18', topic: 'territorial', subtopic: 'Referéndum', kind: 'likert', weight: 1, set: 'rapido',
    text: 'Una comunidad autónoma debería poder celebrar un referéndum sobre su independencia si lo pide su parlamento.',
  },
  {
    id: 'q19', topic: 'europa', subtopic: 'Integración europea', kind: 'likert', weight: 1, set: 'rapido',
    text: 'La Unión Europea debería tener más competencias propias, aunque los Estados cedan parte de su soberanía.',
  },
  {
    id: 'q20', topic: 'exterior', subtopic: 'Gasto en defensa', kind: 'likert', weight: 1, set: 'rapido',
    text: 'España debería aumentar su gasto en defensa hasta los objetivos acordados en la OTAN.',
  },
  // ——— Solo test completo ———
  {
    id: 'q21', topic: 'pensiones', subtopic: 'Edad de jubilación', kind: 'likert', weight: 1, set: 'completo',
    text: 'Debería retrasarse la edad de jubilación para garantizar la sostenibilidad de las pensiones.',
    axis: { econ: 1 },
  },
  {
    id: 'q22', topic: 'pensiones', subtopic: 'Renta mínima', kind: 'likert', weight: 1, set: 'completo',
    text: 'El Estado debería garantizar unos ingresos mínimos a cualquier persona sin recursos suficientes.',
    axis: { econ: -1 },
  },
  {
    id: 'q23', topic: 'economia', subtopic: 'Sucesiones', kind: 'likert', weight: 1, set: 'completo',
    text: 'El impuesto de sucesiones debería suprimirse o reducirse al mínimo en toda España.',
    axis: { econ: 1 },
  },
  {
    id: 'q24', topic: 'lengua', subtopic: 'Lengua en la escuela', kind: 'likert', weight: 1, set: 'completo',
    text: 'En las comunidades con lengua cooficial, esa lengua debería ser la principal en la enseñanza.',
  },
  {
    id: 'q25', topic: 'lengua', subtopic: 'Lenguas en las instituciones', kind: 'likert', weight: 1, set: 'completo',
    text: 'Las lenguas cooficiales deberían poder usarse en el Congreso y en los organismos del Estado.',
  },
  {
    id: 'q26', topic: 'instituciones', subtopic: 'Monarquía o república', kind: 'likert', weight: 1, set: 'completo',
    text: 'Debería celebrarse un referéndum para elegir entre monarquía y república.',
  },
  {
    id: 'q27', topic: 'instituciones', subtopic: 'Elección del CGPJ', kind: 'choice', weight: 1, set: 'completo',
    text: '¿Quién debería elegir a la mayoría de los miembros del Consejo General del Poder Judicial?',
    options: { a: 'Las Cortes Generales.', b: 'Los propios jueces y magistrados.' },
  },
  {
    id: 'q28', topic: 'rural', subtopic: 'Ayudas agrarias', kind: 'likert', weight: 1, set: 'completo',
    text: 'Las ayudas al campo deberían concentrarse en pequeñas explotaciones, aunque las grandes reciban menos.',
    axis: { econ: -1 },
  },
  {
    id: 'q29', topic: 'rural', subtopic: 'Renovables y suelo', kind: 'likert', weight: 1, set: 'completo',
    text: 'Deberían facilitarse nuevas plantas solares y eólicas aunque ocupen suelo agrícola o natural.',
  },
  {
    id: 'q30', topic: 'social', subtopic: 'Aborto', kind: 'likert', weight: 1, set: 'completo',
    text: 'La regulación actual del aborto debería mantenerse como está.',
    axis: { social: -1 },
  },
];
