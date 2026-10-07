import { SCORING } from '../config';
import { dataset } from '../data';
import { href } from '../lib/router';

export function Methodology() {
  const n = dataset.questions.length;
  const econ = dataset.questions.filter((q) => q.axis?.econ).length;
  const soc = dataset.questions.filter((q) => q.axis?.social).length;
  return (
    <main id="contenido" className="wrap narrow prose">
      <h1>Cómo funciona el test</h1>
      <p>El test compara tus respuestas con las posiciones documentadas de cada candidatura. No interpreta tu ideología ni recomienda nada: mide parecido, pregunta a pregunta.</p>

      <h2>1. Las preguntas</h2>
      <p>Hay {n} preguntas repartidas en {dataset.topics.length} áreas: {dataset.topics.map((t) => t.name.toLowerCase()).join(', ')}. Se eligieron cuestiones en las que las candidaturas se diferencian, para que cada respuesta aporte información.</p>
      <p>Cada enunciado pasó una revisión de sesgo: sin adjetivos valorativos, sin nombrar partidos, sin presentar una opción como moralmente superior y, cuando una medida tiene un coste, el coste aparece en la propia pregunta. Las preguntas de elección (A o B) se usan solo cuando el dilema es la clave del tema.</p>

      <h2>2. Las posiciones de los partidos</h2>
      <p>Cada candidatura recibe una posición por pregunta en la misma escala que tus respuestas, de «muy en desacuerdo» a «muy de acuerdo». Se obtiene, por este orden de preferencia, del programa electoral oficial, de documentos programáticos, de la web oficial, de otros documentos oficiales y, solo si no hay nada más, de intervenciones o propuestas oficiales.</p>
      <p>Si no hay una fuente clara, la posición queda como <strong>no disponible</strong>. No disponible no es lo mismo que neutral: esa pregunta simplemente no se usa para esa candidatura.</p>

      <h2>3. Las fuentes</h2>
      <p>Cada posición enlaza con su documento, con fecha y referencia. Puedes revisarlas todas en <a href={href('fuentes')}>Fuentes</a> y en <a href={href('datos')}>Datos utilizados</a>.</p>

      <h2>4. Cómo se calcula el parecido</h2>
      <p>Para cada pregunta se mide la distancia entre tu respuesta y la posición de la candidatura. Si respondéis lo mismo, la coincidencia es del 100%; si estáis en extremos opuestos, del 0%; un paso de diferencia en la escala de cinco resta un 25%.</p>
      <div className="formula">coincidencia en una pregunta = 1 − |tu respuesta − su posición| ÷ 2</div>

      <h2>5. Los pesos</h2>
      <p>Cada pregunta puede tener un peso, cada área otro, y cada posición una confianza según el tipo de fuente (un programa electoral pesa más que una declaración). Ahora mismo todas las preguntas y áreas pesan lo mismo: no hay ninguna razón metodológica para que un tema cuente más que otro, y cualquier cambio quedaría documentado.</p>

      <h2>6. El resultado general</h2>
      <p>Es la media ponderada de la coincidencia en todas las preguntas que has respondido y en las que la candidatura tiene posición. Si te saltas una pregunta, no cuenta para nadie.</p>
      <div className="formula">afinidad = Σ (peso × coincidencia) ÷ Σ peso</div>
      <p>Si una candidatura solo tiene datos para parte de tus respuestas, se indica («calculada con 17 de 20 cuestiones»). Por debajo del {Math.round(SCORING.minCoverage * 100)}% de cobertura no entra en el ranking. Si las dos primeras están a menos de {String(SCORING.tieThreshold).replace('.', ',')} puntos, se muestra un empate técnico. Si la mejor coincidencia no llega al {SCORING.lowAffinity}%, el texto lo dice así en lugar de presentarla como «tu partido».</p>

      <h2>7. Cada área</h2>
      <p>La misma fórmula, usando solo las preguntas de esa área. Por eso puedes coincidir más con una candidatura en vivienda y con otra en inmigración.</p>
      <p>Las «respuestas que más han influido» son las que más separan a la primera candidatura de la media del resto, no las que respondiste de forma más extrema.</p>

      <h2>8. El mapa ideológico</h2>
      <p>Es una simplificación. El eje horizontal resume {econ} preguntas económicas (impuestos, gasto, mercado laboral, vivienda, servicios, emisiones); el vertical, {soc} preguntas sociales (igualdad, eutanasia, registro civil, inmigración, penas). Territorio, Europa, energía nuclear y defensa no entran en el mapa porque no encajan en esos dos ejes. Cada punto es la media de sus respuestas en cada eje, con el signo de cada pregunta fijado de antemano en los datos.</p>
      <p>El mapa ayuda a orientarse, pero el resultado que cuenta es el cálculo pregunta a pregunta.</p>

      <h2>Límites</h2>
      <p>El resultado representa la similitud entre tus respuestas y las posiciones políticas documentadas que utiliza este test. Las posiciones y programas pueden evolucionar y no todas las cuestiones políticas pueden resumirse en {n} preguntas. Tampoco mide la credibilidad de las propuestas, la trayectoria de cada formación ni el sistema de reparto de escaños por circunscripción.</p>
    </main>
  );
}
