import { useMemo, useState } from 'react';
import { dataset } from '../data';
import { SCORING } from '../config';
import { computeResults, type PartyResult, type Results as R } from '../lib/scoring';
import { agreementLabel, pct, valueLabel } from '../lib/labels';
import { useCountUp } from '../lib/hooks';
import { href, navigate } from '../lib/router';
import { useQuiz } from '../state/quiz';
import { IdeologyChart } from './IdeologyChart';
import { PartyComparison } from './PartyComparison';
import { ShareSection } from './ShareSection';

const qById = new Map(dataset.questions.map((q) => [q.id, q]));
const topicName = (id: string) => dataset.topics.find((t) => t.id === id)?.name ?? id;
const partyById = new Map(dataset.parties.map((p) => [p.id, p]));

function Coverage({ r }: { r: PartyResult }) {
  if (r.used === r.answered) return null;
  return <>Afinidad calculada con {r.used} de {r.answered} cuestiones disponibles{r.lowCoverage ? ' (cobertura baja)' : ''}.</>;
}

function ResultHero({ res }: { res: R }) {
  const lead = res.leaders[0]!;
  const n = useCountUp(lead.score);
  const strongTopics = res.topicLeaders
    .filter((t) => t.leaders.some((l) => l.party.id === lead.party.id) && t.score !== null)
    .sort((a, b) => b.score! - a.score!)
    .slice(0, 3)
    .map((t) => topicName(t.topic).toLowerCase());

  if (res.isTie) {
    return (
      <div className="ballot result-hero">
        <div className="kicker">Tu mayor coincidencia</div>
        <span className="tie-badge">Empate técnico</span>
        <div className="tie-list">
          {res.leaders.map((l) => (
            <div key={l.party.id}>
              <p className="party">{l.party.shortName}</p>
              <p className="big" style={{ fontSize: 'clamp(2.4rem, 11vw, 4rem)' }}>{pct(l.score, 1)}<small>de coincidencia</small></p>
            </div>
          ))}
        </div>
        <p className="muted">La diferencia es inferior a {String(SCORING.tieThreshold).replace('.', ',')} puntos, así que no las ordenamos entre sí.</p>
      </div>
    );
  }
  return (
    <div className="ballot result-hero">
      <div className="kicker">{res.isLowAffinity ? 'Tu mayor coincidencia, aunque moderada' : 'Tu mayor coincidencia'}</div>
      <p className="party">{lead.party.shortName}</p>
      <p className="big" aria-label={`${pct(lead.score)} de coincidencia`}><span aria-hidden="true">{pct(n)}</span><small aria-hidden="true">de coincidencia</small></p>
      <p style={{ marginTop: '.8rem' }}>
        {res.isLowAffinity
          ? `Tu mayor coincidencia es ${lead.party.shortName}, con un ${pct(lead.score)}. Ninguna candidatura se acerca mucho a tu combinación de respuestas.`
          : strongTopics.length
            ? `Tus respuestas coinciden especialmente con las posiciones de ${lead.party.shortName} en ${joinEs(strongTopics)}.`
            : `Tus respuestas son las más cercanas a las posiciones documentadas de ${lead.party.shortName}.`}
      </p>
      <p className="muted small"><Coverage r={lead} /></p>
    </div>
  );
}

function joinEs(a: string[]): string {
  return a.length <= 1 ? (a[0] ?? '') : `${a.slice(0, -1).join(', ')} y ${a.at(-1)}`;
}

function PartyRanking({ res }: { res: R }) {
  return (
    <section className="section" aria-labelledby="h-rank">
      <h2 id="h-rank">Tu ranking</h2>
      <p className="lead">Todas las candidaturas del test, ordenadas por coincidencia con tus respuestas.</p>
      <ol className="ranking">
        {res.ranking.map((r, i) => (
          <li key={r.party.id} className="rank-row">
            <span className="pos">{i + 1}</span>
            <span className="name"><span className="swatch" style={{ background: r.party.color }} />{r.party.name}</span>
            <span className="val">{pct(r.score, 1)}</span>
            <span className="bar" aria-hidden="true"><i style={{ width: `${r.score}%`, background: r.party.color, animationDelay: `${i * 60}ms` }} /></span>
            {r.used < r.answered && <span className="meta"><Coverage r={r} /></span>}
          </li>
        ))}
      </ol>
      {res.excluded.length > 0 && (
        <p className="note">
          Sin datos suficientes para calcular afinidad: {res.excluded.map((r) => r.party.shortName).join(', ')}.
          Se necesita posición documentada en al menos el {Math.round(SCORING.minCoverage * 100)}% de tus respuestas.
        </p>
      )}
    </section>
  );
}

function TopicResults({ res }: { res: R }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section className="section" aria-labelledby="h-topics">
      <h2 id="h-topics">Tu afinidad por áreas</h2>
      <p className="lead">Tu resultado general puede no coincidir con el partido más cercano en cada área.</p>
      {res.topicLeaders.filter((t) => res.ranking[0]!.topics[t.topic].answered > 0).map((t) => {
        const isOpen = open === t.topic;
        const qs = dataset.questions.filter((q) => q.topic === t.topic && res.ranking[0]!.questions.some((x) => x.questionId === q.id));
        const lead = t.leaders[0];
        return (
          <div className="acc" key={t.topic} data-open={isOpen}>
            <button aria-expanded={isOpen} aria-controls={`p-${t.topic}`} onClick={() => setOpen(isOpen ? null : t.topic)}>
              <span className="t">{topicName(t.topic)}</span>
              <span className="chev" aria-hidden="true">⌄</span>
              <span className="w">
                {lead && t.score !== null
                  ? <>{t.isTie ? 'Empate técnico: ' : 'Mayor coincidencia: '}<strong>{t.leaders.map((l) => l.party.shortName).join(' / ')}</strong>, {pct(t.score)}{lead.topics[t.topic].used < lead.topics[t.topic].answered ? ` (con datos en ${lead.topics[t.topic].used} de ${lead.topics[t.topic].answered} cuestiones)` : ''}</>
                  : 'Sin respuestas o sin datos en esta área'}
              </span>
            </button>
            {isOpen && (
              <div className="panel" id={`p-${t.topic}`}>
                <div className="table-wrap">
                  <table className="topic-table">
                    <thead><tr><th>Cuestión</th>{res.ranking.slice(0, 4).map((r) => <th key={r.party.id} className="num">{r.party.shortName}</th>)}</tr></thead>
                    <tbody>
                      {qs.map((q) => (
                        <tr key={q.id}>
                          <td>{q.subtopic}</td>
                          {res.ranking.slice(0, 4).map((r) => {
                            const s = r.questions.find((x) => x.questionId === q.id);
                            return <td key={r.party.id} className="num">{s?.sim != null ? pct(s.sim * 100) : <span className="muted" title="Sin respuesta o sin dato">—</span>}</td>;
                          })}
                        </tr>
                      ))}
                      <tr>
                        <th scope="row">Área</th>
                        {res.ranking.slice(0, 4).map((r) => <td key={r.party.id} className="num"><strong>{r.topics[t.topic].score != null ? pct(r.topics[t.topic].score!) : '—'}</strong></td>)}
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="muted small" style={{ marginTop: '.6rem' }}>Se muestran las cuatro primeras del ranking. El comparador de abajo permite ver cualquier otra.</p>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

function WhyMatch({ res }: { res: R }) {
  const lead = res.leaders[0]!;
  return (
    <section className="section" aria-labelledby="h-why">
      <h2 id="h-why">¿Por qué coincides con {lead.party.shortName}?</h2>
      <p className="lead">Las cuestiones que más suman a tu coincidencia, según los mismos datos que usa el cálculo.</p>
      {res.why.length === 0 ? <p className="empty">No hay ninguna cuestión con coincidencia alta. Tu resultado se explica por coincidencias parciales repartidas.</p> : (
        <div className="why">
          {res.why.map((w) => {
            const q = qById.get(w.questionId)!;
            return (
              <article className="why-item" key={w.questionId}>
                <h3>{q.subtopic}</h3>
                <p className="small muted">{q.text}</p>
                <dl>
                  <dt>Tu respuesta</dt><dd>{valueLabel(q, w.user)}</dd>
                  <dt>{lead.party.shortName}</dt><dd>{valueLabel(q, w.party)}</dd>
                </dl>
                <span className="pill">{agreementLabel(w.sim)}</span>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function InfluentialAnswers({ res }: { res: R }) {
  const lead = res.leaders[0]!;
  if (res.ranking.length < 2) return null;
  return (
    <section className="section" aria-labelledby="h-infl">
      <h2 id="h-infl">Las respuestas que más han influido</h2>
      <p className="lead">Cuánto aporta cada respuesta a la distancia entre {lead.party.shortName} y la media del resto de candidaturas, en puntos de afinidad.</p>
      <ul className="infl">
        {res.influential.map((i) => {
          const q = qById.get(i.questionId)!;
          const fav = partyById.get(i.favours);
          return (
            <li key={i.questionId}>
              <span><strong>{q.subtopic}</strong>: {valueLabel(q, res.ranking[0]!.questions.find((x) => x.questionId === q.id)?.user)}</span>
              <span className="imp">{i.impact > 0 ? '+' : '−'}{Math.abs(i.impact).toLocaleString('es-ES', { maximumFractionDigits: 1 })}</span>
              <span className="sub">{i.impact > 0 ? `Te acerca a ${lead.party.shortName} frente al resto.` : `Te aleja de ${lead.party.shortName}; donde más coincides en esto es con ${fav?.shortName ?? '—'}.`}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function Results() {
  const { answers, importance, answeredCount, restart, goto, circunscripcion, mode, start } = useQuiz();
  const res = useMemo(() => computeResults(dataset, answers, SCORING, (p) =>
    !circunscripcion || p.circunscripciones === 'all' || p.circunscripciones.includes(circunscripcion), importance), [answers, circunscripcion, importance]);

  if (answeredCount < SCORING.minAnswers) {
    return (
      <main id="contenido" className="wrap narrow">
        <h1>Aún no hay resultado</h1>
        <p>Necesitas responder al menos {SCORING.minAnswers} preguntas. Las respuestas solo existen mientras la pestaña está abierta, así que al recargar la página se borran.</p>
        <a className="btn primary big" href={href('inicio')}>Elegir test</a>
      </main>
    );
  }
  if (!res.ranking.length) {
    return (
      <main id="contenido" className="wrap narrow">
        <h1>Tu afinidad política</h1>
        <div className="empty">
          <h2>Todavía no hay posiciones verificadas</h2>
          <p>{dataset.meta.notice}</p>
          <p>Ninguna candidatura tiene datos suficientes para compararla con tus respuestas. Preferimos no mostrar un resultado antes que rellenar posiciones sin fuente.</p>
          <a className="btn" href={href('fuentes')}>Ver estado de las fuentes</a>
        </div>
      </main>
    );
  }

  return (
    <main id="contenido" className="wrap">
      <h1 className="results-title">Tu afinidad política</h1>
      <ResultHero res={res} />
      <PartyRanking res={res} />
      <TopicResults res={res} />
      <WhyMatch res={res} />
      <InfluentialAnswers res={res} />
      <IdeologyChart res={res} />
      <PartyComparison res={res} />
      <section className="section" aria-labelledby="h-src">
        <h2 id="h-src">Fuentes y metodología</h2>
        <p className="lead">Cada posición del cálculo enlaza con su documento de origen.</p>
        <div className="row">
          <a className="btn" href={href('fuentes')}>Fuentes y programas</a>
          <a className="btn" href={href('datos')}>Ver datos utilizados</a>
          <a className="btn" href={href('metodologia')}>Cómo se calcula</a>
        </div>
        <p className="note">
          El resultado representa la similitud entre tus respuestas y las posiciones políticas documentadas que utiliza este test.
          Las posiciones y programas pueden evolucionar y no todas las cuestiones políticas pueden resumirse en {dataset.questions.length} preguntas.
        </p>
      </section>
      <ShareSection res={res} />
      <section className="section">
        <div className="row">
          <button className="btn primary" onClick={() => { restart(); navigate('test'); }}>Repetir el test</button>
          <button className="btn" onClick={() => { goto(0); navigate('test'); }}>Revisar mis respuestas</button>
          {mode === 'rapido' && <button className="btn" onClick={() => { start('completo'); navigate('test'); }}>Hacer el test completo</button>}
        </div>
      </section>
    </main>
  );
}
