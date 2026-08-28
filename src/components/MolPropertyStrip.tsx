import React, { useEffect, useState } from 'react';
import { computeDescriptors, MolDescriptors } from '../services/rdkitService';

interface MolPropertyStripProps {
  smiles: string;
  /** Marca en verde/rojo el cumplimiento de las reglas de Lipinski */
  evaluateLipinski?: boolean;
}

/**
 * Tira de descriptores moleculares calculados por RDKit a partir del SMILES.
 * No hay valores precalculados en los datos del curso: todo sale de la estructura.
 */
export const MolPropertyStrip: React.FC<MolPropertyStripProps> = ({
  smiles,
  evaluateLipinski = true
}) => {
  const [desc, setDesc] = useState<MolDescriptors | null>(null);

  useEffect(() => {
    let cancelled = false;
    setDesc(null);
    computeDescriptors(smiles).then(d => { if (!cancelled) setDesc(d); });
    return () => { cancelled = true; };
  }, [smiles]);

  if (!desc) return null;

  const items: { label: string; value: string; pass?: boolean }[] = [
    {
      label: 'PM',
      value: `${desc.MolWt.toFixed(1)} Da`,
      pass: evaluateLipinski ? desc.MolWt <= 500 : undefined
    },
    {
      label: 'cLogP',
      value: desc.ALOGP.toFixed(2),
      pass: evaluateLipinski ? desc.ALOGP <= 5 : undefined
    },
    {
      label: 'HBD',
      value: String(desc.NumHBD),
      pass: evaluateLipinski ? desc.NumHBD <= 5 : undefined
    },
    {
      label: 'HBA',
      value: String(desc.NumHBA),
      pass: evaluateLipinski ? desc.NumHBA <= 10 : undefined
    },
    { label: 'TPSA', value: `${desc.TPSA.toFixed(0)} Å²` },
    { label: 'RotB', value: String(desc.NumRotatableBonds) }
  ];

  const violations = items.filter(i => i.pass === false).length;

  return (
    <div>
      <div className="mol-props">
        {items.map(i => (
          <span
            key={i.label}
            className={`mol-prop ${i.pass === true ? 'is-pass' : i.pass === false ? 'is-fail' : ''}`}
            title={i.pass === false ? `${i.label} incumple la regla de Lipinski` : undefined}
          >
            {i.label} <strong>{i.value}</strong>
          </span>
        ))}
      </div>

      {evaluateLipinski && (
        <div
          style={{
            textAlign: 'center',
            fontSize: '0.7rem',
            marginTop: 5,
            color: violations === 0 ? 'var(--accent-emerald)' : violations === 1 ? 'var(--accent-amber)' : 'var(--accent-red)',
            fontWeight: 600
          }}
        >
          {violations === 0
            ? 'Cumple las cuatro reglas de Lipinski'
            : `${violations} violación${violations === 1 ? '' : 'es'} de Lipinski`}
        </div>
      )}
    </div>
  );
};
