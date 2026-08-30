import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
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

  /* Regla de ocupación: una barra que se acopla bajo la pestaña activa.
     Se mide sobre el DOM en vez de calcularse, porque el ancho de cada
     pestaña depende de la fuente ya cargada y del zoom del navegador. */
  const navRef = useRef<HTMLElement>(null);
  const [occ, setOcc] = useState({ x: 0, w: 0, on: 0 });

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const medir = () => {
      const el = nav.querySelector<HTMLElement>('.nav-tab.active');
      if (!el) { setOcc(o => ({ ...o, on: 0 })); return; }
      setOcc({ x: el.offsetLeft, w: el.offsetWidth, on: 1 });
      el.scrollIntoView({ inline: 'nearest', block: 'nearest' });
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(nav);
    nav.querySelectorAll('.nav-tab').forEach(t => ro.observe(t));
    // Montserrat llega después del primer pintado y cambia los anchos
    document.fonts?.ready.then(medir).catch(() => {});
    return () => ro.disconnect();
  }, [activeTab]);

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
    { id: 'info',       label: 'Curso & Horarios', icon: <GraduationCap size={14} /> },
    { id: 'temas',      label: 'Temario',          icon: <BookOpen size={14} /> },
    { id: 'practicas',  label: 'Prácticas',        icon: <FlaskConical size={14} /> },
    { id: 'simulador',  label: 'Simulador',        icon: <Award size={14} /> },
    { id: 'admet',      label: 'ADMET',            icon: <Activity size={14} /> },
    { id: 'glosario',   label: 'Glosario',         icon: <BookOpen size={14} /> },
    { id: 'enlaces',    label: 'Enlaces',          icon: <Compass size={14} /> },
    { id: 'evaluacion', label: 'Evaluación',       icon: <ShieldCheck size={14} /> },
  ];

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'JJ';

  return (
    <header className="qfdos-header-root">
      <div className="container">
        {/* Fila Superior: Marca Principal + Búsqueda Inteligente + Herramientas */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '1.25rem' }}>
          {/* Brand */}
          <button
            onClick={() => setActiveTab('hub')}
            className="header-brand"
          >
            <div className="header-logo-badge">
              <img
                src="https://i.ibb.co/HLCYDc3c/Logo-primario-QFDOS.png"
                alt="QFDOS"
                className="header-logo-img"
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <div style={{ lineHeight: 1.15, textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="brand-title">QFDOS</span>
                <span className="brand-version-badge">2026/27</span>
                <span className="qfdos-badge badge-teal" style={{ fontSize: '0.62rem', padding: '1px 6px', fontWeight: 800 }}>Grupo E</span>
              </div>
              <span className="brand-sub">Química Farmacéutica II · Fac. Farmacia UGR</span>
            </div>
          </button>

          {/* Buscador: ocupa el espacio central */}
          <button
            onClick={onOpenSearch}
            className="header-search"
            title="Búsqueda global (Ctrl+K)"
          >
            <Search size={15} className="header-search-icon" />
            <span className="header-search-texto">Buscar dianas, fármacos, cinética, RMN…</span>
            <kbd className="header-search-kbd">⌘K</kbd>
          </button>

          {/* Right tools */}
          <div className="header-tools">
            {/* Exam AI */}
            <button
              onClick={onOpenExamGenerator}
              className="btn btn-sm btn-header-action"
              title="Generador de Exámenes IA"
            >
              <FileText size={14} /><span className="tool-label">Examen IA</span>
            </button>

            {/* Buzón de Consultas */}
            <button
              onClick={onOpenStudentQuestion}
              className="btn btn-sm btn-ghost-clean"
              title="Buzón de Consultas y Tutorías"
            >
              <HelpCircle size={16} />
            </button>

            {/* Admin (sólo profesorado) */}
            {isProfesor && (
              <button
                onClick={onOpenAdminCms}
                className="btn btn-sm btn-header-admin"
                title="Subir materiales y administrar el curso"
              >
                <Settings size={14} />
                <span className="admin-btn-label">Gestión Docente</span>
              </button>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="btn btn-sm btn-ghost-clean"
              title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {theme === 'dark'
                ? <Sun size={16} color="#fbbf24" />
                : <Moon size={16} color="currentColor" />
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
                <div className="user-chip-text">
                  <div className="user-chip-name">{user?.name?.split(' ')[0] || 'Profesor'}</div>
                  <div className="user-chip-role">
                    {!isInstitucional && (
                      <span
                        title="Has entrado con una cuenta personal de Google"
                        style={{ color: 'var(--accent-amber)', fontWeight: 700, marginRight: 4 }}
                      >
                        Personal ·
                      </span>
                    )}
                    {isProfesor
                      ? <span style={{ color: 'var(--teal-ink)', fontWeight: 700 }}>Prof. Responsable</span>
                      : <span>Estudiante (Gr. E)</span>
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
                  minWidth: 230,
                  overflow: 'hidden',
                  animation: 'slideUp 160ms var(--ease-out)',
                  zIndex: 200
                }}>
                  <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-color)', background: 'var(--surface-alt)' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.86rem', color: 'var(--text-title)' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{user?.email}</div>
                    {isProfesor && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                        <ShieldCheck size={13} color="var(--teal-ink)" />
                        <span style={{ fontSize: '0.72rem', color: 'var(--teal-ink)', fontWeight: 800 }}>Profesor Responsable (Grupo E)</span>
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
                      fontWeight: 700,
                      transition: 'background var(--transition-fast)'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    <LogOut size={15} /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fila Inferior: Navegación de Pestañas con micro-indicadores */}
        <nav className="header-nav" aria-label="Secciones del curso" ref={navRef}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-tab ${activeTab === item.id ? 'active' : ''}`}
              aria-current={activeTab === item.id ? 'page' : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          <span
            className="nav-occupancy"
            aria-hidden="true"
            style={{
              ['--occ-x' as string]: `${occ.x}px`,
              ['--occ-w' as string]: `${occ.w}px`,
              ['--occ-o' as string]: occ.on,
            } as React.CSSProperties}
          />
        </nav>
      </div>
    </header>
  );
};

