import React, { useState, useEffect } from 'react';
import { PracticasProtocols } from './PracticasProtocols';
import { PracticasYieldCalculator } from './PracticasYieldCalculator';
import { PracticasSolutionsCalculator } from './PracticasSolutionsCalculator';
import { PracticasSpectroscopyWorkshop } from './PracticasSpectroscopyWorkshop';
import { PracticasLabEquipment } from './PracticasLabEquipment';
import { PracticasExamSimulator } from './PracticasExamSimulator';
import { PracticasPairReport } from './PracticasPairReport';
import { PracticasSafetyRules } from './PracticasSafetyRules';
import { PracticasProgreso } from './PracticasProgreso';
import { LimiteDeError } from '../LimiteDeError';
import {
  FlaskConical, Layers, Calculator, Droplets, Activity,
  Settings, GraduationCap, Sparkles, BookOpen, ExternalLink, Users,
  ShieldAlert, CheckCircle2, Lock, X, ClipboardCheck
} from 'lucide-react';

export const PracticasSection: React.FC = () => {
  const [isSafetyAccepted, setIsSafetyAccepted] = useState<boolean>(() => {
    return !!localStorage.getItem('qfdos_practicas_safety_accepted');
  });

  const [showLockNotice, setShowLockNotice] = useState(false);

  const [activeSubTab, setActiveSubTab] = useState<
    'progreso' | 'safety' | 'protocols' | 'yields' | 'solutions' | 'spectroscopy' | 'equipment' | 'exam' | 'pair_report'
  >(() => {
    const accepted = !!localStorage.getItem('qfdos_practicas_safety_accepted');
    return accepted ? 'progreso' : 'safety';
  });

  const SUB_TABS = [
    {
      id: 'progreso',
      label: 'Mi progreso',
      icon: <ClipboardCheck size={15} />,
      desc: 'Qué has entregado y qué te falta',
      locked: !isSafetyAccepted
    },
    {
      id: 'safety',
      label: '0. Normas de Seguridad',
      icon: <ShieldAlert size={15} />,
      desc: 'Checklist obligatorio y precauciones',
      badge: isSafetyAccepted ? 'FIRMADO' : 'OBLIGATORIO',
      badgeClass: isSafetyAccepted ? 'badge-mint' : 'badge-red'
    },
    {
      id: 'protocols',
      label: '1. Protocolos de Síntesis',
      icon: <Layers size={15} />,
      desc: 'Guía paso a paso y esquemas 400 DPI',
      locked: !isSafetyAccepted
    },
    {
      id: 'yields',
      label: '2. Calculadora de Rendimientos',
      icon: <Calculator size={15} />,
      desc: 'Estequiometría y cuaderno digital',
      locked: !isSafetyAccepted
    },
    {
      id: 'solutions',
      label: '3. Preparación de Disoluciones',
      icon: <Droplets size={15} />,
      desc: 'Sólidos, ácidos y diluciones V₁M₁=V₂M₂',
      locked: !isSafetyAccepted
    },
    {
      id: 'spectroscopy',
      label: '4. Taller de Espectroscopia',
      icon: <Activity size={15} />,
      desc: 'Visor ¹H, ¹³C RMN, DEPT y HR-MS',
      locked: !isSafetyAccepted
    },
    {
      id: 'equipment',
      label: '5. Material y Montajes',
      icon: <Settings size={15} />,
      desc: 'Puesto de trabajo y operaciones',
      locked: !isSafetyAccepted
    },
    {
      id: 'exam',
      label: '6. Simulador de Examen',
      icon: <GraduationCap size={15} />,
      desc: 'Examen con estructuras y PM',
      locked: !isSafetyAccepted
    },
    {
      id: 'pair_report',
      label: '7. Cuaderno Parejas y Recepción',
      icon: <Users size={15} />,
      desc: 'Informe conjunto y panel profesor',
      locked: !isSafetyAccepted
    }
  ];

  const handleSafetyAccepted = () => {
    setIsSafetyAccepted(true);
    setActiveSubTab('protocols');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner Hero */}
      <div className="qfdos-card" style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #0d9488 100%)',
        color: '#ffffff',
        padding: '2rem',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(30,58,138,0.18)'
      }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '850px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(6px)',
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '0.74rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <FlaskConical size={13} /> MÓDULO INTERACTIVO DE LABORATORIO
            </span>
            <span style={{ fontSize: '0.74rem', opacity: 0.9 }}>
              Química Farmacéutica II · UGR
            </span>
            {isSafetyAccepted ? (
              <span className="qfdos-badge badge-mint" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} /> Normas de Seguridad Aceptadas
              </span>
            ) : (
              <span className="qfdos-badge badge-red" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Lock size={12} /> Lectura de Seguridad Pendiente
              </span>
            )}
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'Montserrat, sans-serif', margin: '0.2rem 0 0.6rem 0', color: '#ffffff', letterSpacing: '-0.02em' }}>
            Cuaderno de Prácticas y Entrenador de Examen
          </h1>

          <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.92)', lineHeight: 1.55, margin: '0 0 1.25rem 0' }}>
            Plataforma integral para preparar y registrar tus prácticas de laboratorio: comprométete con las normas oficiales de seguridad, 
            visualiza las síntesis de Propranolol y DHPP, calcula reactivos limitantes y rendimientos en tiempo real, domina las disoluciones 
            de reactivos sólidos y líquidos, elucida espectros de RMN/MS, prepárate para el examen con estructuras 2D y entrega el informe oficial por parejas.
          </p>

          {/* Quick Metrics Bar & Download Cuaderno */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href="https://drive.google.com/file/d/1zHi7DsEEQ9TsXbelODcG5hcy8_pMl4Bl/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-mint"
              style={{
                fontWeight: 800,
                fontSize: '0.82rem',
                padding: '8px 16px',
                background: '#ffffff',
                color: 'var(--navy)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              📥 <span>Descargar Cuaderno de Prácticas (PDF)</span>
            </a>
            <div style={{ background: 'rgba(255,255,255,0.12)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600 }}>
              🛡️ <strong>Seguridad:</strong> 16 normas y precauciones
            </div>
            <div style={{ background: 'rgba(255,255,255,0.12)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600 }}>
              ⚗️ <strong>3 Reacciones:</strong> Propranolol (I y II) & DHPP
            </div>
            <div style={{ background: 'rgba(255,255,255,0.12)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600 }}>
              🔬 <strong>12 Espectros:</strong> ¹H, ¹³C, DEPT & HRMS
            </div>
            <div style={{ background: 'rgba(255,255,255,0.12)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600 }}>
              👥 <strong>Parejas:</strong> Cuaderno conjunto
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Navigation Bar */}
      <div className="qfdos-card" style={{ padding: '0.6rem 0.8rem', background: 'var(--surface)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.5rem' }}>
          {SUB_TABS.map(tab => {
            const isActive = activeSubTab === tab.id;
            const isLocked = tab.locked;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (isLocked) {
                    setShowLockNotice(true);
                    setActiveSubTab('safety');
                  } else {
                    setShowLockNotice(false);
                    setActiveSubTab(tab.id as any);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  background: isActive ? 'var(--navy)' : (isLocked ? 'rgba(0,0,0,0.02)' : 'transparent'),
                  color: isActive ? '#ffffff' : (isLocked ? 'var(--text-muted)' : 'var(--text-main)'),
                  border: isActive ? '1px solid var(--navy)' : '1px solid transparent',
                  cursor: 'pointer',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.78rem',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  opacity: isLocked ? 0.65 : 1
                }}
              >
                <div style={{ color: isActive ? 'var(--mint)' : (isLocked ? 'var(--text-muted)' : 'var(--teal)'), display: 'flex', alignItems: 'center' }}>
                  {isLocked ? <Lock size={14} /> : tab.icon}
                </div>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                  {tab.label}
                </div>
                {tab.badge && (
                  <span className={`qfdos-badge ${tab.badgeClass}`} style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Content Area */}
      {showLockNotice && !isSafetyAccepted && (
        <div className="lock-notice no-print" role="status">
          <ShieldAlert size={17} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <strong>Antes de entrar al laboratorio hay que firmar las normas.</strong>{' '}
            Marca las {SUB_TABS.length > 0 ? '16' : ''} normas de seguridad y firma abajo: el resto
            del módulo se desbloquea al instante.
          </div>
          <button onClick={() => setShowLockNotice(false)} className="btn btn-sm btn-ghost" aria-label="Cerrar aviso">
            <X size={15} />
          </button>
        </div>
      )}

      <div>
        {activeSubTab === 'progreso' && (
          <LimiteDeError zona="Mi progreso">
            <PracticasProgreso onIr={(d) => setActiveSubTab(d as any)} />
          </LimiteDeError>
        )}
        {activeSubTab === 'safety' && (
          <PracticasSafetyRules
            onAcceptAndProceed={handleSafetyAccepted}
            isUnlocked={isSafetyAccepted}
          />
        )}
        {activeSubTab === 'protocols' && (
          <LimiteDeError zona="Protocolos de sintesis"><PracticasProtocols /></LimiteDeError>
        )}
        {activeSubTab === 'yields' && (
          <LimiteDeError zona="Calculadora de rendimientos"><PracticasYieldCalculator /></LimiteDeError>
        )}
        {activeSubTab === 'solutions' && (
          <LimiteDeError zona="Preparacion de disoluciones"><PracticasSolutionsCalculator /></LimiteDeError>
        )}
        {activeSubTab === 'spectroscopy' && (
          <LimiteDeError zona="Taller de espectroscopia"><PracticasSpectroscopyWorkshop /></LimiteDeError>
        )}
        {activeSubTab === 'equipment' && (
          <LimiteDeError zona="Material y montajes"><PracticasLabEquipment /></LimiteDeError>
        )}
        {activeSubTab === 'exam' && (
          <LimiteDeError zona="Simulador de examen"><PracticasExamSimulator /></LimiteDeError>
        )}
        {activeSubTab === 'pair_report' && (
          <LimiteDeError zona="Cuaderno de parejas"><PracticasPairReport /></LimiteDeError>
        )}
      </div>

    </div>
  );
};
