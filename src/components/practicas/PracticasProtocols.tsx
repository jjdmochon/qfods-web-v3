import React, { useState } from 'react';
import {
  LAB_REACTION_STEPS,
  LabReactionStep,
  LAB_REAGENTS
} from '../../data/practicasData';
import { Chem2DDrawer } from '../Chem2DDrawer';
import {
  FlaskConical, AlertTriangle, ShieldCheck, CheckCircle2,
  Calendar, Layers, Clock, Sparkles, ChevronRight, Eye, Info
} from 'lucide-react';

export const PracticasProtocols: React.FC = () => {
  const [selectedStepIdx, setSelectedStepIdx] = useState<number>(0);
  const currentStep: LabReactionStep = LAB_REACTION_STEPS[selectedStepIdx];
  const [showFullScheme, setShowFullScheme] = useState<boolean>(false);

  const TIMELINE = [
    { day: 'Día 1 (Lunes)', title: 'Explicación e Inicio Propranolol', desc: 'Presentación de prácticas, montaje de reflujo para Naftoximetiloxirano (I), estudio previo de espectros RMN y EM de Propranolol.' },
    { day: 'Día 2 (Martes)', title: 'Extracción Oxirano y Reacción con Amina', desc: 'Extracción con DCM y rotavapor de (I). Inicio de reacción con isopropilamina. Cálculos de disoluciones de HCl y NaOH. Espectros de DHPP y Nifedipina.' },
    { day: 'Día 3 (Miércoles)', title: 'Síntesis DHPP y Aislamiento Propranolol', desc: 'Montaje de la reacción multicomponente de Hantzsch para DHPP (2 h reflujo). Tratamiento ácido-base, extracción y purificación de Propranolol.' },
    { day: 'Día 4 (Jueves)', title: 'Filtración y Recristalización de DHPP', desc: 'Filtración a vacío por Büchner de DHPP bruta, recristalización en etanol caliente y puntos de fusión preliminares.' },
    { day: 'Día 5 (Viernes)', title: 'Pesadas, Rendimientos y Examen', desc: 'Pesada analítica de productos secos, cálculo final de rendimientos en cuaderno, recogida de puesto y realización del Examen de Prácticas.' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header & Step Selector */}
      <div className="qfdos-card" style={{ padding: '1.5rem', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <span className="qfdos-badge badge-navy" style={{ marginBottom: '0.4rem' }}>
              <Layers size={12} /> PROTOCOLOS EXPERIMENTALES PASO A PASO
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-title)', margin: '0.2rem 0' }}>
              Síntesis Orgánica y Farmacoquímica en el Laboratorio
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>
              Cuaderno oficial de prácticas: Preparación de Propranolol (II) y Dihidropiridinas de Hantzsch (DHPP / Nifedipina).
            </p>
            <a
              href="https://drive.google.com/file/d/1zHi7DsEEQ9TsXbelODcG5hcy8_pMl4Bl/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700 }}
            >
              📥 Descargar Cuaderno Completo (PDF)
            </a>
          </div>

          {/* Step switcher tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {LAB_REACTION_STEPS.map((step, idx) => (
              <button
                key={step.stepNumber}
                onClick={() => setSelectedStepIdx(idx)}
                className={`btn btn-sm ${selectedStepIdx === idx ? 'btn-navy' : 'btn-outline'}`}
                style={{
                  fontWeight: selectedStepIdx === idx ? 700 : 500,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FlaskConical size={14} />
                Etapa {step.stepNumber}: {step.title.split(' ')[2] || step.title}
              </button>
            ))}
          </div>
        </div>

        {/* Current Step Overview Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30,58,138,0.06) 0%, rgba(13,148,136,0.04) 100%)',
          borderRadius: '10px',
          padding: '1.2rem',
          borderLeft: '4px solid var(--navy)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {currentStep.subtitle}
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)', margin: '0.25rem 0' }}>
              {currentStep.title}
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', margin: '0.2rem 0', maxWidth: '750px', lineHeight: 1.5 }}>
              {currentStep.summary}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--surface)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <Calendar size={15} color="var(--navy)" />
            <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-title)' }}>
              {currentStep.dayAssigned}
            </span>
          </div>
        </div>
      </div>

      {/* Reaction Scheme & Chemical Entities Showcase */}
      <div className="grid-2-cols" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '1.5rem' }}>
        
        {/* Scheme Viewer Box */}
        <div className="qfdos-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="var(--teal)" />
              <h4 style={{ margin: 0, fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-title)' }}>
                Esquema de Reacción Vectorial de Alta Resolución (400 DPI)
              </h4>
            </div>
            <button
              onClick={() => setShowFullScheme(!showFullScheme)}
              className="btn btn-sm btn-ghost"
              style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Eye size={13} /> {showFullScheme ? 'Ver Reacción Limpia' : 'Ver Esquema con Título'}
            </button>
          </div>

          <div style={{
            background: '#ffffff',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            padding: '1rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '180px',
            boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.03)'
          }}>
            <img
              src={showFullScheme ? currentStep.schemeFullUrl : currentStep.schemeCleanUrl}
              alt={currentStep.title}
              style={{ maxWidth: '100%', maxHeight: '240px', objectFit: 'contain' }}
            />
          </div>

          {/* Product Profile Callout */}
          <div style={{
            marginTop: '1.25rem',
            background: 'var(--surface-muted)',
            borderRadius: '10px',
            padding: '1rem',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--navy)', textTransform: 'uppercase' }}>
                Producto Esperado
              </span>
              <span className="font-tech" style={{ fontSize: '0.75rem', color: 'var(--teal)', fontWeight: 600 }}>
                PM = {currentStep.product.mw} g/mol
              </span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '65px', background: '#fff', borderRadius: '6px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Chem2DDrawer smiles={currentStep.product.smiles} width={75} height={60} />
              </div>
              <div style={{ flex: 1, fontSize: '0.82rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-title)' }}>{currentStep.product.name}</div>
                <div className="font-tech" style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Fórmula: {currentStep.product.formula}</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Aspecto: <strong>{currentStep.product.appearance}</strong>
                  {currentStep.product.meltingPoint && ` · PF: ${currentStep.product.meltingPoint}`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reactants Table and Safety Precautions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Reactants List */}
          <div className="qfdos-card" style={{ padding: '1.25rem' }}>
            <h4 style={{ margin: '0 0 0.85rem 0', fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-title)' }}>
              Reactivos y Estequiometría de la Etapa
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {currentStep.reactants.map((item, rIdx) => (
                <div
                  key={rIdx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '0.6rem 0.8rem',
                    background: 'var(--surface-muted)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ width: '45px', height: '40px', background: '#fff', borderRadius: '4px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Chem2DDrawer smiles={item.reagent.smiles} width={40} height={35} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-title)' }}>
                      {item.reagent.name}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '0.74rem' }}>
                      <span className="font-tech" style={{ color: 'var(--teal)', fontWeight: 600 }}>{item.amountPrescribed}</span>
                      <span style={{ color: 'var(--text-muted)' }}>({item.role})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Alerts Box */}
          <div className="qfdos-card" style={{ padding: '1.25rem', borderLeft: '4px solid #ef4444', background: 'rgba(239, 68, 68, 0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <AlertTriangle size={17} color="#ef4444" />
              <h4 style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#b91c1c' }}>
                Medidas de Seguridad Críticas
              </h4>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {currentStep.safetyNotes.map((note, nIdx) => (
                <li key={nIdx}>{note}</li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Step-by-Step Practical Procedure & Lab Tips */}
      <div className="grid-2-cols" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)', gap: '1.5rem' }}>
        
        {/* Procedure Breakdown */}
        <div className="qfdos-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <CheckCircle2 size={18} color="var(--navy)" />
            <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: 'var(--text-title)' }}>
              Procedimiento Operativo Detallado
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {currentStep.procedureSteps.map((stepText, sIdx) => (
              <div
                key={sIdx}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  padding: '0.75rem',
                  background: sIdx % 2 === 0 ? 'var(--surface-muted)' : 'transparent',
                  borderRadius: '8px'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--navy)',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px'
                }}>
                  {sIdx + 1}
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: 1.55 }}>
                  {stepText}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Checklist and Tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Equipment needed */}
          <div className="qfdos-card" style={{ padding: '1.25rem' }}>
            <h4 style={{ margin: '0 0 0.85rem 0', fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-title)' }}>
              Material Necesario del Puesto
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {currentStep.equipmentNeeded.map((eq, eIdx) => (
                <span
                  key={eIdx}
                  style={{
                    fontSize: '0.76rem',
                    background: 'rgba(30,58,138,0.06)',
                    color: 'var(--navy)',
                    padding: '4px 9px',
                    borderRadius: '6px',
                    fontWeight: 600,
                    border: '1px solid rgba(30,58,138,0.12)'
                  }}
                >
                  ✓ {eq}
                </span>
              ))}
            </div>
          </div>

          {/* Practical Tips & Tricks */}
          <div className="qfdos-card" style={{ padding: '1.25rem', background: 'linear-gradient(135deg, rgba(13,148,136,0.05) 0%, rgba(45,212,191,0.05) 100%)', borderLeft: '4px solid var(--teal)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <Info size={16} color="var(--teal)" />
              <h4 style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: 'var(--teal-dark)' }}>
                Consejos Clave de Purificación
              </h4>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {currentStep.tipsAndTricks.map((tip, tIdx) => (
                <li key={tIdx} style={{ lineHeight: 1.5 }}>{tip}</li>
              ))}
            </ul>
          </div>

          {/* Timeline Mini Overview */}
          <div className="qfdos-card" style={{ padding: '1.25rem' }}>
            <h4 style={{ margin: '0 0 0.85rem 0', fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-title)' }}>
              Cronograma Semanal de Laboratorio
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {TIMELINE.map((t, idx) => (
                <div key={idx} style={{ fontSize: '0.76rem', display: 'flex', flexDirection: 'column', gap: '2px', borderBottom: idx < TIMELINE.length - 1 ? '1px solid var(--border-color)' : 'none', paddingBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--navy)' }}>{t.day}: {t.title}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{t.desc}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
