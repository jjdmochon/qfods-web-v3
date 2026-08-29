import React, { useState } from 'react';
import { Globe, Check, AlertCircle, KeyRound, Loader2 } from 'lucide-react';
import {
  publicarContenido, getClavePublicacion, setClavePublicacion,
  publicacionDisponible, ContenidoCurso
} from '../services/contenidoRemoto';

interface PublicarContenidoProps {
  contenido: ContenidoCurso;
  /** Fecha ISO de la última publicación conocida */
  publicadoEn?: string;
  onPublicado?: (cuando: string) => void;
}

/**
 * Publica el contenido del curso para que lo vea todo el mundo.
 *
 * Lo que el profesor edita en el CMS vive en su navegador hasta que pulsa
 * aquí. Esta separación es intencionada: permite preparar un tema entero sin
 * que el alumnado vea los cambios a medio hacer.
 */
export const PublicarContenido: React.FC<PublicarContenidoProps> = ({
  contenido,
  publicadoEn,
  onPublicado
}) => {
  const [clave, setClave] = useState(getClavePublicacion());
  const [publicando, setPublicando] = useState(false);
  const [resultado, setResultado] = useState<{ ok: boolean; mensaje: string } | null>(null);

  const disponible = publicacionDisponible();

  const handlePublicar = async () => {
    setPublicando(true);
    setResultado(null);

    const r = await publicarContenido(contenido, clave);
    setResultado(r);
    setPublicando(false);

    if (r.ok) {
      setClavePublicacion(clave);            // se recuerda para la próxima vez
      onPublicado?.(new Date().toISOString());
    }
  };

  const resumen = [
    `${contenido.topics?.length ?? 0} módulos`,
    `${contenido.announcements?.length ?? 0} avisos`,
    `${contenido.glossary?.length ?? 0} términos`,
    `${contenido.resourceLinks?.length ?? 0} enlaces`
  ].join(' · ');

  if (!disponible) {
    return (
      <div className="publicar-box">
        <div className="entrega-aviso entrega-aviso--info">
          <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>
            Para publicar los cambios hace falta el Apps Script configurado
            (<code>VITE_PRACTICAS_WEBAPP_URL</code> en <code>.env.local</code>).
            Mientras tanto, lo que edites se queda sólo en este navegador.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="publicar-box">
      <div className="publicar-cabecera">
        <Globe size={17} color="var(--teal)" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <strong>Publicar para todo el curso</strong>
          <p>
            Tus cambios están sólo en este navegador. Al publicar, el alumnado los
            verá al recargar la página, entren desde donde entren.
          </p>
        </div>
      </div>

      <div className="publicar-resumen">
        <span className="eyebrow">Se publicará</span>
        <span className="tabular">{resumen}</span>
        {publicadoEn && (
          <span className="publicar-fecha">
            Última publicación: {new Date(publicadoEn).toLocaleString('es-ES')}
          </span>
        )}
      </div>

      <div className="publicar-clave">
        <label htmlFor="clave-publicacion" className="eyebrow">
          Clave de publicación
        </label>
        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          <KeyRound size={15} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          <input
            id="clave-publicacion"
            type="password"
            value={clave}
            onChange={e => setClave(e.target.value)}
            placeholder="La que pusiste en el Apps Script"
            className="form-input"
            style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}
            autoComplete="off"
          />
        </div>
        <p className="calc-nota" style={{ marginTop: 4 }}>
          Se guarda en este navegador, no en el código de la web. Sin ella, cualquiera
          podría reescribir el temario de todos.
        </p>
      </div>

      <button
        onClick={handlePublicar}
        disabled={publicando || !clave.trim()}
        className="btn btn-primary"
        style={{ alignSelf: 'flex-start', fontWeight: 700 }}
      >
        {publicando
          ? <><Loader2 size={15} className="spin" /> Publicando…</>
          : <><Globe size={15} /> Publicar cambios</>}
      </button>

      {resultado && (
        <div className={`entrega-aviso ${resultado.ok ? 'entrega-aviso--ok' : 'entrega-aviso--warn'}`}>
          {resultado.ok
            ? <Check size={15} style={{ flexShrink: 0, marginTop: 1 }} />
            : <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />}
          <span>{resultado.mensaje}</span>
        </div>
      )}
    </div>
  );
};
