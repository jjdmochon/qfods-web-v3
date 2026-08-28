import { Chem2DDrawer } from '../Chem2DDrawer';
import React, { useState, useEffect } from 'react';
import {
  PRACTICE_EXAM_QUESTIONS,
  PracticeExamQuestion
} from '../../data/practicasData';
import {
  GraduationCap, Clock, CheckCircle2, AlertCircle, RefreshCw,
  Award, FileText, ChevronRight, HelpCircle, Sparkles, Filter, Scale, Calculator, Info
} from 'lucide-react';

export const PracticasExamSimulator: React.FC = () => {
  const [examMode, setExamMode] = useState<'full' | 'category'>('full');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Active questions in session
  const [questions, setQuestions] = useState<PracticeExamQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: number }>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(1200); // 20 min in seconds
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Initialize or reset exam
  const startExam = (mode: 'full' | 'category', cat = 'all') => {
    let pool = [...PRACTICE_EXAM_QUESTIONS];
    if (mode === 'category' && cat !== 'all') {
      pool = pool.filter(q => q.category === cat);
    } else {
      // Shuffle and pick 10 or all
      pool = pool.sort(() => 0.5 - Math.random());
    }
    setQuestions(pool);
    setCurrentIdx(0);
    setUserAnswers({});
    setIsFinished(false);
    setTimeLeft(pool.length * 120); // 2 min per question
    setIsTimerRunning(true);
  };

  useEffect(() => {
    startExam(examMode, selectedCategory);
  }, [examMode, selectedCategory]);

  // Timer countdown
  useEffect(() => {
    if (!isTimerRunning || isFinished) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsFinished(true);
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, isFinished]);

  const handleSelectOption = (optIdx: number) => {
    if (isFinished) return;
    const q = questions[currentIdx];
    setUserAnswers(prev => ({
      ...prev,
      [q.id]: optIdx
    }));
  };

  const handleFinishExam = () => {
    setIsFinished(true);
    setIsTimerRunning(false);
  };

  // Calculate score
  const scoreResults = React.useMemo(() => {
    let correctCount = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctOptionIndex) {
        correctCount += 1;
      }
    });
    const total = questions.length || 1;
    const scoreOver10 = (correctCount / total) * 10;
    return {
      correctCount,
      total,
      scoreOver10: scoreOver10.toFixed(2),
      isPassed: scoreOver10 >= 5.0
    };
  }, [questions, userAnswers]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentQ = questions[currentIdx];

  const CATEGORY_NAMES: { [k: string]: string } = {
    all: 'Todas las Categorías',
    rendimiento: 'Rendimientos y Estequiometría',
    disoluciones: 'Preparación de Disoluciones',
    espectroscopia: 'RMN ¹H / ¹³C y Masas',
    material_y_operaciones: 'Material y Operaciones de Lab',
    mecanismo: 'Mecanismos de Reacción'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header & Controls */}
      <div className="qfdos-card" style={{ padding: '1.5rem', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <span className="qfdos-badge badge-teal" style={{ marginBottom: '0.4rem' }}>
              <GraduationCap size={12} /> SIMULADOR OFICIAL DE EXAMEN DE PRÁCTICAS
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-title)', margin: '0.2rem 0' }}>
              Simulador del Examen de Prácticas de Laboratorio
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
              Evalúa tus competencias en estequiometría, cálculo de disoluciones, elucidación de RMN/MS y montajes.
            </p>
          </div>

          {/* Exam Mode Toggle */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setExamMode('full');
                setSelectedCategory('all');
              }}
              className={`btn btn-sm ${examMode === 'full' ? 'btn-navy' : 'btn-outline'}`}
              style={{ fontWeight: examMode === 'full' ? 700 : 500, fontSize: '0.78rem' }}
            >
              Examen Global Cronometrado
            </button>
            <button
              onClick={() => setExamMode('category')}
              className={`btn btn-sm ${examMode === 'category' ? 'btn-navy' : 'btn-outline'}`}
              style={{ fontWeight: examMode === 'category' ? 700 : 500, fontSize: '0.78rem' }}
            >
              Entrenamiento por Temas
            </button>
          </div>
        </div>

        {/* Category sub-filter when in category mode */}
        {examMode === 'category' && (
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem', padding: '8px', background: 'var(--surface-muted)', borderRadius: '8px' }}>
            {Object.keys(CATEGORY_NAMES).map(catKey => (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`btn btn-xs ${selectedCategory === catKey ? 'btn-teal' : 'btn-ghost'}`}
                style={{ fontSize: '0.74rem', fontWeight: 600 }}
              >
                {CATEGORY_NAMES[catKey]}
              </button>
            ))}
          </div>
        )}

        {/* Status bar */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30,58,138,0.06) 0%, rgba(13,148,136,0.04) 100%)',
          borderRadius: '8px',
          padding: '0.75rem 1.25rem',
          borderLeft: '4px solid var(--teal)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-title)' }}>
              Pregunta {currentIdx + 1} de {questions.length}
            </span>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Respondidas: <strong>{Object.keys(userAnswers).length}</strong> / {questions.length}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: timeLeft < 180 ? '#ef4444' : 'var(--navy)', fontWeight: 800, fontSize: '0.9rem' }}>
              <Clock size={16} />
              <span className="font-tech">{formatTime(timeLeft)}</span>
            </div>

            {!isFinished ? (
              <button
                onClick={handleFinishExam}
                className="btn btn-xs btn-outline"
                style={{ fontWeight: 700 }}
              >
                Finalizar y Calificar
              </button>
            ) : (
              <button
                onClick={() => startExam(examMode, selectedCategory)}
                className="btn btn-xs btn-teal"
                style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <RefreshCw size={12} /> Repetir Examen
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Question View or Results Screen */}
      {!isFinished ? (
        currentQ ? (
          <div className="qfdos-card" style={{ padding: '1.75rem' }}>
            
            {/* Category tag */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="qfdos-badge badge-navy" style={{ fontSize: '0.7rem' }}>
                {CATEGORY_NAMES[currentQ.category] || currentQ.category.toUpperCase()}
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Pregunta #{currentQ.id}
              </span>
            </div>

            {/* Scenario */}
            {currentQ.scenario && (
              <div style={{
                background: 'rgba(30,58,138,0.04)',
                borderLeft: '4px solid var(--navy)',
                padding: '0.85rem 1.1rem',
                borderRadius: '8px',
                fontSize: '0.86rem',
                color: 'var(--text-main)',
                lineHeight: 1.55,
                marginBottom: '1rem'
              }}>
                <strong>Planteamiento:</strong> {currentQ.scenario}
              </div>
            )}

            {/* Chemical Structures Showcase for Molecular Weight & Yield Calculation */}
            {currentQ.structures && currentQ.structures.length > 0 && (
              <div style={{
                background: 'var(--surface-muted)',
                border: '1.5px solid var(--border)',
                borderRadius: '12px',
                padding: '1.1rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Scale size={15} color="var(--teal)" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--navy)' }}>
                      Estructuras Químicas para Deducir los Pesos Moleculares (PM):
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    C=12,011 · H=1,008 · O=15,999 · N=14,007 · Cl=35,453 g/mol
                  </span>
                </div>

                {/* Grid of Structure Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  {currentQ.structures.map((st, sIdx) => {
                    const isProduct = st.role === 'producto_deseado';
                    return (
                      <div
                        key={sIdx}
                        style={{
                          background: '#ffffff',
                          border: `1.5px solid ${isProduct ? 'var(--navy)' : 'var(--border)'}`,
                          borderRadius: '8px',
                          padding: '0.65rem',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                        }}
                      >
                        <span
                          className="qfdos-badge"
                          style={{
                            fontSize: '0.66rem',
                            fontWeight: 700,
                            marginBottom: '4px',
                            background: isProduct ? '#eff6ff' : '#f0fdf4',
                            color: isProduct ? 'var(--navy)' : '#15803d'
                          }}
                        >
                          {isProduct ? '★ PRODUCTO FINAL' : st.amount ? `REACTIVO (${st.amount})` : 'REACTIVO'}
                        </span>

                        <strong style={{ fontSize: '0.78rem', color: 'var(--text-title)', textAlign: 'center', marginBottom: '2px' }}>
                          {st.name}
                        </strong>

                        <div style={{
                          background: '#ffffff',
                          width: '100%',
                          height: '110px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}>
                          <Chem2DDrawer smiles={st.smiles} width={180} height={105} />
                        </div>

                        <div style={{
                          width: '100%',
                          marginTop: '4px',
                          paddingTop: '4px',
                          borderTop: '1px solid var(--border-color)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.7rem',
                          color: 'var(--text-muted)'
                        }}>
                          <span>Fórmula: <strong className="font-tech">{st.formula}</strong></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Question statement */}
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-title)', lineHeight: 1.55, margin: '0 0 1.25rem 0' }}>
              {currentQ.questionText}
            </h3>

            {/* Options list */}
            {currentQ.options && currentQ.options.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = userAnswers[currentQ.id] === oIdx;

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(oIdx)}
                      style={{
                        background: isSelected ? 'rgba(30,58,138,0.08)' : 'var(--surface-muted)',
                        border: `1.5px solid ${isSelected ? 'var(--navy)' : 'var(--border-color)'}`,
                        borderRadius: '8px',
                        padding: '0.85rem 1.1rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.86rem',
                        color: 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: isSelected ? 'var(--navy)' : '#fff',
                        color: isSelected ? '#fff' : 'var(--text-title)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        flexShrink: 0
                      }}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span style={{ fontWeight: isSelected ? 600 : 400 }}>{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Question navigation footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <button
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="btn btn-sm btn-outline"
                style={{ opacity: currentIdx === 0 ? 0.4 : 1 }}
              >
                ← Anterior
              </button>

              {/* Question pager dots */}
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', maxWidth: '400px', justifyContent: 'center' }}>
                {questions.map((q, idx) => {
                  const isAnswered = userAnswers[q.id] !== undefined;
                  const isCurrent = currentIdx === idx;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        border: '1px solid var(--border-color)',
                        background: isCurrent ? 'var(--navy)' : isAnswered ? 'var(--teal)' : 'var(--surface-muted)',
                        color: isCurrent || isAnswered ? '#fff' : 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {currentIdx < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                  className="btn btn-sm btn-navy"
                >
                  Siguiente →
                </button>
              ) : (
                <button
                  onClick={handleFinishExam}
                  className="btn btn-sm btn-teal"
                  style={{ fontWeight: 700 }}
                >
                  Entregar Examen ✓
                </button>
              )}
            </div>

          </div>
        ) : null
      ) : (
        /* RESULTS REPORT CARD */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="qfdos-card" style={{ padding: '2rem', textAlign: 'center', borderTop: `5px solid ${scoreResults.isPassed ? '#10b981' : '#ef4444'}` }}>
            <Award size={48} color={scoreResults.isPassed ? '#10b981' : '#ef4444'} style={{ margin: '0 auto 0.5rem auto' }} />
            
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-title)', margin: '0 0 0.5rem 0' }}>
              {scoreResults.isPassed ? '¡Enhorabuena! Has Aprobado el Simulador' : 'Examen No Superado — Conviene Repasar'}
            </h3>

            <div style={{
              fontSize: '3.5rem',
              fontWeight: 900,
              fontFamily: 'Montserrat, sans-serif',
              color: scoreResults.isPassed ? '#059669' : '#dc2626',
              margin: '0.5rem 0'
            }}>
              {scoreResults.scoreOver10} <span style={{ fontSize: '1.4rem', color: 'var(--text-muted)' }}>/ 10.0</span>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 1.25rem 0' }}>
              Has acertado <strong>{scoreResults.correctCount}</strong> de <strong>{scoreResults.total}</strong> preguntas ({((scoreResults.correctCount / scoreResults.total) * 100).toFixed(1)}%).
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                onClick={() => startExam(examMode, selectedCategory)}
                className="btn btn-navy"
                style={{ fontWeight: 700 }}
              >
                <RefreshCw size={14} style={{ marginRight: '6px' }} /> Intentar Nuevo Examen
              </button>
            </div>
          </div>

          {/* Detailed Question by Question Review */}
          <div className="qfdos-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ margin: '0 0 1.25rem 0', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-title)' }}>
              Revisión Detallada de Respuestas y Soluciones Paso a Paso
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {questions.map((q, idx) => {
                const userAns = userAnswers[q.id];
                const isCorrect = q.correctOptionIndex !== undefined && userAns === q.correctOptionIndex;

                return (
                  <div
                    key={q.id}
                    style={{
                      background: isCorrect ? 'rgba(16,185,129,0.04)' : 'rgba(239,68,68,0.04)',
                      border: `1.5px solid ${isCorrect ? '#10b981' : '#ef4444'}`,
                      borderRadius: '8px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: isCorrect ? '#059669' : '#dc2626' }}>
                        {isCorrect ? '✓ PREGUNTA CORRECTA' : '✗ PREGUNTA INCORRECTA'} #{idx + 1}
                      </span>
                      <span className="qfdos-badge" style={{ fontSize: '0.68rem' }}>
                        {CATEGORY_NAMES[q.category] || q.category}
                      </span>
                    </div>

                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-title)' }}>
                      {q.questionText}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>
                      <div>Tu respuesta: <strong>{userAns !== undefined && q.options ? `${String.fromCharCode(65 + userAns)}) ${q.options[userAns]}` : 'No respondida'}</strong></div>
                      {!isCorrect && q.correctOptionIndex !== undefined && q.options && (
                        <div style={{ color: '#059669', marginTop: '2px' }}>
                          Respuesta correcta: <strong>{String.fromCharCode(65 + q.correctOptionIndex)}) {q.options[q.correctOptionIndex]}</strong>
                        </div>
                      )}
                    </div>

                    {/* Step-by-Step Explanation */}
                    <div style={{
                      marginTop: '0.25rem',
                      padding: '8px 12px',
                      background: '#fff',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.5
                    }}>
                      <strong style={{ color: 'var(--text-title)' }}>Explicación y Desglose:</strong> {q.explanation}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
