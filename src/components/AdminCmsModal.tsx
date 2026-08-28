import React, { useState } from 'react';
import { 
  QfdosTopic, 
  QfdosAnnouncement, 
  QfdosGlossaryTerm, 
  QfdosResourceLink,
  RESOURCE_CATEGORIES,
  ResourceCategory,
  MoleculeDrug, 
  StudentQuestion 
} from '../data/qfdosData';
import { 
  getStoredGeminiApiKey, 
  setStoredGeminiApiKey 
} from '../services/geminiService';
import { MaterialUploader } from './MaterialUploader';
import {
  X, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Bell, 
  BookOpen, 
  MessageSquare, 
  Key, 
  CheckCircle2, 
  Layers,
  Send,
  FileText,
  Radio,
  ExternalLink,
  Calendar,
  Award,
  Upload,
  AlertCircle,
  Compass,
  Star,
  Link2
} from 'lucide-react';

interface AdminCmsModalProps {
  topics: QfdosTopic[];
  announcements: QfdosAnnouncement[];
  glossary: QfdosGlossaryTerm[];
  resourceLinks: QfdosResourceLink[];
  studentQuestions: StudentQuestion[];
  onClose: () => void;
  onUpdateTopics: (updated: QfdosTopic[]) => void;
  onUpdateAnnouncements: (updated: QfdosAnnouncement[]) => void;
  onUpdateGlossary: (updated: QfdosGlossaryTerm[]) => void;
  onUpdateResourceLinks: (updated: QfdosResourceLink[]) => void;
  onUpdateStudentQuestions: (updated: StudentQuestion[]) => void;
}

export const AdminCmsModal: React.FC<AdminCmsModalProps> = ({
  topics,
  announcements,
  glossary,
  resourceLinks,
  studentQuestions,
  onClose,
  onUpdateTopics,
  onUpdateAnnouncements,
  onUpdateGlossary,
  onUpdateResourceLinks,
  onUpdateStudentQuestions
}) => {
  const [activeTab, setActiveTab] = useState<'materials' | 'modules' | 'announcements' | 'links' | 'drugs' | 'questions' | 'apikey'>('materials');
  const [materialsTopicId, setMaterialsTopicId] = useState<string>('');

  // API Key State
  const [apiKey, setApiKey] = useState(getStoredGeminiApiKey());
  const [apiKeySaved, setApiKeySaved] = useState(false);

  // New Announcement Form
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnPriority, setNewAnnPriority] = useState<'alta' | 'normal'>('normal');

  // New Drug Form
  const [selectedTopicForDrug, setSelectedTopicForDrug] = useState(topics[0]?.id || 'tema-00');
  const [newDrugName, setNewDrugName] = useState('');
  const [newDrugSmiles, setNewDrugSmiles] = useState('');
  const [newDrugRole, setNewDrugRole] = useState('');
  const [newDrugMw, setNewDrugMw] = useState<number>(250);
  const [newDrugLogP, setNewDrugLogP] = useState<number>(2.0);

  // Formulario de Enlaces de Interés
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [lnkTitle, setLnkTitle] = useState('');
  const [lnkUrl, setLnkUrl] = useState('');
  const [lnkSummary, setLnkSummary] = useState('');
  const [lnkCategory, setLnkCategory] = useState<ResourceCategory>(RESOURCE_CATEGORIES[0]);
  const [lnkSource, setLnkSource] = useState('');
  const [lnkDuration, setLnkDuration] = useState('');
  const [lnkTopic, setLnkTopic] = useState('');
  const [lnkFeatured, setLnkFeatured] = useState(false);
  const [lnkError, setLnkError] = useState<string | null>(null);

  // Question Response State
  const [respondingQId, setRespondingQId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  // Module Management State
  const [isCreatingModule, setIsCreatingModule] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);

  // Form State for New / Editing Module
  const [modCategory, setModCategory] = useState<'teoria' | 'examen' | 'trabajo' | 'seminario'>('teoria');
  const [modNumber, setModNumber] = useState('');
  const [modTitle, setModTitle] = useState('');
  const [modSubtitle, setModSubtitle] = useState('');
  const [modDescription, setModDescription] = useState('');
  const [modKeyConcepts, setModKeyConcepts] = useState('');
  const [modPdbTargetId, setModPdbTargetId] = useState('');
  const [modTargetName, setModTargetName] = useState('');
  const [modSlidesPdfUrl, setModSlidesPdfUrl] = useState('');
  const [modNotesPdfUrl, setModNotesPdfUrl] = useState('');
  const [modGeminiNotebookUrl, setModGeminiNotebookUrl] = useState('');
  const [modSpotifyPodcastUrl, setModSpotifyPodcastUrl] = useState('');
  const [modDueDate, setModDueDate] = useState('');
  const [modWeightPercentage, setModWeightPercentage] = useState<number>(15);
  const [modSubmissionInstructions, setModSubmissionInstructions] = useState('');
  const [modStatus, setModStatus] = useState<'Publicado' | 'En Revisión' | 'Próximamente'>('Publicado');

  const resetLinkForm = () => {
    setEditingLinkId(null);
    setLnkTitle(''); setLnkUrl(''); setLnkSummary('');
    setLnkCategory(RESOURCE_CATEGORIES[0]);
    setLnkSource(''); setLnkDuration(''); setLnkTopic('');
    setLnkFeatured(false); setLnkError(null);
  };

  const handleStartEditLink = (l: QfdosResourceLink) => {
    setEditingLinkId(l.id);
    setLnkTitle(l.title);
    setLnkUrl(l.url);
    setLnkSummary(l.summary);
    setLnkCategory(l.category);
    setLnkSource(l.source ?? '');
    setLnkDuration(l.duration ?? '');
    setLnkTopic(l.relatedTopic ?? '');
    setLnkFeatured(!!l.featured);
    setLnkError(null);
  };

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    setLnkError(null);

    // Aceptamos que se pegue el enlace sin esquema y lo completamos
    const raw = lnkUrl.trim();
    const normalised = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    try {
      new URL(normalised);
    } catch {
      setLnkError('La dirección no es válida. Pega el enlace completo, por ejemplo https://www.nature.com/...');
      return;
    }

    if (!lnkTitle.trim() || !lnkSummary.trim()) {
      setLnkError('El título y el resumen son obligatorios: el resumen es lo que orienta al alumnado.');
      return;
    }

    const base = {
      title: lnkTitle.trim(),
      url: normalised,
      summary: lnkSummary.trim(),
      category: lnkCategory,
      source: lnkSource.trim() || undefined,
      duration: lnkDuration.trim() || undefined,
      relatedTopic: lnkTopic.trim() || undefined,
      featured: lnkFeatured
    };

    if (editingLinkId) {
      onUpdateResourceLinks(
        resourceLinks.map(l => (l.id === editingLinkId ? { ...l, ...base } : l))
      );
    } else {
      onUpdateResourceLinks([
        {
          id: `link-${Date.now()}`,
          ...base,
          addedAt: new Date().toISOString().slice(0, 10)
        },
        ...resourceLinks
      ]);
    }
    resetLinkForm();
  };

  const handleDeleteLink = (l: QfdosResourceLink) => {
    if (!window.confirm(`¿Eliminar el enlace "${l.title}"?`)) return;
    onUpdateResourceLinks(resourceLinks.filter(x => x.id !== l.id));
    if (editingLinkId === l.id) resetLinkForm();
  };

  // Handle Save API Key
  const handleSaveApiKey = () => {
    setStoredGeminiApiKey(apiKey);
    setApiKeySaved(true);
    setTimeout(() => setApiKeySaved(false), 2500);
  };

  // Reset Module Form
  const resetModuleForm = () => {
    setModCategory('teoria');
    setModNumber('');
    setModTitle('');
    setModSubtitle('');
    setModDescription('');
    setModKeyConcepts('');
    setModPdbTargetId('');
    setModTargetName('');
    setModSlidesPdfUrl('');
    setModNotesPdfUrl('');
    setModGeminiNotebookUrl('');
    setModSpotifyPodcastUrl('');
    setModDueDate('');
    setModWeightPercentage(15);
    setModSubmissionInstructions('');
    setModStatus('Publicado');
    setIsCreatingModule(false);
    setEditingModuleId(null);
  };

  // Open Edit Module
  const handleStartEditModule = (topic: QfdosTopic) => {
    setEditingModuleId(topic.id);
    setIsCreatingModule(false);
    setModCategory(topic.category || 'teoria');
    setModNumber(topic.number);
    setModTitle(topic.title);
    setModSubtitle(topic.subtitle);
    setModDescription(topic.description);
    setModKeyConcepts(topic.keyConcepts?.join('\n') || '');
    setModPdbTargetId(topic.pdbTargetId || '');
    setModTargetName(topic.targetName || '');
    setModSlidesPdfUrl(topic.slidesPdfUrl || '');
    setModNotesPdfUrl(topic.notesPdfUrl || '');
    setModGeminiNotebookUrl(topic.geminiNotebookUrl || '');
    setModSpotifyPodcastUrl(topic.spotifyPodcastUrl || '');
    setModDueDate(topic.dueDate || '');
    setModWeightPercentage(topic.weightPercentage || 15);
    setModSubmissionInstructions(topic.submissionInstructions || '');
    setModStatus(topic.status || 'Publicado');
  };

  // Save (Create or Update) Module
  const handleSaveModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modTitle.trim() || !modNumber.trim()) return;

    const conceptsArray = modKeyConcepts
      .split('\n')
      .map(c => c.trim())
      .filter(c => c.length > 0);

    if (editingModuleId) {
      // Update existing module
      const updatedTopics = topics.map(t => {
        if (t.id === editingModuleId) {
          return {
            ...t,
            number: modNumber.trim(),
            title: modTitle.trim(),
            subtitle: modSubtitle.trim(),
            description: modDescription.trim(),
            category: modCategory,
            keyConcepts: conceptsArray.length > 0 ? conceptsArray : t.keyConcepts,
            pdbTargetId: modPdbTargetId.trim().toUpperCase() || undefined,
            targetName: modTargetName.trim() || undefined,
            slidesPdfUrl: modSlidesPdfUrl.trim() || undefined,
            slidesPdfName: modSlidesPdfUrl ? `${modNumber.replace(/\s+/g, '_')}_Diapositivas.pdf` : undefined,
            notesPdfUrl: modNotesPdfUrl.trim() || undefined,
            notesPdfName: modNotesPdfUrl ? `${modNumber.replace(/\s+/g, '_')}_Apuntes.pdf` : undefined,
            geminiNotebookUrl: modGeminiNotebookUrl.trim() || undefined,
            spotifyPodcastUrl: modSpotifyPodcastUrl.trim() || undefined,
            videoPodcastUrl: modSpotifyPodcastUrl.trim() || undefined,
            dueDate: modDueDate.trim() || undefined,
            weightPercentage: Number(modWeightPercentage) || undefined,
            submissionInstructions: modSubmissionInstructions.trim() || undefined,
            status: modStatus
          };
        }
        return t;
      });

      onUpdateTopics(updatedTopics);
      localStorage.setItem('qfdos_v2_topics', JSON.stringify(updatedTopics));
    } else {
      // Create new module
      const newId = `mod_${Date.now()}`;
      const newTopic: QfdosTopic = {
        id: newId,
        number: modNumber.trim(),
        title: modTitle.trim(),
        subtitle: modSubtitle.trim() || `${modCategory.toUpperCase()} - Química Farmacéutica II`,
        description: modDescription.trim() || 'Módulo docente oficial de la Facultad de Farmacia (UGR).',
        category: modCategory,
        keyConcepts: conceptsArray.length > 0 ? conceptsArray : ['Conceptos generales', 'Química Farmacéutica II'],
        slideCount: 0,
        pdbTargetId: modPdbTargetId.trim().toUpperCase() || undefined,
        targetName: modTargetName.trim() || undefined,
        drugs: [],
        status: modStatus,
        slidesPdfUrl: modSlidesPdfUrl.trim() || undefined,
        slidesPdfName: modSlidesPdfUrl ? `${modNumber.replace(/\s+/g, '_')}_Diapositivas.pdf` : undefined,
        notesPdfUrl: modNotesPdfUrl.trim() || undefined,
        notesPdfName: modNotesPdfUrl ? `${modNumber.replace(/\s+/g, '_')}_Apuntes.pdf` : undefined,
        geminiNotebookUrl: modGeminiNotebookUrl.trim() || undefined,
        spotifyPodcastUrl: modSpotifyPodcastUrl.trim() || undefined,
        videoPodcastUrl: modSpotifyPodcastUrl.trim() || undefined,
        dueDate: modDueDate.trim() || undefined,
        weightPercentage: Number(modWeightPercentage) || undefined,
        submissionInstructions: modSubmissionInstructions.trim() || undefined,
        testQuestions: [],
        flashcards: []
      };

      const updatedTopics = [...topics, newTopic];
      onUpdateTopics(updatedTopics);
      localStorage.setItem('qfdos_v2_topics', JSON.stringify(updatedTopics));
    }

    resetModuleForm();
  };

  // Delete Module
  const handleDeleteModule = (id: string) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este módulo del curso?')) return;
    const updated = topics.filter(t => t.id !== id);
    onUpdateTopics(updated);
    localStorage.setItem('qfdos_v2_topics', JSON.stringify(updated));
    if (editingModuleId === id) resetModuleForm();
  };

  // Handle Add Announcement
  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnContent.trim()) return;

    const newAnn: QfdosAnnouncement = {
      id: `ann_${Date.now()}`,
      title: newAnnTitle.trim(),
      content: newAnnContent.trim(),
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
      priority: newAnnPriority
    };

    const updated = [newAnn, ...announcements];
    onUpdateAnnouncements(updated);
    localStorage.setItem('qfdos_v2_announcements', JSON.stringify(updated));

    setNewAnnTitle('');
    setNewAnnContent('');
  };

  // Handle Delete Announcement
  const handleDeleteAnnouncement = (id: string) => {
    const updated = announcements.filter(a => a.id !== id);
    onUpdateAnnouncements(updated);
    localStorage.setItem('qfdos_v2_announcements', JSON.stringify(updated));
  };

  // Handle Add Drug to Topic
  const handleAddDrug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrugName.trim() || !newDrugSmiles.trim()) return;

    const newDrug: MoleculeDrug = {
      name: newDrugName.trim(),
      smiles: newDrugSmiles.trim(),
      role: newDrugRole.trim() || 'Fármaco de la unidad',
      mw: Number(newDrugMw) || 250,
      logP: Number(newDrugLogP) || 2.0,
      hbd: 1,
      hba: 3,
      tpsa: 45,
      rotBonds: 2
    };

    const updatedTopics = topics.map(t => {
      if (t.id === selectedTopicForDrug) {
        return {
          ...t,
          drugs: [...t.drugs, newDrug]
        };
      }
      return t;
    });

    onUpdateTopics(updatedTopics);
    localStorage.setItem('qfdos_v2_topics', JSON.stringify(updatedTopics));

    setNewDrugName('');
    setNewDrugSmiles('');
    setNewDrugRole('');
  };

  // Handle Delete Drug
  const handleDeleteDrug = (topicId: string, drugName: string) => {
    const updatedTopics = topics.map(t => {
      if (t.id === topicId) {
        return {
          ...t,
          drugs: t.drugs.filter(d => d.name !== drugName)
        };
      }
      return t;
    });

    onUpdateTopics(updatedTopics);
    localStorage.setItem('qfdos_v2_topics', JSON.stringify(updatedTopics));
  };

  // Handle Respond to Student Question
  const handleSendResponse = (qId: string) => {
    if (!responseText.trim()) return;

    const updatedQuestions = studentQuestions.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          response: responseText.trim(),
          status: 'respondida' as const
        };
      }
      return q;
    });

    onUpdateStudentQuestions(updatedQuestions);
    localStorage.setItem('qfdos_v2_student_questions', JSON.stringify(updatedQuestions));

    setRespondingQId(null);
    setResponseText('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container" 
        style={{ maxWidth: '1020px', height: '90vh' }} 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={22} color="var(--navy)" />
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-title)' }}>
                Panel de Administración CMS · Profesorado UGR
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Gestión de módulos, exámenes, trabajos, materiales (PDF, Notebook, Podcast) y claves de IA
              </span>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-outline"><X size={18} /></button>
        </div>

        {/* Tab Navigation */}
        <div style={{ padding: '0 1.75rem', background: 'var(--surface-raised)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="tabs-container" style={{ margin: 0 }}>
            <button
              onClick={() => setActiveTab('materials')}
              className={`tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
            >
              <Upload size={14} /> Materiales
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className={`tab-btn ${activeTab === 'modules' ? 'active' : ''}`}
            >
              <BookOpen size={14} /> Módulos, Exámenes & Trabajos ({topics.length})
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`tab-btn ${activeTab === 'announcements' ? 'active' : ''}`}
            >
              <Bell size={14} /> Tablón de Avisos ({announcements.length})
            </button>
            <button
              onClick={() => setActiveTab('links')}
              className={`tab-btn ${activeTab === 'links' ? 'active' : ''}`}
            >
              <Compass size={14} /> Enlaces de Interés ({resourceLinks.length})
            </button>
            <button
              onClick={() => setActiveTab('drugs')}
              className={`tab-btn ${activeTab === 'drugs' ? 'active' : ''}`}
            >
              <Layers size={14} /> Fármacos & SMILES
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
            >
              <MessageSquare size={14} /> Dudas de Alumnos ({studentQuestions.length})
            </button>
            <button
              onClick={() => setActiveTab('apikey')}
              className={`tab-btn ${activeTab === 'apikey' ? 'active' : ''}`}
            >
              <Key size={14} /> Clave API Gemini
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">

          {/* TAB 0: Materiales — subida de ficheros */}
          {activeTab === 'materials' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-title)' }}>
                  Materiales del curso
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55, maxWidth: '68ch' }}>
                  Arrastra aquí apuntes, diapositivas, imágenes o audio. Los ficheros se guardan en
                  este navegador, listos para consultarlos y descargarlos desde la propia plataforma.
                </p>
              </div>

              <div>
                <label
                  htmlFor="materials-topic"
                  className="eyebrow"
                  style={{ display: 'block', marginBottom: 5 }}
                >
                  Asociar a un módulo
                </label>
                <select
                  id="materials-topic"
                  value={materialsTopicId}
                  onChange={e => setMaterialsTopicId(e.target.value)}
                  className="form-select"
                  style={{ maxWidth: 460 }}
                >
                  <option value="">Sin módulo — material general del curso</option>
                  {topics.map(t => (
                    <option key={t.id} value={t.id}>{t.number} — {t.title}</option>
                  ))}
                </select>
              </div>

              <MaterialUploader
                topicId={materialsTopicId || undefined}
                topicLabel={topics.find(t => t.id === materialsTopicId)?.number}
              />

              <div style={{
                display: 'flex', gap: 9, alignItems: 'flex-start',
                padding: '11px 13px', borderRadius: 'var(--radius-md)',
                background: 'var(--semantic-warn-bg)', border: '1px solid rgba(184,115,15,0.2)'
              }}>
                <AlertCircle size={16} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: 1 }} />
                <div style={{ fontSize: '0.79rem', color: 'var(--text-main)', lineHeight: 1.55 }}>
                  <strong style={{ color: 'var(--accent-amber)' }}>Distribución al alumnado.</strong>{' '}
                  Estos ficheros viven en tu navegador, no en un servidor: el alumnado no los ve desde
                  sus equipos. Para que les lleguen, sube la misma copia a Google Drive y pega el
                  enlace en el campo correspondiente de cada módulo, en la pestaña{' '}
                  <button
                    onClick={() => setActiveTab('modules')}
                    style={{
                      background: 'none', border: 'none', padding: 0, font: 'inherit',
                      color: 'var(--teal)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline'
                    }}
                  >
                    Módulos
                  </button>.
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: Módulos, Exámenes & Trabajos */}
          {activeTab === 'modules' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Header Action */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-title)' }}>
                    Planificación Docente: Temas, Exámenes Oficiales y Trabajos
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Cada módulo contiene diapositivas en PDF, apuntes oficiales en PDF, cuaderno Gemini Notebook y video podcast de Spotify.
                  </p>
                </div>
                {!isCreatingModule && !editingModuleId && (
                  <button
                    onClick={() => { setIsCreatingModule(true); setEditingModuleId(null); }}
                    className="btn btn-primary"
                  >
                    <Plus size={16} /> Añadir Nuevo Módulo / Examen / Trabajo
                  </button>
                )}
              </div>

              {/* Form for Creating or Editing Module */}
              {(isCreatingModule || editingModuleId) && (
                <div className="qfdos-card card-teal" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-title)' }}>
                      {editingModuleId ? `Editar Módulo: ${modNumber}` : 'Crear Nuevo Módulo o Convocatoria'}
                    </h4>
                    <button onClick={resetModuleForm} className="btn btn-sm btn-outline">Cancelar</button>
                  </div>

                  <form onSubmit={handleSaveModule} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    
                    {/* Category and Code */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                          Tipo / Categoría del Módulo
                        </label>
                        <select
                          value={modCategory}
                          onChange={e => setModCategory(e.target.value as any)}
                          className="form-input"
                          style={{ width: '100%' }}
                        >
                          <option value="teoria">Teoría (Unidad Temática)</option>
                          <option value="examen">Examen Oficial / Parcial</option>
                          <option value="trabajo">Trabajo Dirigido / Proyecto</option>
                          <option value="seminario">Seminario / Caso Práctico</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                          Código o Número (ej: Tema 11, Examen 01, Trabajo 02)
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Tema 11 / Examen Parcial 2"
                          value={modNumber}
                          onChange={e => setModNumber(e.target.value)}
                          className="form-input"
                          required
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                          Estado de Publicación
                        </label>
                        <select
                          value={modStatus}
                          onChange={e => setModStatus(e.target.value as any)}
                          className="form-input"
                          style={{ width: '100%' }}
                        >
                          <option value="Publicado">Publicado</option>
                          <option value="En Revisión">En Revisión</option>
                          <option value="Próximamente">Próximamente</option>
                        </select>
                      </div>
                    </div>

                    {/* Title & Subtitle */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                          Título Principal
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Inhibidores de Tirosina Quinasa & Terapias Dirigidas"
                          value={modTitle}
                          onChange={e => setModTitle(e.target.value)}
                          className="form-input"
                          required
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                          Subtítulo o Resumen Corto
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Mecanismo de Acción, SAR y Resistencia por Mutación Gatekeeper"
                          value={modSubtitle}
                          onChange={e => setModSubtitle(e.target.value)}
                          className="form-input"
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                        Descripción Completa del Módulo
                      </label>
                      <textarea
                        placeholder="Descripción detallada de los objetivos docentes, bases farmacológicas y estructura..."
                        value={modDescription}
                        onChange={e => setModDescription(e.target.value)}
                        className="form-input"
                        rows={3}
                        style={{ width: '100%', resize: 'vertical' }}
                      />
                    </div>

                    {/* Key Concepts */}
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                        Conceptos Estructurales Clave (uno por línea)
                      </label>
                      <textarea
                        placeholder="Ejemplo:&#10;Bolsillo de unión a ATP&#10;Mutación T315I / Resistencia&#10;Eficacia de ligando (LE)"
                        value={modKeyConcepts}
                        onChange={e => setModKeyConcepts(e.target.value)}
                        className="form-input"
                        rows={3}
                        style={{ width: '100%', resize: 'vertical' }}
                      />
                    </div>

                    {/* SECTION: 4 RECURSOS OBLIGATORIOS DEL PROFESOR */}
                    <div style={{ background: 'var(--surface-alt)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <h5 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--teal)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Upload size={16} /> Recursos y Enlaces Obligatorios por Módulo
                      </h5>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                        
                        {/* 1. Diapositivas PDF */}
                        <div>
                          <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-title)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                            <FileText size={13} color="var(--navy)" /> PDF de Diapositivas
                          </label>
                          <input
                            type="text"
                            placeholder="URL o enlace Google Drive del PDF"
                            value={modSlidesPdfUrl}
                            onChange={e => setModSlidesPdfUrl(e.target.value)}
                            className="form-input"
                            style={{ width: '100%', fontSize: '0.8rem' }}
                          />
                        </div>

                        {/* 2. Apuntes PDF */}
                        <div>
                          <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-title)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                            <FileText size={13} color="var(--teal)" /> PDF de Apuntes Oficiales
                          </label>
                          <input
                            type="text"
                            placeholder="URL o enlace Google Drive de apuntes"
                            value={modNotesPdfUrl}
                            onChange={e => setModNotesPdfUrl(e.target.value)}
                            className="form-input"
                            style={{ width: '100%', fontSize: '0.8rem' }}
                          />
                        </div>

                        {/* 3. Gemini Notebook */}
                        <div>
                          <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-title)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                            <BookOpen size={13} color="var(--mint)" /> Gemini Notebook (NotebookLM)
                          </label>
                          <input
                            type="text"
                            placeholder="https://notebooklm.google.com/notebook/..."
                            value={modGeminiNotebookUrl}
                            onChange={e => setModGeminiNotebookUrl(e.target.value)}
                            className="form-input"
                            style={{ width: '100%', fontSize: '0.8rem' }}
                          />
                        </div>

                        {/* 4. Spotify Video Podcast */}
                        <div>
                          <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-title)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                            <Radio size={13} color="#1db954" /> Video Podcast Spotify (Episodio)
                          </label>
                          <input
                            type="text"
                            placeholder="https://open.spotify.com/episode/..."
                            value={modSpotifyPodcastUrl}
                            onChange={e => setModSpotifyPodcastUrl(e.target.value)}
                            className="form-input"
                            style={{ width: '100%', fontSize: '0.8rem' }}
                          />
                        </div>

                      </div>
                    </div>

                    {/* Crystallographic Target & Dates */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '3px' }}>
                          Código PDB Diana (ej: 1UZF, 2RH1)
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: 1UZF"
                          value={modPdbTargetId}
                          onChange={e => setModPdbTargetId(e.target.value)}
                          className="form-input"
                          maxLength={4}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '3px' }}>
                          Nombre de la Diana
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Ciclooxigenasa-2 Humana"
                          value={modTargetName}
                          onChange={e => setModTargetName(e.target.value)}
                          className="form-input"
                          style={{ width: '100%' }}
                        />
                      </div>

                      {/* Exam / Project specific fields */}
                      {(modCategory === 'examen' || modCategory === 'trabajo') && (
                        <>
                          <div>
                            <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '3px' }}>
                              Fecha Oficial / Límite
                            </label>
                            <input
                              type="text"
                              placeholder="Ej: 15/12/2026 09:30"
                              value={modDueDate}
                              onChange={e => setModDueDate(e.target.value)}
                              className="form-input"
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '3px' }}>
                              Ponderación (%)
                            </label>
                            <input
                              type="number"
                              placeholder="15"
                              value={modWeightPercentage}
                              onChange={e => setModWeightPercentage(Number(e.target.value))}
                              className="form-input"
                              style={{ width: '100%' }}
                            />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Submission Instructions for Works */}
                    {modCategory === 'trabajo' && (
                      <div>
                        <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '3px' }}>
                          Instrucciones de Entrega y Rúbrica del Trabajo
                        </label>
                        <textarea
                          placeholder="Detalles sobre el formato de entrega, memoria en PDF, tablas de SMILES, etc."
                          value={modSubmissionInstructions}
                          onChange={e => setModSubmissionInstructions(e.target.value)}
                          className="form-input"
                          rows={2}
                          style={{ width: '100%' }}
                        />
                      </div>
                    )}

                    {/* Save Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                      <button type="button" onClick={resetModuleForm} className="btn btn-outline">
                        Cancelar
                      </button>
                      <button type="submit" className="btn btn-mint">
                        <Save size={16} /> {editingModuleId ? 'Guardar Cambios del Módulo' : 'Publicar Módulo en el Portal'}
                      </button>
                    </div>

                  </form>
                </div>
              )}

              {/* Existing Modules List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h5 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-title)' }}>
                  Módulos Configurados en el Curso ({topics.length})
                </h5>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                  {topics.map(topic => (
                    <div
                      key={topic.id}
                      className="qfdos-card"
                      style={{
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '280px', flex: 1 }}>
                        <span className={`qfdos-badge ${topic.category === 'examen' ? 'badge-amber' : topic.category === 'trabajo' ? 'badge-emerald' : 'badge-navy'}`}>
                          {topic.number}
                        </span>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-title)' }}>
                              {topic.title}
                            </h4>
                            {topic.category && topic.category !== 'teoria' && (
                              <span className="qfdos-badge badge-teal" style={{ fontSize: '0.65rem' }}>
                                {topic.category.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.78rem', color: 'var(--teal)', fontWeight: 600 }}>
                            {topic.subtitle}
                          </span>

                          {/* Quick Resource Indicators */}
                          <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', background: topic.slidesPdfUrl ? 'rgba(30,58,138,0.1)' : 'var(--surface-alt)', color: topic.slidesPdfUrl ? 'var(--navy)' : 'var(--text-muted)' }}>
                              📑 Diapositivas {topic.slidesPdfUrl ? '✓' : '✗'}
                            </span>
                            <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', background: topic.notesPdfUrl ? 'rgba(13,148,136,0.1)' : 'var(--surface-alt)', color: topic.notesPdfUrl ? 'var(--teal)' : 'var(--text-muted)' }}>
                              📝 Apuntes {topic.notesPdfUrl ? '✓' : '✗'}
                            </span>
                            <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', background: topic.geminiNotebookUrl ? 'rgba(45,212,191,0.15)' : 'var(--surface-alt)', color: topic.geminiNotebookUrl ? 'var(--teal)' : 'var(--text-muted)' }}>
                              📓 Gemini Notebook {topic.geminiNotebookUrl ? '✓' : '✗'}
                            </span>
                            <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', background: topic.spotifyPodcastUrl ? 'rgba(29,185,84,0.15)' : 'var(--surface-alt)', color: topic.spotifyPodcastUrl ? '#1db954' : 'var(--text-muted)' }}>
                              🎙️ Video Podcast {topic.spotifyPodcastUrl ? '✓' : '✗'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Module Actions */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          onClick={() => handleStartEditModule(topic)}
                          className="btn btn-sm btn-outline"
                          title="Editar enlaces y contenidos del módulo"
                        >
                          <Edit3 size={14} /> Editar
                        </button>
                        <button
                          onClick={() => handleDeleteModule(topic.id)}
                          className="btn btn-sm btn-outline"
                          style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                          title="Eliminar módulo"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Tablón de Avisos */}
          {activeTab === 'announcements' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Add Announcement Form */}
              <div className="qfdos-card card-navy" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '10px' }}>
                  Publicar Nuevo Aviso en el Portal
                </h4>

                <form onSubmit={handleAddAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '10px' }}>
                    <input
                      type="text"
                      placeholder="Título del aviso..."
                      value={newAnnTitle}
                      onChange={e => setNewAnnTitle(e.target.value)}
                      className="form-input"
                      required
                    />
                    <select
                      value={newAnnPriority}
                      onChange={e => setNewAnnPriority(e.target.value as 'alta' | 'normal')}
                      className="form-input"
                    >
                      <option value="normal">Prioridad Normal</option>
                      <option value="alta">Prioridad Alta</option>
                    </select>
                  </div>

                  <textarea
                    placeholder="Contenido detallado del aviso oficial para los estudiantes..."
                    value={newAnnContent}
                    onChange={e => setNewAnnContent(e.target.value)}
                    className="form-input"
                    rows={3}
                    required
                  />

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary">
                      <Plus size={16} /> Publicar Aviso
                    </button>
                  </div>
                </form>
              </div>

              {/* List of Announcements */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-title)' }}>
                  Avisos Activos ({announcements.length})
                </h5>

                {announcements.map(ann => (
                  <div 
                    key={ann.id} 
                    className="qfdos-card" 
                    style={{ 
                      flexDirection: 'row', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '0.9rem 1.2rem',
                      borderLeft: ann.priority === 'alta' ? '4px solid #ef4444' : '4px solid var(--navy)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-title)' }}>
                          {ann.title}
                        </h4>
                        <span className={`qfdos-badge ${ann.priority === 'alta' ? 'badge-amber' : 'badge-navy'}`} style={{ fontSize: '0.65rem' }}>
                          {ann.priority.toUpperCase()}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                        {ann.content}
                      </p>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {ann.date}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      className="btn btn-sm btn-outline"
                      style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB: Enlaces de Interés */}
          {activeTab === 'links' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>

              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-title)' }}>
                  Enlaces de interés
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55, maxWidth: '70ch' }}>
                  Pega la dirección y escribe un resumen breve. El resumen es lo que de verdad
                  lee el alumnado: cuéntales por qué merece la pena y en qué fijarse, no lo que
                  ya dice el título.
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSaveLink} className="qfdos-card card-teal" style={{ padding: '1.25rem', gap: '11px' }}>
                <h5 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-title)' }}>
                  {editingLinkId ? 'Editar enlace' : 'Añadir enlace'}
                </h5>

                <input
                  type="text"
                  placeholder="https://www.nature.com/articles/..."
                  value={lnkUrl}
                  onChange={e => setLnkUrl(e.target.value)}
                  className="form-input"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}
                  required
                />

                <input
                  type="text"
                  placeholder="Título con el que aparecerá en la sección"
                  value={lnkTitle}
                  onChange={e => setLnkTitle(e.target.value)}
                  className="form-input"
                  required
                />

                <textarea
                  placeholder="Resumen: qué van a encontrar y por qué importa. Dos o tres frases bastan."
                  value={lnkSummary}
                  onChange={e => setLnkSummary(e.target.value)}
                  className="form-input"
                  rows={3}
                  style={{ resize: 'vertical' }}
                  required
                />

                <div className="link-editor-row">
                  <div>
                    <label className="eyebrow" style={{ display: 'block', marginBottom: 4 }}>Categoría</label>
                    <select
                      value={lnkCategory}
                      onChange={e => setLnkCategory(e.target.value as ResourceCategory)}
                      className="form-select"
                      style={{ width: '100%' }}
                    >
                      {RESOURCE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="eyebrow" style={{ display: 'block', marginBottom: 4 }}>Fuente</label>
                    <input
                      type="text"
                      placeholder="Nature, EMA, OMS…"
                      value={lnkSource}
                      onChange={e => setLnkSource(e.target.value)}
                      className="form-input"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label className="eyebrow" style={{ display: 'block', marginBottom: 4 }}>Duración</label>
                    <input
                      type="text"
                      placeholder="15 min · Vídeo 8 min"
                      value={lnkDuration}
                      onChange={e => setLnkDuration(e.target.value)}
                      className="form-input"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label className="eyebrow" style={{ display: 'block', marginBottom: 4 }}>Módulo relacionado</label>
                    <select
                      value={lnkTopic}
                      onChange={e => setLnkTopic(e.target.value)}
                      className="form-select"
                      style={{ width: '100%' }}
                    >
                      <option value="">Ninguno</option>
                      {topics.map(t => <option key={t.id} value={t.number}>{t.number} — {t.title}</option>)}
                    </select>
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.82rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={lnkFeatured}
                    onChange={e => setLnkFeatured(e.target.checked)}
                    style={{ width: 15, height: 15, accentColor: 'var(--teal)', cursor: 'pointer' }}
                  />
                  <Star size={13} color="var(--accent-amber)" />
                  Destacar: aparecerá el primero, marcado como recomendado
                </label>

                {lnkError && (
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: 7,
                    padding: '8px 11px', borderRadius: 'var(--radius-md)',
                    background: 'var(--semantic-bad-bg)', color: 'var(--accent-red)',
                    fontSize: '0.79rem', lineHeight: 1.5
                  }}>
                    <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>{lnkError}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  {editingLinkId && (
                    <button type="button" onClick={resetLinkForm} className="btn btn-outline">
                      Cancelar
                    </button>
                  )}
                  <button type="submit" className="btn btn-primary">
                    {editingLinkId ? <><Save size={15} /> Guardar cambios</> : <><Plus size={15} /> Añadir enlace</>}
                  </button>
                </div>
              </form>

              {/* Listado */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-title)' }}>
                  Publicados ({resourceLinks.length})
                </h5>

                {resourceLinks.length === 0 && (
                  <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', padding: '1.5rem 0', textAlign: 'center' }}>
                    Todavía no hay enlaces. Añade el primero con el formulario de arriba.
                  </p>
                )}

                {resourceLinks.map(l => (
                  <div key={l.id} className="link-admin-item">
                    <Link2 size={16} color="var(--teal)" style={{ flexShrink: 0, marginTop: 3 }} />

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                        <strong style={{ fontSize: '0.88rem', color: 'var(--text-title)' }}>{l.title}</strong>
                        {l.featured && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
                            <Star size={10} fill="currentColor" /> Destacado
                          </span>
                        )}
                      </div>

                      <p style={{ fontSize: '0.79rem', color: 'var(--text-main)', lineHeight: 1.5, margin: '3px 0' }}>
                        {l.summary}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        <span className="qfdos-badge badge-teal" style={{ fontSize: '0.62rem' }}>{l.category}</span>
                        {l.relatedTopic && <span>{l.relatedTopic}</span>}
                        {l.source && <span>{l.source}</span>}
                        <a
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', display: 'inline-flex', alignItems: 'center', gap: 3 }}
                        >
                          Abrir <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                      <button onClick={() => handleStartEditLink(l)} className="icon-btn" title="Editar">
                        <Edit3 size={15} />
                      </button>
                      <button onClick={() => handleDeleteLink(l)} className="icon-btn icon-btn-danger" title="Eliminar">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Gestión de Fármacos & SMILES */}
          {activeTab === 'drugs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Add Drug Form */}
              <div className="qfdos-card card-teal" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '10px' }}>
                  Añadir Fármaco a una Unidad Temática
                </h4>

                <form onSubmit={handleAddDrug} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '2px' }}>
                        Unidad Temática de Destino
                      </label>
                      <select
                        value={selectedTopicForDrug}
                        onChange={e => setSelectedTopicForDrug(e.target.value)}
                        className="form-input"
                        style={{ width: '100%' }}
                      >
                        {topics.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.number}: {t.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '2px' }}>
                        Nombre del Fármaco / Principio Activo
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Donepezilo, Rivastigmina..."
                        value={newDrugName}
                        onChange={e => setNewDrugName(e.target.value)}
                        className="form-input"
                        style={{ width: '100%' }}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '2px' }}>
                        Estructura SMILES Canónica
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: CC(=O)Oc1ccccc1C(=O)O"
                        value={newDrugSmiles}
                        onChange={e => setNewDrugSmiles(e.target.value)}
                        className="form-input font-mono"
                        style={{ width: '100%' }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '2px' }}>
                        Rol / Mecanismo SAR
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Inhibidor reversible AChE"
                        value={newDrugRole}
                        onChange={e => setNewDrugRole(e.target.value)}
                        className="form-input"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '2px' }}>
                        Peso Molecular (MW en Da)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={newDrugMw}
                        onChange={e => setNewDrugMw(Number(e.target.value))}
                        className="form-input"
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '2px' }}>
                        LogP Estimado
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={newDrugLogP}
                        onChange={e => setNewDrugLogP(Number(e.target.value))}
                        className="form-input"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-mint">
                      <Plus size={16} /> Guardar Fármaco en la Unidad
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Drugs per Topic */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-title)' }}>
                  Fármacos Registrados en el Temario
                </h5>

                {topics.map(t => (
                  <div key={t.id} className="qfdos-card" style={{ padding: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="qfdos-badge badge-navy">{t.number}: {t.title}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.drugs.length} fármacos</span>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {t.drugs.map((d, dIdx) => (
                        <div
                          key={dIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'var(--surface-alt)',
                            padding: '4px 8px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.78rem'
                          }}
                        >
                          <strong>{d.name}</strong>
                          <span style={{ color: 'var(--text-muted)' }}>({d.role})</span>
                          <button
                            onClick={() => handleDeleteDrug(t.id, d.name)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: Dudas de Alumnos */}
          {activeTab === 'questions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '4px' }}>
                  Buzón de Preguntas y Tutorías Virtuales
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Preguntas enviadas por los estudiantes a través del portal. Responda para publicarlas en la sección docente.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {studentQuestions.map(q => (
                  <div
                    key={q.id}
                    className="qfdos-card"
                    style={{
                      padding: '1.25rem',
                      borderLeft: q.status === 'pendiente' ? '4px solid #f59e0b' : '4px solid #10b981'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span className="qfdos-badge badge-teal" style={{ fontSize: '0.7rem' }}>
                        {q.topicTitle}
                      </span>
                      <span className={`qfdos-badge ${q.status === 'pendiente' ? 'badge-amber' : 'badge-emerald'}`} style={{ fontSize: '0.68rem' }}>
                        {q.status.toUpperCase()}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-title)', marginBottom: '6px' }}>
                      "{q.question}"
                    </p>

                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                      Por: <strong>{q.studentName}</strong> ({q.studentEmail}) · {q.timestamp}
                    </div>

                    {/* Response display or response form */}
                    {q.response ? (
                      <div style={{ background: 'var(--surface-alt)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                        <strong style={{ fontSize: '0.78rem', color: 'var(--navy)', display: 'block', marginBottom: '3px' }}>
                          Respuesta del Profesor:
                        </strong>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                          {q.response}
                        </p>
                      </div>
                    ) : respondingQId === q.id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                        <textarea
                          placeholder="Escriba la respuesta oficial para el estudiante..."
                          value={responseText}
                          onChange={e => setResponseText(e.target.value)}
                          className="form-input"
                          rows={3}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button onClick={() => setRespondingQId(null)} className="btn btn-sm btn-outline">
                            Cancelar
                          </button>
                          <button onClick={() => handleSendResponse(q.id)} className="btn btn-sm btn-primary">
                            <Send size={13} /> Enviar Respuesta Oficial
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setRespondingQId(q.id); setResponseText(''); }}
                        className="btn btn-sm btn-outline"
                        style={{ alignSelf: 'flex-start' }}
                      >
                        <MessageSquare size={13} /> Responder Duda
                      </button>
                    )}
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 5: Clave API Gemini */}
          {activeTab === 'apikey' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="qfdos-card card-mint" style={{ padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '6px' }}>
                  Configuración de Google Gemini AI (UGR Classroom)
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '1rem' }}>
                  Introduzca su clave API de <strong>Google Gemini</strong> para habilitar las funciones de generación de apuntes oficiales de clase, creación de preguntas tipo test razonadas y respuesta asistida para tutorías docentes.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-title)' }}>
                    Google AI Studio / Gemini API Key
                  </label>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    className="form-input font-mono"
                    style={{ fontSize: '0.9rem' }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      La clave se almacena de forma segura y local en su navegador web.
                    </span>
                    <button onClick={handleSaveApiKey} className="btn btn-mint">
                      {apiKeySaved ? <><CheckCircle2 size={16} /> Clave Guardada</> : <><Save size={16} /> Guardar Clave API</>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-primary">
            Cerrar Panel CMS
          </button>
        </div>

      </div>
    </div>
  );
};
