import React from 'react';
import { CourseAttachment } from '../data/qfdosData';
import { X, Radio, ExternalLink } from 'lucide-react';

interface SpotifyPlayerModalProps {
  attachment: CourseAttachment | null;
  onClose: () => void;
}

export const SpotifyPlayerModal: React.FC<SpotifyPlayerModalProps> = ({
  attachment,
  onClose
}) => {
  if (!attachment) return null;

  // Extract Spotify episode ID from URL or URI
  const getEmbedUrl = (url: string) => {
    if (url.includes('open.spotify.com/episode/')) {
      const epId = url.split('/episode/')[1]?.split('?')[0];
      return `https://open.spotify.com/embed/episode/${epId}?utm_source=generator&theme=0`;
    }
    return 'https://open.spotify.com/embed/show/3Kx9ColinQFDOS01?utm_source=generator&theme=0';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container" 
        style={{ maxWidth: '640px' }} 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={20} color="#1db954" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-title)' }}>
              {attachment.title}
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-outline"><X size={18} /></button>
        </div>

        {/* Body with Spotify Iframe */}
        <div className="modal-body" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="qfdos-badge badge-mint" style={{ fontSize: '0.72rem', background: '#1db954', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Radio size={12} /> Podcast Oficial · UGR
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Facultad de Farmacia
            </span>
          </div>

          <iframe
            src={getEmbedUrl(attachment.url)}
            width="100%"
            height="352"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', minHeight: '232px', border: 'none' }}
          />

          <div style={{
            background: 'var(--surface-alt)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '360px', lineHeight: 1.4 }}>
              💡 <em>Nota sobre el vídeo:</em> El reproductor web embebido de Spotify transmite el audio del episodio. Para ver el <strong>vídeo sincronizado en alta definición</strong>, abre el episodio directamente en la app o web de Spotify.
            </div>
            <a 
              href={attachment.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.75rem', fontWeight: 700, borderColor: '#1db954', color: '#1db954', whiteSpace: 'nowrap' }}
            >
              <ExternalLink size={13} /> Ver Vídeo en Spotify
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-primary">
            Cerrar Reproductor
          </button>
        </div>

      </div>
    </div>
  );
};
