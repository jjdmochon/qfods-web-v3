import React, { useState } from 'react';
import {
  COURSE_GENERAL_INFO,
  COURSE_EVALUATION_GUIDE,
  ACADEMIC_CALENDAR_EVENTS,
  AcademicCalendarEvent
} from '../data/courseInfoData';
import {
  Calendar, Clock, MapPin, Mail, ExternalLink, BookOpen,
  Sparkles, CheckCircle2, AlertCircle, FileText,
  HelpCircle, ChevronRight, UserCheck, ShieldCheck,
  Building, Video, Users, Info, Award, AlertTriangle, Scale
} from 'lucide-react';

export const CourseInfoSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedSemester, setSelectedSemester] = useState<string>('todos');
  const [activeTab, setActiveTab] = useState<'info' | 'evaluacion' | 'calendario' | 'tutorias'>('info');

  const { subject, teachingStaff, classSchedule, examSchedule, tutoring, links } = COURSE_GENERAL_INFO;

  // Filtrado de eventos de calendario
  const filteredEvents = ACADEMIC_CALENDAR_EVENTS.filter(event => {
    const matchCategory = selectedCategory === 'todos' || event.category === selectedCategory;
    const matchSemester =
      selectedSemester === 'todos' ||
      event.semester === 'anual' ||
      (selectedSemester === '1' && event.semester === 1) ||
      (selectedSemester === '2' && event.semester === 2);
    return matchCategory && matchSemester;
  });

  const getCategoryBadge = (category: AcademicCalendarEvent['category']) => {
    switch (category) {
      case 'docencia':
        return <span className="qfdos-badge badge-teal" style={{ fontSize: '0.68rem' }}>Docencia</span>;
      case 'festivo':
        return <span className="qfdos-badge badge-red" style={{ fontSize: '0.68rem' }}>Festivo / No lectivo</span>;
      case 'examen':
        return <span className="qfdos-badge badge-purple" style={{ fontSize: '0.68rem', background: '#9333ea', color: '#fff' }}>Exámenes</span>;
      case 'sin_docencia':
        return <span className="qfdos-badge badge-amber" style={{ fontSize: '0.68rem' }}>Sin Docencia</span>;
      case 'acta':
        return <span className="qfdos-badge badge-mint" style={{ fontSize: '0.68rem' }}>Límite Actas</span>;
      default:
        return <span className="qfdos-badge badge-navy" style={{ fontSize: '0.68rem' }}>Evento</span>;
    }
  };

  const formatDate = (dateStr: string, endDateStr?: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const d1 = new Date(dateStr + 'T00:00:00');
    const formattedD1 = d1.toLocaleDateString('es-ES', options);

    if (endDateStr) {
      const d2 = new Date(endDateStr + 'T00:00:00');
      const formattedD2 = d2.toLocaleDateString('es-ES', options);
      return `${formattedD1} — ${formattedD2}`;
    }
    return formattedD1;
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      
      {/* Banner Principal de la Asignatura */}
      <div className="qfdos-card" style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #0d9488 100%)',
        color: '#ffffff',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        marginBottom: '2rem',
        border: 'none'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <span className="qfdos-badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', fontSize: '0.74rem' }}>
                {subject.code}
              </span>
              <span className="qfdos-badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', fontSize: '0.74rem' }}>
                {subject.credits} • {subject.year}
              </span>
              <span className="qfdos-badge" style={{ background: '#10b981', color: '#ffffff', fontSize: '0.74rem', fontWeight: 700 }}>
                {subject.group}
              </span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', margin: '0.3rem 0', fontFamily: 'Montserrat, sans-serif' }}>
              {subject.name}
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.92)', margin: '0.3rem 0 1rem 0', maxWidth: '750px' }}>
              {subject.degree} • {subject.faculty} • {subject.university}. 
              Coordinación e información docente oficial, horarios de aula, tutorías presenciales y online, y calendario académico completo.
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a
                href={links.geminiNotebook}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-mint"
                style={{
                  background: '#ffffff',
                  color: 'var(--navy)',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  padding: '8px 16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Sparkles size={15} color="var(--teal)" /> Gemini Notebook Oficial del Curso
              </a>
              <a
                href={links.teachingGuide}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm"
                style={{
                  background: 'rgba(255,255,255,0.16)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.3)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <BookOpen size={15} /> Guía Docente UGR
              </a>
            </div>
          </div>

          {/* Tarjeta de horario rápido */}
          <div style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            border: '1px solid rgba(255,255,255,0.2)',
            minWidth: '260px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
              <Clock size={16} /> HORARIO DE CLASE (GRUPO E)
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
              {classSchedule.room}
            </div>
            <div style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.9)', marginTop: '4px' }}>
              {classSchedule.frequency}
            </div>
            <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.75)', marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '6px' }}>
              📍 Facultad de Farmacia · Cartuja
            </div>
          </div>
        </div>
      </div>

      {/* Selector de Pestañas Interiores */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid var(--border-color)', marginBottom: '1.75rem', paddingBottom: '0.2rem', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('info')}
          className={`btn ${activeTab === 'info' ? 'btn-navy' : 'btn-ghost'}`}
          style={{ fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <Info size={16} /> Información General & Horarios
        </button>
        <button
          onClick={() => setActiveTab('evaluacion')}
          className={`btn ${activeTab === 'evaluacion' ? 'btn-navy' : 'btn-ghost'}`}
          style={{ fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <FileText size={16} /> Sistema de Evaluación (Oficial)
        </button>
        <button
          onClick={() => setActiveTab('tutorias')}
          className={`btn ${activeTab === 'tutorias' ? 'btn-navy' : 'btn-ghost'}`}
          style={{ fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <Users size={16} /> Horarios de Tutorías
        </button>
        <button
          onClick={() => setActiveTab('calendario')}
          className={`btn ${activeTab === 'calendario' ? 'btn-navy' : 'btn-ghost'}`}
          style={{ fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <Calendar size={16} /> Calendario Académico & Fechas Clave
        </button>
      </div>

      {/* PESTAÑA 1: INFORMACIÓN GENERAL & HORARIOS */}
      {activeTab === 'info' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          
          {/* Card: Clases Teóricas */}
          <div className="qfdos-card card-navy">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={22} color="var(--navy)" />
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                  Clases Teóricas Presenciales
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Grupo E · Turno de Tarde</span>
              </div>
            </div>

            <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {classSchedule.sessions.map((s, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  background: 'var(--surface-alt)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="qfdos-badge badge-navy" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                      {s.day}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-title)' }}>
                      {s.time}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--teal)' }}>
                    {s.room}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginTop: '0.5rem', background: 'var(--neutral-bg)', padding: '10px', borderRadius: '8px' }}>
              📌 <strong>Ubicación:</strong> Aula 7 (Edificio Principal de la Facultad de Farmacia, Campus de Cartuja).
            </div>
          </div>

          {/* Card: Profesorado y Contacto */}
          <div className="qfdos-card card-teal">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserCheck size={22} color="var(--teal)" />
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                  Profesorado Responsable
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Cátedra de Química Farmacéutica</span>
              </div>
            </div>

            <div style={{ marginTop: '0.75rem', padding: '12px 14px', background: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-title)' }}>
                {teachingStaff.coordinator}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--teal)', fontWeight: 600, marginTop: '2px' }}>
                {teachingStaff.role}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '0.84rem' }}>
                <Mail size={14} color="var(--text-muted)" />
                <a href={`mailto:${teachingStaff.email}`} style={{ color: 'var(--navy)', fontWeight: 700 }}>
                  {teachingStaff.email}
                </a>
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', marginTop: '0.25rem' }}>
              <strong>Otros profesores de la asignatura:</strong>
              <ul style={{ paddingLeft: '1.2rem', marginTop: '4px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                {teachingStaff.otherProfessors.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card: Calendario Oficial de Exámenes (Teoría) */}
          <div className="qfdos-card card-navy" style={{ gridColumn: '1 / -1', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={24} color="var(--navy)" />
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-title)', margin: 0 }}>
                    Calendario Oficial de Exámenes (Teoría QFDOS)
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Convocatorias Oficiales del Curso 2026/2027 · Aprobadas en Junta de Facultad
                  </span>
                </div>
              </div>
              <span className="qfdos-badge badge-teal" style={{ fontSize: '0.74rem', fontWeight: 800 }}>
                Aprobación con mín. 5,0 en Bloque Teórico
              </span>
            </div>

            {/* Tabla Responsive de Exámenes */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', background: 'var(--surface-alt)' }}>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-title)' }}>Tipo de Convocatoria / Examen</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-title)' }}>Fecha</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-title)' }}>Hora</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-title)' }}>Observaciones y Ponderación</th>
                  </tr>
                </thead>
                <tbody>
                  {examSchedule.map((ex, idx) => (
                    <tr key={idx} style={{
                      borderBottom: '1px solid var(--border-color)',
                      background: idx % 2 === 0 ? 'var(--surface)' : 'var(--surface-alt)'
                    }}>
                      <td style={{ padding: '14px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className={`qfdos-badge badge-${ex.badgeColor}`} style={{ fontSize: '0.7rem', padding: '2px 8px', fontWeight: 800 }}>
                            {ex.caracter}
                          </span>
                          <strong style={{ color: 'var(--text-title)', fontSize: '0.92rem' }}>{ex.tipo}</strong>
                        </div>
                      </td>
                      <td style={{ padding: '14px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: 800, color: 'var(--navy)', fontFamily: 'var(--font-mono)' }}>
                          📅 {ex.fecha}
                        </span>
                      </td>
                      <td style={{ padding: '14px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: 700, color: 'var(--teal)', fontFamily: 'var(--font-mono)' }}>
                          ⏰ {ex.hora}
                        </span>
                      </td>
                      <td style={{ padding: '14px', verticalAlign: 'middle', color: 'var(--text-main)', lineHeight: 1.45 }}>
                        <p style={{ margin: 0, fontSize: '0.84rem' }}>{ex.observaciones}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card: Gemini NotebookLM y Recursos IA */}
          <div className="qfdos-card card-purple" style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#f3e8ff', padding: '12px', borderRadius: '12px' }}>
                  <Sparkles size={26} color="#9333ea" />
                </div>
                <div>
                  <span className="qfdos-badge" style={{ background: '#9333ea', color: '#ffffff', fontSize: '0.68rem', marginBottom: '4px' }}>
                    INTELIGENCIA ARTIFICIAL DOCENTE
                  </span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-title)', margin: '2px 0' }}>
                    Gemini NotebookLM Oficial de Química Farmacéutica II
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0 }}>
                    Espacio inteligente con todos los materiales oficiales del curso cargados para resolver dudas conceptuales, 
                    generar resúmenes estructurados y consultar el temario y las prácticas de forma interactiva.
                  </p>
                </div>
              </div>

              <a
                href={links.geminiNotebook}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-primary"
                style={{
                  background: '#9333ea',
                  borderColor: '#9333ea',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  padding: '10px 18px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <ExternalLink size={14} /> Abrir Gemini NotebookLM
              </a>
            </div>
          </div>

        </div>
      )}

      {/* PESTAÑA: SISTEMA DE EVALUACIÓN OFICIAL (GUÍA DOCENTE) */}
      {activeTab === 'evaluacion' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Criterio General Uniforme Banner */}
          <div className="qfdos-card" style={{
            background: 'linear-gradient(135deg, rgba(30,58,138,0.07) 0%, rgba(13,148,136,0.05) 100%)',
            borderLeft: '5px solid var(--navy)',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Scale size={24} color="var(--navy)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                Criterios Generales de Evaluación y Calificación (UGR)
              </h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6, margin: '0 0 10px 0' }}>
              {COURSE_EVALUATION_GUIDE.criterioMinimoUniforme}
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <a
                href={COURSE_EVALUATION_GUIDE.normativaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline"
                style={{ fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              >
                <ExternalLink size={13} /> Normativa Oficial de Evaluación UGR
              </a>
              <span className="qfdos-badge badge-teal" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                Aprobación con nota mínima de 5 en cada bloque
              </span>
            </div>
          </div>

          {/* 1. MODALIDAD DE EVALUACIÓN CONTINUA (PREFERENTE) */}
          <div className="qfdos-card card-teal" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <span className="qfdos-badge badge-mint" style={{ fontSize: '0.74rem', fontWeight: 800, marginBottom: '4px' }}>
                  MODALIDAD PREFERENTE
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-title)', margin: 0 }}>
                  1. Evaluación Continua (Convocatoria Ordinaria)
                </h3>
              </div>
              <span style={{ fontSize: '0.84rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--teal)' }}>
                TOTAL: 100%
              </span>
            </div>

            {/* Tabla 1: Desglose de Porcentajes */}
            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-title)', margin: '0.5rem 0 0.75rem 0' }}>
              Tabla 1. Sistemas de evaluación y porcentajes sobre la calificación final:
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {COURSE_EVALUATION_GUIDE.tabla1Continua.map((item, idx) => (
                <div key={idx} style={{
                  padding: '1.2rem',
                  background: 'var(--surface-alt)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '1rem', color: 'var(--text-title)' }}>{item.sistema}</strong>
                      <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--navy)', fontFamily: 'var(--font-mono)' }}>
                        {item.porcentaje}%
                      </span>
                    </div>
                    <span className="qfdos-badge badge-navy" style={{ fontSize: '0.66rem', marginBottom: '8px' }}>
                      Códigos: {item.codigos}
                    </span>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.45, margin: '6px 0 0 0' }}>
                      {item.descripcion}
                    </p>
                  </div>
                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-color)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--teal)' }}>
                    • {item.caracter}
                  </div>
                </div>
              ))}
            </div>

            {/* Normas Teóricas y Prácticas de Evaluación Continua */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h5 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '6px' }}>
                  I. Teoría (Examen Parcial + Examen Final):
                </h5>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5, margin: 0 }}>
                  {COURSE_EVALUATION_GUIDE.ordinariaDetalle.teoria}
                </p>
              </div>

              <div style={{ padding: '1rem', background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h5 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--teal)', marginBottom: '6px' }}>
                  II. Prácticas de Laboratorio (Superación Obligatoria):
                </h5>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5, margin: 0 }}>
                  {COURSE_EVALUATION_GUIDE.ordinariaDetalle.practicas}
                </p>
              </div>
            </div>
          </div>

          {/* 2. EVALUACIÓN EXTRAORDINARIA & 3. EVALUACIÓN ÚNICA FINAL */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            
            {/* Convocatoria Extraordinaria */}
            <div className="qfdos-card card-purple" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Award size={20} color="#9333ea" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                  Evaluación Extraordinaria
                </h3>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                {COURSE_EVALUATION_GUIDE.extraordinariaDetalle.resumen}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                {COURSE_EVALUATION_GUIDE.extraordinariaDetalle.partes.map((p, i) => (
                  <div key={i} style={{ padding: '10px', background: 'var(--surface-alt)', borderRadius: '6px', fontSize: '0.82rem' }}>
                    <strong style={{ color: 'var(--text-title)' }}>{p.parte}:</strong> {p.desc}
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', background: 'rgba(147,51,234,0.06)', padding: '8px 10px', borderRadius: '6px' }}>
                ⚠️ <strong>Calificación en acta:</strong> {COURSE_EVALUATION_GUIDE.extraordinariaDetalle.calificacionFinal}
              </div>
            </div>

            {/* Evaluación Única Final */}
            <div className="qfdos-card card-amber" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <AlertTriangle size={20} color="var(--accent-amber)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                  Evaluación Única Final
                </h3>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                {COURSE_EVALUATION_GUIDE.unicaFinalDetalle.solicitud}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                {COURSE_EVALUATION_GUIDE.unicaFinalDetalle.partes.map((p, i) => (
                  <div key={i} style={{ padding: '10px', background: 'var(--surface-alt)', borderRadius: '6px', fontSize: '0.82rem' }}>
                    <strong style={{ color: 'var(--text-title)' }}>{p.parte}:</strong> {p.desc}
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', background: 'rgba(245,158,11,0.08)', padding: '8px 10px', borderRadius: '6px' }}>
                📌 <strong>Solicitud:</strong> Procedimiento electrónico al Director/a de Departamento en las 2 primeras semanas.
              </div>
            </div>

          </div>

          {/* 4. EVALUACIÓN POR INCIDENCIAS (ART. 9 NORMATIVA UGR) */}
          <div className="qfdos-card card-navy" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={22} color="var(--navy)" />
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                    Evaluación por Incidencias (Artículo 9 Normativa UGR)
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Procedimiento reglado mediante Registro Electrónico de la Universidad de Granada
                  </span>
                </div>
              </div>

              <a
                href={COURSE_EVALUATION_GUIDE.sedeIncidenciasUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-secondary"
                style={{ fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <ExternalLink size={13} /> Sede Electrónica UGR · Solicitud de Incidencias
              </a>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
              Las solicitudes se presentan por impreso en Secretaría o telemáticamente en Sede Electrónica. Tras la resolución positiva del Departamento, 
              el alumno/a dispone de un <strong>plazo máximo de 12 días naturales</strong> para contactar por correo electrónico con el profesor/a y el Director/a de Departamento.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
              {COURSE_EVALUATION_GUIDE.incidencias.map((inc, i) => (
                <div key={i} style={{ padding: '12px', background: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.86rem', color: 'var(--navy)' }}>{inc.inc}</strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      Plazo: {inc.plazo}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-title)', fontWeight: 600, margin: '2px 0 4px 0' }}>
                    {inc.motivo}
                  </p>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    📄 Justificante: {inc.doc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. CÓDIGOS DE SISTEMAS DE EVALUACIÓN (TABLA 2) */}
          <div className="qfdos-card" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '10px' }}>
              Tabla 2. Códigos informativos de los distintos sistemas de evaluación de la Guía Docente:
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
              {COURSE_EVALUATION_GUIDE.tabla2Codigos.map((cod, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                  <span className="qfdos-badge badge-teal" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', padding: '1px 5px', flexShrink: 0 }}>
                    {cod.codigo}
                  </span>
                  <span style={{ color: 'var(--text-main)' }}>{cod.desc}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* PESTAÑA: HORARIOS DE TUTORÍAS */}
      {activeTab === 'tutorias' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="qfdos-card card-teal" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
              <Users size={24} color="var(--teal)" />
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                  Horario Semanal de Tutorías (Dr. Juan José Díaz-Mochón)
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Atención personalizada para resolución de dudas teóricas, estequiometría de laboratorio y seguimiento académico.
                </p>
              </div>
            </div>

            {/* Franjas Horarias */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {tutoring.hours.map((h, i) => (
                <div key={i} style={{
                  padding: '1.2rem',
                  background: 'var(--surface-alt)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  textAlign: 'center'
                }}>
                  <span className="qfdos-badge badge-teal" style={{ fontSize: '0.78rem', fontWeight: 800, marginBottom: '6px' }}>
                    {h.day}
                  </span>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--navy)', marginTop: '4px' }}>
                    {h.time}
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Franja Oficial de Atención</span>
                </div>
              ))}
            </div>

            {/* Sedes y Modalidades */}
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-title)', marginTop: '1.75rem', marginBottom: '0.75rem' }}>
              Modalidades y Sedes de Realización:
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              
              {/* Sede 1: Farmacia */}
              <div style={{ padding: '1rem', background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Building size={18} color="var(--navy)" />
                  <strong style={{ fontSize: '0.92rem', color: 'var(--text-title)' }}>1. Facultad de Farmacia</strong>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                  Departamento de Química Farmacéutica y Orgánica, Facultad de Farmacia, Campus Universitario de Cartuja, Granada.
                </p>
              </div>

              {/* Sede 2: Centro GENYO */}
              <div style={{ padding: '1rem', background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <MapPin size={18} color="var(--teal)" />
                  <strong style={{ fontSize: '0.92rem', color: 'var(--text-title)' }}>2. Centro GENYO (PTS)</strong>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                  Centro de Genómica e Investigación Oncológica, Parque Tecnológico de la Salud (PTS), Avda. de la Ilustración 114, 18016 Granada.
                </p>
              </div>

              {/* Sede 3: Online */}
              <div style={{ padding: '1rem', background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Video size={18} color="#059669" />
                  <strong style={{ fontSize: '0.92rem', color: 'var(--text-title)' }}>3. Online (Google Meet)</strong>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                  Sesión telemática individual o en pequeño grupo mediante Google Meet previa concertación.
                </p>
              </div>

            </div>

            {/* Protocolo de Solicitud */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem 1.25rem',
              background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(217,119,6,0.04) 100%)',
              borderLeft: '4px solid var(--accent-amber)',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: 'var(--accent-amber)', fontSize: '0.9rem', marginBottom: '4px' }}>
                <AlertCircle size={18} /> Protocolo de Organización de Tutorías
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', margin: '0 0 8px 0', lineHeight: 1.55 }}>
                {tutoring.instruction}
              </p>
              <a
                href={`mailto:${teachingStaff.email}?subject=Solicitud%20de%20Tutor%C3%ADa%20QFDOS%20-%20[Nombre%20y%20Apellidos]&body=Estimado%20Profesor%20Juan%20Jos%C3%A9%20D%C3%ADaz-Moch%C3%B3n,%0A%0ASoy%20estudiante%20de%20Qu%C3%ADmica%20Farmac%C3%A9utica%20II%20(Grupo%20E).%20Quisiera%20solicitar%20una%20tutor%C3%ADa%20para%20tratar%20la%20siguiente%20consulta:%0A%0A[Indicar%20brevemente%20el%20motivo]%0A%0AModalidad%20preferida:%20[Farmacia%20Cartuja%20/%20GENYO%20PTS%20/%20Google%20Meet]%0AD%C3%ADa%20y%20franja%20propuesta:%20[Lunes/Martes/Jueves%2015:00-17:00]%0A%0AMuchas%20gracias.`}
                className="btn btn-sm btn-outline"
                style={{ fontWeight: 700, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Mail size={14} /> Redactar Correo de Solicitud de Tutoría
              </a>
            </div>

          </div>

        </div>
      )}

      {/* PESTAÑA 3: CALENDARIO ACADÉMICO & FECHAS CLAVE */}
      {activeTab === 'calendario' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Cabecera y Filtros del Calendario */}
          <div className="qfdos-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                  Calendario Académico Grado en Farmacia (Curso 2026/2027)
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Aprobado por el Consejo de Gobierno de la Universidad de Granada y adaptado a la Facultad de Farmacia.
                </p>
              </div>

              {/* Filtros */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <select
                  value={selectedSemester}
                  onChange={e => setSelectedSemester(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '0.82rem', padding: '6px 10px', borderRadius: '6px' }}
                >
                  <option value="todos">Todos los Semestres</option>
                  <option value="1">1.er Semestre (QFDOS)</option>
                  <option value="2">2.º Semestre</option>
                </select>

                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '0.82rem', padding: '6px 10px', borderRadius: '6px' }}
                >
                  <option value="todos">Todas las Categorías</option>
                  <option value="docencia">Docencia & Clases</option>
                  <option value="festivo">Festivos & No Lectivos</option>
                  <option value="examen">Periodos de Exámenes</option>
                  <option value="sin_docencia">Sin Docencia (Vacaciones)</option>
                  <option value="acta">Límites de Actas</option>
                </select>
              </div>
            </div>
          </div>

          {/* Timeline de Hitos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredEvents.map(event => (
              <div
                key={event.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  padding: '14px 18px',
                  background: event.important ? 'var(--surface)' : 'var(--surface-alt)',
                  borderRadius: 'var(--radius-md)',
                  border: event.important ? '2px solid var(--teal)' : '1px solid var(--border-color)',
                  boxShadow: event.important ? 'var(--shadow-sm)' : 'none',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{
                    minWidth: '130px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: event.important ? 'var(--teal)' : 'var(--text-title)',
                    paddingTop: '2px'
                  }}>
                    {formatDate(event.date, event.endDate)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '0.94rem', color: 'var(--text-title)' }}>
                        {event.title}
                      </strong>
                      {getCategoryBadge(event.category)}
                      {event.semester === 1 && (
                        <span className="qfdos-badge badge-navy" style={{ fontSize: '0.62rem' }}>1.er Semestre</span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', margin: '4px 0 0 0', lineHeight: 1.45 }}>
                      {event.description}
                    </p>
                  </div>
                </div>

                {event.important && (
                  <span className="qfdos-badge badge-teal" style={{ fontSize: '0.7rem', fontWeight: 800 }}>
                    ⭐ Fecha Clave QFDOS
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Enlaces de descarga oficiales */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            background: 'var(--surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Fuentes oficiales: DGE UGR, Calendario de Grado UGR 2026/2027 y Delegación de Estudiantes de Farmacia.
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                href={links.dgeCalendar}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline"
                style={{ fontSize: '0.78rem' }}
              >
                <ExternalLink size={12} /> Calendario DGE Oficial
              </a>
              <a
                href={links.facultyCalendar}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline"
                style={{ fontSize: '0.78rem' }}
              >
                <ExternalLink size={12} /> Web Facultad de Farmacia
              </a>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
