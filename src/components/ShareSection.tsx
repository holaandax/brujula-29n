import { useEffect, useRef, useState } from 'react';
import { dataset } from '../data';
import { APP } from '../config';
import type { Results } from '../lib/scoring';
import { copyText, shareSummary, whatsappUrl, xUrl } from '../lib/share';

const topicName = (id: string) => dataset.topics.find((t) => t.id === id)?.name ?? id;

/** Dibuja la tarjeta en un canvas local. La imagen se genera en el navegador y no se sube a ningún sitio. */
function drawCard(canvas: HTMLCanvasElement, res: Results) {
  const W = 1080, H = 1350;
  canvas.width = W; canvas.height = H;
  const c = canvas.getContext('2d');
  if (!c) return;
  const display = '"Newsreader Variable", Georgia, serif';
  const body = '"Archivo Variable", Arial, sans-serif';
  c.fillStyle = '#F3F2EE'; c.fillRect(0, 0, W, H);
  // Papeleta: hoja con filete superior de tinta
  const x = 70, y = 70, w = W - 140, h = H - 140;
  c.fillStyle = '#FBFAF7'; c.fillRect(x, y, w, h);
  c.strokeStyle = '#CDCAC2'; c.lineWidth = 3; c.strokeRect(x, y, w, h);
  c.fillStyle = '#151514'; c.fillRect(x, y, w, 16);

  const L = x + 80, R = x + w - 80;
  c.fillStyle = '#5F5D58'; c.font = `italic 400 44px ${display}`;
  c.fillText('¿Con qué partido coinciden', L, y + 120);
  c.fillText('más tus ideas?', L, y + 170);

  const lead = res.leaders[0]!;
  c.fillStyle = '#151514';
  if (res.isTie) {
    c.font = `700 40px ${body}`; c.fillStyle = '#151514'; c.fillText('Empate técnico', L, y + 290);
    c.fillStyle = '#151514'; c.font = `600 92px ${display}`;
    c.fillText(fit(c, res.leaders.map((l) => l.party.shortName).join(' / '), R - L), L, y + 400);
    c.font = `500 150px ${display}`; c.fillText(`${Math.round(lead.score)}%`, L, y + 560);
  } else {
    c.font = `600 120px ${display}`; c.fillText(fit(c, lead.party.shortName, R - L), L, y + 330);
    c.font = `500 220px ${display}`; c.fillText(`${Math.round(lead.score)}%`, L, y + 540);
  }
  c.font = `600 40px ${body}`; c.fillStyle = '#5F5D58'; c.fillText('de coincidencia', L, y + 600);

  c.strokeStyle = '#151514'; c.lineWidth = 4; c.beginPath(); c.moveTo(L, y + 670); c.lineTo(R, y + 670); c.stroke();
  // Afinidad de la candidatura principal en sus áreas con más datos.
  const rows = Object.values(lead.topics).filter((t) => t.score !== null).sort((a, b) => b.score! - a.score!).slice(0, 5);
  rows.forEach((t, i) => {
    const ry = y + 740 + i * 74;
    c.fillStyle = '#151514'; c.font = `500 40px ${body}`; c.fillText(fit(c, topicName(t.topic), R - L - 140), L, ry);
    c.textAlign = 'right'; c.font = `700 40px ${display}`;
    c.fillText(`${Math.round(t.score!)}%`, R, ry); c.textAlign = 'left';
  });
  c.fillStyle = '#5F5D58'; c.font = `500 32px ${body}`;
  c.fillText(`${APP.name} · Elecciones generales 29N 2026`, L, y + h - 90);
  if (dataset.meta.mode === 'demo') { c.fillStyle = '#151514'; c.fillText('Datos de demostración: candidaturas ficticias', L, y + h - 45); }
}

function fit(c: CanvasRenderingContext2D, text: string, max: number): string {
  if (c.measureText(text).width <= max) return text;
  let t = text;
  while (t.length > 1 && c.measureText(t + '…').width > max) t = t.slice(0, -1);
  return t + '…';
}

export function ShareSection({ res }: { res: Results }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<string>('');
  const [msg, setMsg] = useState('');
  const text = shareSummary(dataset, res);

  useEffect(() => {
    let alive = true;
    const run = () => {
      if (!alive || !canvasRef.current) return;
      drawCard(canvasRef.current, res);
      setImg(canvasRef.current.toDataURL('image/png'));
    };
    if (document.fonts?.ready) document.fonts.ready.then(run); else run();
    return () => { alive = false; };
  }, [res]);

  const flash = (m: string) => { setMsg(m); window.setTimeout(() => setMsg(''), 2500); };

  const shareImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'));
    if (!blob) return;
    const file = new File([blob], 'mi-afinidad-29n.png', { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ files: [file], text }); return; } catch { /* cancelado */ }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = file.name; a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <section className="section" aria-labelledby="h-share">
      <h2 id="h-share">Compartir mi resultado</h2>
      <p className="lead">Solo se comparte el resultado que ves en la tarjeta, nunca tus respuestas. Nada pasa por nuestros servidores.</p>
      <canvas ref={canvasRef} hidden />
      {img && <img className="share-card-preview" src={img} alt={`Tarjeta de resultado: ${text.split('\n')[0]}`} />}
      <div className="row">
        <button className="btn primary" onClick={shareImage}>Guardar o compartir imagen</button>
        <a className="btn" href={whatsappUrl(text)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a className="btn" href={xUrl(text)} target="_blank" rel="noopener noreferrer">X</a>
        <button className="btn" onClick={async () => flash((await copyText(APP.siteUrl)) ? 'Enlace copiado' : 'No se ha podido copiar')}>Copiar enlace</button>
        <button className="btn" onClick={async () => flash((await copyText(text)) ? 'Resumen copiado' : 'No se ha podido copiar')}>Copiar resumen</button>
      </div>
      <p className="toast" role="status">{msg}</p>
    </section>
  );
}
