import React, { useState } from 'react';
import { QfdosTopic, StudentQuestion, INITIAL_STUDENT_QUESTIONS } from '../data/qfdosData';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Clock, 
  UserCheck 
} from 'lucide-react';

interface StudentQuestionModalProps {
  topics: QfdosTopic[];
  onClose: () => void;
}

export const StudentQuestionModal: React.FC<StudentQuestionModalProps> = ({
  topics,
  onClose
}) => {
  const { user } = useAuth();

  const [questionsList, setQuestionsList] = useState<StudentQuestion[]>(() => {
    const saved = localStorage.getItem('qfdos_v2_student_questions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved questions', e);
      }
    }
    return INITIAL_STUDENT_QUESTIONS;
  });

  const [selectedTopicId, setSelectedTopicId] = useState(topics[0]?.id || 'tema-00');
  const [studentName, setStudentName] = useState(user?.name ?? '');
  const [studentEmail, setStudentEmail] = useState(user?.email ?? '');
  const [questionText, setQuestionText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    const topic = topics.find(t => t.id === selectedTopicId);
    const newQuestion: StudentQuestion = {
      id: `sq_${Date.now()}`,
      topicId: selectedTopicId,
      topicTitle: topic ? `${topic.number}: ${topic.title}` : 'Tema General',
      studentName: studentName.trim() || 'Estudiante UGR',
      studentEmail: studentEmail.trim() || 'estudiante@correo.ugr.es',
      question: questionText.trim(),
      timestamp: new Date().toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'pendiente'
    };

    const updated = [newQuestion, ...questionsList];
    setQuestionsList(updated);
    localStorage.setItem('qfdos_v2_student_questions', JSON.stringify(updated));

    setQuestionText('');
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container" 
        style={{ maxWidth: '820px', height: '85vh' }} 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={20} color="var(--teal-ink)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)' }}>
              Buzón de Dudas & Consultas Académicas
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-outline"><X size={18} /></button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* New Question Form */}
          <div className="qfdos-card card-teal" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '10px' }}>
              Plantear una nueva duda al profesorado de QFDOS
            </h4>

            {isSubmitted && (
              <div style={{ padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', color: '#047857', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <CheckCircle2 size={16} /> ¡Tu pregunta ha sido registrada con éxito! El profesorado la responderá a la brevedad.
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '2px' }}>
                    Unidad Temática:
                  </label>
                  <select
                    value={selectedTopicId}
                    onChange={e => setSelectedTopicId(e.target.value)}
                    className="form-select"
                  >
                    {topics.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.number}: {t.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '2px' }}>
                    Nombre del Estudiante:
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    className="form-input"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '2px' }}>
                  Detalle de la consulta (mecanismo, SAR, examen, termodinámica):
                </label>
                <textarea
                  value={questionText}
                  onChange={e => setQuestionText(e.target.value)}
                  className="form-textarea"
                  rows={3}
                  placeholder="Escribe aquí tu duda de forma concisa..."
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-secondary">
                  <Send size={14} /> Enviar Pregunta
                </button>
              </div>
            </form>
          </div>

          {/* List of Previous Questions & Responses */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={16} color="var(--navy-ink)" />
              Historial de Consultas Respondidas ({questionsList.length})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {questionsList.map(q => (
                <div key={q.id} className="qfdos-card" style={{ padding: '1rem', background: 'var(--surface-alt)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="qfdos-badge badge-navy" style={{ fontSize: '0.7rem' }}>
                      {q.topicTitle}
                    </span>
                    <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {q.timestamp}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '4px' }}>
                    «{q.question}»
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                    Planteada por: {q.studentName}
                  </span>

                  {/* Professor Response */}
                  {q.response ? (
                    <div style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(30, 58, 138, 0.08)',
                      borderLeft: '3px solid var(--navy)',
                      fontSize: '0.82rem',
                      color: 'var(--text-main)',
                      lineHeight: 1.5
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--navy-ink)', fontWeight: 700, marginBottom: '2px', fontSize: '0.78rem' }}>
                        <UserCheck size={14} /> Respuesta del Profesor (Dr. Juan José Díaz-Mochón):
                      </div>
                      {q.response}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#b45309', fontSize: '0.75rem' }}>
                      <Clock size={13} /> Pendiente de revisión docente
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-primary">
            Cerrar Buzón
          </button>
        </div>

      </div>
    </div>
  );
};
