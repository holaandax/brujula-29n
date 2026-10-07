import type { SourceType } from '../types';
import { t } from '../i18n';

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

const L = (value: number, es: string, short: string) => ({ value, get label() { return t(es); }, get short() { return t(short); } });
/** Las etiquetas se traducen al leerlas (getter), así siguen el idioma activo. */
export const LIKERT = [
  L(-1, 'Muy en desacuerdo', 'Muy en desacuerdo'),
  L(-0.5, 'En desacuerdo', 'En desacuerdo'),
  L(0, 'Neutral / No lo tengo claro', 'Neutral'),
  L(0.5, 'De acuerdo', 'De acuerdo'),
  L(1, 'Muy de acuerdo', 'Muy de acuerdo'),
] as const;

/** Aviso de privacidad del test (portada y primera pregunta). Decir «tus respuestas», no «tus datos». */
export const privacyTags = () => [t('Resultado al momento'), t('Sin registro'), t('Anónimo')];
/** @deprecated usar privacyTags() */
export const PRIVACY_TAGS = ['Resultado al momento', 'Sin registro', 'Anónimo'];
export const PRIVACY_LINE = 'Tus respuestas no salen de tu navegador y no las guardamos en ningún sitio.';
export const privacyLine = () => t(PRIVACY_LINE);
