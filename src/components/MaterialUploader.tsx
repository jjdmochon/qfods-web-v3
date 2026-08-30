import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  UploadCloud, FileText, Music, Image as ImageIcon, File as FileIcon,
  Trash2, Download, Eye, AlertCircle, HardDrive, Link2
} from 'lucide-react';
import {
  saveFile, listFiles, deleteFile, downloadStoredFile, getFileUrl,
  getUsage, detectKind, formatBytes, StoredFileMeta
} from '../services/fileStorage';

interface MaterialUploaderProps {
  /** Si se indica, los ficheros quedan asociados a ese módulo */
  topicId?: string;
  topicLabel?: string;
  compact?: boolean;
}

const KIND_META: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  slides: { icon: FileText, color: 'var(--navy-ink)', label: 'Diapositivas' },
  notes: { icon: FileText, color: 'var(--teal-ink)', label: 'Apuntes' },
  audio: { icon: Music, color: '#1db954', label: 'Audio' },
  image: { icon: ImageIcon, color: 'var(--accent-purple)', label: 'Imagen' },
  other: { icon: FileIcon, color: 'var(--text-muted)', label: 'Otro' }
};

export const MaterialUploader: React.FC<MaterialUploaderProps> = ({
  topicId,
  topicLabel,
  compact = false
}) => {
  const [files, setFiles] = useState<StoredFileMeta[]>([]);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<{ count: number; bytes: number; quota?: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    const [list, use] = await Promise.all([listFiles(topicId), getUsage()]);
    setFiles(list);
    setUsage(use);
  }, [topicId]);

  useEffect(() => { refresh(); }, [refresh]);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setBusy(true);
    setError(null);
    const problems: string[] = [];

    for (const file of Array.from(fileList)) {
      try {
        await saveFile(file, detectKind(file), topicId);
      } catch (e) {
        problems.push(e instanceof Error ? e.message : String(e));
      }
    }

    if (problems.length) setError(problems.join(' · '));
    await refresh();
    setBusy(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handlePreview = async (f: StoredFileMeta) => {
    const url = await getFileUrl(f.id);
    if (!url) { setError('El fichero ya no está disponible.'); return; }
    window.open(url, '_blank', 'noopener');
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const handleDelete = async (f: StoredFileMeta) => {
    if (!window.confirm(`¿Eliminar "${f.name}" definitivamente?`)) return;
    await deleteFile(f.id);
    await refresh();
  };

  return (
    <div className="uploader-root">
      {/* Drop zone */}
      <div
        className={`uploader-drop ${dragging ? 'is-dragging' : ''} ${busy ? 'is-busy' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        style={compact ? { padding: '1.1rem 1rem' } : undefined}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg,.svg,.mp3,.m4a,.wav,.zip"
          style={{ display: 'none' }}
          onChange={e => { handleFiles(e.target.files); e.target.value = ''; }}
        />

        <div className="uploader-drop-icon">
          <UploadCloud size={compact ? 24 : 32} strokeWidth={1.6} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <strong style={{ fontSize: compact ? '0.88rem' : '0.98rem', color: 'var(--text-title)', display: 'block' }}>
            {busy ? 'Guardando…' : 'Arrastra los materiales aquí'}
          </strong>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            o haz clic para seleccionarlos
            {topicLabel && <> · se asocian a <strong style={{ color: 'var(--teal-ink)' }}>{topicLabel}</strong></>}
          </span>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4, opacity: 0.85 }}>
            PDF · PPTX · DOCX · imágenes · audio — hasta 40 MB por fichero
          </div>
        </div>
      </div>

      {error && (
        <div className="uploader-error">
          <AlertCircle size={15} strokeWidth={2} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="uploader-list">
          {files.map(f => {
            const meta = KIND_META[f.kind] ?? KIND_META.other;
            const Icon = meta.icon;
            return (
              <div key={f.id} className="uploader-item">
                <div className="uploader-item-icon" style={{ color: meta.color }}>
                  <Icon size={17} />
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="uploader-item-name" title={f.name}>{f.name}</div>
                  <div className="uploader-item-meta">
                    <span className="qfdos-badge" style={{
                      fontSize: '0.62rem', padding: '1px 6px',
                      background: 'var(--surface-alt)', color: meta.color,
                      border: `1px solid ${meta.color}33`
                    }}>
                      {meta.label}
                    </span>
                    <span>{formatBytes(f.size)}</span>
                    <span>{new Date(f.uploadedAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
                  </div>
                </div>

                <div className="uploader-item-actions">
                  <button onClick={() => handlePreview(f)} title="Abrir" className="icon-btn">
                    <Eye size={15} />
                  </button>
                  <button onClick={() => downloadStoredFile(f.id, f.name)} title="Descargar" className="icon-btn">
                    <Download size={15} />
                  </button>
                  <button onClick={() => handleDelete(f)} title="Eliminar" className="icon-btn icon-btn-danger">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Storage footer */}
      {usage && (
        <div className="uploader-footer">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <HardDrive size={13} />
            {usage.count} fichero{usage.count === 1 ? '' : 's'} · {formatBytes(usage.bytes)}
            {usage.quota ? ` de ~${formatBytes(usage.quota)} disponibles` : ''}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, opacity: 0.9 }}>
            <Link2 size={13} />
            Para que el alumnado los vea, enlaza además la copia en Drive
          </span>
        </div>
      )}
    </div>
  );
};
