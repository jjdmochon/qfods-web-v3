/**
 * ============================================================================
 * PubChem PUG REST API Client
 * Specification: https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest
 * QFDOS v3 - Grado en Farmacia (Universidad de Granada)
 * ============================================================================
 * 
 * Standard PUG REST URL structure:
 * https://pubchem.ncbi.nlm.nih.gov/rest/pug/<input specification>/<operation specification>/[<output specification>][?<operation_options>]
 */

export interface PubChemCompoundData {
  cid: number;
  name?: string;
  molecularFormula?: string;
  molecularWeight?: number;
  canonicalSmiles?: string;
  isomericSmiles?: string;
  inchi?: string;
  inchiKey?: string;
  iupacName?: string;
  xlogp?: number;
  exactMass?: number;
  tpsa?: number;
  complexity?: number;
  hbd?: number; // HBondDonorCount
  hba?: number; // HBondAcceptorCount
  rotatableBonds?: number; // RotatableBondCount
  heavyAtoms?: number; // HeavyAtomCount
  synonyms?: string[];
  description?: string;
  descriptionSource?: string;
}

export interface LipinskiVeberRules {
  mwValid: boolean;        // <= 500 Da
  logPValid: boolean;      // <= 5.0
  hbdValid: boolean;       // <= 5
  hbaValid: boolean;       // <= 10
  tpsaValid: boolean;      // <= 140 Å²
  rotBondsValid: boolean;  // <= 10
  lipinskiViolations: number;
  veberViolations: number;
  isLipinskiCompliant: boolean;
  isVeberCompliant: boolean;
}

const PUG_REST_BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';

// Standard 15 compound properties list for PUG REST queries (CID is omitted because it is returned automatically in the root item)
const PROPERTY_TAGS = [
  'MolecularFormula',
  'MolecularWeight',
  'CanonicalSMILES',
  'IsomericSMILES',
  'InChI',
  'InChIKey',
  'IUPACName',
  'XLogP',
  'ExactMass',
  'TPSA',
  'Complexity',
  'HBondDonorCount',
  'HBondAcceptorCount',
  'RotatableBondCount',
  'HeavyAtomCount'
].join(',');

// Simple in-memory response cache to respect NCBI request guidelines (< 5 req/s)
const propertyCache = new Map<string, PubChemCompoundData>();
const synonymCache = new Map<string, string[]>();
const descriptionCache = new Map<number, string>();

/**
 * Transforma una respuesta PUG REST a la estructura tipada PubChemCompoundData
 */
function parsePubChemPropertyItem(item: any, customName?: string): PubChemCompoundData {
  const smiles = item.CanonicalSMILES || item.ConnectivitySMILES || item.SMILES || item.IsomericSMILES;
  return {
    cid: item.CID,
    name: customName || item.IUPACName || `CID-${item.CID}`,
    molecularFormula: item.MolecularFormula,
    molecularWeight: item.MolecularWeight ? parseFloat(item.MolecularWeight) : undefined,
    canonicalSmiles: smiles,
    isomericSmiles: item.IsomericSMILES || smiles,
    inchi: item.InChI,
    inchiKey: item.InChIKey,
    iupacName: item.IUPACName,
    xlogp: item.XLogP !== undefined ? parseFloat(item.XLogP) : undefined,
    exactMass: item.ExactMass ? parseFloat(item.ExactMass) : undefined,
    tpsa: item.TPSA !== undefined ? parseFloat(item.TPSA) : undefined,
    complexity: item.Complexity !== undefined ? parseFloat(item.Complexity) : undefined,
    hbd: item.HBondDonorCount,
    hba: item.HBondAcceptorCount,
    rotatableBonds: item.RotatableBondCount,
    heavyAtoms: item.HeavyAtomCount
  };
}

/**
 * Autocompletado oficial de PubChem
 * Endpoint: https://pubchem.ncbi.nlm.nih.gov/rest/autocomplete/compound/<term>/json?limit=<limit>
 */
export async function fetchPubChemAutocomplete(
  term: string,
  limit: number = 8,
  signal?: AbortSignal
): Promise<string[]> {
  const clean = term.trim();
  if (!clean || clean.length < 2) return [];

  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/autocomplete/compound/${encodeURIComponent(clean)}/json?limit=${limit}`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.dictionary_terms?.compound || [];
  } catch {
    return [];
  }
}

/**
 * 1. Búsqueda por Nombre de Compuesto
 * Endpoint: /compound/name/<name>/property/<properties>/JSON
 */
export async function searchPubChemByName(
  name: string,
  signal?: AbortSignal
): Promise<PubChemCompoundData | null> {
  const cleanName = name.trim();
  if (!cleanName) return null;

  const cacheKey = `name:${cleanName.toLowerCase()}`;
  if (propertyCache.has(cacheKey)) {
    return propertyCache.get(cacheKey)!;
  }

  const url = `${PUG_REST_BASE}/compound/name/${encodeURIComponent(cleanName)}/property/${PROPERTY_TAGS}/JSON`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) {
      if (res.status === 404) {
        // Intento con autocompletado si hay error 404 (ej. ligeras variaciones de nombre o tildes)
        const suggestions = await fetchPubChemAutocomplete(cleanName, 3, signal);
        if (suggestions.length && suggestions[0].toLowerCase() !== cleanName.toLowerCase()) {
          return searchPubChemByName(suggestions[0], signal);
        }
        return null;
      }
      throw new Error(`PubChem PUG REST error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const props = data?.PropertyTable?.Properties;
    if (!props || !props.length) return null;

    const parsed = parsePubChemPropertyItem(props[0], cleanName);
    propertyCache.set(cacheKey, parsed);
    propertyCache.set(`cid:${parsed.cid}`, parsed);
    return parsed;
  } catch (err: any) {
    if (err.name === 'AbortError') return null;
    console.warn(`[PubChem PUG-REST] Error buscando nombre "${cleanName}":`, err);
    throw err;
  }
}

/**
 * 2. Búsqueda por CID (Compound ID)
 * Endpoint: /compound/cid/<cid>/property/<properties>/JSON
 */
export async function searchPubChemByCid(
  cid: number,
  signal?: AbortSignal
): Promise<PubChemCompoundData | null> {
  if (!cid || cid <= 0) return null;

  const cacheKey = `cid:${cid}`;
  if (propertyCache.has(cacheKey)) {
    return propertyCache.get(cacheKey)!;
  }

  const url = `${PUG_REST_BASE}/compound/cid/${cid}/property/${PROPERTY_TAGS}/JSON`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`PubChem PUG REST error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const props = data?.PropertyTable?.Properties;
    if (!props || !props.length) return null;

    const parsed = parsePubChemPropertyItem(props[0]);
    propertyCache.set(cacheKey, parsed);
    return parsed;
  } catch (err: any) {
    if (err.name === 'AbortError') return null;
    console.warn(`[PubChem PUG-REST] Error buscando CID ${cid}:`, err);
    throw err;
  }
}

/**
 * 3. Búsqueda por Estructura SMILES
 * Endpoint: /compound/smiles/<smiles>/property/<properties>/JSON
 */
export async function searchPubChemBySmiles(
  smiles: string,
  signal?: AbortSignal
): Promise<PubChemCompoundData | null> {
  const cleanSmiles = smiles.trim();
  if (!cleanSmiles) return null;

  const cacheKey = `smiles:${cleanSmiles}`;
  if (propertyCache.has(cacheKey)) {
    return propertyCache.get(cacheKey)!;
  }

  const url = `${PUG_REST_BASE}/compound/smiles/${encodeURIComponent(cleanSmiles)}/property/${PROPERTY_TAGS}/JSON`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`PubChem PUG REST error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const props = data?.PropertyTable?.Properties;
    if (!props || !props.length) return null;

    const parsed = parsePubChemPropertyItem(props[0]);
    propertyCache.set(cacheKey, parsed);
    propertyCache.set(`cid:${parsed.cid}`, parsed);
    return parsed;
  } catch (err: any) {
    if (err.name === 'AbortError') return null;
    console.warn(`[PubChem PUG-REST] Error buscando SMILES:`, err);
    throw err;
  }
}

/**
 * 4. Obtención de Sinónimos, Nombres Comerciales y Códigos Clínicos
 * Endpoint: /compound/cid/<cid>/synonyms/JSON o /compound/name/<name>/synonyms/JSON
 */
export async function fetchPubChemSynonyms(
  cidOrName: number | string,
  maxItems: number = 8,
  signal?: AbortSignal
): Promise<string[]> {
  const isCid = typeof cidOrName === 'number';
  const key = `synonyms:${cidOrName}`;
  if (synonymCache.has(key)) return synonymCache.get(key)!;

  const endpoint = isCid ? `cid/${cidOrName}` : `name/${encodeURIComponent(cidOrName)}`;
  const url = `${PUG_REST_BASE}/compound/${endpoint}/synonyms/JSON`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return [];

    const data = await res.json();
    const synList: string[] = data?.InformationList?.Information?.[0]?.Synonym || [];
    const sliced = synList.slice(0, maxItems);
    synonymCache.set(key, sliced);
    return sliced;
  } catch {
    return [];
  }
}

/**
 * 5. Obtención de Descripción y Monografía Farmacológica
 * Endpoint: /compound/cid/<cid>/description/JSON
 */
export async function fetchPubChemDescription(
  cid: number,
  signal?: AbortSignal
): Promise<{ description: string; source: string } | null> {
  if (descriptionCache.has(cid)) {
    return { description: descriptionCache.get(cid)!, source: 'PubChem' };
  }

  const url = `${PUG_REST_BASE}/compound/cid/${cid}/description/JSON`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return null;

    const data = await res.json();
    const items = data?.InformationList?.Information || [];
    
    // Pick the most relevant descriptive record (usually MeSH Pharmacological Action or NLM)
    for (const item of items) {
      if (item.Description && item.Description.length > 20) {
        descriptionCache.set(cid, item.Description);
        return {
          description: item.Description,
          source: item.DescriptionSourceName || item.SourceName || 'PubChem / NLM'
        };
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * 6. Generador de URLs de Imagen 2D oficial de PubChem
 * Endpoint: /compound/cid/<cid>/PNG?image_size=300x300
 */
export function getPubChem2DImageUrl(cid: number, width: number = 300, height: number = 300): string {
  return `${PUG_REST_BASE}/compound/cid/${cid}/PNG?image_size=${width}x${height}`;
}

/**
 * 7. Generador de URL de Conforme 3D (SDF) oficial de PubChem
 * Endpoint: /compound/cid/<cid>/record/SDF?record_type=3d
 */
export function getPubChem3DSdfUrl(cid: number): string {
  return `${PUG_REST_BASE}/compound/cid/${cid}/record/SDF?record_type=3d`;
}

/**
 * 8. Enlaces oficiales a portales Web externos
 */
export function getPubChemWebUrl(queryOrCid: string | number): string {
  if (typeof queryOrCid === 'number') {
    return `https://pubchem.ncbi.nlm.nih.gov/compound/${queryOrCid}`;
  }
  return `https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(queryOrCid)}`;
}

export function getDrugBankWebUrl(query: string): string {
  return `https://go.drugbank.com/unearth/q?query=${encodeURIComponent(query)}`;
}

/**
 * 9. Evaluación de Reglas de Lipinski (Rule of 5) y Veber
 */
export function evaluateLipinskiVeber(data: PubChemCompoundData): LipinskiVeberRules {
  const mw = data.molecularWeight ?? 0;
  const logP = data.xlogp ?? 0;
  const hbd = data.hbd ?? 0;
  const hba = data.hba ?? 0;
  const tpsa = data.tpsa ?? 0;
  const rotBonds = data.rotatableBonds ?? 0;

  const mwValid = mw > 0 && mw <= 500;
  const logPValid = logP <= 5.0;
  const hbdValid = hbd <= 5;
  const hbaValid = hba <= 10;
  const tpsaValid = tpsa <= 140;
  const rotBondsValid = rotBonds <= 10;

  let lipinskiViolations = 0;
  if (!mwValid) lipinskiViolations++;
  if (!logPValid) lipinskiViolations++;
  if (!hbdValid) lipinskiViolations++;
  if (!hbaValid) lipinskiViolations++;

  let veberViolations = 0;
  if (!tpsaValid) veberViolations++;
  if (!rotBondsValid) veberViolations++;

  return {
    mwValid,
    logPValid,
    hbdValid,
    hbaValid,
    tpsaValid,
    rotBondsValid,
    lipinskiViolations,
    veberViolations,
    isLipinskiCompliant: lipinskiViolations <= 1,
    isVeberCompliant: veberViolations === 0
  };
}
