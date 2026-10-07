import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { ca } from './ca';
import { gl } from './gl';
import { eu } from './eu';

/**
 * Traducción sin dependencias. La clave es el propio texto en castellano: t('Hacer el test').
 * Si falta una traducción se muestra el castellano (nunca una clave técnica).
 * Variables: t('Pregunta {n} de {total}', { n: 3, total: 20 }).
 *
 * La preferencia de idioma se guarda en localStorage («lang»). No es un dato político.
 */
export type Locale = 'es' | 'ca' | 'gl' | 'eu';
export const LOCALES: { id: Locale; label: string; name: string }[] = [
  { id: 'es', label: 'ES', name: 'Castellano' },
  { id: 'ca', label: 'CA', name: 'Català' },
  { id: 'gl', label: 'GL', name: 'Galego' },
  { id: 'eu', label: 'EU', name: 'Euskara' },
];
export const DICTS: Record<Exclude<Locale, 'es'>, Record<string, string>> = { ca, gl, eu };
const INTL: Record<Locale, string> = { es: 'es-ES', ca: 'ca-ES', gl: 'gl-ES', eu: 'eu-ES' };

function detect(): Locale {
  try {
    const saved = localStorage.getItem('lang');
    if (saved && LOCALES.some((l) => l.id === saved)) return saved as Locale;
  } catch { /* sin almacenamiento */ }
  const nav = typeof navigator !== 'undefined' ? navigator.language.slice(0, 2) : 'es';
  return (['ca', 'gl', 'eu'] as const).find((l) => l === nav) ?? 'es';
}

let current: Locale = typeof window === 'undefined' ? 'es' : detect();

export function t(s: string, vars?: Record<string, string | number>): string {
  const out = current === 'es' ? s : DICTS[current][s] ?? s;
  return vars ? out.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? '')) : out;
}
export const getLocale = () => current;
export const intlLocale = () => INTL[current];
/** Para tests. */
export const __setLocale = (l: Locale) => { current = l; };

const Ctx = createContext<{ locale: Locale; setLocale: (l: Locale) => void }>({ locale: 'es', setLocale: () => {} });

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, set] = useState<Locale>(current);
  const setLocale = (l: Locale) => {
    current = l;
    try { localStorage.setItem('lang', l); } catch { /* sin almacenamiento */ }
    set(l);
  };
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  return <Ctx.Provider value={{ locale, setLocale }}>{children}</Ctx.Provider>;
}
export const useLocale = () => useContext(Ctx);

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  return (
    <nav className="lang-switch" aria-label="Idioma / Idioma / Lingua / Hizkuntza">
      {LOCALES.map((l) => (
        <button key={l.id} lang={l.id} aria-pressed={locale === l.id} title={l.name} onClick={() => setLocale(l.id)}>{l.label}</button>
      ))}
    </nav>
  );
}

/** Aviso para páginas todavía sin traducir. */
export function UntranslatedNotice() {
  const { locale } = useLocale();
  if (locale === 'es') return null;
  return <p className="provisional" role="note"><span>{t('Esta página todavía solo está disponible en castellano.')}</span></p>;
}
