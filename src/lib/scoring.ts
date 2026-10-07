import type { Answers, Dataset, Importance, Party, Question, TopicId } from '../types';
import { SCORING } from '../config';

/**
 * ALGORITMO (documentado en docs/METODOLOGIA.md)
 *
 * 1. Usuario y partidos en la misma escala [-1, 1] por pregunta.
 * 2. Similitud por pregunta: s = 1 - |u - p| / 2  ∈ [0, 1]   (distancia normalizada al máximo posible, 2).
 * 3. Peso efectivo: w = pesoPregunta × pesoÁrea × confianzaFuente × importancia (1, o 2 si el usuario la marca).
 * 4. Afinidad = Σ(w·s) / Σ(w) sobre las preguntas que el usuario ha respondido Y para las que
 *    el partido tiene posición. Las posiciones null se excluyen (no se tratan como neutrales).
 * 5. Cobertura = preguntas usadas / preguntas respondidas. Por debajo de minCoverage, fuera del ranking.
 * 6. Orden determinista: afinidad ↓, cobertura ↓, nombre ↑.
 */

export type ScoringOptions = typeof SCORING;

export interface QuestionScore {
  questionId: string;
  user: number;
  party: number | null;
  /** null si el partido no tiene posición. */
  sim: number | null;
  weight: number;
}

export interface TopicScore {
  topic: TopicId;
  score: number | null;
  used: number;
  answered: number;
}

export interface PartyResult {
  party: Party;
  /** 0–100 sin redondear. */
  score: number;
  used: number;
  answered: number;
  coverage: number;
  lowCoverage: boolean;
  topics: Record<TopicId, TopicScore>;
  questions: QuestionScore[];
}

export interface Influence {
  questionId: string;
  /** Puntos de afinidad que esta respuesta aporta a la ventaja del primero sobre la media del resto. */
  impact: number;
  favours: string;
}

export interface WhyItem { questionId: string; user: number; party: number; sim: number }

export interface MapPoint { id: string; x: number; y: number }

export interface Results {
  answered: number;
  ranking: PartyResult[];
  excluded: PartyResult[];
  /** Candidaturas en empate técnico en primera posición (1 si no hay empate). */
  leaders: PartyResult[];
  isTie: boolean;
  isLowAffinity: boolean;
  topicLeaders: { topic: TopicId; leaders: PartyResult[]; score: number | null; isTie: boolean }[];
  why: WhyItem[];
  influential: Influence[];
  map: { user: MapPoint | null; parties: MapPoint[] };
}

export const similarity = (u: number, p: number): number => 1 - Math.abs(u - p) / 2;

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

export function numericAnswers(ds: Dataset, answers: Answers): Map<string, number> {
  const out = new Map<string, number>();
  for (const q of ds.questions) {
    const a = answers[q.id];
    if (typeof a === 'number' && Number.isFinite(a)) out.set(q.id, clamp(a));
  }
  return out;
}

function positionIndex(ds: Dataset) {
  const idx = new Map<string, { value: number | null; confidence: number }>();
  for (const p of ds.positions) idx.set(`${p.party}:${p.question}`, { value: p.value, confidence: p.confidence });
  return idx;
}

export function scoreParty(ds: Dataset, party: Party, user: Map<string, number>, opts: ScoringOptions = SCORING, importance: Importance = {}): PartyResult {
  const idx = positionIndex(ds);
  const topicW = new Map(ds.topics.map((t) => [t.id, t.weight]));
  const qs: QuestionScore[] = [];
  const agg = new Map<TopicId, { sw: number; w: number; used: number; answered: number }>();
  for (const t of ds.topics) agg.set(t.id, { sw: 0, w: 0, used: 0, answered: 0 });
  let sw = 0, wsum = 0, used = 0;

  for (const q of ds.questions) {
    const u = user.get(q.id);
    if (u === undefined) continue;
    const t = agg.get(q.topic)!;
    t.answered++;
    const pos = idx.get(`${party.id}:${q.id}`);
    const pv = pos && pos.value !== null && Number.isFinite(pos.value) ? clamp(pos.value) : null;
    const imp = importance[q.id] ? opts.importanceMultiplier : 1;
    const w = q.weight * (topicW.get(q.topic) ?? 1) * (pos?.confidence ?? 0) * imp;
    if (pv === null || !(w > 0)) {
      qs.push({ questionId: q.id, user: u, party: null, sim: null, weight: 0 });
      continue;
    }
    const s = similarity(u, pv);
    qs.push({ questionId: q.id, user: u, party: pv, sim: s, weight: w });
    sw += w * s; wsum += w; used++;
    t.sw += w * s; t.w += w; t.used++;
  }

  const answered = user.size;
  const coverage = answered > 0 ? used / answered : 0;
  const topics = {} as Record<TopicId, TopicScore>;
  for (const [id, a] of agg) topics[id] = { topic: id, score: a.w > 0 ? (a.sw / a.w) * 100 : null, used: a.used, answered: a.answered };

  return {
    party,
    score: wsum > 0 ? (sw / wsum) * 100 : 0,
    used, answered, coverage,
    lowCoverage: coverage < opts.lowCoverage,
    topics, questions: qs,
  };
}

export function compareResults(a: PartyResult, b: PartyResult): number {
  return b.score - a.score || b.coverage - a.coverage || a.party.name.localeCompare(b.party.name, 'es');
}

function tieGroup(sorted: PartyResult[], key: (r: PartyResult) => number | null, threshold: number): PartyResult[] {
  const first = sorted[0];
  if (!first) return [];
  const top = key(first);
  if (top === null) return [];
  return sorted.filter((r) => { const v = key(r); return v !== null && top - v <= threshold; });
}

/** Mapa simplificado: media ponderada de las preguntas con eje asignado. */
export function mapCoordinates(ds: Dataset, values: (q: Question) => number | null): { x: number; y: number } | null {
  let xs = 0, xw = 0, ys = 0, yw = 0;
  for (const q of ds.questions) {
    if (!q.axis) continue;
    const v = values(q);
    if (v === null) continue;
    if (q.axis.econ) { xs += q.axis.econ * v * q.weight; xw += q.weight; }
    if (q.axis.social) { ys += q.axis.social * v * q.weight; yw += q.weight; }
  }
  if (xw === 0 || yw === 0) return null;
  return { x: xs / xw, y: ys / yw };
}

export function computeResults(
  ds: Dataset, answers: Answers, opts: ScoringOptions = SCORING,
  partyFilter?: (p: Party) => boolean, importance: Importance = {},
): Results {
  const user = numericAnswers(ds, answers);
  const parties = partyFilter ? ds.parties.filter(partyFilter) : ds.parties;
  const all = parties.map((p) => scoreParty(ds, p, user, opts, importance)).sort(compareResults);
  const ranking = all.filter((r) => r.used > 0 && r.coverage >= opts.minCoverage);
  const excluded = all.filter((r) => !ranking.includes(r));

  const leaders = tieGroup(ranking, (r) => r.score, opts.tieThreshold);
  const leader = ranking[0];

  const topicLeaders = ds.topics.map((t) => {
    const sorted = ranking
      .filter((r) => r.topics[t.id].score !== null)
      .sort((a, b) => (b.topics[t.id].score! - a.topics[t.id].score!) || compareResults(a, b));
    const group = tieGroup(sorted, (r) => r.topics[t.id].score, opts.tieThreshold);
    return { topic: t.id, leaders: group, score: group[0]?.topics[t.id].score ?? null, isTie: group.length > 1 };
  });

  const why: WhyItem[] = leader
    ? leader.questions
        .filter((q): q is QuestionScore & { sim: number; party: number } => q.sim !== null && q.party !== null && q.sim >= 0.75)
        .sort((a, b) => b.sim * b.weight - a.sim * a.weight || b.sim - a.sim)
        .slice(0, 5)
        .map((q) => ({ questionId: q.questionId, user: q.user, party: q.party, sim: q.sim }))
    : [];

  const influential: Influence[] = [];
  if (leader && ranking.length > 1) {
    const others = ranking.slice(1);
    const totalW = leader.questions.reduce((s, q) => s + q.weight, 0) || 1;
    for (const q of leader.questions) {
      if (q.sim === null) continue;
      const otherSims = others.map((o) => o.questions.find((x) => x.questionId === q.questionId)?.sim).filter((s): s is number => s != null);
      if (!otherSims.length) continue;
      const mean = otherSims.reduce((a, b) => a + b, 0) / otherSims.length;
      const impact = ((q.sim - mean) * q.weight / totalW) * 100;
      if (Math.abs(impact) < 1e-9) continue;
      // Si resta ventaja al primero, ¿a quién favorece más?
      let favours = leader.party.id;
      if (impact < 0) {
        let best = -1;
        for (const o of others) {
          const s = o.questions.find((x) => x.questionId === q.questionId)?.sim;
          if (s != null && s > best) { best = s; favours = o.party.id; }
        }
      }
      influential.push({ questionId: q.questionId, impact, favours });
    }
    influential.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact) || a.questionId.localeCompare(b.questionId));
  }

  const idx = positionIndex(ds);
  const userPt = mapCoordinates(ds, (q) => user.get(q.id) ?? null);
  const partyPts = ranking.flatMap((r) => {
    const c = mapCoordinates(ds, (q) => idx.get(`${r.party.id}:${q.id}`)?.value ?? null);
    return c ? [{ id: r.party.id, ...c }] : [];
  });

  return {
    answered: user.size,
    ranking,
    excluded,
    leaders,
    isTie: leaders.length > 1,
    isLowAffinity: !!leader && leader.score < opts.lowAffinity,
    topicLeaders,
    why,
    influential: influential.slice(0, 6),
    map: { user: userPt ? { id: 'user', ...userPt } : null, parties: partyPts },
  };
}
