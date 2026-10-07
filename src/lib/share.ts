import type { Results } from './scoring';
import type { Dataset } from '../types';
import { APP } from '../config';
import { t as tr } from '../i18n';

/**
 * Resumen que el usuario decide compartir. Solo contiene el resultado agregado (partido y porcentajes),
 * nunca las respuestas individuales. No se envía a ningún servidor propio: se abre la app elegida.
 */
export function shareSummary(ds: Dataset, r: Results): string {
  const top = r.leaders;
  if (!top.length) return tr('He hecho el test de afinidad {app}.', { app: APP.name });
  const names = top.map((l) => `${l.party.shortName} (${Math.round(l.score)}%)`).join(` ${tr('y')} `);
  const head = r.isTie ? tr('Empate técnico en mi test de afinidad 29N: {names}.', { names }) : tr('Mi mayor coincidencia en el test de afinidad 29N: {names}.', { names });
  const areas = Object.values(top[0]!.topics)
    .filter((t) => t.score !== null)
    .sort((a, b) => b.score! - a.score!)
    .slice(0, 4)
    .map((t) => `${tr(ds.topics.find((x) => x.id === t.topic)!.name)}: ${Math.round(t.score!)}%`)
    .join('\n');
  const demo = ds.meta.mode === 'demo' ? `\n(${tr('Datos de demostración, candidaturas ficticias')})` : '';
  return `${head}\n${areas}${demo}\n${APP.siteUrl}`;
}

export const whatsappUrl = (text: string) => `https://wa.me/?text=${encodeURIComponent(text)}`;
export const xUrl = (text: string) => `https://x.com/intent/post?text=${encodeURIComponent(text)}`;

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
