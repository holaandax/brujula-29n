import { intlLocale } from '../i18n';
import type { AnswerValue, Question } from '../types';
import { LIKERT } from './constants';
import { t } from '../i18n';

/** Texto legible para un valor de posición o respuesta. */
export function valueLabel(q: Question, v: AnswerValue | null | undefined): string {
  if (v === null || v === undefined) return t('No disponible');
  if (v === 'skip') return t('Sin respuesta');
  if (q.kind === 'choice' && q.options) {
    if (v < -0.25) return v <= -0.75 ? `A: ${t(q.options.a)}` : `${t('Más bien A')}: ${t(q.options.a)}`;
    if (v > 0.25) return v >= 0.75 ? `B: ${t(q.options.b)}` : `${t('Más bien B')}: ${t(q.options.b)}`;
    return t('Posición intermedia');
  }
  let best: (typeof LIKERT)[number] = LIKERT[2]!;
  for (const l of LIKERT) if (Math.abs(l.value - v) < Math.abs(best.value - v)) best = l;
  return best.label;
}

export function agreementLabel(sim: number): string {
  if (sim >= 0.875) return t('Coincidencia muy alta');
  if (sim >= 0.75) return t('Coincidencia alta');
  if (sim >= 0.5) return t('Coincidencia parcial');
  return t('Coincidencia baja');
}

export function pct(n: number, digits = 0): string {
  return `${n.toLocaleString(intlLocale(), { minimumFractionDigits: digits, maximumFractionDigits: digits })}%`;
}

/** Inicial del nombre y del último apellido: «Alberto Núñez Feijóo» → «AF». */
export const initials = (name: string) => {
  const w = name.split(/\s+/).filter((x) => /^[A-ZÁÉÍÓÚÑ]/.test(x));
  return w.length > 1 ? `${w[0]![0]}${w.at(-1)![0]}` : (w[0]?.[0] ?? '');
};
