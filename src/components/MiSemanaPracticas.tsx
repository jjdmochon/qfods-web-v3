import React, { useMemo, useState } from 'react';
import { CalendarPlus, FlaskConical, Info } from 'lucide-react';
import { TEMPORIZACION } from '../data/practicasData';
import { descargarSemanaPracticas } from '../services/calendarioIcs';

const CLAVE = 'qfdos_v3_semana_practicas';

/**
 * Lunes de cada semana en la que caben las cinco sesiones completas.
 *
 * Se exige que el VIERNES siga dentro del periodo lectivo: la semana del 21 de
 * diciembre empieza en plazo pero su viernes es Navidad, así que no sirve.
 */
function lunesDelSemestre(): string[] {
  const lunes: string[] = [];
  const d = new Date('2026-09-14T12:00:00Z');          // primer lunes de docencia
  const finDocencia = new Date('2026-12-22T12:00:00Z');
  while (true) {
    const viernes = new Date(d);
    viernes.setUTCDate(viernes.getUTCDate() + 4);
    if (viernes > finDocencia) break;
    lunes.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 7);
  }
  return lunes;
}

function etiquetaSemana(isoLunes: string): string {
  const l = new Date(`${isoLunes}T12:00:00Z`);
  const v = new Date(l); v.setUTCDate(v.getUTCDate() + 4);
  const f = (d: Date) =>
    d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', timeZone: 'UTC' });
  return `${f(l)} – ${f(v)} de ${l.getUTCFullYear()}`;
}

/**
 * Cada estudiante hace las prácticas en una semana distinta, asignada de
 * antemano. En vez de un calendario común que no le sirve a nadie en concreto,
 * aquí elige la suya y se lleva sus cinco sesiones con el guion de cada día.
 */
export const MiSemanaPracticas: React.FC = () => {
  const semanas = useMemo(lunesDelSemestre, []);
  const [semana, setSemana] = useState<string>(() => localStorage.getItem(CLAVE) ?? '');

  // Las semanas con festivo entre semana llevan aviso: la sesión se recupera
  const festivosLectivos: Record<string, string> = {
    '2026-10-12': 'Fiesta Nacional (lunes 12 de octubre)',
    '2026-12-07': 'Festivo (lunes 7 de diciembre)',
    '2026-12-08': 'Inmaculada (martes 8 de diciembre)',
    '2026-12-09': 'No lectivo en Farmacia (miércoles 9 de diciembre)'
  };

  const avisoFestivo = useMemo(() => {
    if (!semana) return null;
    const l = new Date(`${semana}T12:00:00Z`);
    for (let i = 0; i < 5; i++) {
      const d = new Date(l); d.setUTCDate(d.getUTCDate() + i);
      const iso = d.toISOString().slice(0, 10);
      if (festivosLectivos[iso]) return festivosLectivos[iso];
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semana]);

  const guardar = (valor: string) => {
    setSemana(valor);
    if (valor) localStorage.setItem(CLAVE, valor);
    else localStorage.removeItem(CLAVE);
  };

  return (
    <div className="semana-practicas">
      <div className="semana-practicas-cabecera">
        <FlaskConical size={17} color="var(--teal-ink)" />
        <div>
          <strong>Mi semana de prácticas</strong>
          <p>
            El laboratorio se reparte por semanas a lo largo de todo el semestre.
            Elige la que tienes asignada y llévate las cinco sesiones a tu calendario,
            cada una con lo que toca hacer ese día.
          </p>
        </div>
      </div>

      <div className="semana-practicas-control">
        <label htmlFor="semana-practicas" className="eyebrow">Semana asignada</label>
        <select
          id="semana-practicas"
          value={semana}
          onChange={e => guardar(e.target.value)}
          className="form-select"
        >
          <option value="">Selecciona tu semana…</option>
          {semanas.map((l, i) => (
            <option key={l} value={l}>
              Semana {i + 1} · {etiquetaSemana(l)}
            </option>
          ))}
        </select>
      </div>

      {avisoFestivo && (
        <div className="entrega-aviso entrega-aviso--warn">
          <Info size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>
            Esa semana tiene un día no lectivo: <strong>{avisoFestivo}</strong>.
            Confirma con el profesor cómo se recupera esa sesión antes de guiarte por
            estas fechas.
          </span>
        </div>
      )}

      {semana && (
        <>
          <ol className="semana-practicas-dias">
            {TEMPORIZACION.map((d, i) => {
              const fecha = new Date(`${semana}T12:00:00Z`);
              fecha.setUTCDate(fecha.getUTCDate() + i);
              return (
                <li key={d.dia}>
                  <div className="semana-dia-cabecera">
                    <strong>{d.dia}</strong>
                    <span className="tabular">
                      {fecha.toLocaleDateString('es-ES', {
                        weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC'
                      })}
                    </span>
                  </div>
                  <ul>
                    {d.tareas.map(t => <li key={t}>{t}</li>)}
                  </ul>
                </li>
              );
            })}
          </ol>

          <button
            onClick={() => descargarSemanaPracticas(semana)}
            className="btn btn-primary"
            style={{ alignSelf: 'flex-start', fontWeight: 700 }}
          >
            <CalendarPlus size={15} /> Añadir mi semana al calendario
          </button>
          <p className="calc-nota">
            Cinco eventos, uno por sesión, con el guion del día y aviso la tarde anterior.
            La hora exacta la confirma el profesor: se marcan como jornada de laboratorio.
          </p>
        </>
      )}
    </div>
  );
};
