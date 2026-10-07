export function Privacy() {
  return (
    <main id="contenido" className="wrap narrow prose">
      <h1>Privacidad</h1>
      <p>Este test se ha construido para que tus opiniones políticas no salgan de tu dispositivo.</p>
      <ul>
        <li><strong>No se almacenan tus respuestas.</strong> Están solo en la memoria de la pestaña. No se guardan en cookies, localStorage ni ningún otro almacenamiento, y desaparecen al cerrarla o recargarla.</li>
        <li><strong>El cálculo es local.</strong> Las preguntas, las posiciones y el algoritmo se descargan con la página; el resultado se calcula en tu navegador.</li>
        <li><strong>No se envían respuestas a ningún servidor.</strong> La aplicación no tiene base de datos ni API propia. La política de seguridad de la página bloquea las conexiones salientes desde el código.</li>
        <li><strong>No hay perfiles, cuentas ni analítica.</strong> No pedimos nombre, email ni teléfono, no usamos herramientas de analítica ni publicidad, y no vendemos datos.</li>
        <li><strong>Compartir es decisión tuya.</strong> Si pulsas WhatsApp o X, se abre esa aplicación con un resumen del resultado (no de tus respuestas). Lo que ocurra allí depende de su política de privacidad.</li>
      </ul>
      <h2>Lo que no podemos controlar</h2>
      <p>Como cualquier web, el proveedor de alojamiento (por ejemplo, Vercel o Netlify) recibe la petición técnica de descarga de la página, que incluye la dirección IP. Esa petición es idéntica para todo el mundo y no contiene ninguna respuesta del test. Las extensiones de tu navegador tampoco dependen de nosotros.</p>
    </main>
  );
}
