import React from 'react';
import { Chem2DDrawer } from '../Chem2DDrawer';
import { ArrowRight, Plus } from 'lucide-react';

export interface EspecieReaccion {
  nombre: string;
  smiles: string;
  /** Se muestra bajo el nombre: "PM 144,17" o "2 equiv" */
  detalle?: string;
  /** Destaca el producto de la etapa */
  esProducto?: boolean;
}

interface EncabezadoReaccionProps {
  /** Número y título de la etapa, p. ej. "Etapa 1" */
  etiqueta: string;
  titulo: string;
  reactivos: EspecieReaccion[];
  producto: EspecieReaccion;
  /** Condiciones sobre la flecha: "NaOH, Δ 1 h" */
  condiciones?: string;
  compacto?: boolean;
}

/**
 * Encabezado de una etapa del cuaderno con la ecuación química dibujada.
 *
 * Las estructuras las genera RDKit a partir del SMILES, de modo que lo que ve
 * el alumno en la cabecera es la misma molécula sobre la que calcula: no puede
 * haber discrepancia entre el dibujo y el peso molecular que usa.
 */
export const EncabezadoReaccion: React.FC<EncabezadoReaccionProps> = ({
  etiqueta,
  titulo,
  reactivos,
  producto,
  condiciones,
  compacto = false
}) => {
  const w = compacto ? 120 : 150;
  const h = compacto ? 84 : 104;

  const Especie: React.FC<{ e: EspecieReaccion }> = ({ e }) => (
    <figure className={`rxn-especie ${e.esProducto ? 'is-producto' : ''}`}>
      <Chem2DDrawer smiles={e.smiles} width={w} height={h} bare />
      <figcaption>
        <span className="rxn-nombre">{e.nombre}</span>
        {e.detalle && <span className="rxn-detalle">{e.detalle}</span>}
      </figcaption>
    </figure>
  );

  return (
    <header className="rxn-header">
      <div className="rxn-titulo">
        <span className="eyebrow">{etiqueta}</span>
        <h3>{titulo}</h3>
      </div>

      <div className="rxn-ecuacion" role="img" aria-label={
        `${reactivos.map(r => r.nombre).join(' más ')} da ${producto.nombre}`
      }>
        {reactivos.map((r, i) => (
          <React.Fragment key={r.nombre}>
            {i > 0 && (
              <span className="rxn-op" aria-hidden="true">
                <Plus size={15} />
              </span>
            )}
            <Especie e={r} />
          </React.Fragment>
        ))}

        <span className="rxn-flecha" aria-hidden="true">
          {condiciones && <span className="rxn-condiciones">{condiciones}</span>}
          <ArrowRight size={22} strokeWidth={1.8} />
        </span>

        <Especie e={{ ...producto, esProducto: true }} />
      </div>
    </header>
  );
};
