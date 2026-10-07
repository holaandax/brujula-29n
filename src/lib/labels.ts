import type { AnswerValue, Question } from '../types';
import { LIKERT } from './constants';

/** Texto legible para un valor de posición o respuesta. */
export function valueLabel(q: Question, v: AnswerValue | null | undefined): string {
  if (v === null || v === undefined) return 'No disponible';
  if (v === 'skip') return 'Sin respuesta';
  if (q.kind === 'choice' && q.options) {
    if (v < -0.25) return v <= -0.75 ? `A: ${q.options.a}` : `Más bien A: ${q.options.a}`;
    if (v > 0.25) return v >= 0.75 ? `B: ${q.options.b}` : `Más bien B: ${q.options.b}`;
    return 'Posición intermedia';
  }
  let best: (typeof LIKERT)[number] = LIKERT[2];
  for (const l of LIKERT) if (Math.abs(l.value - v) < Math.abs(best.value - v)) best = l;
  return best.label;
}

export function agreementLabel(sim: number): string {
  if (sim >= 0.875) return 'Coincidencia muy alta';
  if (sim >= 0.75) return 'Coincidencia alta';
  if (sim >= 0.5) return 'Coincidencia parcial';
  return 'Coincidencia baja';
}

export function pct(n: number, digits = 0): string {
  return `${n.toLocaleString('es-ES', { minimumFractionDigits: digits, maximumFractionDigits: digits })}%`;
}
