// ==========================================================================
// Exportación del calendario académico a formato iCalendar (.ics)
//
// El calendario de la plataforma se consulta, pero no avisa. Exportándolo a
// Google Calendar, Outlook o el móvil, las fechas entran donde el alumnado y
// el profesorado ya miran cada día, con sus recordatorios.
//
// Hay tres clases de entrada, y no se tratan igual:
//   · Clases      — serie semanal con hora, aula y excepciones en los festivos
//   · Exámenes    — hora concreta y aviso con antelación
//   · Resto       — día completo (festivos, plazos, periodos)
// ==========================================================================

import { AcademicCalendarEvent, COURSE_GENERAL_INFO } from '../data/courseInfoData';

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

// ==========================================================================
// Horas de examen
// ==========================================================================

/** Extrae "16:00" de textos como "16:00 h" u "Horario de docencia (17:00 h)". */
function horaDe(texto: string): string | null {
  const m = texto.match(/(\d{1,2})[:.](\d{2})/);
  return m ? `${m[1].padStart(2, '0')}${m[2]}` : null;
}

/**
 * Empareja cada evento de examen del calendario con su hora oficial.
 * Sin esto, un examen que empieza a las 11:30 aparecería como día completo y
 * el alumno tendría que ir a buscar la hora a otra pantalla.
 */
function horaDelExamen(ev: AcademicCalendarEvent): { inicio: string; fin: string } | null {
  if (ev.category !== 'examen' || ev.endDate) return null;   // los periodos no llevan hora

  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const [a, m, d] = ev.date.split('-');
  const enTexto = `${parseInt(d, 10)} de ${meses[parseInt(m, 10) - 1]} de ${a}`;

  const oficial = COURSE_GENERAL_INFO.examSchedule.find(e => e.fecha === enTexto);
  if (!oficial) return null;

  const inicio = horaDe(oficial.hora);
  if (!inicio) return null;

  // Duración típica de un examen de la asignatura
  const h = parseInt(inicio.slice(0, 2), 10) + 2;
  return { inicio, fin: `${String(h).padStart(2, '0')}${inicio.slice(2)}` };
}

// ==========================================================================
// Clases
// ==========================================================================

const DIA_A_ICS: Record<string, string> = {
  lunes: 'MO', martes: 'TU', miércoles: 'WE', miercoles: 'WE',
  jueves: 'TH', viernes: 'FR'
};

/**
 * Genera la serie semanal de clases.
 *
 * Se emite como UNA regla de repetición y no como decenas de eventos sueltos:
 * así el calendario del alumno queda limpio y, si cambia el aula, basta con
 * volver a importar. Los días festivos y los periodos sin docencia se excluyen
 * con EXDATE, para que no aparezca clase el 12 de octubre ni en Navidad.
 */
function bloqueDeClases(eventos: AcademicCalendarEvent[]): string[] {
  const { classSchedule, subject } = COURSE_GENERAL_INFO;
  const sesiones = classSchedule.sessions ?? [];
  if (!sesiones.length) return [];

  const inicioDocencia = eventos.find(e => /Inicio del Primer Semestre/i.test(e.title))?.date;
  const finDocencia = eventos.find(e => /Fin de clases del Primer Semestre/i.test(e.title))?.date;
  if (!inicioDocencia || !finDocencia) return [];

  // Días en los que no hay clase aunque caigan en lunes, martes o jueves
  const sinClase = new Set<string>();
  eventos
    .filter(e => e.category === 'festivo' || e.category === 'sin_docencia')
    .forEach(e => {
      const desde = new Date(`${e.date}T12:00:00Z`);
      const hasta = new Date(`${e.endDate ?? e.date}T12:00:00Z`);
      for (let d = desde; d <= hasta; d.setUTCDate(d.getUTCDate() + 1)) {
        sinClase.add(d.toISOString().slice(0, 10));
      }
    });

  const lineas: string[] = [];

  sesiones.forEach((s, i) => {
    const dia = DIA_A_ICS[s.day.toLowerCase()];
    if (!dia) return;

    const horas = s.time.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
    if (!horas) return;
    const [, h1, m1, h2, m2] = horas;

    // Primera sesión: el primer día de la semana correspondiente desde el inicio
    const objetivo = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].indexOf(dia);
    const primera = new Date(`${inicioDocencia}T12:00:00Z`);
    while (primera.getUTCDay() !== objetivo) primera.setUTCDate(primera.getUTCDate() + 1);
    const primeraIso = primera.toISOString().slice(0, 10);

    // Excepciones que caen justo en este día de la semana
    const excepciones: string[] = [];
    [...sinClase].sort().forEach(iso => {
      const d = new Date(`${iso}T12:00:00Z`);
      if (d.getUTCDay() === objetivo && iso >= primeraIso && iso <= finDocencia) {
        excepciones.push(`${aFecha(iso)}T${h1.padStart(2, '0')}${m1}00`);
      }
    });

    lineas.push(
      'BEGIN:VEVENT',
      `UID:qfdos-clase-${dia.toLowerCase()}@qfdos.ugr.es`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART;TZID=Europe/Madrid:${aFecha(primeraIso)}T${h1.padStart(2, '0')}${m1}00`,
      `DTEND;TZID=Europe/Madrid:${aFecha(primeraIso)}T${h2.padStart(2, '0')}${m2}00`,
      `RRULE:FREQ=WEEKLY;BYDAY=${dia};UNTIL=${aFecha(finDocencia)}T235959Z`,
      ...(excepciones.length
        ? [plegar(`EXDATE;TZID=Europe/Madrid:${excepciones.join(',')}`)]
        : []),
      plegar(`SUMMARY:${escapar(`${subject.name} (${s.code ?? 'QF2'})`)}`),
      plegar(`LOCATION:${escapar(`${s.room}, Facultad de Farmacia, Universidad de Granada, Campus de Cartuja, Granada`)}`),
      plegar(`DESCRIPTION:${escapar(
        `Clase de teoría de ${subject.name}.\n` +
        `${s.subject}\n` +
        `Aula: ${s.room} · ${s.day} de ${s.time}\n\n` +
        `No hay clase los días festivos ni en los periodos sin docencia: ya están descontados de esta serie.`
      )}`),
      'CATEGORIES:Docencia',
      'TRANSP:OPAQUE',
      'BEGIN:VALARM',
      'TRIGGER:-PT30M',
      'ACTION:DISPLAY',
      plegar(`DESCRIPTION:${escapar(`${subject.name} · ${s.room}`)}`),
      'END:VALARM',
      'END:VEVENT'
    );
    void i;
  });

  return lineas;
}

// ==========================================================================

export function generarIcs(
  eventos: AcademicCalendarEvent[],
  nombreCalendario = 'QFDOS · Química Farmacéutica II 2026/2027',
  incluirClases = true
): string {
  const ahora = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const lineas: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//UGR//QFDOS 2627//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapar(nombreCalendario)}`,
    'X-WR-TIMEZONE:Europe/Madrid',

    // Sin esta definición, los eventos con hora se desplazarían en clientes
    // que no asuman la zona horaria de España.
    'BEGIN:VTIMEZONE',
    'TZID:Europe/Madrid',
    'BEGIN:DAYLIGHT',
    'TZOFFSETFROM:+0100',
    'TZOFFSETTO:+0200',
    'TZNAME:CEST',
    'DTSTART:19700329T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
    'END:DAYLIGHT',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:+0200',
    'TZOFFSETTO:+0100',
    'TZNAME:CET',
    'DTSTART:19701025T030000',
    'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
    'END:STANDARD',
    'END:VTIMEZONE'
  ];

  if (incluirClases) lineas.push(...bloqueDeClases(eventos));

  eventos.forEach(ev => {
    const categoria = NOMBRE_CATEGORIA[ev.category] ?? ev.category;
    const hora = horaDelExamen(ev);

    const descripcion = [
      ev.description,
      hora ? `\nHora oficial de comienzo: ${hora.inicio.slice(0, 2)}:${hora.inicio.slice(2)} h` : '',
      '',
      `Categoría: ${categoria}`,
      ev.semester ? `Semestre: ${ev.semester === 'anual' ? 'Anual' : ev.semester + '.º'}` : '',
      'Química Farmacéutica II · Grupo E · Universidad de Granada'
    ].filter(Boolean).join('\n');

    lineas.push(
      'BEGIN:VEVENT',
      `UID:${ev.id}@qfdos.ugr.es`,
      `DTSTAMP:${ahora}`
    );

    if (hora) {
      // Examen con hora conocida: entra en la agenda como cita, no como aviso
      lineas.push(
        `DTSTART;TZID=Europe/Madrid:${aFecha(ev.date)}T${hora.inicio}00`,
        `DTEND;TZID=Europe/Madrid:${aFecha(ev.date)}T${hora.fin}00`,
        'TRANSP:OPAQUE'
      );
    } else {
      lineas.push(
        `DTSTART;VALUE=DATE:${aFecha(ev.date)}`,
        `DTEND;VALUE=DATE:${diaSiguiente(ev.endDate ?? ev.date)}`,
        'TRANSP:TRANSPARENT'
      );
    }

    lineas.push(
      plegar(`SUMMARY:${escapar(ev.title)}`),
      plegar(`DESCRIPTION:${escapar(descripcion)}`),
      `CATEGORIES:${escapar(categoria)}`
    );

    if (hora) {
      lineas.push(plegar(`LOCATION:${escapar('Facultad de Farmacia, Universidad de Granada, Campus de Cartuja, Granada')}`));
    }

    // Sólo lo señalado como clave avisa: un recordatorio por cada festivo
    // acabaría en que se desactivan todos.
    if (ev.important || hora) {
      lineas.push(
        'BEGIN:VALARM',
        hora ? 'TRIGGER:-P1D' : 'TRIGGER:-P2D',
        'ACTION:DISPLAY',
        plegar(`DESCRIPTION:${escapar(ev.title)}`),
        'END:VALARM'
      );
      if (hora) {
        lineas.push(
          'BEGIN:VALARM',
          'TRIGGER:-PT1H',
          'ACTION:DISPLAY',
          plegar(`DESCRIPTION:${escapar(`${ev.title} — comienza en 1 hora`)}`),
          'END:VALARM'
        );
      }
    }

    lineas.push('END:VEVENT');
  });

  lineas.push('END:VCALENDAR');
  return lineas.join('\r\n');
}

/** Descarga el calendario como fichero .ics. */
export function descargarIcs(
  eventos: AcademicCalendarEvent[],
  nombreFichero = 'qfdos-2627-calendario.ics',
  incluirClases = true
): void {
  const blob = new Blob([generarIcs(eventos, undefined, incluirClases)], {
    type: 'text/calendar;charset=utf-8'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreFichero;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
