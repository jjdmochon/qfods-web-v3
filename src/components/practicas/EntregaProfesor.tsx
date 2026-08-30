import React, { useState } from 'react';
import { Mail, Download, Copy, Check, AlertCircle, Send, Info } from 'lucide-react';
import {
  enviarAHoja, enviarPorCorreo, descargarInforme, copiarInforme,
  envioConfigurado, PROFESOR_EMAIL, EstadoEnvio
} from '../../services/entregaPracticas';

interface EntregaProfesorProps {
  /** Hoja de destino en el libro de cálculo del profesor */
  hoja: string;
  /** Asunto del correo y encabezado del informe */
  titulo: string;
  /** Datos a entregar, ya formateados como texto */
  datos: Record<string, string>;
  /** Nombre base del fichero descargable */
  nombreFichero: string;
  /** Deshabilita la entrega mientras falten datos */
  deshabilitado?: boolean;
  motivoDeshabilitado?: string;
  onEnviado?: () => void;
}

/**
 * Entrega los datos al profesor por tres vías, porque ninguna es infalible:
 * el envío automático a la hoja de cálculo, el correo (que sí deja constancia
 * en la bandeja del alumno) y la descarga del informe.
 */
export const EntregaProfesor: React.FC<EntregaProfesorProps> = ({
  hoja,
  titulo,
  datos,
  nombreFichero,
  deshabilitado = false,
  motivoDeshabilitado,
  onEnviado
}) => {
  const [enviando, setEnviando] = useState(false);
  const [estado, setEstado] = useState<EstadoEnvio | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [copiado, setCopiado] = useState(false);

  const configurado = envioConfigurado();

  const handleEnviar = async () => {
    if (deshabilitado) return;
    setEnviando(true);
    const r = await enviarAHoja(hoja, datos);
    setEstado(r.estado);
    setMensaje(r.mensaje);
    setEnviando(false);
    if (r.estado === 'confirmado' || r.estado === 'enviado-sin-confirmar') onEnviado?.();
  };

  const handleCopiar = async () => {
    const ok = await copiarInforme(titulo, datos);
    setCopiado(ok);
    if (ok) setTimeout(() => setCopiado(false), 2200);
  };

  return (
    <div className="entrega-box">
      <div className="entrega-head">
        <Send size={15} color="var(--teal-ink)" />
        <strong>Enviar al profesor</strong>
      </div>

      {!configurado && (
        <div className="entrega-aviso entrega-aviso--info">
          <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>
            El envío automático a la hoja de cálculo aún no está activado. Usa{' '}
            <strong>Enviar por correo</strong>: se abre tu cliente de correo con el informe
            ya redactado para <code>{PROFESOR_EMAIL}</code>, y te queda copia en Enviados.
          </span>
        </div>
      )}

      {deshabilitado && motivoDeshabilitado && (
        <div className="entrega-aviso entrega-aviso--warn">
          <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{motivoDeshabilitado}</span>
        </div>
      )}

      <div className="entrega-acciones">
        <button
          onClick={() => enviarPorCorreo(titulo, titulo, datos)}
          className="btn btn-sm btn-primary"
          disabled={deshabilitado}
        >
          <Mail size={14} /> Enviar por correo
        </button>

        {configurado && (
          <button
            onClick={handleEnviar}
            className="btn btn-sm btn-secondary"
            disabled={deshabilitado || enviando}
          >
            <Send size={14} /> {enviando ? 'Enviando…' : 'Enviar a la hoja'}
          </button>
        )}

        <button
          onClick={() => descargarInforme(nombreFichero, titulo, datos)}
          className="btn btn-sm btn-outline"
          disabled={deshabilitado}
        >
          <Download size={14} /> Descargar
        </button>

        <button
          onClick={handleCopiar}
          className="btn btn-sm btn-outline"
          disabled={deshabilitado}
        >
          {copiado ? <><Check size={14} /> Copiado</> : <><Copy size={14} /> Copiar</>}
        </button>
      </div>

      {estado && (
        <div
          className={`entrega-aviso ${
            estado === 'confirmado' ? 'entrega-aviso--ok'
              : estado === 'enviado-sin-confirmar' ? 'entrega-aviso--warn'
              : 'entrega-aviso--warn'
          }`}
        >
          {estado === 'confirmado'
            ? <Check size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            : <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />}
          <span>{mensaje}</span>
        </div>
      )}
    </div>
  );
};
