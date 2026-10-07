import { candidates, type Candidate } from '../data/candidates';
import { realParties } from '../data/parties';
import { PageHead } from '../components/Layout';
import { href } from '../lib/router';
import { initials } from '../lib/labels';
import { electoralSource } from '../data/sources-electoral';

const STATUS = { proclamado: 'Candidatura proclamada', anunciado: 'Anunciado por su partido · pendiente de proclamación', pendiente: 'Candidatura pendiente de confirmación oficial' };
const fmt = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

const partyOf = (id: string) => realParties.find((p) => p.id === id);


function CandidateCard({ c }: { c: Candidate }) {
  const party = partyOf(c.party);
  const color = party?.color ?? 'var(--ink)';
  const link = c.url || party?.website?.url;
  const tbc = !c.name;
  const src = electoralSource(c.sourceId);
  return (
    <article className="cand">
      <div className="photo" style={{ borderColor: color }}>
        {c.photo
          ? <img src={c.photo} alt={`${c.name}, ${c.role.toLowerCase()} de ${party?.shortName ?? c.party}`} loading="lazy" width={600} height={750} />
          : <span className="monogram" aria-hidden="true">{tbc ? '?' : initials(c.name ?? '')}</span>}
      </div>
      <p className="party-line"><span className="swatch" style={{ background: color, margin: 0 }} />{party?.shortName ?? c.party}</p>
      <h2>{c.name ?? 'Pendiente de confirmación'}</h2>
      <p className="role">{c.role}</p>
      <p className="bio"><strong>{STATUS[c.status]}.</strong>{c.note ? ` ${c.note}` : ''}</p>
      {src && src.tier >= 3 && (
        <p className="bio small">Según <a href={src.url} target="_blank" rel="noopener noreferrer">{src.entity}</a>, {fmt(src.date)}. Actualizado: {fmt(c.updatedAt)}.</p>
      )}
      {link && !tbc && (
        <a className="cand-link" href={link} target="_blank" rel="noopener noreferrer">
          {c.url ? `Perfil de ${(c.name ?? '').split(' ')[0]}` : `Web de ${party?.shortName ?? 'la candidatura'}`} ↗
        </a>
      )}
    </article>
  );
}

export function Candidates() {
  return (
    <main id="contenido" className="wrap wide">
      <PageHead
        kicker="Quién es quién"
        title="Las caras del 29N"
        dek="Quién encabeza cada candidatura con representación en el Congreso saliente."
      />
      <p className="provisional" role="note">
        <strong>Lista provisional.</strong>
        <span>Las candidaturas se publican proclamadas en el BOE el 3 de noviembre. Hasta entonces solo mostramos un nombre cuando el partido lo ha anunciado, con su fuente; si no, aparece como pendiente.</span>
      </p>
      <ul className="cand-grid">
        {candidates.map((c) => <li key={c.party}><CandidateCard c={c} /></li>)}
      </ul>
      <p className="section"><a className="btn" href={href('propuestas')}>Compara sus propuestas</a></p>
    </main>
  );
}
