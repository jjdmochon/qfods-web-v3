// ==========================================================================
// Exportación del calendario académico a formato iCalendar (.ics)
//
// El calendario de la plataforma se consulta, pero no avisa. Exportándolo a
// Google Calendar, Outlook o el móvil, las fechas entran donde el alumnado y
// el profesorado ya miran cada día, con sus recordatorios.
// ==========================================================================

import { AcademicCalendarEvent } from '../data/courseInfoData';

/** Escapa los caracteres que en iCalendar tienen significado propio. */
function escapar(texto: string): string {
  return texto
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/** YYYY-MM-DD → YYYYMMDD */
function aFecha(iso: string): string {
  return iso.replace(/-/g, '');
}

/**
 * En iCalendar, DTEND de un evento de día completo es EXCLUSIVO: para que el
 * último día se vea, hay que apuntar al día siguiente.
 */
function diaSiguiente(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return aFecha(d.toISOString().slice(0, 10));
}

/** Las líneas de más de 75 octetos deben plegarse con un espacio inicial. */
function plegar(linea: string): string {
  if (linea.length <= 74) return linea;
  const trozos: string[] = [linea.slice(0, 74)];
  let resto = linea.slice(74);
  while (resto.length > 73) {
    trozos.push(' ' + resto.slice(0, 73));
    resto = resto.slice(73);
  }
  if (resto) trozos.push(' ' + resto);
  return trozos.join('\r\n');
}

const NOMBRE_CATEGORIA: Record<string, string> = {
  docencia: 'Docencia',
  festivo: 'Festivo',
  examen: 'Examen',
  practicas: 'Prácticas',
  acta: 'Actas y plazos',
  sin_docencia: 'Sin docencia'
};

export function generarIcs(
  eventos: AcademicCalendarEvent[],
  nombreCalendario = 'QFDOS · Química Farmacéutica II 2026/2027'
): string {
  const ahora = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const lineas: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//UGR//QFDOS 2627//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapar(nombreCalendario)}`,
    'X-WR-TIMEZONE:Europe/Madrid'
  ];

  eventos.forEach(ev => {
    const categoria = NOMBRE_CATEGORIA[ev.category] ?? ev.category;
    const descripcion = [
      ev.description,
      '',
      `Categoría: ${categoria}`,
      ev.semester ? `Semestre: ${ev.semester === 'anual' ? 'Anual' : ev.semester + '.º'}` : '',
      'Química Farmacéutica II · Grupo E · Universidad de Granada'
    ].filter(Boolean).join('\n');

    lineas.push(
      'BEGIN:VEVENT',
      `UID:${ev.id}@qfdos.ugr.es`,
      `DTSTAMP:${ahora}`,
      `DTSTART;VALUE=DATE:${aFecha(ev.date)}`,
      `DTEND;VALUE=DATE:${diaSiguiente(ev.endDate ?? ev.date)}`,
      plegar(`SUMMARY:${escapar(ev.title)}`),
      plegar(`DESCRIPTION:${escapar(descripcion)}`),
      `CATEGORIES:${escapar(categoria)}`,
      'TRANSP:TRANSPARENT'
    );

    // Sólo lo señalado como clave avisa: un recordatorio por cada festivo
    // acabaría en que se desactivan todos.
    if (ev.important) {
      lineas.push(
        'BEGIN:VALARM',
        'TRIGGER:-P2D',
        'ACTION:DISPLAY',
        plegar(`DESCRIPTION:${escapar(ev.title)}`),
        'END:VALARM'
      );
    }

    lineas.push('END:VEVENT');
  });

  lineas.push('END:VCALENDAR');
  return lineas.join('\r\n');
}

/** Descarga el calendario como fichero .ics. */
export function descargarIcs(eventos: AcademicCalendarEvent[], nombreFichero = 'qfdos-2627-calendario.ics'): void {
  const blob = new Blob([generarIcs(eventos)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreFichero;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
