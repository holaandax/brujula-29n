import { intlLocale } from '../i18n';
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
import { privacyLine, privacyTags } from '../lib/constants';
import { navigate, href, type Route } from '../lib/router';
import { questionsFor, useQuiz } from '../state/quiz';
import type { QuizMode } from '../types';
import { t } from '../i18n';


const short = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(intlLocale(), { day: 'numeric', month: 'short' }).replace('.', '');

function NextDate() {
  const next = nextKeyEvent();
  if (!next) return null;
  const started = daysUntil(next.date) <= 0;
  const d = daysUntil(started ? (next.end ?? next.date) : next.date);
  const after = ELECTION.calendar.filter((e) => e.key && e !== next && daysUntil(e.date) > Math.max(0, daysUntil(next.date))).slice(0, 3);
  return (
    <aside className="next-date" aria-labelledby="h-next">
      <p className="kicker">{started ? t('En curso') : t('Próxima fecha')}</p>
      {d === 0
        ? <p className="big">{t('Hoy')}</p>
        : <><p className="big">{d}</p><span className="unit">{started ? (d === 1 ? t('día para que termine') : t('días para que termine')) : d === 1 ? t('día') : t('días')}</span></>}
      <h2 id="h-next">{t(next.label)}</h2>
      <p className="small muted" style={{ margin: 0 }}>{next.end ? t('Del {a} al {b}', { a: short(next.date), b: short(next.end) }) : short(next.date)}</p>
      {after.length > 0 && (
        <ol>
          {after.map((e) => <li key={e.label}><span className="cal-date">{short(e.date)}</span><span>{t(e.label)}</span></li>)}
        </ol>
      )}
      <a className="sans small" href={href('calendario')}>{t('Calendario completo')}{ELECTION.calendarProvisional ? ` (${t('provisional')})` : ''}</a>
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
    .map((r) => ({ key: r.party, label: `${r.shortName} (${yes.includes(r.party) ? t('sí') : t('no')})`, seats: r.seats, color: r.color }));
  const faces = candidates.filter((c) => !!c.name).slice(0, 6);

  return (
    <main id="contenido" className="wrap wide">
      <section className="front-hero" aria-labelledby="h-hero">
        <div>
          <p className="kicker">{t('El test · {a} o {b} preguntas', { a: nRapido, b: nCompleto })}</p>
          <h1 id="h-hero">{t('¿Con qué partido coinciden más tus ideas?')}</h1>
          <p className="dek">{t('Compara tus respuestas con lo que defiende cada candidatura, con la fuente de cada posición a la vista.')}</p>

          {APP.enableCircunscripcion && (
            <p>
              <label htmlFor="circ" className="small muted sans">{t('Tu circunscripción (opcional)')}</label><br />
              <select id="circ" className="select" value={circunscripcion ?? ''} onChange={(e) => setCircunscripcion(e.target.value || null)}>
                <option value="">{t('Toda España')}</option>
                {circunscripciones.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </p>
          )}

          <div className="modes" aria-label={t('Elige el test')}>
            <button className="mode primary" onClick={() => go('rapido')}>
              <span className="mode-n">{nRapido}</span>
              <span><strong>{t('Test rápido')}</strong><span className="muted">{t('Unos {n} minutos. Los temas que más diferencian a las candidaturas.', { n: Math.round(nRapido * 0.25) })}</span></span>
            </button>
            <button className="mode" onClick={() => go('completo')}>
              <span className="mode-n">{nCompleto}</span>
              <span><strong>{t('Test completo')}</strong><span className="muted">{t('Unos {n} minutos. Añade pensiones, lengua, instituciones y campo, y marcas qué temas te importan más.', { n: Math.round(nCompleto * 0.3) })}</span></span>
            </button>
          </div>
          <ul className="privacy-tags" aria-label={t('Cómo funciona el test')}>
            {privacyTags().map((x) => <li key={x}>{x}</li>)}
          </ul>
          <p className="privacy-line">{privacyLine()}</p>
          {answeredCount > 0 && (
            <p style={{ marginTop: '1rem' }}><button className="btn" onClick={() => navigate('test')}>{mode === 'completo' ? t('Continuar el test completo ({n} respondidas)', { n: answeredCount }) : t('Continuar el test rápido ({n} respondidas)', { n: answeredCount })}</button></p>
          )}
        </div>
        <NextDate />
      </section>

      <AdSlot slot="landing" />

      <div className="front-label"><h2>{t('Antes de votar')}</h2></div>
      <div className="modules">
        <Module route="pactos" kicker={t('Calculadora de pactos')} title={t('¿Quién suma para gobernar?')} lead
          art={<Hemicycle title={t('Investidura de 2023: síes a la izquierda, noes a la derecha')} total={r2023.totalSeats} rows={10} showMajority groups={investidura} />}>
          {t('Elige qué vota cada partido en una investidura y comprueba si sale adelante. Arriba, la de 2023: 179 síes frente a 171 noes.')}
        </Module>
        <Module route="candidatos" kicker={t('Quién es quién')} title={t('Las caras del 29N')}
          art={<div className="mono-row">{faces.map((c) => (
            <span key={c.party} className="monogram" style={{ background: realParties.find((p) => p.id === c.party)?.color }}>{initials(c.name ?? "")}</span>
          ))}</div>}>
          {t('Quién encabeza cada candidatura y en qué punto está cada designación.')}
        </Module>
        <Module route="propuestas" kicker={t('Compara propuestas')} title={t('Qué propone cada partido')}>
          {t('Las medidas de cada programa, tema a tema y lado a lado.')}
        </Module>
        <Module route="calendario" kicker={t('Calendario')} title={t('Las fechas del 29N')}>
          {t('Coaliciones, listas, voto por correo, campaña y jornada de reflexión.')}
        </Module>
        <Module route="como-votar" kicker={t('Cómo votar')} title={t('Que tu voto cuente')}>
          {t('En persona, por correo o desde el extranjero, y cómo evitar el voto nulo.')}
        </Module>
      </div>

      <div className="front-label"><h2>{t('Explora el test')}</h2></div>
      <div className="modules">
        <Module route="partidos" kicker={t('Partidos')} title={t('Qué defiende cada candidatura')}>{t('Sus posiciones, pregunta a pregunta y con su fuente.')}</Module>
        <Module route="temas" kicker={t('Temas')} title={t('Los {n} temas del test', { n: dataset.topics.length })}>{t('Dónde se sitúa cada candidatura en cada asunto.')}</Module>
        <Module route="brujula" kicker={t('Brújula')} title={t('La brújula política')}>{t('Las candidaturas en dos ejes: economía y valores sociales.')}</Module>
      </div>

      <section className="facts" aria-label={t('Cómo es el test')}>
        <div><strong>{t('Más que izquierda y derecha')}</strong><span className="muted">{t('Verás con quién coincides en cada área: puede no ser el mismo partido.')}</span></div>
        <div><strong>{t('Cada posición, con su fuente')}</strong><span className="muted">{t('Si una posición no está documentada, no se usa. Si es una estimación, se indica.')}</span></div>
        <div><strong>{t('Responde solo lo que tengas claro')}</strong><span className="muted">{t('Puedes saltarte cualquier pregunta: no cuenta para ninguna candidatura.')}</span></div>
      </section>
      {dataset.meta.mode === 'real' && <p className="note">{t(dataset.meta.notice)}</p>}
    </main>
  );
}
