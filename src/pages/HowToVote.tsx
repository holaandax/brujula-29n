import { ELECTION } from '../data/electoral';
import { PageHead } from '../components/Layout';
import { ProvisionalNotice } from './Calendar';
import { href } from '../lib/router';

const ev = (label: string) => ELECTION.calendar.find((e) => e.label.startsWith(label));
const long = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
/** «del 6 de octubre al 19 de noviembre» o «el 26 de noviembre». */
const when = (label: string) => { const e = ev(label); return !e ? '' : e.end ? `del ${long(e.date)} al ${long(e.end)}` : `el ${long(e.date)}`; };

const TOC = [
  ['quien', '¿Puedo votar?'], ['persona', 'En persona'], ['papeletas', 'Las papeletas'], ['blanco', 'Blanco y nulo'],
  ['correo', 'Por correo'], ['extranjero', 'Desde el extranjero'], ['mesa', 'Si te toca mesa'], ['enlaces', 'Webs oficiales'],
] as const;

const OFFICIAL = [
  { url: 'https://www.juntaelectoralcentral.es', name: 'Junta Electoral Central', what: 'Normativa, instrucciones y acuerdos sobre el proceso.' },
  { url: 'https://infoelectoral.interior.gob.es', name: 'Ministerio del Interior', what: 'Información al votante y resultados oficiales.' },
  { url: 'https://www.ine.es', name: 'Instituto Nacional de Estadística (censo)', what: 'Consulta del censo y de tu colegio electoral.' },
  { url: 'https://www.correos.es', name: 'Correos', what: 'Solicitud y entrega del voto por correo.' },
  { url: 'https://www.exteriores.gob.es', name: 'Ministerio de Asuntos Exteriores', what: 'Voto de residentes en el extranjero.' },
];

export function HowToVote() {
  return (
    <main id="contenido" className="wrap howto">
      <PageHead
        kicker="Cómo votar"
        title="Cómo votar el 29 de noviembre"
        dek="En persona, por correo o desde el extranjero: qué necesitas, qué plazos hay y cómo evitar que tu voto sea nulo."
      >
        <ul className="howto-toc" style={{ marginTop: '1.2rem' }}>
          {TOC.map(([id, label]) => <li key={id}><a href={`#/como-votar`} onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }}>{label}</a></li>)}
        </ul>
      </PageHead>
      <ProvisionalNotice />

      <div className="prose">
        <section id="quien">
          <h2>¿Puedo votar?</h2>
          <p>Sí, si tienes nacionalidad española, cumples 18 años como muy tarde el día de la votación y estás inscrito en el censo electoral. No hace falta ningún trámite previo para votar en persona.</p>
          <p>Puedes comprobar en el INE que tus datos del censo son correctos y reclamar si hay algún error <strong>{when('Consulta del censo')}</strong>.</p>
        </section>

        <section id="persona">
          <h2>Votar en persona</h2>
          <ol className="steps">
            <li><span><strong>Busca tu colegio y tu mesa.</strong> Vienen en la tarjeta censal que recibirás en casa. Si no te llega, puedes consultarlos en la web del INE. Puedes votar sin la tarjeta.</span></li>
            <li><span><strong>Lleva un documento original con foto:</strong> DNI, pasaporte o permiso de conducir. No valen fotocopias.</span></li>
            <li><span><strong>Coge las papeletas y los sobres.</strong> Están en el colegio, y también puedes llevar de casa las que te envíen los partidos. Mete la papeleta en el sobre en la cabina o donde prefieras.</span></li>
            <li><span><strong>En la mesa,</strong> di tu nombre y enseña el documento. Entregas los sobres al presidente o presidenta, que los mete en las urnas.</span></li>
          </ol>
          <p>Los colegios abren de <strong>9:00 a 20:00</strong>. Si trabajas ese día y tu horario coincide con el de votación, tienes derecho a un permiso retribuido de hasta cuatro horas.</p>
        </section>

        <section id="papeletas">
          <h2>Las dos papeletas</h2>
          <p>El mismo día se vota al Congreso y al Senado, cada uno con su papeleta y su urna.</p>
          <div className="ballots">
            <div className="ballot-ex congreso">
              <span className="sans">Congreso · papeleta blanca</span>
              <h3>Votas a una lista entera</h3>
              <p>Las listas son cerradas: eliges una candidatura y su orden de candidatos no se puede cambiar. Si tachas, añades o marcas nombres, el voto es nulo.</p>
            </div>
            <div className="ballot-ex senado">
              <span className="sans">Senado · papeleta sepia</span>
              <h3>Marcas personas con una cruz</h3>
              <p>Puedes elegir candidatos de partidos distintos: hasta 3 en las provincias peninsulares; hasta 2 en Gran Canaria, Mallorca, Tenerife, Ceuta y Melilla; 1 en el resto de islas.</p>
            </div>
          </div>
        </section>

        <section id="blanco">
          <h2>Voto en blanco y voto nulo</h2>
          <div className="vs">
            <div>
              <h3>En blanco</h3>
              <ul>
                <li>Congreso: el sobre vacío.</li>
                <li>Senado: la papeleta sin ninguna cruz.</li>
                <li>Es un voto válido: cuenta para calcular el 3% mínimo que necesita una candidatura en cada provincia para optar a escaño.</li>
              </ul>
            </div>
            <div>
              <h3>Nulo</h3>
              <ul>
                <li>Papeletas tachadas, escritas o modificadas.</li>
                <li>Papeletas de candidaturas distintas en el mismo sobre.</li>
                <li>En el Senado, más cruces de las permitidas.</li>
                <li>Papeletas sin sobre o en un sobre que no es el oficial.</li>
                <li>No cuenta para nada.</li>
              </ul>
            </div>
          </div>
          <p className="small muted">Dos papeletas iguales de la misma candidatura en un sobre cuentan como un solo voto válido.</p>
        </section>

        <section id="correo">
          <h2>Votar por correo</h2>
          <ol className="steps">
            <li><span><strong>Pídelo {when('Plazo para pedir el voto por correo')}.</strong> En cualquier oficina de Correos con tu DNI, o en su web con DNI electrónico o certificado digital. La solicitud es personal.</span></li>
            <li><span><strong>Recibe la documentación</strong> en casa, {when('Envío a casa')}: papeletas, sobres, tu certificado del censo e instrucciones. Te la entregan en mano.</span></li>
            <li><span><strong>Prepara el voto.</strong> Mete cada papeleta en su sobre y, junto con el certificado del censo, en el sobre dirigido a tu mesa.</span></li>
            <li><span><strong>Entrégalo en Correos</strong> como muy tarde {when('Último día para entregar')}. Tendrás que identificarte. No hace falta sello: el envío es gratuito.</span></li>
          </ol>
        </section>

        <section id="extranjero">
          <h2>Si vives en el extranjero</h2>
          <p>Si estás inscrito en el censo de residentes ausentes (CERA), recibes la documentación sin pedirla. Puedes enviar el voto por correo o depositarlo en el consulado o la embajada en los días que se fijen.</p>
          <p>Si estás fuera solo temporalmente y sigues en el censo de tu municipio, tienes que solicitar el voto en el consulado dentro de plazo.</p>
        </section>

        <section id="mesa">
          <h2>Si te toca estar en una mesa</h2>
          <p>Los miembros de las mesas se eligen por sorteo y se notifica en persona. Es obligatorio: solo te puedes excusar con un motivo justificado y dentro del plazo que figura en la notificación. Tienes derecho a una dieta y a permiso laboral retribuido ese día y a una reducción de jornada el día siguiente.</p>
        </section>

        <section id="enlaces">
          <h2>Webs oficiales</h2>
          <p>Esta guía resume el procedimiento general. Ante cualquier duda, manda lo que digan estos organismos.</p>
          <ul className="links">
            {OFFICIAL.map((o) => (
              <li key={o.url}><a href={o.url} target="_blank" rel="noopener noreferrer">{o.name}</a><span className="sans">{o.what}</span></li>
            ))}
          </ul>
          <p style={{ marginTop: '1.5rem' }}><a className="btn" href={href('calendario')}>Ver el calendario completo</a></p>
        </section>
      </div>
    </main>
  );
}
