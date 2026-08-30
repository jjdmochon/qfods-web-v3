import React, { useState } from 'react';
import { QfdosTopic, TestQuestion, QuizAttempt } from '../data/qfdosData';
import { useAuth } from '../context/AuthContext';
import { Chem2DDrawer } from './Chem2DDrawer';
import { 
  X, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw, 
  Award,
  BookOpen
} from 'lucide-react';

interface QuizModalProps {
  topic: QfdosTopic;
  onClose: () => void;
  onAttemptCompleted?: (attempt: QuizAttempt) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  topic,
  onClose,
  onAttemptCompleted
}) => {
  const { user } = useAuth();
  const questions = topic.testQuestions || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [isCompleted, setIsCompleted] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Autoevaluación no disponible</h3>
            <button onClick={onClose} className="btn btn-sm btn-outline"><X size={18} /></button>
          </div>
          <div className="modal-body" style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No hay preguntas configuradas para esta unidad todavía.</p>
          </div>
          <div className="modal-footer">
            <button onClick={onClose} className="btn btn-primary">Cerrar</button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ: TestQuestion = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setShowExplanation(true);
    setAnswers(prev => ({ ...prev, [currentIndex]: selectedOption }));
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // Quiz Finished! Calculate score
      let correct = 0;
      questions.forEach((q, idx) => {
        if (answers[idx] === q.correctIndex || (idx === currentIndex && selectedOption === q.correctIndex)) {
          correct++;
        }
      });

      const finalScore = Number(((correct / questions.length) * 10).toFixed(1));
      const attempt: QuizAttempt = {
        id: `att_${Date.now()}`,
        studentEmail: user?.email ?? '',
        studentName: user?.name ?? '',
        topicId: topic.id,
        score: finalScore,
        correctCount: correct,
        totalQuestions: questions.length,
        timestamp: new Date().toLocaleDateString('es-ES')
      };

      // Save to localStorage
      try {
        const savedAttempts: QuizAttempt[] = JSON.parse(localStorage.getItem('qfdos_v2_quiz_attempts') || '[]');
        savedAttempts.push(attempt);
        localStorage.setItem('qfdos_v2_quiz_attempts', JSON.stringify(savedAttempts));
      } catch (e) {
        console.error('Error saving quiz attempt', e);
      }

      if (onAttemptCompleted) {
        onAttemptCompleted(attempt);
      }

      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setAnswers({});
    setIsCompleted(false);
  };

  const calculateFinalScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) correct++;
    });
    return {
      correct,
      total: questions.length,
      score: ((correct / questions.length) * 10).toFixed(1)
    };
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container" 
        style={{ maxWidth: '720px' }} 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={20} color="var(--teal-ink)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-title)' }}>
              Autoevaluación: {topic.number}
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-outline"><X size={18} /></button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {!isCompleted ? (
            <div>
              {/* Progress & Difficulty Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy-ink)' }}>
                  Pregunta {currentIndex + 1} de {questions.length}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {currentQ.block && (
                    <span className="qfdos-badge badge-teal" style={{ fontSize: '0.68rem' }}>
                      {currentQ.block}
                    </span>
                  )}
                  {currentQ.difficulty && (
                    <span className="qfdos-badge badge-amber" style={{ fontSize: '0.68rem' }}>
                      Nivel {currentQ.difficulty}
                    </span>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-title)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                {currentQ.question}
              </div>

              {/* Optional SMILES Structure for Question */}
              {currentQ.questionSmiles && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Chem2DDrawer smiles={currentQ.questionSmiles} width={260} height={120} />
                </div>
              )}

              {/* Options List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.25rem' }}>
                {currentQ.options.map((opt, idx) => {
                  const optText = typeof opt === 'string' ? opt : opt.text;
                  const optSmiles = typeof opt === 'string' ? undefined : opt.smiles;

                  let optionBg = 'var(--surface)';
                  let optionBorder = 'var(--border-color)';

                  if (selectedOption === idx) {
                    optionBg = 'var(--primary-bg)';
                    optionBorder = 'var(--navy)';
                  }

                  if (showExplanation) {
                    if (idx === currentQ.correctIndex) {
                      optionBg = 'rgba(16, 185, 129, 0.12)';
                      optionBorder = '#10b981';
                    } else if (selectedOption === idx) {
                      optionBg = 'rgba(239, 68, 68, 0.12)';
                      optionBorder = '#ef4444';
                    }
                  }

                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${optionBorder}`,
                        background: optionBg,
                        cursor: showExplanation ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span 
                          className="font-mono" 
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: selectedOption === idx ? 'var(--navy)' : 'var(--surface-alt)',
                            color: selectedOption === idx ? '#fff' : 'var(--text-main)',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                          {optText}
                        </span>
                      </div>

                      {optSmiles && (
                        <Chem2DDrawer smiles={optSmiles} width={120} height={60} />
                      )}

                      {showExplanation && idx === currentQ.correctIndex && (
                        <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />
                      )}
                      {showExplanation && selectedOption === idx && idx !== currentQ.correctIndex && (
                        <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation Card */}
              {showExplanation && (
                <div 
                  className="qfdos-card" 
                  style={{
                    background: selectedOption === currentQ.correctIndex ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                    borderColor: selectedOption === currentQ.correctIndex ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                    padding: '1rem',
                    marginBottom: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <BookOpen size={16} color={selectedOption === currentQ.correctIndex ? '#059669' : '#dc2626'} />
                    <strong style={{ fontSize: '0.88rem', color: selectedOption === currentQ.correctIndex ? '#047857' : '#b91c1c' }}>
                      {selectedOption === currentQ.correctIndex ? '¡Respuesta Correcta!' : 'Explicación Pedagógica:'}
                    </strong>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    {currentQ.explanation}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Results Screen */
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-bg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Award size={36} color="var(--navy-ink)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '6px' }}>
                ¡Autoevaluación Finalizada!
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Resultado registrado en tu portafolio de evaluación continua
              </p>

              {(() => {
                const stats = calculateFinalScore();
                return (
                  <div className="qfdos-card" style={{ maxWidth: '360px', margin: '0 auto 1.5rem', padding: '1.25rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Calificación Obtenida:</span>
                    <div className="font-mono" style={{ fontSize: '2.5rem', fontWeight: 900, color: Number(stats.score) >= 5 ? 'var(--teal)' : 'var(--accent-red)' }}>
                      {stats.score} <span style={{ fontSize: '1.2rem' }}>/ 10</span>
                    </div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {stats.correct} aciertos de {stats.total} preguntas
                    </span>
                  </div>
                );
              })()}

              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button onClick={handleRestart} className="btn btn-outline">
                  <RotateCcw size={15} /> Repetir Cuestionario
                </button>
                <button onClick={onClose} className="btn btn-primary">
                  Finalizar & Volver
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isCompleted && (
          <div className="modal-footer">
            {!showExplanation ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
                className="btn btn-primary"
              >
                Comprobar Respuesta
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="btn btn-secondary"
              >
                {currentIndex < questions.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados'} <ArrowRight size={14} />
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
