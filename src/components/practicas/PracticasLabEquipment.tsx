import React, { useState } from 'react';
import { recurso } from '../../services/rutas';
import {
  LAB_EQUIPMENT_INVENTORY,
  LabEquipmentItem,
  MATERIAL_PUESTO
} from '../../data/practicasData';
import { enviarAHoja } from '../../services/entregaPracticas';
import {
  Box, Settings, Wind, Layers, CheckCircle2, HelpCircle,
  AlertTriangle, Info, ArrowRight, ShieldCheck, Flame, RefreshCw
} from 'lucide-react';

interface SetupGuide {
  id: string;
  name: string;
  purpose: string;
  imageIcon: string;
  imageSrc: string; // Representative scientific SVG illustration
  sourceAttribution: string;
  equipmentRequired: string[];
  steps: string[];
  safetyCritical: string[];
  keyNotes: { label: string; text: string }[];
}

const EXPERIMENTAL_SETUPS: SetupGuide[] = [
  {
    id: 'reflux',
    name: '1. Montaje de Calefacción a Reflujo',
    purpose: 'Mantener la reacción a temperatura de ebullición constante del disolvente sin pérdida de reactivos volátiles.',
    imageIcon: '🔥',
    imageSrc: recurso('/practicas/setups/setup_reflux.svg'),
    sourceAttribution: 'Esquema representativo de síntesis orgánica (Dominio público / BioArt NIAID style)',
    equipmentRequired: [
      'Placa calefactora con agitación magnética digital',
      'Soporte elevador de tijera (Lab-jack) de seguridad',
      'Matraz esférico de fondo redondo (50 o 100 mL)',
      'Imán de teflón (núcleo magnético de agitación)',
      'Refrigerante de reflujo (bolas Allihn o Dimroth)',
      'Gomas de látex para refrigeración con agua',
      'Pinza de tres dedos y nuez sujeta al soporte'
    ],
    steps: [
      'Colocar la placa calefactora SIEMPRE sobre un soporte elevador (Lab-jack). En caso de embalamiento térmico o sobrecalentamiento, bajar el soporte permite retirar la fuente de calor al instante sin tocar el matraz caliente.',
      'Introducir los reactivos y el imán magnético en el matraz esférico antes de acoplar el refrigerante.',
      'Sujetar el cuello del matraz firmemente con la pinza de tres dedos a la varilla vertical del soporte.',
      'Conectar las gomas de agua al refrigerante: ENTRADA de agua SIEMPRE por la oliva INFERIOR y SALIDA hacia el desagüe por la oliva SUPERIOR para garantizar el llenado completo de la camisa sin burbujas de aire.',
      'Ajustar un caudal de agua suave continuo antes de encender la calefacción y agitación.',
      '¡NUNCA tapar la boca superior del refrigerante! Debe permanecer abierto a la atmósfera para evitar sobrepresiones peligrosas y riesgo de explosión.'
    ],
    safetyCritical: [
      'Comprobar la circulación continua de agua antes de iniciar la calefacción.',
      'Nunca cerrar el sistema herméticamente (sin tapón superior).',
      'Uso obligatorio del Lab-jack para control de seguridad térmica.'
    ],
    keyNotes: [
      { label: 'Entrada de Agua', text: 'Por la oliva inferior a contracorriente de los vapores.' },
      { label: 'Salida al Desagüe', text: 'Por la oliva superior asegurando purga continua de aire.' },
      { label: 'Lab-Jack', text: 'Permite bajar la placa calefactora en 2 segundos ante emergencias.' }
    ]
  },
  {
    id: 'buchner',
    name: '2. Montaje de Filtración a Vacío (Büchner + Kitasato)',
    purpose: 'Separar y secar precipitados sólidos cristalinos (como DHPP o sales) de sus aguas madres de forma rápida y eficiente.',
    imageIcon: '🌪️',
    imageSrc: recurso('/practicas/setups/setup_buchner.svg'),
    sourceAttribution: 'Esquema representativo de filtración a vacío (Dominio público / BioArt NIAID style)',
    equipmentRequired: [
      'Matraz Kitasato de vidrio grueso con oliva lateral de vacío',
      'Embudo Büchner de porcelana blanca con placa perforada',
      'Adaptador cónico de goma o junta Guko hermética',
      'Papel de filtro circular recortado a la medida exacta de la base',
      'Trompa de agua o línea central de vacío de laboratorio',
      'Frasco lavador con disolvente frío (etanol o agua)',
      'Pinza y nuez para sujetar firmemente el Kitasato'
    ],
    steps: [
      'Sujetar SIEMPRE el matraz Kitasato con una pinza al soporte. El tubo de vacío ejerce tensión lateral y puede volcar el matraz fácilmente.',
      'Colocar el cono de goma Guko en la boca del Kitasato e insertar el embudo Büchner asegurando hermetismo.',
      'Colocar un papel de filtro circular que tape todos los orificios del Büchner pero SIN que suba arrugado por las paredes.',
      'Abrir el vacío y humedecer el papel de filtro con unas gotas del mismo disolvente de la suspensión fría (agua o etanol) para adherirlo a la base.',
      'Verter la suspensión de cristales en el centro con ayuda de una varilla de vidrio.',
      'Lavar el vaso con pequeñas porciones de disolvente frío y verter sobre la torta de cristales.',
      'Mantener el vacío durante unos minutos prensando suavemente los cristales con el tapón plano de vidrio para escurrir el líquido remanente.'
    ],
    safetyCritical: [
      'Sujetar siempre el Kitasato con pinza al soporte de hierro.',
      'Desconectar la goma de vacío del Kitasato ANTES de cerrar el grifo de la trompa de agua para evitar que el agua del grifo sea succionada hacia el filtrado por depresión.'
    ],
    keyNotes: [
      { label: 'Junta Guko', text: 'Cono de goma que asegura el sellado hermético al aplicar vacío.' },
      { label: 'Papel Plano', text: 'Debe cubrir los orificios sin arrugas perimetrales.' },
      { label: 'Desconexión', text: 'Primero soltar la goma de vacío, después cerrar el grifo de agua.' }
    ]
  },
  {
    id: 'extraction',
    name: '3. Extracción Líquido-Líquido (Embudo de Decantación)',
    purpose: 'Separar y purificar compuestos orgánicos transfiriéndolos selectivamente entre dos fases inmiscibles (acuosa y orgánica).',
    imageIcon: '🧪',
    imageSrc: recurso('/practicas/setups/setup_extraction.svg'),
    sourceAttribution: 'Esquema representativo de extracción bifásica (Dominio público / BioArt NIAID style)',
    equipmentRequired: [
      'Embudo de decantación (100 o 250 mL) con llave de teflón y tapón esmerilado',
      'Aro metálico cerrado adaptado a soporte',
      'Vasos de precipitados de recogida',
      'Sulfato de sodio anhidro (Na₂SO₄) para secado de fase orgánica',
      'Embudo cónico de vidrio y papel de filtro de pliegues'
    ],
    steps: [
      'Comprobar antes de verter que la llave de teflón del embudo esté CERRADA y bien ajustada.',
      'Verter la mezcla y el disolvente extractor (Diclorometano, DCM). Recordar: el DCM tiene densidad 1,33 g/mL, por lo que la fase orgánica queda SIEMPRE ABAJO.',
      'Tapar el embudo, sujetar con una mano el tapón presionado con la palma y con la otra la llave.',
      'Invertir el embudo apuntando la cánula hacia el fondo de la campana (lejos de personas) y ABRIR la llave de inmediato para ALIVIAR la sobrepresión de vapores (venteo).',
      'Agitar suavemente con movimientos circulares y ventear 2 o 3 veces hasta que no se escuche salida de presión de gas.',
      'Colocar en el aro metálico, QUITAR el tapón superior (imprescindible para que fluya) y dejar reposar hasta separación nítida de fases.',
      'Drenar la fase orgánica inferior por la llave. Verter la fase superior SIEMPRE por la boca superior para evitar contaminación cruzada.',
      'Secar la fase orgánica reunida con Na₂SO₄ anhidro durante 10-15 min y filtrar por gravedad con filtro de pliegues.'
    ],
    safetyCritical: [
      'Ventear inmediatamente tras invertir el embudo para evitar sobrepresiones por DCM.',
      'Quitar el tapón superior antes de abrir la llave para decantar el líquido.'
    ],
    keyNotes: [
      { label: 'Densidad DCM', text: 'd = 1,33 g/mL (mayor que el agua) -> Fase orgánica inferior.' },
      { label: 'Venteo en Campana', text: 'Invertir con tapón en palma y abrir llave apuntando al fondo.' },
      { label: 'Sin Tapón al Decantar', text: 'Evita el vacío interno que impediría la salida del líquido.' }
    ]
  },
  {
    id: 'rotavapor',
    name: '4. Evaporador Rotatorio (Rotavapor)',
    purpose: 'Eliminar a presión reducida y baja temperatura grandes volúmenes de disolventes orgánicos volátiles de forma suave.',
    imageIcon: '🌀',
    imageSrc: recurso('/practicas/setups/setup_rotavapor.svg'),
    sourceAttribution: 'Esquema representativo de evaporación rotatoria (Dominio público / BioArt NIAID style)',
    equipmentRequired: [
      'Matraz esférico con la disolución orgánica seca y filtrada (máximo 50% de llenado)',
      'Clip de plástico esmerilado Keck (color verde o azul)',
      'Baño termostático de agua templada (35–45 °C)',
      'Bomba o línea central de vacío',
      'Refrigerante en espiral con circulación de agua fría'
    ],
    steps: [
      'Asegurarse de que la disolución orgánica esté perfectamente seca (sin trazas de agua que formen azeótropos opacos) y filtrada sin cristales de Na₂SO₄.',
      'Acoplar el matraz al esmerilado del rotavapor y colocar SIEMPRE el clip de seguridad Keck.',
      'Cerrar la llave de vacío del rotavapor y activar la rotación mecánica del motor.',
      'Bajar el matraz hasta que quede sumergido parcialmente en el baño termostático de agua.',
      'Observar la formación de una película delgada en las paredes y la caída regular de gotas de disolvente condensado en el matraz colector.',
      'Al terminar: 1º Levantar el matraz del baño, 2º ABRIR la llave de aire para romper el vacío, 3º Apagar la rotación y 4º Retirar el clip Keck y el matraz.'
    ],
    safetyCritical: [
      'Colocar siempre el clip de seguridad Keck en el cuello del matraz.',
      'Romper el vacío abriendo la válvula ANTES de intentar desacoplar el matraz.'
    ],
    keyNotes: [
      { label: 'Clip Keck', text: 'Fija mecánicamente el matraz giratorio evitando caídas al baño.' },
      { label: 'Película Fina', text: 'La rotación multiplica la superficie de evaporación por diez.' },
      { label: 'Parada Segura', text: '1º Subir matraz -> 2º Romper vacío -> 3º Parar motor.' }
    ]
  }
];

export const PracticasLabEquipment: React.FC = () => {
  const [selectedSetupId, setSelectedSetupId] = useState<string>('reflux');
  const [activeTab, setActiveTab] = useState<'setups' | 'inventory' | 'quiz'>('setups');
  const currentSetup = EXPERIMENTAL_SETUPS.find(s => s.id === selectedSetupId) || EXPERIMENTAL_SETUPS[0];

  // Inventory filter
  const [filterLocation, setFilterLocation] = useState<'all' | 'Cajón (Plástico y Hierro)' | 'Estante Superior (Vidrio)' | 'Estante Inferior (Calefacción)'>('all');

  const filteredInventory = LAB_EQUIPMENT_INVENTORY.filter(item => {
    if (filterLocation === 'all') return true;
    return item.location === filterLocation;
  });

  // Equipment quiz state
  const [quizIdx, setQuizIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Missing material reporting
  const [missingItems, setMissingItems] = useState<Set<string>>(new Set());
  const [reporterName, setReporterName] = useState<string>('');
  const [reporterEmail, setReporterEmail] = useState<string>('');
  const [puestoNumber, setPuestoNumber] = useState<string>('');
  const [isReportSubmitting, setIsReportSubmitting] = useState<boolean>(false);
  const [reportSubmitted, setReportSubmitted] = useState<boolean>(false);
  const [reportStatus, setReportStatus] = useState<string>('');

  const sendMaterialReport = async () => {
    if (missingItems.size === 0 || !reporterName.trim() || !reporterEmail.trim() || !puestoNumber.trim()) {
      alert('Completa tu nombre, email, numero de puesto y selecciona al menos un elemento que falta.');
      return;
    }
    setIsReportSubmitting(true);
    const resultado = await enviarAHoja('Material', {
      nombre: reporterName.trim(),
      email: reporterEmail.trim(),
      puesto: puestoNumber.trim(),
      materialFaltante: Array.from(missingItems).join(', '),
      fecha: new Date().toLocaleDateString('es-ES'),
      hora: new Date().toLocaleTimeString('es-ES'),
      totalFaltante: String(missingItems.size)
    });
    setReportStatus(resultado.mensaje);
    setReportSubmitted(resultado.estado === 'enviado-sin-confirmar');
    setIsReportSubmitting(false);
  };

  const toggleMissingItem = (itemName: string) => {
    setMissingItems(prev => {
      const next = new Set(prev);
      if (next.has(itemName)) {
        next.delete(itemName);
      } else {
        next.add(itemName);
      }
      return next;
    });
  };

  const EQUIPMENT_QUIZ = [
    {
      q: '¿Por qué la entrada de agua en el refrigerante de reflujo se conecta siempre por la oliva inferior?',
      opts: [
        'Para que la camisa del refrigerante se llene completamente de agua desplazando todo el aire hacia arriba, asegurando un enfriamiento homogéneo',
        'Porque la presión del grifo es mayor en la parte inferior',
        'Para evitar que el agua se mezcle con los reactivos orgánicos',
        'Por simple convención estética de laboratorio'
      ],
      correct: 0,
      why: 'Si el agua entrase por arriba, caería por gravedad formando un canalillo sin llenar la camisa superior, dejando bolsas de aire caliente que impedirían la condensación de los vapores.'
    },
    {
      q: 'En una extracción con Diclorometano (DCM) y agua, ¿dónde se sitúa la fase orgánica y por qué?',
      opts: [
        'En la fase inferior, porque la densidad del DCM (d = 1,33 g/mL) es superior a la del agua (d = 1,00 g/mL)',
        'En la fase superior, porque los compuestos orgánicos siempre flotan sobre el agua',
        'En medio, formando una emulsión intermedia estable',
        'Se disuelve completamente sin formar dos fases'
      ],
      correct: 0,
      why: 'El diclorometano es un disolvente clorado denso (d ≈ 1,33 g/mL), por lo que siempre se decanta en la capa inferior del embudo de extracción.'
    },
    {
      q: 'Al filtrar por Büchner conectado a trompa de agua, ¿qué paso crítico debe hacerse ANTES de cerrar el grifo del agua?',
      opts: [
        'Desconectar la goma de vacío del matraz Kitasato para evitar que la trompa succione agua del grifo hacia el interior del matraz por retroceso',
        'Añadir más disolvente caliente',
        'Pesar inmediatamente el embudo Büchner',
        'Subir la temperatura de la placa'
      ],
      correct: 0,
      why: 'Al cerrar el grifo mientras el sistema está al vacío, la depresión succionaría el agua del grifo directamente dentro del Kitasato, arruinando el filtrado o las aguas madres.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header */}
      <div className="qfdos-card" style={{ padding: '1.5rem', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <span className="qfdos-badge badge-navy" style={{ marginBottom: '0.4rem' }}>
              <Settings size={12} /> MATERIAL, MONTAJES Y OPERACIONES UNITARIAS
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-title)', margin: '0.2rem 0' }}>
              Puesto de Laboratorio y Montajes Experimentales
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
              Inventario oficial de los 23 elementos del puesto de trabajo, esquemas de montaje seguros y buenas prácticas.
            </p>
          </div>

          {/* Sub-tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('setups')}
              className={`btn btn-sm ${activeTab === 'setups' ? 'btn-navy' : 'btn-outline'}`}
              style={{ fontWeight: activeTab === 'setups' ? 700 : 500, fontSize: '0.78rem' }}
            >
              1. Montajes Experimentales (4)
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`btn btn-sm ${activeTab === 'inventory' ? 'btn-navy' : 'btn-outline'}`}
              style={{ fontWeight: activeTab === 'inventory' ? 700 : 500, fontSize: '0.78rem' }}
            >
              2. Inventario del Puesto (23 items)
            </button>
            <button
              onClick={() => {
                setActiveTab('quiz');
                setSelectedAnswer(null);
              }}
              className={`btn btn-sm ${activeTab === 'quiz' ? 'btn-teal' : 'btn-outline'}`}
              style={{ fontWeight: activeTab === 'quiz' ? 700 : 500, fontSize: '0.78rem' }}
            >
              ★ Quiz de Operaciones de Laboratorio
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: EXPERIMENTAL SETUPS WITH VECTOR SCIENTIFIC ILLUSTRATIONS */}
      {activeTab === 'setups' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Setup Selector pills */}
          <div className="qfdos-card" style={{ padding: '1rem', background: 'var(--surface)' }}>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {EXPERIMENTAL_SETUPS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSetupId(s.id)}
                  className={`btn btn-sm ${selectedSetupId === s.id ? 'btn-teal' : 'btn-outline'}`}
                  style={{ fontWeight: selectedSetupId === s.id ? 700 : 500, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>{s.imageIcon}</span>
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Grid: Left Side Vector Illustration + Key Callouts | Right Side Instructions & Safety */}
          <div className="grid-2-cols" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1.35fr)', gap: '1.5rem' }}>
            
            {/* Left Column: Vector Scientific Schematic (BioArt / Open Lab Style) */}
            <div className="qfdos-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
                paddingBottom: '0.4rem',
                borderBottom: '1px solid var(--border-color)'
              }}>
                <span className="qfdos-badge badge-navy" style={{ fontSize: '0.74rem', padding: '3px 9px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  📐 <strong>Esquema Vectorial del Montaje</strong>
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {currentSetup.sourceAttribution}
                </span>
              </div>

              {/* Vector SVG Image Container */}
              <div className="panel-claro" style={{
                
                border: '1.5px solid var(--border)',
                borderRadius: '12px',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                overflow: 'hidden',
                maxHeight: '480px'
              }}>
                <img
                  src={currentSetup.imageSrc}
                  alt={currentSetup.name}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '460px',
                    objectFit: 'contain',
                    transition: 'transform 0.2s ease'
                  }}
                />
              </div>

              {/* Key Diagram Legend Badges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                {currentSetup.keyNotes.map((kn, kIdx) => (
                  <div
                    key={kIdx}
                    style={{
                      background: 'var(--surface-muted)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '0.5rem 0.65rem',
                      fontSize: '0.74rem'
                    }}
                  >
                    <strong style={{ color: 'var(--navy-ink)', display: 'block', marginBottom: '2px' }}>
                      📌 {kn.label}
                    </strong>
                    <span style={{ color: 'var(--text-muted)', lineHeight: 1.35 }}>{kn.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Assembly Protocol, Materials & Safety Rules */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Header Title & Purpose */}
              <div className="qfdos-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--teal)' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)', margin: '0 0 0.35rem 0' }}>
                  {currentSetup.name}
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.55 }}>
                  {currentSetup.purpose}
                </p>
              </div>

              {/* Step-by-Step Procedure */}
              <div className="qfdos-card" style={{ padding: '1.25rem' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-title)' }}>
                  Procedimiento de Montaje Seguro:
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {currentSetup.steps.map((stepText, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        padding: '0.6rem 0.8rem',
                        background: 'var(--surface-muted)',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        color: 'var(--text-main)',
                        lineHeight: 1.45
                      }}
                    >
                      <span style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'var(--navy)',
                        color: '#fff',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '1px'
                      }}>
                        {idx + 1}
                      </span>
                      <span>{stepText}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Equipment & Safety Rules Side-by-Side */}
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)', gap: '1rem' }}>
                {/* Equipment checklist */}
                <div className="qfdos-card" style={{ padding: '1.1rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-title)' }}>
                    Material Necesario:
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {currentSetup.equipmentRequired.map((eq, eIdx) => (
                      <li key={eIdx}><strong>{eq}</strong></li>
                    ))}
                  </ul>
                </div>

                {/* Critical Safety Rules */}
                <div className="qfdos-card" style={{ padding: '1.1rem', borderLeft: '4px solid #ef4444', background: 'rgba(239, 68, 68, 0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.4rem' }}>
                    <AlertTriangle size={15} color="#ef4444" />
                    <h4 style={{ margin: 0, fontWeight: 700, fontSize: '0.84rem', color: '#b91c1c' }}>
                      Puntos Críticos de Seguridad
                    </h4>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {currentSetup.safetyCritical.map((rule, rIdx) => (
                      <li key={rIdx}>{rule}</li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY TABLE */}
      {activeTab === 'inventory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Instructions Box */}
          <div className="qfdos-card" style={{ padding: '1.25rem', background: 'var(--surface)', borderLeft: '4px solid var(--navy)' }}>
            <h4 style={{ margin: '0 0 0.4rem 0', fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-title)' }}>
              Comprobación del Puesto de Trabajo (Pág. 23 del Cuaderno de Prácticas)
            </h4>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.55 }}>
              <ol style={{ margin: '0.2rem 0 0 0', paddingLeft: '1.2rem' }}>
                <li><strong>Comprobación inicial:</strong> Compruebe que dispone en su puesto de trabajo de todos y cada uno de los ítems organizados en los 3 compartimentos.</li>
                <li><strong>Material defectuoso o ausente:</strong> En el caso de que algún ítem se encuentre defectuoso, roto, o no estuviera presente, avise a su profesor de prácticas para que lo reponga.</li>
                <li><strong>Responsabilidad y conservación:</strong> El alumno se hace responsable de la conservación del material durante las prácticas.</li>
                <li><strong>Orden y Limpieza:</strong> <em>TODO EL MATERIAL DEBE DE ESTAR PERFECTAMENTE COLOCADO Y COMPLETAMENTE LIMPIO AL FINALIZAR CADA SESIÓN.</em></li>
              </ol>
            </div>
          </div>

          {/* Compartimentos agrupados */}
          {MATERIAL_PUESTO.map((sec, sIdx) => {
            const secItems = LAB_EQUIPMENT_INVENTORY.filter(item => item.zone === sec.zona || (
              sIdx === 0 && item.location === 'Cajón (Plástico y Hierro)'
            ) || (
              sIdx === 1 && item.location === 'Estante Superior (Vidrio)'
            ) || (
              sIdx === 2 && item.location === 'Estante Inferior (Calefacción)'
            ));

            return (
              <div key={sIdx} className="qfdos-card" style={{ padding: '1.5rem', background: 'var(--surface)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
                  <div>
                    <span className="qfdos-badge badge-navy" style={{ fontSize: '0.72rem', marginBottom: '4px' }}>
                      COMPARTIMENTO #{sIdx + 1}
                    </span>
                    <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-title)' }}>
                      {sec.zona}
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    {secItems.length} tipos de material
                  </span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table className="qfdos-table" style={{ width: '100%', fontSize: '0.8rem' }}>
                    <thead>
                      <tr>
                        <th style={{ width: '6%' }}>Estado</th>
                        <th style={{ width: '28%' }}>Nombre del Material</th>
                        <th style={{ width: '12%' }}>Cantidad</th>
                        <th style={{ width: '20%' }}>Categoría</th>
                        <th style={{ width: '34%' }}>Uso Principal en Prácticas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {secItems.map(item => (
                        <tr key={item.id}>
                          <td>
                            <input
                              type="checkbox"
                              defaultChecked
                              title="Material verificado en el puesto"
                              style={{ width: '16px', height: '16px', accentColor: 'var(--teal)', cursor: 'pointer' }}
                            />
                          </td>
                          <td style={{ fontWeight: 700, color: 'var(--text-title)' }}>
                            {item.name}
                          </td>
                          <td className="font-tech" style={{ fontWeight: 700, color: 'var(--navy-ink)' }}>
                            {item.count}
                          </td>
                          <td>
                            <span className={`qfdos-badge ${item.category === 'vidrio' ? 'badge-teal' : item.category === 'calefaccion' ? 'badge-yellow' : item.category === 'filtracion' ? 'badge-purple' : 'badge-navy'}`} style={{ fontSize: '0.7rem' }}>
                              {item.category.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ color: 'var(--text-main)' }}>
                            {item.usageDescription}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          {/* MISSING MATERIAL REPORT FORM */}
          <div className="qfdos-card" style={{ padding: '1.5rem', background: 'var(--surface)', borderLeft: '4px solid var(--warm-orange, #e67e22)' }}>
            <div style={{ marginBottom: '1rem' }}>
              <span className="qfdos-badge badge-yellow" style={{ fontSize: '0.72rem', marginBottom: '4px' }}>
                <AlertTriangle size={11} /> NOTIFICAR MATERIAL FALTANTE O DEFECTUOSO
              </span>
              <h4 style={{ margin: '0.2rem 0', fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-title)' }}>
                Informe de Material Ausente
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                Marca los elementos que faltan o están defectuosos en tu puesto y envía el informe al profesor.
              </p>
            </div>

            {reportSubmitted ? (
              <div style={{ 
                padding: '1.25rem', 
                borderRadius: '12px', 
                background: 'linear-gradient(135deg, rgba(46,204,113,0.08), rgba(46,204,113,0.02))', 
                border: '1.5px solid rgba(46,204,113,0.3)',
                textAlign: 'center'
              }}>
                <CheckCircle2 size={32} style={{ color: '#2ecc71', marginBottom: '8px' }} />
                <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-title)', margin: '4px 0' }}>
                  Informe enviado correctamente
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                  {missingItems.size} elemento(s) reportado(s) como faltante(s). El profesor recibirá la notificación.
                </p>
                <button 
                  onClick={() => { setReportSubmitted(false); setMissingItems(new Set()); }}
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: '12px', fontSize: '0.78rem' }}
                >
                  <RefreshCw size={12} /> Enviar otro informe
                </button>
              </div>
            ) : (
              <>
                {/* Student info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '3px' }}>
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={e => setReporterName(e.target.value)}
                      placeholder="Ej. Ana García López"
                      className="qfdos-input"
                      style={{ width: '100%', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '3px' }}>
                      Email universitario *
                    </label>
                    <input
                      type="email"
                      value={reporterEmail}
                      onChange={e => setReporterEmail(e.target.value)}
                      placeholder="alumno@correo.ugr.es"
                      className="qfdos-input"
                      style={{ width: '100%', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '3px' }}>
                      N.º Puesto *
                    </label>
                    <input
                      type="text"
                      value={puestoNumber}
                      onChange={e => setPuestoNumber(e.target.value)}
                      placeholder="Ej. 12"
                      className="qfdos-input"
                      style={{ width: '100%', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>

                {/* Checklist of all items */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
                  gap: '0.4rem', 
                  marginBottom: '1rem',
                  padding: '0.75rem',
                  background: 'rgba(0,0,0,0.015)',
                  borderRadius: '8px',
                  border: '1px solid var(--border)'
                }}>
                  {LAB_EQUIPMENT_INVENTORY.map(item => (
                    <label
                      key={item.id}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        padding: '4px 6px',
                        borderRadius: '6px',
                        background: missingItems.has(item.name) ? 'rgba(231,76,60,0.08)' : 'transparent',
                        border: missingItems.has(item.name) ? '1px solid rgba(231,76,60,0.25)' : '1px solid transparent',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={missingItems.has(item.name)}
                        onChange={() => toggleMissingItem(item.name)}
                        style={{ accentColor: '#e74c3c', cursor: 'pointer' }}
                      />
                      <span style={{ 
                        fontWeight: missingItems.has(item.name) ? 700 : 400,
                        color: missingItems.has(item.name) ? '#c0392b' : 'var(--text-main)'
                      }}>
                        {item.name} ({item.count})
                      </span>
                    </label>
                  ))}
                </div>

                {/* Submit */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {missingItems.size > 0 
                      ? `${missingItems.size} elemento(s) marcado(s) como faltante(s)` 
                      : 'Marca los elementos que faltan en tu puesto'}
                  </span>
                  <button
                    onClick={sendMaterialReport}
                    disabled={isReportSubmitting || missingItems.size === 0 || !reporterName.trim() || !reporterEmail.trim() || !puestoNumber.trim()}
                    className="btn btn-navy"
                    style={{ 
                      fontSize: '0.82rem', 
                      fontWeight: 700,
                      opacity: (isReportSubmitting || missingItems.size === 0 || !reporterName.trim() || !reporterEmail.trim() || !puestoNumber.trim()) ? 0.5 : 1,
                      cursor: (isReportSubmitting || missingItems.size === 0) ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                  >
                    <AlertTriangle size={14} />
                    {isReportSubmitting ? 'Enviando...' : 'Enviar Informe al Profesor'}
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      )}

      {/* TAB 3: QUIZ */}
      {activeTab === 'quiz' && (
        <div className="qfdos-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <span className="qfdos-badge badge-teal" style={{ marginBottom: '4px' }}>
                EVALUACIÓN DE OPERACIONES DE LABORATORIO
              </span>
              <h4 style={{ margin: '0.2rem 0', fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-title)' }}>
                Pregunta {quizIdx + 1} de {EQUIPMENT_QUIZ.length}
              </h4>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => {
                  setQuizIdx(prev => (prev > 0 ? prev - 1 : EQUIPMENT_QUIZ.length - 1));
                  setSelectedAnswer(null);
                }}
                className="btn btn-xs btn-outline"
              >
                Anterior
              </button>
              <button
                onClick={() => {
                  setQuizIdx(prev => (prev + 1) % EQUIPMENT_QUIZ.length);
                  setSelectedAnswer(null);
                }}
                className="btn btn-xs btn-outline"
              >
                Siguiente
              </button>
            </div>
          </div>

          <div style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--text-title)', marginBottom: '1rem', lineHeight: 1.5 }}>
            {EQUIPMENT_QUIZ[quizIdx].q}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {EQUIPMENT_QUIZ[quizIdx].opts.map((opt, oIdx) => {
              const isSelected = selectedAnswer === oIdx;
              const isCorrect = EQUIPMENT_QUIZ[quizIdx].correct === oIdx;

              let btnBg = 'var(--surface-muted)';
              let btnBorder = 'var(--border-color)';
              if (selectedAnswer !== null) {
                if (isCorrect) {
                  btnBg = 'rgba(16,185,129,0.12)';
                  btnBorder = '#10b981';
                } else if (isSelected && !isCorrect) {
                  btnBg = 'rgba(239,68,68,0.12)';
                  btnBorder = '#ef4444';
                }
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => setSelectedAnswer(oIdx)}
                  disabled={selectedAnswer !== null}
                  style={{
                    background: btnBg,
                    border: `1.5px solid ${btnBorder}`,
                    borderRadius: '8px',
                    padding: '0.8rem 1rem',
                    textAlign: 'left',
                    cursor: selectedAnswer !== null ? 'default' : 'pointer',
                    fontSize: '0.84rem',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: isSelected ? 'var(--navy)' : '#fff',
                    color: isSelected ? '#fff' : 'var(--text-title)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <div style={{
              marginTop: '1.25rem',
              padding: '1rem',
              borderRadius: '8px',
              background: selectedAnswer === EQUIPMENT_QUIZ[quizIdx].correct ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
              border: `1px solid ${selectedAnswer === EQUIPMENT_QUIZ[quizIdx].correct ? '#10b981' : '#ef4444'}`
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: selectedAnswer === EQUIPMENT_QUIZ[quizIdx].correct ? '#059669' : '#dc2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {selectedAnswer === EQUIPMENT_QUIZ[quizIdx].correct ? <CheckCircle2 size={16} /> : <Info size={16} />}
                {selectedAnswer === EQUIPMENT_QUIZ[quizIdx].correct ? '¡Explicación Correcta!' : 'Explicación del Concepto:'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '4px', lineHeight: 1.5 }}>
                {EQUIPMENT_QUIZ[quizIdx].why}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
