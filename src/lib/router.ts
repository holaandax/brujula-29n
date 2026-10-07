import { useEffect, useState } from 'react';

export type Route = 'inicio' | 'test' | 'resultado' | 'metodologia' | 'fuentes' | 'datos' | 'privacidad';
const ROUTES: Route[] = ['inicio', 'test', 'resultado', 'metodologia', 'fuentes', 'datos', 'privacidad'];

/** Rutas con hash: no requieren configuración de servidor en Vercel/Netlify. */
function parse(): { route: Route; param: string | null } {
  const [r, p] = window.location.hash.replace(/^#\/?/, '').split('/');
  const route = (ROUTES as string[]).includes(r ?? '') ? (r as Route) : 'inicio';
  return { route, param: p ? decodeURIComponent(p) : null };
}

export function useRoute() {
  const [state, setState] = useState(parse);
  useEffect(() => {
    const on = () => { setState(parse()); window.scrollTo({ top: 0 }); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return state;
}

export const href = (r: Route, param?: string) => `#/${r === 'inicio' ? '' : r}${param ? `/${encodeURIComponent(param)}` : ''}`;
export const navigate = (r: Route, param?: string) => { window.location.hash = href(r, param); };
