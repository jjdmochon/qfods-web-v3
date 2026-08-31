import React, { useState, useMemo } from 'react';
import {
  LAB_REAGENTS,
  LAB_PRODUCTS,
  LabReagent,
  LabProduct
} from '../../data/practicasData';
import { Chem2DDrawer } from '../Chem2DDrawer';
import {
  Calculator, Sparkles, Scale, AlertCircle, CheckCircle2,
  Download, RefreshCw, Layers, ArrowRight, HelpCircle, Save
} from 'lucide-react';

interface PresetReaction {
  id: string;
  name: string;
  subtitle: string;
  reactants: {
    reagent: LabReagent;
    stoichiometry: number;
    defaultIsVolume: boolean;
    defaultAmount: number; // g or mL
    density?: number;
    purity: number; // %
  }[];
  product: LabProduct;
  productStoichiometry: number;
}

const PRESET_REACTIONS: PresetReaction[] = [
  {
    id: 'propranolol_step1',
    name: 'Propranolol - Paso 1: Naftoximetiloxirano',
    subtitle: '1-Naftol + Epiclorhidrina → Naftoximetiloxirano (I)',
    reactants: [
      {
        reagent: LAB_REAGENTS.alfa_naftol,
        stoichiometry: 1,
        defaultIsVolume: false,
        defaultAmount: 3.00,
        purity: 99.0
      },
      {
        reagent: LAB_REAGENTS.epiclorhidrina,
        stoichiometry: 1,
        defaultIsVolume: true,
        defaultAmount: 2.70,
        density: 1.18,
        purity: 99.0
      }
    ],
    product: LAB_PRODUCTS.oxirano_step1,
    productStoichiometry: 1
  },
  {
    id: 'propranolol_step2',
    name: 'Propranolol - Paso 2: Aminolisis final',
    subtitle: 'Naftoximetiloxirano (I) + Isopropilamina → Propranolol (II)',
    reactants: [
      {
        reagent: {
          id: 'naftoximetiloxirano_calc',
          name: 'Naftoximetiloxirano (I) obtenido',
          formula: 'C₁₃H₁₂O₂',
          mw: 200.23,
          smiles: 'O1CC1COc2cccc3ccccc23',
          safetyAlert: 'Intermedio',
          pictograms: ['irritant']
        },
        stoichiometry: 1,
        defaultIsVolume: false,
        defaultAmount: 3.60,
        purity: 95.0
      },
      {
        reagent: LAB_REAGENTS.isopropilamina,
        stoichiometry: 1,
        defaultIsVolume: true,
        defaultAmount: 6.00,
        density: 0.69,
        purity: 99.5
      }
    ],
    product: LAB_PRODUCTS.propranolol_base,
    productStoichiometry: 1
  },
  {
    id: 'hantzsch_dhpp',
    name: 'Síntesis de Hantzsch: DHPP',
    subtitle: 'Benzaldehído + 2 Acetoacetato de metilo + NH₃ → DHPP',
    reactants: [
      {
        reagent: LAB_REAGENTS.benzaldehido,
        stoichiometry: 1,
        defaultIsVolume: true,
        defaultAmount: 2.55,
        density: 1.04,
        purity: 99.0
      },
      {
        reagent: LAB_REAGENTS.metil_acetoacetato,
        stoichiometry: 2,
        defaultIsVolume: true,
        defaultAmount: 5.40,
        density: 1.08,
        purity: 99.0
      },
      {
        reagent: LAB_REAGENTS.amoniaco_conc,
        stoichiometry: 1,
        defaultIsVolume: true,
        defaultAmount: 3.20,
        density: 0.89,
        purity: 35.0
      }
    ],
    product: LAB_PRODUCTS.dhpp,
    productStoichiometry: 1
  },
  {
    id: 'hantzsch_nifedipina',
    name: 'Síntesis de Hantzsch: Nifedipina (Análogo)',
    subtitle: '2-Nitrobenzaldehído + 2 Acetoacetato de metilo + NH₃ → Nifedipina',
    reactants: [
      {
        reagent: {
          id: 'nitrobenzaldehido',
          name: '2-Nitrobenzaldehído',
          formula: 'C₇H₅NO₃',
          mw: 151.12,
          smiles: 'O=Cc1ccccc1[N+](=O)[O-]',
          safetyAlert: 'Irritante',
          pictograms: ['irritant']
        },
        stoichiometry: 1,
        defaultIsVolume: false,
        defaultAmount: 3.78,
        purity: 98.0
      },
      {
        reagent: LAB_REAGENTS.metil_acetoacetato,
        stoichiometry: 2,
        defaultIsVolume: true,
        defaultAmount: 5.40,
        density: 1.08,
        purity: 99.0
      },
      {
        reagent: LAB_REAGENTS.amoniaco_conc,
        stoichiometry: 1,
        defaultIsVolume: true,
        defaultAmount: 3.20,
        density: 0.89,
        purity: 35.0
      }
    ],
    product: LAB_PRODUCTS.nifedipina,
    productStoichiometry: 1
  }
];

export const PracticasYieldCalculator: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('propranolol_step1');
  const currentPreset = PRESET_REACTIONS.find(p => p.id === selectedPresetId) || PRESET_REACTIONS[0];

  // User editable reactant state
  const [reactantValues, setReactantValues] = useState<{
    [reagentId: string]: {
      isVolume: boolean;
      amount: number;
      density: number;
      purity: number;
    }
  }>(() => {
    const initial: any = {};
    currentPreset.reactants.forEach(r => {
      initial[r.reagent.id] = {
        isVolume: r.defaultIsVolume,
        amount: r.defaultAmount,
        density: r.density || 1.0,
        purity: r.purity
      };
    });
    return initial;
  });

  // Update reactant state when preset changes
  const handlePresetChange = (presetId: string) => {
    setSelectedPresetId(presetId);
    const targetPreset = PRESET_REACTIONS.find(p => p.id === presetId) || PRESET_REACTIONS[0];
    const initial: any = {};
    targetPreset.reactants.forEach(r => {
      initial[r.reagent.id] = {
        isVolume: r.defaultIsVolume,
        amount: r.defaultAmount,
        density: r.density || 1.0,
        purity: r.purity
      };
    });
    setReactantValues(initial);
    setExperimentalMass(0);
    setObservedMp('');
  };

  // Student measured values
  const [experimentalMass, setExperimentalMass] = useState<number>(0);
  const [observedMp, setObservedMp] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [studentGroup, setStudentGroup] = useState<string>('');
  const [savedRecords, setSavedRecords] = useState<any[]>(() => {
    const saved = localStorage.getItem('qfdos_lab_yield_records');
    return saved ? JSON.parse(saved) : [];
  });

  // Calculate moles for each reactant
  const calculationData = useMemo(() => {
    const items = currentPreset.reactants.map(r => {
      const vals = reactantValues[r.reagent.id] || {
        isVolume: r.defaultIsVolume,
        amount: r.defaultAmount,
        density: r.density || 1.0,
        purity: r.purity
      };

      const rawMass = vals.isVolume ? vals.amount * vals.density : vals.amount;
      const pureMass = rawMass * (vals.purity / 100);
      const moles = pureMass / r.reagent.mw;
      const mmoles = moles * 1000;
      const normalizedRatio = moles / r.stoichiometry;

      return {
        reagent: r.reagent,
        stoichiometry: r.stoichiometry,
        isVolume: vals.isVolume,
        amount: vals.amount,
        density: vals.density,
        purity: vals.purity,
        rawMass,
        pureMass,
        moles,
        mmoles,
        normalizedRatio
      };
    });

    // Find limiting reactant (smallest normalizedRatio)
    let limitingIdx = 0;
    let minRatio = items[0]?.normalizedRatio ?? 0;
    items.forEach((item, idx) => {
      if (item.normalizedRatio < minRatio) {
        minRatio = item.normalizedRatio;
        limitingIdx = idx;
      }
    });

    const limitingItem = items[limitingIdx];
    const theoreticalProductMoles = (limitingItem ? limitingItem.normalizedRatio : 0) * currentPreset.productStoichiometry;
    const theoreticalProductMassG = theoreticalProductMoles * currentPreset.product.mw;

    const yieldPercent = theoreticalProductMassG > 0 && experimentalMass > 0
      ? (experimentalMass / theoreticalProductMassG) * 100
      : 0;

    return {
      items,
      limitingIdx,
      limitingItem,
      theoreticalProductMoles,
      theoreticalProductMassG,
      yieldPercent
    };
  }, [currentPreset, reactantValues, experimentalMass]);

  const handleValueChange = (reagentId: string, field: string, val: number | boolean) => {
    setReactantValues(prev => ({
      ...prev,
      [reagentId]: {
        ...(prev[reagentId] || {}),
        [field]: val
      }
    }));
  };

  const handleSaveToNotebook = () => {
    if (experimentalMass <= 0) {
      alert('Introduce primero la masa obtenida en gramos para guardar el registro.');
      return;
    }
    const newRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('es-ES'),
      reactionName: currentPreset.name,
      productName: currentPreset.product.name,
      experimentalMass,
      theoreticalMass: calculationData.theoreticalProductMassG.toFixed(3),
      yieldPercent: calculationData.yieldPercent.toFixed(1),
      observedMp: observedMp || 'No medido',
      studentName: studentName || 'Alumno Anónimo',
      studentGroup: studentGroup || 'Grupo Prácticas'
    };
    const updated = [newRecord, ...savedRecords];
    setSavedRecords(updated);
    localStorage.setItem('qfdos_lab_yield_records', JSON.stringify(updated));

    // Transferir los datos directamente a la ficha del Cuaderno de Parejas (etapa 1, 2 o 3)
    try {
      const draftRaw = localStorage.getItem('qfdos_pair_report_draft');
      const draft = draftRaw ? JSON.parse(draftRaw) : null;
      
      const updatedDraft = draft ? { ...draft } : {
        id: `REP-${Date.now().toString().slice(-6)}`,
        grupo: studentGroup || 'Grupo A',
        puesto: 1,
        turno: 'Mañana',
        fecha: new Date().toISOString().split('T')[0],
        student1: { nombre: studentName || '', dni: '', email: '' },
        student2: { nombre: '', dni: '', email: '' },
        step1: { mass1Naftol: 3.00, volEpiclorhidrina: 2.70, massNaOH: 1.20, massProductCrude: 0, yieldPercentage: 0, aspect: 'Aceite ámbar', observations: '' },
        step2: { massOxirane: 0, volIsopropilamina: 6.00, massProductBase: 0, yieldStage: 0, yieldAccumulated: 0, meltingPointObserved: '', meltingPointReference: '94 - 96 °C', tlcRf: 'Rf = 0.42', observations: '' },
        step3: { compoundType: 'DHPP', amountAldehyde: '2.55 mL Benzaldehído', volMethylAcetoacetate: 5.40, volNH3Conc: 4.50, massProduct: 0, yieldPercentage: 0, meltingPointObserved: '', meltingPointReference: '194 - 196 °C', crystalHabit: 'Agujas prismáticas amarillas', observations: '' },
        cuestiones: { q1_dcm_density: '', q2_nmr_c4_proton: '', q3_reflux_safety: '' },
        status: 'Borrador'
      };

      if (selectedPresetId === 'propranolol_step1') {
        const naftolVal = reactantValues['alfa_naftol']?.amount || 3.0;
        updatedDraft.step1.mass1Naftol = naftolVal;
        updatedDraft.step1.massProductCrude = experimentalMass;
        updatedDraft.step1.yieldPercentage = parseFloat(calculationData.yieldPercent.toFixed(1));
        if (!updatedDraft.step2.massOxirane || updatedDraft.step2.massOxirane === 0) {
          updatedDraft.step2.massOxirane = experimentalMass;
        }
      } else if (selectedPresetId === 'propranolol_step2') {
        const oxiranoVal = reactantValues['naftoximetiloxirano_calc']?.amount || experimentalMass;
        updatedDraft.step2.massOxirane = oxiranoVal;
        updatedDraft.step2.massProductBase = experimentalMass;
        updatedDraft.step2.yieldStage = parseFloat(calculationData.yieldPercent.toFixed(1));
        if (observedMp) updatedDraft.step2.meltingPointObserved = observedMp;
        const initialNaftol = updatedDraft.step1.mass1Naftol || 3.0;
        const theoGlobal = (initialNaftol / 144.17) * 259.34;
        updatedDraft.step2.yieldAccumulated = theoGlobal > 0 ? parseFloat(((experimentalMass / theoGlobal) * 100).toFixed(1)) : 0;
      } else if (selectedPresetId === 'hantzsch_dhpp' || selectedPresetId === 'hantzsch_nifedipina') {
        const isNif = selectedPresetId === 'hantzsch_nifedipina';
        updatedDraft.step3.compoundType = isNif ? 'Nifedipina' : 'DHPP';
        updatedDraft.step3.massProduct = experimentalMass;
        updatedDraft.step3.yieldPercentage = parseFloat(calculationData.yieldPercent.toFixed(1));
        if (observedMp) updatedDraft.step3.meltingPointObserved = observedMp;
        updatedDraft.step3.meltingPointReference = isNif ? '172 - 174 °C' : '194 - 196 °C';
      }

      if (studentName && !updatedDraft.student1.nombre) {
        updatedDraft.student1.nombre = studentName;
      }
      if (studentGroup) {
        updatedDraft.grupo = studentGroup;
      }

      localStorage.setItem('qfdos_pair_report_draft', JSON.stringify(updatedDraft));
    } catch (err) {
      console.error('Error sincronizando con el borrador del cuaderno', err);
    }

    alert('✓ Registro guardado y sincronizado en el «Apartado 7: Cuaderno de Parejas» listo para la entrega.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header & Reaction Selection */}
      <div className="qfdos-card" style={{ padding: '1.5rem', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <span className="qfdos-badge badge-teal" style={{ marginBottom: '0.4rem' }}>
              <Calculator size={12} /> ESTEQUIOMETRÍA Y RENDIMIENTO EN TIEMPO REAL
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-title)', margin: '0.2rem 0' }}>
              Calculadora de Reactivos y Rendimientos de Laboratorio
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
              Calcula moles, reactivo limitante, masa teórica esperada y porcentaje de rendimiento de tus prácticas.
            </p>
          </div>

          {/* Reaction Selector */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {PRESET_REACTIONS.map(preset => (
              <button
                key={preset.id}
                onClick={() => handlePresetChange(preset.id)}
                className={`btn btn-sm ${selectedPresetId === preset.id ? 'btn-navy' : 'btn-outline'}`}
                style={{ fontWeight: selectedPresetId === preset.id ? 700 : 500, fontSize: '0.78rem' }}
              >
                {/* Se muestra lo que hay TRAS los dos puntos cuando existe: los dos
                    presets de Hantzsch comparten prefijo y sólo se distinguen por
                    el producto, así que cortar por el prefijo los volvía idénticos. */}
                {preset.name.includes(':')
                  ? preset.name.slice(preset.name.indexOf(':') + 1).trim()
                  : preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Reaction Scheme & 2D Chemical Structures Display */}
        <div style={{
          background: 'var(--surface-alt)',
          borderRadius: '12px',
          padding: '1.25rem',
          border: '1px solid var(--border-color)',
          borderLeft: '4px solid var(--teal)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Esquema Químico de la Reacción
              </div>
              <div style={{ fontWeight: 800, color: 'var(--text-title)', fontSize: '1.05rem', marginTop: 2 }}>
                {currentPreset.subtitle}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="qfdos-badge badge-mint" style={{ fontSize: '0.72rem' }}>
                Producto: {currentPreset.product.name} (PM = {currentPreset.product.mw} g/mol)
              </span>
            </div>
          </div>

          {/* Molecular 2D Structures Flow: Reactants -> Product */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '1rem 0.5rem',
            background: 'var(--surface)',
            borderRadius: '10px',
            border: '1px solid var(--border-color)'
          }}>
            {/* Reactants List */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              {currentPreset.reactants.map((r, idx) => (
                <React.Fragment key={r.reagent.id}>
                  {idx > 0 && (
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--teal-ink)', padding: '0 4px' }}>
                      +
                    </span>
                  )}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'var(--surface-alt)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    textAlign: 'center',
                    minWidth: 140
                  }}>
                    {r.reagent.smiles && (
                      <Chem2DDrawer
                        smiles={r.reagent.smiles}
                        width={130}
                        height={100}
                        bare={true}
                      />
                    )}
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-title)', marginTop: 4 }}>
                      {r.stoichiometry > 1 ? `${r.stoichiometry} × ` : ''}{r.reagent.name}
                    </span>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      PM: {r.reagent.mw} g/mol
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Reaction Arrow */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 8px' }}>
              <ArrowRight size={24} color="var(--teal-ink)" style={{ strokeWidth: 2.5 }} />
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Reacción
              </span>
            </div>

            {/* Target Product */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'rgba(45, 212, 191, 0.08)',
              border: '1.5px solid var(--teal)',
              borderRadius: '8px',
              padding: '8px 12px',
              textAlign: 'center',
              minWidth: 150,
              boxShadow: '0 4px 12px rgba(13, 148, 136, 0.12)'
            }}>
              {currentPreset.product.smiles && (
                <Chem2DDrawer
                  smiles={currentPreset.product.smiles}
                  width={140}
                  height={100}
                  bare={true}
                />
              )}
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--navy-ink)', marginTop: 4 }}>
                {currentPreset.product.name}
              </span>
              <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--teal-ink)', fontWeight: 700 }}>
                PM: {currentPreset.product.mw} g/mol
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Work Area */}
      <div className="grid-2-cols" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '1.5rem' }}>
        
        {/* Left Column: Reactants Input & Dynamic Moles Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="qfdos-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scale size={16} color="var(--navy-ink)" />
                <h4 style={{ margin: 0, fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-title)' }}>
                  1. Cantidades Puestas en el Laboratorio
                </h4>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Modifica los valores si pesaste una cantidad diferente
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {currentPreset.reactants.map((r, idx) => {
                const vals = reactantValues[r.reagent.id] || {
                  isVolume: r.defaultIsVolume,
                  amount: r.defaultAmount,
                  density: r.density || 1.0,
                  purity: r.purity
                };
                const calcItem = calculationData.items[idx];
                const isLimiting = calculationData.limitingIdx === idx;

                return (
                  <div
                    key={r.reagent.id}
                    style={{
                      background: isLimiting ? 'rgba(239, 68, 68, 0.04)' : 'var(--surface-muted)',
                      border: isLimiting ? '1.5px solid #f87171' : '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          background: 'var(--navy)',
                          color: '#fff',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {idx + 1}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-title)' }}>
                          {r.reagent.name}
                        </span>
                        <span className="font-tech" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          (PM: {r.reagent.mw} g/mol · Coef: {r.stoichiometry})
                        </span>
                      </div>

                      {isLimiting && (
                        <span className="qfdos-badge" style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', fontSize: '0.68rem', fontWeight: 800 }}>
                          ★ REACTIVO LIMITANTE
                        </span>
                      )}
                    </div>

                    {/* Inputs Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                      
                      {/* Amount Input */}
                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                          {vals.isVolume ? 'Volumen medido (mL)' : 'Masa pesada (g)'}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={vals.amount}
                          onChange={e => handleValueChange(r.reagent.id, 'amount', parseFloat(e.target.value) || 0)}
                          className="form-input"
                          style={{ width: '100%', fontSize: '0.85rem', padding: '6px 10px', fontFamily: 'Roboto Mono, monospace' }}
                        />
                      </div>

                      {/* Density (if liquid) */}
                      {vals.isVolume && (
                        <div>
                          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                            Densidad (d, g/mL)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={vals.density}
                            onChange={e => handleValueChange(r.reagent.id, 'density', parseFloat(e.target.value) || 1)}
                            className="form-input"
                            style={{ width: '100%', fontSize: '0.85rem', padding: '6px 10px', fontFamily: 'Roboto Mono, monospace' }}
                          />
                        </div>
                      )}

                      {/* Purity (%) */}
                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                          Pureza (%)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={vals.purity}
                          onChange={e => handleValueChange(r.reagent.id, 'purity', parseFloat(e.target.value) || 100)}
                          className="form-input"
                          style={{ width: '100%', fontSize: '0.85rem', padding: '6px 10px', fontFamily: 'Roboto Mono, monospace' }}
                        />
                      </div>

                    </div>

                    {/* Calculated Moles Output Banner */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'rgba(255,255,255,0.7)',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '0.76rem'
                    }}>
                      <span style={{ color: 'var(--text-muted)' }}>Masa pura = <strong>{calcItem?.pureMass.toFixed(3)} g</strong></span>
                      <span className="font-tech" style={{ color: isLimiting ? '#b91c1c' : 'var(--teal)', fontWeight: 700 }}>
                        {calcItem?.mmoles.toFixed(2)} mmol (n/coef = {calcItem?.normalizedRatio.toFixed(4)})
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Step-by-Step Stoichiometric Analysis */}
          <div className="qfdos-card" style={{ padding: '1.25rem' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-title)' }}>
              2. Deducción del Reactivo Limitante y Masa Teórica
            </h4>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '6px', lineHeight: 1.5 }}>
              <div>
                1. <strong>Comparación de moles normalizados:</strong> Se divide la cantidad de moles puros de cada reactivo entre su coeficiente estequiométrico.
              </div>
              <div style={{ padding: '8px 12px', background: 'var(--surface-muted)', borderRadius: '6px', fontFamily: 'Roboto Mono, monospace', fontSize: '0.76rem' }}>
                {calculationData.items.map((item, i) => (
                  <div key={i} style={{ color: calculationData.limitingIdx === i ? '#b91c1c' : 'var(--text-main)', fontWeight: calculationData.limitingIdx === i ? 700 : 400 }}>
                    • {item.reagent.name}: {item.mmoles.toFixed(2)} mmol / {item.stoichiometry} = {item.normalizedRatio.toFixed(4)} {calculationData.limitingIdx === i ? '← MENOR VALOR (LIMITANTE)' : ''}
                  </div>
                ))}
              </div>
              <div>
                2. <strong>Moles teóricos de producto:</strong> {calculationData.limitingItem?.reagent.name} (limitante con {calculationData.limitingItem?.normalizedRatio.toFixed(4)} mol eq.) rinde un máximo de <strong>{(calculationData.theoreticalProductMoles * 1000).toFixed(2)} mmol</strong> de {currentPreset.product.name}.
              </div>
              <div style={{ padding: '8px 12px', background: 'rgba(30,58,138,0.06)', borderRadius: '6px', borderLeft: '3px solid var(--navy)', fontWeight: 700, color: 'var(--navy-ink)' }}>
                Masa Teórica Máxima = {(calculationData.theoreticalProductMoles * 1000).toFixed(2)} mmol × {currentPreset.product.mw} g/mol = {calculationData.theoreticalProductMassG.toFixed(3)} g
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Actual Yield & Student Notebook Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Yield Calculation Card */}
          <div className="qfdos-card" style={{ padding: '1.5rem', borderTop: '4px solid var(--teal)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <Sparkles size={18} color="var(--teal-ink)" />
              <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-title)' }}>
                3. Cálculo del Rendimiento Real Obtenido
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-title)', display: 'block', marginBottom: '4px' }}>
                  Masa de Producto Seco Obtenida en Laboratorio (g):
                </label>
                <input
                  type="number"
                  step="0.001"
                  placeholder="Ej: 3.850"
                  value={experimentalMass || ''}
                  onChange={e => setExperimentalMass(parseFloat(e.target.value) || 0)}
                  className="form-input"
                  style={{ width: '100%', fontSize: '1.1rem', fontWeight: 700, padding: '8px 12px', fontFamily: 'Roboto Mono, monospace', color: 'var(--navy-ink)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Punto de Fusión Observado (°C) (opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ej: 95 - 96 °C"
                  value={observedMp}
                  onChange={e => setObservedMp(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', fontSize: '0.85rem', padding: '6px 10px' }}
                />
              </div>

              {/* Yield Gauge / Visual Metric */}
              <div style={{
                background: 'var(--surface-muted)',
                borderRadius: '12px',
                padding: '1.25rem',
                textAlign: 'center',
                border: '1px solid var(--border-color)',
                marginTop: '0.5rem'
              }}>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Rendimiento Porcentual Calculado
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  fontFamily: 'Montserrat, sans-serif',
                  color: calculationData.yieldPercent > 100 ? '#ef4444' : calculationData.yieldPercent >= 70 ? '#10b981' : calculationData.yieldPercent >= 40 ? 'var(--teal)' : 'var(--navy)',
                  margin: '0.2rem 0'
                }}>
                  {calculationData.yieldPercent.toFixed(1)} %
                </div>

                {/* Progress bar */}
                <div style={{ width: '100%', background: 'rgba(0,0,0,0.06)', borderRadius: '999px', height: '10px', overflow: 'hidden', margin: '0.5rem 0' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, Math.max(0, calculationData.yieldPercent))}%`,
                      background: calculationData.yieldPercent > 100 ? '#ef4444' : 'linear-gradient(90deg, var(--teal) 0%, var(--mint) 100%)',
                      borderRadius: '999px',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>

                {/* Feedback Evaluation */}
                <div style={{ fontSize: '0.78rem', marginTop: '0.5rem', color: 'var(--text-main)' }}>
                  {calculationData.yieldPercent <= 0 && (
                    <span style={{ color: 'var(--text-muted)' }}>Introduce la masa pesada para ver tu evaluación.</span>
                  )}
                  {calculationData.yieldPercent > 0 && calculationData.yieldPercent < 40 && (
                    <span style={{ color: '#d97706', fontWeight: 600 }}>Rendimiento bajo: Revisa posibles pérdidas en extracciones o lavados.</span>
                  )}
                  {calculationData.yieldPercent >= 40 && calculationData.yieldPercent <= 80 && (
                    <span style={{ color: '#0d9488', fontWeight: 600 }}>✓ Rendimiento óptimo típico de prácticas de laboratorio farmacéutico.</span>
                  )}
                  {calculationData.yieldPercent > 80 && calculationData.yieldPercent <= 100 && (
                    <span style={{ color: '#059669', fontWeight: 700 }}>★ ¡Excelente rendimiento de síntesis y aislamiento!</span>
                  )}
                  {calculationData.yieldPercent > 100 && (
                    <span style={{ color: '#dc2626', fontWeight: 700 }}>⚠ Rendimiento &gt; 100%: El producto contiene humedad/disolvente o sales residuales. ¡Secar más al rotavapor!</span>
                  )}
                </div>
              </div>

              {/* Student Metadata & Save Button */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Nombre Alumno/a"
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '0.78rem', padding: '6px 8px' }}
                />
                <input
                  type="text"
                  placeholder="Grupo / Puesto"
                  value={studentGroup}
                  onChange={e => setStudentGroup(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '0.78rem', padding: '6px 8px' }}
                />
              </div>

              <button
                onClick={handleSaveToNotebook}
                className="btn btn-navy"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 700 }}
              >
                <Save size={15} /> Guardar en Cuaderno de Prácticas
              </button>

            </div>
          </div>

          {/* Saved Notebook Records */}
          <div className="qfdos-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-title)' }}>
                Mis Resultados Guardados ({savedRecords.length})
              </h4>
              {savedRecords.length > 0 && (
                <button
                  onClick={() => {
                    localStorage.removeItem('qfdos_lab_yield_records');
                    setSavedRecords([]);
                  }}
                  className="btn btn-xs btn-ghost"
                  style={{ color: '#ef4444', fontSize: '0.7rem' }}
                >
                  Borrar historial
                </button>
              )}
            </div>

            {savedRecords.length === 0 ? (
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                Aún no has guardado ningún resultado de pesada.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                {savedRecords.map(rec => (
                  <div
                    key={rec.id}
                    style={{
                      background: 'var(--surface-muted)',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      fontSize: '0.74rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-title)' }}>{rec.productName}</div>
                      <div style={{ color: 'var(--text-muted)' }}>{rec.date} · {rec.studentName} ({rec.studentGroup})</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="font-tech" style={{ fontWeight: 700, color: 'var(--teal-ink)' }}>{rec.yieldPercent}%</div>
                      <div style={{ color: 'var(--text-muted)' }}>{rec.experimentalMass} g / {rec.theoreticalMass} g</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
