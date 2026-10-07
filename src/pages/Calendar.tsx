import { intlLocale } from '../i18n';
import { ELECTION, PHASES, daysUntil, nextKeyEvent, type CalendarEvent, type CalendarPhase } from '../data/electoral';
import { PageHead } from '../components/Layout';
import { href } from '../lib/router';

const day = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(intlLocale(), { day: 'numeric', month: 'short' }).replace('.', '');
const weekday = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(intlLocale(), { weekday: 'long' });

export function dateRange(e: CalendarEvent): string {
  return e.end ? `${day(e.date)} – ${day(e.end)}` : day(e.date);
}

function status(e: CalendarEvent, next?: CalendarEvent): 'past' | 'now' | 'next' | '' {
  if (daysUntil(e.end ?? e.date) < 0) return 'past';
  if (e.end && daysUntil(e.date) <= 0) return 'now';
  if (!e.end && daysUntil(e.date) === 0) return 'now';
  return e === next ? 'next' : '';
}

export function ProvisionalNotice() {
  if (!ELECTION.calendarProvisional) return null;
  return (
    <p className="provisional" role="note">
      <strong>Fechas provisionales.</strong>
      <span>Están pendientes de contrastar con el decreto de convocatoria publicado en el BOE y con la Junta Electoral Central.</span>
    </p>
  );
}

export function Calendar() {
  const next = nextKeyEvent();
  const phases = Object.keys(PHASES) as CalendarPhase[];
  const days = daysUntil(ELECTION.date);
  return (
    <main id="contenido" className="wrap">
      <PageHead
        kicker="Calendario"
        title="Las fechas del 29N"
        dek={days > 0 ? `Faltan ${days} días para las elecciones. Del decreto de convocatoria a la constitución de las nuevas Cortes.` : 'Del decreto de convocatoria a la constitución de las nuevas Cortes.'}
      />
      <ProvisionalNotice />
      {phases.map((ph) => {
        const events = ELECTION.calendar.filter((e) => e.phase === ph);
        if (!events.length) return null;
        return (
          <section key={ph} className="cal-phase" aria-labelledby={`ph-${ph}`}>
            <h2 id={`ph-${ph}`}>{PHASES[ph]}</h2>
            <ol className="cal">
              {events.map((e) => (
                <li key={e.label} className={[status(e, next), e.date === ELECTION.date ? 'election' : ''].filter(Boolean).join(' ')}>
                  <div className="cal-date">{dateRange(e)}<span>{e.end ? 'plazo' : weekday(e.date)}</span></div>
                  <div>
                    <h3>{e.label}</h3>
                    {e.detail && <p>{e.detail}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        );
      })}
      <p className="section">
        <a className="btn" href={href('como-votar')}>Cómo votar, paso a paso</a>
      </p>
    </main>
  );
}
