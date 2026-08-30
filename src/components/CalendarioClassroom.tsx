import React, { useState } from 'react';
import { CalendarDays, ExternalLink, Rss, Check, Copy } from 'lucide-react';

/** Calendario de Google Classroom del grupo. Es público: no exige iniciar sesión. */
const CALENDAR_ID = 'c_classroom8185cf25@group.calendar.google.com';
const CAL_ENC = encodeURIComponent(CALENDAR_ID);

const URL_EMBED = (modo: 'MONTH' | 'AGENDA') =>
  `https://calendar.google.com/calendar/embed?src=${CAL_ENC}` +
  `&ctz=Europe%2FMadrid&mode=${modo}` +
  `&showTitle=0&showPrint=0&showTz=0&showCalendars=0&wkst=2`;

/** Abrirlo en Google Calendar para añadirlo a la cuenta propia. */
const URL_ANADIR = `https://calendar.google.com/calendar/u/0/r?cid=${CAL_ENC}`;

/**
 * Suscripción por feed: a diferencia de descargar un .ics, aquí los cambios
 * que haga el profesor llegan solos. Es la vía que conviene recomendar.
 */
const URL_SUSCRIPCION = `https://calendar.google.com/calendar/ical/${CAL_ENC}/public/basic.ics`;
const URL_WEBCAL = URL_SUSCRIPCION.replace('https://', 'webcal://');

/**
 * Incrusta el calendario de Classroom del grupo.
 *
 * Convive con el calendario académico de la plataforma sin sustituirlo: aquel
 * recoge las fechas oficiales del curso; este, lo que se publica día a día en
 * Classroom (tareas, avisos, cambios de aula).
 */
export const CalendarioClassroom: React.FC = () => {
  const [modo, setModo] = useState<'MONTH' | 'AGENDA'>('MONTH');
  const [copiado, setCopiado] = useState(false);

  const copiarFeed = async () => {
    try {
      await navigator.clipboard.writeText(URL_SUSCRIPCION);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2200);
    } catch {
      /* el portapapeles puede estar bloqueado; queda el enlace visible */
    }
  };

  return (
    <div className="qfdos-card" style={{ padding: '1.25rem' }}>
      <div className="classroom-cal-cabecera">
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-title)', margin: 0 }}>
            <CalendarDays size={17} style={{ verticalAlign: -3, marginRight: 6, color: 'var(--teal)' }} />
            Calendario del grupo en Classroom
          </h3>
          <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', margin: '3px 0 0', maxWidth: '68ch', lineHeight: 1.55 }}>
            Lo que se publica en Google Classroom: tareas, entregas y avisos del día a día.
            Las fechas oficiales del curso —exámenes, festivos, actas— están más abajo, en el
            calendario académico.
          </p>
        </div>

        <div className="classroom-cal-modos">
          <button
            onClick={() => setModo('MONTH')}
            className={`btn btn-sm ${modo === 'MONTH' ? 'btn-primary' : 'btn-outline'}`}
          >
            Mes
          </button>
          <button
            onClick={() => setModo('AGENDA')}
            className={`btn btn-sm ${modo === 'AGENDA' ? 'btn-primary' : 'btn-outline'}`}
          >
            Agenda
          </button>
        </div>
      </div>

      {/* El iframe se adapta al ancho disponible: el tamaño fijo que da Google
          (800×600) desbordaría en móvil. */}
      <div className={`classroom-cal-marco ${modo === 'AGENDA' ? 'is-agenda' : ''}`}>
        <iframe
          key={modo}
          src={URL_EMBED(modo)}
          title="Calendario 2627 QFDOS Grupo E"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="classroom-cal-acciones">
        <a
          href={URL_WEBCAL}
          className="btn btn-sm btn-primary"
          style={{ fontWeight: 700 }}
          title="Se añade a tu calendario y se actualiza solo"
        >
          <Rss size={14} /> Suscribirme
        </a>

        <a
          href={URL_ANADIR}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-outline"
        >
          <ExternalLink size={14} /> Abrir en Google Calendar
        </a>

        <button onClick={copiarFeed} className="btn btn-sm btn-outline">
          {copiado ? <><Check size={14} /> Enlace copiado</> : <><Copy size={14} /> Copiar enlace del feed</>}
        </button>
      </div>

      <p className="calc-nota" style={{ marginTop: 8 }}>
        <strong>Suscribirse no es lo mismo que descargar.</strong> Al suscribirte, los cambios
        que haga el profesor aparecen solos en tu calendario. Si en cambio descargas el fichero
        .ics del calendario académico, se copia una foto fija de las fechas de hoy.
        En iPhone y Android el botón funciona directamente; en un ordenador, si no se abre nada,
        copia el enlace del feed y pégalo en «Otros calendarios → Suscribirse a un calendario».
      </p>
    </div>
  );
};
