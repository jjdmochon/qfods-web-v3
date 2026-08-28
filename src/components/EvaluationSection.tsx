import React, { useState } from 'react';
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
  Save 
} from 'lucide-react';

export const EvaluationSection: React.FC = () => {
  const { isProfesor, user } = useAuth();
  const [students, setStudents] = useState<StudentEvaluationProfile[]>(() => {
    const saved = localStorage.getItem('qfdos_v2_evaluations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved evaluations', e);
      }
    }
    return INITIAL_STUDENT_EVALUATION_DATA;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [editLab, setEditLab] = useState<number>(0);
  const [editProj, setEditProj] = useState<number>(0);

  const calculateFinalGrade = (student: StudentEvaluationProfile) => {
    const avgTestScore = student.attempts.length > 0
      ? student.attempts.reduce((sum, a) => sum + a.score, 0) / student.attempts.length
      : 0;

    // Weighting: 70% Exams/Tests, 15% Lab, 15% Project
    const finalScore = (avgTestScore * 0.7) + (student.labGrade * 0.15) + (student.projectGrade * 0.15);
    return {
      avgTestScore: avgTestScore.toFixed(1),
      finalScore: finalScore.toFixed(2),
      isPassed: finalScore >= 5.0
    };
  };

  const handleExportCsv = () => {
    const headers = ['Nombre Alumno', 'Correo UGR', 'Media Cuestionarios (70%)', 'Laboratorio (15%)', 'Proyecto (15%)', 'Nota Final'];
    const rows = students.map(s => {
      const { avgTestScore, finalScore } = calculateFinalGrade(s);
      return `"${s.name}","${s.email}",${avgTestScore},${s.labGrade},${s.projectGrade},${finalScore}`;
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Acta_Evaluacion_Continua_QFDOS_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStartEdit = (s: StudentEvaluationProfile) => {
    setEditingEmail(s.email);
    setEditLab(s.labGrade);
    setEditProj(s.projectGrade);
  };

  const handleSaveEdit = (email: string) => {
    const updated = students.map(s => {
      if (s.email === email) {
        return {
          ...s,
          labGrade: Number(editLab) || 0,
          projectGrade: Number(editProj) || 0
        };
      }
      return s;
    });

    setStudents(updated);
    localStorage.setItem('qfdos_v2_evaluations', JSON.stringify(updated));
    setEditingEmail(null);
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <GraduationCap size={24} color="var(--navy)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-title)' }}>
              Matriz de Evaluación Continua & Actas
            </h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Cómputo ponderado oficial: 70% Examen/Tests · 15% Prácticas de Laboratorio · 15% Seminarios/Proyecto
          </p>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportCsv}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Download size={15} /> Exportar Acta CSV
        </button>
      </div>

      {/* Breakdown Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        
        <div className="qfdos-card card-navy" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Exámenes & Tests Oficiales</span>
          <div className="font-mono" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy)', margin: '4px 0' }}>
            70%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Convocatoria oficial & cuestionarios de tema
          </span>
        </div>

        <div className="qfdos-card card-teal" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Prácticas de Laboratorio</span>
          <div className="font-mono" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--teal)', margin: '4px 0' }}>
            15%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Trabajo experimental, informes y seguridad
          </span>
        </div>

        <div className="qfdos-card card-mint" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Seminarios & Proyecto SAR</span>
          <div className="font-mono" style={{ fontSize: '2rem', fontWeight: 800, color: '#0d9488', margin: '4px 0' }}>
            15%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Participación activa, casos clínicos y podcast
          </span>
        </div>
      </div>

      {/* Search & Student Evaluation Table */}
      <div className="qfdos-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-title)' }}>
            Listado Oficial de Estudiantes Matriculados ({filteredStudents.length})
          </h3>
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Buscar estudiante..."
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
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-title)' }}>
                <th style={{ padding: '10px 12px' }}>Estudiante</th>
                <th style={{ padding: '10px 12px' }}>Correo UGR</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Tests (70%)</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Laboratorio (15%)</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Proyecto (15%)</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Nota Final</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Estado</th>
                {isProfesor && <th style={{ padding: '10px 12px', textAlign: 'center' }}>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(s => {
                const { avgTestScore, finalScore, isPassed } = calculateFinalGrade(s);
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
                      <strong>{avgTestScore}</strong> <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({s.attempts.length} tests)</span>
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
                          style={{ width: '60px', padding: '2px 4px', fontSize: '0.8rem', textAlign: 'center' }}
                        />
                      ) : (
                        s.labGrade.toFixed(1)
                      )}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }} className="font-mono">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={editProj}
                          onChange={e => setEditProj(parseFloat(e.target.value))}
                          style={{ width: '60px', padding: '2px 4px', fontSize: '0.8rem', textAlign: 'center' }}
                        />
                      ) : (
                        s.projectGrade.toFixed(1)
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
                    {isProfesor && (
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
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
