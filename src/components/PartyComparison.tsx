import { useState } from 'react';
import { dataset } from '../data';
import type { Results } from '../lib/scoring';
import { pct, valueLabel } from '../lib/labels';

/** Comparador: tú frente a dos candidaturas, por área y por pregunta. */
export function PartyComparison({ res }: { res: Results }) {
  const opts = res.ranking;
  const [a, setA] = useState(opts[0]?.party.id ?? '');
  const [b, setB] = useState(opts[1]?.party.id ?? opts[0]?.party.id ?? '');
  const [detail, setDetail] = useState(false);
  const ra = opts.find((r) => r.party.id === a);
  const rb = opts.find((r) => r.party.id === b);
  if (!ra || !rb) return null;
  const cols = ra === rb ? [ra] : [ra, rb];

  return (
    <section className="section" aria-labelledby="h-cmp">
      <h2 id="h-cmp">Compara candidaturas</h2>
      <p className="lead">Elige dos y mira cuánto coincides con cada una en cada área.</p>
      <div className="compare-controls">
        <label>Candidatura 1
          <select className="select" value={a} onChange={(e) => setA(e.target.value)}>
            {opts.map((r) => <option key={r.party.id} value={r.party.id}>{r.party.shortName}</option>)}
          </select>
        </label>
        <label>Candidatura 2
          <select className="select" value={b} onChange={(e) => setB(e.target.value)}>
            {opts.map((r) => <option key={r.party.id} value={r.party.id}>{r.party.shortName}</option>)}
          </select>
        </label>
      </div>
      <div className="table-wrap">
        <table className="topic-table">
          <caption className="sr-only">Afinidad por área</caption>
          <thead><tr><th>Área</th>{cols.map((c) => <th key={c.party.id} className="num">{c.party.shortName}</th>)}</tr></thead>
          <tbody>
            {dataset.topics.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td>
                {cols.map((c) => {
                  const s = c.topics[t.id].score;
                  const best = cols.length === 2 && s !== null && cols.every((o) => (o.topics[t.id].score ?? -1) <= s) && cols.some((o) => o.topics[t.id].score !== s);
                  return <td key={c.party.id} className="num">{s === null ? '—' : best ? <strong>{pct(s)}</strong> : pct(s)}</td>;
                })}
              </tr>
            ))}
            <tr><th scope="row">Total</th>{cols.map((c) => <td key={c.party.id} className="num"><strong>{pct(c.score, 1)}</strong></td>)}</tr>
          </tbody>
        </table>
      </div>
      <button className="btn ghost" aria-expanded={detail} onClick={() => setDetail(!detail)} style={{ marginTop: '.6rem' }}>
        {detail ? 'Ocultar respuestas una a una' : 'Ver respuestas una a una'}
      </button>
      {detail && (
        <div className="table-wrap">
          <table className="topic-table">
            <thead><tr><th>Cuestión</th><th>Tú</th>{cols.map((c) => <th key={c.party.id}>{c.party.shortName}</th>)}</tr></thead>
            <tbody>
              {dataset.questions.map((q) => {
                const u = ra.questions.find((x) => x.questionId === q.id);
                return (
                  <tr key={q.id}>
                    <td>{q.subtopic}</td>
                    <td>{u ? valueLabel(q, u.user) : 'Sin respuesta'}</td>
                    {cols.map((c) => {
                      const pos = dataset.positions.find((p) => p.party === c.party.id && p.question === q.id);
                      return <td key={c.party.id}>{valueLabel(q, pos?.value ?? null)}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
