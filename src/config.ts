/** Configuración editable sin tocar la lógica. */
export const APP = {
  name: 'Brújula 29N',
  tagline: 'Test de afinidad política · Elecciones generales 2026',
  siteUrl: 'https://example.org',
  contactUrl: '',
  /** 'demo' (candidaturas ficticias) o 'real'. Se puede forzar con VITE_DATASET. */
  dataset: ((import.meta.env?.VITE_DATASET as string | undefined) ?? 'demo') as 'demo' | 'real',
  /** Selector de circunscripción: desactivado hasta que se publiquen las candidaturas proclamadas. */
  enableCircunscripcion: false,
};

export const SCORING = {
  /** Diferencia máxima (puntos porcentuales) para considerar empate técnico. */
  tieThreshold: 1.5,
  /** Por debajo de esta cobertura se avisa de que el resultado es menos fiable. */
  lowCoverage: 0.75,
  /** Por debajo de esta cobertura la candidatura no entra en el ranking. */
  minCoverage: 0.5,
  /** Por debajo de este porcentaje se usa un lenguaje más prudente. */
  lowAffinity: 60,
  /** Respuestas mínimas para calcular un resultado. */
  minAnswers: 5,
};
