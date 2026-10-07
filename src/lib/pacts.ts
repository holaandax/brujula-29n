/**
 * Calculadora de pactos (investidura). Lógica pura, sin React.
 *
 * Artículo 99 de la Constitución: en la primera votación hace falta mayoría absoluta
 * (más de la mitad de los escaños: 176 de 350). Si no se alcanza, 48 horas después basta
 * la mayoría simple: más síes que noes.
 */
export type Vote = 'si' | 'abstencion' | 'no';

export interface Tally { si: number; abstencion: number; no: number }

export type Verdict =
  | { kind: 'absoluta'; si: number; needed: number }
  | { kind: 'simple'; si: number; no: number; missingAbsolute: number }
  | { kind: 'fallida'; si: number; no: number; missingAbsolute: number };

export const absoluteMajority = (total: number) => Math.floor(total / 2) + 1;

export function tally(seats: { party: string; seats: number }[], votes: Record<string, Vote>): Tally {
  const t: Tally = { si: 0, abstencion: 0, no: 0 };
  for (const s of seats) t[votes[s.party] ?? 'no'] += s.seats;
  return t;
}

export function verdict(t: Tally, total: number): Verdict {
  const needed = absoluteMajority(total);
  const missingAbsolute = Math.max(0, needed - t.si);
  if (t.si >= needed) return { kind: 'absoluta', si: t.si, needed };
  if (t.si > t.no) return { kind: 'simple', si: t.si, no: t.no, missingAbsolute };
  return { kind: 'fallida', si: t.si, no: t.no, missingAbsolute };
}

export interface Seat { x: number; y: number }

/**
 * Posiciones de los escaños de un hemiciclo en coordenadas unitarias (radio exterior 1, centro en 0,0, y hacia arriba).
 * Devuelve los escaños ordenados de izquierda a derecha, de modo que asignarlos en orden forma cuñas por grupo.
 */
export function hemicycle(total: number, rows: number, inner = 0.42): Seat[] {
  const radii = Array.from({ length: rows }, (_, i) => inner + ((1 - inner) * i) / Math.max(1, rows - 1));
  const sumR = radii.reduce((a, b) => a + b, 0);
  const counts = radii.map((r) => Math.floor((total * r) / sumR));
  let rem = total - counts.reduce((a, b) => a + b, 0);
  for (let i = rows - 1; rem > 0; i = (i - 1 + rows) % rows) { counts[i]!++; rem--; }

  const seats: (Seat & { a: number; r: number })[] = [];
  radii.forEach((r, i) => {
    const n = counts[i]!;
    for (let j = 0; j < n; j++) {
      const a = Math.PI * (1 - (n === 1 ? 0.5 : j / (n - 1)));
      seats.push({ x: r * Math.cos(a), y: r * Math.sin(a), a, r });
    }
  });
  seats.sort((p, q) => q.a - p.a || p.r - q.r);
  return seats.map(({ x, y }) => ({ x, y }));
}
