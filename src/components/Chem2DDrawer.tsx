import React, { useEffect, useState, useRef } from 'react';
import { renderMoleculeSvg } from '../services/rdkitService';
import { useTheme } from '../context/ThemeContext';
import { AlertTriangle } from 'lucide-react';

interface Chem2DDrawerProps {
  smiles: string;
  name?: string;
  width?: number;
  height?: number;
  className?: string;
  /** SMARTS de la subestructura/farmacóforo a resaltar */
  highlightSmarts?: string;
  /** Oculta el marco y el fondo; útil dentro de tarjetas ya delimitadas */
  bare?: boolean;
}

/**
 * Renderiza una estructura 2D con RDKit (WASM).
 * A diferencia de un dibujo aproximado, la geometría, los ciclos, la
 * aromaticidad y la estereoquímica son las que RDKit deduce del SMILES.
 * Soporta esquemas de reacción "reactivo>>producto".
 */
export const Chem2DDrawer: React.FC<Chem2DDrawerProps> = ({
  smiles,
  name,
  width = 220,
  height = 150,
  className = '',
  highlightSmarts,
  bare = false
}) => {
  const [svg, setSvg] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const mounted = useRef(true);
  const { theme } = useTheme();
  const dark = theme === 'dark';

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setSvg(null);

    if (!smiles?.trim()) {
      setStatus('error');
      return;
    }

    const isReaction = /(>>|->|=>)/.test(smiles);

    const run = async () => {
      if (isReaction) {
        const [left, right] = smiles.split(/>>|->|=>/).map(s => s.trim());
        const halfWidth = Math.floor((width - 46) / 2);
        const [a, b] = await Promise.all([
          renderMoleculeSvg(left, { width: halfWidth, height, highlightSmarts, dark }),
          renderMoleculeSvg(right, { width: halfWidth, height, highlightSmarts, dark })
        ]);
        if (cancelled || !mounted.current) return;
        if (!a && !b) { setStatus('error'); return; }
        setSvg(buildReactionSvg(a, b, halfWidth, height));
        setStatus('ok');
        return;
      }

      const result = await renderMoleculeSvg(smiles, { width, height, highlightSmarts, dark });
      if (cancelled || !mounted.current) return;
      if (!result) { setStatus('error'); return; }
      setSvg(result);
      setStatus('ok');
    };

    run();
    return () => { cancelled = true; };
  }, [smiles, width, height, highlightSmarts, dark]);

  const frameStyle: React.CSSProperties = bare
    ? { display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }
    : {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'var(--mol-canvas-bg)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        padding: '6px',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all var(--transition-fast)'
      };

  return (
    <div style={frameStyle} className={`chem-2d-container ${className}`}>
      <div
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        {status === 'loading' && (
          <div className="chem-skeleton" style={{ width: width - 12, height: height - 12 }} />
        )}

        {status === 'error' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 5,
              color: 'var(--text-muted)',
              fontSize: '0.7rem',
              textAlign: 'center',
              padding: '0 8px'
            }}
          >
            <AlertTriangle size={16} color="var(--accent-amber)" />
            <span>Estructura no representable</span>
          </div>
        )}

        {status === 'ok' && svg && (
          <div
            className="chem-svg-host"
            style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        )}
      </div>

      {name && (
        <span
          style={{
            fontSize: '0.74rem',
            fontWeight: 700,
            color: 'var(--text-title)',
            marginTop: '2px',
            textAlign: 'center',
            maxWidth: `${width}px`,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
          title={name}
        >
          {name}
        </span>
      )}
    </div>
  );
};

/** Compone dos SVG de RDKit en un único esquema con flecha de reacción. */
function buildReactionSvg(
  left: string | null,
  right: string | null,
  halfWidth: number,
  height: number
): string {
  const total = halfWidth * 2 + 46;
  const arrowX = halfWidth + 6;
  const midY = height / 2;

  const strip = (s: string | null) =>
    s ? s.replace(/<\?xml[^>]*\?>/g, '').replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '') : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="${height}" viewBox="0 0 ${total} ${height}">
  <g transform="translate(0,0)">${strip(left)}</g>
  <g stroke="var(--teal, #0d9488)" fill="var(--teal, #0d9488)" stroke-width="1.8" stroke-linecap="round">
    <line x1="${arrowX + 4}" y1="${midY}" x2="${arrowX + 30}" y2="${midY}" />
    <polygon points="${arrowX + 34},${midY} ${arrowX + 26},${midY - 4.5} ${arrowX + 26},${midY + 4.5}" stroke="none" />
  </g>
  <g transform="translate(${halfWidth + 46},0)">${strip(right)}</g>
</svg>`;
}
