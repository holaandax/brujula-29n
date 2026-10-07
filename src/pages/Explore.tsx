import { dataset } from '../data';
import { SOURCE_TYPE_LABEL, LIKERT } from '../lib/constants';
import { valueLabel } from '../lib/labels';
import { href } from '../lib/router';
import type { Party, Position, Question } from '../types';
import { AdSlot } from '../components/AdSlot';
import { PoliticalMap, partyMapPoints } from '../components/IdeologyChart';
import { PageHead } from '../components/Layout';

const posOf = (party: string, q: string): Position | undefined => dataset.positions.find((p) => p.party === party && p.question === q);
const srcOf = (pos?: Position) => (pos?.sourceId ? dataset.sources.find((s) => s.id === pos.sourceId) : undefined);

function PositionSource({ pos }: { pos?: Position }) {
  const src = srcOf(pos);
  if (!pos || pos.value === null || !src) return <span className="muted small">Sin fuente: no se usa en el cálculo</span>;
  return (
    <span className="small muted">
      {SOURCE_TYPE_LABEL[src.type]}{src.url ? <>: <a href={src.url} target="_blank" rel="noopener noreferrer">{src.title}</a></> : `: ${src.title}`}
      {src.reference ? ` (${src.reference})` : ''}
      {pos.estimated && <span className="tag">estimada</span>}
    </span>
  );
}

/** Espectro de una pregunta: dónde se sitúa cada candidatura en la escala de 5 puntos. */
function Spectrum({ q }: { q: Question }) {
  const cols = q.kind === 'choice' && q.options
    ? [{ v: -1, l: 'Opción A' }, { v: -0.5, l: 'Más bien A' }, { v: 0, l: 'Intermedia' }, { v: 0.5, l: 'Más bien B' }, { v: 1, l: 'Opción B' }]
    : LIKERT.map((x) => ({ v: x.value, l: x.short }));
  const missing = dataset.parties.filter((p) => { const v = posOf(p.id, q.id)?.value; return v === null || v === undefined; });
  return (
    <div className="spectrum">
      <div className="spectrum-grid" role="list" aria-label="Posición de cada candidatura">
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
      <PageHead kicker="Partidos" title="Qué defiende cada candidatura" dek="Sus posiciones en cada pregunta del test, antes o después de hacerlo. Cada una enlaza con su fuente." />
      <ul className="party-grid">
        {dataset.parties.map((p) => {
          const n = dataset.positions.filter((x) => x.party === p.id && x.value !== null).length;
          return (
            <li key={p.id}>
              <a href={href('partidos', p.id)} className="party-card">
                <span className="swatch" style={{ background: p.color }} />
                <strong>{p.shortName}</strong>
                <span className="small muted">{n} de {dataset.questions.length} posiciones documentadas</span>
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
      <PageHead kicker="Partidos" title={<><span className="swatch" style={{ background: party.color, width: 18, height: 18 }} />{party.name}</>} dek={party.description}>
        <p className="small sans" style={{ margin: '1rem 0 0' }}><a href={href('partidos')}>Todas las candidaturas</a> · <a href={href('fuentes')}>Programa, web y fuentes</a></p>
      </PageHead>
      {dataset.topics.map((t) => {
        const qs = dataset.questions.filter((q) => q.topic === t.id);
        return (
          <section key={t.id} className="profile-topic">
            <h2>{t.name}</h2>
            <dl className="profile-list">
              {qs.map((q) => {
                const pos = posOf(party.id, q.id);
                return (
                  <div key={q.id}>
                    <dt>{q.text}</dt>
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
        <PageHead kicker="Temas" title="Los temas del test" dek={`${dataset.topics.length} áreas y ${dataset.questions.length} preguntas. Las que solo aparecen en el test completo van marcadas.`} />
        <ul className="party-grid">
          {dataset.topics.map((t) => (
            <li key={t.id}>
              <a href={href('temas', t.id)} className="party-card">
                <strong>{t.name}</strong>
                <span className="small muted">{t.description} {dataset.questions.filter((q) => q.topic === t.id).length} preguntas.</span>
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
      <PageHead kicker="Temas" title={topic.name} dek={`${topic.description} Así se sitúa cada candidatura en cada pregunta. Un asterisco indica posición estimada.`}>
        <p className="small sans" style={{ margin: '1rem 0 0' }}><a href={href('temas')}>Todos los temas</a> · <a href={href('propuestas', topic.id)}>Propuestas sobre este tema</a></p>
      </PageHead>
      {qs.map((q) => (
        <section key={q.id} className="topic-q">
          <h2>{q.subtopic}{q.set === 'completo' && <span className="tag">test completo</span>}</h2>
          <p>{q.text}</p>
          {q.options && <p className="small muted">A: {q.options.a} B: {q.options.b}</p>}
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
      <PageHead kicker="Brújula" title="La brújula política" dek="Dónde quedan las candidaturas en dos ejes simplificados: economía (izquierda y derecha) y valores sociales (progresista y conservador). Haz el test para ver dónde quedas tú." />
      {points.length ? <PoliticalMap points={points} /> : <p className="empty">Aún no hay posiciones verificadas suficientes para situar a ninguna candidatura.</p>}
      <p className="note">Territorio, lengua, Europa, instituciones, energía nuclear y defensa no entran en estos ejes. Por eso la afinidad del test es más fiable que la cercanía en este mapa.</p>
      <p><a className="btn primary" href={href('inicio')}>Hacer el test</a></p>
      <AdSlot slot="explore" />
    </main>
  );
}
