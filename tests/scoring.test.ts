import { describe, expect, it } from 'vitest';
import type { Answers, Dataset } from '../src/types';
import { computeResults, similarity, scoreParty, numericAnswers } from '../src/lib/scoring';
import { SCORING } from '../src/config';
import { demoDataset } from '../src/data';

const U = '2026-01-01';
function mini(positions: Record<string, (number | null)[]>, weights = [1, 1, 1, 1]): Dataset {
  const parties = Object.keys(positions);
  return {
    meta: { id: 't', label: 't', mode: 'demo', updatedAt: U, notice: '' },
    topics: [
      { id: 'economia', name: 'E', description: '', weight: 1 },
      { id: 'social', name: 'S', description: '', weight: 1 },
    ],
    questions: weights.map((w, i) => ({
      id: `t${i}`, topic: i < 2 ? 'economia' : 'social', subtopic: `s${i}`, kind: 'likert', set: 'rapido', text: `Pregunta ${i}`, weight: w,
      axis: i < 2 ? { econ: 1 } : { social: 1 },
    })),
    parties: parties.map((id) => ({ id, name: id.toUpperCase(), shortName: id, acronym: id, description: '', scope: 'estatal', circunscripciones: 'all', status: 'ficticia', color: '#000', updatedAt: U })),
    sources: parties.map((id) => ({ id: `${id}-s`, party: id, type: 'demo', title: 'x' })),
    positions: Object.entries(positions).flatMap(([party, vals]) =>
      vals.map((value, i) => ({ party, question: `t${i}`, value, confidence: 1, sourceId: value === null ? undefined : `${party}-s`, updatedAt: U }))),
  };
}
const ans = (vals: (number | 'skip')[]): Answers => Object.fromEntries(vals.map((v, i) => [`t${i}`, v]));

describe('similarity', () => {
  it('es 1 con respuestas idénticas y 0 en extremos opuestos', () => {
    expect(similarity(1, 1)).toBe(1);
    expect(similarity(-1, 1)).toBe(0);
    expect(similarity(0, 0.5)).toBe(0.75);
  });
});

describe('ranking', () => {
  const ds = mini({ a: [1, 1, -1, -1], b: [-1, -1, 1, 1], c: [0, 0, 0, 0] });

  it('usuario totalmente alineado con A → A 100%', () => {
    const r = computeResults(ds, ans([1, 1, -1, -1]));
    expect(r.ranking[0]!.party.id).toBe('a');
    expect(r.ranking[0]!.score).toBe(100);
    expect(r.ranking.at(-1)!.party.id).toBe('b');
    expect(r.ranking.at(-1)!.score).toBe(0);
  });

  it('usuario totalmente alineado con B → B primero', () => {
    expect(computeResults(ds, ans([-1, -1, 1, 1])).ranking[0]!.party.id).toBe('b');
  });

  it('usuario centrista → C primero', () => {
    const r = computeResults(ds, ans([0, 0, 0, 0]));
    expect(r.ranking[0]!.party.id).toBe('c');
    expect(r.ranking[0]!.score).toBe(100);
  });

  it('usuario contradictorio (A en economía, B en social) → empate técnico A/B y lideran sus áreas', () => {
    const r = computeResults(ds, ans([1, 1, 1, 1]));
    const a = r.ranking.find((x) => x.party.id === 'a')!;
    const b = r.ranking.find((x) => x.party.id === 'b')!;
    expect(a.score).toBeCloseTo(b.score, 10);
    expect(r.topicLeaders.find((t) => t.topic === 'economia')!.leaders[0]!.party.id).toBe('a');
    expect(r.topicLeaders.find((t) => t.topic === 'social')!.leaders[0]!.party.id).toBe('b');
  });

  it('usuario neutral → empate técnico detectado sin forzar diferencias', () => {
    const d = mini({ a: [0.5, 0.5, 0.5, 0.5], b: [-0.5, -0.5, -0.5, -0.5] });
    const r = computeResults(d, ans([0, 0, 0, 0]));
    expect(r.isTie).toBe(true);
    expect(r.leaders.map((l) => l.party.id).sort()).toEqual(['a', 'b']);
  });

  it('diferencia > umbral no es empate', () => {
    const r = computeResults(ds, ans([1, 1, -1, -1]));
    expect(r.isTie).toBe(false);
    expect(r.leaders).toHaveLength(1);
  });

  it('es estable y reproducible', () => {
    const a1 = computeResults(ds, ans([0.5, -0.5, 1, 0]));
    const a2 = computeResults(ds, ans([0.5, -0.5, 1, 0]));
    expect(a1.ranking.map((r) => [r.party.id, r.score])).toEqual(a2.ranking.map((r) => [r.party.id, r.score]));
  });

  it('desempate determinista por nombre cuando la puntuación es idéntica', () => {
    const d = mini({ z: [1, 1, 1, 1], y: [1, 1, 1, 1] });
    expect(computeResults(d, ans([1, 1, 1, 1])).ranking.map((r) => r.party.id)).toEqual(['y', 'z']);
  });
});

describe('null = no disponible (nunca neutral)', () => {
  it('ignora preguntas sin posición y calcula cobertura', () => {
    const d = mini({ a: [1, null, null, 1], c: [0, 0, 0, 0] });
    const r = scoreParty(d, d.parties[0]!, numericAnswers(d, ans([1, 0, 0, 1])));
    expect(r.score).toBe(100);
    expect(r.used).toBe(2);
    expect(r.coverage).toBe(0.5);
    expect(r.lowCoverage).toBe(true);
  });

  it('si null se tratara como 0 el resultado sería distinto', () => {
    const withNull = mini({ a: [1, null, 1, 1] });
    const withZero = mini({ a: [1, 0, 1, 1] });
    const u = ans([1, 1, 1, 1]);
    expect(computeResults(withNull, u).ranking[0]!.score).toBe(100);
    expect(computeResults(withZero, u).ranking[0]!.score).toBeLessThan(100);
  });

  it('excluye del ranking a quien no llega a la cobertura mínima', () => {
    const d = mini({ a: [1, null, null, null], b: [1, 1, 1, 1] });
    const r = computeResults(d, ans([1, 1, 1, 1]));
    expect(r.ranking.map((x) => x.party.id)).toEqual(['b']);
    expect(r.excluded.map((x) => x.party.id)).toEqual(['a']);
  });

  it('partido sin ninguna posición no produce NaN', () => {
    const d = mini({ a: [null, null, null, null] });
    const r = computeResults(d, ans([1, 1, 1, 1]));
    expect(r.ranking).toHaveLength(0);
    expect(Number.isNaN(r.excluded[0]!.score)).toBe(false);
  });
});

describe('pesos', () => {
  it('una pregunta con más peso cuenta más', () => {
    const u = ans([1, -1, 'skip', 'skip']);
    const even = computeResults(mini({ a: [1, 1, 0, 0] }), u).ranking[0]!.score;
    const heavy = computeResults(mini({ a: [1, 1, 0, 0] }, [3, 1, 1, 1]), u).ranking[0]!.score;
    expect(even).toBe(50);
    expect(heavy).toBe(75);
  });

  it('la confianza de la fuente reduce el peso', () => {
    const d = mini({ a: [1, 1, 0, 0] });
    d.positions.find((p) => p.question === 't1')!.confidence = 0.5;
    const s = computeResults(d, ans([1, -1, 'skip', 'skip'])).ranking[0]!.score;
    expect(s).toBeCloseTo((1 * 1 + 0.5 * 0) / 1.5 * 100, 10);
  });
});

describe('importancia (test completo)', () => {
  it('marcar una pregunta como importante duplica su peso', () => {
    const d = mini({ a: [1, 1, 0, 0] });
    const u = ans([1, -1, 'skip', 'skip']);
    expect(computeResults(d, u).ranking[0]!.score).toBe(50);
    expect(computeResults(d, u, SCORING, undefined, { t0: true }).ranking[0]!.score).toBeCloseTo(200 / 3, 10);
  });
  it('importancia en una pregunta sin respuesta no cambia nada', () => {
    const d = mini({ a: [1, 1, 0, 0] });
    const u = ans([1, -1, 'skip', 'skip']);
    expect(computeResults(d, u, SCORING, undefined, { t3: true }).ranking[0]!.score).toBe(50);
  });
});

describe('casos límite', () => {
  it('sin respuestas: sin división por cero ni NaN', () => {
    const d = mini({ a: [1, 1, 1, 1] });
    const r = computeResults(d, {});
    expect(r.answered).toBe(0);
    expect(r.ranking).toHaveLength(0);
    expect(r.map.user).toBeNull();
  });

  it('respuestas "skip" se excluyen', () => {
    const d = mini({ a: [1, -1, 1, 1] });
    const r = computeResults(d, ans([1, 'skip', 'skip', 'skip']));
    expect(r.answered).toBe(1);
    expect(r.ranking[0]!.score).toBe(100);
  });

  it('valores fuera de rango se acotan', () => {
    const d = mini({ a: [1, 1, 1, 1] });
    expect(computeResults(d, ans([5, 5, 5, 5])).ranking[0]!.score).toBe(100);
  });

  it('todas las puntuaciones están en [0, 100] con el dataset demo', () => {
    const vals = [-1, -0.5, 0, 0.5, 1];
    for (let seed = 0; seed < 200; seed++) {
      const a: Answers = {};
      demoDataset.questions.forEach((q, i) => { a[q.id] = vals[(seed * 7 + i * 3 + seed * i) % 5]!; });
      const r = computeResults(demoDataset, a);
      for (const p of [...r.ranking, ...r.excluded]) {
        expect(Number.isFinite(p.score)).toBe(true);
        expect(p.score).toBeGreaterThanOrEqual(0);
        expect(p.score).toBeLessThanOrEqual(100);
      }
    }
  });

  it('las respuestas influyentes explican la ventaja del primero', () => {
    const r = computeResults(demoDataset, Object.fromEntries(demoDataset.questions.map((q) => [q.id, 1])));
    expect(r.influential.length).toBeGreaterThan(0);
    expect(r.influential.every((i) => Number.isFinite(i.impact))).toBe(true);
  });

  it('afinidad baja se marca', () => {
    const d = mini({ a: [1, 1, 1, 1] });
    const r = computeResults(d, ans([-0.5, -0.5, -0.5, -0.5]));
    expect(r.ranking[0]!.score).toBe(25);
    expect(r.isLowAffinity).toBe(true);
    expect(SCORING.lowAffinity).toBeGreaterThan(25);
  });

  it('mapa: coordenadas en [-1, 1]', () => {
    const d = mini({ a: [1, 1, -1, -1] });
    const r = computeResults(d, ans([1, 1, -1, -1]));
    expect(r.map.user).toMatchObject({ x: 1, y: -1 });
    expect(r.map.parties[0]).toMatchObject({ id: 'a', x: 1, y: -1 });
  });
});
