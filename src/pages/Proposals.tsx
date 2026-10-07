import { useState } from 'react';
import { dataset } from '../data';
import { PageHead } from '../components/Layout';
import { SOURCE_TYPE_LABEL } from '../lib/constants';
import { href } from '../lib/router';
import type { Proposal, TopicId } from '../types';
import { t as tr, rich } from '../i18n';

const count = (topic: TopicId) => dataset.proposals.filter((p) => p.topic === topic).length;

function Source({ p }: { p: Proposal }) {
  const src = p.sourceId ? dataset.sources.find((s) => s.id === p.sourceId) : undefined;
  if (!src) return null;
  const label = `${tr(SOURCE_TYPE_LABEL[src.type])}${p.reference ? `, ${p.reference}` : ''}`;
  return <span className="src">{src.url ? <a href={src.url} target="_blank" rel="noopener noreferrer">{label}</a> : label}</span>;
}

export function Proposals({ topic: param }: { topic: string | null }) {
  const fallback = dataset.topics.find((t) => count(t.id) > 0) ?? dataset.topics[0]!;
  const [topicId, setTopicId] = useState<string>(() => (dataset.topics.some((t) => t.id === param) ? param! : fallback.id));
  const topic = dataset.topics.find((t) => t.id === topicId) ?? fallback;
  // Cambia la URL sin disparar hashchange (que haría scroll arriba): el tema queda enlazable.
  const pick = (id: TopicId) => { setTopicId(id); history.replaceState(null, '', href('propuestas', id)); };
  const [shown, setShown] = useState<string[]>(() => dataset.parties.map((p) => p.id));
  const toggle = (id: string) => setShown((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const parties = dataset.parties.filter((p) => shown.includes(p.id));
  const total = dataset.proposals.length;

  return (
    <main id="contenido" className="wrap wide">
      <PageHead
        kicker={tr('Compara propuestas')}
        title={tr('Qué propone cada partido, tema a tema')}
        dek={tr('Elige un tema y las candidaturas que quieras comparar. Cada propuesta sale de su programa y enlaza con él.')}
      />

      {total === 0 && (
        <div className="empty" style={{ marginBottom: '1.5rem' }}>
          <p>{rich('**Todavía no hay propuestas.** Los programas electorales del 29N aún no se han publicado. Las iremos añadiendo a medida que salgan, con su página de origen.')}</p>
          <p>{rich('Mientras tanto, puedes ver [qué posición tiene cada candidatura](#/partidos) en las preguntas del test.')}</p>
        </div>
      )}

      <span className="seg-label" id="l-topic">{tr('1. Elige un tema')}</span>
      <div className="choices" role="group" aria-labelledby="l-topic">
        {dataset.topics.map((t) => (
          <button key={t.id} className="choice-btn" aria-pressed={t.id === topic.id} onClick={() => pick(t.id)}>
            {tr(t.name)}{total > 0 && <span className="count">{count(t.id)}</span>}
          </button>
        ))}
      </div>

      <span className="seg-label" id="l-party">{tr('2. Elige partidos')}</span>
      <div className="choices" role="group" aria-labelledby="l-party">
        {dataset.parties.map((p) => (
          <button key={p.id} className="choice-btn" aria-pressed={shown.includes(p.id)} onClick={() => toggle(p.id)}>
            <span className="swatch" style={{ background: p.color }} />{p.shortName}
          </button>
        ))}
        <button className="choice-btn" onClick={() => setShown(shown.length === dataset.parties.length ? [] : dataset.parties.map((p) => p.id))}>
          {shown.length === dataset.parties.length ? tr('Quitar todos') : tr('Todos')}
        </button>
      </div>

      <section aria-labelledby="h-props">
        <h2 id="h-props" className="sr-only">{tr('Propuestas sobre {t}', { t: tr(topic.name).toLowerCase() })}</h2>
        {parties.length === 0
          ? <p className="empty" style={{ marginTop: '1.8rem' }}>{tr('Elige al menos un partido para ver sus propuestas.')}</p>
          : (
            <div className="proposals">
              {parties.map((p) => {
                const items = dataset.proposals.filter((x) => x.party === p.id && x.topic === topic.id);
                return (
                  <article key={p.id} className="prop-col">
                    <h3 style={{ borderColor: p.color }}><span className="swatch" style={{ background: p.color }} />{p.shortName}</h3>
                    {items.length
                      ? <ul>{items.map((x, i) => <li key={i}>{x.text}<Source p={x} /></li>)}</ul>
                      : <p className="none">{tr('Sin propuestas registradas sobre {t}.', { t: tr(topic.name).toLowerCase() })}</p>}
                  </article>
                );
              })}
            </div>
          )}
      </section>
    </main>
  );
}
