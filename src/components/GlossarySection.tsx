import React, { useState } from 'react';
import { QfdosGlossaryTerm } from '../data/qfdosData';
import { BookOpen, Search, Filter, Tag, Check, Copy } from 'lucide-react';

interface GlossarySectionProps {
  glossary: QfdosGlossaryTerm[];
}

export const GlossarySection: React.FC<GlossarySectionProps> = ({ glossary }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['todos', 'Afinidad & Receptor', 'SNC & Neuro', 'Cardiovascular', 'ADMET & Profiling'];

  const filtered = glossary.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.clinicalRelevance.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'todos' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (t: QfdosGlossaryTerm) => {
    navigator.clipboard.writeText(`${t.term}: ${t.definition} (Relevancia: ${t.clinicalRelevance})`);
    setCopiedId(t.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      
      {/* Title & Filter Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <BookOpen size={24} color="var(--navy)" />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-title)' }}>
            Glosario Farmacológico & Biofísico Oficial
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Términos clave, constantes cinético-termodinámicas, conceptos SAR y mecanismos moleculares de Química Farmacéutica II.
        </p>
      </div>

      {/* Controls Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.78rem' }}
            >
              {cat === 'todos' ? 'Todas las Categorías' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Filtrar conceptos..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '32px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Glossary Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filtered.map(t => (
          <div key={t.id} className="qfdos-card card-teal" style={{ justifyContent: 'space-between', padding: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span className="qfdos-badge badge-teal" style={{ fontSize: '0.68rem' }}>
                  {t.category}
                </span>
                <button
                  onClick={() => handleCopy(t)}
                  className="btn btn-sm btn-outline"
                  style={{ padding: '2px 6px', fontSize: '0.7rem' }}
                  title="Copiar definición"
                >
                  {copiedId === t.id ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                </button>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '6px' }}>
                {t.term}
              </h3>

              {t.technicalCode && (
                <div style={{
                  padding: '4px 8px',
                  background: 'var(--surface-alt)',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--navy)',
                  fontWeight: 700,
                  marginBottom: '8px',
                  width: 'fit-content'
                }}>
                  {t.technicalCode}
                </div>
              )}

              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '10px' }}>
                {t.definition}
              </p>
            </div>

            <div style={{
              paddingTop: '8px',
              borderTop: '1px solid var(--border-color)',
              fontSize: '0.78rem',
              color: 'var(--text-muted)'
            }}>
              <strong style={{ color: 'var(--teal)' }}>Relevancia:</strong> {t.clinicalRelevance}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
