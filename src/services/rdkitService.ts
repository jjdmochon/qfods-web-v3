// ==========================================================================
// RDKit MinimalLib (WASM) — carga única y utilidades de renderizado 2D
// La librería se sirve desde CDN (ver <script> en index.html).
// ==========================================================================

export interface RDKitMol {
  get_svg_with_highlights: (details: string) => string;
  get_svg: (width: number, height: number) => string;
  get_descriptors: () => string;
  get_morgan_fp?: () => string;
  is_valid: () => boolean;
  delete: () => void;
}

export interface RDKitModule {
  get_mol: (smiles: string) => RDKitMol | null;
  get_qmol: (smarts: string) => RDKitMol | null;
  version: () => string;
}

declare global {
  interface Window {
    initRDKitModule?: (config?: Record<string, unknown>) => Promise<RDKitModule>;
    RDKit?: RDKitModule;
  }
}

let rdkitPromise: Promise<RDKitModule> | null = null;

/**
 * Inicializa RDKit una sola vez y devuelve siempre la misma instancia.
 * Espera a que el <script> del CDN haya definido window.initRDKitModule.
 */
export function loadRDKit(): Promise<RDKitModule> {
  if (rdkitPromise) return rdkitPromise;

  rdkitPromise = new Promise<RDKitModule>((resolve, reject) => {
    const start = Date.now();
    const TIMEOUT_MS = 20000;

    const attempt = () => {
      if (window.RDKit) {
        resolve(window.RDKit);
        return;
      }
      if (typeof window.initRDKitModule === 'function') {
        window
          .initRDKitModule()
          .then(instance => {
            window.RDKit = instance;
            resolve(instance);
          })
          .catch(reject);
        return;
      }
      if (Date.now() - start > TIMEOUT_MS) {
        reject(new Error('RDKit no se pudo cargar desde el CDN.'));
        return;
      }
      setTimeout(attempt, 60);
    };

    attempt();
  });

  return rdkitPromise;
}

export interface MolDescriptors {
  MolWt: number;
  ALOGP: number;
  NumHBD: number;
  NumHBA: number;
  TPSA: number;
  NumRotatableBonds: number;
  NumAromaticRings: number;
  NumRings: number;
  FractionCSP3: number;
  NumHeavyAtoms: number;
  exactmw?: number;
  lipinskiHBA?: number;
  lipinskiHBD?: number;
}

/**
 * Calcula descriptores moleculares reales con RDKit.
 * Devuelve null si el SMILES no es válido.
 */
export async function computeDescriptors(smiles: string): Promise<MolDescriptors | null> {
  if (!smiles?.trim()) return null;
  try {
    const RDKit = await loadRDKit();
    const mol = RDKit.get_mol(smiles);
    if (!mol) return null;
    if (!mol.is_valid()) {
      mol.delete();
      return null;
    }
    const raw = JSON.parse(mol.get_descriptors());
    mol.delete();

    return {
      MolWt: raw.amw ?? raw.exactmw ?? 0,
      exactmw: raw.exactmw,
      ALOGP: raw.CrippenClogP ?? 0,
      NumHBD: raw.NumHBD ?? raw.lipinskiHBD ?? 0,
      NumHBA: raw.NumHBA ?? raw.lipinskiHBA ?? 0,
      lipinskiHBA: raw.lipinskiHBA,
      lipinskiHBD: raw.lipinskiHBD,
      TPSA: raw.tpsa ?? 0,
      NumRotatableBonds: raw.NumRotatableBonds ?? 0,
      NumAromaticRings: raw.NumAromaticRings ?? 0,
      NumRings: raw.NumRings ?? 0,
      FractionCSP3: raw.FractionCSP3 ?? 0,
      NumHeavyAtoms: raw.NumHeavyAtoms ?? 0
    };
  } catch {
    return null;
  }
}

/** Comprueba si un SMILES es químicamente válido según RDKit. */
export async function isValidSmiles(smiles: string): Promise<boolean> {
  if (!smiles?.trim()) return false;
  try {
    const RDKit = await loadRDKit();
    const mol = RDKit.get_mol(smiles);
    if (!mol) return false;
    const valid = mol.is_valid();
    mol.delete();
    return valid;
  } catch {
    return false;
  }
}

/**
 * Genera el SVG 2D de una molécula con la paleta y opciones del curso.
 * `highlightSmarts` resalta un farmacóforo o subestructura si se indica.
 */
export async function renderMoleculeSvg(
  smiles: string,
  options: {
    width?: number;
    height?: number;
    dark?: boolean;
    highlightSmarts?: string;
    addStereoAnnotation?: boolean;
  } = {}
): Promise<string | null> {
  const {
    width = 260,
    height = 180,
    dark = false,
    highlightSmarts,
    addStereoAnnotation = true
  } = options;

  if (!smiles?.trim()) return null;

  try {
    const RDKit = await loadRDKit();
    const mol = RDKit.get_mol(smiles);
    if (!mol) return null;
    if (!mol.is_valid()) {
      mol.delete();
      return null;
    }

    const details: Record<string, unknown> = {
      width,
      height,
      bondLineWidth: 1.6,
      multipleBondOffset: 0.16,
      fixedBondLength: 0,
      backgroundColour: [0, 0, 0, 0],
      addStereoAnnotation,
      explicitMethyl: false,
      addAtomIndices: false,
      // Paleta CPK ajustada a la identidad visual del curso
      atomColourPalette: dark
        ? {
            0: [0.85, 0.88, 0.94],   // default / C
            6: [0.85, 0.88, 0.94],   // C
            7: [0.42, 0.65, 1.0],    // N
            8: [1.0, 0.45, 0.42],    // O
            9: [0.35, 0.85, 0.55],   // F
            15: [1.0, 0.62, 0.3],    // P
            16: [0.98, 0.78, 0.28],  // S
            17: [0.3, 0.85, 0.6],    // Cl
            35: [0.85, 0.45, 0.35],  // Br
            53: [0.72, 0.55, 0.95]   // I
          }
        : {
            0: [0.12, 0.16, 0.24],
            6: [0.12, 0.16, 0.24],
            7: [0.15, 0.39, 0.92],
            8: [0.86, 0.15, 0.15],
            9: [0.09, 0.64, 0.29],
            15: [0.92, 0.35, 0.05],
            16: [0.85, 0.47, 0.02],
            17: [0.02, 0.59, 0.41],
            35: [0.6, 0.11, 0.11],
            53: [0.49, 0.23, 0.93]
          }
    };

    // Resaltado de subestructura por SMARTS (farmacóforo)
    if (highlightSmarts) {
      const qmol = RDKit.get_qmol(highlightSmarts);
      if (qmol) {
        try {
          const matchJson = (mol as unknown as {
            get_substruct_matches: (q: RDKitMol) => string;
          }).get_substruct_matches(qmol);
          const matches = JSON.parse(matchJson);
          if (Array.isArray(matches) && matches.length > 0) {
            const atoms: number[] = [];
            const bonds: number[] = [];
            matches.forEach((m: { atoms?: number[]; bonds?: number[] }) => {
              if (m.atoms) atoms.push(...m.atoms);
              if (m.bonds) bonds.push(...m.bonds);
            });
            details.atoms = atoms;
            details.bonds = bonds;
            details.highlightColour = [0.05, 0.72, 0.65, 0.32];
          }
        } catch {
          /* el resaltado es opcional: si falla, se dibuja sin él */
        }
        qmol.delete();
      }
    }

    const svg = mol.get_svg_with_highlights(JSON.stringify(details));
    mol.delete();
    return svg;
  } catch {
    return null;
  }
}
