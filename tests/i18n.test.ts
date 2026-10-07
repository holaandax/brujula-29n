import { afterEach, describe, expect, it } from 'vitest';
import { DICTS, t, __setLocale } from '../src/i18n';
import { dataset } from '../src/data';
import { ELECTION } from '../src/data/electoral';
import { valueLabel } from '../src/lib/labels';

/** Textos literales que la interfaz pasa a t()/tr(). */
const sources = import.meta.glob(['../src/**/*.ts', '../src/**/*.tsx', '!../src/i18n/**'], { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const used = new Set<string>();
for (const code of Object.values(sources)) {
  for (const m of code.matchAll(/\b(?:t|tr)\(\s*'((?:[^'\\]|\\.)*)'/g)) used.add(m[1]!);
}
const content = [
  ...dataset.topics.flatMap((x) => [x.name, x.description]),
  ...dataset.questions.flatMap((q) => [q.text, q.subtopic, q.options?.a, q.options?.b].filter((x): x is string => !!x)),
  ...ELECTION.calendar.map((e) => e.label),
  dataset.meta.notice,
];

afterEach(() => __setLocale('es'));

describe.each(Object.entries(DICTS))('idioma %s', (_l, dict) => {
  it('tiene traducción para todos los textos de la interfaz traducida', () => {
    expect([...used].filter((k) => !(k in dict))).toEqual([]);
  });
  it('tiene traducción para preguntas, áreas y calendario', () => {
    expect(content.filter((k) => !(k in dict))).toEqual([]);
  });
  it('conserva las variables {x} de cada texto', () => {
    const vars = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join();
    expect(Object.entries(dict).filter(([k, v]) => vars(k) !== vars(v)).map(([k]) => k)).toEqual([]);
  });
});

it('encuentra los textos de la interfaz', () => expect(used.size).toBeGreaterThan(150));

describe('t()', () => {
  it('sin traducción devuelve el castellano, nunca una clave vacía', () => {
    __setLocale('ca');
    expect(t('Texto que no existe')).toBe('Texto que no existe');
  });
  it('sustituye variables', () => {
    __setLocale('ca');
    expect(t('Pregunta {n} de {total}', { n: 3, total: 20 })).toBe('Pregunta 3 de 20');
  });
  it('las etiquetas de respuesta siguen el idioma activo', () => {
    const q = dataset.questions.find((x) => x.kind === 'likert')!;
    __setLocale('gl');
    expect(valueLabel(q, 1)).toBe('Moi de acordo');
    __setLocale('es');
    expect(valueLabel(q, 1)).toBe('Muy de acuerdo');
  });
});
