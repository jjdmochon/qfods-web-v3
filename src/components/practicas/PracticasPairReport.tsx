import React, { useState, useEffect } from 'react';
import {
  LAB_PAIR_REPORTS_DEFAULT,
  LabPairReport
} from '../../data/practicasData';
import {
  Users, UserCheck, Send, CheckCircle2, AlertTriangle, FileText,
  Download, Printer, Search, Filter, Sparkles, Scale, Thermometer,
  ShieldCheck, RefreshCw, Eye, Edit3, MessageSquare, Award, Trash2, Plus
} from 'lucide-react';
import { EncabezadoReaccion } from './EncabezadoReaccion';
import { DesgloseRendimiento } from './DesgloseRendimiento';
import { EntregaProfesor } from './EntregaProfesor';
import { useAuth } from '../../context/AuthContext';

const STORAGE_KEY = 'qfdos_pair_reports';

/**
 * Pesos moleculares (g/mol) calculados con RDKit a partir del SMILES de cada
 * compuesto. Viven aqui y en un solo sitio: si un numero se repitiera, tarde o
 * temprano una copia quedaria desactualizada respecto a la otra.
 */
const PM = {
  naftol: 144.17,
  epiclorhidrina: 92.53,
  oxirano: 200.24,
  isopropilamina: 59.11,
  propranolol: 259.34,
  benzaldehido: 106.12,
  nitrobenzaldehido: 151.12,
  acetoacetato: 116.12,
  dhpp: 301.34,
  nifedipino: 346.33
} as const;

export const PracticasPairReport: React.FC = () => {
  // Mode switcher: 'student' (Fill and send) vs 'profesor' (Receive, review and grade)
  const { user, isProfesor } = useAuth();

  // El panel del profesor expone las entregas y las notas de TODAS las parejas,
  // asi que no puede quedar detras de un boton que cualquiera pueda pulsar.
  const [viewMode, setViewMode] = useState<'student' | 'profesor'>(
    isProfesor ? 'profesor' : 'student'
  );

  // Si la sesion cambia (cierre de sesion, otro usuario), se recalcula el modo
  useEffect(() => {
    if (!isProfesor) setViewMode('student');
  }, [isProfesor]);

  // Master list of all reports (loaded from localStorage with fallback to default demo data)
  const [reports, setReports] = useState<LabPairReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading pair reports', e);
    }
    return LAB_PAIR_REPORTS_DEFAULT;
  });

  // Save to localStorage whenever reports change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (e) {
      console.error('Error saving pair reports to localStorage', e);
    }
  }, [reports]);

  const DRAFT_KEY = 'qfdos_pair_report_draft';

  // Current active report being edited by the student pair
  const [currentReport, setCurrentReport] = useState<LabPairReport>(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        return JSON.parse(savedDraft);
      }
    } catch (e) {
      console.error('Error loading draft report', e);
    }
    return {
      id: `P${1}-${Date.now().toString().slice(-4)}`,
      grupo: 'Prácticas',
      puesto: 1,
      turno: '8:30-11:30',
      fecha: new Date().toISOString().split('T')[0],
      student1: {
        nombre: '',
        dni: '',
        email: ''
      },
      student2: {
        nombre: '',
        dni: '',
        email: ''
      },
      step1: {
        mass1Naftol: 3.00,
        volEpiclorhidrina: 2.70,
        massNaOH: 1.20,
        massProductCrude: 0,
        yieldPercentage: 0,
        aspect: 'Aceite ámbar transparente',
        observations: ''
      },
      step2: {
        massOxirane: 0,
        volIsopropilamina: 6.00,
        massProductBase: 0,
        yieldStage: 0,
        yieldAccumulated: 0,
        meltingPointObserved: '',
        meltingPointReference: '94 - 96 °C',
        tlcRf: 'Rf = 0.42 (DCM/MeOH 9:1)',
        observations: ''
      },
      step3: {
        compoundType: 'DHPP',
        amountAldehyde: '2.55 mL Benzaldehído',
        volMethylAcetoacetate: 5.40,
        volNH3Conc: 4.50,
        massProduct: 0,
        yieldPercentage: 0,
        meltingPointObserved: '',
        meltingPointReference: '194 - 196 °C',
        crystalHabit: 'Agujas prismáticas amarillas',
        observations: ''
      },
      cuestiones: {
        q1_dcm_density: '',
        q2_nmr_c4_proton: '',
        q3_reflux_safety: ''
      },
      status: 'Borrador'
    };
  });

  // Persistir borrador del formulario activo para sincronización en tiempo real
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(currentReport));
    } catch (e) {
      console.error('Error saving draft report', e);
    }
  }, [currentReport]);

  // UI state for submit notification
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Professor Review State
  const [selectedReportIdForGrading, setSelectedReportIdForGrading] = useState<string | null>(null);
  const [profesorFilterTurno, setProfesorFilterTurno] = useState<string>('all');
  const [profesorSearchTerm, setProfesorSearchTerm] = useState<string>('');
  const [tempGrade, setTempGrade] = useState<number>(9.0);
  const [tempFeedback, setTempFeedback] = useState<string>('');

  // Auto-calculate yields when masses change in student form
  const handleCalculateStep1Yield = (massCrude: number) => {
    // El maximo depende del naftol que haya pesado esta pareja, no de una cantidad fija
    const theoMass = (currentReport.step1.mass1Naftol / PM.naftol) * PM.oxirano;
    const yieldPct = theoMass > 0 ? (massCrude / theoMass) * 100 : 0;
    setCurrentReport(prev => ({
      ...prev,
      step1: {
        ...prev.step1,
        massProductCrude: massCrude,
        yieldPercentage: parseFloat(yieldPct.toFixed(1))
      }
    }));
  };

  const handleCalculateStep2Yield = (massProduct: number, massOxiraneInput: number) => {
    const molesOxirane = massOxiraneInput > 0 ? massOxiraneInput / PM.oxirano : 0;
    const theoPropranololStage = molesOxirane * PM.propranolol;
    const stageYield = theoPropranololStage > 0 ? (massProduct / theoPropranololStage) * 100 : 0;
    
    // Global yield based on initial 1-naftol
    const initialMolesNaftol = currentReport.step1.mass1Naftol / PM.naftol;
    const theoPropranololGlobal = initialMolesNaftol * PM.propranolol;
    const globalYield = theoPropranololGlobal > 0 ? (massProduct / theoPropranololGlobal) * 100 : 0;

    setCurrentReport(prev => ({
      ...prev,
      step2: {
        ...prev.step2,
        massOxirane: massOxiraneInput,
        massProductBase: massProduct,
        yieldStage: parseFloat(stageYield.toFixed(1)),
        yieldAccumulated: parseFloat(globalYield.toFixed(1))
      }
    }));
  };

  /**
   * Datos del aldehido limitante de la sintesis de Hantzsch.
   * El benzaldehido se mide por volumen y el 2-nitrobenzaldehido, solido, por masa.
   */
  const ALDEHIDO_HANTZSCH = {
    DHPP:       { nombre: 'Benzaldehido',        pm: PM.benzaldehido,       densidad: 1.044, pmProducto: PM.dhpp,       unidad: 'mL' as const },
    Nifedipina: { nombre: '2-Nitrobenzaldehido', pm: PM.nitrobenzaldehido, densidad: null,  pmProducto: PM.nifedipino, unidad: 'g'  as const }
  };

  /** Extrae la cantidad numerica de un texto como "2,55 mL Benzaldehido". */
  const parseCantidadAldehido = (texto: string): number | null => {
    const m = texto.replace(',', '.').match(/(\d+(?:\.\d+)?)/);
    return m ? parseFloat(m[1]) : null;
  };

  /**
   * Masa teorica a partir del aldehido realmente empleado por la pareja,
   * no de una cantidad fija: cada pareja pesa lo suyo y el rendimiento debe
   * calcularse sobre SU limitante.
   */
  const calcularMasaTeoricaStep3 = (compound: 'DHPP' | 'Nifedipina', textoAldehido: string): number => {
    const d = ALDEHIDO_HANTZSCH[compound];
    const cantidad = parseCantidadAldehido(textoAldehido);
    if (cantidad === null || cantidad <= 0) return 0;
    const masaAldehido = d.densidad ? cantidad * d.densidad : cantidad;
    const molesAldehido = masaAldehido / d.pm;
    return molesAldehido * d.pmProducto;
  };

  const handleCalculateStep3Yield = (
    massProd: number,
    compound: 'DHPP' | 'Nifedipina',
    textoAldehido?: string
  ) => {
    const texto = textoAldehido ?? currentReport.step3.amountAldehyde;
    const theoMass = calcularMasaTeoricaStep3(compound, texto);
    const yieldPct = theoMass > 0 ? (massProd / theoMass) * 100 : 0;
    setCurrentReport(prev => ({
      ...prev,
      step3: {
        ...prev.step3,
        compoundType: compound,
        amountAldehyde: texto,
        massProduct: massProd,
        yieldPercentage: parseFloat(yieldPct.toFixed(1)),
        meltingPointReference: compound === 'DHPP' ? '194 - 196 °C' : '172 - 174 °C'
      }
    }));
  };

  // Submit report to professor
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentReport.student1.nombre || !currentReport.student2.nombre) {
      alert('Por favor, introduce los nombres de ambos miembros de la pareja de prácticas.');
      return;
    }

    const submissionTime = new Date().toLocaleString('es-ES', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });

    const finalReport: LabPairReport = {
      ...currentReport,
      id: `P${currentReport.puesto.toString().padStart(2, '0')}-${currentReport.turno.replace(':', '').replace('-', '_')}`,
      status: 'Entregado',
      submittedAt: submissionTime
    };

    // Update reports list: replace existing report for this pair or add new
    setReports(prev => {
      const idx = prev.findIndex(r => r.id === finalReport.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = finalReport;
        return next;
      }
      return [finalReport, ...prev];
    });

    setCurrentReport(finalReport);
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  /**
   * Aplana el informe a pares clave-valor de texto: es el formato que entiende
   * tanto la hoja de cálculo (una columna por clave) como el cuerpo del correo.
   */
  const construirDatosEntrega = (): Record<string, string> => {
    const r = currentReport;
    // Sin dato no se escribe la unidad: «— g» se lee peor que dejarlo vacío
    const con = (v: number, unidad: string) =>
      v ? `${v.toLocaleString('es-ES')} ${unidad}` : '';

    return {
      puesto: String(r.puesto),
      turno: r.turno || '8:30-11:30',
      alumno1: r.student1.nombre || '',
      email1: r.student1.email || '',
      alumno2: r.student2.nombre || '',
      email2: r.student2.email || '',
      cuentaDeEnvio: user?.email ?? '',
      tipoDeCuenta: user?.institucional === false ? 'personal (no UGR)' : 'institucional UGR',
      fechaSesion: r.fecha || '',
      entregadoEn: r.submittedAt || '',

      etapa1Naftol: con(r.step1.mass1Naftol, 'g'),
      etapa1Crudo: con(r.step1.massProductCrude, 'g'),
      etapa1Rendimiento: con(r.step1.yieldPercentage, '%'),
      etapa1Aspecto: r.step1.aspect || '',

      etapa2Oxirano: con(r.step2.massOxirane, 'g'),
      etapa2Propranolol: con(r.step2.massProductBase, 'g'),
      etapa2RendEtapa: con(r.step2.yieldStage, '%'),
      etapa2RendGlobal: con(r.step2.yieldAccumulated, '%'),
      etapa2PuntoFusion: r.step2.meltingPointObserved || '',

      etapa3Compuesto: r.step3.compoundType,
      etapa3Aldehido: r.step3.amountAldehyde || '',
      etapa3Producto: con(r.step3.massProduct, 'g'),
      etapa3Rendimiento: con(r.step3.yieldPercentage, '%'),
      etapa3PuntoFusion: r.step3.meltingPointObserved || '',
      etapa3Cristales: r.step3.crystalHabit || '',

      cuestion1: r.cuestiones?.q1_dcm_density || '',
      cuestion2: r.cuestiones?.q2_nmr_c4_proton || '',
      cuestion3: r.cuestiones?.q3_reflux_safety || '',

      observaciones: [r.step1.observations, r.step2.observations, r.step3.observations]
        .filter(Boolean).join(' | ')
    };
  };

  // Print or PDF export handler
  const handlePrintReport = () => {
    window.print();
  };

  // Load a demo pair for student testing
  const handleLoadStudentDemo = () => {
    setCurrentReport({
      id: 'P04-830_1130',
      grupo: 'Prácticas',
      puesto: 4,
      turno: '8:30-11:30',
      fecha: '2026-03-12',
      student1: {
        nombre: 'Elena Morales Ruiz',
        dni: '77234512A',
        email: 'emorales@correo.ugr.es'
      },
      student2: {
        nombre: 'Carlos Navarro Vega',
        dni: '75198234B',
        email: 'cnavarro@correo.ugr.es'
      },
      step1: {
        mass1Naftol: 3.00,
        volEpiclorhidrina: 2.70,
        massNaOH: 1.20,
        massProductCrude: 3.65,
        yieldPercentage: 87.6,
        aspect: 'Aceite ámbar transparente y homogéneo',
        observations: 'Extracción en 3 fracciones de DCM de 15 mL cada una. Secado sobre Na2SO4 anhidro durante 15 min.'
      },
      step2: {
        massOxirane: 3.50,
        volIsopropilamina: 6.00,
        massProductBase: 3.82,
        yieldStage: 84.2,
        yieldAccumulated: 73.8,
        meltingPointObserved: '94.5 - 95.8 °C',
        meltingPointReference: '94 - 96 °C',
        tlcRf: 'Rf = 0.42 (DCM/MeOH 9:1)',
        observations: 'Cristales aciculares blancos brillantes. Punto de fusión nítido concordante con la bibliografía del cuaderno.'
      },
      step3: {
        compoundType: 'DHPP',
        amountAldehyde: '2.55 mL Benzaldehído',
        volMethylAcetoacetate: 5.40,
        volNH3Conc: 4.50,
        massProduct: 5.72,
        yieldPercentage: 75.9,
        meltingPointObserved: '194.5 - 196.0 °C',
        meltingPointReference: '194 - 196 °C',
        crystalHabit: 'Agujas prismáticas amarillo canario',
        observations: 'Filtración por Büchner rápida. Lavado con 5 mL de etanol frío al 96%.'
      },
      cuestiones: {
        q1_dcm_density: 'El diclorometano (DCM) tiene una densidad de 1,33 g/mL, superior a la del agua (1,00 g/mL), por lo que siempre se sitúa en la capa inferior del embudo de decantación.',
        q2_nmr_c4_proton: 'El protón metínico C4-H aparece como un singlete nítido a delta = 5,00 ppm integrando para 1H, flanqueado por los metilos aromáticos.',
        q3_reflux_safety: 'El tubo debe estar abierto para evitar sobrepresiones; el Lab-jack permite retirar la fuente de calor al instante en caso de ebullición violenta.'
      },
      status: 'Borrador'
    });
  };

  // Grade submission in professor mode
  const handleSaveGrade = (reportId: string) => {
    const gradingTime = new Date().toLocaleString('es-ES', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });

    setReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          status: 'Calificado',
          profesorGrade: tempGrade,
          profesorFeedback: tempFeedback,
          gradedAt: gradingTime
        };
      }
      return r;
    }));

    setSelectedReportIdForGrading(null);
    alert(`Calificación de ${tempGrade.toFixed(1)}/10 guardada con éxito para la pareja ${reportId}.`);
  };

  // Export all grades to CSV for Professor Juanjo
  const handleExportCSV = () => {
    const headers = [
      'ID_Pareja', 'Puesto', 'Turno', 'Fecha',
      'Alumno_1', 'Email_1',
      'Alumno_2', 'Email_2',
      'Rend_Etapa1_Pct', 'Rend_Propranolol_Pct', 'Pf_Propranolol',
      'Compuesto_Hantzsch', 'Rend_Hantzsch_Pct', 'Pf_Hantzsch',
      'Estado', 'Nota_Final_10', 'Feedback_Profesor', 'Fecha_Calificacion'
    ];

    const rows = reports.map(r => [
      `"${r.id}"`,
      `"${r.puesto}"`,
      `"${r.turno}"`,
      `"${r.fecha}"`,
      `"${r.student1.nombre}"`,
      `"${r.student1.email}"`,
      `"${r.student2.nombre}"`,
      `"${r.student2.email}"`,
      r.step1.yieldPercentage,
      r.step2.yieldAccumulated,
      `"${r.step2.meltingPointObserved}"`,
      `"${r.step3.compoundType}"`,
      r.step3.yieldPercentage,
      `"${r.step3.meltingPointObserved}"`,
      `"${r.status}"`,
      r.profesorGrade !== undefined ? r.profesorGrade : '',
      `"${(r.profesorFeedback || '').replace(/"/g, '""')}"`,
      `"${r.gradedAt || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Acta_Practicas_QFDOS_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset to demo data
  const handleResetToDemoData = () => {
    if (window.confirm('¿Deseas restaurar los informes de demostración predeterminados?')) {
      setReports(LAB_PAIR_REPORTS_DEFAULT);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(LAB_PAIR_REPORTS_DEFAULT));
    }
  };

  // Filtered reports for Professor table
  const filteredProfessorReports = reports.filter(r => {
    const matchesTurno = profesorFilterTurno === 'all' || r.turno === profesorFilterTurno;
    const matchesSearch = profesorSearchTerm === '' ||
      r.id.toLowerCase().includes(profesorSearchTerm.toLowerCase()) ||
      r.student1.nombre.toLowerCase().includes(profesorSearchTerm.toLowerCase()) ||
      r.student2.nombre.toLowerCase().includes(profesorSearchTerm.toLowerCase()) ||
      r.student1.email.toLowerCase().includes(profesorSearchTerm.toLowerCase()) ||
      r.student2.email.toLowerCase().includes(profesorSearchTerm.toLowerCase());
    return matchesTurno && matchesSearch;
  });

  const activeGradingReport = reports.find(r => r.id === selectedReportIdForGrading);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Top Header Card with Role Switcher */}
      <div className="qfdos-card" style={{ padding: '1.5rem', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <span className="qfdos-badge badge-teal" style={{ marginBottom: '0.4rem' }}>
              <Users size={12} /> CUADERNO DE LABORATORIO POR PAREJAS Y RECEPCIÓN
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-title)', margin: '0.2rem 0' }}>
              Registro Oficial de Prácticas y Entrega al Profesor
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
              Cada pareja de estudiantes registra sus pesadas, rendimientos y puntos de fusión para su recepción y evaluación por el profesor Juanjo.
            </p>
          </div>

          {/* El conmutador de vista solo existe para el profesorado */}
          {isProfesor && (
          <div style={{ display: 'flex', gap: '6px', background: 'var(--surface-muted)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <button
              type="button"
              onClick={() => setViewMode('student')}
              className={`btn btn-sm ${viewMode === 'student' ? 'btn-teal' : 'btn-ghost'}`}
              style={{ fontWeight: viewMode === 'student' ? 700 : 500, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Users size={14} /> Vista Pareja de Alumnos
            </button>
            <button
              type="button"
              onClick={() => setViewMode('profesor')}
              className={`btn btn-sm ${viewMode === 'profesor' ? 'btn-navy' : 'btn-ghost'}`}
              style={{ fontWeight: viewMode === 'profesor' ? 700 : 500, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <UserCheck size={14} /> Panel del Profesor ({reports.length} Entregas)
            </button>
          </div>
          )}
        </div>

        {/* Banner Alert for Mode */}
        {viewMode === 'student' ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '0.75rem 1rem',
            background: 'rgba(13,148,136,0.06)',
            borderRadius: '8px',
            borderLeft: '4px solid var(--teal)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--teal-ink)' }}>
              <Sparkles size={16} />
              <span><strong>Modo Pareja de Prácticas:</strong> Rellenad los datos conjuntos del puesto, calculad vuestros rendimientos experimentales y pulsad <strong>"Enviar Informe al Profesor"</strong> al finalizar la semana.</span>
            </div>
            <button
              type="button"
              onClick={handleLoadStudentDemo}
              className="btn btn-xs btn-outline"
              style={{ fontSize: '0.72rem' }}
            >
              Cargar Datos de Ejemplo (Puesto 4)
            </button>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '0.75rem 1rem',
            background: 'rgba(30,58,138,0.06)',
            borderRadius: '8px',
            borderLeft: '4px solid var(--navy)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--navy-ink)' }}>
              <UserCheck size={16} />
              <span><strong>Modo Profesor (Dr. Juanjo):</strong> Visualiza las entregas en tiempo real, filtra por Grupo/Puesto, revisa los datos experimentales, asigna calificaciones (/10) y exporta las actas a CSV.</span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={handleExportCSV}
                className="btn btn-xs btn-teal"
                style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Download size={12} /> Exportar Acta CSV
              </button>
              <button
                type="button"
                onClick={handleResetToDemoData}
                className="btn btn-xs btn-ghost"
                style={{ fontSize: '0.72rem' }}
              >
                Restaurar Demos
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. STUDENT PAIR VIEW: REPORT FORM & SUBMISSION                            */}
      {/* ========================================================================= */}
      {viewMode === 'student' && (
        <form onSubmit={handleSubmitReport} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {submitSuccess && (
            <div style={{
              background: '#ecfdf5',
              border: '1.5px solid #10b981',
              color: '#065f46',
              padding: '1rem 1.25rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: 700,
              fontSize: '0.9rem'
            }}>
              <CheckCircle2 size={20} color="#10b981" />
              <span>¡Informe de prácticas enviado al profesor Juanjo con éxito! ID de Entrega: <strong>{currentReport.id}</strong> ({currentReport.submittedAt})</span>
            </div>
          )}

          {/* Section 1: Pair Identification */}
          <div className="qfdos-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.6rem' }}>
              <Users size={18} color="var(--navy-ink)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                1. Datos de Identificación de la Pareja de Laboratorio
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label className="label-text" style={{ fontSize: '0.78rem', fontWeight: 700 }}>Puesto Asignado *</label>
                <select
                  value={currentReport.puesto}
                  onChange={e => setCurrentReport(prev => ({ ...prev, puesto: parseInt(e.target.value) }))}
                  className="qfdos-input"
                  style={{ width: '100%', fontSize: '0.84rem' }}
                >
                  {Array.from({ length: 16 }, (_, i) => i + 1).map(p => (
                    <option key={p} value={p}>Puesto {p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label-text" style={{ fontSize: '0.78rem', fontWeight: 700 }}>Turno de Prácticas *</label>
                <select
                  value={currentReport.turno}
                  onChange={e => setCurrentReport(prev => ({ ...prev, turno: e.target.value as any }))}
                  className="qfdos-input"
                  style={{ width: '100%', fontSize: '0.84rem' }}
                >
                  <option value="8:30-11:30">8:30 - 11:30</option>
                  <option value="11:30-14:30">11:30 - 14:30</option>
                  <option value="16:00-19:00">16:00 - 19:00</option>
                </select>
              </div>

              <div>
                <label className="label-text" style={{ fontSize: '0.78rem', fontWeight: 700 }}>Fecha de Realización</label>
                <input
                  type="date"
                  value={currentReport.fecha}
                  onChange={e => setCurrentReport(prev => ({ ...prev, fecha: e.target.value }))}
                  className="qfdos-input"
                  style={{ width: '100%', fontSize: '0.84rem' }}
                />
              </div>
            </div>

            {/* Students 1 & 2 Inputs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.25rem' }}>
              
              {/* Alumno 1 */}
              <div style={{ background: 'var(--surface-muted)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.88rem', fontWeight: 800, color: 'var(--navy-ink)' }}>
                  👤 Alumno/a 1
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <input
                    type="text"
                    placeholder="Nombre y Apellidos *"
                    value={currentReport.student1.nombre}
                    onChange={e => setCurrentReport(prev => ({
                      ...prev,
                      student1: { ...prev.student1, nombre: e.target.value }
                    }))}
                    className="qfdos-input"
                    style={{ width: '100%', fontSize: '0.82rem' }}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email (@correo.ugr.es o @go.ugr.es)"
                    value={currentReport.student1.email}
                    onChange={e => setCurrentReport(prev => ({
                      ...prev,
                      student1: { ...prev.student1, email: e.target.value }
                    }))}
                    className="qfdos-input"
                    style={{ width: '100%', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              {/* Alumno 2 */}
              <div style={{ background: 'var(--surface-muted)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.88rem', fontWeight: 800, color: 'var(--navy-ink)' }}>
                  👤 Alumno/a 2
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <input
                    type="text"
                    placeholder="Nombre y Apellidos *"
                    value={currentReport.student2.nombre}
                    onChange={e => setCurrentReport(prev => ({
                      ...prev,
                      student2: { ...prev.student2, nombre: e.target.value }
                    }))}
                    className="qfdos-input"
                    style={{ width: '100%', fontSize: '0.82rem' }}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email (@correo.ugr.es o @go.ugr.es)"
                    value={currentReport.student2.email}
                    onChange={e => setCurrentReport(prev => ({
                      ...prev,
                      student2: { ...prev.student2, email: e.target.value }
                    }))}
                    className="qfdos-input"
                    style={{ width: '100%', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: Reacción 1 - Naftoximetiloxirano */}
          <div className="qfdos-card" style={{ padding: '1.5rem' }}>
            <EncabezadoReaccion
              etiqueta="2 · Etapa 1"
              titulo="Síntesis de naftoximetiloxirano"
              condiciones="NaOH ac. · Δ 1 h"
              reactivos={[
                { nombre: 'α-Naftol', smiles: 'Oc1cccc2ccccc12', detalle: 'PM 144,17 · limitante' },
                { nombre: 'Epiclorhidrina', smiles: 'ClCC1CO1', detalle: 'PM 92,53 · 1,66 equiv' }
              ]}
              producto={{ nombre: 'Naftoximetiloxirano', smiles: 'C(C1CO1)Oc1cccc2ccccc12', detalle: 'PM 200,24' }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="label-text" style={{ fontSize: '0.76rem' }}>Masa 1-Naftol pesada (g)</label>
                <input
                  type="number"
                  step="0.01"
                  value={currentReport.step1.mass1Naftol}
                  onChange={e => {
                    const v = parseFloat(e.target.value) || 0;
                    setCurrentReport(prev => ({ ...prev, step1: { ...prev.step1, mass1Naftol: v } }));
                  }}
                  className="qfdos-input"
                  style={{ width: '100%', fontSize: '0.84rem' }}
                />
              </div>

              <div>
                <label className="label-text" style={{ fontSize: '0.76rem' }}>Volumen Epiclorhidrina (mL)</label>
                <input
                  type="number"
                  step="0.05"
                  value={currentReport.step1.volEpiclorhidrina}
                  onChange={e => {
                    const v = parseFloat(e.target.value) || 0;
                    setCurrentReport(prev => ({ ...prev, step1: { ...prev.step1, volEpiclorhidrina: v } }));
                  }}
                  className="qfdos-input"
                  style={{ width: '100%', fontSize: '0.84rem' }}
                />
              </div>

              <div>
                <label className="label-text" style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--navy-ink)' }}>
                  Masa Real de Crudo Obtenida (g) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ej: 3.65"
                  value={currentReport.step1.massProductCrude || ''}
                  onChange={e => handleCalculateStep1Yield(parseFloat(e.target.value) || 0)}
                  className="qfdos-input"
                  style={{ width: '100%', fontSize: '0.84rem', fontWeight: 700, borderColor: 'var(--teal)' }}
                  required
                />
              </div>

            </div>

            <DesgloseRendimiento
              limitante={{ nombre: 'α-naftol', masa: currentReport.step1.mass1Naftol, pm: PM.naftol }}
              producto={{ nombre: 'naftoximetiloxirano', pm: PM.oxirano }}
              masaObtenida={currentReport.step1.massProductCrude}
              porQueLimitante="La epiclorhidrina se anade en exceso (unos 1,66 equivalentes) para evitar que el naftoxido reaccione dos veces y de el dieter. Al estar en exceso, no puede ser la que limita: el maximo lo fija el α-naftol."
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', gap: '1rem' }}>
              <div>
                <label className="label-text" style={{ fontSize: '0.76rem' }}>Aspecto Físico del Oxirano</label>
                <input
                  type="text"
                  placeholder="Ej: Aceite ámbar transparente"
                  value={currentReport.step1.aspect}
                  onChange={e => setCurrentReport(prev => ({ ...prev, step1: { ...prev.step1, aspect: e.target.value } }))}
                  className="qfdos-input"
                  style={{ width: '100%', fontSize: '0.82rem' }}
                />
              </div>
              <div>
                <label className="label-text" style={{ fontSize: '0.76rem' }}>Observaciones de Extracción / Tratamiento</label>
                <input
                  type="text"
                  placeholder="Ej: Extracción 3x15 mL DCM, secado Na2SO4..."
                  value={currentReport.step1.observations}
                  onChange={e => setCurrentReport(prev => ({ ...prev, step1: { ...prev.step1, observations: e.target.value } }))}
                  className="qfdos-input"
                  style={{ width: '100%', fontSize: '0.82rem' }}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Reacción 2 - Propranolol */}
          <div className="qfdos-card" style={{ padding: '1.5rem' }}>
            <EncabezadoReaccion
              etiqueta="3 · Etapa 2"
              titulo="Síntesis y cristalización de propranolol base"
              condiciones="EtOH · Δ 1 h"
              reactivos={[
                { nombre: 'Naftoximetiloxirano', smiles: 'C(C1CO1)Oc1cccc2ccccc12', detalle: 'PM 200,24 · limitante' },
                { nombre: 'Isopropilamina', smiles: 'CC(C)N', detalle: 'PM 59,11 · 3,4 equiv' }
              ]}
              producto={{ nombre: 'Propranolol', smiles: 'CC(C)NCC(O)COc1cccc2ccccc12', detalle: 'PM 259,34 · Pf 94-96 °C' }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="label-text" style={{ fontSize: '0.76rem' }}>Masa Oxirano puesto (g)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ej: 3.50"
                  value={currentReport.step2.massOxirane || ''}
                  onChange={e => handleCalculateStep2Yield(currentReport.step2.massProductBase, parseFloat(e.target.value) || 0)}
                  className="qfdos-input"
                  style={{ width: '100%', fontSize: '0.84rem' }}
                />
              </div>

              <div>
                <label className="label-text" style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--navy-ink)' }}>
                  Masa Propranolol Cristalizado (g) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ej: 3.82"
                  value={currentReport.step2.massProductBase || ''}
                  onChange={e => handleCalculateStep2Yield(parseFloat(e.target.value) || 0, currentReport.step2.massOxirane)}
                  className="qfdos-input"
                  style={{ width: '100%', fontSize: '0.84rem', fontWeight: 700, borderColor: 'var(--navy)' }}
                  required
                />
              </div>

              <div>
                <label className="label-text" style={{ fontSize: '0.76rem', fontWeight: 700 }}>
                  Punto de Fusión Observado (°C) *
                </label>
                <input
                  type="text"
                  placeholder="Ej: 94.5 - 95.8 °C"
                  value={currentReport.step2.meltingPointObserved}
                  onChange={e => setCurrentReport(prev => ({
                    ...prev,
                    step2: { ...prev.step2, meltingPointObserved: e.target.value }
                  }))}
                  className="qfdos-input"
                  style={{ width: '100%', fontSize: '0.84rem' }}
                  required
                />
              </div>

              <div>
                <label className="label-text" style={{ fontSize: '0.76rem' }}>TLC (Rf observado)</label>
                <input
                  type="text"
                  placeholder="Ej: Rf = 0.42"
                  value={currentReport.step2.tlcRf}
                  onChange={e => setCurrentReport(prev => ({
                    ...prev,
                    step2: { ...prev.step2, tlcRf: e.target.value }
                  }))}
                  className="qfdos-input"
                  style={{ width: '100%', fontSize: '0.84rem' }}
                />
              </div>

            </div>

            <DesgloseRendimiento
              limitante={{ nombre: 'naftoximetiloxirano', masa: currentReport.step2.massOxirane, pm: PM.oxirano }}
              producto={{ nombre: 'propranolol', pm: PM.propranolol }}
              masaObtenida={currentReport.step2.massProductBase}
              porQueLimitante="La isopropilamina va en gran exceso (unos 3,4 equivalentes) y ademas se elimina en el rotavapor porque hierve a 33 °C. El limitante es el oxirano que habeis obtenido vosotros en la etapa anterior."
            />

            {/* El rendimiento global encadena las dos etapas: es el que de verdad
                mide cuanto propranolol se saca del naftol de partida. */}
            <div className="calc-global">
              <div>
                <span className="eyebrow">Rendimiento global de la sintesis</span>
                <code className="calc-formula" style={{ marginTop: 4 }}>
                  η(global) = η(etapa 1) × η(etapa 2) ÷ 100
                </code>
                <code className="calc-sustitucion">
                  η = {currentReport.step1.yieldPercentage.toFixed(1)} % × {currentReport.step2.yieldStage.toFixed(1)} % ÷ 100
                </code>
                <p className="calc-nota">
                  Referido a los {currentReport.step1.mass1Naftol || 0} g de α-naftol de partida. Un 70 % en cada
                  etapa no da un 70 % global, sino un 49 %: las perdidas se multiplican, no se promedian.
                </p>
              </div>
              <span className="calc-resultado-grande">
                {currentReport.step2.yieldAccumulated.toFixed(1)} %
              </span>
            </div>

            <div>
              <label className="label-text" style={{ fontSize: '0.76rem' }}>Observaciones de Cristalización / Aspecto de los Cristales</label>
              <input
                type="text"
                placeholder="Ej: Cristales aciculares blancos brillantes tras enfriamiento en baño de hielo..."
                value={currentReport.step2.observations}
                onChange={e => setCurrentReport(prev => ({
                  ...prev,
                  step2: { ...prev.step2, observations: e.target.value }
                }))}
                className="qfdos-input"
                style={{ width: '100%', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          {/* Section 4: Reacción 3 - Hantzsch (DHPP / Nifedipina) */}
          <div className="qfdos-card" style={{ padding: '1.5rem' }}>
            <EncabezadoReaccion
              etiqueta="4 · Etapa 3"
              titulo="Síntesis de 1,4-dihidropiridinas (reacción de Hantzsch)"
              condiciones="EtOH 95 % · reflujo 2 h"
              reactivos={
                currentReport.step3.compoundType === 'DHPP'
                  ? [
                      { nombre: 'Benzaldehído', smiles: 'O=Cc1ccccc1', detalle: 'PM 106,12 · limitante' },
                      { nombre: 'Acetoacetato de metilo', smiles: 'COC(=O)CC(C)=O', detalle: 'PM 116,12 · 2 equiv' },
                      { nombre: 'Amoníaco', smiles: 'N', detalle: 'NH₃ 35 % · exceso' }
                    ]
                  : [
                      { nombre: '2-Nitrobenzaldehído', smiles: 'O=Cc1ccccc1[N+](=O)[O-]', detalle: 'PM 151,12 · limitante' },
                      { nombre: 'Acetoacetato de metilo', smiles: 'COC(=O)CC(C)=O', detalle: 'PM 116,12 · 2 equiv' },
                      { nombre: 'Amoníaco', smiles: 'N', detalle: 'NH₃ 35 % · exceso' }
                    ]
              }
              producto={
                currentReport.step3.compoundType === 'DHPP'
                  ? { nombre: 'DHPP', smiles: 'COC(=O)C1=C(C)NC(C)=C(C(=O)OC)C1c1ccccc1', detalle: 'PM 301,34 · Pf 194-196 °C' }
                  : { nombre: 'Nifedipino', smiles: 'COC(=O)C1=C(C)NC(C)=C(C(=O)OC)C1c1ccccc1[N+](=O)[O-]', detalle: 'PM 346,33 · Pf 172-174 °C' }
              }
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="label-text" style={{ fontSize: '0.76rem', fontWeight: 700 }}>Compuesto Sintetizado *</label>
                <select
                  value={currentReport.step3.compoundType}
                  onChange={e => {
                    const comp = e.target.value as 'DHPP' | 'Nifedipina';
                    const porDefecto = comp === 'DHPP' ? '2.55 mL Benzaldehido' : '3.02 g 2-Nitrobenzaldehido';
                    handleCalculateStep3Yield(currentReport.step3.massProduct, comp, porDefecto);
                  }}
                  className="qfdos-input"
                  style={{ width: '100%', fontSize: '0.84rem', fontWeight: 700 }}
                >
                  <option value="DHPP">DHPP (con Benzaldehído)</option>
                  <option value="Nifedipina">Nifedipina (con 2-Nitrobenzaldehído)</option>
                </select>
              </div>

              <div>
                <label className="label-text" style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--teal-ink)' }}>
                  Masa de Cristales Obtenida (g) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ej: 5.72"
                  value={currentReport.step3.massProduct || ''}
                  onChange={e => handleCalculateStep3Yield(parseFloat(e.target.value) || 0, currentReport.step3.compoundType)}
                  className="qfdos-input"
                  style={{ width: '100%', fontSize: '0.84rem', fontWeight: 700, borderColor: 'var(--teal)' }}
                  required
                />
              </div>

              <div>
                <label className="label-text" style={{ fontSize: '0.76rem', fontWeight: 700 }}>
                  Punto de Fusión Observado (°C) *
                </label>
                <input
                  type="text"
                  placeholder={currentReport.step3.compoundType === 'DHPP' ? 'Ej: 194.5 - 196.0 °C' : 'Ej: 172.5 - 174.0 °C'}
                  value={currentReport.step3.meltingPointObserved}
                  onChange={e => setCurrentReport(prev => ({
                    ...prev,
                    step3: { ...prev.step3, meltingPointObserved: e.target.value }
                  }))}
                  className="qfdos-input"
                  style={{ width: '100%', fontSize: '0.84rem' }}
                  required
                />
              </div>

              <div>
                <label className="label-text" style={{ fontSize: '0.76rem' }}>Hábito Cristalino</label>
                <input
                  type="text"
                  placeholder="Ej: Agujas amarillas intensas"
                  value={currentReport.step3.crystalHabit}
                  onChange={e => setCurrentReport(prev => ({
                    ...prev,
                    step3: { ...prev.step3, crystalHabit: e.target.value }
                  }))}
                  className="qfdos-input"
                  style={{ width: '100%', fontSize: '0.84rem' }}
                />
              </div>

            </div>

            {/* El aldehído es el limitante; si se mide por volumen hay que pasarlo
                antes a masa con la densidad, y ese paso también se muestra. */}
            {(() => {
              const esDHPP = currentReport.step3.compoundType === 'DHPP';
              const cant = parseCantidadAldehido(currentReport.step3.amountAldehyde) ?? 0;
              const masaAldehido = esDHPP ? cant * 1.044 : cant;

              return (
                <>
                  {esDHPP && cant > 0 && (
                    <div className="calc-previo">
                      <span className="eyebrow">Paso previo: el benzaldehído se mide en volumen</span>
                      <code className="calc-formula">m = V × d</code>
                      <code className="calc-sustitucion">
                        m = {cant.toLocaleString('es-ES')} mL × 1,044 g/mL = {masaAldehido.toFixed(3)} g
                      </code>
                      <p className="calc-nota">
                        Los líquidos se dosifican con probeta o pipeta, así que primero hay que
                        convertir el volumen en masa con la densidad. El 2-nitrobenzaldehído, en
                        cambio, es sólido y se pesa directamente.
                      </p>
                    </div>
                  )}

                  <DesgloseRendimiento
                    limitante={{
                      nombre: esDHPP ? 'benzaldehído' : '2-nitrobenzaldehído',
                      masa: masaAldehido,
                      pm: esDHPP ? PM.benzaldehido : PM.nitrobenzaldehido
                    }}
                    producto={{
                      nombre: esDHPP ? 'DHPP' : 'nifedipino',
                      pm: esDHPP ? PM.dhpp : PM.nifedipino
                    }}
                    masaObtenida={currentReport.step3.massProduct}
                    porQueLimitante={
                      'La sintesis de Hantzsch consume un aldehido, DOS moleculas de acetoacetato de metilo ' +
                      'y un amoniaco. El acetoacetato se anade justo en relacion 2:1 y el amoniaco en exceso, ' +
                      'de modo que el aldehido es el que fija el maximo: por cada mol suyo sale, como mucho, ' +
                      'un mol de dihidropiridina.'
                    }
                  />
                </>
              );
            })()}

            <div>
              <label className="label-text" style={{ fontSize: '0.76rem' }}>Observaciones de la Reacción y Filtración Büchner</label>
              <input
                type="text"
                placeholder="Ej: Tiempo de reflujo 2 horas, precipitación completa al templar, lavado con etanol frío..."
                value={currentReport.step3.observations}
                onChange={e => setCurrentReport(prev => ({
                  ...prev,
                  step3: { ...prev.step3, observations: e.target.value }
                }))}
                className="qfdos-input"
                style={{ width: '100%', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          {/* Section 5: Cuestiones Breves */}
          <div className="qfdos-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.6rem' }}>
              <MessageSquare size={18} color="var(--navy-ink)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                5. Cuestiones Teórico-Prácticas del Cuaderno
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label-text" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                  1. En la extracción de la etapa 1, ¿por qué la fase de diclorometano (DCM) queda en la capa inferior del embudo de decantación?
                </label>
                <textarea
                  rows={2}
                  placeholder="Justifica basándote en la densidad relativa de los disolventes..."
                  value={currentReport.cuestiones.q1_dcm_density}
                  onChange={e => setCurrentReport(prev => ({
                    ...prev,
                    cuestiones: { ...prev.cuestiones, q1_dcm_density: e.target.value }
                  }))}
                  className="qfdos-input"
                  style={{ width: '100%', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label className="label-text" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                  2. En el espectro de ¹H RMN de la 1,4-dihidropiridina, ¿dónde aparece el protón metínico C4-H y cómo cambia en Nifedipina respecto a DHPP?
                </label>
                <textarea
                  rows={2}
                  placeholder="Indica desplazamiento químico en ppm, multiplicidad y efecto del grupo nitro..."
                  value={currentReport.cuestiones.q2_nmr_c4_proton}
                  onChange={e => setCurrentReport(prev => ({
                    ...prev,
                    cuestiones: { ...prev.cuestiones, q2_nmr_c4_proton: e.target.value }
                  }))}
                  className="qfdos-input"
                  style={{ width: '100%', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label className="label-text" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                  3. ¿Por qué es fundamental que el montaje de calefacción a reflujo esté abierto a la atmósfera y la placa sobre un Lab-jack?
                </label>
                <textarea
                  rows={2}
                  placeholder="Explica las dos medidas críticas de seguridad térmica y sobrepresión..."
                  value={currentReport.cuestiones.q3_reflux_safety}
                  onChange={e => setCurrentReport(prev => ({
                    ...prev,
                    cuestiones: { ...prev.cuestiones, q3_reflux_safety: e.target.value }
                  }))}
                  className="qfdos-input"
                  style={{ width: '100%', fontSize: '0.82rem' }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={handlePrintReport}
                className="btn btn-outline"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}
              >
                <Printer size={15} /> Imprimir / Guardar en PDF
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-teal"
              style={{ padding: '0.75rem 1.75rem', fontWeight: 800, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Send size={16} /> Guardar y preparar la entrega
            </button>
          </div>

          {/* La entrega de verdad: guardar el informe sólo lo deja en este
              navegador, así que aquí es donde sale del equipo de la pareja. */}
          <EntregaProfesor
            hoja="Cuaderno de parejas"
            titulo={`Cuaderno de prácticas · Puesto ${currentReport.puesto} · Turno ${currentReport.turno}`}
            nombreFichero={`cuaderno-puesto${currentReport.puesto}-turno${currentReport.turno.replace(':', '').replace('-', '_')}`}
            deshabilitado={!currentReport.student1.nombre || !currentReport.student2.nombre}
            motivoDeshabilitado="Escribid los nombres de los dos miembros de la pareja antes de entregar."
            datos={construirDatosEntrega()}
          />


        </form>
      )}

      {/* ========================================================================= */}
      {/* 2. PROFESSOR DASHBOARD: RECEPTION, GRADING & ACTAS                        */}
      {/* ========================================================================= */}
      {viewMode === 'profesor' && isProfesor && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Summary Metrics Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div className="qfdos-card" style={{ padding: '1rem', borderLeft: '4px solid var(--navy)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL ENTREGAS</span>
              <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.5rem', fontWeight: 900, color: 'var(--navy-ink)' }}>
                {reports.length} Parejas
              </h3>
            </div>

            <div className="qfdos-card" style={{ padding: '1rem', borderLeft: '4px solid #10b981' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>INFORMES CALIFICADOS</span>
              <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.5rem', fontWeight: 900, color: '#10b981' }}>
                {reports.filter(r => r.status === 'Calificado').length}
              </h3>
            </div>

            <div className="qfdos-card" style={{ padding: '1rem', borderLeft: '4px solid #f59e0b' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>PENDIENTES DE REVISAR</span>
              <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.5rem', fontWeight: 900, color: '#f59e0b' }}>
                {reports.filter(r => r.status === 'Entregado').length}
              </h3>
            </div>

            <div className="qfdos-card" style={{ padding: '1rem', borderLeft: '4px solid var(--teal)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>CALIFICACIÓN MEDIA</span>
              <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.5rem', fontWeight: 900, color: 'var(--teal-ink)' }}>
                {(() => {
                  const graded = reports.filter(r => r.profesorGrade !== undefined);
                  if (!graded.length) return '-- / 10';
                  const avg = graded.reduce((acc, curr) => acc + (curr.profesorGrade || 0), 0) / graded.length;
                  return `${avg.toFixed(2)} / 10`;
                })()}
              </h3>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="qfdos-card" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Buscar por Alumno/a, Email o ID de Pareja..."
                value={profesorSearchTerm}
                onChange={e => setProfesorSearchTerm(e.target.value)}
                className="qfdos-input"
                style={{ width: '100%', fontSize: '0.84rem' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={16} color="var(--text-muted)" />
              <select
                value={profesorFilterTurno}
                onChange={e => setProfesorFilterTurno(e.target.value)}
                className="qfdos-input"
                style={{ fontSize: '0.84rem' }}
              >
                <option value="all">Todos los Turnos</option>
                <option value="8:30-11:30">8:30 - 11:30</option>
                <option value="11:30-14:30">11:30 - 14:30</option>
                <option value="16:00-19:00">16:00 - 19:00</option>
              </select>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="qfdos-card" style={{ padding: '1rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-muted)', borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>ID / Puesto</th>
                  <th style={{ padding: '0.75rem' }}>Turno</th>
                  <th style={{ padding: '0.75rem' }}>Pareja de Estudiantes</th>
                  <th style={{ padding: '0.75rem' }}>Rendimientos (%)</th>
                  <th style={{ padding: '0.75rem' }}>Puntos de Fusión</th>
                  <th style={{ padding: '0.75rem' }}>Estado</th>
                  <th style={{ padding: '0.75rem' }}>Nota</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfessorReports.map((rep) => (
                  <tr key={rep.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 800, color: 'var(--navy-ink)' }}>
                      {rep.id} <br />
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>Puesto {rep.puesto}</span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className="qfdos-badge badge-teal" style={{ fontSize: '0.7rem' }}>{rep.turno}</span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <strong>1. {rep.student1.nombre}</strong> {rep.student1.email && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({rep.student1.email})</span>}<br />
                      <strong>2. {rep.student2.nombre}</strong> {rep.student2.email && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({rep.student2.email})</span>}
                    </td>
                    <td style={{ padding: '0.75rem', fontFamily: 'Roboto Mono, monospace', fontSize: '0.76rem' }}>
                      Oxirano: <strong>{rep.step1.yieldPercentage}%</strong><br />
                      Propranolol: <strong>{rep.step2.yieldAccumulated}%</strong><br />
                      {rep.step3.compoundType}: <strong>{rep.step3.yieldPercentage}%</strong>
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.76rem' }}>
                      Propranolol: <strong>{rep.step2.meltingPointObserved || '--'}</strong><br />
                      {rep.step3.compoundType}: <strong>{rep.step3.meltingPointObserved || '--'}</strong>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {rep.status === 'Calificado' ? (
                        <span className="qfdos-badge" style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.72rem', fontWeight: 700 }}>
                          ✓ Calificado
                        </span>
                      ) : (
                        <span className="qfdos-badge" style={{ background: '#fef3c7', color: '#b45309', fontSize: '0.72rem', fontWeight: 700 }}>
                          ⏱️ Entregado
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: 900, fontSize: '1rem', color: rep.profesorGrade !== undefined ? 'var(--navy)' : 'var(--text-muted)' }}>
                      {rep.profesorGrade !== undefined ? `${rep.profesorGrade.toFixed(1)}/10` : '--'}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedReportIdForGrading(rep.id);
                          setTempGrade(rep.profesorGrade !== undefined ? rep.profesorGrade : 9.0);
                          setTempFeedback(rep.profesorFeedback || '');
                        }}
                        className="btn btn-xs btn-navy"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem' }}
                      >
                        <Edit3 size={12} /> Revisar & Calificar
                      </button>
                    </td>
                  </tr>
                ))}
                {!filteredProfessorReports.length && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No se han encontrado entregas para los filtros seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal / Drawer for Reviewing & Grading */}
          {activeGradingReport && (
            <div className="qfdos-card panel-claro" style={{
              padding: '1.75rem',
              border: '2px solid var(--navy)',
              
              boxShadow: '0 12px 32px rgba(30,58,138,0.12)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1.5px solid var(--border)', paddingBottom: '0.75rem' }}>
                <div>
                  <span className="qfdos-badge badge-navy" style={{ marginBottom: '0.3rem' }}>
                    REVISIÓN Y CALIFICACIÓN DOCENTE
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-title)' }}>
                    Informe de Laboratorio: Pareja {activeGradingReport.id} (Puesto {activeGradingReport.puesto} · Turno {activeGradingReport.turno})
                  </h3>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Estudiantes: <strong>{activeGradingReport.student1.nombre}</strong> {activeGradingReport.student1.email && `(${activeGradingReport.student1.email})`} y <strong>{activeGradingReport.student2.nombre}</strong> {activeGradingReport.student2.email && `(${activeGradingReport.student2.email})`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedReportIdForGrading(null)}
                  className="btn btn-xs btn-ghost"
                  style={{ fontSize: '0.8rem' }}
                >
                  ✕ Cerrar
                </button>
              </div>

              {/* Experimental Data Review Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                {/* Stage 1 */}
                <div style={{ background: 'var(--surface-muted)', padding: '0.85rem', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '0.84rem', fontWeight: 800, color: 'var(--teal-ink)' }}>
                    1. Naftoximetiloxirano
                  </h4>
                  <div style={{ fontSize: '0.78rem', lineHeight: 1.5 }}>
                    <div>Masa Cruda: <strong>{activeGradingReport.step1.massProductCrude} g</strong></div>
                    <div>Rendimiento: <strong>{activeGradingReport.step1.yieldPercentage}%</strong></div>
                    <div>Aspecto: <em>{activeGradingReport.step1.aspect}</em></div>
                    <div style={{ marginTop: '4px', color: 'var(--text-muted)', fontSize: '0.74rem' }}>{activeGradingReport.step1.observations}</div>
                  </div>
                </div>

                {/* Stage 2 */}
                <div style={{ background: 'var(--surface-muted)', padding: '0.85rem', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '0.84rem', fontWeight: 800, color: 'var(--navy-ink)' }}>
                    2. Propranolol Base
                  </h4>
                  <div style={{ fontSize: '0.78rem', lineHeight: 1.5 }}>
                    <div>Masa Base: <strong>{activeGradingReport.step2.massProductBase} g</strong></div>
                    <div>Rend. Etapa / Global: <strong>{activeGradingReport.step2.yieldStage}% / {activeGradingReport.step2.yieldAccumulated}%</strong></div>
                    <div>Punto Fusión: <strong>{activeGradingReport.step2.meltingPointObserved || '--'}</strong> (Ref: 94-96°C)</div>
                    <div>TLC: <em>{activeGradingReport.step2.tlcRf}</em></div>
                  </div>
                </div>

                {/* Stage 3 */}
                <div style={{ background: 'var(--surface-muted)', padding: '0.85rem', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '0.84rem', fontWeight: 800, color: 'var(--teal-ink)' }}>
                    3. {activeGradingReport.step3.compoundType}
                  </h4>
                  <div style={{ fontSize: '0.78rem', lineHeight: 1.5 }}>
                    <div>Masa Cristales: <strong>{activeGradingReport.step3.massProduct} g</strong></div>
                    <div>Rendimiento: <strong>{activeGradingReport.step3.yieldPercentage}%</strong></div>
                    <div>Punto Fusión: <strong>{activeGradingReport.step3.meltingPointObserved || '--'}</strong> (Ref: {activeGradingReport.step3.meltingPointReference})</div>
                    <div>Hábito: <em>{activeGradingReport.step3.crystalHabit}</em></div>
                  </div>
                </div>
              </div>

              {/* Answers to questions */}
              <div style={{ background: 'var(--surface-muted)', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.84rem', fontWeight: 800 }}>
                  Respuestas a Cuestiones del Cuaderno:
                </h4>
                <ol style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li><strong>Densidad DCM:</strong> {activeGradingReport.cuestiones.q1_dcm_density || 'Sin respuesta'}</li>
                  <li><strong>RMN C4-H:</strong> {activeGradingReport.cuestiones.q2_nmr_c4_proton || 'Sin respuesta'}</li>
                  <li><strong>Seguridad Reflujo:</strong> {activeGradingReport.cuestiones.q3_reflux_safety || 'Sin respuesta'}</li>
                </ol>
              </div>

              {/* Grading Input Form */}
              <div style={{ display: 'grid', gridTemplateColumns: '160px minmax(0, 1fr)', gap: '1.25rem', alignItems: 'flex-start', background: 'rgba(30,58,138,0.04)', padding: '1.25rem', borderRadius: '8px' }}>
                <div>
                  <label className="label-text" style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--navy-ink)' }}>
                    Calificación (/10) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={tempGrade}
                    onChange={e => setTempGrade(parseFloat(e.target.value) || 0)}
                    className="qfdos-input"
                    style={{ width: '100%', fontSize: '1.25rem', fontWeight: 900, color: 'var(--navy-ink)' }}
                  />
                </div>

                <div>
                  <label className="label-text" style={{ fontSize: '0.8rem', fontWeight: 800 }}>
                    Comentarios y Feedback del Profesor para la Pareja:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Escribe aquí observaciones sobre los rendimientos, pureza de los puntos de fusión o respuestas del cuaderno..."
                    value={tempFeedback}
                    onChange={e => setTempFeedback(e.target.value)}
                    className="qfdos-input"
                    style={{ width: '100%', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              {/* Save Grade Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedReportIdForGrading(null)}
                  className="btn btn-outline"
                  style={{ fontSize: '0.82rem' }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveGrade(activeGradingReport.id)}
                  className="btn btn-navy"
                  style={{ fontSize: '0.84rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Award size={15} /> Guardar Calificación y Enviar Feedback
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
