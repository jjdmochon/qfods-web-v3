import React, { useMemo, useState } from 'react';
import { QfdosTopic, QfdosAnnouncement } from '../data/qfdosData';
import { Chem2DDrawer } from './Chem2DDrawer';
import { MolPropertyStrip } from './MolPropertyStrip';
import { useAuth } from '../context/AuthContext';
import {
  Award, Activity, Bell, ArrowRight, ChevronRight, FileText,
  ShieldCheck, UploadCloud, FlaskConical, Shuffle
} from 'lucide-react';

interface HubDashboardProps {
  topics: QfdosTopic[];
  announcements: QfdosAnnouncement[];
  onSelectTopic: (topic: QfdosTopic) => void;
  onNavigateToTemas: () => void;
  onNavigateToSimulador: () => void;
  onNavigateToAdmet: () => void;
  onNavigateToPracticas: () => void;
  onOpenExamGenerator: () => void;
  onOpenAdminCms: () => void;
}

export const HubDashboard: React.FC<HubDashboardProps> = ({
  topics,
  announcements,
  onSelectTopic,
  onNavigateToTemas,
  onNavigateToSimulador,
  onNavigateToAdmet,
  onNavigateToPracticas,
  onOpenExamGenerator,
  onOpenAdminCms
}) => {
  const { isProfesor } = useAuth();

  // Catálogo plano de fármacos con estructura, para el foco estructural
  const catalogue = useMemo(
    () =>
      topics.flatMap(t =>
        (t.drugs ?? [])
          .filter(d => d.smiles?.trim())
          .map(d => ({ drug: d, topic: t }))
      ),
    [topics]
  );

  const [spotlightIdx, setSpotlightIdx] = useState(0);
  const spotlight = catalogue[spotlightIdx % Math.max(1, catalogue.length)];

  const totalDrugs = catalogue.length;
  const totalQuestions = topics.reduce((n, t) => n + (t.testQuestions?.length ?? 0), 0);
  const totalCards = topics.reduce((n, t) => n + (t.flashcards?.length ?? 0), 0);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>

      {/* Panel de profesor — punto de entrada visible a la gestión de materiales */}
      {isProfesor && (
        <div className="professor-banner" style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <ShieldCheck size={20} color="var(--mint)" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>
                Panel de profesor
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.72)' }}>
                Sube apuntes y diapositivas, edita el temario y genera exámenes
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={onOpenAdminCms} className="btn btn-sm btn-mint" style={{ fontWeight: 700 }}>
              <UploadCloud size={14} /> Subir materiales
            </button>
            <button
              onClick={onOpenAdminCms}
              className="btn btn-sm"
              style={{ background: 'rgba(255,255,255,0.14)', color: '#fff', border: '1px solid rgba(255,255,255,0.24)' }}
            >
              <FileText size={14} /> Editar temario
            </button>
            <button
              onClick={onOpenExamGenerator}
              className="btn btn-sm"
              style={{ background: 'rgba(255,255,255,0.14)', color: '#fff', border: '1px solid rgba(255,255,255,0.24)' }}
            >
              <Award size={14} /> Generar examen
            </button>
          </div>
        </div>
      )}

      {/* Cifras del curso */}
      <div className="course-stats">
        {[
          { value: topics.length, label: 'Módulos', accent: 'var(--navy)' },
          { value: totalDrugs, label: 'Fármacos con estructura', accent: 'var(--teal)' },
          { value: totalQuestions, label: 'Preguntas de test', accent: 'var(--accent-purple)' },
          { value: totalCards, label: 'Flashcards', accent: 'var(--accent-emerald)' }
        ].map(s => (
          <div key={s.label} className="course-stat">
            <span className="stat-value" style={{ color: s.accent }}>{s.value}</span>
            <span className="eyebrow" style={{ fontSize: '0.63rem' }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="hub-grid">

        {/* Columna izquierda */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Tablón */}
          <div className="qfdos-card card-navy">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Bell size={17} color="var(--navy)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-title)' }}>
                  Tablón de avisos
                </h3>
              </div>
              <span className="qfdos-badge badge-teal" style={{ fontSize: '0.66rem' }}>
                {announcements.length} activo{announcements.length === 1 ? '' : 's'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {announcements.map(ann => (
                <div key={ann.id} className={`ann-card ${ann.priority === 'alta' ? 'ann-alta' : 'ann-normal'}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3, gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-title)' }}>{ann.title}</span>
                    <span className="tabular" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                      {ann.date}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.5 }}>{ann.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Herramientas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button
              onClick={onNavigateToPracticas}
              className="qfdos-card card-navy tool-card"
              style={{ gridColumn: '1 / -1', background: 'linear-gradient(135deg, rgba(30,58,138,0.06) 0%, rgba(13,148,136,0.05) 100%)', borderLeft: '4px solid var(--navy)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FlaskConical size={24} color="var(--navy)" />
                  <div style={{ textAlign: 'left' }}>
                    <h4 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 700, color: 'var(--navy)' }}>
                      Módulo de Prácticas de Laboratorio
                    </h4>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Síntesis (Propranolol y DHPP), calculadora de rendimientos, disoluciones, espectroscopia RMN/EM y simulador de examen.
                    </p>
                  </div>
                </div>
                <span className="tool-card-cta" style={{ color: 'var(--navy)', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                  Entrar <ArrowRight size={13} />
                </span>
              </div>
            </button>

            <button onClick={onNavigateToSimulador} className="qfdos-card card-teal tool-card">
              <Award size={22} color="var(--teal)" />
              <h4>Simulador de afinidad</h4>
              <p>ΔG°, Kd, Ki, Cheng-Prusoff e IC50 en tiempo real.</p>
              <span className="tool-card-cta" style={{ color: 'var(--teal)' }}>
                Lanzar <ArrowRight size={12} />
              </span>
            </button>

            <button onClick={onNavigateToAdmet} className="qfdos-card card-mint tool-card">
              <Activity size={22} color="var(--secondary-light)" />
              <h4>ADMET & Lipinski</h4>
              <p>Perfilado Lipinski / Veber con descriptores RDKit.</p>
              <span className="tool-card-cta" style={{ color: 'var(--secondary-light)' }}>
                Evaluar <ArrowRight size={12} />
              </span>
            </button>

            <button
              onClick={onOpenExamGenerator}
              className="qfdos-card card-purple tool-card"
              style={{ gridColumn: '1 / -1' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={20} color="var(--accent-purple)" />
                <h4 style={{ margin: 0 }}>Generador de exámenes</h4>
              </div>
              <p>Preguntas tipo test calibradas al nivel de dificultad UGR.</p>
            </button>
          </div>
        </div>

        {/* Columna derecha: foco estructural */}
        <div className="qfdos-card spotlight-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <FlaskConical size={17} color="var(--teal)" />
              <h3 style={{ fontSize: '1.02rem', fontWeight: 600, color: 'var(--text-title)' }}>
                Foco estructural
              </h3>
            </div>
            <button
              onClick={() => setSpotlightIdx(i => (i + 1) % Math.max(1, catalogue.length))}
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.72rem', padding: '4px 9px' }}
              disabled={catalogue.length < 2}
            >
              <Shuffle size={12} /> Siguiente
            </button>
          </div>

          {spotlight ? (
            <>
              <div className="spotlight-stage">
                <Chem2DDrawer
                  smiles={spotlight.drug.smiles}
                  width={340}
                  height={250}
                  bare
                />
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.28rem', fontWeight: 600, color: 'var(--text-title)' }}>
                  {spotlight.drug.name}
                </div>
                {spotlight.drug.role && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.5 }}>
                    {spotlight.drug.role}
                  </div>
                )}
              </div>

              <MolPropertyStrip smiles={spotlight.drug.smiles} />

              <button
                onClick={() => onSelectTopic(spotlight.topic)}
                className="btn btn-sm btn-outline"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {spotlight.topic.number} · {spotlight.topic.title} <ChevronRight size={13} />
              </button>
            </>
          ) : (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Aún no hay fármacos con estructura registrada.
            </div>
          )}
        </div>
      </div>

      {/* Módulos destacados */}
      <div className="section-rule" style={{ marginTop: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.42rem', fontWeight: 600, color: 'var(--text-title)' }}>
            Unidades temáticas
          </h2>
          <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
            SAR, dianas moleculares y autoevaluación por módulo
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.15rem' }}>
        {topics.slice(0, 4).map((t, idx) => (
          <div
            key={t.id}
            onClick={() => onSelectTopic(t)}
            className={`qfdos-card topic-card ${['card-navy', 'card-teal', 'card-mint', 'card-purple'][idx % 4]}`}
            style={{ cursor: 'pointer', justifyContent: 'space-between' }}
            role="button"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter') onSelectTopic(t); }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span className="qfdos-badge badge-navy" style={{ fontSize: '0.67rem' }}>{t.number}</span>
                {t.pdbTargetId && (
                  <a
                    href={`https://www.rcsb.org/structure/${t.pdbTargetId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="qfdos-badge badge-teal"
                    style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}
                    title={`Ver ${t.pdbTargetId} en el RCSB PDB`}
                  >
                    {t.pdbTargetId}
                  </a>
                )}
              </div>

              <h3 style={{ fontSize: '1.06rem', fontWeight: 600, color: 'var(--text-title)', marginBottom: 3 }}>
                {t.title}
              </h3>
              <p style={{ fontSize: '0.77rem', color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.45 }}>
                {t.subtitle}
              </p>

              {t.drugs?.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0' }}>
                  <Chem2DDrawer smiles={t.drugs[0].smiles} name={t.drugs[0].name} width={215} height={105} />
                </div>
              )}
            </div>

            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              paddingTop: 10, borderTop: '1px solid var(--border-color)', marginTop: 8
            }}>
              <span className="tabular" style={{ fontSize: '0.71rem', color: 'var(--text-muted)' }}>
                {t.drugs?.length || 0} fármacos · {t.testQuestions?.length || 0} preguntas
              </span>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: 3 }}>
                Entrar <ArrowRight size={12} />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
        <button onClick={onNavigateToTemas} className="btn btn-outline" style={{ gap: 6 }}>
          Ver los {topics.length} módulos <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
