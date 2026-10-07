import type { SourceType } from '../types';

/** Confianza por defecto según el tipo de fuente (prioridad de fuentes del brief). */
export const SOURCE_CONFIDENCE: Record<SourceType, number> = {
  programa: 1,
  documento_programatico: 1,
  web_oficial: 0.9,
  documento_oficial: 0.9,
  declaracion_oficial: 0.7,
  secundaria: 0.5,
  demo: 1,
};

export const SOURCE_TYPE_LABEL: Record<SourceType, string> = {
  programa: 'Programa electoral',
  documento_programatico: 'Documento programático',
  web_oficial: 'Web oficial',
  documento_oficial: 'Documento oficial',
  declaracion_oficial: 'Propuesta o intervención oficial',
  secundaria: 'Fuente secundaria (apoyo)',
  demo: 'Dato ficticio',
};

export const LIKERT = [
  { value: -1, label: 'Muy en desacuerdo', short: 'Muy en desacuerdo' },
  { value: -0.5, label: 'En desacuerdo', short: 'En desacuerdo' },
  { value: 0, label: 'Neutral / No lo tengo claro', short: 'Neutral' },
  { value: 0.5, label: 'De acuerdo', short: 'De acuerdo' },
  { value: 1, label: 'Muy de acuerdo', short: 'Muy de acuerdo' },
] as const;

/** Aviso de privacidad del test (portada y primera pregunta). Decir «tus respuestas», no «tus datos». */
export const PRIVACY_TAGS = ['Resultado al momento', 'Sin registro', 'Anónimo'];
export const PRIVACY_LINE = 'Tus respuestas no salen de tu navegador y no las guardamos en ningún sitio.';
