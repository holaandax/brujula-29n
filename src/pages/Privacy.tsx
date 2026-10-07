import { PageHead } from '../components/Layout';
import { rich, t } from '../i18n';

const ITEMS = [
  '**No se almacenan tus respuestas.** Están solo en la memoria de la pestaña. No se guardan en cookies, localStorage ni ningún otro almacenamiento, y desaparecen al cerrarla o recargarla.',
  '**El cálculo es local.** Las preguntas, las posiciones y el algoritmo se descargan con la página; el resultado se calcula en tu navegador.',
  '**No se envían respuestas a ningún servidor.** La aplicación no tiene base de datos ni API propia. La política de seguridad de la página bloquea las conexiones salientes desde el código.',
  '**No hay perfiles, cuentas ni analítica.** No pedimos nombre, email ni teléfono y no vendemos datos.',
  '**Idioma.** Solo se guarda en tu navegador el idioma que eliges para la web. No está relacionado con tus respuestas.',
  '**Publicidad.** Si la web muestra anuncios de Google, se cargan solo con tu consentimiento y fuera del test. Google no recibe tus respuestas: el test y el resultado se calculan en tu navegador y no aparecen en la dirección que se envía. No se aceptan anuncios políticos.',
  '**Compartir es decisión tuya.** Si pulsas WhatsApp o X, se abre esa aplicación con un resumen del resultado (no de tus respuestas). Lo que ocurra allí depende de su política de privacidad.',
];

export function Privacy() {
  return (
    <main id="contenido" className="wrap narrow prose">
      <PageHead kicker={t('Privacidad')} title={t('Privacidad')} dek={t('Este test se ha construido para que tus respuestas no salgan de tu dispositivo.')} />
      <ul>{ITEMS.map((s) => <li key={s}>{rich(s)}</li>)}</ul>
      <h2>{t('Lo que no podemos controlar')}</h2>
      <p>{t('Como cualquier web, el proveedor de alojamiento (por ejemplo, Vercel o Netlify) recibe la petición técnica de descarga de la página, que incluye la dirección IP. Esa petición es idéntica para todo el mundo y no contiene ninguna respuesta del test. Las extensiones de tu navegador tampoco dependen de nosotros.')}</p>
    </main>
  );
}
