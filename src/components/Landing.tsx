import { APP } from '../config';
import { dataset } from '../data';
import { circunscripciones, ELECTION } from '../data/electoral';
import { navigate, href } from '../lib/router';
import { useQuiz } from '../state/quiz';

export function Landing() {
  const { total, answeredCount, circunscripcion, setCircunscripcion, restart } = useQuiz();
  const minutes = Math.max(3, Math.round(total * 0.25));
  const date = new Date(ELECTION.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <main id="contenido" className="wrap">
      <section className="hero">
        <h1>¿Con qué partido coinciden más tus ideas?</h1>
        <p className="hero-lead">Responde {total} preguntas y descubre qué candidaturas se acercan más a tus posiciones políticas.</p>

        {APP.enableCircunscripcion && (
          <p>
            <label htmlFor="circ" className="small muted">Tu circunscripción (opcional)</label><br />
            <select id="circ" className="select" value={circunscripcion ?? ''} onChange={(e) => setCircunscripcion(e.target.value || null)}>
              <option value="">Toda España</option>
              {circunscripciones.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          </p>
        )}

        <div className="row" style={{ marginTop: '1.6rem' }}>
          <button className="btn primary big" onClick={() => { if (answeredCount === 0) restart(); navigate('test'); }}>
            {answeredCount > 0 ? 'Continuar test' : 'Empezar test'}
          </button>
          {answeredCount > 0 && <button className="btn ghost" onClick={() => { restart(); navigate('test'); }}>Empezar de cero</button>}
        </div>
        <p className="hero-meta">{total} preguntas, unos {minutes} minutos. Elecciones generales del {date}.</p>

        <div className="ballot hero-ballot" aria-hidden="true">
          <div className="q">Las administraciones deberían poder limitar el precio del alquiler en zonas con precios muy altos.</div>
          <div className="mini-scale"><span /><span /><span /><span className="on" /><span /></div>
        </div>
      </section>

      <section className="facts" aria-label="Cómo es el test">
        <div><strong>Se calcula en tu dispositivo</strong><span className="muted">Tus respuestas no salen del navegador y desaparecen al cerrar la pestaña.</span></div>
        <div><strong>Más que izquierda y derecha</strong><span className="muted">Verás con quién coincides en cada área: puede no ser el mismo partido.</span></div>
        <div><strong>Con fuentes</strong><span className="muted">Cada posición se enlaza a su programa o documento oficial. <a href={href('datos')}>Ver datos</a></span></div>
      </section>
      {dataset.meta.mode === 'real' && <p className="note">{dataset.meta.notice}</p>}
    </main>
  );
}
