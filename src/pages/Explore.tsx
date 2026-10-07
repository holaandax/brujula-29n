import { dataset } from '../data';
import { SOURCE_TYPE_LABEL, LIKERT } from '../lib/constants';
import { valueLabel } from '../lib/labels';
import { href } from '../lib/router';
import type { Party, Position, Question } from '../types';
import { AdSlot } from '../components/AdSlot';
import { PoliticalMap, partyMapPoints } from '../components/IdeologyChart';
import { PageHead } from '../components/Layout';
import { t as tr } from '../i18n';

const posOf = (party: string, q: string): Position | undefined => dataset.positions.find((p) => p.party === party && p.question === q);
const srcOf = (pos?: Position) => (pos?.sourceId ? dataset.sources.find((s) => s.id === pos.sourceId) : undefined);

function PositionSource({ pos }: { pos?: Position }) {
  const src = srcOf(pos);
  if (!pos || pos.value === null || !src) return <span className="muted small">{tr('Sin fuente: no se usa en el cálculo')}</span>;
  return (
    <span className="small muted">
      {SOURCE_TYPE_LABEL[src.type]}{src.url ? <>: <a href={src.url} target="_blank" rel="noopener noreferrer">{src.title}</a></> : `: ${src.title}`}
      {src.reference ? ` (${src.reference})` : ''}
      {pos.estimated && <span className="tag">{tr('estimada')}</span>}
    </span>
  );
}

/** Espectro de una pregunta: dónde se sitúa cada candidatura en la escala de 5 puntos. */
function Spectrum({ q }: { q: Question }) {
  const cols = q.kind === 'choice' && q.options
    ? [{ v: -1, l: tr('Opción A') }, { v: -0.5, l: tr('Más bien A') }, { v: 0, l: tr('Intermedia') }, { v: 0.5, l: tr('Más bien B') }, { v: 1, l: tr('Opción B') }]
    : LIKERT.map((x) => ({ v: x.value, l: x.short }));
  const missing = dataset.parties.filter((p) => { const v = posOf(p.id, q.id)?.value; return v === null || v === undefined; });
  return (
    <div className="spectrum">
      <div className="spectrum-grid" role="list" aria-label={tr('Posición de cada candidatura')}>
        {cols.map((c) => {
          const here = dataset.parties.filter((p) => { const v = posOf(p.id, q.id)?.value; return v !== null && v !== undefined && Math.abs(v - c.v) < 0.25; });
          return (
            <div className="spectrum-col" key={c.v} role="listitem">
              <div className="spectrum-head">{c.l}</div>
              {here.map((p) => (
                <a key={p.id} className="chip" href={href('partidos', p.id)} style={{ borderColor: p.color }}>
                  <span className="swatch" style={{ background: p.color }} />{p.shortName}{posOf(p.id, q.id)?.estimated ? '*' : ''}
                </a>
              ))}
            </div>
          );
        })}
      </div>
      {missing.length > 0 && <p className="small muted">Sin posición documentada: {missing.map((p) => p.shortName).join(', ')}.</p>}
    </div>
  );
}

export function Parties({ id }: { id: string | null }) {
  const party = id ? dataset.parties.find((p) => p.id === id) : undefined;
  if (party) return <PartyProfile party={party} />;
  return (
    <main id="contenido" className="wrap prose">
      <PageHead kicker={tr('Partidos')} title={tr('Qué defiende cada candidatura')} dek={tr('Sus posiciones en cada pregunta del test, antes o después de hacerlo. Cada una enlaza con su fuente.')} />
      <ul className="party-grid">
        {dataset.parties.map((p) => {
          const n = dataset.positions.filter((x) => x.party === p.id && x.value !== null).length;
          return (
            <li key={p.id}>
              <a href={href('partidos', p.id)} className="party-card">
                <span className="swatch" style={{ background: p.color }} />
                <strong>{p.shortName}</strong>
                <span className="small muted">{tr('{n} de {total} posiciones documentadas', { n, total: dataset.questions.length })}</span>
              </a>
            </li>
          );
        })}
      </ul>
      <AdSlot slot="explore" />
    </main>
  );
}

function PartyProfile({ party }: { party: Party }) {
  return (
    <main id="contenido" className="wrap prose">
      <PageHead kicker={tr('Partidos')} title={<><span className="swatch" style={{ background: party.color, width: 18, height: 18 }} />{party.name}</>} dek={tr(party.description)}>
        <p className="small sans" style={{ margin: '1rem 0 0' }}><a href={href('partidos')}>{tr('Todas las candidaturas')}</a> · <a href={href('fuentes')}>{tr('Programa, web y fuentes')}</a></p>
      </PageHead>
      {dataset.topics.map((t) => {
        const qs = dataset.questions.filter((q) => q.topic === t.id);
        return (
          <section key={t.id} className="profile-topic">
            <h2>{tr(t.name)}</h2>
            <dl className="profile-list">
              {qs.map((q) => {
                const pos = posOf(party.id, q.id);
                return (
                  <div key={q.id}>
                    <dt>{tr(q.text)}</dt>
                    <dd><strong>{valueLabel(q, pos?.value ?? null)}</strong><br /><PositionSource pos={pos} /></dd>
                  </div>
                );
              })}
            </dl>
          </section>
        );
      })}
      <AdSlot slot="explore" />
    </main>
  );
}

export function Topics({ id }: { id: string | null }) {
  const topic = id ? dataset.topics.find((t) => t.id === id) : undefined;
  if (!topic) {
    return (
      <main id="contenido" className="wrap prose">
        <PageHead kicker={tr('Temas')} title={tr('Los temas del test')} dek={tr('{a} áreas y {q} preguntas. Las que solo aparecen en el test completo van marcadas.', { a: dataset.topics.length, q: dataset.questions.length })} />
        <ul className="party-grid">
          {dataset.topics.map((t) => (
            <li key={t.id}>
              <a href={href('temas', t.id)} className="party-card">
                <strong>{tr(t.name)}</strong>
                <span className="small muted">{tr(t.description)} {tr('{n} preguntas.', { n: dataset.questions.filter((q) => q.topic === t.id).length })}</span>
              </a>
            </li>
          ))}
        </ul>
      </main>
    );
  }
  const qs = dataset.questions.filter((q) => q.topic === topic.id);
  return (
    <main id="contenido" className="wrap prose">
      <PageHead kicker={tr('Temas')} title={tr(topic.name)} dek={`${tr(topic.description)} ${tr('Así se sitúa cada candidatura en cada pregunta. Un asterisco indica posición estimada.')}`}>
        <p className="small sans" style={{ margin: '1rem 0 0' }}><a href={href('temas')}>{tr('Todos los temas')}</a> · <a href={href('propuestas', topic.id)}>{tr('Propuestas sobre este tema')}</a></p>
      </PageHead>
      {qs.map((q) => (
        <section key={q.id} className="topic-q">
          <h2>{tr(q.subtopic)}{q.set === 'completo' && <span className="tag">{tr('test completo')}</span>}</h2>
          <p>{tr(q.text)}</p>
          {q.options && <p className="small muted">A: {tr(q.options.a)} B: {tr(q.options.b)}</p>}
          <Spectrum q={q} />
        </section>
      ))}
      <AdSlot slot="explore" />
    </main>
  );
}

export function Compass() {
  const points = partyMapPoints();
  return (
    <main id="contenido" className="wrap narrow prose">
      <PageHead kicker={tr('Brújula')} title={tr('La brújula política')} dek={tr('Dónde quedan las candidaturas en dos ejes simplificados: economía (izquierda y derecha) y valores sociales (progresista y conservador). Haz el test para ver dónde quedas tú.')} />
      {points.length ? <PoliticalMap points={points} /> : <p className="empty">{tr('Aún no hay posiciones verificadas suficientes para situar a ninguna candidatura.')}</p>}
      <p className="note">{tr('Territorio, lengua, Europa, instituciones, energía nuclear y defensa no entran en estos ejes. Por eso la afinidad del test es más fiable que la cercanía en este mapa.')}</p>
      <p><a className="btn primary" href={href('inicio')}>{tr('Hacer el test')}</a></p>
      <AdSlot slot="explore" />
    </main>
  );
}
