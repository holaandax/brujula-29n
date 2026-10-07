import { dataset } from '../data';
import { ELECTION, circunscripciones } from '../data/electoral';
import { SOURCE_TYPE_LABEL } from '../lib/constants';
import { href } from '../lib/router';
import type { Party } from '../types';
import { PageHead } from '../components/Layout';

const STATUS: Record<Party['status'], string> = {
  proclamada: 'Candidatura proclamada', presentada: 'Candidatura presentada', pendiente: 'Pendiente de proclamación', ficticia: 'Ficticia (demostración)',
};
const SCOPE: Record<Party['scope'], string> = { estatal: 'Ámbito estatal', autonomico: 'Ámbito autonómico', coalicion: 'Coalición', territorial: 'Candidatura territorial' };

function ExtLink({ url, verified, children }: { url: string; verified: boolean; children: string }) {
  return <><a href={url} target="_blank" rel="noopener noreferrer">{children}</a>{!verified && <span className="tag">pendiente de verificar</span>}</>;
}

export function Sources() {
  const fmt = (d: string) => new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <main id="contenido" className="wrap narrow prose">
      <PageHead kicker="Fuentes" title="Fuentes y programas" dek={`Para cada candidatura: estado, programa, web oficial y la fuente de cada área. ${dataset.meta.notice}`} />

      {dataset.parties.map((p) => {
        const pos = dataset.positions.filter((x) => x.party === p.id && x.value !== null);
        const srcIds = new Set(pos.map((x) => x.sourceId));
        const srcs = dataset.sources.filter((s) => srcIds.has(s.id));
        const byTopic = dataset.topics.map((t) => {
          const qs = dataset.questions.filter((q) => q.topic === t.id);
          const ps = pos.filter((x) => qs.some((q) => q.id === x.question));
          return { t, n: ps.length, total: qs.length, src: [...new Set(ps.map((x) => dataset.sources.find((s) => s.id === x.sourceId)?.title))].filter(Boolean) };
        });
        const circ = p.circunscripciones === 'all' ? 'Todas las circunscripciones' : p.circunscripciones.map((c) => circunscripciones.find((x) => x.code === c)?.name ?? c).join(', ');
        return (
          <section className="party-src" key={p.id} id={`p-${p.id}`}>
            <h3><span className="swatch" style={{ background: p.color }} />{p.name}</h3>
            <p className="small muted">{SCOPE[p.scope]}. {STATUS[p.status]}. {circ}.</p>
            <p className="small">{p.description}</p>
            <ul className="small">
              <li>Programa electoral: {p.program ? <ExtLink url={p.program.url} verified={p.program.verified}>{p.program.title}</ExtLink> : <span className="muted">aún no publicado o no verificado</span>}</li>
              <li>Web oficial: {p.website ? <ExtLink url={p.website.url} verified={p.website.verified}>{p.website.url.replace(/^https:\/\//, '')}</ExtLink> : <span className="muted">sin verificar</span>}</li>
              <li>Posiciones documentadas: {pos.length} de {dataset.questions.length}</li>
            </ul>
            {pos.length > 0 && (
              <details>
                <summary>Fuentes por área</summary>
                <ul className="small">
                  {byTopic.map(({ t, n, total, src }) => <li key={t.id}><strong>{t.name}</strong> ({n}/{total}): {src.length ? src.join('; ') : <span className="muted">no disponible</span>}</li>)}
                </ul>
                <ul className="small">
                  {srcs.map((s) => <li key={s.id}>{SOURCE_TYPE_LABEL[s.type]}: {s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a> : s.title}{s.date ? `, ${fmt(s.date)}` : ''}</li>)}
                </ul>
              </details>
            )}
            {p.methodologyNotes && <p className="note">{p.methodologyNotes}</p>}
          </section>
        );
      })}

      <h2 id="electoral">Datos electorales</h2>
      <p>{ELECTION.name} del {fmt(ELECTION.date)}: {ELECTION.chambers.join(' y ')}. Este test se centra en la afinidad general y en el Congreso; el Senado tiene un sistema de voto distinto y no se mezcla con este cálculo.</p>
      <ul className="small">{ELECTION.calendar.filter((c) => c.key).map((c) => <li key={c.label}><strong>{fmt(c.date)}{c.end ? ` – ${fmt(c.end)}` : ''}</strong>: {c.label}</li>)}</ul>
      <p className="small"><a href={href('calendario')}>Calendario completo</a>{ELECTION.calendarProvisional ? ' (fechas provisionales)' : ''}</p>
      {ELECTION.BOE_URL && <p><a href={ELECTION.BOE_URL} target="_blank" rel="noopener noreferrer">Real Decreto de convocatoria (BOE)</a></p>}
    </main>
  );
}
