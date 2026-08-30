import React, { useEffect, useState } from 'react';
import { Inbox, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { misEntregas, EntregaPropia, publicacionDisponible } from '../services/contenidoRemoto';

/** Etiquetas legibles para las claves que llegan de la hoja. */
const ETIQUETAS: Record<string, string> = {
  grupo: 'Grupo', puesto: 'Puesto',
  alumno1: 'Alumno 1', alumno2: 'Alumno 2',
  etapa1Rendimiento: 'Rendimiento etapa 1',
  etapa2RendGlobal: 'Rendimiento global',
  etapa3Compuesto: 'Compuesto', etapa3Rendimiento: 'Rendimiento etapa 3',
  materialFaltante: 'Material que falta',
  normasAceptadas: 'Normas aceptadas',
  recibidoEn: 'Recibido'
};

const OCULTAR = ['email1', 'email2', 'cuentaDeEnvio', 'email', 'iniciales'];

/**
 * Lo que esta persona ha entregado, leído de la hoja del profesor.
 *
 * Se consulta por su correo, así que cada cual ve lo suyo. Es la contrapartida
 * necesaria a que las entregas salgan del navegador: sin esto, el alumnado
 * envía y se queda sin ninguna prueba de haberlo hecho.
 */
export const MisEntregas: React.FC = () => {
  const { user } = useAuth();
  const [entregas, setEntregas] = useState<EntregaPropia[] | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = async () => {
    if (!user?.email) return;
    setCargando(true);
    setError(null);
    const r = await misEntregas(user.email);
    if (r === null) {
      setError('No se ha podido consultar el registro de entregas ahora mismo.');
      setEntregas(null);
    } else {
      setEntregas(r);
    }
    setCargando(false);
  };

  useEffect(() => { cargar(); /* eslint-disable-next-line */ }, [user?.email]);

  if (!publicacionDisponible()) return null;

  return (
    <div className="mis-entregas">
      <div className="mis-entregas-cabecera">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Inbox size={17} color="var(--teal-ink)" />
          <strong>Mis entregas</strong>
          {entregas && (
            <span className="qfdos-badge badge-teal" style={{ fontSize: '0.65rem' }}>
              {entregas.length}
            </span>
          )}
        </div>
        <button onClick={cargar} className="btn btn-sm btn-outline" disabled={cargando}>
          <RefreshCw size={13} className={cargando ? 'spin' : undefined} /> Actualizar
        </button>
      </div>

      <p className="mis-entregas-sub">
        Registrado a nombre de <code>{user?.email}</code>
      </p>

      {cargando && (
        <div className="mis-entregas-estado">
          <Loader2 size={16} className="spin" /> Consultando el registro…
        </div>
      )}

      {!cargando && error && (
        <div className="entrega-aviso entrega-aviso--warn">
          <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{error}</span>
        </div>
      )}

      {!cargando && !error && entregas?.length === 0 && (
        <div className="mis-entregas-estado">
          Todavía no consta ninguna entrega con este correo. Si acabas de enviar
          algo, pulsa «Actualizar»: la hoja tarda unos segundos en reflejarlo.
        </div>
      )}

      {!cargando && !error && !!entregas?.length && (
        <ul className="mis-entregas-lista">
          {entregas.map(e => {
            const campos = Object.entries(e.datos)
              .filter(([k, v]) => v && !OCULTAR.includes(k))
              .slice(0, 7);

            return (
              <li key={`${e.hoja}-${e.fila}`} className="mis-entregas-item">
                <div className="mis-entregas-item-cabecera">
                  <CheckCircle2 size={15} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
                  <strong>{e.hoja}</strong>
                  {e.datos.recibidoEn && (
                    <span className="mis-entregas-fecha tabular">
                      {new Date(e.datos.recibidoEn).toLocaleString('es-ES')}
                    </span>
                  )}
                </div>
                <dl className="mis-entregas-campos">
                  {campos.map(([k, v]) => (
                    <React.Fragment key={k}>
                      <dt>{ETIQUETAS[k] ?? k}</dt>
                      <dd>{v.length > 90 ? `${v.slice(0, 90)}…` : v}</dd>
                    </React.Fragment>
                  ))}
                </dl>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
