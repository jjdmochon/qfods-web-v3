import React, { useState } from 'react';
import { LAB_SOLUTION_EXERCISES, SolutionExercise } from '../../data/practicasData';
import {
  Beaker, Sparkles, AlertTriangle, CheckCircle2, HelpCircle,
  RefreshCw, ArrowRight, BookOpen, Droplets, Info
} from 'lucide-react';

export const PracticasSolutionsCalculator: React.FC = () => {
  // Mode selector: 'solid' | 'liquid' | 'dilution' | 'trainer'
  const [calcMode, setCalcMode] = useState<'solid' | 'liquid' | 'dilution' | 'trainer'>('solid');

  // Solid state
  const [solidName, setSolidName] = useState<string>('Hidróxido de sodio (NaOH)');
  const [solidMw, setSolidMw] = useState<number>(40.00);
  const [solidPurity, setSolidPurity] = useState<number>(98.0);
  const [solidTargetVolMl, setSolidTargetVolMl] = useState<number>(50);
  const [solidTargetM, setSolidTargetM] = useState<number>(5.0);

  // Liquid concentrated state
  const [liquidName, setLiquidName] = useState<string>('Ácido Clorhídrico (HCl 37%)');
  const [liquidMw, setLiquidMw] = useState<number>(36.46);
  const [liquidDensity, setLiquidDensity] = useState<number>(1.19);
  const [liquidPurity, setLiquidPurity] = useState<number>(37.0);
  const [liquidTargetVolMl, setLiquidTargetVolMl] = useState<number>(100);
  const [liquidTargetM, setLiquidTargetM] = useState<number>(2.0);

  // Simple dilution state (V1*M1 = V2*M2)
  const [dM1, setDM1] = useState<number>(12.0);
  const [dM2, setDM2] = useState<number>(2.0);
  const [dVol2, setDVol2] = useState<number>(250);

  // Trainer state
  const [trainerIdx, setTrainerIdx] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string; fullSteps?: string } | null>(null);

  // Solid calculation
  const solidMoles = solidTargetM * (solidTargetVolMl / 1000);
  const solidPureMass = solidMoles * solidMw;
  const solidWeighedMass = solidPureMass / (solidPurity / 100);

  // Liquid calculation
  const liquidCommercialMolarity = (10 * liquidPurity * liquidDensity) / liquidMw;
  const liquidTargetMoles = liquidTargetM * (liquidTargetVolMl / 1000);
  const liquidNeededVolMl = (liquidTargetMoles / liquidCommercialMolarity) * 1000;

  // Dilution calculation
  const dilutionV1NeededMl = dM1 > 0 ? (dM2 * dVol2) / dM1 : 0;

  // Pre-configured liquid presets
  const handleLiquidPreset = (presetType: 'hcl' | 'nh3' | 'h2so4' | 'hno3') => {
    if (presetType === 'hcl') {
      setLiquidName('Ácido Clorhídrico (HCl 37%)');
      setLiquidMw(36.46);
      setLiquidDensity(1.19);
      setLiquidPurity(37.0);
      setLiquidTargetVolMl(100);
      setLiquidTargetM(2.0);
    } else if (presetType === 'nh3') {
      setLiquidName('Amoníaco acuoso (NH₃ 35%)');
      setLiquidMw(17.03);
      setLiquidDensity(0.89);
      setLiquidPurity(35.0);
      setLiquidTargetVolMl(50);
      setLiquidTargetM(4.0);
    } else if (presetType === 'h2so4') {
      setLiquidName('Ácido Sulfúrico (H₂SO₄ 96%)');
      setLiquidMw(98.08);
      setLiquidDensity(1.84);
      setLiquidPurity(96.0);
      setLiquidTargetVolMl(100);
      setLiquidTargetM(1.0);
    } else if (presetType === 'hno3') {
      setLiquidName('Ácido Nítrico (HNO₃ 65%)');
      setLiquidMw(63.01);
      setLiquidDensity(1.40);
      setLiquidPurity(65.0);
      setLiquidTargetVolMl(100);
      setLiquidTargetM(1.0);
    }
  };

  const handleSolidPreset = (presetType: 'naoh' | 'k2co3' | 'nahco3' | 'nacl') => {
    if (presetType === 'naoh') {
      setSolidName('Hidróxido de sodio (NaOH)');
      setSolidMw(40.00);
      setSolidPurity(98.0);
      setSolidTargetVolMl(50);
      setSolidTargetM(5.0);
    } else if (presetType === 'k2co3') {
      setSolidName('Carbonato de potasio (K₂CO₃)');
      setSolidMw(138.21);
      setSolidPurity(99.0);
      setSolidTargetVolMl(100);
      setSolidTargetM(1.0);
    } else if (presetType === 'nahco3') {
      setSolidName('Bicarbonato de sodio (NaHCO₃)');
      setSolidMw(84.01);
      setSolidPurity(99.5);
      setSolidTargetVolMl(100);
      setSolidTargetM(0.5);
    } else if (presetType === 'nacl') {
      setSolidName('Cloruro de sodio (NaCl - Salmuera saturada)');
      setSolidMw(58.44);
      setSolidPurity(99.5);
      setSolidTargetVolMl(100);
      setSolidTargetM(5.0);
    }
  };

  const currentExercise: SolutionExercise = LAB_SOLUTION_EXERCISES[trainerIdx % LAB_SOLUTION_EXERCISES.length];

  const handleCheckAnswer = () => {
    const val = parseFloat(userAnswer.replace(',', '.'));
    if (isNaN(val)) {
      setFeedback({ isCorrect: false, message: 'Por favor, introduce un número válido.' });
      return;
    }
    const diff = Math.abs(val - currentExercise.correctAnswerValue);
    const isClose = diff <= 0.2;

    if (isClose) {
      setFeedback({
        isCorrect: true,
        message: `¡Correcto! El valor exacto es ${currentExercise.correctAnswerValue} ${currentExercise.unit}.`,
        fullSteps: currentExercise.stepByStepSolution.join('\n')
      });
    } else {
      setFeedback({
        isCorrect: false,
        message: `Incorrecto. Has introducido ${val}, pero se esperaba ${currentExercise.correctAnswerValue} ${currentExercise.unit}.`,
        fullSteps: currentExercise.stepByStepSolution.join('\n')
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header */}
      <div className="qfdos-card" style={{ padding: '1.5rem', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <span className="qfdos-badge badge-navy" style={{ marginBottom: '0.4rem' }}>
              <Droplets size={12} /> CÁLCULOS DE DISOLUCIONES Y DILUCIONES
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-title)', margin: '0.2rem 0' }}>
              Calculadora y Entrenador de Preparación de Disoluciones
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
              Aprende a preparar disoluciones a partir de sólidos pesados, ácidos comerciales concentrados y diluciones en cascada.
            </p>
          </div>

          {/* Mode Switcher */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCalcMode('solid')}
              className={`btn btn-sm ${calcMode === 'solid' ? 'btn-navy' : 'btn-outline'}`}
              style={{ fontWeight: calcMode === 'solid' ? 700 : 500, fontSize: '0.78rem' }}
            >
              1. A partir de Sólido (g)
            </button>
            <button
              onClick={() => setCalcMode('liquid')}
              className={`btn btn-sm ${calcMode === 'liquid' ? 'btn-navy' : 'btn-outline'}`}
              style={{ fontWeight: calcMode === 'liquid' ? 700 : 500, fontSize: '0.78rem' }}
            >
              2. Líquido Concentrado (mL)
            </button>
            <button
              onClick={() => setCalcMode('dilution')}
              className={`btn btn-sm ${calcMode === 'dilution' ? 'btn-navy' : 'btn-outline'}`}
              style={{ fontWeight: calcMode === 'dilution' ? 700 : 500, fontSize: '0.78rem' }}
            >
              3. Dilución V₁M₁ = V₂M₂
            </button>
            <button
              onClick={() => {
                setCalcMode('trainer');
                setFeedback(null);
                setUserAnswer('');
              }}
              className={`btn btn-sm ${calcMode === 'trainer' ? 'btn-teal' : 'btn-outline'}`}
              style={{ fontWeight: calcMode === 'trainer' ? 700 : 500, fontSize: '0.78rem' }}
            >
              ★ Entrenador de Examen ({LAB_SOLUTION_EXERCISES.length} Problemas)
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: SOLID REAGENTS */}
      {calcMode === 'solid' && (
        <div className="grid-2-cols" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '1.5rem' }}>
          
          <div className="qfdos-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: 'var(--text-title)' }}>
                Preparación de Disolución a partir de Sólido
              </h4>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button onClick={() => handleSolidPreset('naoh')} className="btn btn-xs btn-ghost">NaOH</button>
                <button onClick={() => handleSolidPreset('k2co3')} className="btn btn-xs btn-ghost">K₂CO₃</button>
                <button onClick={() => handleSolidPreset('nahco3')} className="btn btn-xs btn-ghost">NaHCO₃</button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                  Nombre del Reactivo Sólido:
                </label>
                <input
                  type="text"
                  value={solidName}
                  onChange={e => setSolidName(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                    Peso Molecular (PM, g/mol):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={solidMw}
                    onChange={e => setSolidMw(parseFloat(e.target.value) || 1)}
                    className="form-input"
                    style={{ width: '100%', fontSize: '0.85rem', fontFamily: 'Roboto Mono, monospace' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                    Pureza Comercial (%):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={solidPurity}
                    onChange={e => setSolidPurity(parseFloat(e.target.value) || 100)}
                    className="form-input"
                    style={{ width: '100%', fontSize: '0.85rem', fontFamily: 'Roboto Mono, monospace' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                    Volumen Deseado (mL):
                  </label>
                  <input
                    type="number"
                    step="5"
                    value={solidTargetVolMl}
                    onChange={e => setSolidTargetVolMl(parseFloat(e.target.value) || 0)}
                    className="form-input"
                    style={{ width: '100%', fontSize: '0.85rem', fontFamily: 'Roboto Mono, monospace' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                    Concentración Deseada (M o N):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={solidTargetM}
                    onChange={e => setSolidTargetM(parseFloat(e.target.value) || 0)}
                    className="form-input"
                    style={{ width: '100%', fontSize: '0.85rem', fontFamily: 'Roboto Mono, monospace' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Solid Result Box */}
          <div className="qfdos-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(30,58,138,0.04) 0%, rgba(13,148,136,0.04) 100%)', borderTop: '4px solid var(--navy)' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontWeight: 800, fontSize: '1rem', color: 'var(--text-title)' }}>
              Resultado y Procedimiento de Laboratorio
            </h4>

            <div style={{
              background: '#fff',
              borderRadius: '10px',
              padding: '1.25rem',
              border: '1px solid var(--border-color)',
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>MASA A PESAR EN BALANZA</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--navy)', fontFamily: 'Montserrat, sans-serif' }}>
                {solidWeighedMass.toFixed(3)} g
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--teal)', fontWeight: 700 }}>
                de {solidName} ({solidPurity}% pureza)
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div><strong>Fórmula aplicada:</strong></div>
              <div style={{ padding: '8px 12px', background: 'var(--surface-muted)', borderRadius: '6px', fontFamily: 'Roboto Mono, monospace', fontSize: '0.76rem' }}>
                m_pesada = (M × V_L × PM) / (Pureza / 100)
                <br />
                m_pesada = ({solidTargetM} M × {(solidTargetVolMl / 1000).toFixed(3)} L × {solidMw} g/mol) / {(solidPurity / 100).toFixed(2)} = <strong>{solidWeighedMass.toFixed(3)} g</strong>
              </div>
              <div style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                • <strong>Procedimiento:</strong> Pesar {solidWeighedMass.toFixed(3)} g en un vaso de precipitados, disolver en aprox. {Math.round(solidTargetVolMl * 0.7)} mL de agua desionizada (reacción exotérmica si es NaOH), dejar enfriar a Tª ambiente y enrasar en matraz aforado de {solidTargetVolMl} mL.
              </div>
            </div>
          </div>

        </div>
      )}

      {/* MODE 2: LIQUID CONCENTRATED REAGENTS */}
      {calcMode === 'liquid' && (
        <div className="grid-2-cols" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '1.5rem' }}>
          
          <div className="qfdos-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: 'var(--text-title)' }}>
                Disolución a partir de Botella Líquida Concentrada
              </h4>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button onClick={() => handleLiquidPreset('hcl')} className="btn btn-xs btn-ghost">HCl 37%</button>
                <button onClick={() => handleLiquidPreset('nh3')} className="btn btn-xs btn-ghost">NH₃ 35%</button>
                <button onClick={() => handleLiquidPreset('h2so4')} className="btn btn-xs btn-ghost">H₂SO₄</button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                  Nombre del Reactivo Líquido:
                </label>
                <input
                  type="text"
                  value={liquidName}
                  onChange={e => setLiquidName(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                    PM (g/mol):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={liquidMw}
                    onChange={e => setLiquidMw(parseFloat(e.target.value) || 1)}
                    className="form-input"
                    style={{ width: '100%', fontSize: '0.85rem', fontFamily: 'Roboto Mono, monospace' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                    Densidad (g/mL):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={liquidDensity}
                    onChange={e => setLiquidDensity(parseFloat(e.target.value) || 1)}
                    className="form-input"
                    style={{ width: '100%', fontSize: '0.85rem', fontFamily: 'Roboto Mono, monospace' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                    Pureza (% m/m):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={liquidPurity}
                    onChange={e => setLiquidPurity(parseFloat(e.target.value) || 100)}
                    className="form-input"
                    style={{ width: '100%', fontSize: '0.85rem', fontFamily: 'Roboto Mono, monospace' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                    Volumen Final Deseado (mL):
                  </label>
                  <input
                    type="number"
                    step="10"
                    value={liquidTargetVolMl}
                    onChange={e => setLiquidTargetVolMl(parseFloat(e.target.value) || 0)}
                    className="form-input"
                    style={{ width: '100%', fontSize: '0.85rem', fontFamily: 'Roboto Mono, monospace' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                    Concentración Deseada (M):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={liquidTargetM}
                    onChange={e => setLiquidTargetM(parseFloat(e.target.value) || 0)}
                    className="form-input"
                    style={{ width: '100%', fontSize: '0.85rem', fontFamily: 'Roboto Mono, monospace' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Liquid Result Box */}
          <div className="qfdos-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(13,148,136,0.04) 0%, rgba(45,212,191,0.04) 100%)', borderTop: '4px solid var(--teal)' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontWeight: 800, fontSize: '1rem', color: 'var(--text-title)' }}>
              Molaridad Comercial y Volumen a Medir
            </h4>

            <div style={{
              background: '#fff',
              borderRadius: '10px',
              padding: '1.25rem',
              border: '1px solid var(--border-color)',
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>VOLUMEN DE ÁCIDO/BASE A PIPETEAR</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--teal)', fontFamily: 'Montserrat, sans-serif' }}>
                {liquidNeededVolMl.toFixed(2)} mL
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--navy)', fontWeight: 700 }}>
                (Molaridad de la botella = {liquidCommercialMolarity.toFixed(2)} M)
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div><strong>Deducción paso a paso:</strong></div>
              <div style={{ padding: '8px 12px', background: 'var(--surface-muted)', borderRadius: '6px', fontFamily: 'Roboto Mono, monospace', fontSize: '0.74rem', lineHeight: 1.6 }}>
                1. M_comercial = (10 × {liquidPurity}% × {liquidDensity} g/mL) / {liquidMw} g/mol = <strong>{liquidCommercialMolarity.toFixed(2)} M</strong>
                <br />
                2. V₁ = (M₂ × V₂) / M₁ = ({liquidTargetM} M × {liquidTargetVolMl} mL) / {liquidCommercialMolarity.toFixed(2)} M = <strong>{liquidNeededVolMl.toFixed(2)} mL</strong>
              </div>
              
              <div style={{ marginTop: '0.5rem', padding: '8px 12px', background: '#fee2e2', borderRadius: '6px', borderLeft: '3px solid #ef4444', fontSize: '0.78rem', color: '#b91c1c' }}>
                ⚠ <strong>REGLA DE SEGURIDAD CRÍTICA:</strong> ¡Añadir SIEMPRE el ácido concentrado sobre agua en campana de extracción, NUNCA agua sobre ácido!
              </div>
            </div>
          </div>

        </div>
      )}

      {/* MODE 3: SIMPLE DILUTION */}
      {calcMode === 'dilution' && (
        <div className="grid-2-cols" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '1.5rem' }}>
          
          <div className="qfdos-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontWeight: 800, fontSize: '1rem', color: 'var(--text-title)' }}>
              Dilución Simple de Disoluciones (V₁ · M₁ = V₂ · M₂)
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                  Concentración de la Disolución Madre (M₁):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={dM1}
                  onChange={e => setDM1(parseFloat(e.target.value) || 0)}
                  className="form-input"
                  style={{ width: '100%', fontSize: '0.9rem', fontFamily: 'Roboto Mono, monospace' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                  Concentración Final Deseada (M₂):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={dM2}
                  onChange={e => setDM2(parseFloat(e.target.value) || 0)}
                  className="form-input"
                  style={{ width: '100%', fontSize: '0.9rem', fontFamily: 'Roboto Mono, monospace' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                  Volumen Final Deseado (V₂, mL):
                </label>
                <input
                  type="number"
                  step="25"
                  value={dVol2}
                  onChange={e => setDVol2(parseFloat(e.target.value) || 0)}
                  className="form-input"
                  style={{ width: '100%', fontSize: '0.9rem', fontFamily: 'Roboto Mono, monospace' }}
                />
              </div>
            </div>
          </div>

          <div className="qfdos-card" style={{ padding: '1.5rem', background: 'var(--surface-muted)' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontWeight: 800, fontSize: '1rem', color: 'var(--text-title)' }}>
              Volumen Alícuota a Tomar
            </h4>

            <div style={{
              background: '#fff',
              borderRadius: '10px',
              padding: '1.25rem',
              border: '1px solid var(--border-color)',
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>VOLUMEN DE ALÍCUOTA MADRE (V₁)</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--navy)', fontFamily: 'Montserrat, sans-serif' }}>
                {dilutionV1NeededMl.toFixed(2)} mL
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--teal)', fontWeight: 700 }}>
                Completar con agua desionizada hasta {dVol2} mL
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
              <strong>Factor de Dilución:</strong> 1 en {(dM1 / (dM2 || 1)).toFixed(2)} (dilución {(dM1 / (dM2 || 1)).toFixed(1)}×).
              <br />
              Tomar {dilutionV1NeededMl.toFixed(2)} mL de la disolución madre con pipeta aforada o graduada, verter en matraz aforado de {dVol2} mL con algo de agua previa, y enrasar con pipeta Pasteur.
            </div>
          </div>

        </div>
      )}

      {/* MODE 4: TRAINER / EXAM PROBLEMS */}
      {calcMode === 'trainer' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Exercise card */}
          <div className="qfdos-card" style={{ padding: '1.5rem', borderLeft: '5px solid var(--teal)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span className="qfdos-badge badge-teal" style={{ marginBottom: '4px' }}>
                  PROBLEMA {currentExercise.id.toUpperCase()} ({trainerIdx + 1} de {LAB_SOLUTION_EXERCISES.length})
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)', margin: '0.2rem 0' }}>
                  {currentExercise.title}
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => {
                    setTrainerIdx((prev) => (prev > 0 ? prev - 1 : LAB_SOLUTION_EXERCISES.length - 1));
                    setFeedback(null);
                    setUserAnswer('');
                  }}
                  className="btn btn-sm btn-outline"
                >
                  Anterior
                </button>
                <button
                  onClick={() => {
                    setTrainerIdx((prev) => (prev + 1) % LAB_SOLUTION_EXERCISES.length);
                    setFeedback(null);
                    setUserAnswer('');
                  }}
                  className="btn btn-sm btn-outline"
                >
                  Siguiente Problema
                </button>
              </div>
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.6, background: 'var(--surface-muted)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              Se desea preparar <strong>{currentExercise.targetVolumeMl} mL</strong> de una disolución de <strong>{currentExercise.targetSubstance}</strong> a concentración <strong>{currentExercise.targetConcentration}</strong>. 
              {currentExercise.sourceData.soluteMw && ` (PM = ${currentExercise.sourceData.soluteMw} g/mol)`}
              {currentExercise.sourceData.purityPercent && `, pureza = ${currentExercise.sourceData.purityPercent}%`}
              {currentExercise.sourceData.density && `, densidad = ${currentExercise.sourceData.density} g/mL`}
              {currentExercise.sourceData.initialConcentration && `, disolución madre = ${currentExercise.sourceData.initialConcentration}`}.
              <br />
              <strong>Pregunta:</strong> Calcula la cantidad necesaria que debe medirse en el laboratorio ({currentExercise.unit}).
            </p>

            {/* Answer Input Area */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-title)' }}>
                  Tu Respuesta:
                </label>
                <input
                  type="text"
                  placeholder={`Ej: ${currentExercise.correctAnswerValue}`}
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  className="form-input"
                  style={{ width: '130px', fontSize: '1rem', fontWeight: 700, padding: '6px 10px', fontFamily: 'Roboto Mono, monospace' }}
                  onKeyDown={e => { if (e.key === 'Enter') handleCheckAnswer(); }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {currentExercise.unit}
                </span>
              </div>

              <button
                onClick={handleCheckAnswer}
                className="btn btn-teal"
                style={{ fontWeight: 700, padding: '7px 16px' }}
              >
                Comprobar Respuesta
              </button>
            </div>

            {/* Feedback Alert & Step Breakdown */}
            {feedback && (
              <div style={{
                marginTop: '1.25rem',
                padding: '1rem',
                borderRadius: '8px',
                background: feedback.isCorrect ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${feedback.isCorrect ? '#10b981' : '#ef4444'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: feedback.isCorrect ? '#059669' : '#dc2626', fontSize: '0.92rem' }}>
                  {feedback.isCorrect ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                  {feedback.message}
                </div>

                {feedback.fullSteps && (
                  <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--text-main)' }}>
                    <div style={{ fontWeight: 700, marginBottom: '4px' }}>Resolución Explicada:</div>
                    <div style={{ whiteSpace: 'pre-line', background: '#fff', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-color)', fontFamily: 'Roboto Mono, monospace', fontSize: '0.78rem', lineHeight: 1.5 }}>
                      {feedback.fullSteps}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
