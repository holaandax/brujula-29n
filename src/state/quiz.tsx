import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import type { AnswerValue, Answers, Importance, Question, QuizMode } from '../types';
import { dataset } from '../data';

/**
 * Estado del test. Vive solo en memoria (React). No se usa localStorage, cookies ni red:
 * al cerrar o recargar la pestaña, las respuestas desaparecen.
 */
interface State { mode: QuizMode; answers: Answers; importance: Importance; index: number; circunscripcion: string | null }
type Action =
  | { type: 'start'; mode: QuizMode }
  | { type: 'answer'; id: string; value: AnswerValue; total: number }
  | { type: 'important'; id: string; value: boolean }
  | { type: 'goto'; index: number; total: number }
  | { type: 'restart' }
  | { type: 'circunscripcion'; code: string | null };

const initial: State = { mode: 'rapido', answers: {}, importance: {}, index: 0, circunscripcion: null };

export const questionsFor = (mode: QuizMode): Question[] =>
  dataset.questions.filter((q) => mode === 'completo' || q.set === 'rapido');

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'start':
      return { ...initial, mode: a.mode, circunscripcion: s.circunscripcion };
    case 'answer':
      return { ...s, answers: { ...s.answers, [a.id]: a.value }, index: Math.min(s.index + 1, a.total) };
    case 'important':
      return { ...s, importance: { ...s.importance, [a.id]: a.value } };
    case 'goto':
      return { ...s, index: Math.max(0, Math.min(a.index, a.total)) };
    case 'restart':
      return { ...initial, mode: s.mode, circunscripcion: s.circunscripcion };
    case 'circunscripcion':
      return { ...s, circunscripcion: a.code };
  }
}

interface Ctx extends State {
  questions: Question[];
  total: number;
  start: (mode: QuizMode) => void;
  answer: (id: string, value: AnswerValue) => void;
  setImportant: (id: string, value: boolean) => void;
  goto: (i: number) => void;
  restart: () => void;
  setCircunscripcion: (c: string | null) => void;
  answeredCount: number;
}

const QuizCtx = createContext<Ctx | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const value = useMemo<Ctx>(() => {
    const questions = questionsFor(state.mode);
    const total = questions.length;
    return {
      ...state,
      questions,
      total,
      start: (mode) => dispatch({ type: 'start', mode }),
      answer: (id, v) => dispatch({ type: 'answer', id, value: v, total }),
      setImportant: (id, v) => dispatch({ type: 'important', id, value: v }),
      goto: (index) => dispatch({ type: 'goto', index, total }),
      restart: () => dispatch({ type: 'restart' }),
      setCircunscripcion: (code) => dispatch({ type: 'circunscripcion', code }),
      answeredCount: Object.values(state.answers).filter((v) => typeof v === 'number').length,
    };
  }, [state]);
  return <QuizCtx.Provider value={value}>{children}</QuizCtx.Provider>;
}

export function useQuiz(): Ctx {
  const c = useContext(QuizCtx);
  if (!c) throw new Error('useQuiz fuera de QuizProvider');
  return c;
}
