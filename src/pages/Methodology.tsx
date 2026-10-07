import { SCORING } from '../config';
import { dataset } from '../data';
import { PageHead } from '../components/Layout';
import { rich, t } from '../i18n';

export function Methodology() {
  const n = dataset.questions.length;
  const econ = dataset.questions.filter((q) => q.axis?.econ).length;
  const soc = dataset.questions.filter((q) => q.axis?.social).length;
  const rapido = dataset.questions.filter((q) => q.set === 'rapido').length;
  const areas = dataset.topics.map((x) => t(x.name).toLowerCase()).join(', ');
  return (
    <main id="contenido" className="wrap narrow prose">
      <PageHead kicker={t('Cómo funciona')} title={t('Cómo funciona el test')} />
      <p>{t('El test compara tus respuestas con las posiciones documentadas de cada candidatura. No interpreta tu ideología ni recomienda nada: mide parecido, pregunta a pregunta.')}</p>

      <h2>{t('1. Las preguntas')}</h2>
      <p>{t('El test rápido tiene {r} preguntas y el completo {n}, repartidas en {k} áreas: {areas}. Se eligieron cuestiones en las que las candidaturas se diferencian, para que cada respuesta aporte información.', { r: rapido, n, k: dataset.topics.length, areas })}</p>
      <p>{t('Cada enunciado pasó una revisión de sesgo: sin adjetivos valorativos, sin nombrar partidos, sin presentar una opción como moralmente superior y, cuando una medida tiene un coste, el coste aparece en la propia pregunta. Las preguntas de elección (A o B) se usan solo cuando el dilema es la clave del tema.')}</p>
      <p>{t('Las traducciones al catalán, al gallego y al euskera usan el mismo significado y la misma escala que el original en castellano.')}</p>

      <h2>{t('2. Las posiciones de los partidos')}</h2>
      <p>{t('Cada candidatura recibe una posición por pregunta en la misma escala que tus respuestas, de «muy en desacuerdo» a «muy de acuerdo». Se obtiene, por este orden de preferencia, del programa electoral oficial, de documentos programáticos, de la web oficial, de otros documentos oficiales y, solo si no hay nada más, de intervenciones o propuestas oficiales.')}</p>
      <p>{rich('Cuando ningún documento enuncia la posición y se deduce de otra fuente oficial (por ejemplo, una votación), se marca como **estimada**: aparece con esa etiqueta y su peso en el cálculo no puede superar 0,6.')}</p>
      <p>{rich('Si no hay una fuente clara, la posición queda como **no disponible**. No disponible no es lo mismo que neutral: esa pregunta simplemente no se usa para esa candidatura.')}</p>

      <h2>{t('3. Las fuentes')}</h2>
      <p>{rich('Cada posición enlaza con su documento, con fecha y referencia. Puedes revisarlas todas en [Fuentes](#/fuentes) y en [Datos utilizados](#/datos).')}</p>

      <h2>{t('4. Cómo se calcula el parecido')}</h2>
      <p>{t('Para cada pregunta se mide la distancia entre tu respuesta y la posición de la candidatura. Si respondéis lo mismo, la coincidencia es del 100%; si estáis en extremos opuestos, del 0%; un paso de diferencia en la escala de cinco resta un 25%.')}</p>
      <div className="formula">{t('coincidencia en una pregunta = 1 − |tu respuesta − su posición| ÷ 2')}</div>

      <h2>{t('5. Los pesos')}</h2>
      <p>{t('Cada pregunta puede tener un peso, cada área otro, y cada posición una confianza según el tipo de fuente (un programa electoral pesa más que una declaración). En el test completo puedes marcar las preguntas que te importan especialmente: esas cuentan el doble en tu resultado. Es la única forma de cambiar los pesos, y la decides tú. Por lo demás, todas las preguntas y áreas pesan lo mismo: no hay ninguna razón metodológica para que un tema cuente más que otro, y cualquier cambio quedaría documentado.')}</p>

      <h2>{t('6. El resultado general')}</h2>
      <p>{t('Es la media ponderada de la coincidencia en todas las preguntas que has respondido y en las que la candidatura tiene posición. Si te saltas una pregunta, no cuenta para nadie.')}</p>
      <div className="formula">{t('afinidad = Σ (peso × coincidencia) ÷ Σ peso')}</div>
      <p>{t('Si una candidatura solo tiene datos para parte de tus respuestas, se indica («calculada con 17 de 20 cuestiones»). Por debajo del {c}% de cobertura no entra en el ranking. Si las dos primeras están a menos de {tie} puntos, se muestra un empate técnico. Si la mejor coincidencia no llega al {low}%, el texto lo dice así en lugar de presentarla como «tu partido».', { c: Math.round(SCORING.minCoverage * 100), tie: String(SCORING.tieThreshold).replace('.', ','), low: SCORING.lowAffinity })}</p>

      <h2>{t('7. Cada área')}</h2>
      <p>{t('La misma fórmula, usando solo las preguntas de esa área. Por eso puedes coincidir más con una candidatura en vivienda y con otra en inmigración.')}</p>
      <p>{t('Las «respuestas que más han influido» son las que más separan a la primera candidatura de la media del resto, no las que respondiste de forma más extrema.')}</p>

      <h2>{t('8. El mapa ideológico')}</h2>
      <p>{t('Es una simplificación. El eje horizontal resume {e} preguntas económicas (impuestos, gasto, mercado laboral, vivienda, servicios, emisiones); el vertical, {s} preguntas sociales (igualdad, eutanasia, registro civil, inmigración, penas). Territorio, lengua, instituciones, Europa, energía y defensa no entran en el mapa porque no encajan en esos dos ejes. Cada punto es la media de sus respuestas en cada eje, con el signo de cada pregunta fijado de antemano en los datos.', { e: econ, s: soc })}</p>
      <p>{t('El mapa ayuda a orientarse, pero el resultado que cuenta es el cálculo pregunta a pregunta.')}</p>

      <h2>{t('Límites')}</h2>
      <p>{t('El resultado representa la similitud entre tus respuestas y las posiciones políticas documentadas que utiliza este test. Las posiciones y programas pueden evolucionar y no todas las cuestiones políticas pueden resumirse en {n} preguntas. Tampoco mide la credibilidad de las propuestas, la trayectoria de cada formación ni el sistema de reparto de escaños por circunscripción.', { n })}</p>
    </main>
  );
}
