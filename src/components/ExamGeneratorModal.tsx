import React, { useState } from 'react';
import { QfdosTopic, TestQuestion, TestQuestionOption } from '../data/qfdosData';
import { 
  generateExamQuestionsWithGemini, 
  getStoredGeminiApiKey 
} from '../services/geminiService';
import { Chem2DDrawer } from './Chem2DDrawer';
import { 
  X, 
  FileText, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  Download, 
  PlusCircle, 
  Check, 
  HelpCircle,
  Award,
  Atom,
  Layers,
  Edit3
} from 'lucide-react';

interface ExamGeneratorModalProps {
  topics: QfdosTopic[];
  onClose: () => void;
  onQuestionsAddedToTopic?: (topicId: string, questions: TestQuestion[]) => void;
}

export const ExamGeneratorModal: React.FC<ExamGeneratorModalProps> = ({
  topics,
  onClose,
  onQuestionsAddedToTopic
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'manual'>('ai');
  const [selectedTopicId, setSelectedTopicId] = useState(topics[0]?.id || 'tema-00');
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [difficulty, setDifficulty] = useState<'Fácil' | 'Medio' | 'Avanzado'>('Medio');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<TestQuestion[]>([]);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Manual Question Builder State
  const [manualQuestion, setManualQuestion] = useState('');
  const [manualQuestionSmiles, setManualQuestionSmiles] = useState('');
  const [manualOptions, setManualOptions] = useState<TestQuestionOption[]>([
    { text: 'Opción A', smiles: '' },
    { text: 'Opción B', smiles: '' },
    { text: 'Opción C', smiles: '' },
    { text: 'Opción D', smiles: '' }
  ]);
  const [manualCorrectIndex, setManualCorrectIndex] = useState(0);
  const [manualExplanation, setManualExplanation] = useState('');
  const [manualBlock, setManualBlock] = useState('Reactividad & Mecanismo');

  const selectedTopic = topics.find(t => t.id === selectedTopicId) || topics[0];

  const handleGenerate = async () => {
    setIsLoading(true);
    setAddedSuccess(false);

    try {
      const results = await generateExamQuestionsWithGemini({
        topicId: selectedTopicId,
        topicTitle: `${selectedTopic.number}: ${selectedTopic.title}`,
        questionCount,
        difficulty
      });
      setGeneratedQuestions(results);
    } catch (e) {
      console.error('Error generating exam questions', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToTopic = () => {
    if (onQuestionsAddedToTopic && generatedQuestions.length > 0) {
      onQuestionsAddedToTopic(selectedTopicId, generatedQuestions);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 3000);
    }
  };

  const handleAddManualQuestion = () => {
    if (!manualQuestion.trim()) return;

    const newQ: TestQuestion = {
      id: `manual_q_${Date.now()}`,
      topicId: selectedTopicId,
      block: manualBlock,
      question: manualQuestion,
      questionSmiles: manualQuestionSmiles.trim() || undefined,
      options: manualOptions.map(opt => ({
        text: opt.text,
        smiles: opt.smiles?.trim() || undefined
      })),
      correctIndex: manualCorrectIndex,
      explanation: manualExplanation || 'Explicación del profesorado.',
      difficulty
    };

    if (onQuestionsAddedToTopic) {
      onQuestionsAddedToTopic(selectedTopicId, [newQ]);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 3000);
    }

    // Reset Form
    setManualQuestion('');
    setManualQuestionSmiles('');
    setManualExplanation('');
    setManualOptions([
      { text: '', smiles: '' },
      { text: '', smiles: '' },
      { text: '', smiles: '' },
      { text: '', smiles: '' }
    ]);
  };

  const handleExportMarkdown = () => {
    if (generatedQuestions.length === 0) return;
    const content = `# 📝 Examen Oficial: ${selectedTopic.number} — ${selectedTopic.title}
*Nivel:* ${difficulty} | *Preguntas:* ${generatedQuestions.length} | *Fecha:* ${new Date().toLocaleDateString('es-ES')}

` + generatedQuestions.map((q, idx) => `
### Pregunta ${idx + 1}:
${q.question}
${q.questionSmiles ? `**Estructura SMILES:** \`${q.questionSmiles}\`\n` : ''}
${q.options.map((opt, oIdx) => {
  const text = typeof opt === 'string' ? opt : opt.text;
  const smiles = typeof opt === 'string' ? '' : opt.smiles ? ` (SMILES: ${opt.smiles})` : '';
  return `${String.fromCharCode(65 + oIdx)}) ${text}${smiles}`;
}).join('\n')}

**Respuesta Correcta:** ${String.fromCharCode(65 + q.correctIndex)}  
**Explicación Razonada:** ${q.explanation}
`).join('\n---\n');

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Examen_${selectedTopic.number.replace(/\s+/g, '_')}_${difficulty}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container" 
        style={{ maxWidth: '900px', height: '90vh' }} 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={22} color="var(--teal)" />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                Generador & Editor de Preguntas de Examen
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Diseña baterías tipo test con estructuras moleculares 2D y feedback razonado
              </span>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-outline"><X size={18} /></button>
        </div>

        {/* Tab Switcher */}
        <div style={{ padding: '0 1.75rem', background: 'var(--surface-raised)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="tabs-container" style={{ margin: 0 }}>
            <button
              onClick={() => setActiveTab('ai')}
              className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
            >
              <Sparkles size={14} /> Generación Asistida por IA (Gemini)
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`tab-btn ${activeTab === 'manual' ? 'active' : ''}`}
            >
              <Edit3 size={14} /> Redacción Manual con Estructuras Químicas 2D
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* TAB 1: AI Generator */}
          {activeTab === 'ai' && (
            <>
              {/* Controls Bar */}
              <div className="qfdos-card" style={{ padding: '1.25rem', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  {/* Topic */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '3px' }}>
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

                  {/* Number of questions */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '3px' }}>
                      Número de Preguntas:
                    </label>
                    <select
                      value={questionCount}
                      onChange={e => setQuestionCount(parseInt(e.target.value))}
                      className="form-select"
                    >
                      <option value={2}>2 Preguntas</option>
                      <option value={3}>3 Preguntas</option>
                      <option value={5}>5 Preguntas</option>
                      <option value={8}>8 Preguntas</option>
                    </select>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '3px' }}>
                      Nivel de Dificultad:
                    </label>
                    <select
                      value={difficulty}
                      onChange={e => setDifficulty(e.target.value as any)}
                      className="form-select"
                    >
                      <option value="Fácil">Fácil (Conceptos básicos & definiciones)</option>
                      <option value="Medio">Medio (SAR & mecanismos estándar)</option>
                      <option value="Avanzado">Avanzado (Biofísica, enantiómeros & dianas)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="btn btn-secondary btn-lg"
                  style={{ width: '100%', fontWeight: 700 }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="anim-spin-slow" /> Diseñando Batería de Examen con Gemini...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} /> Generar Preguntas de Examen
                    </>
                  )}
                </button>
              </div>

              {/* Generated Questions List */}
              {generatedQuestions.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <span className="qfdos-badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                      ✓ {generatedQuestions.length} Preguntas Generadas para {selectedTopic.number} (Nivel {difficulty})
                    </span>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={handleExportMarkdown} className="btn btn-sm btn-outline">
                        <Download size={13} /> Exportar Examen .md
                      </button>
                      <button onClick={handleAddToTopic} className="btn btn-sm btn-mint">
                        <PlusCircle size={13} /> {addedSuccess ? '¡Añadidas al Tema!' : 'Integrar en la Asignatura'}
                      </button>
                    </div>
                  </div>

                  {generatedQuestions.map((q, idx) => (
                    <div key={q.id || idx} className="qfdos-card" style={{ padding: '1.25rem', background: 'var(--surface-alt)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span className="qfdos-badge badge-navy" style={{ fontSize: '0.7rem' }}>
                          Pregunta #{idx + 1}
                        </span>
                        <span className="qfdos-badge badge-amber" style={{ fontSize: '0.7rem' }}>
                          {q.difficulty}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '10px' }}>
                        {q.question}
                      </h4>

                      {/* Question SMILES Structure if present */}
                      {q.questionSmiles && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                          <Chem2DDrawer smiles={q.questionSmiles} width={240} height={100} />
                        </div>
                      )}

                      {/* Options */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                        {q.options.map((opt, oIdx) => {
                          const text = typeof opt === 'string' ? opt : opt.text;
                          const smiles = typeof opt === 'string' ? undefined : opt.smiles;
                          const isCorrect = oIdx === q.correctIndex;
                          return (
                            <div
                              key={oIdx}
                              style={{
                                padding: '8px 12px',
                                borderRadius: 'var(--radius-sm)',
                                background: isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'var(--surface)',
                                border: `1px solid ${isCorrect ? '#10b981' : 'var(--border-color)'}`,
                                fontSize: '0.84rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '8px'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="font-mono" style={{ fontWeight: 700, color: isCorrect ? '#047857' : 'var(--text-muted)' }}>
                                  {String.fromCharCode(65 + oIdx)})
                                </span>
                                <span>{text}</span>
                              </div>
                              {smiles && <Chem2DDrawer smiles={smiles} width={100} height={45} />}
                              {isCorrect && <CheckCircle2 size={15} color="#10b981" style={{ marginLeft: 'auto' }} />}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      <div style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(13, 148, 136, 0.08)',
                        borderLeft: '3px solid var(--teal)',
                        fontSize: '0.8rem',
                        color: 'var(--text-main)'
                      }}>
                        <strong style={{ color: 'var(--teal)' }}>Fundamento Farmacológico:</strong> {q.explanation}
                      </div>
                    </div>
                  ))}

                </div>
              )}
            </>
          )}

          {/* TAB 2: Manual Chemical Question Builder */}
          {activeTab === 'manual' && (
            <div className="qfdos-card" style={{ padding: '1.5rem', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                  Redactar Pregunta Tipo Test con Estructuras Químicas
                </h4>
                <select
                  value={selectedTopicId}
                  onChange={e => setSelectedTopicId(e.target.value)}
                  className="form-select"
                  style={{ width: 'auto' }}
                >
                  {topics.map(t => (
                    <option key={t.id} value={t.id}>{t.number}: {t.title}</option>
                  ))}
                </select>
              </div>

              {/* Question Text */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '4px' }}>
                  Enunciado de la Pregunta:
                </label>
                <textarea
                  value={manualQuestion}
                  onChange={e => setManualQuestion(e.target.value)}
                  placeholder="Ej: ¿Cuál de las siguientes estructuras representa el profármaco éster etílico del enalaprilat?"
                  rows={2}
                  className="form-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Question SMILES Structure */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '4px' }}>
                  Estructura SMILES en el Enunciado (Opcional o Esquema Reactivo &rarr; Producto):
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={manualQuestionSmiles}
                    onChange={e => setManualQuestionSmiles(e.target.value)}
                    placeholder="Ej: CC(=O)Oc1ccccc1C(=O)O o CC(C)(C)NCC(O)c1ccc(O)c(CO)c1"
                    className="form-input"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  />
                  {manualQuestionSmiles && (
                    <Chem2DDrawer smiles={manualQuestionSmiles} width={160} height={70} />
                  )}
                </div>
              </div>

              {/* 4 Options */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '8px' }}>
                  Opciones de Respuesta (Indica el texto, SMILES opcional y marca la correcta):
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {manualOptions.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '30px 1fr 1fr 80px',
                        gap: '8px',
                        alignItems: 'center',
                        padding: '8px 10px',
                        background: manualCorrectIndex === oIdx ? 'rgba(16, 185, 129, 0.08)' : 'var(--surface-alt)',
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${manualCorrectIndex === oIdx ? '#10b981' : 'var(--border-color)'}`
                      }}
                    >
                      <span className="font-mono" style={{ fontWeight: 800, color: 'var(--navy)' }}>
                        {String.fromCharCode(65 + oIdx)})
                      </span>
                      <input
                        type="text"
                        placeholder={`Texto opción ${String.fromCharCode(65 + oIdx)}`}
                        value={opt.text}
                        onChange={e => {
                          const newOpts = [...manualOptions];
                          newOpts[oIdx].text = e.target.value;
                          setManualOptions(newOpts);
                        }}
                        className="form-input"
                        style={{ fontSize: '0.82rem' }}
                      />
                      <input
                        type="text"
                        placeholder="SMILES opcional"
                        value={opt.smiles || ''}
                        onChange={e => {
                          const newOpts = [...manualOptions];
                          newOpts[oIdx].smiles = e.target.value;
                          setManualOptions(newOpts);
                        }}
                        className="form-input"
                        style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}
                      />
                      <button
                        type="button"
                        onClick={() => setManualCorrectIndex(oIdx)}
                        className={`btn btn-sm ${manualCorrectIndex === oIdx ? 'btn-mint' : 'btn-outline'}`}
                        style={{ fontSize: '0.72rem' }}
                      >
                        {manualCorrectIndex === oIdx ? 'Correcta ✓' : 'Marcar'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanation */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '4px' }}>
                  Explicación / Fundamento Pedagógico:
                </label>
                <textarea
                  value={manualExplanation}
                  onChange={e => setManualExplanation(e.target.value)}
                  placeholder="Explica la justificación química, el mecanismo de acción o el SAR que fundamenta la respuesta correcta."
                  rows={2}
                  className="form-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Save Button */}
              <button
                type="button"
                onClick={handleAddManualQuestion}
                disabled={!manualQuestion.trim()}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', fontWeight: 700 }}
              >
                <PlusCircle size={18} /> {addedSuccess ? '¡Pregunta Guardada en la Asignatura!' : 'Guardar Pregunta en el Módulo'}
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-primary">
            Cerrar Generador
          </button>
        </div>

      </div>
    </div>
  );
};
