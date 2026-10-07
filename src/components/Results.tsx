import { intlLocale } from '../i18n';
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
import { AdSlot } from './AdSlot';
import { t, t as tr } from '../i18n';

const qById = new Map(dataset.questions.map((q) => [q.id, q]));
const topicName = (id: string) => t(dataset.topics.find((x) => x.id === id)?.name ?? id);
const partyById = new Map(dataset.parties.map((p) => [p.id, p]));

function Coverage({ r }: { r: PartyResult }) {
  if (r.used === r.answered) return null;
  return <>{r.lowCoverage ? t('Afinidad calculada con {a} de {b} cuestiones disponibles (cobertura baja).', { a: r.used, b: r.answered }) : t('Afinidad calculada con {a} de {b} cuestiones disponibles.', { a: r.used, b: r.answered })}</>;
}

function ResultHero({ res }: { res: R }) {
  const lead = res.leaders[0]!;
  const n = useCountUp(lead.score);
  const strongTopics = res.topicLeaders
    .filter((x) => x.leaders.some((l) => l.party.id === lead.party.id) && x.score !== null)
    .sort((a, b) => b.score! - a.score!)
    .slice(0, 3)
    .map((x) => topicName(x.topic).toLowerCase());

  if (res.isTie) {
    return (
      <div className="ballot result-hero">
        <div className="kicker">{t('Tu mayor coincidencia')}</div>
        <span className="tie-badge">{t('Empate técnico')}</span>
        <div className="tie-list">
          {res.leaders.map((l) => (
            <div key={l.party.id}>
              <p className="party">{l.party.shortName}</p>
              <p className="big" style={{ fontSize: 'clamp(2.4rem, 11vw, 4rem)' }}>{pct(l.score, 1)}<small>{t('de coincidencia')}</small></p>
            </div>
          ))}
        </div>
        <p className="muted">{t('La diferencia es inferior a {n} puntos, así que no las ordenamos entre sí.', { n: String(SCORING.tieThreshold).replace('.', ',') })}</p>
      </div>
    );
  }
  return (
    <div className="ballot result-hero">
      <div className="kicker">{res.isLowAffinity ? t('Tu mayor coincidencia, aunque moderada') : t('Tu mayor coincidencia')}</div>
      <p className="party">{lead.party.shortName}</p>
      <p className="big" aria-label={`${pct(lead.score)} ${t('de coincidencia')}`}><span aria-hidden="true">{pct(n)}</span><small aria-hidden="true">{t('de coincidencia')}</small></p>
      <p style={{ marginTop: '.8rem' }}>
        {res.isLowAffinity
          ? t('Tu mayor coincidencia es {p}, con un {s}. Ninguna candidatura se acerca mucho a tu combinación de respuestas.', { p: lead.party.shortName, s: pct(lead.score) })
          : strongTopics.length
            ? t('Tus respuestas coinciden especialmente con las posiciones de {p} en {topics}.', { p: lead.party.shortName, topics: joinEs(strongTopics) })
            : t('Tus respuestas son las más cercanas a las posiciones documentadas de {p}.', { p: lead.party.shortName })}
      </p>
      <p className="muted small"><Coverage r={lead} /></p>
    </div>
  );
}

function joinEs(a: string[]): string {
  return a.length <= 1 ? (a[0] ?? '') : `${a.slice(0, -1).join(', ')} ${t('y')} ${a.at(-1)}`;
}

function PartyRanking({ res }: { res: R }) {
  return (
    <section className="section" aria-labelledby="h-rank">
      <h2 id="h-rank">{t('Tu ranking')}</h2>
      <p className="lead">{t('Todas las candidaturas del test, ordenadas por coincidencia con tus respuestas.')}</p>
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
          {t('Sin datos suficientes para calcular afinidad: {list}. Se necesita posición documentada en al menos el {n}% de tus respuestas.', { list: res.excluded.map((r) => r.party.shortName).join(', '), n: Math.round(SCORING.minCoverage * 100) })}
        </p>
      )}
    </section>
  );
}

function TopicResults({ res }: { res: R }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section className="section" aria-labelledby="h-topics">
      <h2 id="h-topics">{t('Tu afinidad por áreas')}</h2>
      <p className="lead">{t('Tu resultado general puede no coincidir con el partido más cercano en cada área.')}</p>
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
                  ? <>{t.isTie ? `${tr('Empate técnico')}: ` : `${tr('Mayor coincidencia')}: `}<strong>{t.leaders.map((l) => l.party.shortName).join(' / ')}</strong>, {pct(t.score)}{lead.topics[t.topic].used < lead.topics[t.topic].answered ? ` ${tr('(con datos en {a} de {b} cuestiones)', { a: lead.topics[t.topic].used, b: lead.topics[t.topic].answered })}` : ''}</>
                  : tr('Sin respuestas o sin datos en esta área')}
              </span>
            </button>
            {isOpen && (
              <div className="panel" id={`p-${t.topic}`}>
                <div className="table-wrap">
                  <table className="topic-table">
                    <thead><tr><th>{tr('Cuestión')}</th>{res.ranking.slice(0, 4).map((r) => <th key={r.party.id} className="num">{r.party.shortName}</th>)}</tr></thead>
                    <tbody>
                      {qs.map((q) => (
                        <tr key={q.id}>
                          <td>{tr(q.subtopic)}</td>
                          {res.ranking.slice(0, 4).map((r) => {
                            const s = r.questions.find((x) => x.questionId === q.id);
                            return <td key={r.party.id} className="num">{s?.sim != null ? pct(s.sim * 100) : <span className="muted" title={tr('Sin respuesta o sin dato')}>—</span>}</td>;
                          })}
                        </tr>
                      ))}
                      <tr>
                        <th scope="row">{tr('Área')}</th>
                        {res.ranking.slice(0, 4).map((r) => <td key={r.party.id} className="num"><strong>{r.topics[t.topic].score != null ? pct(r.topics[t.topic].score!) : '—'}</strong></td>)}
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="muted small" style={{ marginTop: '.6rem' }}>{tr('Se muestran las cuatro primeras del ranking. El comparador de abajo permite ver cualquier otra.')}</p>
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
      <h2 id="h-why">{t('¿Por qué coincides con {p}?', { p: lead.party.shortName })}</h2>
      <p className="lead">{t('Las cuestiones que más suman a tu coincidencia, según los mismos datos que usa el cálculo.')}</p>
      {res.why.length === 0 ? <p className="empty">{t('No hay ninguna cuestión con coincidencia alta. Tu resultado se explica por coincidencias parciales repartidas.')}</p> : (
        <div className="why">
          {res.why.map((w) => {
            const q = qById.get(w.questionId)!;
            return (
              <article className="why-item" key={w.questionId}>
                <h3>{t(q.subtopic)}</h3>
                <p className="small muted">{t(q.text)}</p>
                <dl>
                  <dt>{t('Tu respuesta')}</dt><dd>{valueLabel(q, w.user)}</dd>
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
      <h2 id="h-infl">{t('Las respuestas que más han influido')}</h2>
      <p className="lead">{t('Cuánto aporta cada respuesta a la distancia entre {p} y la media del resto de candidaturas, en puntos de afinidad.', { p: lead.party.shortName })}</p>
      <ul className="infl">
        {res.influential.map((i) => {
          const q = qById.get(i.questionId)!;
          const fav = partyById.get(i.favours);
          return (
            <li key={i.questionId}>
              <span><strong>{t(q.subtopic)}</strong>: {valueLabel(q, res.ranking[0]!.questions.find((x) => x.questionId === q.id)?.user)}</span>
              <span className="imp">{i.impact > 0 ? '+' : '−'}{Math.abs(i.impact).toLocaleString(intlLocale(), { maximumFractionDigits: 1 })}</span>
              <span className="sub">{i.impact > 0 ? t('Te acerca a {p} frente al resto.', { p: lead.party.shortName }) : t('Te aleja de {p}; donde más coincides en esto es con {q}.', { p: lead.party.shortName, q: fav?.shortName ?? '—' })}</span>
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
        <h1>{t('Aún no hay resultado')}</h1>
        <p>{t('Necesitas responder al menos {n} preguntas. Las respuestas solo existen mientras la pestaña está abierta, así que al recargar la página se borran.', { n: SCORING.minAnswers })}</p>
        <a className="btn primary big" href={href('inicio')}>{t('Elegir test')}</a>
      </main>
    );
  }
  if (!res.ranking.length) {
    return (
      <main id="contenido" className="wrap narrow">
        <h1>{t('Tu afinidad política')}</h1>
        <div className="empty">
          <h2>{t('Todavía no hay posiciones verificadas')}</h2>
          <p>{t(dataset.meta.notice)}</p>
          <p>{t('Ninguna candidatura tiene datos suficientes para compararla con tus respuestas. Preferimos no mostrar un resultado antes que rellenar posiciones sin fuente.')}</p>
          <a className="btn" href={href('fuentes')}>{t('Ver estado de las fuentes')}</a>
        </div>
      </main>
    );
  }

  return (
    <main id="contenido" className="wrap">
      <h1 className="results-title">{t('Tu afinidad política')}</h1>
      <ResultHero res={res} />
      <PartyRanking res={res} />
      <TopicResults res={res} />
      <WhyMatch res={res} />
      <InfluentialAnswers res={res} />
      <IdeologyChart res={res} />
      <PartyComparison res={res} />
      <section className="section" aria-labelledby="h-src">
        <h2 id="h-src">{t('Fuentes y metodología')}</h2>
        <p className="lead">{t('Cada posición del cálculo enlaza con su documento de origen.')}</p>
        <div className="row">
          <a className="btn" href={href('fuentes')}>{t('Fuentes y programas')}</a>
          <a className="btn" href={href('datos')}>{t('Ver datos utilizados')}</a>
          <a className="btn" href={href('metodologia')}>{t('Cómo se calcula')}</a>
        </div>
        <p className="note">
          {t('El resultado representa la similitud entre tus respuestas y las posiciones políticas documentadas que utiliza este test. Las posiciones y programas pueden evolucionar y no todas las cuestiones políticas pueden resumirse en {n} preguntas.', { n: dataset.questions.length })}
        </p>
      </section>
      <ShareSection res={res} />
      <section className="section">
        <div className="row">
          <button className="btn primary" onClick={() => { restart(); navigate('test'); }}>{t('Repetir el test')}</button>
          <button className="btn" onClick={() => { goto(0); navigate('test'); }}>{t('Revisar mis respuestas')}</button>
          {mode === 'rapido' && <button className="btn" onClick={() => { start('completo'); navigate('test'); }}>{t('Hacer el test completo')}</button>}
        </div>
      </section>
      <AdSlot slot="results" />
    </main>
  );
}
