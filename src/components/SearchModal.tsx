import React, { useState, useEffect } from 'react';
import { QfdosTopic, QfdosGlossaryTerm, MoleculeDrug } from '../data/qfdosData';
import { 
  Search, 
  X, 
  BookOpen, 
  Layers, 
  HelpCircle, 
  Award, 
  Activity, 
  FileText,
  ArrowRight
} from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  topics: QfdosTopic[];
  glossary: QfdosGlossaryTerm[];
  onSelectTopic: (topic: QfdosTopic) => void;
  onNavigateToTab: (tab: string) => void;
  onOpenNotesGenerator?: () => void;
  onOpenExamGenerator: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  topics,
  glossary,
  onSelectTopic,
  onNavigateToTab,
  onOpenExamGenerator
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Matched Topics
  const matchedTopics = cleanQuery
    ? topics.filter(t => 
        t.title.toLowerCase().includes(cleanQuery) ||
        t.subtitle.toLowerCase().includes(cleanQuery) ||
        t.number.toLowerCase().includes(cleanQuery) ||
        t.keyConcepts.some(c => c.toLowerCase().includes(cleanQuery))
      )
    : [];

  // Matched Drugs
  const matchedDrugs: { drug: MoleculeDrug; topic: QfdosTopic }[] = [];
  if (cleanQuery) {
    topics.forEach(t => {
      t.drugs.forEach(d => {
        if (d.name.toLowerCase().includes(cleanQuery) || d.role.toLowerCase().includes(cleanQuery)) {
          matchedDrugs.push({ drug: d, topic: t });
        }
      });
    });
  }

  // Matched Glossary Terms
  const matchedGlossary = cleanQuery
    ? glossary.filter(g => 
        g.term.toLowerCase().includes(cleanQuery) ||
        g.definition.toLowerCase().includes(cleanQuery) ||
        g.category.toLowerCase().includes(cleanQuery)
      )
    : [];

  // System Tools
  const SYSTEM_TOOLS = [
    { title: 'Simulador de Afinidad & Cheng-Prusoff', desc: 'Cálculo de ΔG°, Kd, Ki, IC50 y eficiencia de ligando', tab: 'simulador', icon: Award },
    { title: 'Calculadora ADMET & Reglas de Lipinski / Veber', desc: 'Perfilado físico-químico y gráfico radar', tab: 'admet', icon: Activity },
    { title: 'Generador Oficial de Exámenes IA', desc: 'Creación de preguntas tipo test por nivel de dificultad', action: onOpenExamGenerator, icon: FileText }
  ];

  const matchedTools = cleanQuery
    ? SYSTEM_TOOLS.filter(tool => tool.title.toLowerCase().includes(cleanQuery) || tool.desc.toLowerCase().includes(cleanQuery))
    : SYSTEM_TOOLS;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container" 
        style={{ maxWidth: '680px', maxHeight: '80vh' }} 
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'var(--surface-raised)'
        }}>
          <Search size={20} color="var(--navy)" />
          <input
            type="text"
            placeholder="Buscar temas, fármacos, dianas PDB, biofísica, glosario..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '1rem',
              color: 'var(--text-main)',
              fontFamily: 'inherit'
            }}
          />
          <button onClick={onClose} className="btn btn-sm btn-outline" style={{ padding: '3px 7px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Results Body */}
        <div className="modal-body" style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Tools Section */}
          {matchedTools.length > 0 && (
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'block' }}>
                Herramientas & Módulos
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {matchedTools.map((tool, idx) => {
                  const Icon = tool.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        onClose();
                        if (tool.tab) onNavigateToTab(tool.tab);
                        if (tool.action) tool.action();
                      }}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--surface-alt)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background var(--transition-fast)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon size={18} color="var(--teal)" />
                        <div>
                          <strong style={{ fontSize: '0.85rem', color: 'var(--text-title)', display: 'block' }}>
                            {tool.title}
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {tool.desc}
                          </span>
                        </div>
                      </div>
                      <ArrowRight size={14} color="var(--text-muted)" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Topics Results */}
          {matchedTopics.length > 0 && (
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'block' }}>
                Unidades Temáticas ({matchedTopics.length})
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {matchedTopics.map(t => (
                  <div
                    key={t.id}
                    onClick={() => {
                      onClose();
                      onSelectTopic(t);
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--surface-alt)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="qfdos-badge badge-navy" style={{ fontSize: '0.65rem' }}>{t.number}</span>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--text-title)' }}>{t.title}</strong>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.subtitle}</span>
                    </div>
                    <ArrowRight size={14} color="var(--text-muted)" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drugs Results */}
          {matchedDrugs.length > 0 && (
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'block' }}>
                Fármacos & Moléculas ({matchedDrugs.length})
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {matchedDrugs.map(({ drug, topic }, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      onClose();
                      onSelectTopic(topic);
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--surface-alt)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--navy)' }}>{drug.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                        {drug.role} ({topic.number})
                      </span>
                    </div>
                    <span className="qfdos-badge badge-teal" style={{ fontSize: '0.65rem' }}>
                      MW: {drug.mw || '-'} Da
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Glossary Results */}
          {matchedGlossary.length > 0 && (
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'block' }}>
                Términos del Glosario ({matchedGlossary.length})
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {matchedGlossary.map(g => (
                  <div
                    key={g.id}
                    onClick={() => {
                      onClose();
                      onNavigateToTab('glosario');
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--surface-alt)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--text-title)' }}>{g.term}</strong>
                      <span className="qfdos-badge badge-mint" style={{ fontSize: '0.65rem' }}>{g.category}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-main)', marginTop: '2px', lineHeight: 1.4 }}>
                      {g.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cleanQuery && matchedTopics.length === 0 && matchedDrugs.length === 0 && matchedGlossary.length === 0 && matchedTools.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No se encontraron resultados para «{query}». Prueba buscando por término (ej. Kd, Ki, β-bloqueantes, COX-2, GABA, Morfina).
            </div>
          )}

        </div>

        {/* Footer info */}
        <div style={{ padding: '8px 16px', background: 'var(--surface-raised)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <span>Navega con ratón o teclado · ESC para cerrar</span>
          <span className="font-mono">Ctrl/Cmd + K</span>
        </div>

      </div>
    </div>
  );
};
