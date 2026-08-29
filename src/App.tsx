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

      {/* Footer */}
      <footer style={{
        background: 'var(--navy-dark)',
        color: '#cbd5e1',
        padding: '2.25rem 1rem',
        borderTop: '1px solid rgba(45,212,191,0.15)',
        marginTop: '3rem'
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, marginBottom: 6 }}>
              {QFDOS_INFO.name} ({QFDOS_INFO.code})
            </h4>
            <p style={{ fontSize: '0.8rem', lineHeight: 1.6, color: '#94a3b8' }}>
              {QFDOS_INFO.department}<br />
              {QFDOS_INFO.faculty} · {QFDOS_INFO.institution}<br />
              Curso Académico {QFDOS_INFO.year}
            </p>
            <div style={{ marginTop: 10 }}>
              <span className="qfdos-badge badge-mint" style={{ fontSize: '0.65rem' }}>QFDOS SAI v3.0</span>
            </div>
          </div>

          <div>
            <h5 style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 700, marginBottom: 7 }}>Profesorado</h5>
            <ul style={{ listStyle: 'none', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {QFDOS_INFO.professors.map((p, i) => <li key={i}>· {p}</li>)}
            </ul>
          </div>

          <div>
            <h5 style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 700, marginBottom: 7 }}>Evaluación Continua</h5>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.6 }}>
              · 70% Exámenes de Convocatoria Oficial<br />
              · 15% Prácticas de Laboratorio<br />
              · 15% Cuestionarios, Seminarios & Proyecto
            </p>
          </div>
        </div>

        <div className="container" style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.07)', textAlign: 'center', fontSize: '0.72rem', color: '#475569' }}>
          Universidad de Granada (UGR) · Plataforma QFDOS v3.0 · Acceso restringido @correo.ugr.es / @ugr.es
        </div>
      </footer>
    </div>
  );
};

export default App;
