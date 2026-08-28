import React from 'react';
import { AlertTriangle, Lightbulb } from 'lucide-react';

export interface DatoLimitante {
  nombre: string;
  masa: number;
  pm: number;
}

interface DesgloseRendimientoProps {
  limitante: DatoLimitante;
  producto: { nombre: string; pm: number };
  masaObtenida: number;
  /** mol de producto por mol de limitante (1 en las tres etapas del cuaderno) */
  ratio?: number;
  /** Texto que explica por qué ese reactivo es el limitante */
  porQueLimitante?: string;
  compacto?: boolean;
}

/**
 * Muestra el cálculo del rendimiento paso a paso con los datos reales de la
 * pareja. No es un adorno: en el examen se puntúa el planteamiento, así que el
 * alumno tiene que ver de dónde sale cada número, no sólo el porcentaje final.
 */
export const DesgloseRendimiento: React.FC<DesgloseRendimientoProps> = ({
  limitante,
  producto,
  masaObtenida,
  ratio = 1,
  porQueLimitante,
  compacto = false
}) => {
  const hayDatos = limitante.masa > 0 && limitante.pm > 0;
  const molLimitante = hayDatos ? limitante.masa / limitante.pm : 0;
  const molProducto = molLimitante * ratio;
  const masaTeorica = molProducto * producto.pm;
  const rendimiento = masaTeorica > 0 ? (masaObtenida / masaTeorica) * 100 : 0;

  if (!hayDatos) {
    return (
      <div className="calc-vacio">
        Introduce la masa de <strong>{limitante.nombre}</strong> que habéis pesado
        para que se calcule el rendimiento.
      </div>
    );
  }

  const num = (v: number, d = 4) =>
    v.toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d });

  const pasos = [
    {
      n: 1,
      titulo: `Moles de ${limitante.nombre}`,
      formula: 'n = m / PM',
      sustitucion: `n = ${num(limitante.masa, 3)} g ÷ ${num(limitante.pm, 2)} g/mol`,
      resultado: `${num(molLimitante)} mol  (${num(molLimitante * 1000, 2)} mmol)`,
      nota: 'Se parte siempre del reactivo limitante: es el que se agota primero y fija el máximo alcanzable.'
    },
    {
      n: 2,
      titulo: `Moles teóricos de ${producto.nombre}`,
      formula: ratio === 1 ? 'n(producto) = n(limitante)' : `n(producto) = n(limitante) × ${ratio}`,
      sustitucion: ratio === 1
        ? `n = ${num(molLimitante)} mol × 1`
        : `n = ${num(molLimitante)} mol × ${ratio}`,
      resultado: `${num(molProducto)} mol`,
      nota: ratio === 1
        ? 'La estequiometría es 1:1, así que cada mol de limitante puede dar como mucho un mol de producto.'
        : `La ecuación ajustada da ${ratio} mol de producto por cada mol de limitante.`
    },
    {
      n: 3,
      titulo: `Masa teórica de ${producto.nombre}`,
      formula: 'm(teórica) = n × PM',
      sustitucion: `m = ${num(molProducto)} mol × ${num(producto.pm, 2)} g/mol`,
      resultado: `${num(masaTeorica, 3)} g`,
      nota: 'Es lo que obtendríais si la reacción fuese perfecta y no se perdiera nada en las extracciones, filtraciones ni el rotavapor.'
    },
    {
      n: 4,
      titulo: 'Rendimiento',
      formula: 'η (%) = (m(real) / m(teórica)) × 100',
      sustitucion: `η = (${num(masaObtenida, 3)} g ÷ ${num(masaTeorica, 3)} g) × 100`,
      resultado: `${rendimiento.toLocaleString('es-ES', { maximumFractionDigits: 1 })} %`,
      nota: 'La diferencia respecto al 100 % es todo lo que se ha quedado por el camino: aguas madres, producto adherido al vidrio, reacción incompleta.'
    }
  ];

  const aviso =
    rendimiento > 100
      ? 'Un rendimiento mayor del 100 % es imposible. Lo más probable es que el producto siga húmedo o con disolvente, o que la tara del matraz esté mal anotada. Secad y volved a pesar.'
      : masaObtenida > 0 && rendimiento < 15
      ? 'Rendimiento muy bajo. Comprobad que la masa del limitante y el producto pesado se corresponden con esta etapa.'
      : null;

  return (
    <div className={`calc-desglose ${compacto ? 'is-compacto' : ''}`}>
      <div className="calc-cabecera">
        <span className="eyebrow">Cómo se obtiene este rendimiento</span>
        <span className="calc-resultado-grande">
          {rendimiento.toLocaleString('es-ES', { maximumFractionDigits: 1 })} %
        </span>
      </div>

      {porQueLimitante && (
        <p className="calc-limitante">
          <strong>Reactivo limitante: {limitante.nombre}.</strong> {porQueLimitante}
        </p>
      )}

      <ol className="calc-pasos">
        {pasos.map(p => (
          <li key={p.n}>
            <div className="calc-paso-titulo">{p.titulo}</div>
            <code className="calc-formula">{p.formula}</code>
            <code className="calc-sustitucion">{p.sustitucion}</code>
            <div className="calc-igual">
              = <strong>{p.resultado}</strong>
            </div>
            <p className="calc-nota">{p.nota}</p>
          </li>
        ))}
      </ol>

      {aviso && (
        <div className="calc-aviso">
          <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{aviso}</span>
        </div>
      )}

      <div className="calc-recordatorio">
        <Lightbulb size={15} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>
          En el examen se puntúa el planteamiento. Escribid siempre la fórmula, sustituid
          con unidades y comprobad que se cancelan: si el resultado no sale en gramos,
          hay un error antes del número.
        </span>
      </div>
    </div>
  );
};
