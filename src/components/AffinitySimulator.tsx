import React, { useState } from 'react';
import { Award, Zap, Activity, Info, RefreshCw, BarChart2 } from 'lucide-react';

export const AffinitySimulator: React.FC = () => {
  const [kd, setKd] = useState<number>(1.5); // in nM
  const [ki, setKi] = useState<number>(2.4); // in nM
  const [substrateConc, setSubstrateConc] = useState<number>(50); // in uM
  const [km, setKm] = useState<number>(25); // in uM
  const [temperature, setTemperature] = useState<number>(310.15); // 37°C in Kelvin
  const [heavyAtoms, setHeavyAtoms] = useState<number>(22); // For Ligand Efficiency

  // Gas constant R = 1.9872036 cal/(mol·K) = 0.0019872036 kcal/(mol·K)
  const R_KCAL = 0.0019872036;

  // Calculations
  // Delta G° = R · T · ln(Kd in Molar)
  const kdMolar = kd * 1e-9;
  const deltaG_kcal = (R_KCAL * temperature * Math.log(kdMolar));
  const deltaG_kj = deltaG_kcal * 4.184;

  // Cheng-Prusoff Equation: IC50 = Ki · (1 + [S]/Km)
  const ic50 = ki * (1 + (substrateConc / km));

  // Ligand Efficiency: LE = -ΔG° / Nheavy
  const ligandEfficiency = -deltaG_kcal / Math.max(1, heavyAtoms);

  // Generate data points for the Ligand-Receptor Saturation Binding Curve: Fractional Occupancy = [L] / ([L] + Kd)
  const saturationPoints: { conc: number; occupancy: number }[] = [];
  for (let c = 0.05; c <= 20; c += 0.25) {
    const occ = (c / (c + kd)) * 100;
    saturationPoints.push({ conc: c, occupancy: occ });
  }

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
          <Award size={24} color="var(--mint)" />
          <span className="qfdos-badge badge-mint" style={{ fontSize: '0.72rem' }}>
            Simulador Biofísico & Cinético
          </span>
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
          Simulador de Afinidad Estructural & Ecuación de Cheng-Prusoff
        </h2>
        <p style={{ fontSize: '0.92rem', opacity: 0.95, maxWidth: '840px', lineHeight: 1.5 }}>
          Calcula en tiempo real la constante de afinidad (Kd), constante de inhibición (Ki), valor experimental de IC50 mediante la ecuación de Cheng-Prusoff, energía libre de Gibbs de unión (ΔG°) y eficiencia de ligando (LE).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        
        {/* Left Column: Interactive Parameters */}
        <div className="qfdos-card" style={{ gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-title)', fontWeight: 700 }}>
              Parámetros de Interacción
            </h3>
            <button
              onClick={() => { setKd(1.5); setKi(2.4); setSubstrateConc(50); setKm(25); setHeavyAtoms(22); setTemperature(310.15); }}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.75rem', padding: '3px 8px' }}
            >
              <RefreshCw size={12} /> Reiniciar
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Kd Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>Constante de Disociación (Kd):</span>
                <span className="font-mono" style={{ color: 'var(--navy-ink)' }}>{kd.toFixed(2)} nM</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="20.0"
                step="0.1"
                value={kd}
                onChange={e => setKd(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--navy)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <span>0.1 nM (Alta Afinidad)</span>
                <span>20 nM</span>
              </div>
            </div>

            {/* Ki Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>Constante de Inhibición (Ki):</span>
                <span className="font-mono" style={{ color: 'var(--teal-ink)' }}>{ki.toFixed(2)} nM</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="20.0"
                step="0.1"
                value={ki}
                onChange={e => setKi(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--teal)' }}
              />
            </div>

            {/* Substrate Conc [S] */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>Concentración de Sustrato ([S]):</span>
                <span className="font-mono">{substrateConc} μM</span>
              </div>
              <input
                type="range"
                min="5"
                max="200"
                step="5"
                value={substrateConc}
                onChange={e => setSubstrateConc(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--navy)' }}
              />
            </div>

            {/* Michaelis Constant Km */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>Constante de Michaelis-Menten (Km):</span>
                <span className="font-mono">{km} μM</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={km}
                onChange={e => setKm(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--teal)' }}
              />
            </div>

            {/* Heavy Atoms count */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>Átomos Pesados no-H (Nheavy):</span>
                <span className="font-mono">{heavyAtoms}</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="1"
                value={heavyAtoms}
                onChange={e => setHeavyAtoms(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--navy)' }}
              />
            </div>

            {/* Temperature */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>Temperatura Fisiológica (T):</span>
                <span className="font-mono">{(temperature - 273.15).toFixed(1)} °C ({temperature.toFixed(1)} K)</span>
              </div>
              <input
                type="range"
                min="293.15"
                max="318.15"
                step="1"
                value={temperature}
                onChange={e => setTemperature(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--teal)' }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Biophysical Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Main Results Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            
            {/* IC50 Box */}
            <div className="qfdos-card card-teal" style={{ padding: '1.15rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Valor Experimental de IC50
              </span>
              <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--teal-ink)', margin: '4px 0' }}>
                {ic50.toFixed(2)} <span style={{ fontSize: '0.9rem' }}>nM</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                IC50 = Ki · (1 + [S]/Km)
              </span>
            </div>

            {/* Delta G Box */}
            <div className="qfdos-card card-navy" style={{ padding: '1.15rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Energía Libre de Gibbs (ΔG°)
              </span>
              <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--navy-ink)', margin: '4px 0' }}>
                {deltaG_kcal.toFixed(2)} <span style={{ fontSize: '0.9rem' }}>kcal/mol</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {deltaG_kj.toFixed(1)} kJ/mol (a 37°C)
              </span>
            </div>

            {/* Ligand Efficiency (LE) */}
            <div className="qfdos-card card-mint" style={{ padding: '1.15rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Eficiencia de Ligando (LE)
              </span>
              <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f766e', margin: '4px 0' }}>
                {ligandEfficiency.toFixed(2)} <span style={{ fontSize: '0.85rem' }}>kcal/(mol·átomo)</span>
              </div>
              <span className={`qfdos-badge ${ligandEfficiency >= 0.3 ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.68rem', width: 'fit-content' }}>
                {ligandEfficiency >= 0.3 ? '✓ Óptima (LE >= 0.3)' : '⚠ Mejorable (< 0.3)'}
              </span>
            </div>

            {/* Shift Ratio */}
            <div className="qfdos-card" style={{ padding: '1.15rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Desplazamiento IC50 / Ki
              </span>
              <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0' }}>
                {(ic50 / ki).toFixed(2)}x
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Factor de competición [S]/Km: {(substrateConc / km).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Interactive Fractional Occupancy Curve */}
          <div className="qfdos-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BarChart2 size={16} color="var(--teal-ink)" />
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-title)', fontWeight: 700 }}>
                  Curva de Saturación Ligando-Receptor: Ocupación (%) vs. [L]
                </h4>
              </div>
              <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--teal-ink)' }}>
                50% Ocupación = {kd.toFixed(2)} nM
              </span>
            </div>

            {/* SVG Interactive Chart */}
            <div style={{ width: '100%', height: '140px', background: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', padding: '10px', position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 400 120" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                {/* Horizontal grid lines */}
                <line x1="0" y1="10" x2="400" y2="10" stroke="rgba(100,116,139,0.2)" strokeDasharray="3" />
                <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(100,116,139,0.3)" strokeDasharray="3" />
                <line x1="0" y1="110" x2="400" y2="110" stroke="rgba(100,116,139,0.4)" />

                {/* 50% marker line */}
                <text x="5" y="58" fill="var(--text-muted)" fontSize="9" fontFamily="Roboto Mono">50% Ocupación</text>
                <text x="5" y="15" fill="var(--text-muted)" fontSize="9" fontFamily="Roboto Mono">100%</text>

                {/* Binding Curve */}
                <path
                  d={saturationPoints.reduce((acc, pt, idx) => {
                    const x = (pt.conc / 20) * 400;
                    const y = 110 - (pt.occupancy / 100) * 100;
                    return `${acc} ${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }, '')}
                  fill="none"
                  stroke="var(--teal)"
                  strokeWidth="2.5"
                />

                {/* Operating Kd Point */}
                {(() => {
                  const x = (kd / 20) * 400;
                  const y = 60; // 50% occupancy is exactly y=60
                  return (
                    <g>
                      <circle cx={x} cy={y} r="5" fill="var(--navy)" stroke="#fff" strokeWidth="1.5" />
                      <line x1={x} y1={y} x2={x} y2="110" stroke="var(--navy)" strokeDasharray="2" />
                    </g>
                  );
                })()}
              </svg>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>[L] = 0 nM</span>
              <span>[L] = 10 nM</span>
              <span>[L] = 20 nM</span>
            </div>
          </div>

        </div>

      </div>

      {/* Pedagogical Takeaways */}
      <div className="qfdos-card" style={{ marginTop: '1.5rem', background: 'var(--surface-alt)', borderLeft: '4px solid var(--navy)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Zap size={18} color="var(--navy-ink)" />
          <h4 style={{ fontSize: '0.92rem', color: 'var(--text-title)', fontWeight: 700 }}>
            Fundamento Farmacológico para Examen de QFDOS
          </h4>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
          • <strong>Distinción Crítica:</strong> La constante <code>Ki</code> y la energía libre <code>ΔG°</code> son propiedades termodinámicas intrínsecas de la afinidad fármaco-diana. Por el contrario, el valor <code>IC50</code> varía según la concentración de sustrato <code>[S]</code> utilizada en el laboratorio.  
          • <strong>Regla de Afinidad:</strong> Un valor de <code>Kd</code> más pequeño (orden sub-nanomolar) genera un <code>ΔG°</code> más negativo, indicando mayor espontaneidad de unión.
        </p>
      </div>

    </div>
  );
};
