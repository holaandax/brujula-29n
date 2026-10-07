import { describe, expect, it } from 'vitest';
import { absoluteMajority, hemicycle, tally, verdict, type Vote } from '../src/lib/pacts';
import { ELECTION_RESULTS, PACT_PRESETS } from '../src/data/results';

const r2023 = ELECTION_RESULTS.find((e) => e.id === '2023')!;
const votesFor = (yes: string[], abstain: string[] = []): Record<string, Vote> =>
  Object.fromEntries(r2023.results.map((r) => [r.party, yes.includes(r.party) ? 'si' : abstain.includes(r.party) ? 'abstencion' : 'no']));

describe('datos 2023', () => {
  it('los escaños suman 350', () => {
    expect(r2023.results.reduce((s, r) => s + r.seats, 0)).toBe(350);
  });
  it('los presets reproducen las votaciones reales', () => {
    const s = PACT_PRESETS.find((p) => p.id === 'sanchez-2023')!;
    expect(tally(r2023.results, votesFor(s.yes))).toEqual({ si: 179, abstencion: 0, no: 171 });
    const f = PACT_PRESETS.find((p) => p.id === 'feijoo-2023')!;
    expect(tally(r2023.results, votesFor(f.yes))).toEqual({ si: 172, abstencion: 0, no: 178 });
  });
});

describe('veredicto de investidura', () => {
  it('mayoría absoluta = 176 de 350', () => { expect(absoluteMajority(350)).toBe(176); });
  it('176 síes: primera votación', () => { expect(verdict({ si: 176, abstencion: 0, no: 174 }, 350).kind).toBe('absoluta'); });
  it('más síes que noes sin absoluta: segunda votación', () => {
    expect(verdict({ si: 150, abstencion: 60, no: 140 }, 350)).toEqual({ kind: 'simple', si: 150, no: 140, missingAbsolute: 26 });
  });
  it('empate o menos síes: fallida', () => {
    expect(verdict({ si: 170, abstencion: 10, no: 170 }, 350).kind).toBe('fallida');
    expect(verdict({ si: 172, abstencion: 0, no: 178 }, 350).kind).toBe('fallida');
  });
  it('un partido sin voto asignado cuenta como no', () => {
    expect(tally([{ party: 'x', seats: 10 }], {})).toEqual({ si: 0, abstencion: 0, no: 10 });
  });
});

describe('hemiciclo', () => {
  it('genera exactamente un punto por escaño, dentro del semicírculo', () => {
    for (const [n, rows] of [[350, 12], [350, 10], [7, 2]] as const) {
      const s = hemicycle(n, rows);
      expect(s).toHaveLength(n);
      for (const p of s) { expect(p.y).toBeGreaterThanOrEqual(-1e-9); expect(Math.hypot(p.x, p.y)).toBeLessThanOrEqual(1 + 1e-9); }
    }
  });
  it('ordena de izquierda a derecha', () => {
    const s = hemicycle(350, 12);
    expect(s[0]!.x).toBeLessThan(0);
    expect(s.at(-1)!.x).toBeGreaterThan(0);
  });
});
