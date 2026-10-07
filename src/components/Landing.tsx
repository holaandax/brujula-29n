import { APP } from '../config';
import { dataset } from '../data';
import { circunscripciones, ELECTION } from '../data/electoral';
import { navigate, href } from '../lib/router';
import { questionsFor, useQuiz } from '../state/quiz';
import type { QuizMode } from '../types';

export function Landing() {
  const { answeredCount, circunscripcion, setCircunscripcion, start, mode } = useQuiz();
  const nRapido = questionsFor('rapido').length;
  const nCompleto = questionsFor('completo').length;
  const date = new Date(ELECTION.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  const go = (m: QuizMode) => { start(m); navigate('test'); };

  return (
    <main id="contenido" className="wrap">
      <section className="hero">
        <h1>¿Con qué partido coinciden más tus ideas?</h1>
        <p className="hero-lead">Compara tus respuestas con las posiciones documentadas de cada candidatura, con la fuente de cada una a la vista.</p>

        {APP.enableCircunscripcion && (
          <p>
            <label htmlFor="circ" className="small muted">Tu circunscripción (opcional)</label><br />
            <select id="circ" className="select" value={circunscripcion ?? ''} onChange={(e) => setCircunscripcion(e.target.value || null)}>
              <option value="">Toda España</option>
              {circunscripciones.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          </p>
        )}

        <div className="modes" aria-label="Elige el test">
          <button className="mode" onClick={() => go('rapido')}>
            <span className="mode-n">{nRapido}</span>
            <span><strong>Test rápido</strong><span className="muted"> Unos {Math.round(nRapido * 0.25)} minutos. Los temas que más diferencian a las candidaturas.</span></span>
          </button>
          <button className="mode" onClick={() => go('completo')}>
            <span className="mode-n">{nCompleto}</span>
            <span><strong>Test completo</strong><span className="muted"> Unos {Math.round(nCompleto * 0.3)} minutos. Añade pensiones, lengua, instituciones y campo, y puedes marcar qué temas te importan más.</span></span>
          </button>
        </div>
        {answeredCount > 0 && (
          <p><button className="btn" onClick={() => navigate('test')}>Continuar el test {mode === 'completo' ? 'completo' : 'rápido'} ({answeredCount} respondidas)</button></p>
        )}
        <p className="hero-meta">Sin registro. Puedes saltar las preguntas que no tengas claras. Elecciones generales del {date}.</p>

        <div className="ballot hero-ballot" aria-hidden="true">
          <div className="q">Las administraciones deberían poder limitar el precio del alquiler en zonas con precios muy altos.</div>
          <div className="mini-scale"><span /><span /><span /><span className="on" /><span /></div>
        </div>
      </section>

      <section className="facts" aria-label="Cómo es el test">
        <div><strong>Se calcula en tu dispositivo</strong><span className="muted">Tus respuestas no salen del navegador y desaparecen al cerrar la pestaña. No guardamos nada, ni siquiera anónimo.</span></div>
        <div><strong>Más que izquierda y derecha</strong><span className="muted">Verás con quién coincides en cada área: puede no ser el mismo partido.</span></div>
        <div><strong>Cada posición, con su fuente</strong><span className="muted">Si una posición no está documentada, no se usa. Si es una estimación, se indica.</span></div>
      </section>

      <section className="section" aria-labelledby="h-explore">
        <h2 id="h-explore">Explora antes de responder</h2>
        <div className="explore">
          <a href={href('partidos')}><strong>Qué defiende cada candidatura</strong><span className="muted">Sus posiciones, pregunta a pregunta.</span></a>
          <a href={href('temas')}><strong>Los {dataset.topics.length} temas</strong><span className="muted">Dónde se sitúa cada una en cada asunto.</span></a>
          <a href={href('brujula')}><strong>La brújula política</strong><span className="muted">Las candidaturas en dos ejes.</span></a>
        </div>
      </section>
      {dataset.meta.mode === 'real' && <p className="note">{dataset.meta.notice}</p>}
    </main>
  );
}
