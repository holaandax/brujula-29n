import { describe, expect, it } from 'vitest';
import { demoDataset, realDataset } from '../src/data';
import { validateDataset, sanitizeDataset } from '../src/lib/validate';
import type { Dataset } from '../src/types';

describe.each([['demo', demoDataset], ['real', realDataset]] as const)('dataset %s', (_name, ds) => {
  const issues = validateDataset(ds);
  it('no tiene errores de validación', () => {
    expect(issues.filter((i) => i.level === 'error')).toEqual([]);
  });
  it('20 preguntas en el test rápido, 30 en el completo y todas las áreas cubiertas', () => {
    expect(ds.questions.filter((q) => q.set === 'rapido')).toHaveLength(20);
    expect(ds.questions).toHaveLength(30);
    for (const t of ds.topics) expect(ds.questions.some((q) => q.topic === t.id)).toBe(true);
  });
});

it('el dataset real no contiene partidos ni fuentes ficticias', () => {
  expect(realDataset.parties.some((p) => p.isDemo || p.status === 'ficticia')).toBe(false);
  expect(realDataset.sources.some((s) => s.type === 'demo')).toBe(false);
});

it('informe de datos pendientes del dataset real', () => {
  const w = validateDataset(realDataset).filter((i) => i.level === 'warning');
  // Se espera que haya avisos mientras falten posiciones/URLs por verificar.
  console.info(`Avisos dataset real: ${w.length}`);
  expect(Array.isArray(w)).toBe(true);
});

describe('el validador detecta problemas', () => {
  const broken = (): Dataset => structuredClone(demoDataset);
  const codes = (ds: Dataset) => validateDataset(ds).filter((i) => i.level === 'error').map((i) => i.code);

  it('partido duplicado', () => { const d = broken(); d.parties.push({ ...d.parties[0]!, name: 'Otro' }); expect(codes(d)).toContain('party.duplicate'); });
  it('pregunta duplicada', () => { const d = broken(); d.questions.push({ ...d.questions[0]! }); expect(codes(d)).toContain('question.duplicate'); });
  it('posición fuera de rango', () => { const d = broken(); d.positions[0]!.value = 1.5; expect(codes(d)).toContain('position.range'); });
  it('posición NaN', () => { const d = broken(); d.positions[0]!.value = NaN; expect(codes(d)).toContain('position.range'); });
  it('categoría inexistente', () => { const d = broken(); (d.questions[0] as { topic: string }).topic = 'nada'; expect(codes(d)).toContain('question.topic'); });
  it('fuente ausente', () => { const d = broken(); delete d.positions[0]!.sourceId; expect(codes(d)).toContain('position.noSource'); });
  it('URL inválida', () => { const d = broken(); d.parties[0]!.website = { url: 'javascript:alert(1)', verified: true }; expect(codes(d)).toContain('party.url'); });
  it('posición estimada con confianza alta', () => { const d = broken(); d.positions[0]!.estimated = true; expect(codes(d)).toContain('position.estimatedConfidence'); });
  it('null con fuente es válido (no se trata como error)', () => { const d = broken(); d.positions[0]!.value = null; expect(codes(d)).toEqual([]); });
  it('el saneado descarta posiciones inválidas sin romper', () => {
    const d = broken(); d.positions[0]!.value = 7;
    const { dataset } = sanitizeDataset(d);
    expect(dataset.positions).toHaveLength(d.positions.length - 1);
  });
});
