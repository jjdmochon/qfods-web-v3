import React, { useMemo, useState } from 'react';
import { QfdosResourceLink, RESOURCE_CATEGORIES } from '../data/qfdosData';
import { useAuth } from '../context/AuthContext';
import {
  ExternalLink, Search, Clock, Star, Link2, Settings, Compass
} from 'lucide-react';

interface ResourceLinksSectionProps {
  links: QfdosResourceLink[];
  onOpenAdminCms: () => void;
}

/** Extrae el dominio para mostrarlo: da contexto sobre la fiabilidad de la fuente. */
function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

const CATEGORY_ACCENT: Record<string, string> = {
  'Casos de éxito': 'var(--accent-emerald)',
  'Descubrimiento de fármacos': 'var(--teal)',
  'Impacto en pacientes': 'var(--accent-purple)',
  'Regulación & seguridad': 'var(--accent-amber)',
  'Industria & carrera profesional': 'var(--navy)',
  'Divulgación': 'var(--accent-blue)'
};

export const ResourceLinksSection: React.FC<ResourceLinksSectionProps> = ({
  links,
  onOpenAdminCms
}) => {
  const { isProfesor } = useAuth();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('todas');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return links
      .filter(l => category === 'todas' || l.category === category)
      .filter(l =>
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.summary.toLowerCase().includes(q) ||
        (l.source ?? '').toLowerCase().includes(q) ||
        (l.relatedTopic ?? '').toLowerCase().includes(q)
      )
      // Los destacados primero; dentro de cada grupo, lo más reciente arriba
      .sort((a, b) => {
        if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1;
        return (b.addedAt ?? '').localeCompare(a.addedAt ?? '');
      });
  }, [links, query, category]);

  // Sólo se ofrecen las categorías que tienen algo dentro
  const usedCategories = useMemo(
    () => RESOURCE_CATEGORIES.filter(c => links.some(l => l.category === c)),
    [links]
  );

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>

      {/* Encabezado */}
      <div style={{ marginBottom: '1.75rem', maxWidth: '72ch' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
          <Compass size={24} color="var(--teal)" />
          <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-title)' }}>
            Enlaces de interés
          </h2>
        </div>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
          Lecturas, informes y casos reales que muestran para qué sirve todo esto:
          cómo una molécula bien diseñada cambia el pronóstico de una enfermedad, y
          también cuándo y por qué el proceso falla.
        </p>

        {isProfesor && (
          <button
            onClick={onOpenAdminCms}
            className="btn btn-sm btn-secondary"
            style={{ marginTop: 12, fontWeight: 700 }}
          >
            <Settings size={14} /> Añadir o editar enlaces
          </button>
        )}
      </div>

      {/* Controles */}
      <div className="resource-controls">
        <div className="resource-search">
          <Search size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por título, tema o fuente…"
            aria-label="Buscar enlaces"
          />
        </div>

        <div className="resource-filters">
          <button
            onClick={() => setCategory('todas')}
            className={`btn btn-sm ${category === 'todas' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.76rem' }}
          >
            Todas ({links.length})
          </button>
          {usedCategories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`btn btn-sm ${category === c ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.76rem' }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Listado */}
      {filtered.length === 0 ? (
        <div className="resource-empty">
          <Link2 size={26} color="var(--text-muted)" />
          <p>
            {links.length === 0
              ? 'Todavía no hay enlaces publicados.'
              : 'Ningún enlace coincide con la búsqueda.'}
          </p>
          {links.length > 0 && (
            <button onClick={() => { setQuery(''); setCategory('todas'); }} className="btn btn-sm btn-outline">
              Quitar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="resource-grid">
          {filtered.map(link => {
            const accent = CATEGORY_ACCENT[link.category] ?? 'var(--teal)';
            const domain = domainOf(link.url);

            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`resource-card ${link.featured ? 'is-featured' : ''}`}
                style={{ borderTopColor: accent }}
              >
                <div className="resource-card-top">
                  <span className="resource-cat" style={{ color: accent, background: `color-mix(in srgb, ${accent} 12%, transparent)` }}>
                    {link.category}
                  </span>
                  {link.featured && (
                    <span className="resource-featured" title="Recomendado por el profesor">
                      <Star size={11} fill="currentColor" /> Recomendado
                    </span>
                  )}
                </div>

                <h3 className="resource-title">{link.title}</h3>

                <p className="resource-summary">{link.summary}</p>

                <div className="resource-meta">
                  {link.source && <span className="resource-source">{link.source}</span>}
                  {link.duration && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <Clock size={11} /> {link.duration}
                    </span>
                  )}
                  {link.relatedTopic && (
                    <span className="qfdos-badge badge-navy" style={{ fontSize: '0.63rem' }}>
                      {link.relatedTopic}
                    </span>
                  )}
                </div>

                <div className="resource-foot">
                  <span className="resource-domain">{domain}</span>
                  <span className="resource-go">
                    Abrir <ExternalLink size={12} />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};
