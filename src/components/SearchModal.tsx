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
  ArrowRight,
  FlaskConical,
  Globe,
  Database,
  ExternalLink
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
  onOpenDrugSearch?: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  topics,
  glossary,
  onSelectTopic,
  onNavigateToTab,
  onOpenExamGenerator,
  onOpenDrugSearch
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
    { title: 'Buscador de Fármacos (PubChem & DrugBank)', desc: 'Exploración química 2D, propiedades moleculares y enlaces oficiales', action: onOpenDrugSearch, icon: FlaskConical },
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
          <Search size={20} color="var(--navy-ink)" />
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
                        <Icon size={18} color="var(--teal-ink)" />
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Fármacos & Moléculas ({matchedDrugs.length})
                </span>
                {onOpenDrugSearch && (
                  <button
                    onClick={() => { onClose(); onOpenDrugSearch(); }}
                    style={{ fontSize: '0.7rem', color: 'var(--teal-ink)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}
                  >
                    <FlaskConical size={12} /> Abrir Buscador Avanzado
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {matchedDrugs.map(({ drug, topic }, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--surface-alt)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px'
                    }}
                  >
                    <div
                      onClick={() => {
                        onClose();
                        onSelectTopic(topic);
                      }}
                      style={{ cursor: 'pointer', flex: 1 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--navy-ink)' }}>{drug.name}</strong>
                        <span className="qfdos-badge badge-teal" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
                          {topic.number}
                        </span>
                        {drug.mw && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            · {drug.mw} Da
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {drug.role}
                      </span>
                    </div>

                    {/* External Direct Links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          window.open(`https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(drug.name)}`, '_blank', 'noopener,noreferrer');
                        }}
                        className="btn btn-sm btn-outline"
                        style={{ fontSize: '0.68rem', padding: '2px 6px', height: '24px', gap: '3px' }}
                        title="Ver en PubChem"
                      >
                        <Globe size={11} /> PubChem
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          window.open(`https://go.drugbank.com/unearth/q?query=${encodeURIComponent(drug.name)}`, '_blank', 'noopener,noreferrer');
                        }}
                        className="btn btn-sm btn-outline"
                        style={{ fontSize: '0.68rem', padding: '2px 6px', height: '24px', gap: '3px' }}
                        title="Ver en DrugBank"
                      >
                        <Database size={11} /> DrugBank
                      </button>
                      <button
                        onClick={() => {
                          onClose();
                          onSelectTopic(topic);
                        }}
                        className="btn btn-sm btn-outline"
                        style={{ padding: '2px 5px', height: '24px' }}
                        title="Ver tema del curso"
                      >
                        <ArrowRight size={13} />
                      </button>
                    </div>
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
            <div style={{ textAlign: 'center', padding: '2rem 1.5rem', color: 'var(--text-muted)', background: 'var(--surface-alt)', borderRadius: 'var(--radius-md)' }}>
              <FlaskConical size={32} color="var(--teal-ink)" style={{ margin: '0 auto 10px auto' }} />
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '4px' }}>
                Sin resultados locales para «{query}»
              </div>
              <p style={{ fontSize: '0.78rem', marginBottom: '14px' }}>
                Consulta directamente este término en las bases de datos químicas internacionales:
              </p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    window.open(`https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer');
                  }}
                  className="btn btn-sm btn-primary"
                  style={{ fontSize: '0.75rem' }}
                >
                  <Globe size={13} /> Buscar en PubChem <ExternalLink size={11} />
                </button>
                <button
                  onClick={() => {
                    window.open(`https://go.drugbank.com/unearth/q?query=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer');
                  }}
                  className="btn btn-sm btn-secondary"
                  style={{ fontSize: '0.75rem' }}
                >
                  <Database size={13} /> Buscar en DrugBank <ExternalLink size={11} />
                </button>
                {onOpenDrugSearch && (
                  <button
                    onClick={() => { onClose(); onOpenDrugSearch(); }}
                    className="btn btn-sm btn-outline"
                    style={{ fontSize: '0.75rem' }}
                  >
                    <FlaskConical size={13} /> Abrir Buscador QFDOS
                  </button>
                )}
              </div>
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
