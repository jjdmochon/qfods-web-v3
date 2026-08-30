import React, { useState, useEffect } from 'react';
import { StudentEvaluationProfile, INITIAL_STUDENT_EVALUATION_DATA, QFDOS_INFO } from '../data/qfdosData';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  Download, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Search, 
  Edit3, 
  Save,
  RefreshCw,
  FileSpreadsheet,
  Lock,
  UserCheck,
  ShieldCheck,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

const EVALUATION_SHEET_ID = '1gbbet7PZavZQKffB3d7BUs3nhbg9dMJy4ZYGoh3q9yQ';
const EVALUATION_SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${EVALUATION_SHEET_ID}/export?format=csv`;

export const EvaluationSection: React.FC = () => {
  const { isProfesor, user } = useAuth();
  const [students, setStudents] = useState<StudentEvaluationProfile[]>(() => {
    const saved = localStorage.getItem('qfdos_v3_evaluations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved evaluations', e);
      }
    }
    return INITIAL_STUDENT_EVALUATION_DATA;
  });

  const [loadingSheet, setLoadingSheet] = useState<boolean>(false);
  const [sheetSyncStatus, setSheetSyncStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [editExamenFinal, setEditExamenFinal] = useState<number>(0);
  const [editParcial, setEditParcial] = useState<number>(0);
  const [editLab, setEditLab] = useState<number>(0);
  const [editTrabajos, setEditTrabajos] = useState<number>(0);

  // Sync from Google Sheet CSV
  const syncFromGoogleSheet = async () => {
    setLoadingSheet(true);
    setSheetSyncStatus('Sincronizando con Google Sheets...');
    try {
      const res = await fetch(EVALUATION_SHEET_CSV_URL);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const csvText = await res.text();
      
      const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length <= 1) {
        setSheetSyncStatus('La hoja está vacía o no tiene registros.');
        setLoadingSheet(false);
        return;
      }

      // Parse headers
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
      const emailIdx = headers.findIndex(h => h.includes('email') || h.includes('correo') || h.includes('ugr'));
      const nameIdx = headers.findIndex(h => h.includes('nombre') || h.includes('alumno') || h.includes('estudiante'));
      const finalIdx = headers.findIndex(h => h.includes('final') || h.includes('70'));
      const parcialIdx = headers.findIndex(h => h.includes('parcial') || h.includes('20'));
      const labIdx = headers.findIndex(h => h.includes('lab') || h.includes('práct') || h.includes('pract') || h.includes('5'));
      const trabIdx = headers.findIndex(h => h.includes('trabaj') || h.includes('semin') || h.includes('proyect'));

      if (emailIdx === -1 && nameIdx === -1) {
        throw new Error('No se encontraron columnas de correo ni de nombre en la hoja.');
      }

      const parsedStudents: StudentEvaluationProfile[] = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        const email = emailIdx !== -1 ? cols[emailIdx] : `alumno${i}@correo.ugr.es`;
        const name = nameIdx !== -1 ? cols[nameIdx] : `Estudiante ${i}`;
        
        if (!email && !name) continue;

        const finalGrade = finalIdx !== -1 ? parseFloat(cols[finalIdx]) || 0 : 0;
        const parcialGrade = parcialIdx !== -1 ? parseFloat(cols[parcialIdx]) || 0 : 0;
        const labGrade = labIdx !== -1 ? parseFloat(cols[labIdx]) || 0 : 0;
        const trabGrade = trabIdx !== -1 ? parseFloat(cols[trabIdx]) || 0 : 0;

        parsedStudents.push({
          email: email || `estudiante_${i}@correo.ugr.es`,
          name: name || email,
          attempts: [
            {
              id: `att-final-${i}`,
              studentEmail: email,
              studentName: name,
              topicId: 'examen-final',
              score: finalGrade,
              correctCount: Math.round(finalGrade),
              totalQuestions: 10,
              timestamp: 'Convocatoria Oficial'
            }
          ],
          labGrade: labGrade,
          projectGrade: trabGrade
        });
      }

      if (parsedStudents.length > 0) {
        setStudents(parsedStudents);
        localStorage.setItem('qfdos_v3_evaluations', JSON.stringify(parsedStudents));
        setSheetSyncStatus(`✓ Sincronizados ${parsedStudents.length} estudiantes correctamente desde Google Sheets.`);
      }
    } catch (err: any) {
      console.warn('Error fetching Google Sheet, using stored data:', err);
      setSheetSyncStatus(`Nota: No se pudo conectar directamente con Google Sheets (${err.message}). Mostrando datos locales.`);
    } finally {
      setLoadingSheet(false);
    }
  };

  useEffect(() => {
    // Attempt automatic sync on load
    syncFromGoogleSheet();
  }, []);

  const calculateOfficialGrade = (student: StudentEvaluationProfile) => {
    // Obtenemos nota del examen final (70%), parcial (20%), prácticas (5%) y trabajos (5%)
    const finalExamAttempt = student.attempts.find(a => a.topicId === 'examen-final') || student.attempts[0];
    const finalExamScore = finalExamAttempt ? finalExamAttempt.score : (student.attempts.length > 0 ? (student.attempts.reduce((s, a) => s + a.score, 0) / student.attempts.length) : 0);
    
    const parcialScore = student.projectGrade || 0; // Usado como parcial/seminario según hoja
    const labScore = student.labGrade || 0;
    const trabajosScore = student.projectGrade || 0;

    // Regla Guía Docente UGR:
    // Examen Final Oficial: 70% (Requiere nota mínima de 5.0 para promediar)
    // Examen Parcial: 20%
    // Prácticas: 5% (Requiere aprobado)
    // Trabajos/Seminarios: 5%
    const isExamMinimumMet = finalExamScore >= 5.0;
    const isLabApproved = labScore >= 5.0;

    const weightedScore = (finalExamScore * 0.70) + (parcialScore * 0.20) + (labScore * 0.05) + (trabajosScore * 0.05);
    
    // Si no alcanza el mínimo en el examen final, la nota final no puede superar 4.9
    const finalScore = isExamMinimumMet ? weightedScore : Math.min(weightedScore, 4.9);

    return {
      finalExamScore: finalExamScore.toFixed(1),
      parcialScore: parcialScore.toFixed(1),
      labScore: labScore.toFixed(1),
      trabajosScore: trabajosScore.toFixed(1),
      finalScore: finalScore.toFixed(2),
      isPassed: finalScore >= 5.0 && isExamMinimumMet && isLabApproved,
      isExamMinimumMet,
      isLabApproved
    };
  };

  const handleExportCsv = () => {
    const headers = [
      'Nombre Alumno', 
      'Correo UGR', 
      'Examen Final (70%)', 
      'Examen Parcial (20%)', 
      'Prácticas Lab (5%)', 
      'Trabajos/Seminarios (5%)', 
      'Calificación Final', 
      'Estado Acta'
    ];
    const rows = students.map(s => {
      const { finalExamScore, parcialScore, labScore, trabajosScore, finalScore, isPassed } = calculateOfficialGrade(s);
      const estado = isPassed ? (Number(finalScore) >= 9 ? 'Sobresaliente' : Number(finalScore) >= 7 ? 'Notable' : 'Aprobado') : 'Suspenso';
      return `"${s.name}","${s.email}",${finalExamScore},${parcialScore},${labScore},${trabajosScore},${finalScore},"${estado}"`;
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Acta_Oficial_QFDOS_Grupo_E_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStartEdit = (s: StudentEvaluationProfile) => {
    setEditingEmail(s.email);
    const finalExam = s.attempts.find(a => a.topicId === 'examen-final')?.score || 0;
    setEditExamenFinal(finalExam);
    setEditParcial(s.projectGrade || 0);
    setEditLab(s.labGrade || 0);
    setEditTrabajos(s.projectGrade || 0);
  };

  const handleSaveEdit = (email: string) => {
    const updated = students.map(s => {
      if (s.email === email) {
        return {
          ...s,
          attempts: [
            {
              id: 'att-manual',
              studentEmail: email,
              studentName: s.name,
              topicId: 'examen-final',
              score: Number(editExamenFinal) || 0,
              correctCount: Math.round(Number(editExamenFinal) || 0),
              totalQuestions: 10,
              timestamp: 'Calificación Profesor'
            }
          ],
          labGrade: Number(editLab) || 0,
          projectGrade: Number(editParcial) || 0
        };
      }
      return s;
    });

    setStudents(updated);
    localStorage.setItem('qfdos_v3_evaluations', JSON.stringify(updated));
    setEditingEmail(null);
  };

  // Filtrado de seguridad: Si es estudiante, SOLO ve su propio registro asociado a su correo institucional go.ugr.es
  const currentUserEmail = user?.email?.toLowerCase().trim() || '';
  const myStudentProfile = students.find(s => s.email.toLowerCase().trim() === currentUserEmail);

  const displayedStudents = isProfesor
    ? students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : (myStudentProfile ? [myStudentProfile] : []);

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <GraduationCap size={26} color="var(--navy)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-title)', letterSpacing: '-0.02em' }}>
              {isProfesor ? 'Matriz de Evaluación Continua & Actas Oficiales' : 'Mi Expediente y Calificaciones de Evaluación Continua'}
            </h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Ponderación Oficial Guía Docente UGR (Grupo E): <strong>70% Examen Final</strong> (mín. 5.0) · <strong>20% Examen Parcial</strong> · <strong>5% Prácticas</strong> · <strong>5% Trabajos/Seminarios</strong>
          </p>
        </div>

        {/* Action Buttons for Professor */}
        {isProfesor && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={syncFromGoogleSheet}
              disabled={loadingSheet}
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
              title="Sincronizar con la hoja de Google Sheets"
            >
              <RefreshCw size={14} className={loadingSheet ? 'spin' : ''} />
              <span>{loadingSheet ? 'Sincronizando...' : 'Sincronizar Google Sheets'}</span>
            </button>

            <a
              href={`https://docs.google.com/spreadsheets/d/${EVALUATION_SHEET_ID}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
            >
              <FileSpreadsheet size={14} color="#10b981" />
              <span>Abrir Hoja Maestro</span>
              <ExternalLink size={12} />
            </a>

            <button
              onClick={handleExportCsv}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
            >
              <Download size={14} /> Exportar Acta CSV
            </button>
          </div>
        )}
      </div>

      {sheetSyncStatus && isProfesor && (
        <div style={{
          background: sheetSyncStatus.startsWith('✓') ? 'rgba(16, 185, 129, 0.10)' : 'rgba(30, 58, 138, 0.08)',
          border: `1px solid ${sheetSyncStatus.startsWith('✓') ? '#10b981' : 'var(--border-color)'}`,
          borderRadius: '8px',
          padding: '8px 14px',
          fontSize: '0.8rem',
          color: sheetSyncStatus.startsWith('✓') ? '#065f46' : 'var(--navy)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={15} color={sheetSyncStatus.startsWith('✓') ? '#10b981' : 'var(--navy)'} />
          <span>{sheetSyncStatus}</span>
        </div>
      )}

      {/* 4 Official Criteria Breakdown Cards (70 / 20 / 5 / 5) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        
        <div className="qfdos-card card-navy" style={{ padding: '1.25rem', borderTop: '4px solid var(--navy)' }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Examen Final Oficial
          </span>
          <div className="font-mono" style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--navy)', margin: '4px 0' }}>
            70%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Obligatorio · Requiere nota mín. de 5.0 para promediar
          </span>
        </div>

        <div className="qfdos-card card-teal" style={{ padding: '1.25rem', borderTop: '4px solid var(--teal)' }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Examen Parcial
          </span>
          <div className="font-mono" style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--teal)', margin: '4px 0' }}>
            20%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Prueba parcial no eliminatoria (19 Noviembre 2026)
          </span>
        </div>

        <div className="qfdos-card" style={{ padding: '1.25rem', borderTop: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Prácticas de Laboratorio
          </span>
          <div className="font-mono" style={{ fontSize: '2.1rem', fontWeight: 800, color: '#10b981', margin: '4px 0' }}>
            5%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Obligatorio superar el bloque práctico (100% asistencia)
          </span>
        </div>

        <div className="qfdos-card" style={{ padding: '1.25rem', borderTop: '4px solid #8b5cf6' }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Trabajos & Seminarios
          </span>
          <div className="font-mono" style={{ fontSize: '2.1rem', fontWeight: 800, color: '#8b5cf6', margin: '4px 0' }}>
            5%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Participación, casos prácticos y seminarios
          </span>
        </div>
      </div>

      {/* Vista para el Estudiante: Tarjeta de Privacidad y Consulta Individual */}
      {!isProfesor && (
        <div className="qfdos-card" style={{ padding: '1.75rem', marginBottom: '2rem', background: 'var(--surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <UserCheck size={22} color="var(--teal)" />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                Calificaciones de: {user?.name || 'Estudiante'}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Cuenta institucional: {user?.email || 'Sin sesión activa'} (Grupo E)
              </span>
            </div>
          </div>

          {!myStudentProfile ? (
            <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--surface-alt)', borderRadius: '8px' }}>
              <Lock size={32} color="var(--text-muted)" style={{ margin: '0 auto 10px' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '4px' }}>
                No hay calificaciones registradas aún para tu correo institucional
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto' }}>
                Tus notas de exámenes, parciales y prácticas se sincronizarán directamente aquí en cuanto el profesor Dr. Juan José Díaz-Mochón las publique en el acta central.
              </p>
            </div>
          ) : (
            <div>
              {/* Tarjeta de Resumen de Notas del Estudiante */}
              {(() => {
                const { finalExamScore, parcialScore, labScore, trabajosScore, finalScore, isPassed, isExamMinimumMet, isLabApproved } = calculateOfficialGrade(myStudentProfile);
                return (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'var(--surface-alt)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--navy)' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Examen Final (70%)</span>
                      <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: isExamMinimumMet ? 'var(--navy)' : 'var(--accent-red)' }}>
                        {finalExamScore}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: isExamMinimumMet ? '#059669' : '#dc2626' }}>
                        {isExamMinimumMet ? '✓ Mínimo superado (≥ 5.0)' : '⚠ Requiere ≥ 5.0'}
                      </span>
                    </div>

                    <div style={{ background: 'var(--surface-alt)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--teal)' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Parcial (20%)</span>
                      <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--teal)' }}>
                        {parcialScore}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pondera un 20%</span>
                    </div>

                    <div style={{ background: 'var(--surface-alt)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Laboratorio (5%)</span>
                      <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981' }}>
                        {labScore}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: isLabApproved ? '#059669' : '#dc2626' }}>
                        {isLabApproved ? '✓ Prácticas aprobadas' : '⚠ Obligatorio aprobar'}
                      </span>
                    </div>

                    <div style={{ background: 'var(--surface-alt)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #8b5cf6' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Trabajos (5%)</span>
                      <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#8b5cf6' }}>
                        {trabajosScore}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Seminarios & Casos</span>
                    </div>

                    <div style={{
                      background: isPassed ? 'rgba(16, 185, 129, 0.10)' : 'rgba(239, 68, 68, 0.10)',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: `1.5px solid ${isPassed ? '#10b981' : '#f87171'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: isPassed ? '#065f46' : '#991b1b', textTransform: 'uppercase' }}>
                        Calificación Final Ponderada
                      </span>
                      <div className="font-mono" style={{ fontSize: '1.9rem', fontWeight: 800, color: isPassed ? '#047857' : '#b91c1c' }}>
                        {finalScore}
                      </div>
                      <span className="qfdos-badge" style={{ alignSelf: 'flex-start', background: isPassed ? '#10b981' : '#ef4444', color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>
                        {isPassed ? (Number(finalScore) >= 9 ? 'Sobresaliente' : Number(finalScore) >= 7 ? 'Notable' : 'Aprobado') : 'Suspenso'}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* Panel del Profesor: Listado Completo sincronizado con Google Sheets */}
      {isProfesor && (
        <div className="qfdos-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-title)', margin: 0 }}>
                Acta Oficial de Calificaciones del Grupo E ({displayedStudents.length} estudiantes)
              </h3>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Sincronizada en tiempo real con Google Sheets ID: <code style={{ fontFamily: 'var(--font-mono)' }}>{EVALUATION_SHEET_ID}</code>
              </span>
            </div>

            <div style={{ position: 'relative', minWidth: '240px' }}>
              <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Buscar por nombre o correo..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '32px', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          {/* Responsive Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-title)', background: 'var(--surface-alt)' }}>
                  <th style={{ padding: '10px 12px' }}>Estudiante</th>
                  <th style={{ padding: '10px 12px' }}>Correo @go.ugr.es</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Examen Final (70%)</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Parcial (20%)</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Laboratorio (5%)</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Trabajos (5%)</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Nota Final</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Estado</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {displayedStudents.map(s => {
                  const { finalExamScore, parcialScore, labScore, trabajosScore, finalScore, isPassed, isExamMinimumMet, isLabApproved } = calculateOfficialGrade(s);
                  const isEditing = editingEmail === s.email;

                  return (
                    <tr key={s.email} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text-main)' }}>
                        {s.name}
                      </td>
                      <td style={{ padding: '10px 12px', color: 'var(--text-muted)', fontSize: '0.78rem' }} className="font-mono">
                        {s.email}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }} className="font-mono">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            value={editExamenFinal}
                            onChange={e => setEditExamenFinal(parseFloat(e.target.value))}
                            style={{ width: '55px', padding: '2px 4px', fontSize: '0.8rem', textAlign: 'center' }}
                          />
                        ) : (
                          <span style={{ color: isExamMinimumMet ? 'var(--navy)' : 'var(--accent-red)', fontWeight: 700 }}>
                            {finalExamScore}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }} className="font-mono">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            value={editParcial}
                            onChange={e => setEditParcial(parseFloat(e.target.value))}
                            style={{ width: '55px', padding: '2px 4px', fontSize: '0.8rem', textAlign: 'center' }}
                          />
                        ) : (
                          parcialScore
                        )}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }} className="font-mono">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            value={editLab}
                            onChange={e => setEditLab(parseFloat(e.target.value))}
                            style={{ width: '55px', padding: '2px 4px', fontSize: '0.8rem', textAlign: 'center' }}
                          />
                        ) : (
                          <span style={{ color: isLabApproved ? 'inherit' : 'var(--accent-red)' }}>
                            {labScore}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }} className="font-mono">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            value={editTrabajos}
                            onChange={e => setEditTrabajos(parseFloat(e.target.value))}
                            style={{ width: '55px', padding: '2px 4px', fontSize: '0.8rem', textAlign: 'center' }}
                          />
                        ) : (
                          trabajosScore
                        )}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }} className="font-mono">
                        <strong style={{ fontSize: '1rem', color: isPassed ? 'var(--navy)' : 'var(--accent-red)' }}>
                          {finalScore}
                        </strong>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <span className={`qfdos-badge ${isPassed ? (Number(finalScore) >= 9 ? 'badge-emerald' : 'badge-teal') : 'badge-amber'}`} style={{ fontSize: '0.68rem' }}>
                          {Number(finalScore) >= 9 ? 'Sobresaliente' : isPassed ? 'Aprobado' : 'Suspenso'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveEdit(s.email)}
                            className="btn btn-sm btn-primary"
                            style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                          >
                            <Save size={12} /> Guardar
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(s)}
                            className="btn btn-sm btn-outline"
                            style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                          >
                            <Edit3 size={12} /> Editar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
