import { useMemo } from 'react';
import { absoluteMajority, hemicycle } from '../lib/pacts';

export interface SeatGroup { key: string; label: string; seats: number; color: string; dim?: boolean }

const W = 400, CX = 200, CY = 204, R = 192, INNER = 0.42;

/**
 * Hemiciclo en SVG. Los grupos se pintan de izquierda a derecha en el orden recibido.
 * Con showMajority dibuja la línea de la mayoría absoluta contando desde la izquierda.
 */
export function Hemicycle({ groups, total, rows = 12, showMajority = false, title }: {
  groups: SeatGroup[]; total: number; rows?: number; showMajority?: boolean; title: string;
}) {
  const seats = useMemo(() => hemicycle(total, rows, INNER), [total, rows]);
  const arc = (Math.PI * R * rows * (1 + INNER)) / 2 / total;
  const radial = (R * (1 - INNER)) / Math.max(1, rows - 1);
  const dot = 0.42 * Math.min(arc, radial);
  const colors: { color: string; dim?: boolean }[] = groups.flatMap((g) => Array.from({ length: g.seats }, () => ({ color: g.color, dim: g.dim })));
  const maj = absoluteMajority(total);
  let line: { x1: number; y1: number; x2: number; y2: number } | null = null;
  if (showMajority && seats[maj - 1] && seats[maj]) {
    const a1 = Math.atan2(seats[maj - 1]!.y, seats[maj - 1]!.x), a2 = Math.atan2(seats[maj]!.y, seats[maj]!.x);
    const a = (a1 + a2) / 2;
    line = { x1: CX + Math.cos(a) * R * (INNER - 0.08), y1: CY - Math.sin(a) * R * (INNER - 0.08), x2: CX + Math.cos(a) * (R + 10), y2: CY - Math.sin(a) * (R + 10) };
  }
  const desc = groups.filter((g) => g.seats > 0).map((g) => `${g.label}: ${g.seats}`).join(', ');

  return (
    <svg className="hemi" viewBox={`0 ${showMajority ? -14 : 0} ${W} ${CY + 12 + (showMajority ? 14 : 0)}`} role="img" aria-label={`${title}. ${desc}.`}>
      {seats.map((s, i) => {
        const c = colors[i];
        return <circle key={i} cx={CX + s.x * R} cy={CY - s.y * R} r={dot} fill={c?.color ?? 'var(--line)'} opacity={c?.dim ? 0.28 : 1} />;
      })}
      {line && (
        <>
          <line className="maj" {...line} />
          <text x={line.x2} y={line.y2 - 5} fontSize="11" textAnchor="middle" fontWeight="700" style={{ fill: 'var(--ink)' }}>{maj}</text>
        </>
      )}
    </svg>
  );
}
