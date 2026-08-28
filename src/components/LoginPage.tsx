import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, GraduationCap, FlaskConical, Atom, Layers } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSuccess = (credentialResponse: { credential?: string }) => {
    setLoading(true);
    setError(null);
    const result = loginWithGoogle(credentialResponse);
    if (!result.success) {
      setError(result.error || 'Error al iniciar sesión.');
    }
    setLoading(false);
  };

  const handleError = () => {
    setError('No se pudo completar el inicio de sesión con Google. Inténtalo de nuevo.');
  };

  return (
    <div className="login-root">
      {/* Background decorative grid */}
      <div className="login-bg-grid" aria-hidden="true" />

      {/* Floating molecules decoration */}
      <div className="login-deco" aria-hidden="true">
        <Atom size={120} strokeWidth={0.5} color="rgba(45,212,191,0.08)" style={{ position: 'absolute', top: '8%', left: '6%' }} />
        <FlaskConical size={80} strokeWidth={0.5} color="rgba(255,255,255,0.05)" style={{ position: 'absolute', bottom: '12%', right: '8%' }} />
        <Layers size={90} strokeWidth={0.5} color="rgba(59,130,246,0.07)" style={{ position: 'absolute', top: '55%', left: '3%' }} />
      </div>

      {/* Center card */}
      <div className="login-card">
        {/* Header */}
        <div className="login-card-header">
          <div className="login-logo-ring">
            <img
              src="https://i.ibb.co/HLCYDc3c/Logo-primario-QFDOS.png"
              alt="QFDOS"
              style={{ width: 52, height: 52, borderRadius: 10 }}
              onError={e => { e.currentTarget.style.display = 'none'; }}
            />
          </div>

          <div className="login-badge-row">
            <span className="qfdos-badge badge-teal" style={{ fontSize: '0.68rem' }}>2627 QFDOS E</span>
            <span className="qfdos-badge badge-mint" style={{ fontSize: '0.68rem' }}>Curso 2026/2027</span>
          </div>

          <h1 className="login-title">Química Farmacéutica II</h1>
          <p className="login-subtitle">
            Plataforma académica oficial · Facultad de Farmacia, UGR
          </p>
        </div>

        {/* Divider */}
        <div className="login-divider">
          <span>Acceso con cuenta institucional</span>
        </div>

        {/* Google login */}
        <div className="login-google-wrap">
          {loading ? (
            <div className="login-loading">
              <span className="login-spinner" />
              <span>Verificando credenciales UGR…</span>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              theme="filled_blue"
              shape="rectangular"
              size="large"
              text="signin_with"
              locale="es"
              useOneTap={false}
              width="320"
            />
          )}

          {error && (
            <div className="login-error">
              <AlertCircle size={16} strokeWidth={2} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Info boxes */}
        <div className="login-info-grid">
          <div className="login-info-box">
            <GraduationCap size={18} color="var(--teal)" />
            <div>
              <strong>Estudiantes</strong>
              <p>
                Entra con tu cuenta de la UGR (<code>@correo.ugr.es</code> o{' '}
                <code>@go.ugr.es</code>). Si todavía no la tienes activa, también
                sirve una cuenta de <code>Gmail</code>.
              </p>
            </div>
          </div>
          <div className="login-info-box login-info-box--professor">
            <Layers size={18} color="var(--navy)" />
            <div>
              <strong>Profesorado</strong>
              <p>El panel de administración requiere <code>juandiaz@ugr.es</code></p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="login-footer-note">
          Universidad de Granada · Departamento de Química Farmacéutica y Orgánica
        </p>
      </div>
    </div>
  );
};
