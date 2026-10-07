import { useState } from 'react';
import { dataset } from '../data';
import { mapCoordinates, type Results } from '../lib/scoring';
import { pct } from '../lib/labels';
import { href } from '../lib/router';

const W = 360, H = 360, PAD = 36;
const sx = (x: number) => PAD + ((x + 1) / 2) * (W - 2 * PAD);
const sy = (y: number) => PAD + ((y + 1) / 2) * (H - 2 * PAD); // y +1 (conservador) abajo

export function describePosition(x: number, y: number): string {
  const h = Math.abs(x) < 0.15 ? 'centro' : x < 0 ? (x < -0.55 ? 'izquierda' : 'centroizquierda') : (x > 0.55 ? 'derecha' : 'centroderecha');
  const v = Math.abs(y) < 0.15 ? 'posición intermedia en lo social' : y < 0 ? 'más progresista' : 'más conservador';
  return `${h}, ${v}`;
}

export interface MapPointView { id: string; x: number; y: number; label: string; color: string; score?: number }

/** SVG del mapa. Reutilizado en resultados (con «TÚ») y en la página Brújula (sin usuario). */
export function PoliticalMap({ points, user }: { points: MapPointView[]; user?: { x: number; y: number } | null }) {
  const [sel, setSel] = useState<string>(user ? 'user' : points[0]?.id ?? '');
  const placed: { x: number; y: number }[] = [];
  const labelY = new Map<string, number>();
  for (const p of [...points].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))) {
    const x = sx(p.x), above = sy(p.y) - 13, below = sy(p.y) + 23;
    const clash = (y: number) => placed.some((q) => Math.abs(q.x - x) < 46 && Math.abs(q.y - y) < 16)
      || points.some((o) => o.id !== p.id && Math.abs(sx(o.x) - x) < 34 && Math.abs(sy(o.y) - (y - 4)) < 12);
    const y = !clash(above) ? above : !clash(below) ? below : above - 13;
    placed.push({ x, y }); labelY.set(p.id, y);
  }
  const selected = points.find((p) => p.id === sel);
  const info = (p: MapPointView) => `${p.label}${p.score !== undefined ? `, ${pct(p.score)} de afinidad` : ''}`;

  return (
    <div className="chart-card">
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="map-title map-desc">
        <title id="map-title">Mapa ideológico simplificado</title>
        <desc id="map-desc">{(user ? `Tú: ${describePosition(user.x, user.y)}. ` : '') + points.map((p) => `${info(p)}: ${describePosition(p.x, p.y)}.`).join(' ')}</desc>
        <rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} fill="none" className="axis" />
        <line x1={W / 2} y1={PAD} x2={W / 2} y2={H - PAD} className="axis" />
        <line x1={PAD} y1={H / 2} x2={W - PAD} y2={H / 2} className="axis" />
        <text x={PAD} y={H - PAD + 18} fontSize="11">← Izquierda</text>
        <text x={W - PAD} y={H - PAD + 18} fontSize="11" textAnchor="end">Derecha →</text>
        <text x={W / 2} y={24} fontSize="11" textAnchor="middle">Más progresista</text>
        <text x={W / 2} y={H - PAD + 18} fontSize="11" textAnchor="middle">Más conservador</text>
        {points.map((p) => (
          <g key={p.id} className={`pt${sel === p.id ? ' sel' : ''}`} tabIndex={0} role="button" aria-label={info(p)}
             onClick={() => setSel(p.id)} onFocus={() => setSel(p.id)} onMouseEnter={() => setSel(p.id)}
             onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(p.id); } }}>
            <circle cx={sx(p.x)} cy={sy(p.y)} r={9} fill={p.color} stroke="var(--card)" strokeWidth={2} />
            <text x={sx(p.x)} y={labelY.get(p.id)} fontSize="11" textAnchor="middle" style={{ fill: 'var(--ink)', fontWeight: 600 }}>{p.label}</text>
          </g>
        ))}
        {user && (
          <g className={`pt${sel === 'user' ? ' sel' : ''}`} tabIndex={0} role="button" aria-label="Tu posición"
             onClick={() => setSel('user')} onFocus={() => setSel('user')} onMouseEnter={() => setSel('user')}>
            <rect x={sx(user.x) - 22} y={sy(user.y) - 12} width={44} height={24} rx={12} fill="var(--ink)" />
            <text x={sx(user.x)} y={sy(user.y) + 4.5} fontSize="12" textAnchor="middle" style={{ fill: 'var(--paper)', fontWeight: 800 }}>TÚ</text>
          </g>
        )}
      </svg>
      <div className="chart-info" aria-live="polite">
        {selected
          ? <><strong>{selected.label}</strong>{selected.score !== undefined ? `: ${pct(selected.score, 1)} de afinidad` : ''}. Posición aproximada: {describePosition(selected.x, selected.y)}.</>
          : user ? <><strong>Tu posición</strong>: {describePosition(user.x, user.y)}. Toca un punto para ver cada candidatura.</> : 'Toca un punto para ver cada candidatura.'}
      </div>
    </div>
  );
}

/** Puntos de todas las candidaturas del dataset (sin respuestas del usuario). */
export function partyMapPoints(): MapPointView[] {
  return dataset.parties.flatMap((party) => {
    const c = mapCoordinates(dataset, (q) => dataset.positions.find((p) => p.party === party.id && p.question === q.id)?.value ?? null);
    return c ? [{ id: party.id, ...c, label: party.shortName, color: party.color }] : [];
  });
}

export function IdeologyChart({ res }: { res: Results }) {
  const points: MapPointView[] = res.map.parties.map((p) => {
    const party = dataset.parties.find((x) => x.id === p.id)!;
    const r = res.ranking.find((x) => x.party.id === p.id)!;
    return { ...p, label: party.shortName, color: party.color, score: r.score };
  });
  return (
    <section className="section" aria-labelledby="h-map">
      <h2 id="h-map">Mapa ideológico</h2>
      <p className="lead">
        Una representación simplificada. Cada punto resume solo las preguntas asignadas a cada eje, así que dos partidos cercanos
        aquí pueden diferir mucho en territorio, Europa o energía, que no entran en el mapa. <a href={href('metodologia')}>Cómo se construye</a>
      </p>
      {!res.map.user
        ? <p className="empty">No has respondido suficientes preguntas de los dos ejes para situarte en el mapa.</p>
        : <PoliticalMap points={points} user={res.map.user} />}
    </section>
  );
}
