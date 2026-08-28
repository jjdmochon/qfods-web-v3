// ==========================================================================
// QFDOS Master Data Repository (v2.0)
// Asignatura: Química Farmacéutica II (2627 QFDOS E) - Universidad de Granada
// Tipografía Científica Limpia: Texto plano y caracteres Unicode directos (cero LaTeX crudo)
// ==========================================================================

export interface CourseAttachment {
  id: string;
  title: string;
  type: 'pdf' | 'audio' | 'video' | 'spotify' | 'notebook' | 'drive';
  url: string;
  driveId?: string;
  size?: string;
  date: string;
  spotifyUri?: string;
  isPodcastVideo?: boolean;
}

export interface TestQuestionOption {
  text: string;
  smiles?: string;
}

export interface TestQuestion {
  id: string;
  topicId: string;
  block?: string;
  question: string;
  questionSmiles?: string;
  options: (string | TestQuestionOption)[];
  correctIndex: number;
  explanation: string;
  difficulty?: 'Fácil' | 'Medio' | 'Avanzado';
  authorEmail?: string;
  authorName?: string;
  isStudentSubmitted?: boolean;
  status?: 'approved' | 'pending';
}

export interface Flashcard {
  id: string;
  topicId: string;
  concept: string;
  front: string;
  back: string;
  smiles?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface LectureAudioNote {
  id: string;
  topicId: string;
  title: string;
  audioUrl?: string;
  date: string;
  duration?: string;
  transcription?: string;
  synthesizedNotesMarkdown?: string;
  slidesMarkdownUrl?: string;
  status: 'transcribing' | 'completed' | 'draft';
}

export interface QuizAttempt {
  id: string;
  studentEmail: string;
  studentName: string;
  topicId: string;
  score: number; // 0 to 10
  correctCount: number;
  totalQuestions: number;
  timestamp: string;
}

export interface StudentEvaluationProfile {
  email: string;
  name: string;
  attempts: QuizAttempt[];
  labGrade: number;
  projectGrade: number;
}

export interface MoleculeDrug {
  name: string;
  smiles: string;
  formula?: string;
  mw?: number;
  logP?: number;
  hbd?: number;
  hba?: number;
  tpsa?: number;
  rotBonds?: number;
  role: string;
  pdbId?: string;
}

export interface QfdosTopic {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  category?: 'teoria' | 'examen' | 'trabajo' | 'seminario';
  keyConcepts: string[];
  slideCount: number;
  pdbTargetId?: string;
  targetName?: string;
  drugs: MoleculeDrug[];
  status: 'Publicado' | 'En Revisión' | 'Próximamente';
  // 4 Recursos Didácticos Principales por Unidad
  slidesPdfUrl?: string;
  slidesPdfName?: string;
  notesPdfUrl?: string;
  notesPdfName?: string;
  geminiNotebookUrl?: string;
  spotifyPodcastUrl?: string;
  videoPodcastUrl?: string;
  // Metadatos para Exámenes y Trabajos/Proyectos
  dueDate?: string;
  maxScore?: number;
  weightPercentage?: number;
  submissionInstructions?: string;
  attachments?: CourseAttachment[];
  studentSubmissionUrl?: string;
  testQuestions?: TestQuestion[];
  flashcards?: Flashcard[];
  lectureAudios?: LectureAudioNote[];
}

export interface QfdosGlossaryTerm {
  id: string;
  term: string;
  category: 'Afinidad & Receptor' | 'SNC & Neuro' | 'Cardiovascular' | 'Antiinfecciosos' | 'ADMET & Profiling';
  definition: string;
  technicalCode?: string;
  clinicalRelevance: string;
  smiles?: string;
}

/**
 * Enlace de interés: material externo que el profesorado recopila para que el
 * alumnado vea qué hace la química farmacéutica fuera del aula.
 */
export interface QfdosResourceLink {
  id: string;
  title: string;
  url: string;
  /** Resumen del profesor: por qué merece la pena y qué mirar */
  summary: string;
  category: ResourceCategory;
  /** Medio de origen, mostrado junto al dominio (Nature, NEJM, EMA…) */
  source?: string;
  /** Lectura estimada o duración, p. ej. "12 min" o "Vídeo 8 min" */
  duration?: string;
  /** Módulo del temario con el que conecta, p. ej. "Tema 09" */
  relatedTopic?: string;
  /** Recomendado: se destaca al principio de la sección */
  featured?: boolean;
  addedAt: string;
}

export const RESOURCE_CATEGORIES = [
  'Casos de éxito',
  'Descubrimiento de fármacos',
  'Impacto en pacientes',
  'Regulación & seguridad',
  'Industria & carrera profesional',
  'Divulgación'
] as const;

export type ResourceCategory = typeof RESOURCE_CATEGORIES[number];

export const INITIAL_RESOURCE_LINKS: QfdosResourceLink[] = [
  {
    id: 'link-imatinib',
    title: 'Imatinib: del cromosoma Filadelfia a la primera terapia dirigida',
    url: 'https://www.nature.com/articles/nrd4570',
    summary:
      'La leucemia mieloide crónica pasó de ser mortal a una enfermedad crónica con una sola molécula. Fijaos en cómo el conocimiento de la diana (la fusión BCR-ABL) precedió al diseño del fármaco: es el orden inverso al del descubrimiento clásico por cribado, y es la lógica que seguimos en todo el temario.',
    category: 'Casos de éxito',
    source: 'Nature Reviews Drug Discovery',
    duration: '15 min',
    relatedTopic: 'Tema 00',
    featured: true,
    addedAt: '2026-08-28'
  },
  {
    id: 'link-coxibs',
    title: 'Por qué se retiró el rofecoxib: selectividad COX-2 y riesgo cardiovascular',
    url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa050493',
    summary:
      'El mismo razonamiento estructural que hace al celecoxib selectivo — el bolsillo lateral que la Val523 deja libre en COX-2 — explica el desequilibrio entre prostaciclina y tromboxano que costó la retirada del rofecoxib. Un recordatorio de que la selectividad de diana no garantiza seguridad clínica.',
    category: 'Regulación & seguridad',
    source: 'New England Journal of Medicine',
    duration: '20 min',
    relatedTopic: 'Tema 09',
    featured: true,
    addedAt: '2026-08-28'
  },
  {
    id: 'link-ema-approvals',
    title: 'Medicamentos autorizados este año por la EMA',
    url: 'https://www.ema.europa.eu/en/medicines/medicines-human-use-under-evaluation',
    summary:
      'El registro público de la Agencia Europea del Medicamento. Buscad cualquier principio activo del temario y leed su informe: veréis los datos reales de eficacia y seguridad con los que se toma la decisión de autorizar, y cuántas veces se rechaza.',
    category: 'Regulación & seguridad',
    source: 'European Medicines Agency',
    relatedTopic: 'Tema 10',
    addedAt: '2026-08-28'
  },
  {
    id: 'link-alphafold',
    title: 'AlphaFold y qué cambia (y qué no) en el diseño de fármacos',
    url: 'https://www.nature.com/articles/s41586-021-03819-2',
    summary:
      'Predecir la estructura de una proteína dejó de ser el cuello de botella. Pero conocer el pliegue no da el modo de unión ni la afinidad: el trabajo termodinámico que hacemos en el simulador sigue siendo necesario. Buen antídoto contra el entusiasmo fácil.',
    category: 'Descubrimiento de fármacos',
    source: 'Nature',
    duration: '25 min',
    relatedTopic: 'Tema 00',
    addedAt: '2026-08-28'
  },
  {
    id: 'link-antibiotic-gap',
    title: 'Por qué apenas se desarrollan antibióticos nuevos',
    url: 'https://www.who.int/publications/i/item/9789240094000',
    summary:
      'El informe de la OMS sobre la cartera de antibacterianos en desarrollo. El problema no es solo científico: un antibiótico bien usado se reserva, se vende poco y no recupera la inversión. Un caso donde la química farmacéutica choca con la economía del medicamento.',
    category: 'Impacto en pacientes',
    source: 'Organización Mundial de la Salud',
    addedAt: '2026-08-28'
  },
  {
    id: 'link-career',
    title: 'Qué hace de verdad un químico medicinal en la industria',
    url: 'https://www.acs.org/careers/chemical-sciences/fields/medicinal-chemistry.html',
    summary:
      'Descripción del puesto por la American Chemical Society: ciclos de diseño-síntesis-ensayo, trabajo con biólogos y farmacólogos, y qué se espera de un recién titulado. Útil si estáis decidiendo por dónde seguir después del grado.',
    category: 'Industria & carrera profesional',
    source: 'American Chemical Society',
    duration: '10 min',
    addedAt: '2026-08-28'
  }
];

export interface QfdosAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'alta' | 'normal';
}

export interface StudentQuestion {
  id: string;
  topicId: string;
  topicTitle: string;
  studentName: string;
  studentEmail: string;
  question: string;
  timestamp: string;
  status: 'pendiente' | 'respondida';
  response?: string;
}

/**
 * Versión del contenido docente distribuido con la aplicación.
 *
 * Súbela cada vez que cambien los datos del curso (estructuras, temario,
 * preguntas). Al arrancar, la aplicación compara esta versión con la guardada
 * en el navegador y, si difieren, descarta la copia en caché y recarga el
 * contenido oficial. Sin esto, un navegador que ya visitó la plataforma se
 * queda con la versión antigua para siempre.
 *
 * v3.2.0 — Nueva seccion de enlaces de interes (INITIAL_RESOURCE_LINKS).
 * v3.1.0 — Estructuras SMILES verificadas contra PubChem y corregidas:
 *          haloperidol y zolpidem no eran ni siquiera moléculas válidas;
 *          donepezilo, sumatriptán, ondansetrón, flumazenil, naloxona y
 *          losartán tenían el esqueleto equivocado; morfina, captopril,
 *          enalapril, levodopa, rivastigmina, valaciclovir, ranitidina y
 *          pralidoxima carecían de estereoquímica.
 */
export const COURSE_DATA_VERSION = '3.2.0';

export const QFDOS_INFO = {
  code: "2627 QFDOS E",
  name: "Química Farmacéutica II",
  year: "2026/2027",
  institution: "Universidad de Granada (UGR)",
  faculty: "Facultad de Farmacia",
  department: "Química Farmacéutica y Orgánica",
  professors: ["Dr. Juan José Díaz-Mochón (Grupo E)", "Dr. Joaquín Campos Rosa (Grupo C)"],
  designSystem: "QFDOS Structural Affinity Identity v2.0",
  driveFolderUrl: "https://drive.google.com/drive/folders/1_QFDOS_2627_Classroom",
  evaluacion: {
    examenes: 70,
    practicas: 15,
    cuestionariosProyecto: 15
  }
};

export const INITIAL_ANNOUNCEMENTS: QfdosAnnouncement[] = [
  {
    id: 'ann-1',
    title: '🚀 Bienvenida al Curso 2026/2027: Portal QFDOS v3 con quimioinformática RDKit',
    content: 'Plataforma oficial para profesorado y alumnado con cuenta institucional UGR. Estructuras 2D renderizadas con RDKit y descriptores calculados sobre la marcha, podcasts en Spotify, flashcards con repetición espaciada y generador de exámenes.',
    date: '10 Septiembre 2026',
    priority: 'alta'
  },
  {
    id: 'ann-2',
    title: '📊 Simuladores Biofísicos de Afinidad y Criterios ADMET de Lipinski / Veber',
    content: 'Disponibles las herramientas de cálculo en tiempo real para constantes termodinámicas (ΔG°, Kd, Ki), ecuación de Cheng-Prusoff (IC50) y perfilado de permeabilidad celular.',
    date: '12 Septiembre 2026',
    priority: 'normal'
  },
  {
    id: 'ann-3',
    title: '🎙️ Nuevos Episodios de Podcast y Cuadernos de Estudio en NotebookLM',
    content: 'Se han integrado los episodios de Spotify y enlaces de NotebookLM en los módulos del Sistema Nervioso Central y Cardiovascular.',
    date: '14 Septiembre 2026',
    priority: 'normal'
  }
];

export const INITIAL_TOPICS: QfdosTopic[] = [
  {
    id: 'tema-00',
    number: 'Tema 00',
    title: 'Introducción & Afinidad Estructural',
    subtitle: 'Termodinámica de Unión Ligando-Receptor, Isósteros y Modulación Alostérica',
    description: 'Bases físico-químicas del reconocimiento molecular en Química Farmacéutica. Cuantificación de la afinidad mediante energía libre de Gibbs (ΔG° = R · T · ln(Kd)), relaciones entre constante de disociación (Kd) e inhibición (Ki), ecuación de Cheng-Prusoff (IC50 = Ki · (1 + [S]/Km)) y principios de bioisosterismo clásico y no clásico.',
    keyConcepts: [
      'Energía libre de Gibbs de unión (ΔG°)',
      'Constante de afinidad y disociación (Kd y Ki)',
      'Ecuación de Cheng-Prusoff (IC50)',
      'Eficiencia de ligando (LE = -ΔG° / Nheavy)',
      'Bioisósteros clásicos y no clásicos',
      'Modulación ortostérica vs. alostérica'
    ],
    slideCount: 42,
    pdbTargetId: '1UZF',
    targetName: 'Complejo Diana-Ligando Modelo (Reconocimiento Físico-Químico)',
    status: 'Publicado',
    slidesPdfUrl: 'https://drive.google.com/file/d/1_slides_tema00_qfdos/view',
    slidesPdfName: 'Tema 00: Presentación y Diapositivas Oficiales.pdf',
    notesPdfUrl: 'https://drive.google.com/file/d/1_apuntes_tema00_qfdos/view',
    notesPdfName: 'Tema 00: Apuntes Magistrales y Fórmulas Biofísicas.pdf',
    geminiNotebookUrl: 'https://notebooklm.google.com/notebook/qfdos-2627-tema00',
    spotifyPodcastUrl: 'https://open.spotify.com/episode/7Kx0AfinidadQFDOS00',
    drugs: [
      {
        name: 'Ligando Modelo A (Tetrazol)',
        smiles: 'c1ccc(cc1)c2nnn[nH]2',
        role: 'Bioisóstero clásico de ácido carboxílico con mayor lipofilia',
        mw: 146.15,
        logP: 1.62,
        hbd: 1,
        hba: 3,
        tpsa: 43.1,
        rotBonds: 1,
        pdbId: '1UZF'
      },
      {
        name: 'Ligando Modelo B (Carboxilato)',
        smiles: 'c1ccc(cc1)C(=O)O',
        role: 'Ácido carboxílico aromático de referencia',
        mw: 122.12,
        logP: 1.87,
        hbd: 1,
        hba: 2,
        tpsa: 37.3,
        rotBonds: 1
      }
    ],
    attachments: [
      {
        id: 'att-00-1',
        title: 'Presentación Tema 00: Termodinámica y Afinidad (PDF)',
        type: 'pdf',
        url: 'https://drive.google.com/file/d/1_slides_tema00_qfdos/view',
        size: '5.8 MB',
        date: 'Sept 2026'
      },
      {
        id: 'att-00-2',
        title: 'Apuntes Oficiales Tema 00: Fórmulas Biofísicas & SAR (PDF)',
        type: 'pdf',
        url: 'https://drive.google.com/file/d/1_apuntes_tema00_qfdos/view',
        size: '3.4 MB',
        date: 'Sept 2026'
      },
      {
        id: 'att-00-3',
        title: 'Gemini NotebookLM: Cuaderno de Estudio Tema 00',
        type: 'notebook',
        url: 'https://notebooklm.google.com/notebook/qfdos-2627-tema00',
        date: 'Sept 2026'
      },
      {
        id: 'att-00-4',
        title: 'Podcast Spotify: La Termodinámica de la Afinidad Farmacológica',
        type: 'spotify',
        url: 'https://open.spotify.com/episode/7Kx0AfinidadQFDOS00',
        spotifyUri: 'spotify:episode:7Kx0AfinidadQFDOS00',
        date: 'Sept 2026'
      }
    ],
    testQuestions: [
      {
        id: 't00-q1',
        topicId: 'tema-00',
        block: 'Biofísica & Termodinámica',
        question: '¿Qué ocurre con el valor experimental de IC50 cuando la concentración de sustrato competidor [S] en un ensayo enzimático aumenta al doble de su constante de Michaelis-Menten ([S] = 2 · Km)?',
        options: [
          'El valor de IC50 se mantiene exactamente igual a Ki.',
          'El valor de IC50 se triplica respecto a Ki (IC50 = 3 · Ki) según la ecuación de Cheng-Prusoff.',
          'El valor de IC50 disminuye a la mitad (IC50 = Ki / 2).',
          'El valor de IC50 pasa a ser cero porque el inhibidor se satura.'
        ],
        correctIndex: 1,
        explanation: 'Aplicando la ecuación de Cheng-Prusoff para inhibición competitiva: IC50 = Ki · (1 + [S]/Km). Si [S] = 2 · Km, entonces IC50 = Ki · (1 + 2) = 3 · Ki.',
        difficulty: 'Medio'
      },
      {
        id: 't00-q2',
        topicId: 'tema-00',
        block: 'Bioisosterismo Químico',
        question: '¿Cuál de las siguientes estructuras representa el bioisóstero clásico no-ionizable de un grupo ácido carboxílico que conserva los enlaces de hidrógeno mejorando la permeabilidad lipofílica?',
        questionSmiles: 'c1ccccc1C(=O)O',
        options: [
          { text: 'Anillo 1H-Tetrazol-5-ilo', smiles: 'c1ccccc1c2nnn[nH]2' },
          { text: 'Alcohol Bencílico (-CH2OH)', smiles: 'c1ccccc1CO' },
          { text: 'Amina Primaria (-NH2)', smiles: 'c1ccccc1N' },
          { text: 'Grupo Nitro aromático (-NO2)', smiles: 'c1ccccc1[N+](=O)[O-]' }
        ],
        correctIndex: 0,
        explanation: 'El anillo 1H-tetrazol es el bioisóstero clásico más utilizado para reemplazar el ácido carboxílico: posee un pKa ácido similar (~4.5-4.9), deslocalización de carga negativa similar y una lipofilia (LogP) significativamente superior.',
        difficulty: 'Avanzado'
      }
    ],
    flashcards: [
      {
        id: 'fc-00-1',
        topicId: 'tema-00',
        concept: 'Ecuación de Cheng-Prusoff',
        front: '¿Cuál es la formulación de la ecuación de Cheng-Prusoff para un inhibidor competitivo y qué cuantifica?',
        back: 'IC50 = Ki · (1 + [S]/Km). Relaciona el parámetro experimental IC50 (dependiente del sustrato y del ensayo) con la constante termodinámica intrínseca de inhibición (Ki).',
        difficulty: 'medium',
        category: 'Biofísica'
      },
      {
        id: 'fc-00-2',
        topicId: 'tema-00',
        concept: 'Eficiencia de Ligando (LE)',
        front: '¿Cómo se define y calcula la Eficiencia de Ligando (Ligand Efficiency, LE)?',
        back: 'LE = -ΔG° / Nheavy, expresada en kcal/(mol · átomo pesado). Mide la contribución promedio de cada átomo no-hidrógeno a la energía libre de unión. Un valor LE >= 0.3 kcal/(mol·átomo) se considera óptimo.',
        difficulty: 'hard',
        category: 'Optimización de Leads'
      }
    ]
  },
  {
    id: 'tema-01',
    number: 'Tema 01',
    title: 'Sistema Colinérgico',
    subtitle: 'Agonistas, Inhibidores de Acetilcolinesterasa (AChE) y Reactivadores Oxímicos',
    description: 'Estudio de la transmisión colinérgica, receptores muscarínicos y nicotínicos. Relaciones estructura-actividad (SAR) de ésteres de colina y carbamatos. Mecanismo catalítico de la tríada de AChE (Ser200, His440, Glu327), fosforilación por organofosforados neurotóxicos y reactivación mediante oximas nucleofílicas como pralidoxima (2-PAM).',
    keyConcepts: [
      'Receptores muscarínicos (M1-M5) y nicotínicos (nAChR)',
      'Mecanismo catalítico de la Acetilcolinesterasa (AChE)',
      'Inhibidores reversibles y pseudoirreversibles (Carbamatos)',
      'Organofosforados y fenómeno de envejecimiento enzimático',
      'Reactivadores oxímicos (Pralidoxima / 2-PAM)',
      'Fármacos para la enfermedad de Alzheimer (Donepezilo, Rivastigmina)'
    ],
    slideCount: 56,
    pdbTargetId: '1UZF',
    targetName: 'Acetilcolinesterasa Recombinant Human (AChE)',
    status: 'Publicado',
    slidesPdfUrl: 'https://drive.google.com/file/d/1_slides_tema01_qfdos/view',
    slidesPdfName: 'Tema 01: Diapositivas Oficiales Sistema Colinérgico.pdf',
    notesPdfUrl: 'https://drive.google.com/file/d/1_apuntes_tema01_qfdos/view',
    notesPdfName: 'Tema 01: Apuntes Magistrales de Fármacos Colinérgicos.pdf',
    geminiNotebookUrl: 'https://notebooklm.google.com/notebook/qfdos-2627-tema01',
    spotifyPodcastUrl: 'https://open.spotify.com/episode/3Kx9ColinQFDOS01',
    drugs: [
      {
        name: 'Donepezilo',
        smiles: 'COC1=C(C=C2C(=C1)CC(C2=O)CC3CCN(CC3)CC4=CC=CC=C4)OC',
        role: 'Inhibidor reversible y específico de AChE (Alzheimer)',
        mw: 379.50,
        logP: 4.27,
        hbd: 0,
        hba: 4,
        tpsa: 38.8,
        rotBonds: 6,
        pdbId: '1EVE'
      },
      {
        name: 'Rivastigmina',
        smiles: 'CCN(C)C(=O)OC1=CC=CC(=C1)[C@H](C)N(C)C',
        role: 'Inhibidor carbamato de acción pseudoirreversible',
        mw: 250.34,
        logP: 2.30,
        hbd: 0,
        hba: 3,
        tpsa: 32.8,
        rotBonds: 4
      },
      {
        name: 'Pralidoxima (2-PAM)',
        smiles: 'C[N+]1=CC=CC=C1/C=N/O',
        role: 'Reactivador oxímico de AChE fosforilada por organofosforados',
        mw: 137.16,
        logP: -0.85,
        hbd: 1,
        hba: 2,
        tpsa: 36.4,
        rotBonds: 1
      }
    ],
    attachments: [
      {
        id: 'att-01-1',
        title: 'Presentación Tema 01: Fármacos Colinérgicos (PDF)',
        type: 'pdf',
        url: 'https://drive.google.com/file/d/1_slides_tema01_qfdos/view',
        size: '6.2 MB',
        date: 'Sept 2026'
      },
      {
        id: 'att-01-2',
        title: 'Apuntes Tema 01: Mecanismos de AChE y Fármacos (PDF)',
        type: 'pdf',
        url: 'https://drive.google.com/file/d/1_apuntes_tema01_qfdos/view',
        size: '3.8 MB',
        date: 'Sept 2026'
      },
      {
        id: 'att-01-3',
        title: 'NotebookLM: Guía Inteligente Sistema Colinérgico',
        type: 'notebook',
        url: 'https://notebooklm.google.com/notebook/qfdos-2627-tema01',
        date: 'Sept 2026'
      },
      {
        id: 'att-01-4',
        title: 'Podcast Spotify: Inhibidores de AChE y Reactivación con 2-PAM',
        type: 'spotify',
        url: 'https://open.spotify.com/episode/3Kx9ColinQFDOS01',
        spotifyUri: 'spotify:episode:3Kx9ColinQFDOS01',
        date: 'Sept 2026'
      }
    ],
    testQuestions: [
      {
        id: 't01-q1',
        topicId: 'tema-01',
        block: 'Enzimología & Mecanismos',
        question: '¿Por qué los carbamatos como la rivastigmina presentan una inhibición de la AChE mucho más duradera (pseudoirreversible) que los ésteres de acetilcolina?',
        options: [
          'Porque forman un enlace covalente carbono-carbono con el bolsillo aniónico.',
          'Porque la velocidad de hidrólisis por agua de la enzima carbamilada (Ser200-O-CO-NR2) es órdenes de magnitud más lenta que la enzima acetilada.',
          'Porque destruyen irreversiblemente la histidina catalítica de la tríada.',
          'Porque bloquean de forma exclusiva la entrada del canal colinérgico periférico.'
        ],
        correctIndex: 1,
        explanation: 'El ataque del residuo catalítico de serina sobre el grupo carbamato genera un intermedio carbamil-enzima cuya descarbamilación hidrolítica por agua requiere horas, a diferencia del intermedio acetil-enzima que se hidroliza en microsegundos.',
        difficulty: 'Medio'
      },
      {
        id: 't01-q2',
        topicId: 'tema-01',
        block: 'Reactivación Química de AChE',
        question: '¿Cuál es la estructura del reactivador nucleofílico 2-PAM capaz de desfosforilar la serina catalítica de la AChE?',
        options: [
          { text: 'Pralidoxima (2-PAM: catión piridinio con oxima orto)', smiles: 'C[N+]1=CC=CC=C1/C=N/O' },
          { text: 'Acetilcolina (éster cuaternario)', smiles: 'CC(=O)OCC[N+](C)(C)C' },
          { text: 'Fisostigmina (alcaloide indol-carbamato)', smiles: 'CNC(=O)Oc1ccc2c(c1)C3(C)CCN(C)C3N2C' },
          { text: 'Atropina (alcaloide tropánico éster)', smiles: 'CN1C2CCC1CC(C2)OC(=O)C(CO)c3ccccc3' }
        ],
        correctIndex: 0,
        explanation: 'La pralidoxima posee un nitrógeno piridínico cuaternario que se ancla en el subsitio aniónico y orienta con precisión angular el grupo oxima (=N-OH) para efectuar el ataque nucleofílico sobre el átomo de fósforo electrofílico del organofosforado.',
        difficulty: 'Avanzado'
      }
    ],
    flashcards: [
      {
        id: 'fc-01-1',
        topicId: 'tema-01',
        concept: 'Mecanismo de Pralidoxima (2-PAM)',
        front: '¿Cuál es el mecanismo químico exacto por el que la pralidoxima reactiva la AChE intoxicada?',
        back: 'El nitrógeno cuaternario de 2-PAM se ancla en el subsitio aniónico de la enzima, orientando geométricamente su grupo oxima (=N-OH) desprotonado para realizar un ataque nucleofílico sobre el átomo de fósforo del organofosforado unido a la Serina catalítica, liberando la enzima activa.',
        smiles: 'C[N+]1=CC=CC=C1/C=N/O',
        difficulty: 'medium',
        category: 'Mecanismos Químicos'
      },
      {
        id: 'fc-01-2',
        topicId: 'tema-01',
        concept: 'Envejecimiento Enzimático (Aging)',
        front: '¿Qué reacción química irreversible define el "envejecimiento" de la AChE fosforilada por organofosforados?',
        back: 'La desalquilación no enzimática de una de las cadenas alcoxi del organofosforado unido a la Serina. Esto genera una carga negativa formal sobre el átomo de oxígeno que repele electrostáticamente a reactivadores como la pralidoxima, haciendo irreversible la inhibición.',
        difficulty: 'hard',
        category: 'Toxicología Molecular'
      }
    ]
  },
  {
    id: 'tema-02',
    number: 'Tema 02',
    title: 'Sistema Adrenérgico',
    subtitle: 'Catecolaminas, Agonistas β2 Selectivos y Antagonistas β-bloqueantes',
    description: 'Biosíntesis y degradación de catecolaminas (MAO, COMT). Diferenciación estructural entre receptores alfa (α1, α2) y beta (β1, β2, β3). SAR de feniletanolaminas y ariloxipropanolaminas. Diseño de agonistas β2 de acción corta (SABA) y prolongada (LABA/ultra-LABA) para asma/EPOC, y desarrollo de β-bloqueantes cardio-selectivos (metoprolol, atenolol, bisoprolol).',
    keyConcepts: [
      'SAR de catecolaminas y sustitución en el nitrógeno amino',
      'Protección metabólica frente a COMT (sustitución saligenina/resorcinol)',
      'Agonistas selectivos β2: Salbutamol, Salmeterol, Formoterol, Indacaterol',
      'Evolución de β-bloqueantes: Dicloroisoprenalina a Propranolol',
      'Ariloxipropanolaminas y cardio-selectividad β1 (Atenolol, Bisoprolol)',
      'Efectos vasculares adicionales (Carvedilol, Nebivolol)'
    ],
    slideCount: 64,
    pdbTargetId: '2RH1',
    targetName: 'Receptor β2-Adrenérgico Humano unido a Timolol',
    status: 'Publicado',
    slidesPdfUrl: 'https://drive.google.com/file/d/1_slides_tema02_qfdos/view',
    slidesPdfName: 'Tema 02: Diapositivas Oficiales Sistema Adrenérgico.pdf',
    notesPdfUrl: 'https://drive.google.com/file/d/1_apuntes_tema02_qfdos/view',
    notesPdfName: 'Tema 02: Apuntes de Agonistas β2 y β-bloqueantes.pdf',
    geminiNotebookUrl: 'https://notebooklm.google.com/notebook/qfdos-2627-tema02',
    spotifyPodcastUrl: 'https://open.spotify.com/episode/5Jk2AdrenQFDOS02',
    drugs: [
      {
        name: 'Salbutamol',
        smiles: 'CC(C)(C)NCC(O)c1ccc(O)c(CO)c1',
        role: 'Agonista selectivo β2 de acción corta (SABA)',
        mw: 239.31,
        logP: 0.64,
        hbd: 3,
        hba: 4,
        tpsa: 72.7,
        rotBonds: 5,
        pdbId: '2RH1'
      },
      {
        name: 'Propranolol',
        smiles: 'CC(C)NCC(O)COc1cccc2ccccc12',
        role: 'Antagonista β-adrenérgico no selectivo clásico',
        mw: 259.34,
        logP: 2.60,
        hbd: 2,
        hba: 3,
        tpsa: 41.5,
        rotBonds: 6
      },
      {
        name: 'Atenolol',
        smiles: 'CC(C)NCC(O)COc1ccc(CC(=O)N)cc1',
        role: 'Antagonista β1 cardio-selectivo hidrofílico',
        mw: 266.34,
        logP: 0.16,
        hbd: 3,
        hba: 4,
        tpsa: 84.6,
        rotBonds: 7
      }
    ],
    attachments: [
      {
        id: 'att-02-1',
        title: 'Presentación Tema 02: Fármacos Adrenérgicos (PDF)',
        type: 'pdf',
        url: 'https://drive.google.com/file/d/1_slides_tema02_qfdos/view',
        size: '7.1 MB',
        date: 'Sept 2026'
      },
      {
        id: 'att-02-2',
        title: 'Apuntes Tema 02: SAR y Modulación Adrenérgica (PDF)',
        type: 'pdf',
        url: 'https://drive.google.com/file/d/1_apuntes_tema02_qfdos/view',
        size: '4.1 MB',
        date: 'Sept 2026'
      },
      {
        id: 'att-02-3',
        title: 'Gemini NotebookLM: Cuaderno Adrenérgico QFDOS',
        type: 'notebook',
        url: 'https://notebooklm.google.com/notebook/qfdos-2627-tema02',
        date: 'Sept 2026'
      },
      {
        id: 'att-02-4',
        title: 'Podcast Spotify: De las Catecolaminas a los β-bloqueantes Selectivos',
        type: 'spotify',
        url: 'https://open.spotify.com/episode/5Jk2AdrenQFDOS02',
        spotifyUri: 'spotify:episode:5Jk2AdrenQFDOS02',
        date: 'Sept 2026'
      }
    ],
    testQuestions: [
      {
        id: 't02-q1',
        topicId: 'tema-02',
        block: 'SAR Adrenérgico',
        question: '¿Qué modificación química en el anillo aromático confiere al salbutamol resistencia metabólica frente a la enzima catecol-O-metiltransferasa (COMT) conservando la activación agonista β2?',
        questionSmiles: 'CC(C)(C)NCC(O)c1ccc(O)c(CO)c1',
        options: [
          'La adición de dos átomos de cloro en posiciones orto (3,5-dicloro).',
          'La sustitución del grupo catecol 3-hidroxilo por un grupo hidroximetilo (-CH2OH, alcohol saligenínico).',
          'La eliminación completa del grupo fenólico en posición 4.',
          'La introducción de un grupo sulfonamida voluminoso.'
        ],
        correctIndex: 1,
        explanation: 'El grupo hidroximetilo en posición 3 (alcohol saligenina) no es reconocido como sustrato por la COMT pero mantiene la capacidad de formar los enlaces de hidrógeno esenciales con el receptor β2-adrenérgico.',
        difficulty: 'Medio'
      },
      {
        id: 't02-q2',
        topicId: 'tema-02',
        block: 'Estructuras de β-bloqueantes',
        question: '¿Cuál de las siguientes moléculas corresponde a un β-bloqueante cardio-selectivo (β1) que contiene una ariloxipropanolamina con sustituyente para-amida hidrofílico?',
        options: [
          { text: 'Atenolol (para-acetamida ariloxipropanolamina)', smiles: 'CC(C)NCC(O)COc1ccc(CC(=O)N)cc1' },
          { text: 'Propranolol (naftil ariloxipropanolamina no selectiva)', smiles: 'CC(C)NCC(O)COc1cccc2ccccc12' },
          { text: 'Salbutamol (agonista β2 saligenina)', smiles: 'CC(C)(C)NCC(O)c1ccc(O)c(CO)c1' },
          { text: 'Adrenalina (catecolamina natural)', smiles: 'CNC[C@H](O)c1ccc(O)c(O)c1' }
        ],
        correctIndex: 0,
        explanation: 'El atenolol incorpora el grupo p-acetamida (-CH2-CO-NH2) que interactúa específicamente con residuos del receptor β1 cardíaco y disminuye la lipofilia global, reduciendo el paso a través de la BHE.',
        difficulty: 'Medio'
      }
    ],
    flashcards: [
      {
        id: 'fc-02-1',
        topicId: 'tema-02',
        concept: 'SAR de Ariloxipropanolaminas',
        front: '¿Cuál es el motivo estructural común presente en la mayoría de los antagonistas β-bloqueantes de segunda y tercera generación?',
        back: 'La cadena lateral de ariloxipropanolamina: Ar-O-CH2-CH(OH)-CH2-NH-R, donde la configuración estereoquímica activa es siempre (S) debido a la inserción del átomo de oxígeno que altera las reglas CIP respecto a las feniletanolaminas (R).',
        smiles: 'CC(C)NCC(O)COc1cccc2ccccc12',
        difficulty: 'hard',
        category: 'SAR & Estereoquímica'
      }
    ]
  },
  {
    id: 'tema-03',
    number: 'Tema 03',
    title: 'Sistema Dopaminérgico',
    subtitle: 'Agonistas Antiparkinsonianos y Antipsicóticos Clásicos vs. Atípicos (D2/5-HT2A)',
    description: 'Vías dopaminérgicas centrales (mesolímbica, mesocortical, nigroestriada y tuberoinfundibular). Diseño de precursores y agonistas dopaminérgicos para el tratamiento del Parkinson (Levodopa, Carbidopa, Pramipexol). Antipsicóticos típicos (fenotiazinas, tioxantenos, butirofenonas) y desarrollo de antipsicóticos atípicos multidiada con menor riesgo de síntomas extrapiramidales (Clozapina, Olanzapina, Risperidona, Aripiprazol).',
    keyConcepts: [
      'Receptores D1-like (D1, D5) y D2-like (D2, D3, D4)',
      'Transportador LAT1 y profármacos de dopamina (Levodopa)',
      'Inhibidores periféricos de AADC (Carbidopa, Benserazida) e inhibidores de COMT (Entacapona)',
      'SAR de Fenotiazinas (Clorpromazina) y Butirofenonas (Haloperidol)',
      'Perfil multidiada D2/5-HT2A en antipsicóticos atípicos',
      'Agonismo parcial en el receptor D2 (Aripiprazol)'
    ],
    slideCount: 52,
    pdbTargetId: '6CM4',
    targetName: 'Receptor Dopaminérgico D2 Humano unido a Risperidona',
    status: 'Publicado',
    slidesPdfUrl: 'https://drive.google.com/file/d/1_slides_tema03_qfdos/view',
    slidesPdfName: 'Tema 03: Diapositivas Oficiales Sistema Dopaminérgico.pdf',
    notesPdfUrl: 'https://drive.google.com/file/d/1_apuntes_tema03_qfdos/view',
    notesPdfName: 'Tema 03: Apuntes Magistrales Fármacos Dopaminérgicos.pdf',
    geminiNotebookUrl: 'https://notebooklm.google.com/notebook/qfdos-2627-tema03',
    spotifyPodcastUrl: 'https://open.spotify.com/episode/8Kd3DopaQFDOS03',
    drugs: [
      {
        name: 'Haloperidol',
        smiles: 'C1CN(CCC1(C2=CC=C(C=C2)Cl)O)CCCC(=O)C3=CC=C(C=C3)F',
        role: 'Antipsicótico clásico butirofenona de alta potencia D2',
        mw: 375.86,
        logP: 4.30,
        hbd: 1,
        hba: 3,
        tpsa: 40.5,
        rotBonds: 6
      },
      {
        name: 'Olanzapina',
        smiles: 'Cc1cc2c(s1)Nc3ccccc3N=C2N4CCN(CC4)C',
        role: 'Antipsicótico atípico tienobenzodiazepínico D2/5-HT2A',
        mw: 312.43,
        logP: 2.80,
        hbd: 1,
        hba: 3,
        tpsa: 36.6,
        rotBonds: 1
      },
      {
        name: 'Levodopa',
        smiles: 'C1=CC(=C(C=C1C[C@@H](C(=O)O)N)O)O',
        role: 'Precursor biosintético de dopamina que cruza BHE vía LAT1',
        mw: 197.19,
        logP: -2.39,
        hbd: 4,
        hba: 4,
        tpsa: 103.8,
        rotBonds: 3
      }
    ],
    attachments: [
      {
        id: 'att-03-1',
        title: 'Presentación Tema 03: Fármacos Dopaminérgicos (PDF)',
        type: 'pdf',
        url: 'https://drive.google.com/file/d/1_slides_tema03_qfdos/view',
        size: '5.9 MB',
        date: 'Sept 2026'
      },
      {
        id: 'att-03-2',
        title: 'Apuntes Tema 03: Antipsicóticos y Parkinson (PDF)',
        type: 'pdf',
        url: 'https://drive.google.com/file/d/1_apuntes_tema03_qfdos/view',
        size: '3.6 MB',
        date: 'Sept 2026'
      },
      {
        id: 'att-03-3',
        title: 'NotebookLM: Cuaderno Dopaminérgico y BHE',
        type: 'notebook',
        url: 'https://notebooklm.google.com/notebook/qfdos-2627-tema03',
        date: 'Sept 2026'
      },
      {
        id: 'att-03-4',
        title: 'Podcast Spotify: De las Fenotiazinas a los Antipsicóticos Atípicos',
        type: 'spotify',
        url: 'https://open.spotify.com/episode/8Kd3DopaQFDOS03',
        spotifyUri: 'spotify:episode:8Kd3DopaQFDOS03',
        date: 'Sept 2026'
      }
    ],
    testQuestions: [
      {
        id: 't03-q1',
        topicId: 'tema-03',
        block: 'Antipsicóticos',
        question: '¿Cuál es la razón principal por la que los antipsicóticos atípicos como la clozapina u olanzapina presentan una incidencia significativamente menor de síntomas extrapiramidales (SEP) que los neurolépticos típicos como el haloperidol?',
        options: [
          'Su afinidad nula por todos los receptores del sistema nervioso central.',
          'Su elevada relación de antagonismo 5-HT2A frente a D2 y su rápida velocidad de disociación ("fast-off") del receptor D2.',
          'Su capacidad para degradar químicamente la dopamina sináptica.',
          'Su bloqueo exclusivo en la médula espinal.'
        ],
        correctIndex: 1,
        explanation: 'El bloqueo de receptores 5-HT2A en la vía nigroestriada desinhibe la liberación de dopamina localmente, compitiendo con el fármaco y reduciendo el bloqueo D2 excesivo responsable de los síntomas extrapiramidales.',
        difficulty: 'Medio'
      }
    ],
    flashcards: [
      {
        id: 'fc-03-1',
        topicId: 'tema-03',
        concept: 'Transporte de Levodopa por LAT1',
        front: '¿Por qué la dopamina exógena no es eficaz en el Parkinson y se debe administrar Levodopa?',
        back: 'La dopamina es demasiado hidrofílica y se encuentra protonada a pH fisiológico, sin transportador en la barrera hematoencefálica (BHE). La Levodopa, al ser un aminoácido neutro zwitteriónico, utiliza el transportador de aminoácidos neutros grandes (LAT1) para ingresar activamente al cerebro, donde es descarboxilada a dopamina por la DOPA descarboxilasa central.',
        smiles: 'C1=CC(=C(C=C1C[C@@H](C(=O)O)N)O)O',
        difficulty: 'medium',
        category: 'Transporte & ADMET'
      }
    ]
  },
  {
    id: 'tema-04',
    number: 'Tema 04',
    title: 'Sistema Serotoninérgico',
    subtitle: 'Agonistas 5-HT1B/1D (Triptanes), Inhibidores de Recaptación (ISRS) y Antagonistas 5-HT3 (Setrones)',
    description: 'Diversidad de subtipos de receptores 5-HT (receptores acoplados a proteínas G e ionotrópico 5-HT3). Fármacos antimigrañosos: de los alcaloides del cornezuelo a los triptanes agonistas selectivos 5-HT1B/1D. Antidepresivos inhibidores selectivos de la recaptación de serotonina (ISRS: fluoxetina, citalopram, sertralina). Antieméticos antagonistas 5-HT3 en quimioterapia (ondansetrón, granisetrón).',
    keyConcepts: [
      'Subfamilias de receptores 5-HT (5-HT1 a 5-HT7)',
      'Estructura del núcleo indol y SAR de triptanes (Sumatriptán, Zolmitriptán)',
      'Transportador SERT e inhibidores selectivos (ISRS)',
      'Receptor ionotrópico 5-HT3 y antagonistas setrones (Ondansetrón)',
      'Efectos procinéticos mediados por receptores 5-HT4'
    ],
    slideCount: 48,
    pdbTargetId: '6G79',
    targetName: 'Transportador Humano de Serotonina (SERT) unido a Paroxetina',
    status: 'Publicado',
    slidesPdfUrl: 'https://drive.google.com/file/d/1_slides_tema04_qfdos/view',
    slidesPdfName: 'Tema 04: Diapositivas Oficiales Sistema Serotoninérgico.pdf',
    notesPdfUrl: 'https://drive.google.com/file/d/1_apuntes_tema04_qfdos/view',
    notesPdfName: 'Tema 04: Apuntes Magistrales de Triptanes e ISRS.pdf',
    geminiNotebookUrl: 'https://notebooklm.google.com/notebook/qfdos-2627-tema04',
    spotifyPodcastUrl: 'https://open.spotify.com/episode/9Kx4SeroQFDOS04',
    drugs: [
      {
        name: 'Sumatriptán',
        smiles: 'CNS(=O)(=O)CC1=CC2=C(C=C1)NC=C2CCN(C)C',
        role: 'Agonista selectivo 5-HT1B/1D antimigrañoso pionero',
        mw: 295.40,
        logP: 0.93,
        hbd: 2,
        hba: 4,
        tpsa: 68.3,
        rotBonds: 5
      },
      {
        name: 'Fluoxetina',
        smiles: 'CNCCC(c1ccccc1)Oc2ccc(C(F)(F)F)cc2',
        role: 'Inhibidor selectivo de la recaptación de serotonina (ISRS)',
        mw: 309.33,
        logP: 4.05,
        hbd: 1,
        hba: 2,
        tpsa: 21.3,
        rotBonds: 5,
        pdbId: '6G79'
      },
      {
        name: 'Ondansetrón',
        smiles: 'CC1=NC=CN1CC2CCC3=C(C2=O)C4=CC=CC=C4N3C',
        role: 'Antagonista 5-HT3 antiemético para quimioterapia',
        mw: 293.36,
        logP: 2.10,
        hbd: 0,
        hba: 3,
        tpsa: 35.1,
        rotBonds: 1
      }
    ],
    attachments: [
      {
        id: 'att-04-1',
        title: 'Presentación Tema 04: Fármacos Serotoninérgicos (PDF)',
        type: 'pdf',
        url: 'https://drive.google.com/file/d/1_slides_tema04_qfdos/view',
        size: '5.6 MB',
        date: 'Sept 2026'
      },
      {
        id: 'att-04-2',
        title: 'Apuntes Tema 04: Triptanes, ISRS y Setrones (PDF)',
        type: 'pdf',
        url: 'https://drive.google.com/file/d/1_apuntes_tema04_qfdos/view',
        size: '3.5 MB',
        date: 'Sept 2026'
      },
      {
        id: 'att-04-3',
        title: 'NotebookLM: Cuaderno Serotoninérgico 5-HT',
        type: 'notebook',
        url: 'https://notebooklm.google.com/notebook/qfdos-2627-tema04',
        date: 'Sept 2026'
      },
      {
        id: 'att-04-4',
        title: 'Podcast Spotify: Triptanes en Migraña y la Selectividad de los ISRS',
        type: 'spotify',
        url: 'https://open.spotify.com/episode/9Kx4SeroQFDOS04',
        spotifyUri: 'spotify:episode:9Kx4SeroQFDOS04',
        date: 'Sept 2026'
      }
    ],
    testQuestions: [
      {
        id: 't04-q1',
        topicId: 'tema-04',
        block: 'SAR Triptanes',
        question: '¿Qué modificación química en posición 5 del anillo indólico de la serotonina permitió el desarrollo del sumatriptán con selectividad vasoconstrictora craneal 5-HT1B/1D?',
        questionSmiles: 'CNS(=O)(=O)CC1=CC2=C(C=C1)NC=C2CCN(C)C',
        options: [
          'La sustitución del grupo 5-hidroxilo por una sulfonamida aromática (-CH2-SO2-NHMe).',
          'La alquilación del nitrógeno indólico con un grupo bencilo voluminoso.',
          'La reducción completa del anillo indol a indolilamina.',
          'La fluoración en posición 2 del anillo de benceno.'
        ],
        correctIndex: 0,
        explanation: 'La introducción del grupo N-metilmetanosulfonamidoetilo en C5 y dimetilaminoetilo en C3 confirió selectividad estricta para los receptores vasculares craneales 5-HT1B/1D evitando la activación de receptores cardíacos 5-HT2B.',
        difficulty: 'Avanzado'
      }
    ],
    flashcards: [
      {
        id: 'fc-04-1',
        topicId: 'tema-04',
        concept: 'Transportador SERT vs. Receptores 5-HT',
        front: '¿Cuál es la diferencia farmacológica fundamental entre la acción de la fluoxetina (ISRS) y el sumatriptán?',
        back: 'La fluoxetina es un inhibidor alostérico del transportador de recaptación SERT (aumentando serotonina en la biofase sináptica), mientras que el sumatriptán es un agonista directo ortostérico de los receptores metabotrópicos 5-HT1B/1D.',
        smiles: 'CNCCC(c1ccccc1)Oc2ccc(C(F)(F)F)cc2',
        difficulty: 'medium',
        category: 'Mecanismo de Acción'
      }
    ]
  },
  {
    id: 'tema-05',
    number: 'Tema 05',
    title: 'Sistema GABAérgico',
    subtitle: 'Moduladores Alostéricos Positivos de GABAA: Benzodiazepinas, Barbitúricos y Fármacos Z',
    description: 'Estructura pentamérica del complejo receptor ionotrópico GABAA (canal de Cl-). Sitio de unión de GABA vs. sitios alostéricos moduladores. SAR de las 1,4-benzodiazepinas (Diazepam, Lorazepam, Alprazolam) y su farmacóforo. Hipnóticos no benzodiazepínicos o "Fármacos Z" selectivos de la subunidad alfa-1 (Zolpidem, Zopiclona). Antagonista específico del sitio benzodiazepínico (Flumazenil) para revertir sedación y sobredosis.',
    keyConcepts: [
      'Subunidades del receptor GABAA (2α, 2β, 1γ) y poro de Cloro',
      'Modulación alostérica positiva (aumento de frecuencia de apertura vs. tiempo)',
      'SAR de 1,4-benzodiazepinas: sustituyentes en C7 (electronegativo), C5 (fenilo) y anillo A/B/C',
      'Profármacos y metabolitos activos de vida media larga (Nordiazepam, Oxazepam)',
      'Fármacos Z (Zolpidem) y selectividad hipnótica α1',
      'Flumazenil como modulador neutro / antagonista competitivo del sitio BZD'
    ],
    slideCount: 50,
    pdbTargetId: '6HUP',
    targetName: 'Receptor GABAA Humano unido a Diazepam y GABA',
    status: 'Publicado',
    slidesPdfUrl: 'https://drive.google.com/file/d/1_slides_tema05_qfdos/view',
    slidesPdfName: 'Tema 05: Diapositivas Oficiales Sistema GABAérgico.pdf',
    notesPdfUrl: 'https://drive.google.com/file/d/1_apuntes_tema05_qfdos/view',
    notesPdfName: 'Tema 05: Apuntes Magistrales Benzodiazepinas y GABAA.pdf',
    geminiNotebookUrl: 'https://notebooklm.google.com/notebook/qfdos-2627-tema05',
    spotifyPodcastUrl: 'https://open.spotify.com/episode/2Kx5GabaQFDOS05',
    drugs: [
      {
        name: 'Diazepam',
        smiles: 'CN1C(=O)CN=C(c2ccccc2)c3cc(Cl)ccc13',
        role: 'Modulador alostérico positivo prototípico del receptor GABAA',
        mw: 284.74,
        logP: 2.82,
        hbd: 0,
        hba: 2,
        tpsa: 32.7,
        rotBonds: 1,
        pdbId: '6HUP'
      },
      {
        name: 'Zolpidem',
        smiles: 'CC1=CC=C(C=C1)C2=C(N3C=C(C=CC3=N2)C)CC(=O)N(C)C',
        role: 'Hipnótico imidazopiridina agonista selectivo del sitio α1 de GABAA',
        mw: 307.39,
        logP: 2.40,
        hbd: 0,
        hba: 3,
        tpsa: 38.1,
        rotBonds: 3
      },
      {
        name: 'Flumazenil',
        smiles: 'CCOC(=O)C1=C2CN(C(=O)C3=C(N2C=N1)C=CC(=C3)F)C',
        role: 'Antagonista puro del sitio benzodiazepínico (antídoto de rescate)',
        mw: 303.29,
        logP: 1.65,
        hbd: 0,
        hba: 4,
        tpsa: 58.6,
        rotBonds: 2
      }
    ],
    attachments: [
      {
        id: 'att-05-1',
        title: 'Presentación Tema 05: Fármacos GABAérgicos (PDF)',
        type: 'pdf',
        url: 'https://drive.google.com/file/d/1_slides_tema05_qfdos/view',
        size: '6.0 MB',
        date: 'Sept 2026'
      },
      {
        id: 'att-05-2',
        title: 'Apuntes Tema 05: Benzodiazepinas y Canal de Cloro (PDF)',
        type: 'pdf',
        url: 'https://drive.google.com/file/d/1_apuntes_tema05_qfdos/view',
        size: '3.7 MB',
        date: 'Sept 2026'
      },
      {
        id: 'att-05-3',
        title: 'NotebookLM: Cuaderno GABAérgico y Farmacóforo BZD',
        type: 'notebook',
        url: 'https://notebooklm.google.com/notebook/qfdos-2627-tema05',
        date: 'Sept 2026'
      },
      {
        id: 'att-05-4',
        title: 'Podcast Spotify: Mecanismo Alostérico de las Benzodiazepinas',
        type: 'spotify',
        url: 'https://open.spotify.com/episode/2Kx5GabaQFDOS05',
        spotifyUri: 'spotify:episode:2Kx5GabaQFDOS05',
        date: 'Sept 2026'
      }
    ],
    testQuestions: [
      {
        id: 't05-q1',
        topicId: 'tema-05',
        block: 'SAR Benzodiazepinas',
        question: '¿Qué requerimiento electrónico en la posición 7 del anillo A de las 1,4-benzodiazepinas es imprescindible para mantener la alta afinidad por el receptor GABAA?',
        options: [
          'Un grupo electrodador voluminoso como un tert-butilo.',
          'Un sustituyente fuertemente atractor de electrones como un halógeno (-Cl, -Br) o un grupo nitro (-NO2).',
          'La hidroxilación libre en posición 7.',
          'La eliminación completa del anillo aromático A.'
        ],
        correctIndex: 1,
        explanation: 'La densidad electrónica del anillo A debe ser baja; un sustituyente atractor de electrones en posición 7 (ej. cloro en diazepam o nitro en clonazepam) polariza la estructura facilitando la interacción de dipolo con el receptor.',
        difficulty: 'Medio'
      }
    ],
    flashcards: [
      {
        id: 'fc-05-1',
        topicId: 'tema-05',
        concept: 'Mecanismo de Flumazenil',
        front: '¿Cuál es el mecanismo por el cual el flumazenil revierte la sedación por sobredosis de benzodiazepinas?',
        back: 'El flumazenil es un antagonista competitivo neutro que ocupa con alta afinidad el mismo sitio alostérico que las benzodiazepinas en la interfaz α/γ de GABAA, desplazándolas sin alterar la frecuencia de apertura del canal de Cloro.',
        smiles: 'CCOC(=O)C1=C2CN(C(=O)C3=C(N2C=N1)C=CC(=C3)F)C',
        difficulty: 'medium',
        category: 'Farmacología Molecular'
      }
    ]
  },
  {
    id: 'tema-06',
    number: 'Tema 06',
    title: 'Sistema Opioide & Manejo del Dolor',
    subtitle: 'Morfina, Análogos Semisintéticos, Péptidos Opioides y Antagonistas Puros',
    description: 'Transmisión nociceptiva y receptores opioides acoplados a proteína Gi (Mu, Kappa, Delta). El núcleo morfinano y sus derivados semisintéticos y sintéticos (codeína, heroína, oximorfona, metadona, fentanilo). Farmacóforo opioide (modelo de Beckett-Casy). Modificaciones estructurales críticas en C3, C6, C14 y sobre el nitrógeno terciario (conversión de agonistas a antagonistas como Naloxona y Naltrexona).',
    keyConcepts: [
      'Subtipos de receptores opioides (MOR, KOR, DOR)',
      'Estructura pentacíclica de la morfina y simplificación estructural',
      'Papel del fenol C3 libre en la afinidad y glucuronidación metabólica (M3G vs M6G)',
      'Modificaciones en C6: desoxigenación e incremento de potencia lipofílica',
      'Sustitución en el átomo de Nitrógeno: N-metilo (agonista) vs. N-alilo / N-ciclopropilmetilo (antagonista puro)',
      'Familia de las fenilpiperidinas y análogos 4-anilidopiperidinas (Fentanilo)'
    ],
    slideCount: 58,
    pdbTargetId: '4DKL',
    targetName: 'Receptor Opioide Mu Humano unido al Antagonista β-FNA',
    status: 'Publicado',
    slidesPdfUrl: 'https://drive.google.com/file/d/1_slides_tema06_qfdos/view',
    slidesPdfName: 'Tema 06: Diapositivas Oficiales Sistema Opioide.pdf',
    notesPdfUrl: 'https://drive.google.com/file/d/1_apuntes_tema06_qfdos/view',
    notesPdfName: 'Tema 06: Apuntes Magistrales Fármacos Opioides y SAR.pdf',
    geminiNotebookUrl: 'https://notebooklm.google.com/notebook/qfdos-2627-tema06',
    spotifyPodcastUrl: 'https://open.spotify.com/episode/1Kx6OpioQFDOS06',
    drugs: [
      {
        name: 'Morfina',
        smiles: 'CN1CC[C@]23[C@@H]4[C@H]1CC5=C2C(=C(C=C5)O)O[C@H]3[C@H](C=C4)O',
        role: 'Agonista opioide prototípico de referencia analgésica',
        mw: 285.34,
        logP: 0.89,
        hbd: 2,
        hba: 4,
        tpsa: 49.3,
        rotBonds: 0,
        pdbId: '4DKL'
      },
      {
        name: 'Fentanilo',
        smiles: 'CCC(=O)N(c1ccccc1)C2CCN(CCc3ccccc3)CC2',
        role: 'Analgésico opioide sintético de ultra-alta potencia y rápida acción',
        mw: 336.47,
        logP: 4.05,
        hbd: 0,
        hba: 2,
        tpsa: 23.6,
        rotBonds: 6
      },
      {
        name: 'Naloxona',
        smiles: 'C=CCN1CC[C@]23[C@@H]4C(=O)CC[C@]2([C@H]1CC5=C3C(=C(C=C5)O)O4)O',
        role: 'Antagonista puro de receptores opioides (reversión de sobredosis)',
        mw: 327.37,
        logP: 1.40,
        hbd: 2,
        hba: 4,
        tpsa: 69.7,
        rotBonds: 2
      }
    ],
    attachments: [
      {
        id: 'att-06-1',
        title: 'Presentación Tema 06: Analgésicos Opioides (PDF)',
        type: 'pdf',
        url: 'https://drive.google.com/file/d/1_slides_tema06_qfdos/view',
        size: '6.8 MB',
        date: 'Sept 2026'
      },
      {
        id: 'att-06-2',
        title: 'Apuntes Tema 06: SAR Morfinanos y Péptidos Opioides (PDF)',
        type: 'pdf',
        url: 'https://drive.google.com/file/d/1_apuntes_tema06_qfdos/view',
        size: '3.9 MB',
        date: 'Sept 2026'
      },
      {
        id: 'att-06-3',
        title: 'NotebookLM: Cuaderno Opioides y Beckett-Casy',
        type: 'notebook',
        url: 'https://notebooklm.google.com/notebook/qfdos-2627-tema06',
        date: 'Sept 2026'
      },
      {
        id: 'att-06-4',
        title: 'Podcast Spotify: De la Morfina al Fentanilo y Antagonistas Puros',
        type: 'spotify',
        url: 'https://open.spotify.com/episode/1Kx6OpioQFDOS06',
        spotifyUri: 'spotify:episode:1Kx6OpioQFDOS06',
        date: 'Sept 2026'
      }
    ],
    testQuestions: [
      {
        id: 't06-q1',
        topicId: 'tema-06',
        block: 'SAR Opioides',
        question: '¿Qué modificación química en el átomo de nitrógeno terciario de la morfina o oximorfona transforma un agonista opioide potente en un antagonista puro competitivo como la naloxona?',
        questionSmiles: 'C=CCN1CC[C@]23[C@@H]4C(=O)CC[C@]2([C@H]1CC5=C3C(=C(C=C5)O)O4)O',
        options: [
          'La adición de un grupo metilo extra para formar una sal cuaternaria.',
          'La sustitución del grupo N-metilo por un grupo N-alilo (-CH2-CH=CH2) o N-ciclopropilmetilo.',
          'La oxidación del nitrógeno a N-óxido.',
          'La acetilación directa del nitrógeno terciario.'
        ],
        correctIndex: 1,
        explanation: 'La presencia de una cadena voluminosa e insaturada o cíclica sobre el nitrógeno orienta el grupo hacia una bolsa hidrofóbica auxiliar del receptor que impide el cambio conformacional necesario para acoplar la proteína Gi, bloqueando la activación y actuando como antagonista puro.',
        difficulty: 'Medio'
      }
    ],
    flashcards: [
      {
        id: 'fc-06-1',
        topicId: 'tema-06',
        concept: 'Regla de Beckett-Casy',
        front: '¿Cuáles son los 4 elementos topológicos del modelo farmacofórico de Beckett-Casy en analgésicos opioides?',
        back: '1) Anillo aromático plano para interacciones hidrofóbicas/van der Waals.\n2) Carbono cuaternario adyacente que posiciona el anillo fuera del plano.\n3) Cadena hidrocarbonada etilénica (-CH2-CH2-).\n4) Nitrógeno terciario básico protonado a pH fisiológico para formar un enlace iónico con un residuo de Aspartato (Asp147 en MOR).',
        smiles: 'CN1CC[C@]23[C@@H]4[C@H]1CC5=C2C(=C(C=C5)O)O[C@H]3[C@H](C=C4)O',
        difficulty: 'medium',
        category: 'Farmacóforos'
      }
    ]
  },
  {
    id: 'tema-07',
    number: 'Tema 07',
    title: 'Sistema Histaminérgico',
    subtitle: 'Antihistamínicos H1 (Clásicos y No Sedantes) y Antiulcerosos Antagonistas H2',
    description: 'Biosíntesis y tautomería de la histamina. Receptores H1 (alergia/inflamación) y H2 (secreción ácida gástrica). SAR de antihistamínicos H1 de primera generación (etanolaminas, etilendiaminas, piperazinas) y diseño de fármacos de segunda generación que no cruzan la BHE (cetirizina, fexofenadina, loratadina). Desarrollo de antagonistas H2 a partir del modelo de guanilhistamina y burimamida hasta cimetidina, ranitidina y famotidina.',
    keyConcepts: [
      'Tautomería tele (Nτ) y pros (Nπ) de la histamina',
      'Antihistamínicos H1 de 1ª generación: lipofilia y penetración en BHE (sedación)',
      'Estrategias para evitar la BHE en H1 de 2ª generación: zwitteriones y cadenas ácidas',
      'Desarrollo de antagonistas H2: cadena flexible espaciadora y grupo terminal neutro polar (ciano-guanidina, nitroetenodiamina)',
      'Interacciones farmacológicas por inhibición de CYP450 (Cimetidina vs. Ranitidina)'
    ],
    slideCount: 46,
    pdbTargetId: '3RZE',
    targetName: 'Receptor Histaminérgico H1 Humano unido a Doxepina',
    status: 'Publicado',
    slidesPdfUrl: 'https://drive.google.com/file/d/1_slides_tema07_qfdos/view',
    slidesPdfName: 'Tema 07: Diapositivas Oficiales Sistema Histaminérgico.pdf',
    notesPdfUrl: 'https://drive.google.com/file/d/1_apuntes_tema07_qfdos/view',
    notesPdfName: 'Tema 07: Apuntes Magistrales Antihistamínicos H1 y H2.pdf',
    geminiNotebookUrl: 'https://notebooklm.google.com/notebook/qfdos-2627-tema07',
    spotifyPodcastUrl: 'https://open.spotify.com/episode/3Kx7HistaQFDOS07',
    drugs: [
      {
        name: 'Cetirizina',
        smiles: 'c1ccc(cc1)C(c2ccc(Cl)cc2)N3CCN(CC3)CCOCC(=O)O',
        role: 'Antihistamínico H1 de 2ª generación no sedante (zwitterión)',
        mw: 388.89,
        logP: 1.70,
        hbd: 1,
        hba: 4,
        tpsa: 53.6,
        rotBonds: 6,
        pdbId: '3RZE'
      },
      {
        name: 'Ranitidina',
        smiles: 'CN/C(=C\[N+](=O)[O-])/NCCSCC1=CC=C(O1)CN(C)C',
        role: 'Antagonista H2 antiulceroso con grupo nitroetenodiamina',
        mw: 314.41,
        logP: 0.27,
        hbd: 2,
        hba: 6,
        tpsa: 85.5,
        rotBonds: 8
      },
      {
        name: 'Difenhidramina',
        smiles: 'CN(C)CCOC(c1ccccc1)c2ccccc2',
        role: 'Antihistamínico H1 clásico de 1ª generación sedante',
        mw: 255.35,
        logP: 3.27,
        hbd: 0,
        hba: 2,
        tpsa: 12.5,
        rotBonds: 5
      }
    ],
    attachments: [
      {
        id: 'att-07-1',
        title: 'Presentación Tema 07: Fármacos Histaminérgicos (PDF)',
        type: 'pdf',
        url: 'https://drive.google.com/file/d/1_slides_tema07_qfdos/view',
        size: '5.4 MB',
        date: 'Sept 2026'
      },
      {
        id: 'att-07-2',
        title: 'Apuntes Tema 07: Antihistamínicos y Bloqueantes H2 (PDF)',
        type: 'pdf',
        url: 'https://drive.google.com/file/d/1_apuntes_tema07_qfdos/view',
        size: '3.4 MB',
        date: 'Sept 2026'
      },
      {
        id: 'att-07-3',
        title: 'NotebookLM: Cuaderno Histamina H1 y H2',
        type: 'notebook',
        url: 'https://notebooklm.google.com/notebook/qfdos-2627-tema07',
        date: 'Sept 2026'
      },
      {
        id: 'att-07-4',
        title: 'Podcast Spotify: Antihistamínicos de 2ª Generación y BHE',
        type: 'spotify',
        url: 'https://open.spotify.com/episode/3Kx7HistaQFDOS07',
        spotifyUri: 'spotify:episode:3Kx7HistaQFDOS07',
        date: 'Sept 2026'
      }
    ],
    testQuestions: [
      {
        id: 't07-q1',
        topicId: 'tema-07',
        block: 'Antihistamínicos H1',
        question: '¿Qué característica estructural explica la ausencia de efectos sedantes centrales en la cetirizina frente a la hidroxizina de la que deriva?',
        questionSmiles: 'c1ccc(cc1)C(c2ccc(Cl)cc2)N3CCN(CC3)CCOCC(=O)O',
        options: [
          'La eliminación completa del anillo aromático clorado.',
          'La presencia de un grupo ácido carboxílico terminal (-COOH) que a pH fisiológico existe como ion carboxilato zwitteriónico, impidiendo atravesar la BHE.',
          'Su degradación ácida ultra-rápida en el torrente sanguíneo.',
          'Su unión irreversible a los receptores H2 gástricos.'
        ],
        correctIndex: 1,
        explanation: 'La cetirizina es el metabolito carboxílico de la hidroxizina. Su carácter polar zwitteriónico reduce drásticamente la permeabilidad pasiva a través de la barrera hematoencefálica, eliminando la somnolencia central.',
        difficulty: 'Fácil'
      }
    ],
    flashcards: [
      {
        id: 'fc-07-1',
        topicId: 'tema-07',
        concept: 'Grupos Isósteros en Antagonistas H2',
        front: '¿Por qué en los antagonistas H2 se sustituyó el grupo tiourea de la metiamida por cianoguanidina (cimetidina) o nitroetenodiamina (ranitidina)?',
        back: 'El grupo tiourea producía agranulocitosis tóxica en humanos. Los grupos cianoguanidina y nitroetenodiamina actúan como bioisósteros neutros polares coplanares, no ionizables a pH fisiológico, conservando la alta afinidad por H2 sin citotoxicidad medular.',
        smiles: 'CN/C(=C\[N+](=O)[O-])/NCCSCC1=CC=C(O1)CN(C)C',
        difficulty: 'medium',
        category: 'Bioisosterismo & Toxicología'
      }
    ]
  },
  {
    id: 'tema-08',
    number: 'Tema 08',
    title: 'Sistema Renina-Angiotensina',
    subtitle: 'Inhibidores de ECA (IECA Peptidomiméticos) y Antagonistas de Receptores AT1 (ARA-II)',
    description: 'Fisiopatología del eje renina-angiotensina-aldosterona (SRAA). Diseño racional de inhibidores de la Enzima Convertidora de Angiotensina (ECA, metaloproteasa con Zn2+): de los venenos de serpiente (Bothrops jararaca) y el modelo de carboxipeptidasa A al diseño de Captopril (grupo sulfhidrilo), Enalapril (profármaco dicarboxílico) y Lisinopril. Antagonistas de receptores de Angiotensina II (ARA-II) basados en el sistema bifenil-tetrazol (Losartán, Valsartán, Candesartán).',
    keyConcepts: [
      'Cascada proteolítica: Angiotensinógeno -> Angiotensina I -> Angiotensina II',
      'Centro activo de la ECA: átomo de Zinc catalítico (Zn2+) y bolsas S1, S1\', S2\'',
      'Captopril y el quelante tiol (-SH): toxicidad dérmica y disgeusia',
      'Transición a quelantes dicarboxílicos e inhibidores con profármacos éster (Enalaprilat/Enalapril)',
      'Modelo farmacofórico de ARA-II: bioisosterismo entre el carboxilato C-terminal de Ang II y el anillo 1H-tetrazol'
    ],
    slideCount: 54,
    pdbTargetId: '1E86',
    targetName: 'ECA Humana Somática Complejada con Captopril (Zn2+)',
    status: 'Publicado',
    slidesPdfUrl: 'https://drive.google.com/file/d/1_slides_tema08_qfdos/view',
    slidesPdfName: 'Tema 08: Diapositivas Oficiales SRAA (IECA & ARA-II).pdf',
    notesPdfUrl: 'https://drive.google.com/file/d/1_apuntes_tema08_qfdos/view',
    notesPdfName: 'Tema 08: Apuntes de Inhibidores de ECA y Antagonistas AT1.pdf',
    geminiNotebookUrl: 'https://notebooklm.google.com/notebook/qfdos-2627-tema08',
    spotifyPodcastUrl: 'https://open.spotify.com/episode/4Kx8SraaQFDOS08',
    drugs: [
      {
        name: 'Captopril',
        smiles: 'C[C@H](CS)C(=O)N1CCC[C@H]1C(=O)O',
        role: 'Inhibidor pionero de ECA con grupo sulfhidrilo quelante de Zn2+',
        mw: 217.29,
        logP: 0.84,
        hbd: 2,
        hba: 3,
        tpsa: 57.6,
        rotBonds: 3,
        pdbId: '1E86'
      },
      {
        name: 'Enalapril',
        smiles: 'CCOC(=O)[C@H](CCC1=CC=CC=C1)N[C@@H](C)C(=O)N2CCC[C@H]2C(=O)O',
        role: 'Profármaco éster etílico dicarboxilato de Enalaprilat',
        mw: 376.45,
        logP: 1.38,
        hbd: 2,
        hba: 5,
        tpsa: 78.7,
        rotBonds: 8
      },
      {
        name: 'Losartán',
        smiles: 'CCCCC1=NC(=C(N1CC2=CC=C(C=C2)C3=CC=CC=C3C4=NNN=N4)CO)Cl',
        role: 'Antagonista de receptores AT1 (ARA-II) con anillo bifenil-tetrazol',
        mw: 422.91,
        logP: 4.40,
        hbd: 2,
        hba: 5,
        tpsa: 75.3,
        rotBonds: 6
      }
    ],
    attachments: [
      {
        id: 'att-08-1',
        title: 'Presentación Tema 08: Fármacos del SRAA (PDF)',
        type: 'pdf',
        url: 'https://drive.google.com/file/d/1_slides_tema08_qfdos/view',
        size: '6.4 MB',
        date: 'Sept 2026'
      },
      {
        id: 'att-08-2',
        title: 'Apuntes Tema 08: Metaloproteasas y Bloqueo de AT1 (PDF)',
        type: 'pdf',
        url: 'https://drive.google.com/file/d/1_apuntes_tema08_qfdos/view',
        size: '4.0 MB',
        date: 'Sept 2026'
      },
      {
        id: 'att-08-3',
        title: 'NotebookLM: Cuaderno SRAA, Enalapril y ARA-II',
        type: 'notebook',
        url: 'https://notebooklm.google.com/notebook/qfdos-2627-tema08',
        date: 'Sept 2026'
      },
      {
        id: 'att-08-4',
        title: 'Podcast Spotify: Diseño de IECAs y Quelación del Zinc Catalítico',
        type: 'spotify',
        url: 'https://open.spotify.com/episode/4Kx8SraaQFDOS08',
        spotifyUri: 'spotify:episode:4Kx8SraaQFDOS08',
        date: 'Sept 2026'
      }
    ],
    testQuestions: [
      {
        id: 't08-q1',
        topicId: 'tema-08',
        block: 'IECA & ARA-II',
        question: '¿Por qué el enalaprilat (el principio activo con ambos carboxilatos libres) debe administrarse por vía oral en forma de su profármaco éster monoetílico enalapril?',
        questionSmiles: 'CCOC(=O)[C@H](CCC1=CC=CC=C1)N[C@@H](C)C(=O)N2CCC[C@H]2C(=O)O',
        options: [
          'Porque el enalaprilat se oxida inmediatamente al entrar en contacto con el aire.',
          'Porque el enalaprilat es un zwitterión tri-iónico con LogP negativo y absorción oral insignificante (<10%), mientras que el monoéster tiene la lipofilia óptima para atravesar el epitelio intestinal y luego ser hidrolizado por esterasas hepáticas.',
          'Porque el enalaprilat destruye la microbiota intestinal.',
          'Porque el éster etílico se une de forma covalente a la renina.'
        ],
        correctIndex: 1,
        explanation: 'El enalaprilat libre contiene dos ácidos carboxílicos y una amina secundaria, resultando en una polaridad excesiva que impide su difusión pasiva. El profármaco éster etílico enmascara una carga negativa facilitando su absorción oral adecuada (~60%).',
        difficulty: 'Medio'
      }
    ],
    flashcards: [
      {
        id: 'fc-08-1',
        topicId: 'tema-08',
        concept: 'Tetrazol como Bioisóstero de Carboxilato',
        front: '¿Qué ventajas bioisostéricas aporta el anillo 1H-tetrazol-5-ilo presente en el losartán frente a un grupo ácido carboxílico tradicional?',
        back: 'El tetrazol tiene un pKa muy similar (~4.5-5.0), por lo que se desprotona a pH fisiológico manteniendo la interacción iónica con el receptor AT1, pero es 10 veces más lipofílico y más voluminoso, resistiendo la glucuronidación directa y mejorando la penetración membranar.',
        smiles: 'CCCCC1=NC(=C(N1CC2=CC=C(C=C2)C3=CC=CC=C3C4=NNN=N4)CO)Cl',
        difficulty: 'hard',
        category: 'Bioisosterismo'
      }
    ]
  },
  {
    id: 'tema-09',
    number: 'Tema 09',
    title: 'AINEs & Coxibs',
    subtitle: 'Inhibición de Ciclooxigenasas (COX-1/COX-2), Profenos y Bolsillo Alostérico Val523',
    description: 'Ruta del ácido araquidónico y síntesis de prostanoides y tromboxano. Mecanismo de acetilación irreversible de Ser530 en COX-1 y Ser516 en COX-2 por el ácido acetilsalicílico (aspirina). SAR de derivados de ácido arilacético (diclofenaco, indometacina) y arilpropiónico (profenos: ibuprofeno, naproxeno, ketoprofeno) y su inversión quiral metabólica in vivo. Descubrimiento de COX-2 y diseño racional de coxibs (celecoxib, etoricoxib) aprovechando el bolsillo secundario accesible por la presencia de Val523 frente a Ile523 en COX-1.',
    keyConcepts: [
      'Diferencias estructurales entre COX-1 constitutiva y COX-2 inducible',
      'Mecanismo de acción de Aspirina y cardioprotección antiagregante',
      'SAR de Profenos e inversión metabólica unidireccional (R) a (S)',
      'Bolsillo hidrofóbico lateral en COX-2 delimitado por Val523 (frente al impedimento de Ile523 en COX-1)',
      'Inhibidores selectivos Coxibs (Celecoxib) y seguridad gastrointestinal vs. riesgo cardiovascular'
    ],
    slideCount: 62,
    pdbTargetId: '3LN1',
    targetName: 'Complejo COX-2 Humana unida a Celecoxib (Bolsillo Val523)',
    status: 'Publicado',
    slidesPdfUrl: 'https://drive.google.com/file/d/1_slides_tema09_qfdos/view',
    slidesPdfName: 'Tema 09: Diapositivas Oficiales AINEs y Coxibs.pdf',
    notesPdfUrl: 'https://drive.google.com/file/d/1_apuntes_tema09_qfdos/view',
    notesPdfName: 'Tema 09: Apuntes de Inhibidores de Ciclooxigenasa.pdf',
    geminiNotebookUrl: 'https://notebooklm.google.com/notebook/qfdos-2627-tema09',
    spotifyPodcastUrl: 'https://open.spotify.com/episode/4Kx9Val523QFDOS09',
    drugs: [
      {
        name: 'Celecoxib',
        smiles: 'Cc1ccc(cc1)c2cc(nn2c3ccc(cc3)S(=O)(=O)N)C(F)(F)F',
        role: 'Inhibidor selectivo de COX-2 con grupo sulfonamida complementario a Val523',
        mw: 381.37,
        logP: 3.99,
        hbd: 1,
        hba: 4,
        tpsa: 77.9,
        rotBonds: 3,
        pdbId: '3LN1'
      },
      {
        name: 'Ibuprofeno',
        smiles: 'CC(C)Cc1ccc(cc1)C(C)C(=O)O',
        role: 'AINE clásico no selectivo derivado del ácido arilpropiónico (profeno)',
        mw: 206.28,
        logP: 3.50,
        hbd: 1,
        hba: 2,
        tpsa: 37.3,
        rotBonds: 4
      },
      {
        name: 'Ácido Acetilsalicílico',
        smiles: 'CC(=O)Oc1ccccc1C(=O)O',
        role: 'Inhibidor irreversible por acetilación de Ser530/516',
        mw: 180.16,
        logP: 1.19,
        hbd: 1,
        hba: 3,
        tpsa: 63.6,
        rotBonds: 2
      }
    ],
    attachments: [
      {
        id: 'att-09-1',
        title: 'Presentación Tema 09: AINEs y Coxibs (PDF)',
        type: 'pdf',
        url: 'https://drive.google.com/file/d/1_slides_tema09_qfdos/view',
        size: '7.5 MB',
        date: 'Sept 2026'
      },
      {
        id: 'att-09-2',
        title: 'Apuntes Tema 09: Ciclooxigenasas y Bolsillo Val523 (PDF)',
        type: 'pdf',
        url: 'https://drive.google.com/file/d/1_apuntes_tema09_qfdos/view',
        size: '4.3 MB',
        date: 'Sept 2026'
      },
      {
        id: 'att-09-3',
        title: 'NotebookLM: Cuaderno AINEs, Coxibs y SAR',
        type: 'notebook',
        url: 'https://notebooklm.google.com/notebook/qfdos-2627-tema09',
        date: 'Sept 2026'
      },
      {
        id: 'att-09-4',
        title: 'Podcast Spotify: La Mutación Val523 y la Selectividad de los Coxibs',
        type: 'spotify',
        url: 'https://open.spotify.com/episode/4Kx9Val523QFDOS09',
        spotifyUri: 'spotify:episode:4Kx9Val523QFDOS09',
        date: 'Sept 2026'
      }
    ],
    testQuestions: [
      {
        id: 't09-q1',
        topicId: 'tema-09',
        block: 'Selectividad COX-2',
        question: '¿Cuál es la diferencia de aminoácido clave en el canal catalítico entre COX-1 y COX-2 que permite el diseño de inhibidores voluminosos selectivos (Coxibs)?',
        questionSmiles: 'Cc1ccc(cc1)c2cc(nn2c3ccc(cc3)S(=O)(=O)N)C(F)(F)F',
        options: [
          'La sustitución de un residuo de Triptófano por Alanina.',
          'La presencia de Valina en posición 523 en COX-2 en lugar de Isoleucina 523 en COX-1, lo que genera un bolsillo lateral auxiliar hidrofóbico accesible.',
          'La ausencia total del residuo de Tirosina catalítica en COX-2.',
          'La presencia de un ion Cobre en lugar de un grupo hemo.'
        ],
        correctIndex: 1,
        explanation: 'La Isoleucina 523 en COX-1 tiene una cadena lateral más larga con un grupo metilo extra que bloquea estéricamente el acceso a la cavidad lateral. En COX-2, la Valina 523 (más pequeña por un grupo metileno) deja abierta una cavidad adicional donde encajan los grupos sulfonamida o metilsulfonilo de los coxibs.',
        difficulty: 'Medio'
      }
    ],
    flashcards: [
      {
        id: 'fc-09-1',
        topicId: 'tema-09',
        concept: 'Inversión Quiral de Profenos',
        front: '¿En qué consiste el fenómeno de inversión metabólica quiral de los profenos (ej. Ibuprofeno) en el organismo?',
        back: 'El enantiómero (R)-ibuprofeno inactivo es transformado enzimáticamente in vivo en su forma activa (S)-ibuprofeno a través de la formación de un intermediario acil-CoA tioéster por la acil-CoA sintetasa, racemización por 2-arilpropionil-CoA epimerasa e hidrólisis subsiguiente. El proceso es unidireccional (R) -> (S).',
        smiles: 'CC(C)Cc1ccc(cc1)C(C)C(=O)O',
        difficulty: 'hard',
        category: 'Estereoquímica & Metabolismo'
      }
    ]
  },
  {
    id: 'tema-10',
    number: 'Tema 10',
    title: 'Transporte de Membrana & Perfil ADMET',
    subtitle: 'Transportadores ABC/SLC (P-gp, PEPT1), Profármacos y Estabilidad CYP450',
    description: 'Mecanismos de permeabilidad y transporte transmembrana en el diseño farmacéutico. Superfamilias de transportadores de eflujo ABC (Glicoproteína-P / MDR1, BCRP) y de influjo SLC (PEPT1, OATP, OCT). Estrategias de diseño de profármacos de absorción y targeting. Optimización de la estabilidad metabólica frente a isoformas de citocromo P450 (CYP3A4, CYP2D6, CYP2C9) y reducción de la inhibición del canal cardíaco hERG.',
    keyConcepts: [
      'Clasificación Biofarmacéutica (BCS: Clases I a IV)',
      'Transportador de eflujo P-glicoproteína (P-gp / ABCB1) y resistencia a fármacos',
      'Targeting al transportador de péptidos intestinal PEPT1 (Valaciclovir, Valganciclovir)',
      'Reglas de Lipinski (Ro5) y extensiones de Veber para biodisponibilidad oral',
      'Puntos calientes metabólicos (soft spots) de CYP450 y deuteración de fármacos',
      'Riesgo de cardiotoxicidad por bloqueo del canal de potasio hERG'
    ],
    slideCount: 52,
    pdbTargetId: '6QEX',
    targetName: 'Glicoproteína P Humana (P-gp / ABCB1) en Estado de Eflujo',
    status: 'Publicado',
    slidesPdfUrl: 'https://drive.google.com/file/d/1_slides_tema10_qfdos/view',
    slidesPdfName: 'Tema 10: Diapositivas Oficiales Transporte de Membrana y ADMET.pdf',
    notesPdfUrl: 'https://drive.google.com/file/d/1_apuntes_tema10_qfdos/view',
    notesPdfName: 'Tema 10: Apuntes Magistrales de Transportadores y P-gp.pdf',
    geminiNotebookUrl: 'https://notebooklm.google.com/notebook/qfdos-2627-tema10',
    spotifyPodcastUrl: 'https://open.spotify.com/episode/5Kx10AdmetQFDOS10',
    drugs: [
      {
        name: 'Valaciclovir',
        smiles: 'CC(C)[C@@H](C(=O)OCCOCN1C=NC2=C1N=C(NC2=O)N)N',
        role: 'Profármaco éster L-valilo sustrato de PEPT1 con 55% de biodisponibilidad oral',
        mw: 324.34,
        logP: -1.38,
        hbd: 3,
        hba: 7,
        tpsa: 128.8,
        rotBonds: 7
      },
      {
        name: 'Aciclovir',
        smiles: 'C1=NC2=C(N1COCCO)N=C(NC2=O)N',
        role: 'Fármaco antiviral libre con baja permeabilidad y absorción limitada (~15%)',
        mw: 225.20,
        logP: -1.56,
        hbd: 3,
        hba: 6,
        tpsa: 102.5,
        rotBonds: 3
      },
      {
        name: 'Verapamilo',
        smiles: 'COc1ccc(cc1OC)C(C#N)(C(C)C)CCCN(C)CCc2ccc(OC)c(OC)c2',
        role: 'Inhibidor potente de Glicoproteína-P (P-gp)',
        mw: 454.60,
        logP: 3.79,
        hbd: 0,
        hba: 5,
        tpsa: 63.9,
        rotBonds: 13
      }
    ],
    attachments: [
      {
        id: 'att-10-1',
        title: 'Presentación Tema 10: Transporte de Membrana y ADMET (PDF)',
        type: 'pdf',
        url: 'https://drive.google.com/file/d/1_slides_tema10_qfdos/view',
        size: '6.7 MB',
        date: 'Sept 2026'
      },
      {
        id: 'att-10-2',
        title: 'Apuntes Tema 10: Farmacocinética Molecular y PEPT1 (PDF)',
        type: 'pdf',
        url: 'https://drive.google.com/file/d/1_apuntes_tema10_qfdos/view',
        size: '4.2 MB',
        date: 'Sept 2026'
      },
      {
        id: 'att-10-3',
        title: 'NotebookLM: Cuaderno ADMET, P-gp y Veber',
        type: 'notebook',
        url: 'https://notebooklm.google.com/notebook/qfdos-2627-tema10',
        date: 'Sept 2026'
      },
      {
        id: 'att-10-4',
        title: 'Podcast Spotify: Superando la Barrera Intestinal con Profármacos',
        type: 'spotify',
        url: 'https://open.spotify.com/episode/5Kx10AdmetQFDOS10',
        spotifyUri: 'spotify:episode:5Kx10AdmetQFDOS10',
        date: 'Sept 2026'
      }
    ],
    testQuestions: [
      {
        id: 't10-q1',
        topicId: 'tema-10',
        block: 'Profármacos & PEPT1',
        question: '¿Por qué la esterificación del aciclovir con L-valina (valaciclovir) incrementa su biodisponibilidad oral de un 15% a más del 55%?',
        questionSmiles: 'CC(C)[C@@H](C(=O)OCCOCN1C=NC2=C1N=C(NC2=O)N)N',
        options: [
          'Porque el valaciclovir destruye la mucosa intestinal para difundir pasivamente.',
          'Porque el resto L-valilo mimetiza un dipéptido natural y es reconocido como sustrato de alta afinidad por el transportador intestinal de influjo PEPT1 (SLC15A1).',
          'Porque el valaciclovir inhibe irreversiblemente a la P-glicoproteína.',
          'Porque el valaciclovir polimeriza en el estómago protegiéndose de la degradación.'
        ],
        correctIndex: 1,
        explanation: 'El transportador de oligopéptidos PEPT1 reconoce dipéptidos y profármacos conjugados con aminoácidos como la L-valina. El valaciclovir es transportado activamente al interior del enterocito donde la enzima valaciclovirasa hidroliza el éster liberando aciclovir puro en sangre.',
        difficulty: 'Medio'
      }
    ],
    flashcards: [
      {
        id: 'fc-10-1',
        topicId: 'tema-10',
        concept: 'Criterios de Veber para Biodisponibilidad Oral',
        front: '¿Cuáles son los 2 criterios clave de Veber que complementan la Regla de Lipinski para predecir buena biodisponibilidad oral?',
        back: '1) Área de Superficie Polar Tópica (TPSA) <= 140 Å² (o <= 12 donadores + aceptores de enlaces de H).\n2) Número de enlaces rotables (RotBonds) <= 10.\nMoléculas que cumplen estos criterios presentan una tasa de permeabilidad membranar y biodisponibilidad significativamente mayor.',
        difficulty: 'medium',
        category: 'ADMET & Profiling'
      }
    ]
  }
];

export const INITIAL_GLOSSARY: QfdosGlossaryTerm[] = [
  {
    id: 'glo-1',
    term: 'Afinidad (Kd)',
    category: 'Afinidad & Receptor',
    definition: 'Constante de disociación en el equilibrio termodinámico entre el ligando y su diana macromolecular. A menor valor numérico de Kd, mayor es la fuerza intrínseca de unión (afinidad). Relacionada con la energía libre de Gibbs: ΔG° = R · T · ln(Kd).',
    technicalCode: 'TERMO-KD-01',
    clinicalRelevance: 'Permite seleccionar cabezas de serie con afinidad nanomolar (Kd < 10 nM) para minimizar dosis y toxicidad fuera de diana (off-target).'
  },
  {
    id: 'glo-2',
    term: 'Constante de Inhibición (Ki)',
    category: 'Afinidad & Receptor',
    definition: 'Constante termodinámica de equilibrio de disociación del complejo enzima-inhibidor. Es una propiedad intrínseca e independiente de la concentración de sustrato [S], a diferencia de la IC50.',
    technicalCode: 'TERMO-KI-02',
    clinicalRelevance: 'Parámetro fundamental en el diseño racional de fármacos dirigidos a quinasas, proteasas y enzimas del SNC.'
  },
  {
    id: 'glo-3',
    term: 'Ecuación de Cheng-Prusoff',
    category: 'Afinidad & Receptor',
    definition: 'Ecuación matemática que relaciona el valor experimental de IC50 con la constante absoluta de inhibición Ki en inhibición competitiva: IC50 = Ki · (1 + [S]/Km).',
    technicalCode: 'CIN-CP-03',
    clinicalRelevance: 'Demuestra por qué el valor de IC50 medido in vitro varía entre diferentes laboratorios y protocolos experimentales.'
  },
  {
    id: 'glo-4',
    term: 'Eficiencia de Ligando (LE)',
    category: 'ADMET & Profiling',
    definition: 'Medida que normaliza la energía libre de Gibbs de unión por cada átomo no-hidrógeno (átomo pesado): LE = -ΔG° / Nheavy = (1.37 / Nheavy) · pIC50. Valores >= 0.3 kcal/(mol·átomo) son deseables.',
    technicalCode: 'LEAD-LE-04',
    clinicalRelevance: 'Evita la tendencia perjudicial de inflar el peso molecular y la lipofilia durante la optimización de cabezas de serie.'
  },
  {
    id: 'glo-5',
    term: 'Bioisosterismo Clásico y No Clásico',
    category: 'Afinidad & Receptor',
    definition: 'Sustitución de átomos o grupos funcionales por otros con propiedades fisicoquímicas o electrónicas similares (mismo número de electrones de valencia o distribución de densidad) para mejorar estabilidad metabólica, selectividad o biodisponibilidad.',
    technicalCode: 'SAR-BIO-05',
    clinicalRelevance: 'Ejemplo clave: reemplazo del ácido carboxílico por un anillo 1H-tetrazol en los ARA-II (Losartán) o del catecol por alcohol saligenina en Salbutamol.'
  },
  {
    id: 'glo-6',
    term: 'Bolsillo Alostérico Val523 (COX-2)',
    category: 'Cardiovascular',
    definition: 'Cavidad hidrofóbica lateral accesible en la ciclooxigenasa-2 (COX-2) debido a la presencia del aminoácido Valina 523 (más pequeño que la Isoleucina 523 presente en COX-1), permitiendo el anclaje selectivo de Coxibs (Celecoxib).',
    technicalCode: 'COX2-VAL523',
    clinicalRelevance: 'Base molecular del diseño de AINEs con protección gástrica selectiva.'
  },
  {
    id: 'glo-7',
    term: 'Transportador PEPT1 (SLC15A1)',
    category: 'ADMET & Profiling',
    definition: 'Transportador de influjo transmembrana dependiente de gradiente de protones ubicado en el borde en cepillo del enterocito intestinal. Reconoce dipéptidos y profármacos peptídicos como Valaciclovir.',
    technicalCode: 'SLC-PEPT1-07',
    clinicalRelevance: 'Estrategia de química médica para triplicar la absorción oral de fármacos hidrofílicos poco absorbibles.'
  },
  {
    id: 'glo-8',
    term: 'Glicoproteína-P (P-gp / ABCB1)',
    category: 'ADMET & Profiling',
    definition: 'Bomba de eflujo transmembrana dependiente de ATP que expulsa xenobióticos y fármacos lipofílicos desde el citoplasma al exterior celular en la barrera hematoencefálica, intestino y túbulo renal.',
    technicalCode: 'ABC-PGP-08',
    clinicalRelevance: 'Principal causa de resistencia a quimioterápicos y limitante de la penetración de fármacos en el sistema nervioso central.'
  }
];

export const INITIAL_STUDENT_PROFILES: StudentEvaluationProfile[] = [
  {
    email: 'alumno.demo@correo.ugr.es',
    name: 'García Pérez, Elena',
    attempts: [
      { id: 'att-1', studentEmail: 'alumno.demo@correo.ugr.es', studentName: 'García Pérez, Elena', topicId: 'tema-00', score: 10, correctCount: 2, totalQuestions: 2, timestamp: '12/09/2026' },
      { id: 'att-2', studentEmail: 'alumno.demo@correo.ugr.es', studentName: 'García Pérez, Elena', topicId: 'tema-01', score: 8.5, correctCount: 2, totalQuestions: 2, timestamp: '14/09/2026' },
      { id: 'att-3', studentEmail: 'alumno.demo@correo.ugr.es', studentName: 'García Pérez, Elena', topicId: 'tema-02', score: 9.0, correctCount: 2, totalQuestions: 2, timestamp: '15/09/2026' }
    ],
    labGrade: 9.2,
    projectGrade: 8.8
  },
  {
    email: 'martinez.m@correo.ugr.es',
    name: 'Martínez López, Manuel',
    attempts: [
      { id: 'att-4', studentEmail: 'martinez.m@correo.ugr.es', studentName: 'Martínez López, Manuel', topicId: 'tema-00', score: 8.0, correctCount: 2, totalQuestions: 2, timestamp: '12/09/2026' },
      { id: 'att-5', studentEmail: 'martinez.m@correo.ugr.es', studentName: 'Martínez López, Manuel', topicId: 'tema-08', score: 9.5, correctCount: 1, totalQuestions: 1, timestamp: '15/09/2026' }
    ],
    labGrade: 8.5,
    projectGrade: 9.0
  },
  {
    email: 'ruiz.s@correo.ugr.es',
    name: 'Ruiz Delgado, Sofía',
    attempts: [
      { id: 'att-6', studentEmail: 'ruiz.s@correo.ugr.es', studentName: 'Ruiz Delgado, Sofía', topicId: 'tema-00', score: 10, correctCount: 2, totalQuestions: 2, timestamp: '11/09/2026' },
      { id: 'att-7', studentEmail: 'ruiz.s@correo.ugr.es', studentName: 'Ruiz Delgado, Sofía', topicId: 'tema-05', score: 10, correctCount: 1, totalQuestions: 1, timestamp: '13/09/2026' },
      { id: 'att-8', studentEmail: 'ruiz.s@correo.ugr.es', studentName: 'Ruiz Delgado, Sofía', topicId: 'tema-09', score: 9.0, correctCount: 1, totalQuestions: 1, timestamp: '16/09/2026' }
    ],
    labGrade: 9.6,
    projectGrade: 9.4
  }
];

export const INITIAL_STUDENT_EVALUATION_DATA = INITIAL_STUDENT_PROFILES;

export const INITIAL_STUDENT_QUESTIONS: StudentQuestion[] = [
  {
    id: 'sq-1',
    topicId: 'tema-00',
    topicTitle: 'Tema 00: Introducción & Afinidad Estructural',
    studentName: 'Elena García Pérez',
    studentEmail: 'alumno.demo@correo.ugr.es',
    question: 'Profesor Mochón, en la ecuación de Cheng-Prusoff para un inhibidor competitivo (IC50 = Ki · (1 + [S]/Km)), ¿siempre que [S] es mucho menor que Km, la IC50 coincide exactamente con Ki?',
    timestamp: '14/09/2026 11:20',
    status: 'respondida',
    response: '¡Exacto, Elena! Cuando [S] << Km, el término [S]/Km tiende a 0, por lo que (1 + [S]/Km) ≈ 1 y en consecuencia IC50 ≈ Ki. Esta es la condición óptima en ensayos bioquímicos para estimar la afinidad termodinámica directa.'
  },
  {
    id: 'sq-2',
    topicId: 'tema-09',
    topicTitle: 'Tema 09: AINEs & Coxibs',
    studentName: 'Manuel Martínez López',
    studentEmail: 'martinez.m@correo.ugr.es',
    question: '¿Por qué el celecoxib no inhibe la COX-1 a concentraciones terapéuticas si el sitio activo es tan parecido al de COX-2?',
    timestamp: '15/09/2026 17:45',
    status: 'respondida',
    response: 'Manuel, el motivo es el impedimento estérico: el grupo sulfonamida voluminoso del celecoxib requiere entrar en el bolsillo lateral secundario. En COX-1, el aminoácido Isoleucina 523 tiene un grupo metilo extra que bloquea físicamente la entrada a ese bolsillo, mientras que en COX-2 la Valina 523 es más corta y deja expedito el canal.'
  }
];
