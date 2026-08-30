import React, { useState } from 'react';
import {
  COMPOUND_SPECTRA_DATA,
  CompoundSpectra,
  SpectrumPeak
} from '../../data/practicasData';
import { Chem2DDrawer } from '../Chem2DDrawer';
import {
  Activity, RotateCw, ZoomIn, Eye, Sparkles, Layers,
  CheckCircle2, HelpCircle, Info, ChevronRight, Binary
} from 'lucide-react';

export const PracticasSpectroscopyWorkshop: React.FC = () => {
  const [selectedCompoundKey, setSelectedCompoundKey] = useState<string>('propranolol');
  const [selectedSpectrumType, setSelectedSpectrumType] = useState<'1h' | '13c' | 'dept' | 'ms'>('1h');
  const [useRotatedView, setUseRotatedView] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'viewer' | 'assignments' | 'diagnostics' | 'quiz'>('viewer');

  const currentCompound: CompoundSpectra = (COMPOUND_SPECTRA_DATA as Record<string, CompoundSpectra>)[selectedCompoundKey] || COMPOUND_SPECTRA_DATA.propranolol;

  // Quiz state
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  const QUIZ_QUESTIONS = [
    {
      id: 'q1',
      question: 'En el espectro de ¹H RMN del Propranolol, ¿a qué corresponde el doblete intenso a δ = 1,49 ppm (6H)?',
      options: [
        'A los dos grupos metilo equivalentes del grupo isopropilamino -NH-CH(CH₃)₂',
        'A los protones aromáticos del anillo de naftaleno',
        'Al protón del grupo hidroxilo -OH',
        'A los protones del grupo metileno -O-CH₂-'
      ],
      correctIdx: 0,
      explanation: 'El grupo isopropilo acoplado al único protón metino -CH- genera un doblete limpio para los 6 protones metílicos a 1,49 ppm.'
    },
    {
      id: 'q2',
      question: '¿Qué cambio fundamental se observa en el ¹H RMN al comparar DHPP (4-fenil) con Nifedipina (4-(2-nitrofenil))?',
      options: [
        'El protón C4-H se desplaza a campo bajo (desapantallamiento) de 5,00 ppm a 5,70 ppm por el efecto inductivo y anisotrópico del grupo o-NO₂',
        'La Nifedipina pierde la señal del grupo NH',
        'En la Nifedipina desaparecen los metilos de los ésteres',
        'En el DHPP el anillo aromático muestra 4 protones y en la Nifedipina 5 protones'
      ],
      correctIdx: 0,
      explanation: 'El fuerte efecto atractor de electrones (-I, -M) del grupo nitro orto en Nifedipina desapantalla fuertemente el protón bencílico C4-H, desplazándolo desde 5,00 ppm (DHPP) hasta 5,70 ppm.'
    },
    {
      id: 'q3',
      question: 'En un espectro DEPT-135, ¿cómo se distinguen los carbonos de una molécula?',
      options: [
        'Los CH y CH₃ dan señales positivas (hacia arriba), los CH₂ dan señales negativas (invertidas) y los C cuaternarios no aparecen',
        'Todos los carbonos dan señales hacia arriba',
        'Solo aparecen los carbonos cuaternarios',
        'Los carbonos aromáticos se invierten y los alifáticos van hacia arriba'
      ],
      correctIdx: 0,
      explanation: 'DEPT-135 es la técnica estándar para determinar multiplicidad de carbonos: CH y CH₃ aparecen en fase positiva (+), CH₂ en fase invertida (-) y los carbonos sin protones unidos (cuaternarios y carbonilos) quedan suprimidos.'
    }
  ];

  const [currentQuizQIdx, setCurrentQuizQIdx] = useState<number>(0);

  const getCurrentImage = () => {
    if (selectedSpectrumType === '1h') {
      return useRotatedView ? currentCompound.r1hImageHorizontal : currentCompound.r1hImagePortrait;
    }
    if (selectedSpectrumType === '13c') {
      return useRotatedView ? currentCompound.r13cImageHorizontal : currentCompound.r13cImagePortrait;
    }
    if (selectedSpectrumType === 'dept') {
      return useRotatedView ? currentCompound.deptImageHorizontal : currentCompound.deptImagePortrait;
    }
    return useRotatedView ? currentCompound.msImageHorizontal : currentCompound.msImagePortrait;
  };

  const getSpectrumTitle = () => {
    if (selectedSpectrumType === '1h') return 'Espectro de ¹H RMN';
    if (selectedSpectrumType === '13c') return 'Espectro de ¹³C RMN';
    if (selectedSpectrumType === 'dept') return 'Espectro DEPT-135';
    return 'Espectro de Masas de Alta Resolución (HR-MS TOF ES⁺)';
  };

  const getCurrentPeaks = (): SpectrumPeak[] => {
    if (selectedSpectrumType === '1h') return currentCompound.peaks1H;
    if (selectedSpectrumType === '13c' || selectedSpectrumType === 'dept') return currentCompound.peaks13C;
    return [];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header & Compound Selector */}
      <div className="qfdos-card" style={{ padding: '1.5rem', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <span className="qfdos-badge badge-teal" style={{ marginBottom: '0.4rem' }}>
              <Activity size={12} /> TALLER DE ELUCIDACIÓN ESPECTROSCÓPICA
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-title)', margin: '0.2rem 0' }}>
              Espectroscopia de RMN (¹H, ¹³C, DEPT-135) y Masas (HR-MS)
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
              Inspecciona los espectros reales de laboratorio de Propranolol, DHPP y Nifedipina con asignación detallada de señales.
            </p>
          </div>

          {/* Compound Switcher */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {Object.keys(COMPOUND_SPECTRA_DATA).map(key => {
              const comp = (COMPOUND_SPECTRA_DATA as Record<string, CompoundSpectra>)[key];
              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedCompoundKey(key);
                    setSelectedSpectrumType('1h');
                  }}
                  className={`btn btn-sm ${selectedCompoundKey === key ? 'btn-navy' : 'btn-outline'}`}
                  style={{ fontWeight: selectedCompoundKey === key ? 700 : 500, fontSize: '0.8rem' }}
                >
                  {comp.compoundName.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Compound Info Bar */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30,58,138,0.05) 0%, rgba(13,148,136,0.04) 100%)',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          borderLeft: '4px solid var(--navy)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="panel-claro" style={{ width: '65px', height: '55px', borderRadius: '6px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Chem2DDrawer smiles={currentCompound.smiles} width={60} height={50} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                {currentCompound.compoundName}
              </h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Fórmula: <strong className="font-tech">{currentCompound.formula}</strong> · PM: <strong className="font-tech">{currentCompound.mw} g/mol</strong>
              </div>
            </div>
          </div>

          {/* Sub-nav tabs */}
          <div style={{ display: 'flex', gap: '4px', background: 'var(--surface)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setActiveTab('viewer')}
              className={`btn btn-xs ${activeTab === 'viewer' ? 'btn-navy' : 'btn-ghost'}`}
              style={{ fontSize: '0.74rem', fontWeight: 600 }}
            >
              <Eye size={12} style={{ marginRight: '4px' }} /> Visor de Espectros
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`btn btn-xs ${activeTab === 'assignments' ? 'btn-navy' : 'btn-ghost'}`}
              style={{ fontSize: '0.74rem', fontWeight: 600 }}
            >
              <Binary size={12} style={{ marginRight: '4px' }} /> Tabla de Asignaciones
            </button>
            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`btn btn-xs ${activeTab === 'diagnostics' ? 'btn-navy' : 'btn-ghost'}`}
              style={{ fontSize: '0.74rem', fontWeight: 600 }}
            >
              <Sparkles size={12} style={{ marginRight: '4px' }} /> Claves Diagnósticas
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`btn btn-xs ${activeTab === 'quiz' ? 'btn-teal' : 'btn-ghost'}`}
              style={{ fontSize: '0.74rem', fontWeight: 600 }}
            >
              <HelpCircle size={12} style={{ marginRight: '4px' }} /> Quiz RMN/EM
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: SPECTRUM VIEWER */}
      {activeTab === 'viewer' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Spectrum Type Selector & Controls Bar */}
          <div className="qfdos-card" style={{ padding: '0.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setSelectedSpectrumType('1h')}
                className={`btn btn-sm ${selectedSpectrumType === '1h' ? 'btn-teal' : 'btn-outline'}`}
                style={{ fontWeight: selectedSpectrumType === '1h' ? 700 : 500, fontSize: '0.76rem' }}
              >
                ¹H RMN
              </button>
              <button
                onClick={() => setSelectedSpectrumType('13c')}
                className={`btn btn-sm ${selectedSpectrumType === '13c' ? 'btn-teal' : 'btn-outline'}`}
                style={{ fontWeight: selectedSpectrumType === '13c' ? 700 : 500, fontSize: '0.76rem' }}
              >
                ¹³C RMN
              </button>
              <button
                onClick={() => setSelectedSpectrumType('dept')}
                className={`btn btn-sm ${selectedSpectrumType === 'dept' ? 'btn-teal' : 'btn-outline'}`}
                style={{ fontWeight: selectedSpectrumType === 'dept' ? 700 : 500, fontSize: '0.76rem' }}
              >
                DEPT-135
              </button>
              <button
                onClick={() => setSelectedSpectrumType('ms')}
                className={`btn btn-sm ${selectedSpectrumType === 'ms' ? 'btn-teal' : 'btn-outline'}`}
                style={{ fontWeight: selectedSpectrumType === 'ms' ? 700 : 500, fontSize: '0.76rem' }}
              >
                HR-MS (Masas)
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setUseRotatedView(!useRotatedView)}
                className="btn btn-sm btn-outline"
                style={{ fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                title={useRotatedView
                  ? 'Ver el escaneo tal cual salió del espectrómetro, en vertical'
                  : 'Volver a la vista orientada para leer sin inclinar la cabeza'}
              >
                <RotateCw size={14} />
                {useRotatedView ? 'Ver escaneo original' : 'Vista orientada (recomendada)'}
              </button>
            </div>
          </div>

          {/* High Resolution Spectrum Image Box */}
          <div className="qfdos-card panel-claro" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0, fontWeight: 800, fontSize: '0.96rem', color: 'var(--text-title)' }}>
                {getSpectrumTitle()} — {currentCompound.compoundName}
              </h4>
            </div>

            {/* Image Viewer Container */}
            <div style={{
              width: '100%',
              overflowX: 'auto',
              display: 'flex',
              justifyContent: 'center',
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              minHeight: '350px'
            }}>
              <img
                src={getCurrentImage()}
                alt={getSpectrumTitle()}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: useRotatedView ? '600px' : '750px',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
              />
            </div>

            {/* Diagnostic Signals Footer */}
            {selectedSpectrumType !== 'ms' ? (
              <div style={{ width: '100%', marginTop: '1.25rem' }}>
                <h5 style={{ margin: '0 0 0.5rem 0', fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-title)' }}>
                  Señales Principales Identificadas en el Espectro:
                </h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.5rem' }}>
                  {getCurrentPeaks().map((sig: SpectrumPeak, sIdx: number) => (
                    <div
                      key={sIdx}
                      style={{
                        background: 'var(--surface-muted)',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong className="font-tech" style={{ color: 'var(--navy-ink)' }}>δ = {sig.ppm} ppm</strong>
                        <span style={{ color: 'var(--teal-ink)', fontWeight: 600 }}>{sig.type} {sig.integral ? `(${sig.integral})` : ''}</span>
                      </div>
                      <div style={{ color: 'var(--text-title)', fontWeight: 600 }}>{sig.assignment}</div>
                      {sig.deptSignal && (
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Fase DEPT: {sig.deptSignal}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : currentCompound.msData ? (
              <div style={{ width: '100%', marginTop: '1.25rem', padding: '1rem', background: 'var(--surface-muted)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h5 style={{ margin: '0 0 0.5rem 0', fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-title)' }}>
                  Datos de Espectrometría de Masas de Alta Resolución (HR-MS TOF ES⁺):
                </h5>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>• <strong>Tipo de Ion:</strong> {currentCompound.msData.ionType}</div>
                  <div>• <strong>m/z Experimental:</strong> <span className="font-tech" style={{ fontWeight: 700, color: 'var(--navy-ink)' }}>{currentCompound.msData.mOverZ}</span> (Calculado: {currentCompound.msData.calcMOverZ}, Error: {currentCompound.msData.errorPpm} ppm)</div>
                  <div>• <strong>Fórmula Elemental:</strong> <span className="font-tech">{currentCompound.msData.formula}</span></div>
                  <div>• <strong>Interpretación:</strong> {currentCompound.msData.explanation}</div>
                </div>
              </div>
            ) : null}

          </div>

        </div>
      )}

      {/* TAB 2: DETAILED ASSIGNMENTS TABLE */}
      {activeTab === 'assignments' && (
        <div className="qfdos-card" style={{ padding: '1.5rem' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-title)' }}>
            Tabla Integral de Asignaciones Espectroscópicas — {currentCompound.compoundName}
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* 1H Table */}
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ background: 'var(--surface-muted)', padding: '8px 14px', borderBottom: '1px solid var(--border-color)', fontWeight: 700, fontSize: '0.88rem', color: 'var(--navy-ink)' }}>
                Espectro de ¹H RMN
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="qfdos-table" style={{ width: '100%', fontSize: '0.78rem', margin: 0 }}>
                  <thead>
                    <tr>
                      <th style={{ width: '20%' }}>Desplazamiento (δ, ppm)</th>
                      <th style={{ width: '15%' }}>Multiplicidad</th>
                      <th style={{ width: '15%' }}>Integración</th>
                      <th style={{ width: '50%' }}>Asignación Estructural</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCompound.peaks1H.map((p: SpectrumPeak, idx: number) => (
                      <tr key={idx}>
                        <td className="font-tech" style={{ fontWeight: 700, color: 'var(--navy-ink)' }}>{p.ppm}</td>
                        <td>{p.type}</td>
                        <td className="font-tech">{p.integral || '-'}</td>
                        <td style={{ fontWeight: 600, color: 'var(--text-title)' }}>{p.assignment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 13C & DEPT Table */}
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ background: 'var(--surface-muted)', padding: '8px 14px', borderBottom: '1px solid var(--border-color)', fontWeight: 700, fontSize: '0.88rem', color: 'var(--teal-ink)' }}>
                Espectro de ¹³C RMN y DEPT-135
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="qfdos-table" style={{ width: '100%', fontSize: '0.78rem', margin: 0 }}>
                  <thead>
                    <tr>
                      <th style={{ width: '25%' }}>Desplazamiento (δ, ppm)</th>
                      <th style={{ width: '20%' }}>Fase DEPT-135</th>
                      <th style={{ width: '55%' }}>Asignación de Carbono</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCompound.peaks13C.map((p: SpectrumPeak, idx: number) => (
                      <tr key={idx}>
                        <td className="font-tech" style={{ fontWeight: 700, color: 'var(--navy-ink)' }}>{p.ppm}</td>
                        <td>
                          <span className={`qfdos-badge ${p.deptSignal === 'positivo' ? 'badge-teal' : p.deptSignal === 'negativo' ? 'badge-gold' : 'badge-navy'}`} style={{ fontSize: '0.68rem' }}>
                            {p.deptSignal || 'C cuaternario'}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--text-title)' }}>{p.assignment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: DIAGNOSTIC KEYS */}
      {activeTab === 'diagnostics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="qfdos-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-title)' }}>
              Claves Diagnósticas para Examen de {currentCompound.compoundName}
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {currentCompound.diagnosticKeys.map((keyText: string, kIdx: number) => (
                <div
                  key={kIdx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '0.85rem 1rem',
                    background: 'var(--surface-muted)',
                    borderRadius: '8px',
                    borderLeft: '4px solid var(--teal)'
                  }}
                >
                  <Sparkles size={16} color="var(--teal-ink)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.55 }}>
                    {keyText}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Side-by-Side Comparison: DHPP vs Nifedipina */}
          <div className="qfdos-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(30,58,138,0.04) 0%, rgba(13,148,136,0.04) 100%)' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontWeight: 800, fontSize: '1rem', color: 'var(--text-title)' }}>
              Comparativa Clave: DHPP vs Nifedipina en ¹H RMN
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="panel-claro" style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h5 style={{ margin: '0 0 0.5rem 0', fontWeight: 700, color: 'var(--navy-ink)', fontSize: '0.9rem' }}>
                  DHPP (4-Fenildihidropiridina)
                </h5>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.78rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li><strong>C4-H:</strong> Singlete a <strong>δ = 5,00 ppm</strong> (1H).</li>
                  <li><strong>Aromáticos:</strong> Multiplete único de <strong>5H (7,13–7,27 ppm)</strong> (anillo fenilo simétrico).</li>
                  <li><strong>Ésteres:</strong> Singlete a 3,64 ppm (6H, 2× -COOCH₃).</li>
                  <li><strong>Metilos C2/C6:</strong> Singlete a 2,33 ppm (6H, 2× -CH₃).</li>
                </ul>
              </div>

              <div className="panel-claro" style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h5 style={{ margin: '0 0 0.5rem 0', fontWeight: 700, color: 'var(--teal-ink)', fontSize: '0.9rem' }}>
                  Nifedipina (4-(2-Nitrofenil)dihidropiridina)
                </h5>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.78rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li><strong>C4-H:</strong> Singlete fuertemente desapantallado a <strong>δ = 5,70 ppm</strong> (1H, +0,7 ppm por efecto -NO₂).</li>
                  <li><strong>Aromáticos:</strong> <strong>4H disustituidos</strong> separados en multipletes (7,35; 7,50; 7,65 ppm).</li>
                  <li><strong>Ésteres:</strong> Singlete a 3,60 ppm (6H, 2× -COOCH₃).</li>
                  <li><strong>Metilos C2/C6:</strong> Singlete a 2,32 ppm (6H, 2× -CH₃).</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: INTERACTIVE SPECTRA QUIZ */}
      {activeTab === 'quiz' && (
        <div className="qfdos-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <span className="qfdos-badge badge-teal" style={{ marginBottom: '4px' }}>
                AUTOEVALUACIÓN ESPECTROSCÓPICA
              </span>
              <h4 style={{ margin: '0.2rem 0', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-title)' }}>
                Pregunta {currentQuizQIdx + 1} de {QUIZ_QUESTIONS.length}
              </h4>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => {
                  setCurrentQuizQIdx(prev => (prev > 0 ? prev - 1 : QUIZ_QUESTIONS.length - 1));
                  setQuizAnswer(null);
                }}
                className="btn btn-xs btn-outline"
              >
                Anterior
              </button>
              <button
                onClick={() => {
                  setCurrentQuizQIdx(prev => (prev + 1) % QUIZ_QUESTIONS.length);
                  setQuizAnswer(null);
                }}
                className="btn btn-xs btn-outline"
              >
                Siguiente
              </button>
            </div>
          </div>

          {/* Current Question */}
          <div style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--text-title)', marginBottom: '1rem', lineHeight: 1.5 }}>
            {QUIZ_QUESTIONS[currentQuizQIdx].question}
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {QUIZ_QUESTIONS[currentQuizQIdx].options.map((opt, oIdx) => {
              const isSelected = quizAnswer === oIdx.toString();
              const isCorrect = QUIZ_QUESTIONS[currentQuizQIdx].correctIdx === oIdx;

              let btnBg = 'var(--surface-muted)';
              let btnBorder = 'var(--border-color)';
              if (quizAnswer !== null) {
                if (isCorrect) {
                  btnBg = 'rgba(16,185,129,0.12)';
                  btnBorder = '#10b981';
                } else if (isSelected && !isCorrect) {
                  btnBg = 'rgba(239,68,68,0.12)';
                  btnBorder = '#ef4444';
                }
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => setQuizAnswer(oIdx.toString())}
                  disabled={quizAnswer !== null}
                  style={{
                    background: btnBg,
                    border: `1.5px solid ${btnBorder}`,
                    borderRadius: '8px',
                    padding: '0.8rem 1rem',
                    textAlign: 'left',
                    cursor: quizAnswer !== null ? 'default' : 'pointer',
                    fontSize: '0.84rem',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: isSelected ? 'var(--navy)' : '#fff',
                    color: isSelected ? '#fff' : 'var(--text-title)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation when answered */}
          {quizAnswer !== null && (
            <div style={{
              marginTop: '1.25rem',
              padding: '1rem',
              borderRadius: '8px',
              background: parseInt(quizAnswer) === QUIZ_QUESTIONS[currentQuizQIdx].correctIdx ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
              border: `1px solid ${parseInt(quizAnswer) === QUIZ_QUESTIONS[currentQuizQIdx].correctIdx ? '#10b981' : '#ef4444'}`
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: parseInt(quizAnswer) === QUIZ_QUESTIONS[currentQuizQIdx].correctIdx ? '#059669' : '#dc2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {parseInt(quizAnswer) === QUIZ_QUESTIONS[currentQuizQIdx].correctIdx ? <CheckCircle2 size={16} /> : <Info size={16} />}
                {parseInt(quizAnswer) === QUIZ_QUESTIONS[currentQuizQIdx].correctIdx ? '¡Respuesta Correcta!' : 'Respuesta Incorrecta'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '4px', lineHeight: 1.5 }}>
                {QUIZ_QUESTIONS[currentQuizQIdx].explanation}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
