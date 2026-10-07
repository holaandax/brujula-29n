import { useEffect, useRef } from 'react';
import { ADS } from '../config';

declare global { interface Window { adsbygoogle?: unknown[] } }
let loaded = false;

/** Banner AdSense. No se muestra nunca dentro de las preguntas ni encima del resultado. */
export function AdSlot({ slot }: { slot: keyof typeof ADS.slots }) {
  const ref = useRef<HTMLModElement>(null);
  const id = ADS.slots[slot];
  useEffect(() => {
    if (!ADS.enabled || !id) return;
    if (!loaded) {
      const s = document.createElement('script');
      s.async = true; s.crossOrigin = 'anonymous';
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS.client}`;
      document.head.appendChild(s); loaded = true;
    }
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch { /* bloqueador */ }
  }, [id]);
  if (!ADS.enabled || !id) return null;
  return (
    <aside className="ad" aria-label="Publicidad">
      <span className="small muted">Publicidad</span>
      <ins ref={ref} className="adsbygoogle" style={{ display: 'block' }} data-ad-client={ADS.client} data-ad-slot={id} data-ad-format="auto" data-full-width-responsive="true" />
    </aside>
  );
}
