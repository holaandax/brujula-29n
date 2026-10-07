import { candidates, type Candidate } from '../data/candidates';
import { realParties } from '../data/parties';
import { PageHead } from '../components/Layout';
import { href } from '../lib/router';
import { initials } from '../lib/labels';

const partyOf = (id: string) => realParties.find((p) => p.id === id);


function CandidateCard({ c }: { c: Candidate }) {
  const party = partyOf(c.party);
  const color = party?.color ?? 'var(--ink)';
  const link = c.url || party?.website?.url;
  const tbc = c.name === 'Por confirmar';
  return (
    <article className="cand">
      <div className="photo" style={{ borderColor: color }}>
        {c.photo
          ? <img src={c.photo} alt={`Retrato de ${c.name}`} loading="lazy" width={600} height={750} />
          : <span className="monogram" aria-hidden="true">{tbc ? '?' : initials(c.name)}</span>}
      </div>
      <p className="party-line"><span className="swatch" style={{ background: color, margin: 0 }} />{party?.shortName ?? c.party}</p>
      <h2>{c.name}</h2>
      <p className="role">{c.role}</p>
      {c.bio && <p className="bio">{c.bio}</p>}
      {link && !tbc && (
        <a className="cand-link" href={link} target="_blank" rel="noopener noreferrer">
          {c.url ? `Perfil de ${c.name.split(' ')[0]}` : `Web de ${party?.shortName ?? 'la candidatura'}`} ↗
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
        <span>Las candidaturas se proclaman el 3 de noviembre. Hasta entonces mostramos a quien encabezó la lista en 2023 o lidera hoy cada formación.</span>
      </p>
      <ul className="cand-grid">
        {candidates.map((c) => <li key={c.party}><CandidateCard c={c} /></li>)}
      </ul>
      <p className="section"><a className="btn" href={href('propuestas')}>Compara sus propuestas</a></p>
    </main>
  );
}
