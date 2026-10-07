import { intlLocale } from '../i18n';
import { useMemo, useState } from 'react';
import { ELECTION_RESULTS, PACT_PRESETS } from '../data/results';
import { Hemicycle, type SeatGroup } from '../components/Hemicycle';
import { PageHead } from '../components/Layout';
import { absoluteMajority, tally, verdict, type Vote } from '../lib/pacts';
import { href } from '../lib/router';
import { t as tr, rich } from '../i18n';

const VOTES: { v: Vote; label: string }[] = [{ v: 'si', label: 'Sí' }, { v: 'abstencion', label: 'Abst.' }, { v: 'no', label: 'No' }];
// Las etiquetas se traducen al pintar: tr(o.label).
const fmtDate = (d: string) => new Date(d).toLocaleDateString(intlLocale(), { day: 'numeric', month: 'long', year: 'numeric' });

export function Pacts() {
  const [electionId, setElectionId] = useState(ELECTION_RESULTS[0]!.id);
  const election = ELECTION_RESULTS.find((e) => e.id === electionId)!;
  const allNo = () => Object.fromEntries(election.results.map((r) => [r.party, 'no' as Vote]));
  const presetVotes = (id: string): Record<string, Vote> => {
    const p = PACT_PRESETS.find((x) => x.id === id)!;
    return Object.fromEntries(election.results.map((r) => [r.party, p.yes.includes(r.party) ? 'si' : p.abstain?.includes(r.party) ? 'abstencion' : 'no']));
  };
  // Se abre con la última investidura real ya cargada.
  const [votes, setVotes] = useState<Record<string, Vote>>(() => presetVotes(PACT_PRESETS[0]!.id));
  const [preset, setPreset] = useState<string | null>(PACT_PRESETS[0]!.id);

  const t = tally(election.results, votes);
  const v = verdict(t, election.totalSeats);
  const maj = absoluteMajority(election.totalSeats);

  // Sí a la izquierda, abstención en el centro (atenuada), no a la derecha. Dentro de cada bloque, por escaños.
  const groups: SeatGroup[] = useMemo(() => {
    const by = (vote: Vote) => election.results.filter((r) => (votes[r.party] ?? 'no') === vote).sort((a, b) => b.seats - a.seats);
    return [
      ...by('si').map((r) => ({ key: r.party, label: `${r.shortName} (${tr('sí')})`, seats: r.seats, color: r.color })),
      ...by('abstencion').map((r) => ({ key: r.party, label: `${r.shortName} (${tr('abstención')})`, seats: r.seats, color: r.color, dim: true })),
      ...by('no').map((r) => ({ key: r.party, label: `${r.shortName} (${tr('no')})`, seats: r.seats, color: 'var(--muted)', dim: true })),
    ];
  }, [election, votes]);

  const setVote = (party: string, vote: Vote) => { setVotes((s) => ({ ...s, [party]: vote })); setPreset(null); };
  const applyPreset = (id: string) => { setVotes(presetVotes(id)); setPreset(id); };
  const reset = () => { setVotes(allNo()); setPreset(null); };

  const siParties = election.results.filter((r) => votes[r.party] === 'si').map((r) => r.shortName);
  const headline = tr(v.kind === 'absoluta' ? 'Investidura en primera votación'
    : v.kind === 'simple' ? 'Investidura en segunda votación'
    : t.si === 0 ? 'Elige quién vota sí' : 'No hay investidura');
  const explanation = v.kind === 'absoluta'
    ? tr('{list} suman {n} escaños: mayoría absoluta.', { list: siParties.join(', '), n: t.si })
    : v.kind === 'simple'
      ? tr('{si} síes no llegan a {maj}, pero superan a los {no} noes. Le faltan {m} para la mayoría absoluta.', { si: t.si, maj, no: t.no, m: v.missingAbsolute })
      : t.si === 0
        ? tr('Marca «Sí» en los partidos que apoyarían al candidato, o empieza por una votación real.')
        : t.no - t.si + 1 > 0
          ? tr('{si} síes frente a {no} noes. Harían falta {m} síes más para la mayoría absoluta, o {k} noes menos para la simple.', { si: t.si, no: t.no, m: v.missingAbsolute, k: t.no - t.si + 1 })
          : tr('{si} síes frente a {no} noes. Harían falta {m} síes más para la mayoría absoluta.', { si: t.si, no: t.no, m: v.missingAbsolute });

  return (
    <main id="contenido" className="wrap wide">
      <PageHead
        kicker={tr('Calculadora de pactos')}
        title={tr('¿Quién suma para gobernar?')}
        dek={tr('Elige qué vota cada partido en una investidura con el Congreso salido de las urnas en {y}.', { y: new Date(election.date).getFullYear() })}
      />

      {ELECTION_RESULTS.length > 1 && (
        <div className="choices" role="group" aria-label={tr('Elecciones')} style={{ marginBottom: '1.2rem' }}>
          {ELECTION_RESULTS.map((e) => (
            <button key={e.id} className="choice-btn" aria-pressed={e.id === electionId} onClick={() => { setElectionId(e.id); setPreset(null); }}>{tr(e.label)}</button>
          ))}
        </div>
      )}

      <div className="pact">
        <section className="pact-board" aria-label={tr('Resultado de la votación')}>
          <Hemicycle groups={groups} total={election.totalSeats} showMajority title={tr('Congreso de {y}, {n} escaños', { y: new Date(election.date).getFullYear(), n: election.totalSeats })} />
          <div className="tally" aria-live="polite">
            <div><b>{t.si}</b><span>{tr('Sí')}</span></div>
            <div><b>{t.abstencion}</b><span>{tr('Abstención')}</span></div>
            <div><b>{t.no}</b><span>{tr('No')}</span></div>
          </div>
          <div className="verdict" aria-live="polite">
            <h2>{headline}</h2>
            <p>{explanation}</p>
          </div>
          <div className="majority-bar" aria-hidden="true">
            {groups.filter((g) => !g.dim).map((g) => <i key={g.key} style={{ width: `${(g.seats / election.totalSeats) * 100}%`, background: g.color }} />)}
            <span className="line" style={{ left: `${(maj / election.totalSeats) * 100}%` }} />
          </div>
          <div className="majority-scale sans"><span>0</span><span>{tr('Mayoría absoluta: {n}', { n: maj })}</span><span>{election.totalSeats}</span></div>
        </section>

        <section aria-labelledby="h-votes">
          <h2 id="h-votes" className="sr-only">{tr('Voto de cada partido')}</h2>
          <p className="seg-label" style={{ marginTop: 0 }}>{tr('Empieza por una votación real')}</p>
          <div className="presets">
            {PACT_PRESETS.map((p) => (
              <button key={p.id} className="choice-btn" aria-pressed={preset === p.id} onClick={() => applyPreset(p.id)} title={tr(p.detail)}>{tr(p.label)}</button>
            ))}
            <button className="choice-btn" onClick={reset}>{tr('Todos no')}</button>
          </div>
          {preset && <p className="small muted" style={{ marginTop: '-.4rem' }}>{tr(PACT_PRESETS.find((p) => p.id === preset)!.detail)}</p>}

          <ul className="pact-list">
            {election.results.map((r) => (
              <li key={r.party} className="pact-row">
                <span className="who">
                  <span className="swatch" style={{ background: r.color, width: 14, height: 14 }} />
                  <strong>{r.shortName}</strong>
                  <span className="seats">{r.seats} {r.seats === 1 ? tr('escaño') : tr('escaños')}</span>
                </span>
                <span className="vote-seg" role="group" aria-label={tr('Voto de {p}', { p: r.name })}>
                  {VOTES.map((o) => (
                    <button key={o.v} aria-pressed={(votes[r.party] ?? 'no') === o.v} onClick={() => setVote(r.party, o.v)}>{tr(o.label)}</button>
                  ))}
                </span>
                {r.note && <span className="note-sm">{tr(r.note)}</span>}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="section prose" aria-labelledby="h-how">
        <h2 id="h-how">{tr('Cómo funciona una investidura')}</h2>
        <p>{rich('El candidato necesita en una primera votación la **mayoría absoluta**: {maj} de los {n} diputados. Si no la consigue, 48 horas después se vota otra vez y basta la **mayoría simple**: más síes que noes. Por eso una abstención puede decidir una investidura: no suma, pero tampoco resta.', { maj, n: election.totalSeats })}</p>
        <p className="note">
          {tr('Datos históricos: escaños de las {e} ({d}).', { e: tr(election.label).toLowerCase(), d: fmtDate(election.date) })} {tr('Fuente')}: {election.sourceUrl ? <a href={election.sourceUrl} target="_blank" rel="noopener noreferrer">{tr(election.source)}</a> : tr(election.source)}.
          {' '}{tr('Cuando se conozcan los resultados del 29N se añadirán aquí.')} <a href={href('calendario')}>{tr('Ver el calendario')}</a>.
        </p>
      </section>
    </main>
  );
}
