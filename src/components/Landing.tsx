import type { ReactNode } from 'react';
import { APP } from '../config';
import { AdSlot } from './AdSlot';
import { Hemicycle } from './Hemicycle';
import { dataset } from '../data';
import { candidates } from '../data/candidates';
import { realParties } from '../data/parties';
import { ELECTION_RESULTS, PACT_PRESETS } from '../data/results';
import { circunscripciones, ELECTION, daysUntil, nextKeyEvent } from '../data/electoral';
import { initials } from '../lib/labels';
import { PRIVACY_LINE, PRIVACY_TAGS } from '../lib/constants';
import { navigate, href, type Route } from '../lib/router';
import { questionsFor, useQuiz } from '../state/quiz';
import type { QuizMode } from '../types';


const short = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).replace('.', '');

function NextDate() {
  const next = nextKeyEvent();
  if (!next) return null;
  const started = daysUntil(next.date) <= 0;
  const d = daysUntil(started ? (next.end ?? next.date) : next.date);
  const after = ELECTION.calendar.filter((e) => e.key && e !== next && daysUntil(e.date) > Math.max(0, daysUntil(next.date))).slice(0, 3);
  return (
    <aside className="next-date" aria-labelledby="h-next">
      <p className="kicker">{started ? 'En curso' : 'Próxima fecha'}</p>
      {d === 0
        ? <p className="big">Hoy</p>
        : <><p className="big">{d}</p><span className="unit">{started ? (d === 1 ? 'día para que termine' : 'días para que termine') : d === 1 ? 'día' : 'días'}</span></>}
      <h2 id="h-next">{next.label}</h2>
      <p className="small muted" style={{ margin: 0 }}>{next.end ? `Del ${short(next.date)} al ${short(next.end)}` : short(next.date)}</p>
      {after.length > 0 && (
        <ol>
          {after.map((e) => <li key={e.label}><span className="cal-date">{short(e.date)}</span><span>{e.label}</span></li>)}
        </ol>
      )}
      <a className="sans small" href={href('calendario')}>Calendario completo{ELECTION.calendarProvisional ? ' (provisional)' : ''}</a>
    </aside>
  );
}

function Module({ route, kicker, title, children, art, lead }: { route: Route; kicker: string; title: string; children: string; art?: ReactNode; lead?: boolean }) {
  return (
    <a className={`module${lead ? ' lead-module' : ''}`} href={href(route)}>
      <span className="kicker">{kicker}</span>
      {art && <div className="art" aria-hidden="true">{art}</div>}
      <h3>{title}</h3>
      <p>{children}</p>
    </a>
  );
}

export function Landing() {
  const { answeredCount, circunscripcion, setCircunscripcion, start, mode } = useQuiz();
  const nRapido = questionsFor('rapido').length;
  const nCompleto = questionsFor('completo').length;
  const go = (m: QuizMode) => { start(m); navigate('test'); };
  const r2023 = ELECTION_RESULTS[0]!;
  // Mini hemiciclo: la investidura real de 2023, síes a la izquierda y noes a la derecha.
  const yes = PACT_PRESETS.find((p) => p.id === 'sanchez-2023')!.yes;
  const investidura = [...r2023.results].sort((a, b) => Number(yes.includes(b.party)) - Number(yes.includes(a.party)) || b.seats - a.seats)
    .map((r) => ({ key: r.party, label: `${r.shortName} (${yes.includes(r.party) ? 'sí' : 'no'})`, seats: r.seats, color: r.color }));
  const faces = candidates.filter((c) => c.name !== 'Por confirmar').slice(0, 6);

  return (
    <main id="contenido" className="wrap wide">
      <section className="front-hero" aria-labelledby="h-hero">
        <div>
          <p className="kicker">El test · {nRapido} o {nCompleto} preguntas</p>
          <h1 id="h-hero">¿Con qué partido coinciden más tus ideas?</h1>
          <p className="dek">Compara tus respuestas con lo que defiende cada candidatura, con la fuente de cada posición a la vista.</p>

          {APP.enableCircunscripcion && (
            <p>
              <label htmlFor="circ" className="small muted sans">Tu circunscripción (opcional)</label><br />
              <select id="circ" className="select" value={circunscripcion ?? ''} onChange={(e) => setCircunscripcion(e.target.value || null)}>
                <option value="">Toda España</option>
                {circunscripciones.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </p>
          )}

          <div className="modes" aria-label="Elige el test">
            <button className="mode primary" onClick={() => go('rapido')}>
              <span className="mode-n">{nRapido}</span>
              <span><strong>Test rápido</strong><span className="muted">Unos {Math.round(nRapido * 0.25)} minutos. Los temas que más diferencian a las candidaturas.</span></span>
            </button>
            <button className="mode" onClick={() => go('completo')}>
              <span className="mode-n">{nCompleto}</span>
              <span><strong>Test completo</strong><span className="muted">Unos {Math.round(nCompleto * 0.3)} minutos. Añade pensiones, lengua, instituciones y campo, y marcas qué temas te importan más.</span></span>
            </button>
          </div>
          <ul className="privacy-tags" aria-label="Cómo funciona el test">
            {PRIVACY_TAGS.map((t) => <li key={t}>{t}</li>)}
          </ul>
          <p className="privacy-line">{PRIVACY_LINE}</p>
          {answeredCount > 0 && (
            <p style={{ marginTop: '1rem' }}><button className="btn" onClick={() => navigate('test')}>Continuar el test {mode === 'completo' ? 'completo' : 'rápido'} ({answeredCount} respondidas)</button></p>
          )}
        </div>
        <NextDate />
      </section>

      <AdSlot slot="landing" />

      <div className="front-label"><h2>Antes de votar</h2></div>
      <div className="modules">
        <Module route="pactos" kicker="Calculadora de pactos" title="¿Quién suma para gobernar?" lead
          art={<Hemicycle title="Investidura de 2023: síes a la izquierda, noes a la derecha" total={r2023.totalSeats} rows={10} showMajority groups={investidura} />}>
          Elige qué vota cada partido en una investidura y comprueba si sale adelante. Arriba, la de 2023: 179 síes frente a 171 noes.
        </Module>
        <Module route="candidatos" kicker="Quién es quién" title="Las caras del 29N"
          art={<div className="mono-row">{faces.map((c) => (
            <span key={c.party} className="monogram" style={{ background: realParties.find((p) => p.id === c.party)?.color }}>{initials(c.name)}</span>
          ))}</div>}>
          Quién encabeza cada candidatura, con su trayectoria y su web.
        </Module>
        <Module route="propuestas" kicker="Compara propuestas" title="Qué propone cada partido">
          Las medidas de cada programa, tema a tema y lado a lado.
        </Module>
        <Module route="calendario" kicker="Calendario" title="Las fechas del 29N">
          Coaliciones, listas, voto por correo, campaña y jornada de reflexión.
        </Module>
        <Module route="como-votar" kicker="Cómo votar" title="Que tu voto cuente">
          En persona, por correo o desde el extranjero, y cómo evitar el voto nulo.
        </Module>
      </div>

      <div className="front-label"><h2>Explora el test</h2></div>
      <div className="modules">
        <Module route="partidos" kicker="Partidos" title="Qué defiende cada candidatura">Sus posiciones, pregunta a pregunta y con su fuente.</Module>
        <Module route="temas" kicker="Temas" title={`Los ${dataset.topics.length} temas del test`}>Dónde se sitúa cada candidatura en cada asunto.</Module>
        <Module route="brujula" kicker="Brújula" title="La brújula política">Las candidaturas en dos ejes: economía y valores sociales.</Module>
      </div>

      <section className="facts" aria-label="Cómo es el test">
        <div><strong>Más que izquierda y derecha</strong><span className="muted">Verás con quién coincides en cada área: puede no ser el mismo partido.</span></div>
        <div><strong>Cada posición, con su fuente</strong><span className="muted">Si una posición no está documentada, no se usa. Si es una estimación, se indica.</span></div>
        <div><strong>Responde solo lo que tengas claro</strong><span className="muted">Puedes saltarte cualquier pregunta: no cuenta para ninguna candidatura.</span></div>
      </section>
      {dataset.meta.mode === 'real' && <p className="note">{dataset.meta.notice}</p>}
    </main>
  );
}
