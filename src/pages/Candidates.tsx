import { intlLocale } from '../i18n';
import { candidates, type Candidate } from '../data/candidates';
import { realParties } from '../data/parties';
import { PageHead } from '../components/Layout';
import { href } from '../lib/router';
import { initials } from '../lib/labels';
import { electoralSource } from '../data/sources-electoral';
import { t as tr } from '../i18n';

const STATUS = { proclamado: 'Candidatura proclamada', anunciado: 'Anunciado por su partido · pendiente de proclamación', pendiente: 'Candidatura pendiente de confirmación oficial' };
const fmt = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(intlLocale(), { day: 'numeric', month: 'long', year: 'numeric' });

const partyOf = (id: string) => realParties.find((p) => p.id === id);


function CandidateCard({ c }: { c: Candidate }) {
  const party = partyOf(c.party);
  const color = party?.color ?? 'var(--ink)';
  const link = c.url || party?.website?.url;
  const tbc = !c.name;
  const src = electoralSource(c.sourceId);
  // Sin candidato confirmado se muestra, etiquetada, la foto de quien encabezó la lista en 2023.
  const prev = tbc ? c.previous : undefined;
  const pic = c.photo ? { src: c.photo, credit: c.photoCredit, alt: `${c.name}, ${tr(c.role).toLowerCase()} (${party?.shortName ?? c.party})` }
    : prev?.photo ? { src: prev.photo, credit: prev.photoCredit, alt: tr('{n}, cabeza de lista en 2023', { n: prev.name }) } : undefined;
  const boe2023 = electoralSource('boe-candidaturas-2023');
  return (
    <article className="cand">
      <div className="photo" style={{ borderColor: color }}>
        {pic
          ? <img src={pic.src} alt={pic.alt} loading="lazy" width={480} height={600} />
          : <span className="monogram" aria-hidden="true">{tbc ? '?' : initials(c.name ?? '')}</span>}
        {prev?.photo && <span className="photo-tag">{tr('En 2023')}</span>}
      </div>
      <p className="party-line"><span className="swatch" style={{ background: color, margin: 0 }} />{party?.shortName ?? c.party}</p>
      <h2>{c.name ?? tr('Pendiente de confirmación')}</h2>
      <p className="role">{tr(c.role)}</p>
      <p className="bio"><strong>{tr(STATUS[c.status])}.</strong>{c.note ? ` ${tr(c.note)}` : ''}</p>
      {prev && (
        <p className="bio small">{tr('En 2023 encabezó la lista por {l}: {n}.', { l: prev.list, n: prev.name })}{boe2023 && <> <a href={boe2023.url} target="_blank" rel="noopener noreferrer">BOE</a>.</>}</p>
      )}
      {src && src.tier >= 3 && (
        <p className="bio small">{tr('Según')} <a href={src.url} target="_blank" rel="noopener noreferrer">{src.entity}</a>, {fmt(src.date)}. {tr('Actualizado')}: {fmt(c.updatedAt)}.</p>
      )}
      {pic?.credit && (
        <p className="credit">{tr('Foto')}: <a href={pic.credit.url} target="_blank" rel="noopener noreferrer">{pic.credit.author}</a>, {pic.credit.license === 'Dominio público' || pic.credit.license === 'Reconocimiento' ? tr(pic.credit.license) : pic.credit.license}</p>
      )}
      {link && !tbc && (
        <a className="cand-link" href={link} target="_blank" rel="noopener noreferrer">
          {c.url ? tr('Perfil de {n}', { n: (c.name ?? '').split(' ')[0]! }) : tr('Web de {p}', { p: party?.shortName ?? '' })} ↗
        </a>
      )}
    </article>
  );
}

export function Candidates() {
  return (
    <main id="contenido" className="wrap wide">
      <PageHead
        kicker={tr('Quién es quién')}
        title={tr('Las caras del 29N')}
        dek={tr('Quién encabeza cada candidatura con representación en el Congreso saliente.')}
      />
      <p className="provisional" role="note">
        <strong>{tr('Lista provisional.')}</strong>
        <span>{tr('Las candidaturas se publican proclamadas en el BOE el 3 de noviembre. Hasta entonces solo mostramos un nombre cuando el partido lo ha anunciado, con su fuente; si no, aparece como pendiente.')}</span>
      </p>
      <ul className="cand-grid">
        {candidates.map((c) => <li key={c.party}><CandidateCard c={c} /></li>)}
      </ul>
      <p className="section"><a className="btn" href={href('propuestas')}>{tr('Compara sus propuestas')}</a></p>
    </main>
  );
}
