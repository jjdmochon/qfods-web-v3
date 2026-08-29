import React from 'react';
import { QFDOS_INFO } from '../data/qfdosData';
import { BookOpen, Award, Activity, CheckCircle2, FlaskConical } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeroProps {
  onNavigateToTemas: () => void;
  onNavigateToSimulador: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigateToTemas, onNavigateToSimulador }) => {
  const { user, isProfesor } = useAuth();

  return (
    <div style={{
      background: 'linear-gradient(140deg, var(--navy-dark) 0%, #0d2d6e 40%, var(--teal) 100%)',
      color: '#ffffff',
      padding: '2.75rem 1rem 3.25rem',
      borderBottom: '1px solid rgba(45,212,191,0.2)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Grid pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(45,212,191,0.09) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        pointerEvents: 'none'
      }} />
      {/* Glow orb */}
      <div style={{
        position: 'absolute', top: '-60px', right: '-60px',
        width: 360, height: 360,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(45,212,191,0.14) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>

          {/* Left: Title */}
          <div>
            {/* Welcome greeting */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <span className="qfdos-badge badge-mint" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                CURSO ACADÉMICO {QFDOS_INFO.year}
              </span>
              <span className="qfdos-badge" style={{ background: 'rgba(255,255,255,0.10)', color: '#fff', border: '1px solid rgba(255,255,255,0.18)', fontSize: '0.7rem' }}>
                GRUPOS C & E · FACULTAD DE FARMACIA
              </span>
              {isProfesor && (
                <span className="qfdos-badge" style={{ background: 'rgba(45,212,191,0.2)', color: 'var(--mint)', border: '1px solid rgba(45,212,191,0.35)', fontSize: '0.7rem' }}>
                  MODO PROFESOR
                </span>
              )}
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 5vw, 3.3rem)',
              fontWeight: 500,
              lineHeight: 1.05,
              color: '#ffffff',
              letterSpacing: '-0.025em',
              marginBottom: 10
            }}>
              Química<br />
              <em style={{ color: 'var(--mint)', fontStyle: 'italic', fontWeight: 400 }}>
                Farmacéutica II
              </em>
            </h1>

            {user && (
              <p style={{ fontSize: '0.95rem', color: '#94d4f0', marginBottom: 6, fontWeight: 500 }}>
                Bienvenido/a, <strong style={{ color: '#fff' }}>{user.name.split(' ')[0]}</strong>
              </p>
            )}

            <p style={{ fontSize: '1rem', color: '#c7ddf7', lineHeight: 1.65, maxWidth: 560, marginBottom: '1.75rem' }}>
              Diseño racional de fármacos, afinidad termodinámica (ΔG°, Kd, Ki), relaciones SAR, quimioinformática 2D/3D y evaluación continua.
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button onClick={onNavigateToTemas} className="btn btn-mint btn-lg" style={{ fontWeight: 700 }}>
                <BookOpen size={17} /> Explorar 11 Temas
              </button>
              <button onClick={onNavigateToSimulador} className="btn btn-secondary btn-lg" style={{ fontWeight: 700 }}>
                <Award size={17} /> Simulador Biofísico
              </button>
              <button
                onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
                className="btn btn-outline btn-lg"
                style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.08)', fontWeight: 600 }}
              >
                <FlaskConical size={17} /> Buscar Fármaco
              </button>
            </div>
          </div>

          {/* Right: Evaluation matrix */}
          <div style={{
            background: 'rgba(7, 16, 31, 0.60)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 20,
            border: '1px solid rgba(45,212,191,0.22)',
            padding: '1.6rem',
            boxShadow: '0 16px 40px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--mint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Evaluación Continua UGR
              </span>
              <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>100%</span>
            </div>

            {[
              { label: 'Examen Final Oficial (Obligatorio, mín. 5)', pct: 70, color: 'var(--mint)' },
              { label: 'Examen Parcial (No eliminatorio)', pct: 20, color: 'var(--teal)' },
              { label: 'Prácticas de Laboratorio (Obligatorio)', pct: 5, color: 'var(--secondary-light)' },
              { label: 'Trabajos y/o Seminarios', pct: 5, color: 'var(--accent-purple)' }
            ].map(item => (
              <div key={item.label} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 3 }}>
                  <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{item.label}</span>
                  <span style={{ fontWeight: 700, color: item.color, fontFamily: 'var(--font-mono)' }}>{item.pct}%</span>
                </div>
                <div className="stat-bar-track" style={{ height: '6px' }}>
                  <div className="stat-bar-fill" style={{ width: `${item.pct}%`, background: item.color }} />
                </div>
              </div>
            ))}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 4 }}>
              {[
                '11 Temas Completos', 'Quimioinformática 2D/3D',
                'Podcasts & NotebookLM', 'Quiz & Flashcards IA'
              ].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', color: '#cbd5e1' }}>
                  <CheckCircle2 size={12} color="var(--mint)" style={{ flexShrink: 0 }} /> {feat}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
