import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Sun, Moon, Search, FileText, HelpCircle, Settings,
  GraduationCap, BookOpen, Activity, Award, Layers,
  LogOut, ChevronDown, ShieldCheck, Compass, FlaskConical
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenExamGenerator: () => void;
  onOpenStudentQuestion: () => void;
  onOpenAdminCms: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenExamGenerator,
  onOpenStudentQuestion,
  onOpenAdminCms
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isProfesor, isInstitucional, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const NAV_ITEMS = [
    { id: 'hub',        label: 'Hub',             icon: <Layers size={14} /> },
    { id: 'temas',      label: 'Temario',          icon: <BookOpen size={14} /> },
    { id: 'practicas',  label: 'Prácticas',        icon: <FlaskConical size={14} /> },
    { id: 'simulador',  label: 'Simulador',        icon: <Award size={14} /> },
    { id: 'admet',      label: 'ADMET',            icon: <Activity size={14} /> },
    { id: 'glosario',   label: 'Glosario',         icon: null },
    { id: 'enlaces',    label: 'Enlaces',          icon: <Compass size={14} /> },
    { id: 'evaluacion', label: 'Evaluación',       icon: <GraduationCap size={14} /> },
  ];

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--glass-bg)',
      borderBottom: '1px solid var(--glass-border)',
      boxShadow: '0 2px 12px rgba(30,58,138,0.07)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.55rem 1.5rem' }}>

        {/* Brand */}
        <button
          onClick={() => setActiveTab('hub')}
          style={{ display: 'flex', alignItems: 'center', gap: '9px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', flexShrink: 0, userSelect: 'none' }}
        >
          <img
            src="https://i.ibb.co/HLCYDc3c/Logo-primario-QFDOS.png"
            alt="QFDOS"
            style={{ width: 34, height: 34, borderRadius: 8 }}
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-title)', letterSpacing: '-0.01em' }}>QFDOS</span>
              <span className="qfdos-badge badge-teal" style={{ fontSize: '0.6rem', padding: '1px 5px' }}>v3</span>
            </div>
            <span style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>Química Farm. II · UGR</span>
          </div>
        </button>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-tab ${activeTab === item.id ? 'active' : ''}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>

          {/* Search */}
          <button
            onClick={onOpenSearch}
            className="btn btn-sm btn-ghost"
            title="Búsqueda Global (Ctrl+K)"
            style={{ gap: '5px' }}
          >
            <Search size={15} />
            <span style={{ fontSize: '0.7rem', opacity: 0.6, fontFamily: 'var(--font-mono)' }}>⌘K</span>
          </button>

          {/* Exam AI - always visible */}
          <button
            onClick={onOpenExamGenerator}
            className="btn btn-sm btn-secondary"
            title="Generador de Exámenes IA"
          >
            <FileText size={14} /> Examen IA
          </button>

          {/* Buzón */}
          <button
            onClick={onOpenStudentQuestion}
            className="btn btn-sm btn-ghost"
            title="Buzón de Dudas"
          >
            <HelpCircle size={16} />
          </button>

          {/* Admin (sólo profesorado) — con etiqueta: es la vía de subida de materiales */}
          {isProfesor && (
            <button
              onClick={onOpenAdminCms}
              className="btn btn-sm btn-secondary"
              style={{ fontWeight: 700, whiteSpace: 'nowrap' }}
              title="Subir materiales y administrar el curso"
            >
              <Settings size={15} />
              <span className="admin-btn-label">Gestionar curso</span>
            </button>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-sm btn-ghost"
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          >
            {theme === 'dark'
              ? <Sun size={16} color="#f59e0b" />
              : <Moon size={16} color="var(--navy)" />
            }
          </button>

          {/* User chip with dropdown */}
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="user-chip"
              style={{ cursor: 'pointer' }}
            >
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="avatar" className="user-avatar" />
              ) : (
                <div className="user-avatar-fallback">{initials}</div>
              )}
              <div style={{ lineHeight: 1.2 }}>
                <div className="user-chip-name">{user?.name?.split(' ')[0]}</div>
                <div className="user-chip-role">
                  {!isInstitucional && (
                    <span
                      title="Has entrado con una cuenta personal de Google, no con la de la UGR"
                      style={{ color: 'var(--accent-amber)', fontWeight: 700, marginRight: 5 }}
                    >
                      Cuenta personal ·
                    </span>
                  )}
                  {isProfesor
                    ? <span style={{ color: 'var(--teal)', fontWeight: 700 }}>Profesor</span>
                    : <span>Estudiante</span>
                  }
                </div>
              </div>
              <ChevronDown size={13} color="var(--text-muted)" style={{ transition: 'transform 200ms', transform: menuOpen ? 'rotate(180deg)' : 'none' }} />
            </button>

            {menuOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                background: 'var(--surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                minWidth: 220,
                overflow: 'hidden',
                animation: 'slideUp 160ms var(--ease-out)',
                zIndex: 200
              }}>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-color)', background: 'var(--surface-alt)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-title)' }}>{user?.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{user?.email}</div>
                  {isProfesor && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                      <ShieldCheck size={12} color="var(--teal)" />
                      <span style={{ fontSize: '0.72rem', color: 'var(--teal)', fontWeight: 700 }}>Acceso Profesor</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '10px 14px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--accent-red)',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    transition: 'background var(--transition-fast)'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <LogOut size={15} /> Cerrar sesión
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
