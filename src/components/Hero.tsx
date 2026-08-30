import React from 'react';
import { QFDOS_INFO } from '../data/qfdosData';
import { BookOpen, Award, CheckCircle2, FlaskConical, Sparkles, ChevronRight, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeroProps {
  onNavigateToTemas: () => void;
  onNavigateToSimulador: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigateToTemas, onNavigateToSimulador }) => {
  const { user, isProfesor } = useAuth();

  return (
    <section className="qfdos-hero-section">
      {/* Dynamic structural background grid */}
      <div className="qfdos-hero-bg-grid" />
      <div className="qfdos-hero-glow-orb" />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="qfdos-hero-layout">

          {/* Left Column: Subject identity, typography and primary actions */}
          <div className="qfdos-hero-main">
            {/* Context Badge row */}
            <div className="qfdos-hero-badges">
              <span className="qfdos-hero-pill pill-cyan">
                CURSO ACADÉMICO {QFDOS_INFO.year}
              </span>
              <span className="qfdos-hero-pill pill-translucent">
                GRUPO E · FACULTAD DE FARMACIA (UGR)
              </span>
              {isProfesor && (
                <span className="qfdos-hero-pill pill-prof">
                  <GraduationCap size={13} /> MODO PROFESOR
                </span>
              )}
            </div>

            <h1 className="qfdos-hero-title">
              Química<br />
              <span className="qfdos-hero-title-accent">
                Farmacéutica II
              </span>
            </h1>

            {user && (
              <p className="qfdos-hero-welcome">
                Bienvenido/a, <strong>{user.name.split(' ')[0]}</strong>
              </p>
            )}

            <p className="qfdos-hero-description">
              Diseño racional de fármacos, afinidad termodinámica (ΔG°, Kd, Ki), relaciones SAR, quimioinformática 2D/3D y evaluación continua.
            </p>

            <div className="qfdos-hero-cta-group">
              <button onClick={onNavigateToTemas} className="btn-hero-primary">
                <BookOpen size={17} />
                <span>Explorar 11 Temas</span>
                <ChevronRight size={15} style={{ opacity: 0.8 }} />
              </button>
              <button onClick={onNavigateToSimulador} className="btn-hero-secondary">
                <Award size={17} />
                <span>Simulador Biofísico</span>
              </button>
              <button
                onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
                className="btn-hero-tertiary"
              >
                <FlaskConical size={16} />
                <span>Buscar Fármaco</span>
              </button>
            </div>
          </div>

          {/* Right Column: High-affinity evaluation matrix card */}
          <div className="qfdos-hero-matrix-card">
            <div className="qfdos-matrix-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="var(--mint)" />
                <span className="qfdos-matrix-title">
                  Evaluación Continua UGR
                </span>
              </div>
              <span className="qfdos-matrix-pct-total">100%</span>
            </div>

            <div className="qfdos-matrix-items">
              {[
                { label: 'Examen Final Oficial (Obligatorio, mín. 5)', pct: 70, barClass: 'bar-final' },
                { label: 'Examen Parcial (No eliminatorio)', pct: 20, barClass: 'bar-parcial' },
                { label: 'Prácticas de Laboratorio (Obligatorio)', pct: 5, barClass: 'bar-practicas' },
                { label: 'Trabajos y/o Seminarios', pct: 5, barClass: 'bar-seminarios' }
              ].map(item => (
                <div key={item.label} className="qfdos-matrix-row">
                  <div className="qfdos-matrix-label-row">
                    <span className="qfdos-matrix-item-name">{item.label}</span>
                    <span className="qfdos-matrix-item-pct">{item.pct}%</span>
                  </div>
                  <div className="qfdos-matrix-track">
                    <div className={`qfdos-matrix-fill ${item.barClass}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="qfdos-matrix-features">
              {[
                '11 Temas Completos', 'Quimioinformática 2D/3D',
                'Podcasts & NotebookLM', 'Quiz & Flashcards IA'
              ].map(feat => (
                <div key={feat} className="qfdos-matrix-feature-pill">
                  <CheckCircle2 size={13} color="var(--mint)" style={{ flexShrink: 0 }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
