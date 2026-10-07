/** Tipos del dominio. Los datos políticos viven en /src/data y nunca dentro de componentes. */

export type TopicId =
  | 'economia' | 'vivienda' | 'servicios' | 'social' | 'inmigracion'
  | 'seguridad' | 'medioambiente' | 'territorial' | 'europa' | 'exterior';

export interface Topic {
  id: TopicId;
  name: string;
  description: string;
  /** Peso del área. 1 = neutro. Si se cambia, justificarlo en docs/METODOLOGIA.md. */
  weight: number;
}

export type QuestionKind = 'likert' | 'choice';

export interface Question {
  id: string;
  topic: TopicId;
  /** Etiqueta corta del subtema (p. ej. "Impuestos"). */
  subtopic: string;
  kind: QuestionKind;
  text: string;
  help?: string;
  /** Solo para kind = 'choice'. A se codifica como -1 y B como +1. */
  options?: { a: string; b: string };
  /** Peso de la pregunta. 1 = neutro. */
  weight: number;
  /**
   * Contribución al mapa ideológico simplificado. Signo con el que el acuerdo (+1)
   * desplaza el punto: econ +1 → derecha, social +1 → conservador/tradicional.
   * Si se omite, la pregunta no participa en el mapa (sí en la afinidad).
   */
  axis?: { econ?: 1 | -1; social?: 1 | -1 };
}

export type Scope = 'estatal' | 'autonomico' | 'coalicion' | 'territorial';

/** Estado de la candidatura respecto a la Junta Electoral. */
export type CandidacyStatus = 'proclamada' | 'presentada' | 'pendiente' | 'ficticia';

export interface VerifiableLink {
  url: string;
  /** true solo cuando alguien ha comprobado manualmente que la URL es la oficial y funciona. */
  verified: boolean;
}

export interface ProgramDoc extends VerifiableLink {
  title: string;
  date?: string;
}

export interface Party {
  id: string;
  name: string;
  shortName: string;
  acronym: string;
  description: string;
  scope: Scope;
  /** 'all' o lista de códigos de circunscripción (ver data/electoral.ts). */
  circunscripciones: 'all' | string[];
  status: CandidacyStatus;
  /** Color de acento, solo para puntos del gráfico y marcas pequeñas. */
  color: string;
  website?: VerifiableLink;
  program?: ProgramDoc;
  methodologyNotes?: string;
  isDemo?: boolean;
  updatedAt: string;
}

export type SourceType =
  | 'programa' | 'documento_programatico' | 'web_oficial'
  | 'documento_oficial' | 'declaracion_oficial' | 'secundaria' | 'demo';

export interface Source {
  id: string;
  party: string;
  type: SourceType;
  title: string;
  url?: string;
  date?: string;
  /** Página, apartado o cita breve que justifica la posición. */
  reference?: string;
}

export interface Position {
  party: string;
  question: string;
  /**
   * -1 (muy en desacuerdo / opción A) … +1 (muy de acuerdo / opción B).
   * null = NO DISPONIBLE. Nunca equivale a 0 (neutral).
   */
  value: number | null;
  /** Confianza de la fuente, 0–1. Ver SOURCE_CONFIDENCE en lib/constants.ts. */
  confidence: number;
  sourceId?: string;
  note?: string;
  updatedAt: string;
}

export interface DatasetMeta {
  id: string;
  label: string;
  mode: 'demo' | 'real';
  updatedAt: string;
  notice: string;
}

export interface Dataset {
  meta: DatasetMeta;
  topics: Topic[];
  questions: Question[];
  parties: Party[];
  positions: Position[];
  sources: Source[];
}

/** Respuesta del usuario: valor en [-1, 1] o 'skip' (prefiere no responder). */
export type AnswerValue = number | 'skip';
export type Answers = Record<string, AnswerValue>;
