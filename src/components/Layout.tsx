import { intlLocale } from '../i18n';
import { Component, type ReactNode } from 'react';
import { APP } from '../config';
import { dataset } from '../data';
import { ELECTION, daysUntil } from '../data/electoral';
import { href, type Route } from '../lib/router';
import { t, LanguageSwitcher } from '../i18n';

/** Logotipo: un hemiciclo de escaños con la aguja de una brújula. */
export function Logo() {
  const rows = [{ r: 30, n: 9 }, { r: 22, n: 7 }, { r: 14, n: 5 }];
  return (
    <svg viewBox="0 0 76 42" aria-hidden="true">
      {rows.flatMap(({ r, n }) => Array.from({ length: n }, (_, i) => {
        const a = Math.PI * (1 - i / (n - 1));
        return <circle key={`${r}-${i}`} cx={38 + r * Math.cos(a)} cy={38 - r * Math.sin(a)} r={3} fill="currentColor" />;
      }))}
      <path d="M38 38 L58 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="38" cy="38" r="4" fill="currentColor" />
    </svg>
  );
}

function Brand() {
  return <a className="brand" href={href('inicio')}><Logo /><span>Brújula <span className="yr">29N</span></span></a>;
}

export const SECTIONS: { route: Route; label: string; group: 'test' | 'antes' | 'eleccion' }[] = [
  { route: 'partidos', get label() { return t('Qué defiende cada partido'); }, group: 'test' },
  { route: 'temas', get label() { return t('Los temas'); }, group: 'test' },
  { route: 'brujula', get label() { return t('Brújula política'); }, group: 'test' },
  { route: 'candidatos', get label() { return t('Quién es quién'); }, group: 'antes' },
  { route: 'propuestas', get label() { return t('Compara propuestas'); }, group: 'antes' },
  { route: 'pactos', get label() { return t('Calculadora de pactos'); }, group: 'antes' },
  { route: 'calendario', get label() { return t('Calendario'); }, group: 'eleccion' },
  { route: 'como-votar', get label() { return t('Cómo votar'); }, group: 'eleccion' },
];

function Dateline() {
  const today = new Date();
  const days = daysUntil(ELECTION.date, today);
  const fecha = today.toLocaleDateString(intlLocale(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <div className="dateline">
      <div className="wrap wide">
        <span className="today">{fecha.charAt(0).toUpperCase() + fecha.slice(1)}</span>
        <span className="cd">
          {days > 1 ? <>{t('Elecciones generales')} · <strong>{t('faltan {n} días', { n: days })}</strong></>
            : days === 1 ? <strong>{t('Mañana, elecciones generales')}</strong>
            : days === 0 ? <strong>{t('Hoy se vota · colegios abiertos de 9:00 a 20:00')}</strong>
            : <>{t('Elecciones generales del 29 de noviembre de 2026')}</>}
        </span>
        <LanguageSwitcher />
      </div>
    </div>
  );
}

export function Header({ route }: { route: Route }) {
  const front = route === 'inicio';
  return (
    <>
      <a className="skip" href="#contenido">{t('Saltar al contenido')}</a>
      <Dateline />
      <header className={`site-header${front ? ' front' : ''}`}>
        <div className="wrap wide">
          <Brand />
          {front
            ? <p className="tagline">{t('El test de afinidad y la guía de las elecciones generales del 29 de noviembre')}</p>
            : route !== 'test' && <a className="btn primary header-cta" href={href('inicio')}>{t('Hacer el test')}</a>}
        </div>
      </header>
      {dataset.meta.mode === 'demo' && (
        <div className="demo-banner" role="note">
          <div className="wrap wide"><strong>{t('Modo demostración')}</strong> {t(dataset.meta.notice)}</div>
        </div>
      )}
    </>
  );
}

/** Cabecera de página interior: miga, antetítulo, titular y entradilla. */
export function PageHead({ kicker, title, dek, children }: { kicker: string; title: ReactNode; dek?: ReactNode; children?: ReactNode }) {
  return (
    <>
      <nav className="crumbs" aria-label={t('Ruta')}><a href={href('inicio')}>{t('Portada')}</a> / {kicker}</nav>
      <header className="page-head">
        <p className="kicker">{kicker}</p>
        <h1>{title}</h1>
        {dek && <p className="dek">{dek}</p>}
        {children}
      </header>
    </>
  );
}

export function Footer() {
  const col = (g: (typeof SECTIONS)[number]['group']) => SECTIONS.filter((s) => s.group === g)
    .map((s) => <li key={s.route}><a href={href(s.route)}>{s.label}</a></li>);
  return (
    <footer className="site-footer">
      <div className="wrap wide">
        <div className="footer-cols">
          <nav aria-labelledby="f-test"><h2 id="f-test">{t('El test')}</h2><ul><li><a href={href('inicio')}>{t('Hacer el test')}</a></li>{col('test')}</ul></nav>
          <nav aria-labelledby="f-antes"><h2 id="f-antes">{t('Antes de votar')}</h2><ul>{col('antes')}</ul></nav>
          <nav aria-labelledby="f-29n"><h2 id="f-29n">{t('El 29N')}</h2><ul>{col('eleccion')}</ul></nav>
          <nav aria-labelledby="f-about"><h2 id="f-about">{t('Sobre la web')}</h2><ul>
            <li><a href={href('metodologia')}>{t('Cómo funciona')}</a></li>
            <li><a href={href('fuentes')}>{t('Fuentes')}</a></li>
            <li><a href={href('datos')}>{t('Datos utilizados')}</a></li>
            <li><a href={href('privacidad')}>{t('Privacidad')}</a></li>
            {APP.contactUrl && <li><a href={APP.contactUrl}>{t('Contacto')}</a></li>}
          </ul></nav>
        </div>
        <p>
          {t('El resultado del test representa la similitud entre tus respuestas y las posiciones políticas documentadas que utiliza. Las posiciones y los programas pueden evolucionar, y no todas las cuestiones políticas caben en {n} preguntas.', { n: dataset.questions.length })}
        </p>
        <p>{t('Proyecto independiente, sin relación con ninguna candidatura. Datos actualizados el {d}.', { d: new Date(dataset.meta.updatedAt).toLocaleDateString(intlLocale()) })}</p>
      </div>
    </footer>
  );
}

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(e: unknown) { console.error(e); }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="wrap narrow" id="contenido">
        <h1>{t('Esta página no se ha podido mostrar')}</h1>
        <p>{t('Vuelve a la portada para empezar de nuevo. Tus respuestas no se guardan en ningún sitio, así que no se ha enviado nada.')}</p>
        <a className="btn primary" href={href('inicio')} onClick={() => this.setState({ failed: false })}>{t('Volver a la portada')}</a>
      </main>
    );
  }
}
