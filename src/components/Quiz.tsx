import { useEffect, useRef } from 'react';
import { dataset } from '../data';
import { LIKERT, PRIVACY_LINE, PRIVACY_TAGS } from '../lib/constants';
import { navigate } from '../lib/router';
import { useQuiz } from '../state/quiz';
import type { AnswerValue, Question } from '../types';

export function ProgressBar({ value, total }: { value: number; total: number }) {
  return (
    <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={value} aria-label="Progreso del test">
      <i style={{ width: `${(value / total) * 100}%` }} />
    </div>
  );
}

function AnswerScale({ q, current, onPick }: { q: Question; current: AnswerValue | undefined; onPick: (v: AnswerValue) => void }) {
  if (q.kind === 'choice' && q.options) {
    const opts = [{ v: -1, k: 'A', t: q.options.a }, { v: 1, k: 'B', t: q.options.b }, { v: 0, k: 'C', t: 'Ninguna de las dos / No lo tengo claro' }];
    return (
      <div className="answers" role="group" aria-label="Opciones">
        {opts.map((o) => (
          <button key={o.k} className="answer choice" aria-pressed={current === o.v} onClick={() => onPick(o.v)}>
            <span className="key" aria-hidden="true">{o.k}</span><span>{o.t}</span>
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className="answers likert" role="group" aria-label="Grado de acuerdo">
      {[...LIKERT].reverse().map((l, i) => (
        <button key={l.value} className="answer" aria-pressed={current === l.value} onClick={() => onPick(l.value)}>
          <span className="key" aria-hidden="true">{5 - i}</span>
          <span>{l.label}</span>
          <span className="dots" aria-hidden="true">{[0, 1, 2, 3, 4].map((d) => <i key={d} className={d <= 4 - i ? 'f' : ''} />)}</span>
        </button>
      ))}
    </div>
  );
}

export function Quiz() {
  const { index, total, questions, mode, answers, importance, setImportant, answer, goto, restart, answeredCount } = useQuiz();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const done = index >= total;
  const q = questions[Math.min(index, total - 1)]!;
  const topic = dataset.topics.find((t) => t.id === q.topic)!;

  useEffect(() => { if (done) navigate('resultado'); }, [done]);
  useEffect(() => { window.scrollTo({ top: 0 }); headingRef.current?.focus({ preventScroll: true }); }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement)?.tagName === 'SELECT') return;
      const k = e.key.toLowerCase();
      if (q.kind === 'likert' && /^[1-5]$/.test(k)) answer(q.id, LIKERT[Number(k) - 1]!.value);
      else if (q.kind === 'choice' && (k === 'a' || k === 'b' || k === 'c')) answer(q.id, k === 'a' ? -1 : k === 'b' ? 1 : 0);
      else if (k === 'arrowleft' && index > 0) goto(index - 1);
      else if (k === 'arrowright' && answers[q.id] !== undefined) goto(index + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [q, index, answers, answer, goto]);

  if (done) return null;

  return (
    <main id="contenido" className="wrap narrow">
      <div className="quiz-top">
        <span><strong>Pregunta {index + 1} de {total}</strong><span className="muted">{mode === 'completo' ? ' · test completo' : ' · test rápido'}</span></span>
        <button className="btn ghost sm" onClick={() => { restart(); navigate('inicio'); }}>Reiniciar</button>
      </div>
      {index === 0 && <p className="privacy-mini"><strong>{PRIVACY_TAGS.join(' · ')}.</strong> {PRIVACY_LINE}</p>}
      <ProgressBar value={index} total={total} />

      <article className="ballot q-enter" key={q.id} aria-labelledby="q-heading">
        <div className="q-topic">{topic.name}</div>
        <h1 id="q-heading" className="q-text" tabIndex={-1} ref={headingRef}>{q.text}</h1>
        {q.help && <p className="muted small">{q.help}</p>}
        {mode === 'completo' && (
          <label className="importance">
            <input type="checkbox" checked={!!importance[q.id]} onChange={(e) => setImportant(q.id, e.target.checked)} />
            <span>Este tema es especialmente importante para mí</span>
          </label>
        )}
        <AnswerScale q={q} current={answers[q.id]} onPick={(v) => answer(q.id, v)} />
      </article>

      <div className="quiz-nav">
        <button className="btn" onClick={() => goto(index - 1)} disabled={index === 0}>Anterior</button>
        <button className="btn ghost" onClick={() => answer(q.id, 'skip')}>Prefiero no responder</button>
        {answers[q.id] !== undefined && <button className="btn" onClick={() => goto(index + 1)}>Siguiente</button>}
      </div>
      {index === total - 1 && answeredCount > 0 && <p className="muted small" style={{ marginTop: '1rem' }}>Al responder verás tu resultado.</p>}
      <p className="kbd-hint">Atajos: teclas {q.kind === 'likert' ? '1 a 5' : 'A, B o C'} para responder, flechas para moverte.</p>
    </main>
  );
}
