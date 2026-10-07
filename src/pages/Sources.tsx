import { intlLocale } from '../i18n';
import { dataset } from '../data';
import { ELECTION, circunscripciones } from '../data/electoral';
import { SOURCE_TYPE_LABEL } from '../lib/constants';
import { href } from '../lib/router';
import type { Party } from '../types';
import { PageHead } from '../components/Layout';
import { t as tr } from '../i18n';

const STATUS: Record<Party['status'], string> = {
  proclamada: 'Candidatura proclamada', presentada: 'Candidatura presentada', pendiente: 'Pendiente de proclamación', ficticia: 'Ficticia (demostración)',
};
const SCOPE: Record<Party['scope'], string> = { estatal: 'Ámbito estatal', autonomico: 'Ámbito autonómico', coalicion: 'Coalición', territorial: 'Candidatura territorial' };

function ExtLink({ url, verified, children }: { url: string; verified: boolean; children: string }) {
  return <><a href={url} target="_blank" rel="noopener noreferrer">{children}</a>{!verified && <span className="tag">{tr('pendiente de verificar')}</span>}</>;
}

export function Sources() {
  const fmt = (d: string) => new Date(d).toLocaleDateString(intlLocale(), { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <main id="contenido" className="wrap narrow prose">
      <PageHead kicker={tr('Fuentes')} title={tr('Fuentes y programas')} dek={`${tr('Para cada candidatura: estado, programa, web oficial y la fuente de cada área.')} ${tr(dataset.meta.notice)}`} />

      {dataset.parties.map((p) => {
        const pos = dataset.positions.filter((x) => x.party === p.id && x.value !== null);
        const srcIds = new Set(pos.map((x) => x.sourceId));
        const srcs = dataset.sources.filter((s) => srcIds.has(s.id));
        const byTopic = dataset.topics.map((t) => {
          const qs = dataset.questions.filter((q) => q.topic === t.id);
          const ps = pos.filter((x) => qs.some((q) => q.id === x.question));
          return { t, n: ps.length, total: qs.length, src: [...new Set(ps.map((x) => dataset.sources.find((s) => s.id === x.sourceId)?.title))].filter(Boolean) };
        });
        const circ = p.circunscripciones === 'all' ? tr('Todas las circunscripciones') : p.circunscripciones.map((c) => circunscripciones.find((x) => x.code === c)?.name ?? c).join(', ');
        return (
          <section className="party-src" key={p.id} id={`p-${p.id}`}>
            <h3><span className="swatch" style={{ background: p.color }} />{p.name}</h3>
            <p className="small muted">{tr(SCOPE[p.scope])}. {tr(STATUS[p.status])}. {circ}.</p>
            <p className="small">{tr(p.description)}</p>
            <ul className="small">
              <li>{tr('Programa electoral')}: {p.program ? <ExtLink url={p.program.url} verified={p.program.verified}>{p.program.title}</ExtLink> : <span className="muted">{tr('aún no publicado o no verificado')}</span>}</li>
              <li>{tr('Web oficial')}: {p.website ? <ExtLink url={p.website.url} verified={p.website.verified}>{p.website.url.replace(/^https:\/\//, '')}</ExtLink> : <span className="muted">{tr('sin verificar')}</span>}</li>
              <li>{tr('Posiciones documentadas: {n} de {total}', { n: pos.length, total: dataset.questions.length })}</li>
            </ul>
            {pos.length > 0 && (
              <details>
                <summary>{tr('Fuentes por área')}</summary>
                <ul className="small">
                  {byTopic.map(({ t, n, total, src }) => <li key={t.id}><strong>{tr(t.name)}</strong> ({n}/{total}): {src.length ? src.join('; ') : <span className="muted">{tr('no disponible')}</span>}</li>)}
                </ul>
                <ul className="small">
                  {srcs.map((s) => <li key={s.id}>{tr(SOURCE_TYPE_LABEL[s.type])}: {s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a> : s.title}{s.date ? `, ${fmt(s.date)}` : ''}</li>)}
                </ul>
              </details>
            )}
            {p.methodologyNotes && <p className="note">{p.methodologyNotes}</p>}
          </section>
        );
      })}

      <h2 id="electoral">{tr('Datos electorales')}</h2>
      <p>{tr('Elecciones generales del {d}: Congreso de los Diputados y Senado. Este test se centra en la afinidad general y en el Congreso; el Senado tiene un sistema de voto distinto y no se mezcla con este cálculo.', { d: fmt(ELECTION.date) })}</p>
      <ul className="small">{ELECTION.calendar.filter((c) => c.key).map((c) => <li key={c.label}><strong>{fmt(c.date)}{c.end ? ` – ${fmt(c.end)}` : ''}</strong>: {tr(c.label)}</li>)}</ul>
      <p className="small"><a href={href('calendario')}>{tr('Calendario completo')}</a>{ELECTION.calendarProvisional ? ` (${tr('fechas provisionales')})` : ''}</p>
      {ELECTION.BOE_URL && <p><a href={ELECTION.BOE_URL} target="_blank" rel="noopener noreferrer">{tr('Real Decreto de convocatoria (BOE)')}</a></p>}
    </main>
  );
}
