import React, { useState, useEffect } from 'react';
import { MoleculeDrug } from '../data/qfdosData';
import { Chem2DDrawer } from './Chem2DDrawer';
import { computeDescriptors } from '../services/rdkitService';
import { ShieldCheck, AlertTriangle, CheckCircle, HelpCircle, Activity, Sparkles } from 'lucide-react';

interface AdmetCalculatorProps {
  initialDrug?: MoleculeDrug;
}

const PRESET_DRUGS: MoleculeDrug[] = [
  {
    name: 'Diazepam (Tema 05 - BZD)',
    smiles: 'CN1C(=O)CN=C(c2ccccc2)c3cc(Cl)ccc13',
    role: 'Modulador Alostérico GABA-A',
    mw: 284.74,
    logP: 2.82,
    hbd: 0,
    hba: 2,
    tpsa: 32.7,
    rotBonds: 1
  },
  {
    name: 'Captopril (Tema 08 - IECA)',
    smiles: 'C[C@H](CS)C(=O)N1CCC[C@H]1C(=O)O',
    role: 'Inhibidor ECA Peptidomimético',
    mw: 217.29,
    logP: 0.84,
    hbd: 2,
    hba: 3,
    tpsa: 57.6,
    rotBonds: 3
  },
  {
    name: 'Salbutamol (Tema 02 - β2)',
    smiles: 'CC(C)(C)NCC(O)c1ccc(O)c(CO)c1',
    role: 'Agonista β2 Broncodilatador',
    mw: 239.31,
    logP: 0.64,
    hbd: 3,
    hba: 4,
    tpsa: 72.7,
    rotBonds: 5
  },
  {
    name: 'Celecoxib (Tema 09 - Coxib)',
    smiles: 'Cc1ccc(cc1)c2cc(nn2c3ccc(cc3)S(=O)(=O)N)C(F)(F)F',
    role: 'Inhibidor Selectivo COX-2',
    mw: 381.37,
    logP: 3.99,
    hbd: 1,
    hba: 4,
    tpsa: 77.9,
    rotBonds: 3
  },
  {
    name: 'Sumatriptán (Tema 04 - 5-HT1B/1D)',
    smiles: 'CNS(=O)(=O)CC1=CC2=C(C=C1)NC=C2CCN(C)C',
    role: 'Agonista 5-HT Antimigrañoso',
    mw: 295.40,
    logP: 0.93,
    hbd: 2,
    hba: 4,
    tpsa: 68.3,
    rotBonds: 5
  },
  {
    name: 'Valaciclovir (Tema 10 - Profármaco)',
    smiles: 'CC(C)[C@@H](C(=O)OCCOCN1C=NC2=C1N=C(NC2=O)N)N',
    role: 'Profármaco Éster (PEPT1)',
    mw: 324.34,
    logP: -1.38,
    hbd: 3,
    hba: 7,
    tpsa: 128.8,
    rotBonds: 7
  }
];

export const AdmetCalculator: React.FC<AdmetCalculatorProps> = ({ initialDrug }) => {
  const [selectedDrug, setSelectedDrug] = useState<MoleculeDrug>(initialDrug || PRESET_DRUGS[0]);
  const [customMw, setCustomMw] = useState<number>(selectedDrug.mw || 284.7);
  const [customLogP, setCustomLogP] = useState<number>(selectedDrug.logP || 2.8);
  const [customHbd, setCustomHbd] = useState<number>(selectedDrug.hbd || 0);
  const [customHba, setCustomHba] = useState<number>(selectedDrug.hba || 2);
  const [customTpsa, setCustomTpsa] = useState<number>(selectedDrug.tpsa || 32.7);
  const [customRotB, setCustomRotB] = useState<number>(selectedDrug.rotBonds || 1);

  const handleSelectPreset = (drug: MoleculeDrug) => {
    setSelectedDrug(drug);
  };

  /**
   * Los descriptores salen de la estructura, no de una tabla escrita a mano:
   * así el panel nunca puede contradecir a la molécula que se está mostrando.
   * Si RDKit aún no ha cargado, se usan los valores tabulados como respaldo.
   */
  useEffect(() => {
    let cancelled = false;

    computeDescriptors(selectedDrug.smiles).then(d => {
      if (cancelled) return;
      if (d) {
        setCustomMw(Number(d.MolWt.toFixed(2)));
        setCustomLogP(Number(d.ALOGP.toFixed(2)));
        setCustomHbd(d.NumHBD);
        setCustomHba(d.NumHBA);
        setCustomTpsa(Number(d.TPSA.toFixed(1)));
        setCustomRotB(d.NumRotatableBonds);
      } else {
        setCustomMw(selectedDrug.mw ?? 250);
        setCustomLogP(selectedDrug.logP ?? 2.0);
        setCustomHbd(selectedDrug.hbd ?? 1);
        setCustomHba(selectedDrug.hba ?? 3);
        setCustomTpsa(selectedDrug.tpsa ?? 45);
        setCustomRotB(selectedDrug.rotBonds ?? 2);
      }
    });

    return () => { cancelled = true; };
  }, [selectedDrug]);

  // Rule of 5 and Veber Checks
  const violations = [
    customMw > 500 ? 'Peso Molecular > 500 Da (Lipinski)' : null,
    customLogP > 5 ? 'LogP > 5.0 (Lipinski)' : null,
    customHbd > 5 ? 'H-Bond Donors > 5 (Lipinski)' : null,
    customHba > 10 ? 'H-Bond Acceptors > 10 (Lipinski)' : null,
    customTpsa > 140 ? 'TPSA > 140 Å² (Veber)' : null,
    customRotB > 10 ? 'Enlaces Rotables > 10 (Veber)' : null
  ].filter(Boolean) as string[];

  const isRo5Compliant = violations.length === 0;

  // Radar Chart Normalized Coordinates (Values mapped between 0 and 100%)
  // Metrics: [MW (max 600), LogP (max 6), HBD (max 8), HBA (max 15), TPSA (max 180), RotB (max 15)]
  const radarAxes = [
    { label: 'MW', val: Math.min(100, (customMw / 600) * 100), limit: (500 / 600) * 100 },
    { label: 'LogP', val: Math.min(100, Math.max(0, ((customLogP + 2) / 8) * 100)), limit: ((5 + 2) / 8) * 100 },
    { label: 'HBD', val: Math.min(100, (customHbd / 8) * 100), limit: (5 / 8) * 100 },
    { label: 'HBA', val: Math.min(100, (customHba / 15) * 100), limit: (10 / 15) * 100 },
    { label: 'TPSA', val: Math.min(100, (customTpsa / 180) * 100), limit: (140 / 180) * 100 },
    { label: 'RotB', val: Math.min(100, (customRotB / 15) * 100), limit: (10 / 15) * 100 }
  ];

  const radarPoints = radarAxes.map((axis, i) => {
    const angle = (i * Math.PI * 2) / radarAxes.length - Math.PI / 2;
    const r = (axis.val / 100) * 85;
    const x = 110 + r * Math.cos(angle);
    const y = 110 + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const limitPoints = radarAxes.map((axis, i) => {
    const angle = (i * Math.PI * 2) / radarAxes.length - Math.PI / 2;
    const r = (axis.limit / 100) * 85;
    const x = 110 + r * Math.cos(angle);
    const y = 110 + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '1.75rem 1rem' }}>
      
      {/* Title Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, var(--teal) 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        color: '#ffffff',
        marginBottom: '1.75rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Activity size={24} color="var(--mint)" />
          <span className="qfdos-badge badge-mint" style={{ fontSize: '0.72rem' }}>
            Quimioinformática & ADMET
          </span>
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
          Calculadora ADMET & Reglas de Lipinski / Veber (Drug-Likeness)
        </h2>
        <p style={{ fontSize: '0.92rem', opacity: 0.95, maxWidth: '840px', lineHeight: 1.5 }}>
          Evalúa en tiempo real las propiedades físico-químicas, biodisponibilidad oral teórica y permeabilidad celular de los fármacos del curso según los criterios de Lipinski (Rule of 5) y Veber.
        </p>
      </div>

      {/* Preset Drug Selector */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '8px' }}>
          Selecciona un fármaco modelo de QFDOS o ajusta los parámetros manualmente:
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {PRESET_DRUGS.map((d, i) => (
            <button
              key={i}
              onClick={() => handleSelectPreset(d)}
              className="btn btn-sm"
              style={{
                background: selectedDrug.name === d.name ? 'var(--navy)' : 'var(--surface)',
                color: selectedDrug.name === d.name ? '#ffffff' : 'var(--text-main)',
                borderColor: selectedDrug.name === d.name ? 'var(--navy)' : 'var(--border-color)',
                fontSize: '0.78rem'
              }}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Sliders, Radar Chart & 2D Drawer */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        
        {/* Left: Sliders */}
        <div className="qfdos-card" style={{ gap: '1.15rem' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-title)', fontWeight: 700 }}>
            Propiedades Físico-Químicas
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* MW */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '3px' }}>
                <span>Peso Molecular (MW):</span>
                <span className="font-mono" style={{ color: customMw > 500 ? 'var(--accent-red)' : 'var(--navy)' }}>
                  {customMw.toFixed(1)} Da
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="750"
                step="5"
                value={customMw}
                onChange={e => setCustomMw(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: customMw > 500 ? 'var(--accent-red)' : 'var(--navy)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                <span>100 Da</span>
                <span>Límite Ro5: 500 Da</span>
                <span>750 Da</span>
              </div>
            </div>

            {/* LogP */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '3px' }}>
                <span>Coeficiente Lipofilia (LogP):</span>
                <span className="font-mono" style={{ color: customLogP > 5 ? 'var(--accent-red)' : 'var(--teal)' }}>
                  {customLogP.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="-2"
                max="7"
                step="0.1"
                value={customLogP}
                onChange={e => setCustomLogP(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: customLogP > 5 ? 'var(--accent-red)' : 'var(--teal)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                <span>-2.0 (Hidrofílico)</span>
                <span>Límite Ro5: 5.0</span>
                <span>7.0 (Lipofílico)</span>
              </div>
            </div>

            {/* HBD */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '3px' }}>
                <span>Dadores Enlace de H (HBD):</span>
                <span className="font-mono">{customHbd}</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="1"
                value={customHbd}
                onChange={e => setCustomHbd(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--navy)' }}
              />
            </div>

            {/* HBA */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '3px' }}>
                <span>Aceptores Enlace de H (HBA):</span>
                <span className="font-mono">{customHba}</span>
              </div>
              <input
                type="range"
                min="0"
                max="14"
                step="1"
                value={customHba}
                onChange={e => setCustomHba(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--teal)' }}
              />
            </div>

            {/* TPSA */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '3px' }}>
                <span>Área Superficial Polar (TPSA):</span>
                <span className="font-mono" style={{ color: customTpsa > 140 ? 'var(--accent-red)' : 'var(--navy)' }}>
                  {customTpsa.toFixed(1)} Å²
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={customTpsa}
                onChange={e => setCustomTpsa(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: customTpsa > 140 ? 'var(--accent-red)' : 'var(--navy)' }}
              />
            </div>

            {/* Rotatable Bonds */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '3px' }}>
                <span>Enlaces Rotables (Flexibilidad):</span>
                <span className="font-mono" style={{ color: customRotB > 10 ? 'var(--accent-red)' : 'var(--teal)' }}>
                  {customRotB}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={customRotB}
                onChange={e => setCustomRotB(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: customRotB > 10 ? 'var(--accent-red)' : 'var(--teal)' }}
              />
            </div>
          </div>
        </div>

        {/* Right: Radar Chart & Compliance Assessment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Compliance Status Card */}
          <div className="qfdos-card" style={{
            background: isRo5Compliant ? 'rgba(16, 185, 129, 0.06)' : 'rgba(239, 68, 68, 0.06)',
            borderColor: isRo5Compliant ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isRo5Compliant ? (
                <CheckCircle size={26} color="#059669" />
              ) : (
                <AlertTriangle size={26} color="#dc2626" />
              )}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: isRo5Compliant ? '#047857' : '#b91c1c' }}>
                  {isRo5Compliant ? 'Cumple Criterios de Lipinski & Veber' : 'Alerta: Violaciones de Drug-Likeness'}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {isRo5Compliant
                    ? 'Perfil óptimo de biodisponibilidad oral y absorción pasiva.'
                    : `Detectadas ${violations.length} infracciones a los límites de biodisponibilidad oral.`}
                </p>
              </div>
            </div>

            {!isRo5Compliant && (
              <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {violations.map((v, i) => (
                  <span key={i} className="qfdos-badge badge-amber" style={{ fontSize: '0.7rem' }}>
                    ⚠ {v}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Radar Chart Visualizer */}
          <div className="qfdos-card" style={{ padding: '1.25rem', alignItems: 'center' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-title)' }}>
                Espacio de Biodisponibilidad (Radar Físico-Químico)
              </span>
              <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--teal)' }}>
                  <span style={{ width: '8px', height: '8px', background: 'var(--teal)', display: 'inline-block', borderRadius: '2px' }}></span> Fármaco
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                  <span style={{ width: '8px', height: '8px', border: '1px dashed #94a3b8', display: 'inline-block', borderRadius: '2px' }}></span> Límite Ro5
                </span>
              </div>
            </div>

            {/* SVG Radar */}
            <svg width="220" height="220" viewBox="0 0 220 220">
              {/* Concentric Web Rings */}
              <circle cx="110" cy="110" r="28" fill="none" stroke="rgba(100,116,139,0.15)" />
              <circle cx="110" cy="110" r="56" fill="none" stroke="rgba(100,116,139,0.2)" />
              <circle cx="110" cy="110" r="85" fill="none" stroke="rgba(100,116,139,0.3)" />

              {/* Axis Spoke Lines */}
              {radarAxes.map((axis, i) => {
                const angle = (i * Math.PI * 2) / radarAxes.length - Math.PI / 2;
                const x2 = 110 + 85 * Math.cos(angle);
                const y2 = 110 + 85 * Math.sin(angle);
                const tx = 110 + 102 * Math.cos(angle);
                const ty = 110 + 102 * Math.sin(angle);
                return (
                  <g key={i}>
                    <line x1="110" y1="110" x2={x2} y2={y2} stroke="rgba(100,116,139,0.25)" />
                    <text
                      x={tx}
                      y={ty + 3}
                      fontSize="9"
                      fontWeight="700"
                      fontFamily="Roboto Mono"
                      fill="var(--text-muted)"
                      textAnchor="middle"
                    >
                      {axis.label}
                    </text>
                  </g>
                );
              })}

              {/* Lipinski Boundary Envelope */}
              <polygon
                points={limitPoints}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />

              {/* Drug Polygon */}
              <polygon
                points={radarPoints}
                fill="rgba(13, 148, 136, 0.25)"
                stroke="var(--teal)"
                strokeWidth="2.2"
              />
            </svg>
          </div>

          {/* 2D Structure Preview */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Chem2DDrawer smiles={selectedDrug.smiles} name={selectedDrug.name} width={280} height={130} />
          </div>

        </div>

      </div>

    </div>
  );
};
