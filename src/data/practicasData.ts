import { recurso } from '../services/rutas';
// ==========================================================================
// Prácticas de Química Farmacéutica II — Base de Datos Central del Laboratorio
// Universidad de Granada (UGR) · Grado en Farmacia
// ==========================================================================

export interface Reactivo {
  id: string;
  nombre: string;
  smiles: string;
  formula: string;
  pm: number;
  densidad?: number;
  puntoEbullicion?: number;
  puntoFusion?: number;
  cas?: string;
  pubchemCid?: number;
  peligros?: string[];
  papel: 'reactivo' | 'producto' | 'intermedio' | 'disolvente' | 'base' | 'acido';
}

export const REACTIVOS = {
  alfaNaftol: {
    id: 'alfaNaftol',
    nombre: 'α-Naftol',
    smiles: 'Oc1cccc2ccccc12',
    formula: 'C₁₀H₈O',
    pm: 144.17,
    puntoFusion: 96,
    cas: '90-15-3',
    pubchemCid: 7005,
    peligros: ['Irritante'],
    papel: 'reactivo'
  },
  epiclorhidrina: {
    id: 'epiclorhidrina',
    nombre: 'Epiclorhidrina',
    smiles: 'ClCC1CO1',
    formula: 'C₃H₅ClO',
    pm: 92.52,
    densidad: 1.183,
    puntoEbullicion: 118,
    cas: '106-89-8',
    pubchemCid: 7835,
    peligros: ['Tóxica', 'Cancerígena', 'Manipular siempre en vitrina'],
    papel: 'reactivo'
  },
  naftoximetiloxirano: {
    id: 'naftoximetiloxirano',
    nombre: '2-(1-Naftil)oximetiloxirano',
    smiles: 'C1OC1COc1cccc2ccccc12',
    formula: 'C₁₃H₁₂O₂',
    pm: 200.24,
    cas: '2461-42-9',
    pubchemCid: 7606,
    papel: 'intermedio'
  },
  isopropilamina: {
    id: 'isopropilamina',
    nombre: 'Isopropilamina',
    smiles: 'CC(C)N',
    formula: 'C₃H₉N',
    pm: 59.11,
    densidad: 0.688,
    puntoEbullicion: 33,
    cas: '75-31-0',
    pubchemCid: 6363,
    peligros: ['Extraordinariamente inflamable', 'Irritante'],
    papel: 'reactivo'
  },
  propranolol: {
    id: 'propranolol',
    nombre: 'Propranolol',
    smiles: 'CC(C)NCC(O)COc1cccc2ccccc12',
    formula: 'C₁₆H₂₁NO₂',
    pm: 259.34,
    puntoFusion: 96,
    cas: '525-66-6',
    pubchemCid: 4946,
    papel: 'producto'
  },
  benzaldehido: {
    id: 'benzaldehido',
    nombre: 'Benzaldehído',
    smiles: 'O=Cc1ccccc1',
    formula: 'C₇H₆O',
    pm: 106.12,
    densidad: 1.045,
    puntoEbullicion: 179,
    cas: '100-52-7',
    pubchemCid: 240,
    peligros: ['Irrita ojos, piel y vías respiratorias'],
    papel: 'reactivo'
  },
  acetoacetatoMetilo: {
    id: 'acetoacetatoMetilo',
    nombre: 'Acetoacetato de metilo',
    smiles: 'COC(=O)CC(C)=O',
    formula: 'C₅H₈O₃',
    pm: 116.12,
    densidad: 1.076,
    puntoEbullicion: 170,
    cas: '105-45-3',
    pubchemCid: 7755,
    peligros: ['Combustible', 'Irrita ojos'],
    papel: 'reactivo'
  },
  amoniaco: {
    id: 'amoniaco',
    nombre: 'Amoníaco (solución acuosa concentrada)',
    smiles: 'N',
    formula: 'NH₃',
    pm: 17.03,
    densidad: 0.9,
    cas: '1336-21-6',
    pubchemCid: 222,
    peligros: ['Corrosivo', 'Tóxico por inhalación', 'Manipular en vitrina'],
    papel: 'reactivo'
  },
  dhpp: {
    id: 'dhpp',
    nombre: '2,6-Dimetil-4-fenil-1,4-dihidropiridina-3,5-dicarboxilato de dimetilo (DHPP)',
    smiles: 'COC(=O)C1=C(C)NC(C)=C(C1c2ccccc2)C(=O)OC',
    formula: 'C₁₇H₁₉NO₄',
    pm: 301.34,
    puntoFusion: 196,
    cas: '10338-72-4',
    pubchemCid: 98254,
    papel: 'producto'
  },
  nitrobenzaldehido: {
    id: 'nitrobenzaldehido',
    nombre: '2-Nitrobenzaldehído',
    smiles: 'O=Cc1ccccc1[N+](=O)[O-]',
    formula: 'C₇H₅NO₃',
    pm: 151.12,
    puntoFusion: 44,
    cas: '552-89-6',
    pubchemCid: 11105,
    peligros: ['Irritante', 'Nocivo por ingestión'],
    papel: 'reactivo'
  },
  nifedipino: {
    id: 'nifedipino',
    nombre: 'Nifedipino',
    smiles: 'COC(=O)C1=C(C)NC(C)=C(C1c2ccccc2[N+](=O)[O-])C(=O)OC',
    formula: 'C₁₇H₁₈N₂O₆',
    pm: 346.33,
    puntoFusion: 174,
    cas: '21829-25-4',
    pubchemCid: 4485,
    peligros: ['Fotosensible — proteger de la luz'],
    papel: 'producto'
  }
} satisfies Record<string, Reactivo>;

// ==========================================================================
// Tipos para Calculadoras y Reactivos
// ==========================================================================

export interface LabReagent {
  id: string;
  name: string;
  smiles: string;
  formula: string;
  mw: number;
  density?: number;
  purityDefault?: number;
  role?: string;
  dangerWarnings?: string[];
  safetyAlert?: string;
  pictograms?: string[];
  cas?: string;
}

export interface LabProduct {
  id: string;
  name: string;
  smiles: string;
  formula: string;
  mw: number;
  mpRange?: string;
  meltingPoint?: string;
  aspect?: string;
  appearance?: string;
  rfReference?: string;
}

export const LAB_REAGENTS = {
  alfa_naftol: {
    id: 'alfa_naftol',
    name: '1-Naftol (α-Naftol)',
    smiles: 'Oc1cccc2ccccc12',
    formula: 'C10H8O',
    mw: 144.17,
    purityDefault: 99.0,
    role: 'Reactivo de partida nucleofílico',
    dangerWarnings: ['Nocivo por ingestión', 'Irrita piel y ojos'],
    safetyAlert: 'Manipular con guantes y espátula limpia. Evitar contacto con piel.',
    pictograms: ['GHS07'],
    cas: '90-15-3'
  },
  epiclorhidrina: {
    id: 'epiclorhidrina',
    name: 'Epiclorhidrina',
    smiles: 'ClCC1CO1',
    formula: 'C3H5ClO',
    mw: 92.52,
    density: 1.18,
    purityDefault: 99.0,
    role: 'Agente alquilante epoxídico',
    dangerWarnings: ['Tóxica y carcinógena', 'Usar siempre en vitrina'],
    safetyAlert: 'Tóxica y cancerígena: pipetear SIEMPRE en vitrina con propipeta.',
    pictograms: ['GHS06', 'GHS08', 'GHS02'],
    cas: '106-89-8'
  },
  isopropilamina: {
    id: 'isopropilamina',
    name: 'Isopropilamina',
    smiles: 'CC(C)N',
    formula: 'C3H9N',
    mw: 59.11,
    density: 0.69,
    purityDefault: 99.5,
    role: 'Amina nucleofílica (apertura oxirano)',
    dangerWarnings: ['Muy inflamable (P.Eb. 33 °C)', 'Vapores irritantes'],
    safetyAlert: 'P.Eb. 33 °C: líquido sumamente volátil e inflamable. Mantener alejado de fuentes de calor.',
    pictograms: ['GHS02', 'GHS07'],
    cas: '75-31-0'
  },
  oxirano_intermedio: {
    id: 'oxirano_intermedio',
    name: '2-(1-Naftil)oximetiloxirano',
    smiles: 'C1OC1COc1cccc2ccccc12',
    formula: 'C13H12O2',
    mw: 200.24,
    purityDefault: 95.0,
    role: 'Intermedio epoxídico aislado',
    dangerWarnings: ['Irritante ocular'],
    cas: '2461-42-9'
  },
  benzaldehido: {
    id: 'benzaldehido',
    name: 'Benzaldehído',
    smiles: 'O=Cc1ccccc1',
    formula: 'C7H6O',
    mw: 106.12,
    density: 1.04,
    purityDefault: 99.0,
    role: 'Aldehído aromático para Hantzsch',
    dangerWarnings: ['Nocivo por ingestión', 'Sensible al aire'],
    safetyAlert: 'Sensible a la oxidación ambiental a ácido benzoico.',
    pictograms: ['GHS07'],
    cas: '100-52-7'
  },
  metil_acetoacetato: {
    id: 'metil_acetoacetato',
    name: 'Acetoacetato de metilo',
    smiles: 'COC(=O)CC(C)=O',
    formula: 'C5H8O3',
    mw: 116.12,
    density: 1.08,
    purityDefault: 99.0,
    role: 'β-cetoéster dicarbonílico (2 eq)',
    dangerWarnings: ['Líquido combustible', 'Irritante'],
    safetyAlert: 'Irritante ocular y dérmico.',
    pictograms: ['GHS07'],
    cas: '105-45-3'
  },
  amoniaco_conc: {
    id: 'amoniaco_conc',
    name: 'Amoníaco acuoso concentrado (28-30%)',
    smiles: 'N',
    formula: 'NH3',
    mw: 17.03,
    density: 0.90,
    purityDefault: 28.0,
    role: 'Donador de nitrógeno para dihidropiridina',
    dangerWarnings: ['Corrosivo', 'Desprende gas amoníaco'],
    safetyAlert: 'Desprende gas NH3 muy irritante. Pipetear en vitrina.',
    pictograms: ['GHS05', 'GHS07'],
    cas: '1336-21-6'
  },
  nitro_benzaldehido_2: {
    id: 'nitro_benzaldehido_2',
    name: '2-Nitrobenzaldehído',
    smiles: 'O=Cc1ccccc1[N+](=O)[O-]',
    formula: 'C7H5NO3',
    mw: 151.12,
    purityDefault: 98.0,
    role: 'Aldehído orto-nitro para Nifedipina',
    dangerWarnings: ['Irritante', 'Sensible a luz'],
    safetyAlert: 'Fotosensible: proteger los matraces de la luz directa.',
    pictograms: ['GHS07'],
    cas: '552-89-6'
  },
  naoh_solido: {
    id: 'naoh_solido',
    name: 'Hidróxido de sodio (NaOH)',
    smiles: '[OH-].[Na+]',
    formula: 'NaOH',
    mw: 40.00,
    purityDefault: 98.0,
    role: 'Base inorgánica (desprotonación y neutralización)',
    dangerWarnings: ['Corrosivo severo en piel y ojos'],
    safetyAlert: 'Disolución muy exotérmica. Añadir las lentejas sobre agua, nunca a la inversa.',
    pictograms: ['GHS05'],
    cas: '1310-73-2'
  }
} satisfies Record<string, LabReagent>;

export const LAB_PRODUCTS = {
  oxirano_step1: {
    id: 'oxirano_step1',
    name: '2-(1-Naftil)oximetiloxirano (I)',
    smiles: 'C1OC1COc1cccc2ccccc12',
    formula: 'C13H12O2',
    mw: 200.24,
    aspect: 'Aceite ámbar límpido o cristales de bajo punto de fusión',
    appearance: 'Aceite ámbar límpido o cristales de bajo punto de fusión',
    rfReference: 'Rf ≈ 0.65 (Hexano/AcOEt 4:1)'
  },
  propranolol_base: {
    id: 'propranolol_base',
    name: 'Propranolol base libre (II)',
    smiles: 'CC(C)NCC(O)COc1cccc2ccccc12',
    formula: 'C16H21NO2',
    mw: 259.34,
    mpRange: '94 - 96 °C',
    meltingPoint: '94 - 96 °C',
    aspect: 'Sólido cristalino blanco brillante (agujas)',
    appearance: 'Sólido cristalino blanco brillante (agujas)',
    rfReference: 'Rf ≈ 0.42 (DCM/MeOH 9:1)'
  },
  dhpp: {
    id: 'dhpp',
    name: '2,6-Dimetil-4-fenil-1,4-dihidropiridina-3,5-dicarboxilato de dimetilo (DHPP)',
    smiles: 'COC(=O)C1=C(C)NC(C)=C(C1c2ccccc2)C(=O)OC',
    formula: 'C17H19NO4',
    mw: 301.34,
    mpRange: '194 - 196 °C',
    meltingPoint: '194 - 196 °C',
    aspect: 'Agujas prismáticas amarillo pálido',
    appearance: 'Agujas prismáticas amarillo pálido',
    rfReference: 'Rf ≈ 0.50 (DCM/AcOEt 9:1)'
  },
  nifedipina: {
    id: 'nifedipina',
    name: 'Nifedipina',
    smiles: 'COC(=O)C1=C(C)NC(C)=C(C1c2ccccc2[N+](=O)[O-])C(=O)OC',
    formula: 'C17H18N2O6',
    mw: 346.33,
    mpRange: '172 - 174 °C',
    meltingPoint: '172 - 174 °C',
    aspect: 'Cristales amarillo intenso fotosensibles',
    appearance: 'Cristales amarillo intenso fotosensibles'
  }
} satisfies Record<string, LabProduct>;

// ==========================================================================
// Protocolos y Pasos Experimentales
// ==========================================================================

export interface LabReactionStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  reactionName: string;
  summary: string;
  dayAssigned: string;
  reactionSchemeImg: string;
  schemeFullUrl: string;
  schemeCleanUrl: string;
  smilesEquation: string;
  description: string;
  timing: string;
  product: LabProduct;
  reactants: {
    reagent: LabReagent;
    amount: string;
    amountPrescribed?: string;
    stoichiometry: number;
    roleNotes?: string;
    role?: string;
  }[];
  procedureSteps: string[];
  equipmentNeeded: string[];
  safetyNotes: string[];
  tipsAndTricks: string[];
}

export const LAB_REACTION_STEPS: LabReactionStep[] = [
  {
    stepNumber: 1,
    title: 'Paso 1: Síntesis de 2-(1-Naftil)oximetiloxirano',
    subtitle: 'Reacción de 1-Naftol con Epiclorhidrina',
    reactionName: 'Alquilación de α-Naftol con Epiclorhidrina',
    summary: 'Formación del intermedio oxirano mediante sustitución nucleofílica bimolecular (SN2) y posterior cierre intramolecular en medio acuoso alcalino.',
    dayAssigned: 'Día 1 (Lunes)',
    reactionSchemeImg: recurso('/practicas/schemes/reaccion_1_naftoximetiloxirano_clean.png'),
    schemeFullUrl: recurso('/practicas/schemes/esquema_1_naftoximetiloxirano_completo.png'),
    schemeCleanUrl: recurso('/practicas/schemes/reaccion_1_naftoximetiloxirano_clean.png'),
    smilesEquation: 'Oc1cccc2ccccc12 + ClCC1CO1 >> C1OC1COc1cccc2ccccc12',
    description: 'Reacción de sustitución nucleofílica bimolecular (SN2) con posterior cierre intramolecular del anillo oxirano en medio acuoso alcalino.',
    timing: 'Día 1 (Lunes) - 2 horas a reflujo',
    product: LAB_PRODUCTS.oxirano_step1,
    reactants: [
      { reagent: LAB_REAGENTS.alfa_naftol, amount: '3,00 g (20,8 mmol)', stoichiometry: 1, roleNotes: 'Reactivo nucleofílico de partida', amountPrescribed: '3,00 g (20,8 mmol)', role: 'Reactivo nucleofílico de partida' },
      { reagent: LAB_REAGENTS.epiclorhidrina, amount: '2,70 mL (34,4 mmol, d=1,18 g/mL)', stoichiometry: 1.65, roleNotes: 'Electrófilo y exceso para favorecer monoalquilación', amountPrescribed: '2,70 mL (34,4 mmol, d=1,18 g/mL)', role: 'Electrófilo y exceso' },
      { reagent: LAB_REAGENTS.naoh_solido, amount: '1,20 g en 25 mL H2O', stoichiometry: 1.44, roleNotes: 'Base desprotonante del 1-naftol', amountPrescribed: '1,20 g en 25 mL H2O', role: 'Base desprotonante' }
    ],
    procedureSteps: [
      'En un matraz esférico de 100 mL se disuelven 1,20 g de NaOH en 25 mL de agua destilada.',
      'Se añade el imán de agitación y se incorporan 3,00 g de α-Naftol, observándose la formación de la sal de naftolato sódico.',
      'Bajo agitación constante se adicionan lentamente 2,70 mL de epiclorhidrina.',
      'Se acopla el refrigerante de bolas y se calienta a ebullición suave (reflujo) durante 2 horas sobre el Lab-jack.',
      'Transcurrido el tiempo, se retira la placa calefactora bajando el Lab-jack y se deja enfriar a temperatura ambiente.'
    ],
    equipmentNeeded: [
      'Matraz esférico de fondo redondo de 100 mL',
      'Refrigerante de reflujo con circuito de agua',
      'Placa calefactora con agitación magnética',
      'Soporte elevador (Lab-jack) de seguridad',
      'Embudo de adición y probetas'
    ],
    safetyNotes: [
      'La epiclorhidrina es un compuesto volátil, tóxico y carcinógeno. Debe medirse y manejarse estrictamente bajo campana de extracción de gases.'
    ],
    tipsAndTricks: [
      'Comprobar siempre que el circuito de refrigeración tiene entrada de agua por la oliva inferior y salida por la superior sin fugas.'
    ]
  },
  {
    stepNumber: 2,
    title: 'Paso 2: Aislamiento y Reacción con Isopropilamina (Propranolol Base)',
    subtitle: 'Apertura Regioselectiva de Oxirano y Purificación Ácido-Base',
    reactionName: 'Apertura Regioselectiva de Oxirano por Isopropilamina',
    summary: 'Apertura nucleofílica del epóxido por ataque de isopropilamina en el carbono menos sustituido, seguido de purificación selectiva por extracción ácido-base.',
    dayAssigned: 'Días 2 y 3 (Martes/Miércoles)',
    reactionSchemeImg: recurso('/practicas/schemes/reaccion_2_propranolol_clean.png'),
    schemeFullUrl: recurso('/practicas/schemes/esquema_2_propranolol_completo.png'),
    schemeCleanUrl: recurso('/practicas/schemes/reaccion_2_propranolol_clean.png'),
    smilesEquation: 'C1OC1COc1cccc2ccccc12 + CC(C)N >> CC(C)NCC(O)COc1cccc2ccccc12',
    description: 'Apertura nucleofílica regioselectiva del epóxido por el carbono menos impedido por ataque de la isopropilamina, generando la ariloxipropanolamina.',
    timing: 'Días 2 y 3 (Martes/Miércoles)',
    product: LAB_PRODUCTS.propranolol_base,
    reactants: [
      { reagent: LAB_REAGENTS.oxirano_intermedio, amount: 'Totales del Paso 1 (~3,6 g)', stoichiometry: 1, roleNotes: 'Sustrato epoxídico intermedio', amountPrescribed: 'Totales del Paso 1 (~3,6 g)', role: 'Sustrato epoxídico' },
      { reagent: LAB_REAGENTS.isopropilamina, amount: '6,00 mL (69,8 mmol, d=0,69 g/mL)', stoichiometry: 3.8, roleNotes: 'Amina nucleofílica y reactivo en exceso', amountPrescribed: '6,00 mL (69,8 mmol, d=0,69 g/mL)', role: 'Nucleófilo y reactivo en exceso' }
    ],
    procedureSteps: [
      'La mezcla del Paso 1 se transfiere al embudo de decantación y se extrae con 3 porciones de 15 mL de diclorometano (DCM).',
      'Se reúnen las fases orgánicas inferiores (DCM, d=1,33 g/mL) y se secan sobre sulfato de sodio anhidro durante 15 minutos.',
      'Se filtra la fase orgánica por gravedad y se evapora el disolvente en el rotavapor a presión reducida.',
      'Al residuo aceitoso de oxirano se le añaden 6,0 mL de isopropilamina y se calienta a reflujo suave (35-40 °C) durante 1 hora.',
      'Se evapora el exceso de isopropilamina, se disuelve en 20 mL de DCM y se extrae con HCl 2 N (el propranolol se protona y pasa al agua).',
      'Se separa la fase acuosa ácida, se enfría en baño de hielo y se basifica con NaOH 5 N hasta pH > 10, precipitando el Propranolol base en forma de agujas blancas.',
      'Se filtra por Büchner a vacío, se lava con agua fría y se seca al vacío.'
    ],
    equipmentNeeded: [
      'Embudo de decantación de 250 mL con tapón de teflón',
      'Matraz Erlenmeyer de 100 mL',
      'Rotavapor Buchi con baño a 40 °C',
      'Bomba de vacío',
      'Embudo cónico con papel de filtro plegado'
    ],
    safetyNotes: [
      'La isopropilamina tiene un punto de ebullición muy bajo (33 °C) y es sumamente inflamable.',
      'El diclorometano es un disolvente clorado pesado. Ventilar frecuentemente el embudo de decantación para liberar presión de vapor.'
    ],
    tipsAndTricks: [
      'En la extracción, la fase clorada de DCM queda ABAJO por su mayor densidad (1,33 g/mL frente a 1,00 g/mL del agua).'
    ]
  },
  {
    stepNumber: 3,
    title: 'Paso 3: Síntesis de 1,4-Dihidropiridinas (DHPP / Nifedipina)',
    subtitle: 'Síntesis Multicomponente de Hantzsch',
    reactionName: 'Reacción Multicomponente de Hantzsch',
    summary: 'Condensación multicomponente en un solo recipiente (one-pot) entre 1 eq de aldehído, 2 eq de acetoacetato de metilo y amoníaco concentrado.',
    dayAssigned: 'Días 3 y 4 (Miércoles/Jueves)',
    reactionSchemeImg: recurso('/practicas/schemes/reaccion_3_hantzsch_dhpp_clean.png'),
    schemeFullUrl: recurso('/practicas/schemes/esquema_3_hantzsch_dhpp_completo.png'),
    schemeCleanUrl: recurso('/practicas/schemes/reaccion_3_hantzsch_dhpp_clean.png'),
    smilesEquation: 'O=Cc1ccccc1 + 2 COC(=O)CC(C)=O + N >> COC(=O)C1=C(C)NC(C)=C(C1c2ccccc2)C(=O)OC',
    description: 'Condensación multicomponente en un solo paso (one-pot) entre 1 equivalente de aldehído aromático, 2 equivalentes de β-cetoéster y amoníaco.',
    timing: 'Días 3 y 4 (Miércoles/Jueves) - 2 horas a reflujo',
    product: LAB_PRODUCTS.dhpp,
    reactants: [
      { reagent: LAB_REAGENTS.benzaldehido, amount: '2,55 mL (25,0 mmol, d=1,04 g/mL)', stoichiometry: 1, roleNotes: 'Aldehído aromático sustrato', amountPrescribed: '2,55 mL (25,0 mmol, d=1,04 g/mL)', role: 'Aldehído aromático' },
      { reagent: LAB_REAGENTS.metil_acetoacetato, amount: '5,40 mL (50,0 mmol, d=1,08 g/mL)', stoichiometry: 2, roleNotes: 'β-cetoéster (2 equivalentes estequiométricos)', amountPrescribed: '5,40 mL (50,0 mmol, d=1,08 g/mL)', role: 'β-cetoéster (2 eq)' },
      { reagent: LAB_REAGENTS.amoniaco_conc, amount: '4,50 mL', stoichiometry: 2.5, roleNotes: 'Donador de nitrógeno y medio básico', amountPrescribed: '4,50 mL', role: 'Donador de nitrógeno' }
    ],
    procedureSteps: [
      'En un matraz esférico de 100 mL se mezclan 2,55 mL de benzaldehído y 5,40 mL de acetoacetato de metilo en 10 mL de etanol.',
      'Se añaden 4,5 mL de amoníaco concentrado y el núcleo magnético de agitación.',
      'Se conecta el refrigerante y se mantiene la mezcla a ebullición suave (reflujo) durante 2 horas.',
      'Se deja enfriar el matraz a temperatura ambiente y posteriormente se sumerge en baño de agua-hielo durante 20 minutos hasta cristalización completa.',
      'Se filtra a vacío el precipitado amarillo en un embudo Büchner con Kitasato.',
      'Se lava el sólido con 5 mL de etanol frío y se recristaliza en etanol caliente.',
      'Se determina el rendimiento porcentual y el punto de fusión en el bloque calefactor.'
    ],
    equipmentNeeded: [
      'Matraz esférico de 100 mL',
      'Refrigerante de reflujo',
      'Embudo Büchner con Kitasato y trompa de vacío',
      'Aparato de punto de fusión Büchi'
    ],
    safetyNotes: [
      'El amoníaco concentrado emite vapores muy irritantes. Añadir con pipeta y perilla en el interior de la vitrina.'
    ],
    tipsAndTricks: [
      'Si tras enfriar no cristaliza espontáneamente, raspar las paredes interiores del matraz con una varilla de vidrio para inducir la nucleación.'
    ]
  }
];

// ==========================================================================
// Ejercicios de Preparación de Disoluciones
// ==========================================================================

export interface SolutionExercise {
  id: string;
  title: string;
  category: 'solid' | 'liquid' | 'dilution';
  targetSubstance: string;
  targetConcentration: string;
  targetVolumeMl: number;
  sourceData: {
    soluteMw?: number;
    purityPercent?: number;
    density?: number;
    initialConcentration?: string;
    notes?: string;
  };
  question?: string;
  correctAnswerValue: number;
  unit: string;
  tolerance: number;
  stepByStepSolution: string[];
}

export const LAB_SOLUTION_EXERCISES: SolutionExercise[] = [
  {
    id: 'sol_ex1_naoh_5n',
    title: 'Preparación de Disolución de NaOH 5 N (Reactivo Sólido)',
    category: 'solid',
    targetSubstance: 'Hidróxido de Sodio (NaOH)',
    targetConcentration: '5,0 M (5,0 N)',
    targetVolumeMl: 50,
    sourceData: {
      soluteMw: 40.00,
      purityPercent: 98.0,
      notes: 'Lentejas comerciales anhidras de NaOH'
    },
    question: '¿Cuántos gramos de lentejas comerciales de NaOH se deben pesar en la balanza para preparar 50 mL de disolución 5 N?',
    correctAnswerValue: 10.20,
    unit: 'g',
    tolerance: 0.15,
    stepByStepSolution: [
      '1) Moles puros de NaOH requeridos: n = M × V = 5,0 mol/L × 0,050 L = 0,250 moles.',
      '2) Masa pura de NaOH: m(pura) = n × PM = 0,250 mol × 40,00 g/mol = 10,00 g.',
      '3) Corrección por pureza comercial: m(comercial) = m(pura) / (Pureza / 100) = 10,00 g / 0,98 = 10,204 g ≈ 10,20 g.'
    ]
  },
  {
    id: 'sol_ex2_hcl_2n',
    title: 'Preparación de Disolución de HCl 2 N (Reactivo Líquido Concentrado)',
    category: 'liquid',
    targetSubstance: 'Ácido Clorhídrico (HCl)',
    targetConcentration: '2,0 M (2,0 N)',
    targetVolumeMl: 100,
    sourceData: {
      soluteMw: 36.46,
      purityPercent: 37.0,
      density: 1.19,
      notes: 'Ácido clorhídrico fumante comercial al 37%'
    },
    question: '¿Qué volumen en mL de ácido clorhídrico concentrado comercial se debe medir con probeta para preparar 100 mL de HCl 2 N?',
    correctAnswerValue: 16.56,
    unit: 'mL',
    tolerance: 0.20,
    stepByStepSolution: [
      '1) Moles puros de HCl requeridos: n = 2,0 mol/L × 0,100 L = 0,200 moles.',
      '2) Masa pura de HCl: m(pura) = 0,200 mol × 36,46 g/mol = 7,292 g.',
      '3) Masa de disolución comercial: m(comercial) = 7,292 g / 0,37 = 19,708 g.',
      '4) Volumen comercial: V = m / d = 19,708 g / 1,19 g/mL = 16,56 mL.'
    ]
  },
  {
    id: 'sol_ex3_dilution',
    title: 'Dilución a partir de Disolución Concentrada (V1·M1 = V2·M2)',
    category: 'dilution',
    targetSubstance: 'Ácido Clorhídrico Diluido',
    targetConcentration: '0,50 M',
    targetVolumeMl: 250,
    sourceData: {
      initialConcentration: '6,0 M',
      notes: 'Disolución madre de HCl 6 M'
    },
    question: '¿Qué volumen en mL de la disolución madre 6,0 M debe tomarse para preparar 250 mL de disolución 0,50 M?',
    correctAnswerValue: 20.83,
    unit: 'mL',
    tolerance: 0.25,
    stepByStepSolution: [
      '1) Aplicar la ecuación fundamental de dilución: V1 × M1 = V2 × M2.',
      '2) Despejar V1: V1 = (V2 × M2) / M1.',
      '3) Sustituir valores: V1 = (250 mL × 0,50 M) / 6,0 M = 125 / 6,0 = 20,83 mL.'
    ]
  }
];

// ==========================================================================
// Taller de Espectroscopia: RMN y Masas
// ==========================================================================

export interface SpectrumPeak {
  ppm: string;
  multiplicity?: string;
  type?: string;
  integral?: string;
  deptSignal?: string;
  assignment: string;
}

export interface CompoundSpectra {
  id: string;
  compoundName: string;
  formula: string;
  mw: number;
  smiles: string;
  r1hImageHorizontal: string;
  r1hImagePortrait: string;
  r13cImageHorizontal?: string;
  r13cImagePortrait?: string;
  deptImageHorizontal?: string;
  deptImagePortrait?: string;
  msImageHorizontal?: string;
  msImagePortrait?: string;
  peaks1H: SpectrumPeak[];
  peaks13C: SpectrumPeak[];
  msData?: {
    ionType: string;
    mOverZ: number;
    calcMOverZ: number;
    errorPpm: number;
    formula: string;
    explanation: string;
  };
  diagnosticKeys: string[];
}

export const COMPOUND_SPECTRA_DATA = {
  propranolol: {
    id: 'propranolol',
    compoundName: 'Propranolol Base Libre',
    formula: 'C16H21NO2',
    mw: 259.34,
    smiles: 'CC(C)NCC(O)COc1cccc2ccccc12',
    r1hImageHorizontal: recurso('/practicas/spectra/propranolol_1h_nmr_horizontal.png'),
    r1hImagePortrait: recurso('/practicas/spectra/propranolol_1h_nmr_portrait.png'),
    r13cImageHorizontal: recurso('/practicas/spectra/propranolol_13c_nmr_horizontal.png'),
    r13cImagePortrait: recurso('/practicas/spectra/propranolol_13c_nmr_portrait.png'),
    deptImageHorizontal: recurso('/practicas/spectra/propranolol_dept135_horizontal.png'),
    deptImagePortrait: recurso('/practicas/spectra/propranolol_dept135_portrait.png'),
    msImageHorizontal: recurso('/practicas/spectra/propranolol_hr_ms_horizontal.png'),
    msImagePortrait: recurso('/practicas/spectra/propranolol_hr_ms_portrait.png'),
    peaks1H: [
      { ppm: '1,49 ppm', multiplicity: 'Doblete (d)', integral: '6H', assignment: '2 × -CH3 del grupo isopropilamino -NH-CH(CH3)2' },
      { ppm: '3,20-3,45 ppm', multiplicity: 'Multiplete (m)', integral: '3H', assignment: '-CH2-NH- y -CH(CH3)2 (metino isopropilo)' },
      { ppm: '4,15-4,25 ppm', multiplicity: 'Multiplete (m)', integral: '2H', assignment: '-O-CH2- (metileno ariloxílico)' },
      { ppm: '4,52 ppm', multiplicity: 'Multiplete (m)', integral: '1H', assignment: '-CH(OH)- (metino carbinólico central)' },
      { ppm: '6,78 ppm', multiplicity: 'Doblete (d)', integral: '1H', assignment: 'H2 (aromático orto al grupo ariloxi)' },
      { ppm: '7,30-7,55 ppm', multiplicity: 'Multiplete (m)', integral: '4H', assignment: 'H3, H6, H7 del sistema naftaleno' },
      { ppm: '7,75-7,85 ppm', multiplicity: 'Multiplete (m)', integral: '1H', assignment: 'H5 (anillo naftaleno)' },
      { ppm: '8,20-8,30 ppm', multiplicity: 'Multiplete (m)', integral: '1H', assignment: 'H8 (protón peri desapantallado)' }
    ],
    peaks13C: [
      { ppm: '19,05 y 19,37 ppm', type: 'CH3', deptSignal: 'Positiva (+)', assignment: '2 × -CH3 isopropilo' },
      { ppm: '48,33 ppm', type: 'CH2', deptSignal: 'Negativa (-)', assignment: '-CH2-NH- (metileno amino)' },
      { ppm: '50,11 ppm', type: 'CH', deptSignal: 'Positiva (+)', assignment: '-CH(CH3)2 (metino isopropilo)' },
      { ppm: '65,65 ppm', type: 'CH', deptSignal: 'Positiva (+)', assignment: '-CH(OH)- (carbono carbinólico)' },
      { ppm: '69,60 ppm', type: 'CH2', deptSignal: 'Negativa (-)', assignment: '-O-CH2- (metileno ariloxílico)' },
      { ppm: '104,80 ppm', type: 'CH', deptSignal: 'Positiva (+)', assignment: 'C2 (aromático CH naftaleno)' },
      { ppm: '120,70 ppm', type: 'CH', deptSignal: 'Positiva (+)', assignment: 'C8 (aromático CH peri)' },
      { ppm: '121,95 - 134,60 ppm', type: 'CH / Cq', deptSignal: 'Positivas / Sin señal', assignment: 'C3, C4, C5, C6, C7 y carbonos cuaternarios C4a, C8a' },
      { ppm: '154,10 ppm', type: 'Cq', deptSignal: 'Sin señal', assignment: 'C1-O (carbono cuaternario ipso ariloxi)' }
    ],
    msData: {
      ionType: '[M+H]⁺',
      mOverZ: 260.1655,
      calcMOverZ: 260.1651,
      errorPpm: 1.5,
      formula: 'C16H22NO2⁺',
      explanation: 'Ion molecular protonado con error sub-ppm confirmando la fórmula elemental exacta.'
    },
    diagnosticKeys: [
      'Doblete intenso a 1,49 ppm (6H) característico del isopropilo',
      'Dos señales negativas en DEPT-135 (48,33 y 69,60 ppm) confirmando los metilenos',
      'Pico molecular protonado nítido a m/z 260,1655 en espectrometría de masas TOF'
    ]
  },
  dhpp: {
    id: 'dhpp',
    compoundName: 'DHPP (Dihidropiridina de Benzaldehído)',
    formula: 'C17H19NO4',
    mw: 301.34,
    smiles: 'COC(=O)C1=C(C)NC(C)=C(C1c2ccccc2)C(=O)OC',
    r1hImageHorizontal: recurso('/practicas/spectra/dhpp_1h_nmr_horizontal.png'),
    r1hImagePortrait: recurso('/practicas/spectra/dhpp_1h_nmr_portrait.png'),
    r13cImageHorizontal: recurso('/practicas/spectra/dhpp_13c_nmr_horizontal.png'),
    r13cImagePortrait: recurso('/practicas/spectra/dhpp_13c_nmr_portrait.png'),
    deptImageHorizontal: recurso('/practicas/spectra/dhpp_dept135_horizontal.png'),
    deptImagePortrait: recurso('/practicas/spectra/dhpp_dept135_portrait.png'),
    msImageHorizontal: recurso('/practicas/spectra/dhpp_hr_ms_horizontal.png'),
    msImagePortrait: recurso('/practicas/spectra/dhpp_hr_ms_portrait.png'),
    peaks1H: [
      { ppm: '2,32 ppm', multiplicity: 'Singlete (s)', integral: '6H', assignment: '2 × -CH3 en C2 y C6 de la dihidropiridina' },
      { ppm: '3,65 ppm', multiplicity: 'Singlete (s)', integral: '6H', assignment: '2 × -OCH3 de los ésteres metílicos en C3 y C5' },
      { ppm: '5,00 ppm', multiplicity: 'Singlete (s)', integral: '1H', assignment: 'C4-H (metino bencilílico en C4)' },
      { ppm: '5,80 ppm', multiplicity: 'Singlete ancho (br s)', integral: '1H', assignment: 'N-H (intercambiable con D2O)' },
      { ppm: '7,10-7,35 ppm', multiplicity: 'Multiplete (m)', integral: '5H', assignment: '5 × H aromáticos del fenilo en C4' }
    ],
    peaks13C: [
      { ppm: '19,30 ppm', type: 'CH3', deptSignal: 'Positiva (+)', assignment: '2 × CH3 (C2 y C6)' },
      { ppm: '39,40 ppm', type: 'CH', deptSignal: 'Positiva (+)', assignment: 'C4 (metino alílico central)' },
      { ppm: '50,90 ppm', type: 'CH3', deptSignal: 'Positiva (+)', assignment: '2 × OCH3 (ésteres)' },
      { ppm: '104,10 ppm', type: 'Cq', deptSignal: 'Sin señal', assignment: 'C3 y C5 (Cq vinílicos unidos a éster)' },
      { ppm: '126,20 - 128,10 ppm', type: 'CH', deptSignal: 'Positivas (+)', assignment: 'CH aromáticos fenilo' },
      { ppm: '144,30 ppm', type: 'Cq', deptSignal: 'Sin señal', assignment: 'C2 y C6 (Cq vinílicos unidos a NH)' },
      { ppm: '147,50 ppm', type: 'Cq', deptSignal: 'Sin señal', assignment: 'C ipso fenilo' },
      { ppm: '168,10 ppm', type: 'Cq', deptSignal: 'Sin señal', assignment: '2 × C=O (carbonilos de éster)' }
    ],
    msData: {
      ionType: '[M+H]⁺',
      mOverZ: 302.1387,
      calcMOverZ: 302.1392,
      errorPpm: -1.7,
      formula: 'C17H20NO4⁺',
      explanation: 'Ion molecular protonado del DHPP (M = 301,13). Compárese con el nifedipino, cuyo [M+H]⁺ aparece a m/z 347,12: la diferencia de 45 Da es exactamente lo que aporta el grupo nitro.'
    },
    diagnosticKeys: [
      'Singlete característico a 5,00 ppm correspondiente al protón C4-H',
      'Singletes intensos de 6H para los metilos aromáticos (2,32 ppm) y ésteres (3,65 ppm)',
      'Carbonilo de éster a 168,10 ppm conjugado con el doble enlace enamínico'
    ]
  },
  nifedipina: {
    id: 'nifedipina',
    compoundName: 'Nifedipina (2-Nitrofenildihidropiridina)',
    formula: 'C17H18N2O6',
    mw: 346.33,
    smiles: 'COC(=O)C1=C(C)NC(C)=C(C1c2ccccc2[N+](=O)[O-])C(=O)OC',
    r1hImageHorizontal: recurso('/practicas/spectra/nifedipina_1h_nmr_horizontal.png'),
    r1hImagePortrait: recurso('/practicas/spectra/nifedipina_1h_nmr_portrait.png'),
    r13cImageHorizontal: recurso('/practicas/spectra/nifedipina_13c_nmr_horizontal.png'),
    r13cImagePortrait: recurso('/practicas/spectra/nifedipina_13c_nmr_portrait.png'),
    deptImageHorizontal: recurso('/practicas/spectra/nifedipina_dept135_horizontal.png'),
    deptImagePortrait: recurso('/practicas/spectra/nifedipina_dept135_portrait.png'),
    msImageHorizontal: recurso('/practicas/spectra/nifedipina_hr_ms_horizontal.png'),
    msImagePortrait: recurso('/practicas/spectra/nifedipina_hr_ms_portrait.png'),
    peaks1H: [
      { ppm: '2,32 ppm', multiplicity: 'Singlete (s)', integral: '6H', assignment: '2 × -CH3 en C2 y C6' },
      { ppm: '3,65 ppm', multiplicity: 'Singlete (s)', integral: '6H', assignment: '2 × -COOCH3 ésteres' },
      { ppm: '5,72 ppm', multiplicity: 'Singlete (s)', integral: '1H', assignment: 'C4-H (muy desapantallado a 5,72 ppm por el orto-NO2)' },
      { ppm: '6,05 ppm', multiplicity: 'Singlete ancho (br s)', integral: '1H', assignment: 'N-H' },
      { ppm: '7,25-7,70 ppm', multiplicity: 'Multiplete (m)', integral: '4H', assignment: 'Patrón aromático 2-nitrofenilo (4H)' }
    ],
    // Valores transcritos del espectro real del cuaderno (CDCl₃)
    peaks13C: [
      { ppm: '19,48 y 19,56 ppm', type: 'CH3', deptSignal: 'Positiva (+)', assignment: '2 × -CH3 en C2 y C6' },
      { ppm: '34,52 ppm', type: 'CH', deptSignal: 'Positiva (+)', assignment: 'C4 (metino). Unos 5 ppm por debajo del DHPP (39,25) por el orto-NO2' },
      { ppm: '51,04 ppm', type: 'CH3', deptSignal: 'Positiva (+)', assignment: '2 × -COOCH3 (metoxilos de los ésteres)' },
      { ppm: '103,71 ppm', type: 'Cq', deptSignal: 'Sin señal', assignment: 'C3 y C5 (carbonos enamínicos del anillo dihidropiridínico)' },
      { ppm: '123,91 ppm', type: 'CH', deptSignal: 'Positiva (+)', assignment: 'CH aromático del anillo 2-nitrofenilo' },
      { ppm: '127,04 ppm', type: 'CH', deptSignal: 'Positiva (+)', assignment: 'CH aromático del anillo 2-nitrofenilo' },
      { ppm: '131,04 ppm', type: 'CH', deptSignal: 'Positiva (+)', assignment: 'CH aromático del anillo 2-nitrofenilo' },
      { ppm: '132,72 ppm', type: 'CH', deptSignal: 'Positiva (+)', assignment: 'CH aromático del anillo 2-nitrofenilo' },
      { ppm: '142,08 ppm', type: 'Cq', deptSignal: 'Sin señal', assignment: 'C1 del arilo (ipso, unido a C4)' },
      { ppm: '144,82 ppm', type: 'Cq', deptSignal: 'Sin señal', assignment: 'C2 y C6 del anillo dihidropiridínico' },
      { ppm: '147,86 ppm', type: 'Cq', deptSignal: 'Sin señal', assignment: 'C-NO2 (carbono aromático unido al grupo nitro)' },
      { ppm: '167,51 ppm', type: 'Cq', deptSignal: 'Sin señal', assignment: '2 × C=O de los ésteres, equivalentes por simetría' }
    ],
    msData: {
      ionType: '[M+H]⁺',
      mOverZ: 347.1242,
      calcMOverZ: 347.1243,
      errorPpm: -0.3,
      formula: 'C17H19N2O6⁺',
      explanation: 'El informe propone tres fórmulas posibles: C17H19N2O6⁺ (−0,3 ppm), C13H15N8O4⁺ (7,5 ppm) y C18H15N6O2⁺ (−4,0 ppm). Se elige la primera por el menor error y por tener un número de insaturaciones químicamente razonable. La diferencia de 45 Da con el DHPP (m/z 302) corresponde al grupo nitro.'
    },
    diagnosticKeys: [
      'Desplazamiento del protón C4-H a 5,72 ppm frente a 5,00 ppm en DHPP por el efecto del orto-NO2',
      'Cuatro señales de CH aromático en DEPT (132,7 · 131,0 · 127,0 · 123,9): prueban un anillo 1,2-disustituido, mientras que el DHPP sólo da tres',
      'Carbono unido al nitro a 147,86 ppm y C4 desplazado a 34,52 ppm frente a 39,25 ppm en el DHPP',
      'Ninguna señal invertida en DEPT-135: como el DHPP, la molécula no tiene ningún CH2'
    ]
  }
} satisfies Record<string, CompoundSpectra>;

// ==========================================================================
// Normas de Seguridad Oficiales y Precauciones Químicas (Págs. 3, 4 y 22-23)
// ==========================================================================

export interface SafetyRuleCheck {
  id: number;
  title: string;
  text: string;
  category: 'supervision' | 'epi' | 'espacio' | 'reactivos' | 'emergencia' | 'residuos' | 'conducta';
}

export const NORMAS_SEGURIDAD_CHECKLIST: SafetyRuleCheck[] = [
  {
    id: 1,
    title: 'Supervisión Docente',
    text: 'Realice los trabajos de laboratorio sólo cuando el profesor encargado de la docencia práctica del grupo esté presente. No se permiten los experimentos de laboratorio no autorizados o no supervisados.',
    category: 'supervision'
  },
  {
    id: 2,
    title: 'Comprensión Previa de Protocolos',
    text: 'Lea y asegúrese de entender los detalles de las actividades del laboratorio antes de realizarlas y los riesgos y medidas de seguridad necesarias asociadas a las mismas. En caso de duda acerca de los procedimientos adecuados pregunte al profesor.',
    category: 'supervision'
  },
  {
    id: 3,
    title: 'Ubicación de Equipos de Emergencia',
    text: 'Conozca la ubicación y el funcionamiento de todos los equipos de seguridad del laboratorio: ducha de seguridad, lavaojos, botiquín de primeros auxilios, extintor, manta contra incendios y salidas de emergencia.',
    category: 'emergencia'
  },
  {
    id: 4,
    title: 'EPIs Obligatorios (Bata y Gafas)',
    text: 'Use una bata de laboratorio larga (abrochada) y gafas protectoras a prueba de salpicaduras en todo momento dentro del laboratorio. El alumno que no cumpla esta norma será expulsado del laboratorio.',
    category: 'epi'
  },
  {
    id: 5,
    title: 'Vestimenta y Cabello',
    text: 'Use zapatos cerrados. Ate por detrás de la cabeza el cabello largo y suelto. Se recomienda no usar pantalones cortos o faldas cortas.',
    category: 'epi'
  },
  {
    id: 6,
    title: 'Despeje del Área de Trabajo',
    text: 'Antes de comenzar, despeje su espacio de trabajo de todo el material innecesario, como mochilas, libros y ropa de abrigo.',
    category: 'espacio'
  },
  {
    id: 7,
    title: 'Verificación de Reactivos y Etiquetas',
    text: 'Revise adecuadamente las etiquetas de los productos químicos para asegurarse de que tiene la sustancia correcta y/o a la concentración correcta.',
    category: 'reactivos'
  },
  {
    id: 8,
    title: 'Transferencia de Reactivos y No Retorno',
    text: 'Es posible que se le pida que transfiera productos químicos de una botella compartida a su propio contenedor. No devuelva el material sobrante a su envase original a menos que el profesor lo autorice, para no contaminar el frasco nodriza.',
    category: 'reactivos'
  },
  {
    id: 9,
    title: 'Prohibición de Ingesta e Inhalación',
    text: 'No ingiera ni inhale los materiales/reactivos de laboratorio. Está completamente prohibido el consumo de alimentos y/o bebidas en el laboratorio durante la realización de las prácticas.',
    category: 'conducta'
  },
  {
    id: 10,
    title: 'Orientación Segura de Recipientes',
    text: 'Nunca mire directamente hacia abajo en un matraz de reacción; observe el contenido desde un costado. Nunca apunte el extremo abierto de una probeta o recipiente con reactivos hacia usted o su compañero.',
    category: 'espacio'
  },
  {
    id: 11,
    title: 'Transporte Seguro de Materiales',
    text: 'Asegúrese de entender cómo se transportan todos los reactivos, materiales de vidrio y equipos de manera segura entre vitrinas y mesas.',
    category: 'espacio'
  },
  {
    id: 12,
    title: 'Comunicación Inmediata de Accidentes',
    text: 'Cualquier accidente o incidente de laboratorio, por pequeño que sea, debe ser comunicado inmediatamente al profesor encargado de la docencia práctica.',
    category: 'emergencia'
  },
  {
    id: 13,
    title: 'Actuación en Derrames y Salpicaduras',
    text: 'En caso de derrame de productos químicos sobre la piel o la ropa, enjuague la zona afectada con abundante agua corriente. Si los ojos están afectados, el enjuague en lavaojos debe comenzar inmediatamente y continuar durante al menos 10 a 15 minutos.',
    category: 'emergencia'
  },
  {
    id: 14,
    title: 'Gestión de Residuos Químicos',
    text: 'Al desechar materiales y reactivos usados, siga cuidadosamente las instrucciones del profesor. Queda terminantemente prohibido el vertido de residuos químicos en las piletas de lavado o en las papeleras comunes (usar bidones de halogenados/no halogenados).',
    category: 'residuos'
  },
  {
    id: 15,
    title: 'Orden, Limpieza y Desconexión Final',
    text: 'Devuelva el equipo y reactivos a sus lugares designados al terminar. Antes de salir, asegúrese de que los grifos de agua y gases estén cerrados y el instrumental eléctrico desenchufado. Lávese las manos con agua y jabón antes de salir.',
    category: 'espacio'
  },
  {
    id: 16,
    title: 'Régimen Disciplinario',
    text: 'El/la estudiante que presente mala conducta, imprudencia o desconocimiento reiterado de las normas de seguridad durante la práctica puede ser expulsado inmediatamente del laboratorio.',
    category: 'conducta'
  }
];

export interface ReagentSafetyCaution {
  reagent: string;
  dangerType: 'toxic' | 'cancerigen' | 'flammable' | 'corrosive' | 'irritant';
  dangerLabel: string;
  description: string;
  actionRequired: string;
}

export const REACTIVOS_PRECAUCIONES: ReagentSafetyCaution[] = [
  {
    reagent: '1-Naftol (α-Naftol)',
    dangerType: 'irritant',
    dangerLabel: 'Irritante Cutáneo / Ocular',
    description: 'Irrita fuertemente los ojos, la piel y las vías respiratorias. Nocivo por ingestión.',
    actionRequired: 'Pesar en pesasustancias con espátula limpia y manipular con guantes de nitrilo.'
  },
  {
    reagent: 'Epiclorhidrina (1-Cloro-2,3-epoxipropano)',
    dangerType: 'cancerigen',
    dangerLabel: 'Tóxico y Carcinógeno (Cat. 1B)',
    description: 'Líquido volátil altamente tóxico, alquilante y cancerígeno comprobado.',
    actionRequired: '¡ADICIÓN EXCLUSIVA EN VITRINA EXTRACTORA! Medir con pipeta/probeta dentro de campana.'
  },
  {
    reagent: 'Isopropilamina',
    dangerType: 'flammable',
    dangerLabel: 'Extremadamente Inflamable e Irritante',
    description: 'Amina volátil de bajo punto de ebullición (32 °C). Vapores fuertemente sofocantes e irritantes.',
    actionRequired: 'Mantener el frasco cerrado en frío. Medir y verter dentro de la vitrina extractora.'
  },
  {
    reagent: 'Benzaldehído',
    dangerType: 'irritant',
    dangerLabel: 'Irritante y Nocivo',
    description: 'Irrita los ojos, la piel y las vías respiratorias. Se oxida con el aire a ácido benzoico.',
    actionRequired: 'Pipetear bajo campana; evitar contacto directo y salpicaduras.'
  },
  {
    reagent: 'Acetoacetato de Metilo / Etilo',
    dangerType: 'irritant',
    dangerLabel: 'Irritante',
    description: 'Líquido combustible con olor característico. Irritante para mucosas.',
    actionRequired: 'Medir en probeta y lavar inmediatamente el material de dosificación.'
  },
  {
    reagent: 'Ácido Clorhídrico Concentrado (HCl 37%)',
    dangerType: 'corrosive',
    dangerLabel: 'Ácido Mineral Corrosivo y Emisor de Vapores',
    description: 'Sus vapores producen grave irritación y quemaduras en el tracto respiratorio.',
    actionRequired: 'Diluir siempre adicionando el ácido sobre el agua en vitrina. ¡NUNCA agua sobre ácido!'
  },
  {
    reagent: 'Hidróxido Sódico (NaOH)',
    dangerType: 'corrosive',
    dangerLabel: 'Base Fuerte Altamente Corrosiva',
    description: 'Provoca quemaduras químicas graves e irreversibles en piel y ojos. Disolución exotérmica.',
    actionRequired: 'Pesar rápidamente en pesasustancias por ser higroscópico. Usar gafas de protección integral.'
  },
  {
    reagent: 'Amoníaco Acuoso (NH₃ 25-30%)',
    dangerType: 'corrosive',
    dangerLabel: 'Corrosivo y Peligroso para el Medio Ambiente',
    description: 'Gas amoníaco desprendido muy picante y lacrimógeno.',
    actionRequired: 'Adición obligatoria dentro de la vitrina con la guillotina baja.'
  },
  {
    reagent: 'Diclorometano (CH₂Cl₂ / Cloruro de Metileno)',
    dangerType: 'toxic',
    dangerLabel: 'Disolvente Clorado / Vapores Tóxicos',
    description: 'Disolvente volátil pesado (d=1,33 g/mL). Ligeramente irritante y sospechoso de carcinogenicidad.',
    actionRequired: 'Realizar las extracciones y decantaciones con despresurización orientada al fondo de campana.'
  },
  {
    reagent: 'Etanol y Éter Etílico',
    dangerType: 'flammable',
    dangerLabel: 'Disolventes Muy Inflamables',
    description: 'Vapores que forman mezclas explosivas con el aire a temperatura ambiente.',
    actionRequired: 'Mantener alejados de fuentes de calor, mantas eléctricas abiertas y chispas.'
  }
];

// ==========================================================================
// Inventario de Material y Operaciones de Laboratorio (Pág. 23)
// ==========================================================================

export interface LabEquipmentItem {
  id: string;
  name: string;
  zone: string;
  location: 'Cajón (Plástico y Hierro)' | 'Estante Superior (Vidrio)' | 'Estante Inferior (Calefacción)';
  category: 'vidrio' | 'soporte' | 'seguridad' | 'calefaccion' | 'filtracion' | 'medida';
  count: string;
  usageDescription: string;
  description: string;
  safetyTips: string[];
  imageUrl?: string;
}

export const LAB_EQUIPMENT_INVENTORY: LabEquipmentItem[] = [
  // 1. MATERIAL DE PLÁSTICO Y HIERRO GUARDADO EN ARMARIO (CAJÓN)
  {
    id: 'aro_metalico',
    name: 'Aro Metálico con Nuez',
    zone: 'Armario (Cajón) — Plástico y Hierro',
    location: 'Cajón (Plástico y Hierro)',
    category: 'soporte',
    count: '1 unidad',
    usageDescription: 'Soporte anular para embudos de decantación y baños calefactores en el soporte universal.',
    description: 'Aro circular de acero con tornillo de fijación para sujetar embudos de decantación y recipientes esféricos.',
    safetyTips: ['Ajustar firmemente al soporte universal antes de colocar el embudo lleno de líquido.']
  },
  {
    id: 'cono_goma',
    name: 'Cono de Goma (Adaptador Guko)',
    zone: 'Armario (Cajón) — Plástico y Hierro',
    location: 'Cajón (Plástico y Hierro)',
    category: 'filtracion',
    count: '1 unidad',
    usageDescription: 'Junta de estanqueidad hermética entre el embudo Büchner y la boca del matraz Kitasato.',
    description: 'Anillo cónico elástico que sella la unión de vidrio-porcelana al aplicar el vacío de la trompa.',
    safetyTips: ['Comprobar que no presente grietas para evitar pérdidas de vacío durante la filtración.']
  },
  {
    id: 'embudo_buchner',
    name: 'Embudo Büchner de Porcelana',
    zone: 'Armario (Cajón) — Plástico y Hierro',
    location: 'Cajón (Plástico y Hierro)',
    category: 'filtracion',
    count: '1 unidad',
    usageDescription: 'Filtración a vacío rápida de precipitados y cristales (Propranolol, DHPP).',
    description: 'Embudo de porcelana con placa cribada perforada para acoger el círculo de papel de filtro plano.',
    safetyTips: ['Humedecer y ajustar el papel de filtro con disolvente frío antes de verter la suspensión de cristales.']
  },
  {
    id: 'embudo_conico',
    name: 'Embudo Cónico de Filtración / Plástico',
    zone: 'Armario (Cajón) — Plástico y Hierro',
    location: 'Cajón (Plástico y Hierro)',
    category: 'filtracion',
    count: '1 unidad',
    usageDescription: 'Filtración por gravedad con filtro de pliegues o trasvase seguro de líquidos a matraces.',
    description: 'Embudo cónico de caña para clarificación de disoluciones o eliminación de desecantes (MgSO₄ / Na₂SO₄).',
    safetyTips: ['Evitar verter líquidos a caudales mayores de lo que la caña puede evacuar.']
  },
  {
    id: 'probeta_50',
    name: 'Probeta Graduada de 50 mL',
    zone: 'Armario (Cajón) — Plástico y Hierro',
    location: 'Cajón (Plástico y Hierro)',
    category: 'medida',
    count: '1 unidad',
    usageDescription: 'Medición rápida y dosificación de volúmenes de disolventes y disoluciones acuosas.',
    description: 'Cilindro graduado de base hexagonal para medición volumétrica de precisión intermedia.',
    safetyTips: ['No utilizar nunca para calentar disoluciones ni preparar reacciones exotérmicas.']
  },
  {
    id: 'probeta_100',
    name: 'Probeta Graduada de 100 mL',
    zone: 'Armario (Cajón) — Plástico y Hierro',
    location: 'Cajón (Plástico y Hierro)',
    category: 'medida',
    count: '1 unidad',
    usageDescription: 'Medición de disolventes de extracción (DCM, éter etílico, agua destilada).',
    description: 'Probeta de 100 mL con pico vertedor para preparación de fases de lavado y mezclas de eluyentes.',
    safetyTips: ['Leer siempre el menisco a la altura de los ojos en una superficie plana.']
  },
  {
    id: 'embudo_solidos_80',
    name: 'Embudos de Adición de Sólidos (80 mm)',
    zone: 'Armario (Cajón) — Plástico y Hierro',
    location: 'Cajón (Plástico y Hierro)',
    category: 'soporte',
    count: '2 unidades',
    usageDescription: 'Adición limpia de reactivos sólidos (1-naftol, reactivo Hantzsch) al matraz esférico sin ensuciar la boca esmerilada.',
    description: 'Embudos de boca ancha y caña corta y gruesa especialmente diseñados para canalizar polvos y cristales.',
    safetyTips: ['Asegurar que la boca del matraz quede libre de polvo para garantizar un cierre esmerilado hermético.']
  },
  {
    id: 'nueces_dobles',
    name: 'Nueces Metálicas de Laboratorio',
    zone: 'Armario (Cajón) — Plástico y Hierro',
    location: 'Cajón (Plástico y Hierro)',
    category: 'soporte',
    count: '2 unidades',
    usageDescription: 'Fijación perpendicular de las pinzas al soporte vertical de varilla metálica.',
    description: 'Pieza de fundición con dos tornillos prisioneros a 90° para construir los montajes de soporte.',
    safetyTips: ['Orientar siempre la nuez con la abertura hacia arriba para que el peso descanse sobre la pieza.']
  },
  {
    id: 'pinzas_tres_dedos',
    name: 'Pinzas de Laboratorio con Nuez/Agarre',
    zone: 'Armario (Cajón) — Plástico y Hierro',
    location: 'Cajón (Plástico y Hierro)',
    category: 'soporte',
    count: '2 unidades',
    usageDescription: 'Sujeción firme del cuello del matraz esférico y del cuerpo del refrigerante de bolas.',
    description: 'Pinzas articuladas metálicas recubiertas de corcho/vinilo para no tensionar ni rayar el vidrio.',
    safetyTips: ['Sujetar el matraz por el cuello justo por debajo del esmerilado sin forzar el apriete.']
  },
  {
    id: 'pesasustancias',
    name: 'Pesasustancias / Vidrios de Reloj',
    zone: 'Armario (Cajón) — Plástico y Hierro',
    location: 'Cajón (Plástico y Hierro)',
    category: 'medida',
    count: '3 unidades',
    usageDescription: 'Pesada analítica exacta de reactivos sólidos en la balanza (1-naftol, hidróxido sódico, etc.).',
    description: 'Recipientes de vidrio/plástico con fondo plano para tarar en balanza y transferir masa con precisión.',
    safetyTips: ['Tarar siempre la balanza con el pesasustancias antes de añadir el reactivo con espátula.']
  },

  // 2. MATERIAL DE VIDRIO GUARDADO EN ARMARIO (ESTANTE SUPERIOR)
  {
    id: 'embudo_decantacion_250',
    name: 'Embudo de Decantación de 250 mL con Tapón',
    zone: 'Armario (Estante Superior) — Vidrio',
    location: 'Estante Superior (Vidrio)',
    category: 'vidrio',
    count: '1 unidad',
    usageDescription: 'Extracción líquido-líquido y separación nítida de fases inmiscibles orgánicas y acuosas.',
    description: 'Embudo piriforme de vidrio borosilicato con llave de teflón y tapón esmerilado hermético.',
    safetyTips: ['Despresurizar abriendo la llave con el embudo invertido apuntando al fondo de la campana extractora.']
  },
  {
    id: 'matraz_kitasato',
    name: 'Matraz Kitasato de Pared Gruesa',
    zone: 'Armario (Estante Superior) — Vidrio',
    location: 'Estante Superior (Vidrio)',
    category: 'vidrio',
    count: '1 unidad',
    usageDescription: 'Recepción del filtrado en procesos de filtración a vacío mediante trompa de agua.',
    description: 'Matraz cónico de vidrio grueso reforzado con tubuladura lateral para conexión de manguera de vacío.',
    safetyTips: ['Desconectar la goma de vacío de la oliva antes de cerrar la trompa de agua para evitar retornos.']
  },
  {
    id: 'varilla_vidrio',
    name: 'Varilla de Vidrio (Agitador)',
    zone: 'Armario (Estante Superior) — Vidrio',
    location: 'Estante Superior (Vidrio)',
    category: 'vidrio',
    count: '1 unidad',
    usageDescription: 'Agitación manual de disoluciones, inducción mecánica de la cristalización por rascado.',
    description: 'Varilla cilíndrica maciza de vidrio de extremos redondeados al fuego.',
    safetyTips: ['No golpear el fondo de los vasos ni aplicar palanca excesiva para evitar roturas.']
  },
  {
    id: 'aros_corcho',
    name: 'Aros de Corcho para Matraces Esféricos',
    zone: 'Armario (Estante Superior) — Vidrio',
    location: 'Estante Superior (Vidrio)',
    category: 'soporte',
    count: '2 unidades',
    usageDescription: 'Soporte y descanso estable de matraces de fondo redondo sobre la mesa de trabajo.',
    description: 'Anillos de corcho natural prensado que aíslan térmicamente y evitan que los matraces rueden.',
    safetyTips: ['Colocar siempre el matraz esférico sobre el aro de corcho nada más retirarlo del montaje.']
  },
  {
    id: 'erlenmeyer_100',
    name: 'Matraces Erlenmeyer de 100 mL',
    zone: 'Armario (Estante Superior) — Vidrio',
    location: 'Estante Superior (Vidrio)',
    category: 'vidrio',
    count: '2 unidades',
    usageDescription: 'Recogida de fracciones orgánicas, secado sobre desecante (MgSO₄ / Na₂SO₄) y recristalizaciones a pequeña escala.',
    description: 'Matraces cónicos de boca estrecha que reducen la evaporación de disolventes y facilitan la agitación.',
    safetyTips: ['Tapar con papel de aluminio o parafilm al realizar el secado con sales anhidras.']
  },
  {
    id: 'matraz_esferico_100',
    name: 'Matraces Esféricos de Fondo Redondo de 100 mL',
    zone: 'Armario (Estante Superior) — Vidrio',
    location: 'Estante Superior (Vidrio)',
    category: 'vidrio',
    count: '2 unidades',
    usageDescription: 'Recipientes principales para llevar a cabo las reacciones a reflujo (Paso 1 y Paso 2 Propranolol, Síntesis Hantzsch).',
    description: 'Matraces de boca esmerilada normalizada (29/32 o 14/23) para acoplamiento estanco de refrigerantes.',
    safetyTips: ['Añadir siempre un imán de agitación o perlas de ebullición antes de iniciar el calentamiento.']
  },
  {
    id: 'vaso_precipitados_250',
    name: 'Vasos de Precipitados de 250 mL',
    zone: 'Armario (Estante Superior) — Vidrio',
    location: 'Estante Superior (Vidrio)',
    category: 'vidrio',
    count: '2 unidades',
    usageDescription: 'Preparación de baños de hielo/agua, mezclas de disoluciones de lavado y trasvase auxiliar.',
    description: 'Vasos de forma baja (Griffin) con pico vertedor y graduación aproximada.',
    safetyTips: ['No utilizarlos como recipientes de medida volumétrica exacta.']
  },
  {
    id: 'erlenmeyer_250',
    name: 'Matraces Erlenmeyer de 250 mL',
    zone: 'Armario (Estante Superior) — Vidrio',
    location: 'Estante Superior (Vidrio)',
    category: 'vidrio',
    count: '3 unidades',
    usageDescription: 'Recristalizaciones de producto crudo (DHPP y Propranolol base), recogida de fases acuosas en extracciones.',
    description: 'Matraces cónicos de volumen medio óptimos para disolución en caliente y enfriamiento lento para cristalizar.',
    safetyTips: ['Dejar enfriar a temperatura ambiente antes de sumergir en baño de hielo para evitar choque térmico.']
  },

  // 3. MATERIAL GUARDADO EN ARMARIO (ESTANTE INFERIOR)
  {
    id: 'manta_calefactora',
    name: 'Manta Eléctrica Calefactora con Regulador',
    zone: 'Armario (Estante Inferior) — Calefacción',
    location: 'Estante Inferior (Calefacción)',
    category: 'calefaccion',
    count: '1 unidad',
    usageDescription: 'Calentamiento eléctrico seguro y homogéneo de matraces esféricos de 100 mL en reacciones a reflujo.',
    description: 'Manta calefactora con cesta cóncava tejida de fibra de vidrio y reóstato de potencia regulable.',
    safetyTips: ['Montar siempre sobre el elevador de tijera (lab-jack) para poder retirar el calor de inmediato en caso de ebullición violenta.']
  }
];

export const MATERIAL_PUESTO = [
  {
    zona: 'MATERIAL DE PLÁSTICO Y HIERRO GUARDADO EN ARMARIO (CAJÓN)',
    items: [
      '1 Aro Metálico',
      '1 Cono de Goma',
      '1 Embudo Büchner',
      '1 Embudo Cónico',
      '1 Probeta de 50 mL.',
      '1 Probeta de 100 mL.',
      '2 Embudos de Adición de sólidos (80 mm.)',
      '2 Nueces',
      '2 Pinzas',
      '3 Pesasustancias'
    ]
  },
  {
    zona: 'MATERIAL DE VIDRIO GUARDADO EN ARMARIO (ESTANTE SUPERIOR)',
    items: [
      '1 Embudo de Decantación de 250 mL con tapón',
      '1 Kitasato',
      '1 Varilla de Vidrio',
      '2 Aros de Corcho',
      '2 Matraces Erlenmeyer de 100 mL.',
      '2 Matraces Esféricos de 100 mL.',
      '2 Vasos de Precipitados de 250 mL.',
      '3 Matraces Erlenmeyer de 250 mL.'
    ]
  },
  {
    zona: 'MATERIAL DE VIDRIO GUARDADO EN ARMARIO (ESTANTE INFERIOR)',
    items: [
      '1 Manta Eléctrica Calefactora'
    ]
  }
];

export const TEMPORIZACION = [
  { dia: 'Primer día', tareas: [
    'Explicación de las dos prácticas',
    'Propranolol: primera reacción, formación del 2-(1-naftil)oximetiloxirano',
    'Estudio de los espectros de RMN y EM del propranolol'
  ]},
  { dia: 'Segundo día', tareas: [
    'Propranolol: extracción y aislamiento del oxirano',
    'Tratamiento del oxirano con isopropilamina',
    'Cálculo de las disoluciones de HCl y NaOH',
    'Estudio de los espectros de RMN y EM de DHPP y nifedipina'
  ]},
  { dia: 'Tercer día', tareas: [
    'DHPP: reacción de formación de la dihidropiridina',
    'Extracción del propranolol',
    'Aislamiento y purificación del propranolol'
  ]},
  { dia: 'Cuarto día', tareas: [
    'DHPP: filtración y recristalización',
    'Puntos de fusión de los productos finales'
  ]},
  { dia: 'Quinto día', tareas: [
    'Pesada de los productos finales',
    'Cálculo de los rendimientos',
    'Recogida del material',
    'Examen de prácticas'
  ]}
];

// ==========================================================================
// Simulador de Examen de Prácticas
// ==========================================================================

export interface ExamChemicalStructure {
  name: string;
  smiles: string;
  formula: string;
  amount?: string;
  density?: number;
  purity?: number;
  role: 'reactivo_limitante_potencial' | 'reactivo_exceso' | 'producto_deseado';
  atomicComposition: { [element: string]: number };
  calculatedMw: number;
}

export interface PracticeExamQuestion {
  id: string;
  category: 'rendimiento' | 'disoluciones' | 'espectroscopia' | 'material_y_operaciones' | 'mecanismo';
  title: string;
  scenario: string;
  questionText: string;
  structures?: ExamChemicalStructure[];
  requiresMwCalculation?: boolean;
  numericAnswer?: number;
  tolerance?: number;
  unit?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  hints: string[];
}

export const PRACTICE_EXAM_QUESTIONS: PracticeExamQuestion[] = [
  {
    id: 'exam_q1_propranolol_yield',
    category: 'rendimiento',
    title: 'Cálculo de Rendimiento en Síntesis de Propranolol con Deducción de PM',
    scenario: 'Un estudiante de prácticas hace reaccionar 3,00 g de α-Naftol con 2,70 mL de Epiclorhidrina (d = 1,18 g/mL) en medio acuoso alcalino para obtener Naftoximetiloxirano. Tras aislar el oxirano, lo trata con 6,0 mL de Isopropilamina (d = 0,69 g/mL) obteniendo finalmente 3,85 g de Propranolol puro.',
    questionText: 'A partir de las estructuras químicas mostradas, determina los pesos moleculares de los reactivos y producto (C=12,011, H=1,008, O=15,999, N=14,007, Cl=35,453 g/mol), identifica el reactivo limitante inicial y calcula el rendimiento global del Propranolol.',
    requiresMwCalculation: true,
    structures: [
      {
        name: 'α-Naftol (Reactivo A)',
        smiles: 'Oc1cccc2ccccc12',
        formula: 'C10H8O',
        amount: '3,00 g',
        role: 'reactivo_limitante_potencial',
        atomicComposition: { C: 10, H: 8, O: 1 },
        calculatedMw: 144.17
      },
      {
        name: 'Epiclorhidrina (Reactivo B)',
        smiles: 'ClCC1CO1',
        formula: 'C3H5ClO',
        amount: '2,70 mL (d = 1,18 g/mL)',
        density: 1.18,
        role: 'reactivo_exceso',
        atomicComposition: { C: 3, H: 5, Cl: 1, O: 1 },
        calculatedMw: 92.52
      },
      {
        name: 'Isopropilamina (Reactivo C)',
        smiles: 'CC(C)N',
        formula: 'C3H9N',
        amount: '6,00 mL (d = 0,69 g/mL)',
        density: 0.69,
        role: 'reactivo_exceso',
        atomicComposition: { C: 3, H: 9, N: 1 },
        calculatedMw: 59.11
      },
      {
        name: 'Propranolol (Producto Final)',
        smiles: 'CC(C)NCC(O)COc1cccc2ccccc12',
        formula: 'C16H21NO2',
        role: 'producto_deseado',
        atomicComposition: { C: 16, H: 21, N: 1, O: 2 },
        calculatedMw: 259.34
      }
    ],
    options: [
      'PM α-Naftol = 144,17 g/mol (Limitante: 20,81 mmol); PM Propranolol = 259,34 g/mol; Rendimiento Global = 71,3%',
      'PM Epiclorhidrina = 92,52 g/mol (Limitante: 34,44 mmol); Rendimiento Global = 85,2%',
      'PM α-Naftol = 144,17 g/mol (Limitante: 20,81 mmol); Rendimiento Global = 82,4%',
      'PM Isopropilamina = 59,11 g/mol (Limitante: 70,0 mmol); Rendimiento Global = 62,8%'
    ],
    correctOptionIndex: 0,
    explanation: `1) Pesos Moleculares deducidos:\n• α-Naftol (C10H8O): (10 × 12,011) + (8 × 1,008) + 15,999 = 144,17 g/mol.\n• Epiclorhidrina (C3H5ClO): (3 × 12,011) + (5 × 1,008) + 35,453 + 15,999 = 92,52 g/mol.\n• Propranolol (C16H21NO2): (16 × 12,011) + (21 × 1,008) + 14,007 + (2 × 15,999) = 259,34 g/mol.\n\n2) Reactivo Limitante:\n• Moles α-Naftol = 3,00 g / 144,17 g/mol = 20,81 mmol.\n• Moles Epiclorhidrina = (2,70 mL × 1,18 g/mL) / 92,52 g/mol = 3,186 g / 92,52 = 34,44 mmol.\n• Estequiometría 1:1 -> α-Naftol es el LIMITANTE (20,81 mmol).\n\n3) Masa Teórica Máxima de Propranolol = 0,02081 mol × 259,34 g/mol = 5,397 g.\n4) Rendimiento Global = (3,85 g / 5,397 g) × 100 = 71,33% ≈ 71,3%.`,
    hints: [
      'Calcula primero las masas molares sumando los pesos atómicos de cada fórmula empírica.',
      'Compara los moles de α-naftol y epiclorhidrina para identificar el reactivo limitante.',
      'El rendimiento global se calcula dividiendo la masa real de propranolol entre la masa teórica que se formaría a partir de los moles iniciales de α-naftol.'
    ]
  },
  {
    id: 'exam_q2_dhpp_yield',
    category: 'rendimiento',
    title: 'Síntesis de Hantzsch: Reactivo Limitante y Masa Molecular de DHPP',
    scenario: 'Se prepara la 1,4-dihidropiridina modelo (DHPP) haciendo reaccionar 2,55 mL de Benzaldehído (d = 1,04 g/mL) con 5,40 mL de Acetoacetato de metilo (d = 1,08 g/mL) y exceso de amoníaco. Tras cristalización se obtienen 5,65 g de DHPP pura.',
    questionText: 'Calcula los pesos moleculares de los reactivos y producto a partir de sus estructuras químicas y determina el rendimiento porcentual obtenido de DHPP.',
    requiresMwCalculation: true,
    structures: [
      {
        name: 'Benzaldehído (Reactivo A)',
        smiles: 'O=Cc1ccccc1',
        formula: 'C7H6O',
        amount: '2,55 mL (d = 1,04 g/mL)',
        density: 1.04,
        role: 'reactivo_limitante_potencial',
        atomicComposition: { C: 7, H: 6, O: 1 },
        calculatedMw: 106.12
      },
      {
        name: 'Acetoacetato de metilo (Reactivo B, 2 eq)',
        smiles: 'COC(=O)CC(C)=O',
        formula: 'C5H8O3',
        amount: '5,40 mL (d = 1,08 g/mL)',
        density: 1.08,
        role: 'reactivo_limitante_potencial',
        atomicComposition: { C: 5, H: 8, O: 3 },
        calculatedMw: 116.12
      },
      {
        name: 'DHPP (Producto Final)',
        smiles: 'COC(=O)C1=C(C)NC(C)=C(C1c2ccccc2)C(=O)OC',
        formula: 'C17H19NO4',
        role: 'producto_deseado',
        atomicComposition: { C: 17, H: 19, N: 1, O: 4 },
        calculatedMw: 301.34
      }
    ],
    options: [
      'PM Benzaldehído = 106,12 g/mol (25,0 mmol, Limitante); PM DHPP = 301,34 g/mol; Rendimiento = 75,0%',
      'PM Benzaldehído = 120,15 g/mol; PM DHPP = 320,30 g/mol; Rendimiento = 64,5%',
      'PM Acetoacetato = 116,12 g/mol (Limitante); PM DHPP = 301,34 g/mol; Rendimiento = 88,2%',
      'PM Benzaldehído = 106,12 g/mol; PM DHPP = 301,34 g/mol; Rendimiento = 85,3%'
    ],
    correctOptionIndex: 0,
    explanation: `1) Moles de Benzaldehído (Limitante) = (2,55 mL × 1,04 g/mL) / 106,12 g/mol = 2,652 g / 106,12 = 0,0250 mol (25,0 mmol).\n2) Moles de Acetoacetato de metilo = (5,40 mL × 1,08 g/mL) / 116,12 g/mol = 5,832 g / 116,12 = 0,0502 mol (50,2 mmol, suficiente para 2 eq).\n3) Masa teórica DHPP = 0,0250 mol × 301,34 g/mol = 7,5335 g.\n4) Rendimiento = (5,65 g / 7,5335 g) × 100 = 75,00%.`,
    hints: [
      'Recuerda que en la síntesis de Hantzsch entran 2 equivalentes de β-cetoéster por cada 1 de aldehído.',
      'Suma los átomos de carbono, hidrógeno, nitrógeno y oxígeno para deducir el PM del DHPP.'
    ]
  },
  {
    id: 'exam_q8_analog_yield',
    category: 'rendimiento',
    title: 'Variante de Examen con Análogo Fenólico: Síntesis de Metoprolol Intermedio',
    scenario: 'En un examen de prácticas se propone sintetizar el epóxido intermediario del betabloqueante Metoprolol utilizando 4-(2-metoxietil)fenol (3,04 g) y 2,50 mL de Epiclorhidrina (d = 1,18 g/mL). Tras purificación se obtienen 3,54 g del epóxido puro.',
    questionText: 'Resuelve los pesos moleculares de los compuestos a partir de sus estructuras químicas y halla el rendimiento porcentual de esta etapa.',
    requiresMwCalculation: true,
    structures: [
      {
        name: '4-(2-Metoxietil)fenol (Reactivo A)',
        smiles: 'COCCc1ccc(O)cc1',
        formula: 'C9H12O2',
        amount: '3,04 g',
        role: 'reactivo_limitante_potencial',
        atomicComposition: { C: 9, H: 12, O: 2 },
        calculatedMw: 152.19
      },
      {
        name: 'Epiclorhidrina (Reactivo B)',
        smiles: 'ClCC1CO1',
        formula: 'C3H5ClO',
        amount: '2,50 mL (d = 1,18 g/mL)',
        density: 1.18,
        role: 'reactivo_exceso',
        atomicComposition: { C: 3, H: 5, Cl: 1, O: 1 },
        calculatedMw: 92.52
      },
      {
        name: 'Epóxido de Metoprolol (Producto)',
        smiles: 'COCCc1ccc(OCC2CO2)cc1',
        formula: 'C12H16O3',
        role: 'producto_deseado',
        atomicComposition: { C: 12, H: 16, O: 3 },
        calculatedMw: 208.25
      }
    ],
    options: [
      'PM Fenol = 152,19 g/mol (20,0 mmol, Limitante); PM Epóxido = 208,25 g/mol; Rendimiento = 85,0%',
      'PM Fenol = 138,16 g/mol; PM Epóxido = 194,22 g/mol; Rendimiento = 72,4%',
      'PM Fenol = 152,19 g/mol; PM Epóxido = 208,25 g/mol; Rendimiento = 93,1%',
      'PM Epiclorhidrina = 92,52 g/mol (Limitante); Rendimiento = 65,8%'
    ],
    correctOptionIndex: 0,
    explanation: `1) Pesos Moleculares deducidos:\n• 4-(2-Metoxietil)fenol (C9H12O2): (9 × 12,011) + (12 × 1,008) + (2 × 15,999) = 152,19 g/mol.\n• Epiclorhidrina (C3H5ClO): (3 × 12,011) + (5 × 1,008) + 35,453 + 15,999 = 92,52 g/mol.\n• Epóxido intermediario (C12H16O3): (12 × 12,011) + (16 × 1,008) + (3 × 15,999) = 208,25 g/mol.\n\n2) Moles:\n• n(Fenol) = 3,04 g / 152,19 g/mol = 0,01997 mol = 20,0 mmol (LIMITANTE).\n• n(Epiclorhidrina) = (2,50 × 1,18) / 92,52 = 2,95 g / 92,52 = 31,88 mmol (EXCESO).\n\n3) Masa teórica de epóxido = 0,0200 mol × 208,25 g/mol = 4,165 g.\n4) Rendimiento = (3,54 g / 4,165 g) × 100 = 85,00%.`,
    hints: [
      'Determina la fórmula molecular de 4-(2-metoxietil)fenol contando 9 C, 12 H y 2 O.',
      'Comprueba que el fenol es el reactivo limitante frente al exceso de epiclorhidrina.'
    ]
  },
  {
    id: 'exam_q9_nifedipine_hantzsch_yield',
    category: 'rendimiento',
    title: 'Síntesis de Nifedipina (2-Nitrobenzaldehído) con Resolución Estructural',
    scenario: 'Para preparar el fármaco antihipertensivo Nifedipina se hacen reaccionar 3,02 g de 2-Nitrobenzaldehído con 5,00 mL de Acetoacetato de metilo (d = 1,08 g/mL) y amoníaco concentrado. Tras cristalización en metanol se obtienen 5,20 g de Nifedipina pura.',
    questionText: 'Determina las masas molares de partida y producto a partir de sus fórmulas estructurales y calcula el rendimiento porcentual obtenido de Nifedipina.',
    requiresMwCalculation: true,
    structures: [
      {
        name: '2-Nitrobenzaldehído (Reactivo A)',
        smiles: 'O=Cc1ccccc1[N+](=O)[O-]',
        formula: 'C7H5NO3',
        amount: '3,02 g',
        role: 'reactivo_limitante_potencial',
        atomicComposition: { C: 7, H: 5, N: 1, O: 3 },
        calculatedMw: 151.12
      },
      {
        name: 'Acetoacetato de metilo (Reactivo B, 2 eq)',
        smiles: 'COC(=O)CC(C)=O',
        formula: 'C5H8O3',
        amount: '5,00 mL (d = 1,08 g/mL)',
        density: 1.08,
        role: 'reactivo_exceso',
        atomicComposition: { C: 5, H: 8, O: 3 },
        calculatedMw: 116.12
      },
      {
        name: 'Nifedipina (Fármaco Dihidropiridínico)',
        smiles: 'COC(=O)C1=C(C)NC(C)=C(C1c2ccccc2[N+](=O)[O-])C(=O)OC',
        formula: 'C17H18N2O6',
        role: 'producto_deseado',
        atomicComposition: { C: 17, H: 18, N: 2, O: 6 },
        calculatedMw: 346.33
      }
    ],
    options: [
      'PM 2-Nitrobenzaldehído = 151,12 g/mol (20,0 mmol, Limitante); PM Nifedipina = 346,33 g/mol; Rendimiento = 75,1%',
      'PM 2-Nitrobenzaldehído = 165,14 g/mol; PM Nifedipina = 360,35 g/mol; Rendimiento = 64,2%',
      'PM Acetoacetato = 116,12 g/mol (Limitante); PM Nifedipina = 346,33 g/mol; Rendimiento = 88,5%',
      'PM 2-Nitrobenzaldehído = 151,12 g/mol; PM Nifedipina = 301,34 g/mol; Rendimiento = 58,0%'
    ],
    correctOptionIndex: 0,
    explanation: `1) Pesos Moleculares deducidos:\n• 2-Nitrobenzaldehído (C7H5NO3): (7 × 12,011) + (5 × 1,008) + 14,007 + (3 × 15,999) = 151,12 g/mol.\n• Acetoacetato de metilo (C5H8O3): (5 × 12,011) + (8 × 1,008) + (3 × 15,999) = 116,12 g/mol.\n• Nifedipina (C17H18N2O6): (17 × 12,011) + (18 × 1,008) + (2 × 14,007) + (6 × 15,999) = 346,33 g/mol.\n\n2) Moles:\n• n(2-Nitrobenzaldehído) = 3,02 g / 151,12 g/mol = 0,01998 mol = 20,0 mmol (LIMITANTE).\n• n(Acetoacetato) = (5,00 mL × 1,08 g/mL) / 116,12 = 5,40 g / 116,12 = 46,5 mmol (se requerían 40,0 mmol para 2 eq, por tanto está en exceso).\n\n3) Masa teórica máxima de Nifedipina = 0,0200 mol × 346,33 g/mol = 6,9266 g.\n4) Rendimiento porcentual = (5,20 g / 6,9266 g) × 100 = 75,07% ≈ 75,1%.`,
    hints: [
      'No olvides contar el grupo nitro (-NO2) que aporta 1 N y 2 O adicionales a la fórmula de la Nifedipina respecto al DHPP.',
      'Comprueba que el aldehído nitroderivado es el reactivo limitante.'
    ]
  },
  {
    id: 'exam_q3_nmr_differentiation',
    category: 'espectroscopia',
    title: 'Diferenciación Espectroscópica por ¹H RMN entre DHPP y Nifedipina',
    scenario: 'En el laboratorio se analizan dos viales de 1,4-dihidropiridinas sin etiquetar (uno contiene DHPP y el otro Nifedipina). Se registra el espectro de ¹H RMN en CDCl₃ de ambos compuestos.',
    questionText: '¿Cuál es la diferencia más determinante en el espectro de ¹H RMN para distinguir inequívocamente Nifedipina de DHPP?',
    options: [
      'El protón C4-H resuena a δ = 5,00 ppm en DHPP, mientras que en Nifedipina se desapantalla hasta δ = 5,72 ppm por el efecto anisotrópico del grupo orto-nitro (-NO₂).',
      'DHPP presenta 6 protones de éster mientras que Nifedipina no tiene ésteres.',
      'Los metilos C2/C6 resuenan a 1,2 ppm en Nifedipina y a 4,5 ppm en DHPP.',
      'Nifedipina no presenta señal de N-H en RMN.'
    ],
    correctOptionIndex: 0,
    explanation: 'El grupo -NO₂ en posición orto del anillo fenilo en la Nifedipina ejerce un potente efecto atractor de electrones y desapantallamiento anisotrópico sobre el protón adyacente C4-H, desplazando su señal desde 5,00 ppm (en DHPP) hasta 5,72 ppm (en Nifedipina). Además, el anillo aromático pasa de ser un multiplete de 5H (fenilo no sustituido) a un patrón ABCD de 4H (2-nitrofenilo).',
    hints: [
      'Compara la posición del protón C4-H en los espectros de las páginas 15 y 19 del cuaderno.'
    ]
  },
  {
    id: 'exam_q4_dept135_propranolol',
    category: 'espectroscopia',
    title: 'Interpretación del Espectro DEPT-135 de Propranolol',
    scenario: 'Al analizar el espectro DEPT-135 de Propranolol (página 13 del cuaderno), se observan dos señales que apuntan hacia abajo (intensidad negativa) a desplazamientos químicos de δ = 48,33 ppm y δ = 69,60 ppm.',
    questionText: '¿Qué tipo de carbonos representan estas señales invertidas en DEPT-135 y a qué grupos de la molécula corresponden?',
    options: [
      'Representan carbonos metilénicos (-CH₂-); 48,33 ppm corresponde al -CH₂-NH- y 69,60 ppm al metileno ariloxílico -O-CH₂-.',
      'Representan carbonos metínicos (-CH-); 48,33 ppm corresponde al -CH(OH)- y 69,60 ppm al isopropilo.',
      'Representan carbonos cuaternarios (Cq) del anillo de naftaleno.',
      'Representan los metilos (-CH₃) del grupo isopropilo.'
    ],
    correctOptionIndex: 0,
    explanation: 'En la técnica DEPT-135: 1) Los grupos CH₃ y CH dan señales POSITIVAS (hacia arriba). 2) Los grupos CH₂ dan señales NEGATIVAS (invertidas hacia abajo). 3) Los carbonos cuaternarios NO aparecen. Por tanto, las señales negativas a 48,33 ppm (-CH₂-NH-) y 69,60 ppm (-O-CH₂-) confirman la presencia de los dos grupos metileno de la cadena propanolamina.',
    hints: [
      'Recuerda la regla mnemotécnica del DEPT-135: Metilenos (CH₂) hacia abajo; Metilos (CH₃) y Metinos (CH) hacia arriba.'
    ]
  },
  {
    id: 'exam_q5_propranolol_acid_base',
    category: 'material_y_operaciones',
    title: 'Fundamento Químico del Tratamiento Ácido-Base del Propranolol',
    scenario: 'Tras hacer reaccionar el oxirano con isopropilamina y evaporar el exceso de amina, el crudo se disuelve en diclorometano (DCM) y se lava con HCl 2 N, tras lo cual se separa la fase acuosa y se le añade NaOH 5 N.',
    questionText: '¿Por qué el propranolol pasa a la fase acuosa con HCl y precipita al añadir NaOH?',
    options: [
      'Al añadir HCl se protona el grupo amino formando la sal de clorhidrato hidrosoluble (R-NH₂⁺-iPr Cl⁻); al añadir NaOH se desprotona regenerando la base libre neutra insoluble en agua que precipita.',
      'Al añadir HCl se hidroliza el éter naftílico haciéndolo soluble; al añadir NaOH se vuelve a formar el éter.',
      'El HCl oxida el alcohol secundario a cetona y el NaOH lo reduce.',
      'El HCl disuelve el diclorometano en agua formando una sola fase.'
    ],
    correctOptionIndex: 0,
    explanation: 'El propranolol es una amina secundaria básica. Con HCl forma el catión propranolol-amonio con su contraión cloruro, que al ser iónico es altamente soluble en agua y abandona la fase orgánica (DCM), separándose de impurezas neutras y lipófilas. Al basificar con NaOH (pH > 9-10), se neutraliza el protón amónico convirtiéndose en la base libre neutra e hidrofóbica, que precipita inmediatamente.',
    hints: [
      "Piensa en el equilibrio ácido-base de una amina: R-NH-R' + H⁺ <==> R-NH₂⁺-R'."
    ]
  },
  {
    id: 'exam_q6_reflux_equipment',
    category: 'material_y_operaciones',
    title: 'Material y Montaje de Reflujo en Síntesis Orgánica',
    scenario: 'Para llevar a cabo la síntesis de DHPP durante 2 horas a reflujo en etanol, se debe seleccionar el material de laboratorio adecuado del puesto de prácticas.',
    questionText: '¿Qué conjunto de elementos es indispensable para el correcto montaje de reflujo y cuál es la función del Lab-jack y el plato poroso?',
    options: [
      'Matraz esférico de 100 mL, refrigerante de bolas, placa calefactora con agitación magnética sobre Lab-jack, pinza sujeta al cuello del matraz y circuito de agua con entrada inferior; el Lab-jack permite retirar el calor al instante y el plato poroso/imán asegura ebullición suave.',
      'Vaso de precipitados de 250 mL, embudo Büchner y manta calefactora; el plato poroso sirve como catalizador.',
      'Matraz Erlenmeyer con tapón cerrado hermético y manta al máximo; el plato poroso absorbe el amoníaco.',
      'Embudo de decantación y refrigerante; el plato poroso neutraliza el ácido.'
    ],
    correctOptionIndex: 0,
    explanation: 'Un montaje de reflujo consta de matraz esférico (nunca vaso ni matraz plano), refrigerante con circulación de agua a contracorriente (entrada por abajo), placa calefactora SIEMPRE sobre Lab-jack (seguridad térmica) y pinza de sujeción al cuello. ¡NUNCA debe cerrarse herméticamente el extremo superior del refrigerante! El imán o plato poroso proporciona sitios de nucleación para evitar sobrecalentamiento y proyecciones violentas.',
    hints: [
      'Revisa la lista de material del puesto (página 23 del cuaderno) y el esquema del montaje de reflujo.'
    ]
  },
  {
    id: 'exam_q7_solution_calc',
    category: 'disoluciones',
    title: 'Cálculo de Preparación de Disolución de NaOH para Neutralización',
    scenario: 'Se te pide preparar 100 mL de una disolución acuosa de NaOH 2,5 N para neutralizar las fracciones ácidas del propranolol a partir de lentejas comerciales de NaOH con una pureza del 98,0% (PM NaOH = 40,00 g/mol).',
    questionText: '¿Qué masa de reactivo comercial debes pesar en la balanza?',
    numericAnswer: 10.20,
    tolerance: 0.15,
    unit: 'g',
    options: [
      '10,20 g de NaOH comercial',
      '10,00 g de NaOH comercial',
      '5,10 g de NaOH comercial',
      '2,50 g de NaOH comercial'
    ],
    correctOptionIndex: 0,
    explanation: '1) Moles = M × V = 2,5 mol/L × 0,100 L = 0,250 moles. 2) Masa pura = 0,250 mol × 40,00 g/mol = 10,00 g. 3) Corrección de pureza: Masa a pesar = 10,00 g / 0,98 = 10,204 g ≈ 10,20 g.',
    hints: [
      'Calcula primero los moles puros (M × V), luego la masa pura (n × PM) y finalmente divide por la fracción de pureza (0,98).'
    ]
  },
  {
    id: 'exam_q10_hcl_dilution',
    category: 'disoluciones',
    title: 'Dilución de HCl Concentrado Comercial a HCl 2 N',
    scenario: 'Se necesitan 250 mL de HCl 2 N para los lavados ácidos de la fase orgánica del propranolol. Se dispone de HCl concentrado comercial con una riqueza del 37% en peso y una densidad de 1,19 g/mL (PM HCl = 36,46 g/mol).',
    questionText: '¿Qué volumen de HCl concentrado comercial debes medir con la probeta para preparar 250 mL de disolución 2 N?',
    numericAnswer: 41.4,
    tolerance: 0.5,
    unit: 'mL',
    options: [
      '41,4 mL de HCl concentrado',
      '50,0 mL de HCl concentrado',
      '25,0 mL de HCl concentrado',
      '82,8 mL de HCl concentrado'
    ],
    correctOptionIndex: 0,
    explanation: '1) Moles necesarios = M × V = 2,0 mol/L × 0,250 L = 0,500 moles.\n2) Masa de HCl puro = 0,500 mol × 36,46 g/mol = 18,23 g.\n3) Masa de HCl comercial (37%) = 18,23 g / 0,37 = 49,27 g.\n4) Volumen de HCl comercial = masa / densidad = 49,27 g / 1,19 g/mL = 41,40 mL.\n\nProcedimiento: Medir 41,4 mL de HCl conc. con probeta, verter sobre ~150 mL de agua destilada ya colocada en el matraz aforado de 250 mL (¡SIEMPRE ácido sobre agua!), agitar y enrasar a 250 mL.',
    hints: [
      'Calcula primero los moles puros necesarios (M × V), luego la masa pura (n × PM), corrige con la riqueza y convierte a volumen con la densidad.',
      'Recuerda: ¡NUNCA verter agua sobre ácido concentrado! Siempre ácido sobre agua.'
    ]
  },
  {
    id: 'exam_q11_naoh_solid_dissolution',
    category: 'disoluciones',
    title: 'Preparación de NaOH 5 N a partir de Sólido Comercial',
    scenario: 'Para la precipitación del propranolol base libre se necesitan 50 mL de NaOH 5 N. Se dispone de lentejas de NaOH con pureza del 97% (PM NaOH = 40,00 g/mol).',
    questionText: '¿Qué masa de NaOH comercial debes pesar en la balanza analítica?',
    numericAnswer: 10.31,
    tolerance: 0.15,
    unit: 'g',
    options: [
      '10,31 g de NaOH comercial',
      '10,00 g de NaOH comercial',
      '20,00 g de NaOH comercial',
      '5,15 g de NaOH comercial'
    ],
    correctOptionIndex: 0,
    explanation: '1) Moles = M × V = 5,0 mol/L × 0,050 L = 0,250 moles.\n2) Masa pura = 0,250 mol × 40,00 g/mol = 10,00 g.\n3) Corrección de pureza: Masa a pesar = 10,00 g / 0,97 = 10,31 g.\n\nProcedimiento: Pesar 10,31 g en pesasustancias, disolver en ~30 mL de agua destilada en un vaso de precipitados (¡reacción exotérmica!), dejar enfriar y transferir al matraz aforado de 50 mL.',
    hints: [
      'La disolución de NaOH sólido en agua es fuertemente exotérmica; añade las lentejas lentamente sobre el agua agitando.',
      'Divide siempre la masa pura calculada por la fracción de pureza (0,97).'
    ]
  },
  {
    id: 'exam_q12_v1m1_v2m2_dilution',
    category: 'disoluciones',
    title: 'Dilución V₁M₁ = V₂M₂: Preparar HCl 0,5 N a partir de HCl 2 N',
    scenario: 'Un estudiante ha preparado ya una disolución madre de HCl 2 N. Ahora necesita preparar 100 mL de HCl 0,5 N para un lavado ácido suave.',
    questionText: 'Aplicando la ecuación de dilución V₁M₁ = V₂M₂, ¿qué volumen de HCl 2 N debes tomar?',
    numericAnswer: 25.0,
    tolerance: 0.5,
    unit: 'mL',
    options: [
      '25,0 mL de HCl 2 N, completar hasta 100 mL con agua destilada',
      '50,0 mL de HCl 2 N, completar hasta 100 mL',
      '12,5 mL de HCl 2 N, completar hasta 100 mL',
      '100 mL de HCl 2 N sin diluir'
    ],
    correctOptionIndex: 0,
    explanation: 'Aplicando V₁ × M₁ = V₂ × M₂:\nV₁ × 2,0 N = 100 mL × 0,5 N\nV₁ = (100 × 0,5) / 2,0 = 25,0 mL.\n\nMedir 25,0 mL de HCl 2 N con probeta, verter en matraz aforado con agua y enrasar a 100 mL.',
    hints: [
      'La fórmula de dilución V₁M₁ = V₂M₂ es válida siempre que no haya reacción química, solo dilución.',
      'Despeja V₁ = (V₂ × M₂) / M₁.'
    ]
  },
  {
    id: 'exam_q13_ethanol_dilution',
    category: 'disoluciones',
    title: 'Preparación de Etanol 70% v/v a partir de Etanol del 96%',
    scenario: 'Para los lavados de cristales de DHPP sobre el embudo Büchner se requieren 50 mL de etanol frío al 70% v/v. Se dispone de etanol del 96% v/v.',
    questionText: '¿Qué volumen de etanol al 96% debes medir para preparar 50 mL de etanol al 70% v/v?',
    numericAnswer: 36.5,
    tolerance: 0.5,
    unit: 'mL',
    options: [
      '36,5 mL de etanol 96%, completar con agua destilada hasta 50 mL',
      '50,0 mL de etanol 96% sin diluir',
      '25,0 mL de etanol 96%',
      '45,0 mL de etanol 96%'
    ],
    correctOptionIndex: 0,
    explanation: 'Aplicando C₁V₁ = C₂V₂ para concentraciones % v/v:\n96% × V₁ = 70% × 50 mL\nV₁ = (70 × 50) / 96 = 3500 / 96 = 36,46 mL ≈ 36,5 mL.\n\nMedir 36,5 mL de etanol 96% y completar hasta 50 mL con agua destilada. Enfriar en baño de hielo antes de lavar los cristales.',
    hints: [
      'Se aplica la misma ley de dilución que con las concentraciones molares: C₁V₁ = C₂V₂.',
      'El etanol frío minimiza la pérdida de producto por disolución parcial.'
    ]
  },
  {
    id: 'exam_q14_molarity_from_grams',
    category: 'disoluciones',
    title: 'Calcular la Molaridad de una Disolución de NaCl Preparada por Pesada',
    scenario: 'Un alumno disuelve 11,70 g de NaCl (PM = 58,44 g/mol; pureza 99,5%) en agua destilada y enrasa a 500 mL en un matraz aforado.',
    questionText: '¿Cuál es la molaridad exacta de la disolución preparada?',
    numericAnswer: 0.398,
    tolerance: 0.005,
    unit: 'M',
    options: [
      '0,398 M (teniendo en cuenta la pureza del 99,5%)',
      '0,400 M (sin corrección de pureza)',
      '0,200 M',
      '0,500 M'
    ],
    correctOptionIndex: 0,
    explanation: '1) Masa pura de NaCl = 11,70 g × 0,995 = 11,64 g.\n2) Moles de NaCl = 11,64 g / 58,44 g/mol = 0,19918 mol.\n3) Molaridad = moles / volumen(L) = 0,19918 mol / 0,500 L = 0,3984 M ≈ 0,398 M.\n\nSi no se corrige la pureza: n = 11,70 / 58,44 = 0,2001 mol → M = 0,400 M (sobreestimación del 0,5%).',
    hints: [
      'Siempre corrige la masa pesada por la pureza del reactivo antes de calcular los moles.',
      'M = n / V(L), donde n = masa_pura / PM.'
    ]
  },
  {
    id: 'exam_q15_liquid_reagent_volume',
    category: 'disoluciones',
    title: 'Volumen de Ácido Acético Glacial para Preparar una Disolución 1 M',
    scenario: 'Se necesitan 200 mL de ácido acético (CH₃COOH) 1 M para acidificar un medio de reacción. Se dispone de ácido acético glacial con d = 1,049 g/mL y pureza del 99,8% (PM = 60,05 g/mol).',
    questionText: '¿Qué volumen de ácido acético glacial debes pipetear?',
    numericAnswer: 11.46,
    tolerance: 0.2,
    unit: 'mL',
    options: [
      '11,46 mL de ácido acético glacial',
      '12,01 mL de ácido acético glacial',
      '20,00 mL de ácido acético glacial',
      '6,00 mL de ácido acético glacial'
    ],
    correctOptionIndex: 0,
    explanation: '1) Moles necesarios = 1,0 M × 0,200 L = 0,200 mol.\n2) Masa pura = 0,200 mol × 60,05 g/mol = 12,01 g.\n3) Masa comercial = 12,01 g / 0,998 = 12,03 g.\n4) Volumen = 12,03 g / 1,049 g/mL = 11,47 mL ≈ 11,46 mL.\n\nMedir con probeta de 50 mL y verter sobre ~150 mL de agua destilada. Enrasar a 200 mL.',
    hints: [
      'Para reactivos líquidos puros: V = masa_comercial / densidad.',
      'La secuencia es: moles → masa pura → masa comercial (÷ pureza) → volumen (÷ densidad).'
    ]
  }
];

// ==========================================================================
// Cuaderno por Parejas y Recepción Docente
// ==========================================================================

export interface LabPairReport {
  id: string;
  grupo?: string;
  puesto: number;
  turno: '8:30-11:30' | '11:30-14:30' | '16:00-19:00' | string;
  fecha: string;
  student1: {
    nombre: string;
    dni?: string;
    email: string;
  };
  student2: {
    nombre: string;
    dni?: string;
    email: string;
  };
  step1: {
    mass1Naftol: number;
    volEpiclorhidrina: number;
    massNaOH: number;
    massProductCrude: number;
    yieldPercentage: number;
    aspect: string;
    observations: string;
  };
  step2: {
    massOxirane: number;
    volIsopropilamina: number;
    massProductBase: number;
    yieldStage: number;
    yieldAccumulated: number;
    meltingPointObserved: string;
    meltingPointReference: string;
    tlcRf: string;
    observations: string;
  };
  step3: {
    compoundType: 'DHPP' | 'Nifedipina';
    amountAldehyde: string;
    volMethylAcetoacetate: number;
    volNH3Conc: number;
    massProduct: number;
    yieldPercentage: number;
    meltingPointObserved: string;
    meltingPointReference: string;
    crystalHabit: string;
    observations: string;
  };
  cuestiones: {
    q1_dcm_density: string;
    q2_nmr_c4_proton: string;
    q3_reflux_safety: string;
  };
  status: 'Borrador' | 'Entregado' | 'Calificado';
  submittedAt?: string;
  profesorGrade?: number;
  profesorFeedback?: string;
  gradedAt?: string;
}

export const LAB_PAIR_REPORTS_DEFAULT: LabPairReport[] = [
  {
    id: 'GPE-P04',
    grupo: 'Grupo E',
    puesto: 4,
    turno: 'Mañana',
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
      observations: 'Extracción en 3 fracciones de DCM de 15 mL cada una. Secado sobre Na2SO4 anhidro durante 15 min. Rendimiento muy satisfactorio.'
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
      q3_reflux_safety: 'El tubo debe estar abierto para evitar acumulación de sobrepresiones y explosión; el Lab-jack permite retirar la fuente de calor al instante en caso de ebullición violenta.'
    },
    status: 'Entregado',
    submittedAt: '2026-03-12 13:45'
  },
  {
    id: 'GPE-P07',
    grupo: 'Grupo E',
    puesto: 7,
    turno: 'Mañana',
    fecha: '2026-03-12',
    student1: {
      nombre: 'Lucía Benítez Romero',
      dni: '76541298C',
      email: 'lbenitez@correo.ugr.es'
    },
    student2: {
      nombre: 'Javier Castillo Gil',
      dni: '74823165D',
      email: 'jcastillo@correo.ugr.es'
    },
    step1: {
      mass1Naftol: 3.00,
      volEpiclorhidrina: 2.70,
      massNaOH: 1.20,
      massProductCrude: 3.40,
      yieldPercentage: 81.6,
      aspect: 'Aceite ámbar límpido',
      observations: 'Extracción sin emulsiones.'
    },
    step2: {
      massOxirane: 3.30,
      volIsopropilamina: 6.00,
      massProductBase: 3.45,
      yieldStage: 80.7,
      yieldAccumulated: 65.8,
      meltingPointObserved: '93.0 - 94.5 °C',
      meltingPointReference: '94 - 96 °C',
      tlcRf: 'Rf = 0.40',
      observations: 'Sólido cristalino ligeramente húmedo tras primer secado.'
    },
    step3: {
      compoundType: 'Nifedipina',
      amountAldehyde: '3.02 g 2-Nitrobenzaldehído',
      volMethylAcetoacetate: 5.00,
      volNH3Conc: 4.50,
      massProduct: 5.15,
      yieldPercentage: 74.3,
      meltingPointObserved: '172.5 - 174.0 °C',
      meltingPointReference: '172 - 174 °C',
      crystalHabit: 'Cristales amarillos intensos',
      observations: 'Recristalizado en metanol templado. Color amarillo nítido.'
    },
    cuestiones: {
      q1_dcm_density: 'Por su densidad de 1,33 g/mL (mayor que el agua), la fase orgánica queda abajo.',
      q2_nmr_c4_proton: 'En Nifedipina el protón C4-H se desapantalla hasta 5,72 ppm debido al grupo orto-nitro.',
      q3_reflux_safety: 'Evitar sobrepresión cerrando el circuito y poder bajar la placa rápidamente con el soporte de tijera.'
    },
    status: 'Calificado',
    submittedAt: '2026-03-12 13:50',
    profesorGrade: 9.5,
    profesorFeedback: 'Excelente trabajo experimental. Rendimientos óptimos, pureza reflejada en los puntos de fusión ajustados y respuestas precisas.',
    gradedAt: '2026-03-13 10:15'
  }
];
