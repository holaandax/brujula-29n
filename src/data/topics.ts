import type { Topic } from '../types';

/** Todos los pesos de área son 1: ninguna área cuenta más que otra por decisión editorial. */
export const topics: Topic[] = [
  { id: 'economia', name: 'Economía y trabajo', description: 'Impuestos, gasto, déficit y mercado laboral.', weight: 1 },
  { id: 'vivienda', name: 'Vivienda', description: 'Alquiler, suelo y regulación del mercado.', weight: 1 },
  { id: 'servicios', name: 'Servicios públicos', description: 'Sanidad y educación.', weight: 1 },
  { id: 'social', name: 'Derechos y política social', description: 'Igualdad, eutanasia y derechos individuales.', weight: 1 },
  { id: 'inmigracion', name: 'Inmigración', description: 'Control de fronteras e integración.', weight: 1 },
  { id: 'seguridad', name: 'Seguridad y justicia', description: 'Delitos y penas.', weight: 1 },
  { id: 'medioambiente', name: 'Medio ambiente y energía', description: 'Emisiones y energía nuclear.', weight: 1 },
  { id: 'territorial', name: 'Modelo territorial', description: 'Autonomías, competencias y autodeterminación.', weight: 1 },
  { id: 'europa', name: 'Unión Europea', description: 'Integración y soberanía.', weight: 1 },
  { id: 'exterior', name: 'Exterior y defensa', description: 'OTAN y gasto militar.', weight: 1 },
  { id: 'pensiones', name: 'Pensiones y bienestar', description: 'Jubilación, pensiones y renta mínima.', weight: 1 },
  { id: 'lengua', name: 'Lengua e identidad', description: 'Lenguas cooficiales en la escuela y en las instituciones.', weight: 1 },
  { id: 'instituciones', name: 'Instituciones', description: 'Jefatura del Estado y poder judicial.', weight: 1 },
  { id: 'rural', name: 'Campo y mundo rural', description: 'Ayudas agrarias y uso del suelo.', weight: 1 },
];
