// ==========================================================================
// QFDOS Course Info & Academic Calendar Data (2026/2027)
// Asignatura: Química Farmacéutica II (2627 QFDOS E / Grado en Farmacia UGR)
// ==========================================================================

export interface CourseScheduleItem {
  day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes';
  time: string;
  type: 'Teoría' | 'Tutoría' | 'Seminario';
  location: string;
  room: string;
  description: string;
}

export interface AcademicCalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  title: string;
  category: 'docencia' | 'festivo' | 'examen' | 'practicas' | 'acta' | 'sin_docencia';
  description: string;
  semester?: 1 | 2 | 'anual';
  important?: boolean;
}

export const COURSE_GENERAL_INFO = {
  subject: {
    name: "Química Farmacéutica II",
    code: "2041142 (2627 QFDOS E)",
    degree: "Grado en Farmacia (4.º Curso)",
    group: "Grupo E (Tarde) / Oferta A, C, D, E",
    credits: "6 ECTS",
    faculty: "Facultad de Farmacia",
    university: "Universidad de Granada (UGR)",
    department: "Departamento de Química Farmacéutica y Orgánica",
    year: "2026/2027",
    semester: "Primer Semestre (14 Septiembre 2026 - 22 Diciembre 2026)"
  },
  teachingStaff: {
    coordinator: "Dr. Juan José Díaz-Mochón",
    email: "juandiaz@go.ugr.es",
    role: "Profesor Titular / Responsable Grupo E",
    departmentLocation: "Departamento de Química Farmacéutica y Orgánica, Facultad de Farmacia, Campus de Cartuja",
    researchCenterLocation: "Centro GENYO (Centro de Genómica e Investigación Oncológica), Parque Tecnológico de la Salud (PTS), Avenida de la Ilustración 114, 18016 Granada, España",
    otherProfessors: ["Dr. Joaquín Campos Rosa (Grupo C)"]
  },
  classSchedule: {
    room: "Aula 7",
    frequency: "Lunes, Martes y Jueves a las 17:00 h",
    sessions: [
      { day: "Lunes", time: "17:00 - 18:00 h", room: "Aula 7", subject: "Química Farmacéutica II (Grupo E)", code: "QF2" },
      { day: "Martes", time: "17:00 - 18:00 h", room: "Aula 7", subject: "Química Farmacéutica II (Grupo E)", code: "QF2" },
      { day: "Jueves", time: "17:00 - 18:00 h", room: "Aula 7", subject: "Química Farmacéutica II (Grupo E)", code: "QF2" }
    ]
  },
  tutoring: {
    hours: [
      { day: "Lunes", time: "15:00 - 17:00 h" },
      { day: "Martes", time: "15:00 - 17:00 h" },
      { day: "Jueves", time: "15:00 - 17:00 h" }
    ],
    locations: [
      {
        name: "Facultad de Farmacia",
        desc: "Departamento de Química Farmacéutica y Orgánica, Campus de Cartuja, Granada."
      },
      {
        name: "Centro GENYO (PTS)",
        desc: "Centro de Genómica e Investigación Oncológica, Avda. de la Ilustración 114, 18016 Granada."
      },
      {
        name: "Online (Google Meet)",
        desc: "Videoconferencia interactiva vía GMeet previa cita."
      }
    ],
    instruction: "Para organizar y confirmar la tutoría (presencial en Farmacia / GENYO u online por Google Meet), es imprescindible escribir previamente a juandiaz@go.ugr.es."
  },
  links: {
    geminiNotebook: "https://notebook.google.com/notebook/4ec999d2-6985-4cd1-8172-5ab07a892986",
    teachingGuide: "https://grados.ugr.es/farmacia/pages/titulacion/guias_docentes/2041142",
    facultyCalendar: "https://farmacia.ugr.es/docencia/grado-farmacia/calendario-academico",
    dgeCalendar: "https://sl.ugr.es/DGE_calendario_2627",
    labNotebookPdf: "https://drive.google.com/file/d/1zHi7DsEEQ9TsXbelODcG5hcy8_pMl4Bl/view?usp=sharing"
  }
};

export const ACADEMIC_CALENDAR_EVENTS: AcademicCalendarEvent[] = [
  // Septiembre 2026
  {
    id: 'cal-sep-14',
    date: '2026-09-14',
    title: 'Inicio del Primer Semestre (Docencia)',
    category: 'docencia',
    description: 'Comienzo oficial de las clases teóricas de Química Farmacéutica II (Lunes, 17:00 h, Aula 7).',
    semester: 1,
    important: true
  },
  // Octubre 2026
  {
    id: 'cal-oct-12',
    date: '2026-10-12',
    title: 'Fiesta Nacional de España',
    category: 'festivo',
    description: 'Día festivo nacional (Sin docencia).',
    semester: 1
  },
  // Noviembre 2026
  {
    id: 'cal-nov-01',
    date: '2026-11-01',
    title: 'Todos los Santos',
    category: 'festivo',
    description: 'Día festivo nacional.',
    semester: 1
  },
  {
    id: 'cal-nov-02',
    date: '2026-11-02',
    endDate: '2026-11-18',
    title: 'Periodo Exámenes Especiales de Noviembre',
    category: 'examen',
    description: 'Convocatoria especial de noviembre para finalización de estudios (excepto TFG).',
    semester: 1
  },
  {
    id: 'cal-nov-29',
    date: '2026-11-29',
    title: 'Acto Académico Patrona de Farmacia',
    category: 'docencia',
    description: 'Celebración del Acto Académico de la Patrona de la Facultad de Farmacia.',
    semester: 1
  },
  // Diciembre 2026
  {
    id: 'cal-dic-04',
    date: '2026-12-04',
    title: 'Límite entrega actas exámenes noviembre',
    category: 'acta',
    description: 'Límite oficial para la entrega de actas del periodo especial de noviembre.',
    semester: 1
  },
  {
    id: 'cal-dic-07',
    date: '2026-12-07',
    title: 'Lunes festivo (Constitución Española)',
    category: 'festivo',
    description: 'Día festivo oficial en Andalucía (traslado del Día de la Constitución).',
    semester: 1
  },
  {
    id: 'cal-dic-08',
    date: '2026-12-08',
    title: 'Inmaculada Concepción',
    category: 'festivo',
    description: 'Día festivo nacional (Sin docencia).',
    semester: 1
  },
  {
    id: 'cal-dic-09',
    date: '2026-12-09',
    title: 'Día no lectivo de la Facultad de Farmacia',
    category: 'festivo',
    description: 'Día de la Facultad de Farmacia declarado no lectivo oficial.',
    semester: 1,
    important: true
  },
  {
    id: 'cal-dic-22',
    date: '2026-12-22',
    title: 'Fin de clases del Primer Semestre',
    category: 'docencia',
    description: 'Último día de actividad docente presencial antes de las vacaciones de Navidad.',
    semester: 1,
    important: true
  },
  {
    id: 'cal-dic-23',
    date: '2026-12-23',
    endDate: '2027-01-07',
    title: 'Vacaciones de Navidad (Sin Docencia)',
    category: 'sin_docencia',
    description: 'Periodo vacacional de Navidad oficial de la Universidad de Granada.',
    semester: 1
  },
  // Enero 2027
  {
    id: 'cal-ene-08',
    date: '2027-01-08',
    title: 'Reanudación de actividad académica',
    category: 'docencia',
    description: 'Reanudación de actividad universitaria y preparación de exámenes.',
    semester: 1
  },
  {
    id: 'cal-ene-11',
    date: '2027-01-11',
    endDate: '2027-01-25',
    title: 'Evaluación Ordinaria 1.er Semestre (Exámenes)',
    category: 'examen',
    description: 'Periodo oficial de exámenes de la Convocatoria Ordinaria del Primer Semestre.',
    semester: 1,
    important: true
  },
  // Febrero 2027
  {
    id: 'cal-feb-02',
    date: '2027-02-02',
    title: 'Límite entrega actas Convocatoria Ordinaria (1S)',
    category: 'acta',
    description: 'Fecha límite de entrega de actas de la convocatoria ordinaria del primer semestre.',
    semester: 1
  },
  {
    id: 'cal-feb-03',
    date: '2027-02-03',
    endDate: '2027-02-12',
    title: 'Evaluación Extraordinaria 1.er Semestre (Exámenes)',
    category: 'examen',
    description: 'Periodo de exámenes de la Convocatoria Extraordinaria del Primer Semestre.',
    semester: 1,
    important: true
  },
  {
    id: 'cal-feb-15',
    date: '2027-02-15',
    title: 'Inicio del Segundo Semestre (Docencia)',
    category: 'docencia',
    description: 'Comienzo oficial de las clases del Segundo Semestre.',
    semester: 2
  },
  {
    id: 'cal-feb-26',
    date: '2027-02-26',
    title: 'Límite entrega actas Convocatoria Extraordinaria (1S)',
    category: 'acta',
    description: 'Fecha límite de entrega de actas de la convocatoria extraordinaria del primer semestre.',
    semester: 1
  },
  {
    id: 'cal-feb-28',
    date: '2027-02-28',
    title: 'Día de Andalucía',
    category: 'festivo',
    description: 'Fiesta autonómica de la Comunidad Autónoma de Andalucía.',
    semester: 2
  },
  // Marzo 2027
  {
    id: 'cal-mar-22',
    date: '2027-03-22',
    endDate: '2027-03-29',
    title: 'Semana Santa (Sin Docencia)',
    category: 'sin_docencia',
    description: 'Periodo no lectivo de Semana Santa en la Universidad de Granada.',
    semester: 2
  },
  // Mayo 2027
  {
    id: 'cal-may-01',
    date: '2027-05-01',
    title: 'Fiesta del Trabajo',
    category: 'festivo',
    description: 'Día festivo nacional.',
    semester: 2
  },
  {
    id: 'cal-may-31',
    date: '2027-05-31',
    title: 'Fin de clases del Segundo Semestre',
    category: 'docencia',
    description: 'Finalización de la actividad docente del Segundo Semestre.',
    semester: 2
  },
  // Junio 2027
  {
    id: 'cal-jun-04',
    date: '2027-06-04',
    endDate: '2027-06-18',
    title: 'Evaluación Ordinaria 2.º Semestre (Exámenes)',
    category: 'examen',
    description: 'Periodo de exámenes de la Convocatoria Ordinaria del Segundo Semestre.',
    semester: 2
  },
  // Julio 2027
  {
    id: 'cal-jul-01',
    date: '2027-07-01',
    title: 'Límite entrega actas Convocatoria Ordinaria (2S)',
    category: 'acta',
    description: 'Fecha límite de entrega de actas ordinarias del segundo semestre.',
    semester: 2
  },
  {
    id: 'cal-jul-02',
    date: '2027-07-02',
    endDate: '2027-07-16',
    title: 'Evaluación Extraordinaria 2.º Semestre (Exámenes)',
    category: 'examen',
    description: 'Periodo de exámenes de la Convocatoria Extraordinaria del Segundo Semestre.',
    semester: 2
  },
  {
    id: 'cal-jul-26',
    date: '2027-07-26',
    title: 'Límite entrega actas Convocatoria Extraordinaria (2S)',
    category: 'acta',
    description: 'Fecha límite de entrega de actas extraordinarias del segundo semestre.',
    semester: 2
  }
];
