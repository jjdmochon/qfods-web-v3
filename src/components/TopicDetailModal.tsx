import React, { useState } from 'react';
import { QfdosTopic, CourseAttachment } from '../data/qfdosData';
import { Chem2DDrawer } from './Chem2DDrawer';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  BookOpen, 
  Layers, 
  Radio, 
  HelpCircle, 
  Award, 
  FileText, 
  ExternalLink, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  AlertCircle,
  Play,
  Share2,
  Atom,
  Lock
} from 'lucide-react';

interface TopicDetailModalProps {
  topic: QfdosTopic;
  onClose: () => void;
  onOpenQuiz: (topic: QfdosTopic) => void;
  onOpenFlashcards: (topic: QfdosTopic) => void;
  onOpenSpotifyPlayer: (att: CourseAttachment) => void;
}

export const TopicDetailModal: React.FC<TopicDetailModalProps> = ({
  topic,
  onClose,
  onOpenQuiz,
  onOpenFlashcards,
  onOpenSpotifyPlayer
}) => {
  const [activeTab, setActiveTab] = useState<'sar' | 'materials' | 'drugs'>('sar');
  const { isProfesor } = useAuth();

  // Última barrera: aquí convergen el temario, el panel de inicio y la búsqueda
  // global, así que basta con comprobarlo una vez en este punto.
  const bloqueado =
    topic.status === 'Próximamente' && !isProfesor;

  if (bloqueado) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-container"
          style={{ maxWidth: '520px' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="modal-body" style={{ padding: '2rem 1.9rem', textAlign: 'center' }}>
            <div className="proximamente-icono">
              <Lock size={26} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-title)', marginBottom: 8 }}>
              {topic.number} · {topic.title}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.6, maxWidth: '46ch', margin: '0 auto 1.25rem' }}>
              Este tema todavía no está publicado. Cuando el profesorado suba los
              materiales aparecerá aquí completo, con sus apuntes, diapositivas,
              podcast y autoevaluación.
            </p>
            <button onClick={onClose} className="btn btn-primary">
              Volver al temario
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handlePlayPodcast = () => {
    if (topic.spotifyPodcastUrl) {
      onOpenSpotifyPlayer({
        id: `sp_${topic.id}`,
        title: `Podcast Oficial: ${topic.number} — ${topic.title}`,
        type: 'spotify',
        url: topic.spotifyPodcastUrl,
        date: 'Curso 2026/2027',
        isPodcastVideo: true
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container" 
        style={{ maxWidth: '1020px', height: '90vh' }} 
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ padding: '1.25rem 1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className={`qfdos-badge ${topic.category === 'examen' ? 'badge-amber' : topic.category === 'trabajo' ? 'badge-emerald' : 'badge-navy'}`} style={{ fontSize: '0.85rem', padding: '4px 10px' }}>
              {topic.number}
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-title)', lineHeight: 1.2, margin: 0 }}>
                  {topic.title}
                </h2>
                {topic.category && topic.category !== 'teoria' && (
                  <span className="qfdos-badge badge-teal" style={{ fontSize: '0.7rem' }}>
                    {topic.category.toUpperCase()}
                  </span>
                )}
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--teal)', fontWeight: 600 }}>
                {topic.subtitle}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-outline" style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ padding: '0 1.75rem', background: 'var(--surface-raised)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="tabs-container" style={{ margin: 0 }}>
            <button
              onClick={() => setActiveTab('sar')}
              className={`tab-btn ${activeTab === 'sar' ? 'active' : ''}`}
            >
              <BookOpen size={14} /> Contenido & Autoevaluación
            </button>
            <button
              onClick={() => setActiveTab('drugs')}
              className={`tab-btn ${activeTab === 'drugs' ? 'active' : ''}`}
            >
              <Layers size={14} /> Fármacos & Quimioinformática ({topic.drugs?.length || 0})
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '1.5rem 1.75rem' }}>
          
          {/* TAB 1: Contenido & Guía Docente */}
          {activeTab === 'sar' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Description */}
              <div className="qfdos-card" style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '8px' }}>
                  Fundamento Teórico & Farmacología Molecular
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.65 }}>
                  {topic.description}
                </p>
              </div>

              {/* 6 PRIMARY RESOURCES SHOWCASE */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} color="var(--teal)" /> Suite Completa de Recursos para el Alumno
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                  
                  {/* 1. Apuntes PDF */}
                  <div className="qfdos-card card-teal" style={{ padding: '1rem', background: 'var(--surface)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <FileText size={18} color="var(--teal)" />
                      <strong style={{ fontSize: '0.88rem', color: 'var(--text-title)' }}>1. Apuntes Oficiales (PDF)</strong>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                      {topic.notesPdfName || 'Apuntes magistrales estructurados con notas para examen.'}
                    </p>
                    <a 
                      href={topic.notesPdfUrl || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-sm btn-secondary" 
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem' }}
                    >
                      <Download size={13} /> Descargar Apuntes
                    </a>
                  </div>

                  {/* 2. Diapositivas PDF */}
                  <div className="qfdos-card card-navy" style={{ padding: '1rem', background: 'var(--surface)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <FileText size={18} color="var(--navy)" />
                      <strong style={{ fontSize: '0.88rem', color: 'var(--text-title)' }}>2. Diapositivas (PDF)</strong>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                      {topic.slidesPdfName || `Presentación oficial con esquemas SAR (${topic.slideCount} diapositivas).`}
                    </p>
                    <a 
                      href={topic.slidesPdfUrl || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-sm btn-outline" 
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem' }}
                    >
                      <Download size={13} /> Ver Diapositivas
                    </a>
                  </div>

                  {/* 3. Gemini Notebook */}
                  <div className="qfdos-card card-mint" style={{ padding: '1rem', background: 'var(--surface)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <Sparkles size={18} color="var(--teal)" />
                      <strong style={{ fontSize: '0.88rem', color: 'var(--text-title)' }}>3. Gemini NotebookLM</strong>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                      Cuaderno interactivo de estudio para consultar dudas con IA.
                    </p>
                    <a 
                      href={topic.geminiNotebookUrl || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-sm btn-mint" 
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem' }}
                    >
                      <ExternalLink size={13} /> Abrir NotebookLM
                    </a>
                  </div>

                  {/* 4. Spotify Podcast */}
                  <div className="qfdos-card" style={{ padding: '1rem', background: 'var(--surface)', borderTop: '4px solid #1db954' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <Radio size={18} color="#1db954" />
                      <strong style={{ fontSize: '0.88rem', color: 'var(--text-title)' }}>4. Podcast en Spotify</strong>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                      Episodio de audio/vídeo oficial con explicaciones del profesor.
                    </p>
                    <button 
                      onClick={handlePlayPodcast}
                      className="btn btn-sm btn-outline" 
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem', borderColor: '#1db954', color: '#1db954' }}
                    >
                      <Play size={13} /> Reproducir Episodio
                    </button>
                  </div>

                  {/* 5. Cuestionario Test con Moléculas */}
                  <div className="qfdos-card card-amber" style={{ padding: '1rem', background: 'var(--surface)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <HelpCircle size={18} color="var(--accent-amber)" />
                      <strong style={{ fontSize: '0.88rem', color: 'var(--text-title)' }}>5. Test de Autoevaluación</strong>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                      {topic.testQuestions?.length || 0} preguntas con estructuras químicas y corrección razonada.
                    </p>
                    <button 
                      onClick={() => onOpenQuiz(topic)}
                      className="btn btn-sm btn-primary" 
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem' }}
                    >
                      <HelpCircle size={13} /> Realizar Test
                    </button>
                  </div>

                  {/* 6. Flashcards Interactivas */}
                  <div className="qfdos-card card-teal" style={{ padding: '1rem', background: 'var(--surface)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <Award size={18} color="var(--teal)" />
                      <strong style={{ fontSize: '0.88rem', color: 'var(--text-title)' }}>6. Flashcards Interactivas</strong>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                      {topic.flashcards?.length || 0} tarjetas de memorización con estructuras 2D.
                    </p>
                    <button 
                      onClick={() => onOpenFlashcards(topic)}
                      className="btn btn-sm btn-secondary" 
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem' }}
                    >
                      <Award size={13} /> Repasar Flashcards
                    </button>
                  </div>

                </div>
              </div>

              {/* Key Concepts List */}
              <div className="qfdos-card" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '10px' }}>
                  Conceptos Clave de la Unidad:
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '8px' }}>
                  {topic.keyConcepts?.map((c, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem' }}>
                      <CheckCircle2 size={15} color="var(--teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ color: 'var(--text-main)' }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Fármacos Prototipo & SAR */}
          {activeTab === 'drugs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {topic.drugs?.map((drug, i) => (
                  <div key={i} className="qfdos-card card-teal" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                          {drug.name}
                        </h4>
                        <span style={{ fontSize: '0.78rem', color: 'var(--teal)', fontWeight: 600 }}>
                          {drug.role}
                        </span>
                      </div>
                      {drug.pdbId && (
                        <span className="qfdos-badge badge-mint" style={{ fontSize: '0.68rem' }}>
                          PDB: {drug.pdbId}
                        </span>
                      )}
                    </div>

                    {/* 2D Molecular Drawer */}
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
                      <Chem2DDrawer smiles={drug.smiles} name={drug.name} width={260} height={130} />
                    </div>

                    {/* SMILES code */}
                    <div style={{
                      background: 'var(--surface-alt)',
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--navy)',
                      wordBreak: 'break-all',
                      marginBottom: '10px'
                    }}>
                      SMILES: {drug.smiles}
                    </div>

                    {/* Molecular Properties (Lipinski / Veber) */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '0.74rem' }}>
                      <div style={{ background: 'var(--surface-alt)', padding: '4px 6px', borderRadius: '4px', textAlign: 'center' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>PM (Da)</span>
                        <strong>{drug.mw || 'N/A'}</strong>
                      </div>
                      <div style={{ background: 'var(--surface-alt)', padding: '4px 6px', borderRadius: '4px', textAlign: 'center' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>LogP</span>
                        <strong>{drug.logP || 'N/A'}</strong>
                      </div>
                      <div style={{ background: 'var(--surface-alt)', padding: '4px 6px', borderRadius: '4px', textAlign: 'center' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>TPSA (Å²)</span>
                        <strong>{drug.tpsa || 'N/A'}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.75rem' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => onOpenQuiz(topic)} className="btn btn-sm btn-primary">
              <HelpCircle size={14} /> Test ({topic.testQuestions?.length || 0})
            </button>
            <button onClick={() => onOpenFlashcards(topic)} className="btn btn-sm btn-secondary">
              <Award size={14} /> Flashcards ({topic.flashcards?.length || 0})
            </button>
          </div>

          <button onClick={onClose} className="btn btn-outline">
            Cerrar Ficha
          </button>
        </div>

      </div>
    </div>
  );
};
