import React, { useState, useEffect, useMemo, useRef } from 'react';
import { QfdosTopic, MoleculeDrug } from '../data/qfdosData';
import { Chem2DDrawer } from './Chem2DDrawer';
import {
  searchPubChemByName,
  searchPubChemBySmiles,
  searchPubChemByCid,
  fetchPubChemSynonyms,
  fetchPubChemDescription,
  evaluateLipinskiVeber,
  getPubChem2DImageUrl,
  getPubChem3DSdfUrl,
  getPubChemWebUrl,
  getDrugBankWebUrl,
  PubChemCompoundData
} from '../services/pubchemService';
import {
  Search,
  X,
  ExternalLink,
  FlaskConical,
  Database,
  BookOpen,
  Activity,
  Award,
  Copy,
  Check,
  Filter,
  ChevronRight,
  Globe,
  Sparkles,
  RefreshCw,
  Info,
  Layers,
  Download,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface DrugSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  topics: QfdosTopic[];
  onSelectTopic?: (topic: QfdosTopic) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const DrugSearchModal: React.FC<DrugSearchModalProps> = ({
  isOpen,
  onClose,
  topics,
  onSelectTopic,
  onNavigateToTab
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [copiedSmiles, setCopiedSmiles] = useState<string | null>(null);

  // PubChem Live PUG REST query states
  const [pubchemLoading, setPubchemLoading] = useState(false);
  const [pubchemResult, setPubchemResult] = useState<PubChemCompoundData | null>(null);
  const [pubchemSynonyms, setPubchemSynonyms] = useState<string[]>([]);
  const [pubchemDesc, setPubchemDesc] = useState<{ description: string; source: string } | null>(null);
  const [pubchemError, setPubchemError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Keyboard shortcut listener for ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Extract all catalogued drugs from QFDOS topics
  const allCourseDrugs = useMemo(() => {
    const list: { drug: MoleculeDrug; topic: QfdosTopic }[] = [];
    topics.forEach(topic => {
      topic.drugs?.forEach(drug => {
        list.push({ drug, topic });
      });
    });
    return list;
  }, [topics]);

  // Filtered local drugs
  const filteredDrugs = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return allCourseDrugs.filter(({ drug, topic }) => {
      // Category filter
      if (selectedCategory !== 'todos') {
        const topicNum = topic.number.toUpperCase();
        if (selectedCategory === 'snc' && !['T02', 'T03', 'T04'].some(t => topicNum.includes(t))) return false;
        if (selectedCategory === 'cardio' && !['T05', 'T06'].some(t => topicNum.includes(t))) return false;
        if (selectedCategory === 'antiinf' && !['T07', 'T08'].some(t => topicNum.includes(t))) return false;
        if (selectedCategory === 'quimio' && !['T09', 'T10', 'T11'].some(t => topicNum.includes(t))) return false;
      }

      if (!q) return true;

      return (
        drug.name.toLowerCase().includes(q) ||
        (drug.role && drug.role.toLowerCase().includes(q)) ||
        (drug.smiles && drug.smiles.toLowerCase().includes(q)) ||
        (drug.formula && drug.formula.toLowerCase().includes(q)) ||
        (drug.pdbId && drug.pdbId.toLowerCase().includes(q)) ||
        topic.title.toLowerCase().includes(q) ||
        topic.number.toLowerCase().includes(q)
      );
    });
  }, [allCourseDrugs, searchTerm, selectedCategory]);

  // Execute PubChem PUG REST API query (by Name, CID, or SMILES)
  const executePubChemQuery = async (query: string) => {
    const clean = query.trim();
    if (!clean) return;

    // Abort previous in-flight request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setPubchemLoading(true);
    setPubchemError(null);
    setPubchemResult(null);
    setPubchemSynonyms([]);
    setPubchemDesc(null);

    try {
      let result: PubChemCompoundData | null = null;

      // Detect if query is a numeric CID, a SMILES string, or a Drug Name
      if (/^\d+$/.test(clean)) {
        result = await searchPubChemByCid(parseInt(clean, 10), signal);
      } else if (clean.includes('=') || clean.includes('#') || clean.includes('(') || clean.includes(')')) {
        result = await searchPubChemBySmiles(clean, signal);
      } else {
        result = await searchPubChemByName(clean, signal);
      }

      if (result) {
        setPubchemResult(result);

        // Concurrently fetch synonyms and pharmacological description
        fetchPubChemSynonyms(result.cid, 6, signal)
          .then(syns => setPubchemSynonyms(syns))
          .catch(() => {});

        fetchPubChemDescription(result.cid, signal)
          .then(desc => setPubchemDesc(desc))
          .catch(() => {});
      } else {
        setPubchemError(`No se encontró el registro para «${clean}» en PubChem PUG REST.`);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setPubchemError(err.message || 'Error de conexión con el servicio PUG REST de PubChem');
      }
    } finally {
      setPubchemLoading(false);
    }
  };

  const handleCopySmiles = (smiles: string) => {
    navigator.clipboard.writeText(smiles);
    setCopiedSmiles(smiles);
    setTimeout(() => setCopiedSmiles(null), 2000);
  };

  const openPubChemWeb = (nameOrCid: string | number) => {
    window.open(getPubChemWebUrl(nameOrCid), '_blank', 'noopener,noreferrer');
  };

  const openDrugBankWeb = (name: string) => {
    window.open(getDrugBankWebUrl(name), '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  const QUICK_DRUGS = [
    'Omeprazol', 'Imatinib', 'Morfina', 'Propranolol', 'Celecoxib',
    'Ciprofloxacino', 'Diazepam', 'Salbutamol', 'Metformina', 'Atorvastatina', 'Aspirina'
  ];

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-container"
        style={{
          maxWidth: '900px',
          width: '95vw',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          background: 'linear-gradient(135deg, var(--navy) 0%, #0f766e 100%)',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '8px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FlaskConical size={24} color="var(--mint)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                  Buscador de Fármacos & Quimioinformática
                </h3>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  background: 'var(--mint)',
                  color: '#0f172a',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)'
                }}>
                  PUBCHEM PUG-REST & DRUGBANK
                </span>
              </div>
              <p style={{ margin: '3px 0 0 0', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                Consultas en vivo a la API oficial de NCBI/PubChem, descriptores físico-químicos y enlaces directos.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              border: 'none',
              padding: '6px',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar & Fast Filters */}
        <div style={{
          padding: '1rem 1.5rem',
          background: 'var(--surface-raised)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {/* Main Search Input */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--surface)',
            border: '1.5px solid var(--border-strong)',
            borderRadius: 'var(--radius-lg)',
            padding: '8px 14px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Search size={18} color="var(--teal-ink)" />
            <input
              type="text"
              placeholder="Buscar por fármaco, SMILES, CID o diana PDB (ej. Omeprazol, Imatinib, 2244, CC(=O)OC1=CC=CC=C1C(=O)O)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && searchTerm.trim()) {
                  executePubChemQuery(searchTerm);
                }
              }}
              autoFocus
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.95rem',
                color: 'var(--text-main)',
                fontFamily: 'inherit'
              }}
            />
            {searchTerm && (
              <button
                onClick={() => { setSearchTerm(''); setPubchemResult(null); setPubchemError(null); setPubchemSynonyms([]); setPubchemDesc(null); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={16} />
              </button>
            )}
            <button
              onClick={() => executePubChemQuery(searchTerm)}
              disabled={!searchTerm.trim() || pubchemLoading}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.78rem', gap: '6px' }}
              title="Consultar API oficial de PubChem (PUG-REST)"
            >
              {pubchemLoading ? <RefreshCw size={13} className="spin-icon" /> : <Globe size={13} />}
              <span>Consultar PUG-REST</span>
            </button>
          </div>

          {/* Categories Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={12} /> Filtros:
            </span>
            {[
              { id: 'todos', label: `Todos del Curso (${allCourseDrugs.length})` },
              { id: 'snc', label: 'SNC & Psicoactivos (T02-T04)' },
              { id: 'cardio', label: 'Cardiovascular (T05-T06)' },
              { id: 'antiinf', label: 'Antiinfecciosos (T07-T08)' },
              { id: 'quimio', label: 'Quimioterapia & Cáncer (T09-T11)' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: selectedCategory === cat.id ? 700 : 500,
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-full)',
                  border: selectedCategory === cat.id ? '1px solid var(--teal)' : '1px solid var(--border-color)',
                  background: selectedCategory === cat.id ? 'var(--secondary-bg)' : 'var(--surface)',
                  color: selectedCategory === cat.id ? 'var(--teal-ink)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Access Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0 }}>
              Acceso rápido:
            </span>
            {QUICK_DRUGS.map(d => (
              <button
                key={d}
                onClick={() => setSearchTerm(d)}
                style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--surface)',
                  color: 'var(--navy-ink)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Live PubChem PUG-REST API Result Card */}
          {pubchemResult && (() => {
            const rules = evaluateLipinskiVeber(pubchemResult);
            const displaySmiles = pubchemResult.canonicalSmiles || pubchemResult.isomericSmiles;

            return (
              <div style={{
                background: 'linear-gradient(135deg, rgba(30,58,138,0.06) 0%, rgba(13,148,136,0.08) 100%)',
                border: '1.5px solid var(--teal)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                position: 'relative'
              }}>
                {/* Header of PUG REST Card */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Globe size={20} color="var(--teal-ink)" />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-title)' }}>
                        {pubchemResult.name}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--teal-ink)', fontWeight: 600 }}>
                        Registro Oficial PubChem PUG REST API
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span className="qfdos-badge badge-teal" style={{ fontSize: '0.72rem' }}>
                      CID: {pubchemResult.cid}
                    </span>
                    <span
                      className="qfdos-badge"
                      style={{
                        fontSize: '0.7rem',
                        background: rules.isLipinskiCompliant ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                        color: rules.isLipinskiCompliant ? 'var(--accent-emerald)' : 'var(--accent-red)',
                        border: `1px solid ${rules.isLipinskiCompliant ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                      }}
                    >
                      <ShieldCheck size={11} /> {rules.isLipinskiCompliant ? 'Lipinski OK' : `${rules.lipinskiViolations} Alertas Lipinski`}
                    </span>
                  </div>
                </div>

                {/* Main 2-column layout: Structure + Properties */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 280px) 1fr', gap: '1.25rem', alignItems: 'start' }}>
                  {/* Left: 2D Drawer / High-Res image */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    {displaySmiles ? (
                      <Chem2DDrawer smiles={displaySmiles} name={pubchemResult.name} width={260} height={160} />
                    ) : (
                      <img
                        src={getPubChem2DImageUrl(pubchemResult.cid, 260, 160)}
                        alt={pubchemResult.name}
                        style={{ width: '260px', height: '160px', objectFit: 'contain', background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                      />
                    )}

                    {displaySmiles && (
                      <div style={{
                        width: '100%',
                        background: 'var(--surface-alt)',
                        padding: '6px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        color: 'var(--navy-ink)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={displaySmiles}>
                          {displaySmiles}
                        </span>
                        <button
                          onClick={() => handleCopySmiles(displaySmiles)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--teal-ink)', flexShrink: 0 }}
                          title="Copiar SMILES"
                        >
                          {copiedSmiles === displaySmiles ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right: Physicochemical Data & Synonyms */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {pubchemResult.iupacName && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        <strong style={{ color: 'var(--text-title)' }}>IUPAC:</strong> {pubchemResult.iupacName}
                      </div>
                    )}

                    {/* Pharmacological Description from MeSH/NLM if available */}
                    {pubchemDesc && (
                      <div style={{
                        background: 'rgba(13, 148, 136, 0.08)',
                        borderLeft: '3px solid var(--teal)',
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        lineHeight: 1.45,
                        color: 'var(--text-main)'
                      }}>
                        <strong>Acción / Monografía:</strong> {pubchemDesc.description}
                        <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Fuente: {pubchemDesc.source}
                        </span>
                      </div>
                    )}

                    {/* 6 Core Physicochemical Properties Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '0.72rem' }}>
                      <div style={{ background: 'var(--surface-alt)', padding: '5px', borderRadius: '4px', textAlign: 'center' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem' }}>Fórmula</span>
                        <strong>{pubchemResult.molecularFormula || '-'}</strong>
                      </div>
                      <div style={{ background: 'var(--surface-alt)', padding: '5px', borderRadius: '4px', textAlign: 'center' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem' }}>PM (Da)</span>
                        <strong>{pubchemResult.molecularWeight ? pubchemResult.molecularWeight.toFixed(2) : '-'}</strong>
                      </div>
                      <div style={{ background: 'var(--surface-alt)', padding: '5px', borderRadius: '4px', textAlign: 'center' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem' }}>XLogP</span>
                        <strong>{pubchemResult.xlogp !== undefined ? pubchemResult.xlogp : '-'}</strong>
                      </div>
                      <div style={{ background: 'var(--surface-alt)', padding: '5px', borderRadius: '4px', textAlign: 'center' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem' }}>TPSA (Å²)</span>
                        <strong>{pubchemResult.tpsa !== undefined ? pubchemResult.tpsa : '-'}</strong>
                      </div>
                      <div style={{ background: 'var(--surface-alt)', padding: '5px', borderRadius: '4px', textAlign: 'center' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem' }}>HBD / HBA</span>
                        <strong>{pubchemResult.hbd ?? '-'} / {pubchemResult.hba ?? '-'}</strong>
                      </div>
                      <div style={{ background: 'var(--surface-alt)', padding: '5px', borderRadius: '4px', textAlign: 'center' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem' }}>Enlaces Rotables</span>
                        <strong>{pubchemResult.rotatableBonds ?? '-'}</strong>
                      </div>
                    </div>

                    {/* Synonyms list */}
                    {pubchemSynonyms.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>Sinónimos:</span>
                        {pubchemSynonyms.slice(0, 5).map((s, idx) => (
                          <span key={idx} className="qfdos-badge badge-navy" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => openPubChemWeb(pubchemResult.cid)}
                        className="btn btn-sm btn-primary"
                        style={{ fontSize: '0.75rem', padding: '5px 12px' }}
                      >
                        <Globe size={13} /> Abrir Ficha PubChem (CID: {pubchemResult.cid}) <ExternalLink size={11} />
                      </button>

                      <button
                        onClick={() => openDrugBankWeb(pubchemResult.name || searchTerm)}
                        className="btn btn-sm btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '5px 12px' }}
                      >
                        <Database size={13} /> Ver en DrugBank <ExternalLink size={11} />
                      </button>

                      <a
                        href={getPubChem3DSdfUrl(pubchemResult.cid)}
                        download={`${pubchemResult.name || 'compound'}_3d.sdf`}
                        className="btn btn-sm btn-outline"
                        style={{ fontSize: '0.75rem', padding: '5px 10px', textDecoration: 'none' }}
                        title="Descargar coordenadas 3D (SDF) de PubChem"
                      >
                        <Download size={13} /> Conforme 3D (SDF)
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* PubChem Error Alert */}
          {pubchemError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              fontSize: '0.8rem',
              color: 'var(--accent-red)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={16} />
                <span>{pubchemError}</span>
              </div>
              <button
                onClick={() => openPubChemWeb(searchTerm)}
                className="btn btn-sm btn-outline"
                style={{ fontSize: '0.72rem', borderColor: 'var(--accent-red)', color: 'var(--accent-red)' }}
              >
                Buscar «{searchTerm}» en PubChem Web <ExternalLink size={11} />
              </button>
            </div>
          )}

          {/* Local Syllabus Results Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              color: 'var(--text-title)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Fármacos del Programa QFDOS ({filteredDrugs.length})
            </span>
            {searchTerm && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Filtrando por: «{searchTerm}»
              </span>
            )}
          </div>

          {/* Grid of Course Drugs */}
          {filteredDrugs.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.25rem' }}>
              {filteredDrugs.map(({ drug, topic }, idx) => (
                <div
                  key={`${drug.name}-${idx}`}
                  className="qfdos-card card-teal"
                  style={{
                    padding: '1.15rem',
                    background: 'var(--surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  {/* Top: Name, Topic & Role */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 800, color: 'var(--navy-ink)' }}>
                          {drug.name}
                        </h4>
                        <div style={{ fontSize: '0.78rem', color: 'var(--teal-ink)', fontWeight: 600, marginTop: '2px' }}>
                          {drug.role}
                        </div>
                      </div>
                      <span
                        onClick={() => {
                          if (onSelectTopic) {
                            onClose();
                            onSelectTopic(topic);
                          }
                        }}
                        className="qfdos-badge badge-navy"
                        style={{ fontSize: '0.68rem', cursor: onSelectTopic ? 'pointer' : 'default' }}
                        title="Ver tema completo"
                      >
                        {topic.number}
                      </span>
                    </div>

                    {/* 2D Structure Drawer */}
                    {drug.smiles && (
                      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
                        <Chem2DDrawer smiles={drug.smiles} name={drug.name} width={280} height={130} />
                      </div>
                    )}

                    {/* SMILES Snippet */}
                    {drug.smiles && (
                      <div style={{
                        background: 'var(--surface-alt)',
                        padding: '5px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        color: 'var(--navy-ink)',
                        wordBreak: 'break-all',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '8px'
                      }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {drug.smiles}
                        </span>
                        <button
                          onClick={() => handleCopySmiles(drug.smiles)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--teal-ink)', flexShrink: 0 }}
                          title="Copiar SMILES"
                        >
                          {copiedSmiles === drug.smiles ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                      </div>
                    )}

                    {/* Physicochemical Properties */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '0.72rem', marginBottom: '8px' }}>
                      <div style={{ background: 'var(--surface-alt)', padding: '4px 6px', borderRadius: '4px', textAlign: 'center' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem' }}>PM (Da)</span>
                        <strong>{drug.mw ? drug.mw.toFixed(1) : '-'}</strong>
                      </div>
                      <div style={{ background: 'var(--surface-alt)', padding: '4px 6px', borderRadius: '4px', textAlign: 'center' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem' }}>LogP</span>
                        <strong>{drug.logP !== undefined ? drug.logP : '-'}</strong>
                      </div>
                      <div style={{ background: 'var(--surface-alt)', padding: '4px 6px', borderRadius: '4px', textAlign: 'center' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem' }}>TPSA (Å²)</span>
                        <strong>{drug.tpsa !== undefined ? drug.tpsa : '-'}</strong>
                      </div>
                    </div>

                    {drug.pdbId && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        <strong>Diana PDB:</strong> <span className="font-mono" style={{ color: 'var(--teal-ink)', fontWeight: 700 }}>{drug.pdbId}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons: PubChem & DrugBank Direct Links */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <button
                        onClick={() => openPubChemWeb(drug.name)}
                        className="btn btn-sm"
                        style={{
                          background: 'rgba(30, 58, 138, 0.08)',
                          color: 'var(--navy-ink)',
                          border: '1px solid rgba(30, 58, 138, 0.2)',
                          fontSize: '0.74rem',
                          padding: '4px 6px',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                        title={`Buscar ficha oficial de ${drug.name} en PubChem`}
                      >
                        <Globe size={12} />
                        <span>PubChem</span>
                        <ExternalLink size={11} style={{ opacity: 0.7 }} />
                      </button>

                      <button
                        onClick={() => openDrugBankWeb(drug.name)}
                        className="btn btn-sm"
                        style={{
                          background: 'rgba(13, 148, 136, 0.08)',
                          color: 'var(--teal-ink)',
                          border: '1px solid rgba(13, 148, 136, 0.2)',
                          fontSize: '0.74rem',
                          padding: '4px 6px',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                        title={`Buscar monografía de ${drug.name} en DrugBank`}
                      >
                        <Database size={12} />
                        <span>DrugBank</span>
                        <ExternalLink size={11} style={{ opacity: 0.7 }} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between' }}>
                      {onNavigateToTab && (
                        <button
                          onClick={() => {
                            onClose();
                            onNavigateToTab('admet');
                          }}
                          className="btn btn-sm btn-outline"
                          style={{ flex: 1, fontSize: '0.7rem', padding: '3px 6px', justifyContent: 'center' }}
                        >
                          <Activity size={11} /> ADMET
                        </button>
                      )}
                      {onSelectTopic && (
                        <button
                          onClick={() => {
                            onClose();
                            onSelectTopic(topic);
                          }}
                          className="btn btn-sm btn-outline"
                          style={{ flex: 1, fontSize: '0.7rem', padding: '3px 6px', justifyContent: 'center' }}
                        >
                          <BookOpen size={11} /> Ver en {topic.number}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1.5rem',
              background: 'var(--surface-raised)',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border-color)'
            }}>
              <FlaskConical size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px auto', opacity: 0.6 }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '6px' }}>
                No hay coincidencias en el temario local para «{searchTerm}»
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 16px auto', lineHeight: 1.5 }}>
                Puedes consultar directamente en las bases de datos químicas internacionales oficiales de PubChem (NCBI PUG-REST) y DrugBank.
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => executePubChemQuery(searchTerm)}
                  disabled={!searchTerm.trim() || pubchemLoading}
                  className="btn btn-primary"
                  style={{ fontSize: '0.82rem' }}
                >
                  <Globe size={14} /> Consultar PubChem PUG REST
                </button>
                <button
                  onClick={() => openPubChemWeb(searchTerm)}
                  className="btn btn-outline"
                  style={{ fontSize: '0.82rem' }}
                >
                  Abrir PubChem Web <ExternalLink size={12} />
                </button>
                <button
                  onClick={() => openDrugBankWeb(searchTerm)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.82rem' }}
                >
                  <Database size={14} /> Abrir DrugBank Web <ExternalLink size={12} />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{
          padding: '0.75rem 1.5rem',
          background: 'var(--surface-raised)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.74rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>Protocolo: <strong>NCBI PubChem PUG-REST API</strong> · <strong>DrugBank Online</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>ESC para cerrar</span>
          </div>
        </div>

      </div>
    </div>
  );
};
