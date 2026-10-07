import { useMemo, useState } from 'react';
import { ELECTION_RESULTS, PACT_PRESETS } from '../data/results';
import { Hemicycle, type SeatGroup } from '../components/Hemicycle';
import { PageHead } from '../components/Layout';
import { absoluteMajority, tally, verdict, type Vote } from '../lib/pacts';
import { href } from '../lib/router';

const VOTES: { v: Vote; label: string }[] = [{ v: 'si', label: 'Sí' }, { v: 'abstencion', label: 'Abst.' }, { v: 'no', label: 'No' }];
const fmtDate = (d: string) => new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

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
      ...by('si').map((r) => ({ key: r.party, label: `${r.shortName} (sí)`, seats: r.seats, color: r.color })),
      ...by('abstencion').map((r) => ({ key: r.party, label: `${r.shortName} (abstención)`, seats: r.seats, color: r.color, dim: true })),
      ...by('no').map((r) => ({ key: r.party, label: `${r.shortName} (no)`, seats: r.seats, color: 'var(--muted)', dim: true })),
    ];
  }, [election, votes]);

  const setVote = (party: string, vote: Vote) => { setVotes((s) => ({ ...s, [party]: vote })); setPreset(null); };
  const applyPreset = (id: string) => { setVotes(presetVotes(id)); setPreset(id); };
  const reset = () => { setVotes(allNo()); setPreset(null); };

  const siParties = election.results.filter((r) => votes[r.party] === 'si').map((r) => r.shortName);
  const headline = v.kind === 'absoluta' ? 'Investidura en primera votación'
    : v.kind === 'simple' ? 'Investidura en segunda votación'
    : t.si === 0 ? 'Elige quién vota sí' : 'No hay investidura';
  const explanation = v.kind === 'absoluta'
    ? `${siParties.join(', ')} suman ${t.si} escaños: mayoría absoluta.`
    : v.kind === 'simple'
      ? `${t.si} síes no llegan a ${maj}, pero superan a los ${t.no} noes. Le faltan ${v.missingAbsolute} para la mayoría absoluta.`
      : t.si === 0
        ? 'Marca «Sí» en los partidos que apoyarían al candidato, o empieza por una votación real.'
        : `${t.si} síes frente a ${t.no} noes. Harían falta ${v.missingAbsolute} síes más para la mayoría absoluta${t.no - t.si + 1 > 0 ? `, o ${t.no - t.si + 1} noes menos para la simple` : ''}.`;

  return (
    <main id="contenido" className="wrap wide">
      <PageHead
        kicker="Calculadora de pactos"
        title="¿Quién suma para gobernar?"
        dek={<>Elige qué vota cada partido en una investidura con el Congreso salido de las urnas en {new Date(election.date).getFullYear()}.</>}
      />

      {ELECTION_RESULTS.length > 1 && (
        <div className="choices" role="group" aria-label="Elecciones" style={{ marginBottom: '1.2rem' }}>
          {ELECTION_RESULTS.map((e) => (
            <button key={e.id} className="choice-btn" aria-pressed={e.id === electionId} onClick={() => { setElectionId(e.id); setPreset(null); }}>{e.label}</button>
          ))}
        </div>
      )}

      <div className="pact">
        <section className="pact-board" aria-label="Resultado de la votación">
          <Hemicycle groups={groups} total={election.totalSeats} showMajority title={`Congreso de ${new Date(election.date).getFullYear()}, ${election.totalSeats} escaños`} />
          <div className="tally" aria-live="polite">
            <div><b>{t.si}</b><span>Sí</span></div>
            <div><b>{t.abstencion}</b><span>Abstención</span></div>
            <div><b>{t.no}</b><span>No</span></div>
          </div>
          <div className="verdict" aria-live="polite">
            <h2>{headline}</h2>
            <p>{explanation}</p>
          </div>
          <div className="majority-bar" aria-hidden="true">
            {groups.filter((g) => !g.dim).map((g) => <i key={g.key} style={{ width: `${(g.seats / election.totalSeats) * 100}%`, background: g.color }} />)}
            <span className="line" style={{ left: `${(maj / election.totalSeats) * 100}%` }} />
          </div>
          <div className="majority-scale sans"><span>0</span><span>Mayoría absoluta: {maj}</span><span>{election.totalSeats}</span></div>
        </section>

        <section aria-labelledby="h-votes">
          <h2 id="h-votes" className="sr-only">Voto de cada partido</h2>
          <p className="seg-label" style={{ marginTop: 0 }}>Empieza por una votación real</p>
          <div className="presets">
            {PACT_PRESETS.map((p) => (
              <button key={p.id} className="choice-btn" aria-pressed={preset === p.id} onClick={() => applyPreset(p.id)} title={p.detail}>{p.label}</button>
            ))}
            <button className="choice-btn" onClick={reset}>Todos no</button>
          </div>
          {preset && <p className="small muted" style={{ marginTop: '-.4rem' }}>{PACT_PRESETS.find((p) => p.id === preset)!.detail}</p>}

          <ul className="pact-list">
            {election.results.map((r) => (
              <li key={r.party} className="pact-row">
                <span className="who">
                  <span className="swatch" style={{ background: r.color, width: 14, height: 14 }} />
                  <strong>{r.shortName}</strong>
                  <span className="seats">{r.seats} {r.seats === 1 ? 'escaño' : 'escaños'}</span>
                </span>
                <span className="vote-seg" role="group" aria-label={`Voto de ${r.name}`}>
                  {VOTES.map((o) => (
                    <button key={o.v} aria-pressed={(votes[r.party] ?? 'no') === o.v} onClick={() => setVote(r.party, o.v)}>{o.label}</button>
                  ))}
                </span>
                {r.note && <span className="note-sm">{r.note}</span>}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="section prose" aria-labelledby="h-how">
        <h2 id="h-how">Cómo funciona una investidura</h2>
        <p>
          El candidato necesita en una primera votación la <strong>mayoría absoluta</strong>: {maj} de los {election.totalSeats} diputados.
          Si no la consigue, 48 horas después se vota otra vez y basta la <strong>mayoría simple</strong>: más síes que noes.
          Por eso una abstención puede decidir una investidura: no suma, pero tampoco resta.
        </p>
        <p className="note">
          Escaños de las {election.label.toLowerCase()} ({fmtDate(election.date)}). Fuente: {election.sourceUrl ? <a href={election.sourceUrl} target="_blank" rel="noopener noreferrer">{election.source}</a> : election.source}.
          Cuando se conozcan los resultados del 29N se añadirán aquí. Ver también el <a href={href('calendario')}>calendario</a>.
        </p>
      </section>
    </main>
  );
}
