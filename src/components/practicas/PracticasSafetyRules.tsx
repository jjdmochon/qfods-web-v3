import React, { useState, useEffect } from 'react';
import {
  ShieldAlert, CheckCircle2, AlertTriangle, FileCheck,
  Lock, ArrowRight, UserCheck, Flame, Skull, EyeOff, Sparkles, RefreshCw
} from 'lucide-react';
import { NORMAS_SEGURIDAD_CHECKLIST, REACTIVOS_PRECAUCIONES } from '../../data/practicasData';
import { enviarAHoja } from '../../services/entregaPracticas';

interface PracticasSafetyRulesProps {
  onAcceptAndProceed: () => void;
  isUnlocked?: boolean;
}

export const PracticasSafetyRules: React.FC<PracticasSafetyRulesProps> = ({
  onAcceptAndProceed,
  isUnlocked = false
}) => {
  const [initials, setInitials] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [studentEmail, setStudentEmail] = useState<string>('');
  const [checkedRules, setCheckedRules] = useState<{ [key: number]: boolean }>({});
  const [allChecked, setAllChecked] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(isUnlocked);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // El envio real vive en services/entregaPracticas: alli se distingue entre
  // "enviado sin confirmar" y "no configurado", en vez de fingir exito siempre.
  const sendToGoogleSheet = async (sheetName: string, rowData: Record<string, string>) => {
    return enviarAHoja(sheetName, rowData);
  };

  // Load from localStorage if present
  useEffect(() => {
    const savedConsent = localStorage.getItem('qfdos_practicas_safety_accepted');
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        setStudentName(parsed.name || '');
        setStudentEmail(parsed.email || '');
        setInitials(parsed.initials || '');
        setHasSubmitted(true);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const totalRules = NORMAS_SEGURIDAD_CHECKLIST.length;
  const currentCheckedCount = Object.values(checkedRules).filter(Boolean).length;

  const handleToggleRule = (id: number) => {
    setCheckedRules(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      const count = Object.values(updated).filter(Boolean).length;
      setAllChecked(count === totalRules);
      return updated;
    });
  };

  const handleSelectAll = () => {
    const all: { [key: number]: boolean } = {};
    NORMAS_SEGURIDAD_CHECKLIST.forEach(rule => {
      all[rule.id] = true;
    });
    setCheckedRules(all);
    setAllChecked(true);
  };

  const handleResetChecklist = () => {
    setCheckedRules({});
    setAllChecked(false);
    setHasSubmitted(false);
    localStorage.removeItem('qfdos_practicas_safety_accepted');
  };

  const handleConfirmAndSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allChecked || !studentName.trim() || !studentEmail.trim() || !initials.trim()) {
      alert('Por favor, marca todas las 16 normas de seguridad e introduce tu nombre, email e iniciales para firmar el compromiso.');
      return;
    }
    if (!studentEmail.includes('@')) {
      alert('Por favor, introduce un email válido (ej. alumno@correo.ugr.es).');
      return;
    }

    setIsSubmitting(true);
    const nowISO = new Date().toISOString();
    const payload = {
      name: studentName.trim(),
      email: studentEmail.trim(),
      initials: initials.trim(),
      timestamp: nowISO,
      accepted: true
    };

    // Send to Google Sheets 'normas de seguridad'
    await sendToGoogleSheet('normas de seguridad', {
      nombre: studentName.trim(),
      email: studentEmail.trim(),
      iniciales: initials.trim(),
      fecha: new Date().toLocaleDateString('es-ES'),
      hora: new Date().toLocaleTimeString('es-ES'),
      normasAceptadas: String(totalRules)
    });

    localStorage.setItem('qfdos_practicas_safety_accepted', JSON.stringify(payload));
    setIsSubmitting(false);
    setHasSubmitted(true);
    onAcceptAndProceed();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div className="qfdos-card" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #991b1b 100%)',
        color: '#ffffff',
        padding: '2rem',
        borderRadius: '16px',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
          <span style={{
            background: 'rgba(239, 68, 68, 0.25)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '0.74rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#fca5a5'
          }}>
            <ShieldAlert size={14} /> LECTURA Y COMPROMISO OBLIGATORIO
          </span>
          <span style={{ fontSize: '0.74rem', opacity: 0.85 }}>
            Universidad de Granada · Dpto. Química Farmacéutica y Orgánica
          </span>
        </div>

        <h1 style={{ fontSize: '1.85rem', fontWeight: 900, fontFamily: 'Montserrat, sans-serif', margin: '0.3rem 0 0.6rem 0', color: '#ffffff' }}>
          Normas de Seguridad en el Laboratorio y Precauciones Químicas
        </h1>

        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
          Antes de acceder a los protocolos, calculadoras de rendimiento, espectroscopia y cuadernos de prácticas, 
          cada alumno/a debe <strong>leer atentamente, verificar individualmente y firmar digitalmente</strong> el cumplimiento 
          de las 16 normas oficiales de seguridad y el conocimiento de los riesgos específicos de los reactivos químicos utilizados en QFDOS.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{
            background: hasSubmitted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: `1px solid ${hasSubmitted ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            padding: '6px 14px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: hasSubmitted ? '#6ee7b7' : '#fca5a5'
          }}>
            {hasSubmitted ? <FileCheck size={16} /> : <Lock size={16} />}
            Estado de Acceso: {hasSubmitted ? 'AUTORIZADO / COMPROMISO FIRMADO' : `BLOQUEADO (${currentCheckedCount}/${totalRules} normas revisadas)`}
          </div>

          {hasSubmitted && (
            <button
              onClick={onAcceptAndProceed}
              className="btn btn-sm btn-mint"
              style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              Continuar a Prácticas <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Precauciones Químicas Específicas */}
      <div className="qfdos-card" style={{ padding: '1.5rem', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          <AlertTriangle size={20} color="#eab308" />
          <div>
            <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-title)' }}>
              Precauciones Específicas con los Reactivos de Prácticas (Pág. 4)
            </h3>
            <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Riesgos químicos intrínsecos de las materias primas, intermedios y disolventes empleados en las síntesis de Propranolol y DHPP.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {REACTIVOS_PRECAUCIONES.map((r, idx) => {
            const isToxic = r.dangerType === 'toxic' || r.dangerType === 'cancerigen';
            const isFlammable = r.dangerType === 'flammable';
            const isCorrosive = r.dangerType === 'corrosive';

            let badgeColor = 'badge-navy';
            let icon = <AlertTriangle size={13} />;
            let borderColor = 'var(--border-color)';

            if (isToxic) {
              badgeColor = 'badge-red';
              icon = <Skull size={13} />;
              borderColor = 'rgba(239, 68, 68, 0.4)';
            } else if (isFlammable) {
              badgeColor = 'badge-yellow';
              icon = <Flame size={13} />;
              borderColor = 'rgba(234, 179, 8, 0.4)';
            } else if (isCorrosive) {
              badgeColor = 'badge-purple';
              borderColor = 'rgba(168, 85, 247, 0.4)';
            }

            return (
              <div
                key={idx}
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  background: 'var(--surface-muted)',
                  border: `1px solid ${borderColor}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-title)' }}>
                    {r.reagent}
                  </span>
                  <span className={`qfdos-badge ${badgeColor}`} style={{ fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {icon} {r.dangerLabel}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
                  {r.description}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 'auto', paddingTop: '4px' }}>
                  Protocolo: <strong>{r.actionRequired}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Checklist de 16 Normas de Seguridad */}
      <div className="qfdos-card" style={{ padding: '1.5rem', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <span className="qfdos-badge badge-teal" style={{ marginBottom: '4px' }}>
              CHECKLIST OBLIGATORIO (PÁGS. 3 Y 22-23 DEL CUADERNO)
            </span>
            <h3 style={{ margin: '0.2rem 0', fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-title)' }}>
              Lista de Verificación de Normas de Seguridad en el Laboratorio
            </h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Lee y marca la casilla de cada norma para acreditar tu comprensión y conformidad.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handleSelectAll}
              className="btn btn-xs btn-outline"
              style={{ fontSize: '0.75rem', fontWeight: 600 }}
            >
              Marcar Todas ({totalRules})
            </button>
            <button
              type="button"
              onClick={handleResetChecklist}
              className="btn btn-xs btn-ghost"
              style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
            >
              <RefreshCw size={12} /> Reiniciar
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>
            <span style={{ color: allChecked ? '#10b981' : 'var(--text-title)' }}>
              Progreso de Verificación: {currentCheckedCount} de {totalRules} normas revisadas
            </span>
            <span style={{ color: allChecked ? '#10b981' : 'var(--navy)' }}>
              {Math.round((currentCheckedCount / totalRules) * 100)}%
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'var(--surface-muted)', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${(currentCheckedCount / totalRules) * 100}%`,
                height: '100%',
                background: allChecked ? 'linear-gradient(90deg, #10b981, #059669)' : 'linear-gradient(90deg, #3b82f6, #0d9488)',
                transition: 'width 0.25s ease'
              }}
            />
          </div>
        </div>

        {/* List of 16 Rules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {NORMAS_SEGURIDAD_CHECKLIST.map(norma => {
            const isChecked = !!checkedRules[norma.id];
            return (
              <div
                key={norma.id}
                onClick={() => handleToggleRule(norma.id)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  background: isChecked ? 'rgba(13, 148, 136, 0.06)' : 'var(--surface-muted)',
                  border: isChecked ? '1.5px solid var(--teal)' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggleRule(norma.id)}
                  style={{
                    marginTop: '3px',
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: 'var(--teal)'
                  }}
                  onClick={e => e.stopPropagation()}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span className="font-tech" style={{
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      color: isChecked ? 'var(--teal)' : 'var(--text-muted)'
                    }}>
                      Norma #{norma.id}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-title)' }}>
                      {norma.title}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
                    {norma.text}
                  </p>
                </div>

                {isChecked && (
                  <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Formulario de Firma Digital */}
      <form onSubmit={handleConfirmAndSign} className="qfdos-card" style={{ padding: '1.75rem', background: 'var(--surface)', border: '1.5px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          <UserCheck size={22} color="var(--navy)" />
          <div>
            <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-title)' }}>
              Firma del Compromiso y Declaración de Conformidad
            </h3>
            <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              De conformidad con las normas de docencia práctica de la Universidad de Granada (Dpto. Química Farmacéutica y Orgánica).
            </p>
          </div>
        </div>

        <div style={{
          background: 'var(--surface-muted)',
          padding: '1rem',
          borderRadius: '8px',
          borderLeft: '4px solid var(--navy)',
          fontSize: '0.82rem',
          color: 'var(--text-main)',
          lineHeight: 1.5,
          marginBottom: '1.25rem'
        }}>
          <em>
            "Yo, abajo firmante, declaro haber leído y entendido en su totalidad las <strong>Normas de Seguridad en el Laboratorio</strong> y 
            las precauciones específicas de los reactivos de Química Farmacéutica II. Me comprometo a cumplirlas rigurosamente, 
            usar los EPIs obligatorios (bata larga abrochada y gafas de seguridad) y seguir todas las instrucciones del profesor responsable. 
            Entiendo que sin la aceptación de estas normas no está permitido el trabajo experimental en el laboratorio."
          </em>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '4px' }}>
              Nombre y Apellidos del Alumno/a *:
            </label>
            <input
              type="text"
              required
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
              placeholder="Ej. Carmen García López"
              className="qfdos-input"
              style={{ width: '100%', fontSize: '0.84rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '4px' }}>
              Correo Electrónico Universitario *:
            </label>
            <input
              type="email"
              required
              value={studentEmail}
              onChange={e => setStudentEmail(e.target.value)}
              placeholder="Ej. alumno@correo.ugr.es"
              className="qfdos-input"
              style={{ width: '100%', fontSize: '0.84rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '4px' }}>
              Iniciales de Conformidad *:
            </label>
            <input
              type="text"
              required
              maxLength={4}
              value={initials}
              onChange={e => setInitials(e.target.value.toUpperCase())}
              placeholder="Ej. CGL"
              className="qfdos-input font-tech"
              style={{ width: '100%', fontSize: '0.84rem', textTransform: 'uppercase' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '0.78rem', color: allChecked ? '#10b981' : '#ef4444', fontWeight: 600 }}>
            {allChecked
              ? '✓ Todas las normas marcadas. Listo para firmar.'
              : `⚠️ Debes marcar las ${totalRules - currentCheckedCount} normas restantes antes de firmar.`}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !allChecked || !studentName.trim() || !studentEmail.trim() || !initials.trim()}
            className="btn btn-navy"
            style={{
              padding: '0.75rem 1.5rem',
              fontWeight: 800,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: (isSubmitting || !allChecked || !studentName.trim() || !studentEmail.trim() || !initials.trim()) ? 0.5 : 1,
              cursor: (isSubmitting || !allChecked || !studentName.trim() || !studentEmail.trim() || !initials.trim()) ? 'not-allowed' : 'pointer'
            }}
          >
            <CheckCircle2 size={16} /> {isSubmitting ? 'Registrando...' : 'Firmar Compromiso y Acceder al Módulo de Prácticas'}
          </button>
        </div>
      </form>

    </div>
  );
};
