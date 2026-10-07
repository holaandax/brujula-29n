import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import type { AnswerValue, Answers } from '../types';
import { dataset } from '../data';

/**
 * Estado del test. Vive solo en memoria (React). No se usa localStorage, cookies ni red:
 * al cerrar o recargar la pestaña, las respuestas desaparecen.
 */
interface State { answers: Answers; index: number; circunscripcion: string | null }
type Action =
  | { type: 'answer'; id: string; value: AnswerValue }
  | { type: 'goto'; index: number }
  | { type: 'restart' }
  | { type: 'circunscripcion'; code: string | null };

const total = dataset.questions.length;
const initial: State = { answers: {}, index: 0, circunscripcion: null };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'answer':
      return { ...s, answers: { ...s.answers, [a.id]: a.value }, index: Math.min(s.index + 1, total) };
    case 'goto':
      return { ...s, index: Math.max(0, Math.min(a.index, total)) };
    case 'restart':
      return { ...initial, circunscripcion: s.circunscripcion };
    case 'circunscripcion':
      return { ...s, circunscripcion: a.code };
  }
}

interface Ctx extends State {
  total: number;
  answer: (id: string, value: AnswerValue) => void;
  goto: (i: number) => void;
  restart: () => void;
  setCircunscripcion: (c: string | null) => void;
  answeredCount: number;
}

const QuizCtx = createContext<Ctx | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const value = useMemo<Ctx>(() => ({
    ...state,
    total,
    answer: (id, v) => dispatch({ type: 'answer', id, value: v }),
    goto: (index) => dispatch({ type: 'goto', index }),
    restart: () => dispatch({ type: 'restart' }),
    setCircunscripcion: (code) => dispatch({ type: 'circunscripcion', code }),
    answeredCount: Object.values(state.answers).filter((v) => typeof v === 'number').length,
  }), [state]);
  return <QuizCtx.Provider value={value}>{children}</QuizCtx.Provider>;
}

export function useQuiz(): Ctx {
  const c = useContext(QuizCtx);
  if (!c) throw new Error('useQuiz fuera de QuizProvider');
  return c;
}
