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
    group: "Grupo E (Turno de Tarde)",
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
    role: "Profesor Titular · Responsable y Docente Único (Grupo E)",
    departmentLocation: "Departamento de Química Farmacéutica y Orgánica, Facultad de Farmacia, Campus de Cartuja",
    researchCenterLocation: "Centro GENYO (Centro de Genómica e Investigación Oncológica), Parque Tecnológico de la Salud (PTS), Avenida de la Ilustración 114, 18016 Granada, España"
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
  examSchedule: [
    {
      tipo: "Examen Parcial (Evaluación Continua)",
      fecha: "19 de noviembre de 2026",
      hora: "Horario de docencia (17:00 h)",
      observaciones: "Prueba parcial no eliminatoria; pondera un 20% de la nota final.",
      ponderacion: "20%",
      caracter: "No eliminatorio",
      badgeColor: "teal"
    },
    {
      tipo: "Convocatoria Ordinaria (Examen Final)",
      fecha: "13 de enero de 2027",
      hora: "16:00 h",
      observaciones: "Obligatorio en evaluación continua; pondera un 70% (requiere una nota mínima de 5 para promediar).",
      ponderacion: "70%",
      caracter: "Obligatorio (mín. 5,0)",
      badgeColor: "navy"
    },
    {
      tipo: "Convocatoria Extraordinaria",
      fecha: "4 de febrero de 2027",
      hora: "11:30 h",
      observaciones: "Examen teórico que comprende el 100% de la materia del curso.",
      ponderacion: "100% (o 70% + 30% según modalidad)",
      caracter: "Materia completa (100%)",
      badgeColor: "purple"
    }
  ],
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
    labNotebookPdf: "https://drive.google.com/file/d/1zHi7DsEEQ9TsXbelODcG5hcy8_pMl4Bl/view?usp=sharing",
    evaluationNormativaUgr: "https://goo.gl/uHfqJy",
    incidenciasSedeUgr: "https://sede.ugr.es/procs/Gestion-Academica-Solicitud-de-evaluacion-por-incidencias/"
  }
};

export const COURSE_EVALUATION_GUIDE = {
  normativaUrl: "https://goo.gl/uHfqJy",
  sedeIncidenciasUrl: "https://sede.ugr.es/procs/Gestion-Academica-Solicitud-de-evaluacion-por-incidencias/",
  criterioMinimoUniforme: "En TODAS las pruebas de evaluación (ordinaria, extraordinaria o única final), el alumno/a debe mostrar un conocimiento mínimo y uniforme de todas las cuestiones propuestas, así como de las competencias necesarias. El conocimiento mínimo se alcanza obteniendo un 5 en todas las cuestiones o bloques de las pruebas.",
  tabla1Continua: [
    {
      sistema: "Examen final",
      codigos: "SE.1, SE.2, SE.3 y SE.4",
      porcentaje: 70,
      caracter: "Obligatorio (nota mínima: 5,0)",
      descripcion: "Examen teórico oficial de la materia completa. Requisito indispensable aprobarlo con un 5 para promediar."
    },
    {
      sistema: "Examen parcial",
      codigos: "SE.1, SE.2, SE.3 y SE.4",
      porcentaje: 20,
      caracter: "No eliminatorio",
      descripcion: "Prueba intermedia de progreso para afianzar conceptos clave de la primera mitad del curso."
    },
    {
      sistema: "Prácticas de laboratorio",
      codigos: "SE.7, SE.8, SE.9, SE.10 y SE.15",
      porcentaje: 5,
      caracter: "Obligatorio (superación indispensable)",
      descripcion: "Asistencia al 100% de sesiones, cuaderno conjunto de laboratorio y examen práctico/escrito."
    },
    {
      sistema: "Trabajos y/o seminarios",
      codigos: "SE.1, SE.2, SE.3, SE.4, SE.5, SE.6, SE.11 y SE.12",
      porcentaje: 5,
      caracter: "Continuo",
      descripcion: "Preparación de trabajos, resolución de casos y participación en seminarios/cuestionarios."
    }
  ],
  tabla2Codigos: [
    { codigo: "SE.1", desc: "Exámenes escritos de desarrollo" },
    { codigo: "SE.2", desc: "Exámenes escritos de respuesta corta" },
    { codigo: "SE.3", desc: "Exámenes escritos tipo test" },
    { codigo: "SE.4", desc: "Exámenes orales" },
    { codigo: "SE.5", desc: "Exposición de trabajos" },
    { codigo: "SE.6", desc: "Presentación de temas" },
    { codigo: "SE.7", desc: "Exámenes de prácticas mediante prueba práctica" },
    { codigo: "SE.8", desc: "Exámenes de prácticas mediante prueba escrita" },
    { codigo: "SE.9", desc: "Exámenes de prácticas mediante prueba oral" },
    { codigo: "SE.10", desc: "Elaboración de informe o cuaderno de prácticas" },
    { codigo: "SE.11", desc: "Preparación de trabajos en grupo" },
    { codigo: "SE.12", desc: "Preparación individual de trabajos" },
    { codigo: "SE.15", desc: "Asistencia" }
  ],
  ordinariaDetalle: {
    teoria: "La calificación final se obtendrá mediante la suma de las calificaciones obtenidas en cada una de las partes de la Tabla 1, siempre y cuando en el examen final se haya obtenido una calificación mínima de 5. Ninguno de los exámenes aprobados se guardará ni para convocatorias extraordinarias ni para posteriores cursos académicos.",
    practicas: "Es obligatorio aprobar las prácticas para poder superar la asignatura. El alumno debe asistir a TODAS las sesiones prácticas y superar las pruebas de conocimiento. Ante cualquier duda razonable, el profesor podrá realizar pruebas orales o prácticas individuales complementarias. Alumnos con prácticas no realizadas o suspensas no podrán superar la asignatura en convocatoria ordinaria."
  },
  extraordinariaDetalle: {
    resumen: "Convocatoria para estudiantes que no hayan superado la asignatura en la Ordinaria, con independencia de haber seguido o no la Evaluación Continua.",
    partes: [
      { parte: "Parte Teórica (100%)", desc: "Un examen teórico que comprenderá toda la materia del curso (100% de la nota final en acta)." },
      { parte: "Parte Práctica", desc: "Dos exámenes, teórico y práctico, correspondientes a las prácticas de laboratorio. Imprescindible superarlos." }
    ],
    calificacionFinal: "Es obligatorio aprobar todos los exámenes de ambas partes. La calificación numérica final que figurará en acta será la obtenida en el examen teórico."
  },
  unicaFinalDetalle: {
    solicitud: "Para estudiantes que por motivos laborales, salud, discapacidad u otra causa justificada no puedan seguir la evaluación continua. Se solicita al Director/a de Departamento en las 2 primeras semanas de clase (o 2 semanas tras matriculación posterior) por vía telemática. Plazo de resolución: 10 días hábiles.",
    partes: [
      { parte: "Parte Teórica (100%)", desc: "Examen teórico global de toda la materia del curso (100% de la nota en acta)." },
      { parte: "Parte Práctica", desc: "Dos exámenes, teórico y práctico, de las prácticas de laboratorio. Obligatorio aprobar ambos." }
    ]
  },
  incidencias: [
    { inc: "Incidencia 1", motivo: "Asistencia a órganos colegiados de gobierno o representación", plazo: "Desde recepción de convocatoria hasta fecha de examen", doc: "Original de la convocatoria" },
    { inc: "Incidencia 2", motivo: "Deportistas de alto nivel/rendimiento o representación oficial UGR", plazo: "Antelación mínima de 10 días hábiles", doc: "Documentación oficial acreditativa" },
    { inc: "Incidencia 3", motivo: "Coincidencia de fecha y hora de 2 o más exámenes oficiales", plazo: "Antelación mínima de 10 días hábiles", doc: "Convocatorias oficiales de las asignaturas" },
    { inc: "Incidencia 4", motivo: "Enfermedad justificada", plazo: "5 días naturales antes o hasta 5 días hábiles después", doc: "Certificado médico oficial" },
    { inc: "Incidencia 5", motivo: "Fallecimiento de familiar (hasta 2.º grado, últimos 10 días)", plazo: "Hasta 5 días naturales después del examen", doc: "Certificado de defunción y parentesco" },
    { inc: "Incidencia 6", motivo: "Inicio estancia de movilidad saliente (Erasmus, etc.)", plazo: "Antelación mínima de 20 días hábiles", doc: "Credencial de becario y fechas de incorporación" }
  ]
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
    id: 'cal-qfdos-parcial-2026',
    date: '2026-11-19',
    title: '📝 Examen Parcial QFDOS (Evaluación Continua)',
    category: 'examen',
    description: 'Prueba parcial teórica no eliminatoria en horario de docencia (17:00 h). Pondera un 20% de la nota final.',
    semester: 1,
    important: true
  },
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
    id: 'cal-qfdos-ordinaria-2027',
    date: '2027-01-13',
    title: '🎯 Examen Final QFDOS (Convocatoria Ordinaria)',
    category: 'examen',
    description: 'Examen teórico oficial de Química Farmacéutica II a las 16:00 h. Obligatorio en evaluación continua (70% ponderación, mín. 5,0 para promediar).',
    semester: 1,
    important: true
  },
  {
    id: 'cal-ene-11',
    date: '2027-01-11',
    endDate: '2027-01-25',
    title: 'Periodo Evaluación Ordinaria 1.er Semestre (Exámenes Generales)',
    category: 'examen',
    description: 'Periodo oficial de exámenes de la Convocatoria Ordinaria del Primer Semestre.',
    semester: 1
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
    id: 'cal-qfdos-extraordinaria-2027',
    date: '2027-02-04',
    title: '🔥 Examen Final QFDOS (Convocatoria Extraordinaria)',
    category: 'examen',
    description: 'Examen teórico de Química Farmacéutica II a las 11:30 h. Comprende el 100% de la materia del curso.',
    semester: 1,
    important: true
  },
  {
    id: 'cal-feb-03',
    date: '2027-02-03',
    endDate: '2027-02-12',
    title: 'Periodo Evaluación Extraordinaria 1.er Semestre (Exámenes Generales)',
    category: 'examen',
    description: 'Periodo de exámenes de la Convocatoria Extraordinaria del Primer Semestre.',
    semester: 1
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
  },

  // ---------------------------------------------------------------------
  // Plazos administrativos que se derivan de la propia normativa del curso
  // ---------------------------------------------------------------------
  // ---------------------------------------------------------------------
  // Prácticas de laboratorio
  // ---------------------------------------------------------------------
  {
    id: 'cal-practicas-periodo',
    date: '2026-09-14',
    endDate: '2026-12-22',
    title: '🧪 Periodo de prácticas de laboratorio',
    category: 'practicas',
    description:
      'Las prácticas se reparten a lo largo de todo el primer semestre. Cada estudiante ' +
      'tiene asignada una semana concreta y la conoce con antelación: no todo el grupo ' +
      'coincide. Son cinco sesiones consecutivas de lunes a viernes, y la asistencia a ' +
      'todas es obligatoria para superar la asignatura. El quinto día se hace el examen ' +
      'de prácticas y se entrega el cuaderno de la pareja. Consulta tu semana asignada y ' +
      'añádela a tu calendario desde la pestaña Prácticas.',
    semester: 1,
    important: true
  },
  {
    id: 'cal-euf-solicitud',
    date: '2026-09-25',
    title: '⏳ Fin del plazo: solicitud de Evaluación Única Final',
    category: 'acta',
    description:
      'Dos primeras semanas de clase desde el inicio de la docencia (14 de septiembre). ' +
      'Se solicita por vía telemática al Director/a del Departamento, alegando motivos ' +
      'laborales, de salud, discapacidad u otra causa justificada. La resolución llega en ' +
      '10 días hábiles. Quien se matricule más tarde dispone de 2 semanas desde su matrícula.',
    semester: 1,
    important: true
  },

  // ---------------------------------------------------------------------
  // Festivos que faltaban. Los de Semana Santa y Corpus son móviles: se
  // calculan a partir del Domingo de Pascua, que en 2027 cae el 28 de marzo.
  // ---------------------------------------------------------------------
  {
    id: 'cal-ene-01',
    date: '2027-01-01',
    title: 'Año Nuevo',
    category: 'festivo',
    description: 'Festivo nacional, dentro del periodo de vacaciones de Navidad.',
    semester: 1
  },
  {
    id: 'cal-ene-06',
    date: '2027-01-06',
    title: 'Epifanía del Señor (Reyes)',
    category: 'festivo',
    description: 'Festivo nacional, último día de las vacaciones de Navidad.',
    semester: 1
  },
  {
    id: 'cal-jueves-santo',
    date: '2027-03-25',
    title: 'Jueves Santo',
    category: 'festivo',
    description: 'Festivo. Dentro del periodo no lectivo de Semana Santa (22–29 de marzo).',
    semester: 2
  },
  {
    id: 'cal-viernes-santo',
    date: '2027-03-26',
    title: 'Viernes Santo',
    category: 'festivo',
    description: 'Festivo nacional. Dentro del periodo no lectivo de Semana Santa.',
    semester: 2
  },
  {
    id: 'cal-dia-cruz',
    date: '2027-05-03',
    title: 'Día de la Cruz (Granada)',
    category: 'festivo',
    description: 'Fiesta local de Granada. Lunes no lectivo: la docencia de QFDOS de ese día se traslada o se recupera.',
    semester: 2,
    important: true
  },
  {
    id: 'cal-corpus',
    date: '2027-05-27',
    title: 'Corpus Christi (Granada)',
    category: 'festivo',
    description: 'Fiesta local de Granada, jueves de la semana del Corpus. Coincide con el tramo final de docencia del segundo semestre.',
    semester: 2,
    important: true
  }
];
