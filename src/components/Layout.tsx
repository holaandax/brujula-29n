import { Component, type ReactNode } from 'react';
import { APP } from '../config';
import { dataset } from '../data';
import { href } from '../lib/router';

export function Logo() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="10" y="6" width="44" height="52" rx="4" fill="var(--card)" stroke="currentColor" strokeWidth="4" />
      <rect x="10" y="6" width="44" height="12" fill="var(--sepia)" />
      <path d="M20 38l8 8 16-18" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Header() {
  return (
    <>
      <a className="skip" href="#contenido">Saltar al contenido</a>
      <header className="site-header">
        <div className="wrap">
          <a className="brand" href={href('inicio')}><Logo />{APP.name}</a>
          <nav className="main-nav" aria-label="Principal">
            <a href={href('partidos')}>Partidos</a>
            <a href={href('temas')}>Temas</a>
            <a href={href('brujula')}>Brújula</a>
            <a href={href('metodologia')}>Cómo funciona</a>
          </nav>
        </div>
      </header>
      {dataset.meta.mode === 'demo' && (
        <div className="demo-banner" role="note">
          <div className="wrap"><strong>Modo demostración.</strong> {dataset.meta.notice}</div>
        </div>
      )}
    </>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <nav aria-label="Pie de página">
          <a href={href('metodologia')}>Cómo funciona</a>
          <a href={href('metodologia')}>Metodología</a>
          <a href={href('partidos')}>Partidos</a>
          <a href={href('temas')}>Temas</a>
          <a href={href('brujula')}>Brújula política</a>
          <a href={href('fuentes')}>Fuentes</a>
          <a href={href('datos')}>Datos utilizados</a>
          <a href={href('privacidad')}>Privacidad</a>
          <a href={href('fuentes', 'electoral')}>Datos electorales</a>
          {APP.contactUrl && <a href={APP.contactUrl}>Contacto</a>}
        </nav>
        <p>
          El resultado representa la similitud entre tus respuestas y las posiciones políticas documentadas que utiliza este test.
          Las posiciones y los programas pueden evolucionar, y no todas las cuestiones políticas caben en 20 preguntas.
        </p>
        <p>Proyecto independiente, sin relación con ninguna candidatura. Datos actualizados el {new Date(dataset.meta.updatedAt).toLocaleDateString('es-ES')}.</p>
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
        <h1>Esta página no se ha podido mostrar</h1>
        <p>Vuelve al inicio para empezar de nuevo. Tus respuestas no se guardan en ningún sitio, así que no se ha enviado nada.</p>
        <a className="btn primary" href={href('inicio')} onClick={() => this.setState({ failed: false })}>Volver al inicio</a>
      </main>
    );
  }
}
