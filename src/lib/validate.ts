import { SCORING } from '../config';
import type { Dataset, Position, Proposal } from '../types';

export interface Issue { level: 'error' | 'warning'; code: string; message: string }

export function isValidHttpsUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && u.hostname.includes('.');
  } catch {
    return false;
  }
}

/** Validación completa. Se usa en los tests (falla el build de CI) y en runtime para sanear. */
export function validateDataset(ds: Dataset): Issue[] {
  const issues: Issue[] = [];
  const err = (code: string, message: string) => issues.push({ level: 'error', code, message });
  const warn = (code: string, message: string) => issues.push({ level: 'warning', code, message });

  const topicIds = new Set(ds.topics.map((t) => t.id));
  const dupes = <T,>(arr: T[]) => arr.filter((x, i) => arr.indexOf(x) !== i);

  dupes(ds.topics.map((t) => t.id)).forEach((id) => err('topic.duplicate', `Área duplicada: ${id}`));
  dupes(ds.parties.map((p) => p.id)).forEach((id) => err('party.duplicate', `Partido duplicado: ${id}`));
  dupes(ds.parties.map((p) => p.name.toLowerCase())).forEach((n) => err('party.duplicateName', `Nombre de partido duplicado: ${n}`));
  dupes(ds.questions.map((q) => q.id)).forEach((id) => err('question.duplicate', `Pregunta duplicada: ${id}`));
  dupes(ds.questions.map((q) => q.text.trim().toLowerCase() + (q.options?.a ?? ''))).forEach((t) => err('question.duplicateText', `Texto de pregunta duplicado: ${t}`));
  dupes(ds.sources.map((s) => s.id)).forEach((id) => err('source.duplicate', `Fuente duplicada: ${id}`));

  for (const t of ds.topics) if (!(t.weight > 0)) err('topic.weight', `Peso de área no válido: ${t.id}`);

  for (const q of ds.questions) {
    if (!topicIds.has(q.topic)) err('question.topic', `${q.id}: categoría inexistente "${q.topic}"`);
    if (!(q.weight > 0)) err('question.weight', `${q.id}: peso no válido`);
    if (q.kind === 'choice' && (!q.options?.a || !q.options?.b)) err('question.options', `${q.id}: pregunta de elección sin opciones A/B`);
    if (!q.text.trim()) err('question.text', `${q.id}: texto vacío`);
  }

  for (const p of ds.parties) {
    if (ds.meta.mode === 'real' && p.isDemo) err('party.demoInReal', `${p.id}: partido ficticio en dataset real`);
    if (ds.meta.mode === 'real' && p.status === 'ficticia') err('party.status', `${p.id}: estado "ficticia" en dataset real`);
    for (const link of [p.website, p.program]) {
      if (!link) continue;
      if (!isValidHttpsUrl(link.url)) err('party.url', `${p.id}: URL no válida ${link.url}`);
      else if (!link.verified) warn('party.urlUnverified', `${p.id}: URL sin verificar ${link.url}`);
    }
  }

  const partyIds = new Set(ds.parties.map((p) => p.id));
  const questionIds = new Set(ds.questions.map((q) => q.id));
  const sourceById = new Map(ds.sources.map((s) => [s.id, s]));

  for (const s of ds.sources) {
    if (!partyIds.has(s.party)) err('source.party', `${s.id}: partido inexistente ${s.party}`);
    if (s.url && !isValidHttpsUrl(s.url)) err('source.url', `${s.id}: URL no válida ${s.url}`);
    if (ds.meta.mode === 'real' && s.type === 'demo') err('source.demoInReal', `${s.id}: fuente ficticia en dataset real`);
    if (ds.meta.mode === 'real' && !s.url && s.type !== 'demo') warn('source.noUrl', `${s.id}: fuente sin URL`);
  }

  const seen = new Set<string>();
  for (const pos of ds.positions) {
    const key = `${pos.party}:${pos.question}`;
    if (seen.has(key)) err('position.duplicate', `Posición duplicada ${key}`);
    seen.add(key);
    issues.push(...validatePosition(pos, partyIds, questionIds, sourceById));
  }

  for (const pr of ds.proposals) issues.push(...validateProposal(pr, partyIds, topicIds, sourceById, ds.meta.mode));

  if (ds.meta.mode === 'real') {
    for (const p of ds.parties) {
      const n = ds.positions.filter((x) => x.party === p.id && x.value !== null).length;
      if (n === 0) warn('party.noPositions', `${p.id}: sin posiciones verificadas`);
    }
  }
  return issues;
}

function validateProposal(
  pr: Proposal,
  partyIds: Set<string>,
  topicIds: Set<string>,
  sourceById: Map<string, { party: string; type: string }>,
  mode: Dataset['meta']['mode'],
): Issue[] {
  const out: Issue[] = [];
  const key = `${pr.party}:${pr.topic}`;
  if (!partyIds.has(pr.party)) out.push({ level: 'error', code: 'proposal.party', message: `${key}: partido inexistente` });
  if (!topicIds.has(pr.topic)) out.push({ level: 'error', code: 'proposal.topic', message: `${key}: área inexistente` });
  if (!pr.text.trim()) out.push({ level: 'error', code: 'proposal.text', message: `${key}: propuesta sin texto` });
  if (!pr.sourceId) {
    if (mode === 'real') out.push({ level: 'error', code: 'proposal.noSource', message: `${key}: propuesta sin fuente` });
  } else {
    const src = sourceById.get(pr.sourceId);
    if (!src) out.push({ level: 'error', code: 'proposal.sourceMissing', message: `${key}: fuente inexistente ${pr.sourceId}` });
    else if (src.party !== pr.party) out.push({ level: 'error', code: 'proposal.sourceParty', message: `${key}: la fuente ${pr.sourceId} es de otro partido` });
  }
  return out;
}

function validatePosition(
  pos: Position,
  partyIds: Set<string>,
  questionIds: Set<string>,
  sourceById: Map<string, { party: string }>,
): Issue[] {
  const out: Issue[] = [];
  const key = `${pos.party}:${pos.question}`;
  if (!partyIds.has(pos.party)) out.push({ level: 'error', code: 'position.party', message: `${key}: partido inexistente` });
  if (!questionIds.has(pos.question)) out.push({ level: 'error', code: 'position.question', message: `${key}: pregunta inexistente` });
  if (pos.value !== null) {
    if (typeof pos.value !== 'number' || !Number.isFinite(pos.value) || pos.value < -1 || pos.value > 1)
      out.push({ level: 'error', code: 'position.range', message: `${key}: valor fuera de rango (${String(pos.value)})` });
    if (!pos.sourceId) out.push({ level: 'error', code: 'position.noSource', message: `${key}: posición sin fuente` });
    else {
      const src = sourceById.get(pos.sourceId);
      if (!src) out.push({ level: 'error', code: 'position.sourceMissing', message: `${key}: fuente inexistente ${pos.sourceId}` });
      else if (src.party !== pos.party) out.push({ level: 'error', code: 'position.sourceParty', message: `${key}: la fuente pertenece a otro partido` });
    }
  }
  if (pos.estimated && pos.confidence > SCORING.maxEstimatedConfidence)
    out.push({ level: 'error', code: 'position.estimatedConfidence', message: `${key}: posición estimada con confianza > ${SCORING.maxEstimatedConfidence}` });
  if (!Number.isFinite(pos.confidence) || pos.confidence <= 0 || pos.confidence > 1)
    out.push({ level: 'error', code: 'position.confidence', message: `${key}: confianza fuera de (0, 1]` });
  return out;
}

/**
 * Saneado en runtime: descarta posiciones inválidas (no rompe la app) y elimina duplicados.
 * El usuario nunca ve errores técnicos; se registran en consola para mantenimiento.
 */
export function sanitizeDataset(ds: Dataset): { dataset: Dataset; issues: Issue[] } {
  const issues = validateDataset(ds);
  const partyIds = new Set(ds.parties.map((p) => p.id));
  const questionIds = new Set(ds.questions.map((q) => q.id));
  const topicIds = new Set(ds.topics.map((t) => t.id));
  const sourceById = new Map(ds.sources.map((s) => [s.id, s]));
  const seen = new Set<string>();

  const questions = ds.questions.filter((q, i, arr) =>
    topicIds.has(q.topic) && q.weight > 0 && arr.findIndex((x) => x.id === q.id) === i &&
    (q.kind !== 'choice' || (q.options?.a && q.options?.b)));
  const parties = ds.parties.filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i);
  const positions = ds.positions.filter((pos) => {
    const key = `${pos.party}:${pos.question}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return validatePosition(pos, partyIds, questionIds, sourceById).every((x) => x.level !== 'error');
  });

  const proposals = ds.proposals.filter((pr) =>
    validateProposal(pr, partyIds, topicIds, sourceById, ds.meta.mode).every((x) => x.level !== 'error'));

  const errors = issues.filter((i) => i.level === 'error');
  if (errors.length && typeof console !== 'undefined') console.warn('[dataset] entradas descartadas:', errors);
  return { dataset: { ...ds, questions, parties, positions, proposals }, issues };
}
