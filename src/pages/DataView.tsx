import { useState } from 'react';
import { dataset } from '../data';
import { SOURCE_TYPE_LABEL } from '../lib/constants';
import { valueLabel } from '../lib/labels';

/** Tabla auditable: pregunta × candidatura, con valor, fuente y fecha. */
export function DataView() {
  const [party, setParty] = useState(dataset.parties[0]?.id ?? '');
  const p = dataset.parties.find((x) => x.id === party);
  return (
    <main id="contenido" className="wrap prose">
      <h1>Datos utilizados</h1>
      <p>Las mismas cifras que usa el cálculo. Valores de −1 (muy en desacuerdo, o la opción A) a +1 (muy de acuerdo, o la opción B). «No disponible» significa que no hay fuente y la pregunta no se usa para esa candidatura.</p>
      <label className="small muted" htmlFor="dv-party">Candidatura</label><br />
      <select id="dv-party" className="select" value={party} onChange={(e) => setParty(e.target.value)}>
        {dataset.parties.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
      </select>
      {p && (
        <div className="table-wrap" style={{ marginTop: '1rem' }}>
          <table className="topic-table">
            <caption className="sr-only">Posiciones de {p.name}</caption>
            <thead><tr><th>Pregunta</th><th className="num">Valor</th><th>Posición</th><th>Fuente</th><th>Actualizado</th></tr></thead>
            <tbody>
              {dataset.questions.map((q) => {
                const pos = dataset.positions.find((x) => x.party === p.id && x.question === q.id);
                const src = pos?.sourceId ? dataset.sources.find((s) => s.id === pos.sourceId) : undefined;
                const v = pos?.value ?? null;
                return (
                  <tr key={q.id}>
                    <td><strong>{q.subtopic}</strong><br /><span className="muted small">{q.text}</span></td>
                    <td className="num">{v === null ? '—' : v.toLocaleString('es-ES')}</td>
                    <td>{valueLabel(q, v)}</td>
                    <td className="small">{src ? <>{SOURCE_TYPE_LABEL[src.type]}{src.url ? <>: <a href={src.url} target="_blank" rel="noopener noreferrer">{src.title}</a></> : `: ${src.title}`}{src.reference ? ` (${src.reference})` : ''}{pos?.note ? `. ${pos.note}` : ''}{pos?.estimated ? <span className="tag">estimada</span> : null}</> : <span className="muted">Sin fuente</span>}</td>
                    <td className="small">{pos ? new Date(pos.updatedAt).toLocaleDateString('es-ES') : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <h2>Pesos</h2>
      <p>Peso de cada pregunta y de cada área: {[...new Set(dataset.questions.map((q) => q.weight))].join(', ')} y {[...new Set(dataset.topics.map((t) => t.weight))].join(', ')}. Confianza por tipo de fuente: programa electoral 1; web o documento oficial 0,9; propuesta o intervención oficial 0,7; fuente secundaria 0,5; posición estimada, como máximo 0,6. Las preguntas que marcas como importantes en el test completo cuentan el doble.</p>
    </main>
  );
}
