import React, { useState, useEffect } from 'react';
import {
  QFDOS_INFO,
  COURSE_DATA_VERSION,
  INITIAL_TOPICS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_GLOSSARY,
  INITIAL_RESOURCE_LINKS,
  INITIAL_STUDENT_QUESTIONS,
  QfdosTopic,
  QfdosAnnouncement,
  QfdosGlossaryTerm,
  QfdosResourceLink,
  StudentQuestion,
  CourseAttachment,
  TestQuestion
} from './data/qfdosData';
import { useAuth } from './context/AuthContext';
import { descargarContenido, contenidoEnCache } from './services/contenidoRemoto';

import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HubDashboard } from './components/HubDashboard';
import { TemasSection } from './components/TemasSection';
import { TopicDetailModal } from './components/TopicDetailModal';
import { AffinitySimulator } from './components/AffinitySimulator';
import { AdmetCalculator } from './components/AdmetCalculator';
import { GlossarySection } from './components/GlossarySection';
import { ResourceLinksSection } from './components/ResourceLinksSection';
import { EvaluationSection } from './components/EvaluationSection';
import { PracticasSection } from './components/practicas/PracticasSection';
import { CourseInfoSection } from './components/CourseInfoSection';

import { QuizModal } from './components/QuizModal';
import { FlashcardsModal } from './components/FlashcardsModal';
import { StudentQuestionModal } from './components/StudentQuestionModal';
import { SpotifyPlayerModal } from './components/SpotifyPlayerModal';
import { SearchModal } from './components/SearchModal';
import { ExamGeneratorModal } from './components/ExamGeneratorModal';
import { AdminCmsModal } from './components/AdminCmsModal';

const VERSION_KEY = 'qfdos_v3_data_version';

/**
 * Contenido que viaja con la aplicación. Se regenera desde el fichero de datos
 * cuando cambia COURSE_DATA_VERSION, porque una corrección de contenido (por
 * ejemplo, una estructura química errónea) tiene que llegar a todo el mundo.
 */
const SHIPPED_KEYS = [
  'qfdos_v3_topics',
  'qfdos_v3_announcements',
  'qfdos_v3_glossary'
];

/**
 * Contenido que escribe el profesorado desde el CMS y que no existe en ningún
 * otro sitio: enlaces de interés y dudas del alumnado. Nunca se purga — se
 * sembró una vez con los ejemplos iniciales y a partir de ahí manda el usuario.
 */
function purgeStaleCourseCache(): void {
  const stored = localStorage.getItem(VERSION_KEY);
  if (stored === COURSE_DATA_VERSION) return;

  SHIPPED_KEYS.forEach(k => localStorage.removeItem(k));
  localStorage.setItem(VERSION_KEY, COURSE_DATA_VERSION);
}

/** Lee del navegador y, si no hay nada válido, cae al contenido distribuido. */
function loadCached<T>(key: string, fallback: T): T {
  const saved = localStorage.getItem(key);
  if (saved) {
    try { return JSON.parse(saved) as T; } catch { /* dato corrupto: se ignora */ }
  }
  return fallback;
}

/**
 * Igual que loadCached, pero para contenido propio del usuario: siembra los
 * ejemplos sólo la primera vez. Si el usuario los borró todos, respeta la
 * lista vacía en lugar de resucitarlos en la siguiente carga.
 */
function loadUserOwned<T>(key: string, seed: T): T {
  const saved = localStorage.getItem(key);
  if (saved !== null) {
    try { return JSON.parse(saved) as T; } catch { /* dato corrupto: se resiembra */ }
  }
  return seed;
}

export const App: React.FC = () => {
  const { isAuthenticated, isProfesor } = useAuth();

  const [activeTab, setActiveTab] = useState<'hub' | 'info' | 'temas' | 'practicas' | 'simulador' | 'admet' | 'glosario' | 'enlaces' | 'evaluacion'>('hub');

  // Se ejecuta antes que cualquier lectura de caché de abajo
  const [topics, setTopics] = useState<QfdosTopic[]>(() => {
    purgeStaleCourseCache();
    return contenidoEnCache()?.topics ?? loadCached('qfdos_v3_topics', INITIAL_TOPICS);
  });

  const [announcements, setAnnouncements] = useState<QfdosAnnouncement[]>(() =>
    contenidoEnCache()?.announcements ?? loadCached('qfdos_v3_announcements', INITIAL_ANNOUNCEMENTS)
  );

  const [glossary, setGlossary] = useState<QfdosGlossaryTerm[]>(() =>
    contenidoEnCache()?.glossary ?? loadCached('qfdos_v3_glossary', INITIAL_GLOSSARY)
  );

  const [resourceLinks, setResourceLinks] = useState<QfdosResourceLink[]>(() =>
    contenidoEnCache()?.resourceLinks ?? loadUserOwned('qfdos_v3_links', INITIAL_RESOURCE_LINKS)
  );

  const [studentQuestions, setStudentQuestions] = useState<StudentQuestion[]>(() =>
    loadUserOwned('qfdos_v3_student_questions', INITIAL_STUDENT_QUESTIONS)
  );

  // Modal states
  const [selectedTopicDetail, setSelectedTopicDetail] = useState<QfdosTopic | null>(null);
  const [selectedQuizTopic, setSelectedQuizTopic] = useState<QfdosTopic | null>(null);
  const [selectedFlashcardsTopic, setSelectedFlashcardsTopic] = useState<QfdosTopic | null>(null);
  const [selectedSpotifyAttachment, setSelectedSpotifyAttachment] = useState<CourseAttachment | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isExamGeneratorOpen, setIsExamGeneratorOpen] = useState(false);
  const [isStudentQuestionOpen, setIsStudentQuestionOpen] = useState(false);
  const [isAdminCmsOpen, setIsAdminCmsOpen] = useState(false);
  const [publicadoEn, setPublicadoEn] = useState<string>(contenidoEnCache()?.publicadoEn ?? '');

  // Persist data
  useEffect(() => { localStorage.setItem('qfdos_v3_topics', JSON.stringify(topics)); }, [topics]);
  useEffect(() => { localStorage.setItem('qfdos_v3_announcements', JSON.stringify(announcements)); }, [announcements]);
  useEffect(() => { localStorage.setItem('qfdos_v3_glossary', JSON.stringify(glossary)); }, [glossary]);
  useEffect(() => { localStorage.setItem('qfdos_v3_links', JSON.stringify(resourceLinks)); }, [resourceLinks]);
  useEffect(() => { localStorage.setItem('qfdos_v3_student_questions', JSON.stringify(studentQuestions)); }, [studentQuestions]);

  /**
   * Trae el contenido que el profesor haya publicado.
   *
   * Se hace en cada arranque y sin bloquear la interfaz: la aplicación ya se
   * ha pintado con la última copia conocida, y si hay algo más reciente en la
   * hoja se sustituye. Así los cambios del profesor llegan a todo el mundo, en
   * lugar de quedarse en su navegador.
   */
  useEffect(() => {
    let cancelado = false;

    descargarContenido().then(remoto => {
      if (cancelado || !remoto) return;
      if (Array.isArray(remoto.topics) && remoto.topics.length) setTopics(remoto.topics);
      if (Array.isArray(remoto.announcements)) setAnnouncements(remoto.announcements);
      if (Array.isArray(remoto.glossary)) setGlossary(remoto.glossary);
      if (Array.isArray(remoto.resourceLinks)) setResourceLinks(remoto.resourceLinks);
      setPublicadoEn(remoto.publicadoEn || '');
    });

    return () => { cancelado = true; };
  }, []);

  // Ctrl+K search shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleQuestionsAddedToTopic = (topicId: string, newQuestions: TestQuestion[]) => {
    setTopics(prev => prev.map(t =>
      t.id === topicId ? { ...t, testQuestions: [...(t.testQuestions || []), ...newQuestions] } : t
    ));
  };

  // Gate: show login if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      <Header
        activeTab={activeTab}
        setActiveTab={(tab: any) => setActiveTab(tab)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenExamGenerator={() => setIsExamGeneratorOpen(true)}
        onOpenStudentQuestion={() => setIsStudentQuestionOpen(true)}
        onOpenAdminCms={() => setIsAdminCmsOpen(true)}
      />

      {activeTab === 'hub' && (
        <Hero
          onNavigateToTemas={() => setActiveTab('temas')}
          onNavigateToSimulador={() => setActiveTab('simulador')}
        />
      )}

      <main style={{ flex: 1 }}>
        {activeTab === 'hub' && (
          <HubDashboard
            topics={topics}
            announcements={announcements}
            onSelectTopic={setSelectedTopicDetail}
            onNavigateToCourseInfo={() => setActiveTab('info')}
            onNavigateToTemas={() => setActiveTab('temas')}
            onNavigateToSimulador={() => setActiveTab('simulador')}
            onNavigateToAdmet={() => setActiveTab('admet')}
            onNavigateToPracticas={() => setActiveTab('practicas')}
            onOpenExamGenerator={() => setIsExamGeneratorOpen(true)}
            onOpenAdminCms={() => setIsAdminCmsOpen(true)}
          />
        )}
        {activeTab === 'info' && <CourseInfoSection />}
        {activeTab === 'temas' && (
          <TemasSection
            topics={topics}
            onSelectTopic={setSelectedTopicDetail}
            onOpenQuiz={setSelectedQuizTopic}
            onOpenFlashcards={setSelectedFlashcardsTopic}
          />
        )}
        {activeTab === 'practicas' && <PracticasSection />}
        {activeTab === 'simulador' && <AffinitySimulator />}
        {activeTab === 'admet' && <AdmetCalculator />}
        {activeTab === 'glosario' && <GlossarySection glossary={glossary} />}
        {activeTab === 'enlaces' && (
          <ResourceLinksSection
            links={resourceLinks}
            onOpenAdminCms={() => setIsAdminCmsOpen(true)}
          />
        )}
        {activeTab === 'evaluacion' && <EvaluationSection />}
      </main>

      {/* Modals */}
      {selectedTopicDetail && (
        <TopicDetailModal
          topic={selectedTopicDetail}
          onClose={() => setSelectedTopicDetail(null)}
          onOpenQuiz={t => { setSelectedTopicDetail(null); setSelectedQuizTopic(t); }}
          onOpenFlashcards={t => { setSelectedTopicDetail(null); setSelectedFlashcardsTopic(t); }}
          onOpenSpotifyPlayer={att => setSelectedSpotifyAttachment(att)}
        />
      )}
      {selectedQuizTopic && (
        <QuizModal topic={selectedQuizTopic} onClose={() => setSelectedQuizTopic(null)} />
      )}
      {selectedFlashcardsTopic && (
        <FlashcardsModal topic={selectedFlashcardsTopic} onClose={() => setSelectedFlashcardsTopic(null)} />
      )}
      {selectedSpotifyAttachment && (
        <SpotifyPlayerModal attachment={selectedSpotifyAttachment} onClose={() => setSelectedSpotifyAttachment(null)} />
      )}

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        topics={topics}
        glossary={glossary}
        onSelectTopic={setSelectedTopicDetail}
        onNavigateToTab={(tab: any) => setActiveTab(tab)}
        onOpenNotesGenerator={() => {}}
        onOpenExamGenerator={() => setIsExamGeneratorOpen(true)}
      />

      {isExamGeneratorOpen && (
        <ExamGeneratorModal
          topics={topics}
          onClose={() => setIsExamGeneratorOpen(false)}
          onQuestionsAddedToTopic={handleQuestionsAddedToTopic}
        />
      )}
      {isStudentQuestionOpen && (
        <StudentQuestionModal topics={topics} onClose={() => setIsStudentQuestionOpen(false)} />
      )}
      {/* Admin CMS: only accessible to professor */}
      {isAdminCmsOpen && isProfesor && (
        <AdminCmsModal
          topics={topics}
          announcements={announcements}
          glossary={glossary}
          resourceLinks={resourceLinks}
          studentQuestions={studentQuestions}
          onClose={() => setIsAdminCmsOpen(false)}
          onUpdateTopics={setTopics}
          onUpdateAnnouncements={setAnnouncements}
          onUpdateGlossary={setGlossary}
          onUpdateResourceLinks={setResourceLinks}
          publicadoEn={publicadoEn}
          onPublicado={(cuando: string) => setPublicadoEn(cuando)}
          onUpdateStudentQuestions={setStudentQuestions}
        />
      )}

      {/* Footer Oficial QFDOS UGR Rediseñado */}
      <footer className="qfdos-footer-root">
        <div className="container">
          <div className="qfdos-footer-grid">
            {/* Columna 1: Asignatura y Cátedra */}
            <div className="qfdos-footer-col">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="brand-title" style={{ fontSize: '1.1rem' }}>QFDOS</span>
                <span className="qfdos-badge badge-teal" style={{ fontSize: '0.62rem', padding: '1px 6px', fontWeight: 800 }}>
                  2026/2027
                </span>
                <span className="qfdos-badge" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '0.62rem', border: '1px solid rgba(255,255,255,0.15)' }}>
                  Grupo E
                </span>
              </div>
              <h4 style={{ color: '#ffffff', fontSize: '0.98rem', fontWeight: 800, margin: '0 0 6px 0' }}>
                {QFDOS_INFO.name} ({QFDOS_INFO.code})
              </h4>
              <p style={{ fontSize: '0.8rem', lineHeight: 1.6, color: 'var(--footer-text-muted)', margin: 0 }}>
                {QFDOS_INFO.department}<br />
                {QFDOS_INFO.faculty} · {QFDOS_INFO.institution}<br />
                Campus Universitario de Cartuja · Granada (España)
              </p>
              <div style={{ marginTop: '12px' }}>
                <span className="qfdos-badge badge-mint" style={{ fontSize: '0.66rem', fontWeight: 800 }}>
                  QFDOS Structural Affinity v2.0
                </span>
              </div>
            </div>

            {/* Columna 2: Profesorado Responsable */}
            <div className="qfdos-footer-col">
              <h5 className="qfdos-footer-heading">Profesorado Responsable</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#ffffff' }}>
                    Dr. Juan José Díaz-Mochón
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--mint)', fontWeight: 600, marginTop: '1px' }}>
                    Profesor Titular · Docente y Responsable de Grupo E
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--footer-text-muted)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                    juandiaz@go.ugr.es
                  </div>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--footer-text-muted)', lineHeight: 1.45 }}>
                  📍 Tutorías presenciales en Fac. Farmacia (Cartuja), Centro GENYO (PTS) o videoconferencia por Google Meet.
                </div>
              </div>
            </div>

            {/* Columna 3: Ponderación Oficial de Evaluación */}
            <div className="qfdos-footer-col">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <h5 className="qfdos-footer-heading" style={{ margin: 0 }}>Evaluación Continua (UGR)</h5>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--mint)' }}>100%</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 8px', background: 'rgba(45,212,191,0.08)', borderRadius: '6px', border: '1px solid rgba(45,212,191,0.2)' }}>
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>• Examen Final Oficial (Obligatorio, mín. 5)</span>
                  <strong style={{ color: 'var(--mint)', fontFamily: 'var(--font-mono)' }}>70%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                  <span style={{ color: '#cbd5e1' }}>• Examen Parcial (No eliminatorio)</span>
                  <strong style={{ color: '#94d4f0', fontFamily: 'var(--font-mono)' }}>20%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                  <span style={{ color: '#cbd5e1' }}>• Prácticas de Laboratorio (Obligatorio)</span>
                  <strong style={{ color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>5%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                  <span style={{ color: '#cbd5e1' }}>• Trabajos y/o Seminarios</span>
                  <strong style={{ color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>5%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Subfooter de copyright y acceso institucional */}
          <div className="qfdos-footer-sub">
            <div>
              Universidad de Granada (UGR) · Grado en Farmacia · Asignatura: Química Farmacéutica II (Grupo E)
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span>Acceso institucional: @correo.ugr.es / @ugr.es</span>
              <span>•</span>
              <span>Plataforma QFDOS v3.2</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
