/**
 * QUIÉN ES QUIÉN — CANDIDATOS A LA PRESIDENCIA (PROVISIONAL).
 *
 * Las listas no se proclaman hasta el 03/11/2026. Mientras tanto se muestra, para cada formación,
 * a quien la encabezó en 2023 o la lidera hoy, con provisional: true.
 *
 * Fotos: colocar el archivo en public/candidatos/<party>.jpg (formato vertical 4:5, 600×750 aprox.)
 * y poner photo: '/candidatos/<party>.jpg'. Usar solo imágenes con licencia que permita su uso
 * (p. ej. fotos oficiales de prensa del partido o del Congreso). Sin foto se muestran las iniciales.
 *
 * url: perfil o página del candidato. Si se deja vacío, se enlaza la web oficial del partido.
 */
export interface Candidate {
  party: string;
  name: string;
  role: string;
  photo?: string;
  url?: string;
  bio?: string;
  provisional: boolean;
}

const role = 'Candidato a la Presidencia del Gobierno';
const roleF = 'Candidata a la Presidencia del Gobierno';
const head = (circ: string) => `Cabeza de lista por ${circ}`;

export const candidates: Candidate[] = [
  { party: 'psoe', name: 'Pedro Sánchez', role, bio: 'Presidente del Gobierno desde 2018 y secretario general del PSOE.', provisional: true },
  { party: 'pp', name: 'Alberto Núñez Feijóo', role, bio: 'Presidente del PP desde 2022. Fue presidente de la Xunta de Galicia entre 2009 y 2022.', provisional: true },
  { party: 'vox', name: 'Santiago Abascal', role, bio: 'Presidente de Vox desde 2014.', provisional: true },
  { party: 'sumar', name: 'Por confirmar', role: 'Candidatura del Frente Amplio', bio: 'El Frente Amplio presenta su proyecto y su candidato el 17 de octubre.', provisional: true },
  { party: 'podemos', name: 'Irene Montero', role: roleF, bio: 'Eurodiputada. Fue ministra de Igualdad entre 2020 y 2023.', provisional: true },
  { party: 'erc', name: 'Gabriel Rufián', role: head('Barcelona'), bio: 'Diputado desde 2016 y portavoz de ERC en el Congreso desde 2019.', provisional: true },
  { party: 'junts', name: 'Míriam Nogueras', role: head('Barcelona'), bio: 'Portavoz de Junts en el Congreso desde 2019.', provisional: true },
  { party: 'bildu', name: 'Mertxe Aizpurua', role: head('Gipuzkoa'), bio: 'Portavoz de EH Bildu en el Congreso desde 2019.', provisional: true },
  { party: 'pnv', name: 'Aitor Esteban', role: head('Bizkaia'), bio: 'Presidente del PNV desde 2025. Fue portavoz en el Congreso entre 2012 y 2025.', provisional: true },
  { party: 'bng', name: 'Néstor Rego', role: head('A Coruña'), bio: 'Diputado del BNG en el Congreso desde 2019.', provisional: true },
  { party: 'cc', name: 'Cristina Valido', role: head('Santa Cruz de Tenerife'), provisional: true },
  { party: 'upn', name: 'Alberto Catalán', role: head('Navarra'), provisional: true },
];
