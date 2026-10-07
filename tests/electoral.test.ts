import { describe, expect, it } from 'vitest';
import { candidates } from '../src/data/candidates';
import { electoralSources } from '../src/data/sources-electoral';
import { realParties } from '../src/data/parties';
import { ELECTION } from '../src/data/electoral';
import { ELECTION_RESULTS } from '../src/data/results';
import { APP } from '../src/config';

describe('integridad de datos electorales', () => {
  it('el dataset por defecto es el real', () => expect(APP.dataset).toBe('real'));

  it('cada candidato apunta a un partido y a una fuente existentes', () => {
    for (const c of candidates) {
      expect(realParties.some((p) => p.id === c.party), c.party).toBe(true);
      expect(electoralSources.some((s) => s.id === c.sourceId), c.sourceId).toBe(true);
    }
  });

  it('sin nombre por suposición: solo hay nombre si está anunciado o proclamado', () => {
    for (const c of candidates) expect(!!c.name, c.party).toBe(c.status !== 'pendiente');
  });

  it('un candidato proclamado necesita fuente oficial', () => {
    for (const c of candidates.filter((x) => x.status === 'proclamado'))
      expect(electoralSources.find((s) => s.id === c.sourceId)!.tier).toBeLessThanOrEqual(2);
  });

  it('fuentes: ids únicos y URLs https', () => {
    const ids = electoralSources.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of electoralSources) expect(new URL(s.url).protocol).toBe('https:');
  });

  it('calendario: fechas del Real Decreto 806/2026', () => {
    const has = (d: string) => ELECTION.calendar.some((e) => e.date === d);
    expect(ELECTION.date).toBe('2026-11-29');
    ['2026-10-06', '2026-11-13', '2026-11-29', '2026-12-23'].forEach((d) => expect(has(d), d).toBe(true));
    expect(ELECTION.BOE_URL).toContain('BOE-A-2026-20742');
  });

  it('resultados históricos 2023 suman 350 escaños', () => {
    for (const r of ELECTION_RESULTS) expect(r.results.reduce((a, b) => a + b.seats, 0)).toBe(r.totalSeats);
  });
});

describe('fotos de candidatos', () => {
  const pics = candidates.flatMap((c) => [c, ...(c.previous ? [c.previous] : [])]).filter((x) => x.photo);
  const files = new Set(Object.keys(import.meta.glob('../public/candidatos/*.jpg')).map((k) => k.replace('../public', '')));

  it('cada foto existe en public/ y tiene autor, licencia y enlace a Wikimedia Commons', () => {
    expect(pics.length).toBeGreaterThanOrEqual(10);
    for (const x of pics) {
      expect(files.has(x.photo!), x.photo).toBe(true);
      expect(x.photoCredit?.author && x.photoCredit.license, x.photo).toBeTruthy();
      expect(x.photoCredit!.url).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
    }
  });

  it('la referencia de 2023 solo aparece cuando no hay candidato confirmado', () => {
    for (const c of candidates.filter((x) => x.previous)) expect(c.status, c.party).toBe('pendiente');
  });
});
