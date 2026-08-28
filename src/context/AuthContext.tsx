import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'profesor' | 'estudiante';

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  /** false cuando se entra con una cuenta personal de Google en vez de la de la UGR */
  institucional?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isProfesor: boolean;
  isEstudiante: boolean;
  /** true sólo si la cuenta pertenece a un dominio de la Universidad de Granada */
  isInstitucional: boolean;
  loginWithGoogle: (credentialResponse: { credential?: string }) => { success: boolean; error?: string };
  logout: () => void;
}

const PROFESSOR_EMAILS = ['juandiaz@ugr.es', 'juandiaz@go.ugr.es'];

/**
 * Cuentas institucionales de la UGR. Quien entra con una de ellas queda
 * identificado por su correo oficial.
 */
const UGR_DOMAINS = ['@correo.ugr.es', '@ugr.es', '@go.ugr.es'];

/**
 * Cuentas personales de Google admitidas. Se aceptan porque no todo el
 * alumnado tiene operativa la cuenta institucional al empezar el curso, pero
 * quedan marcadas como externas: el profesor ve de un vistazo quién entregó
 * con una dirección no verificable por la universidad.
 */
const PERSONAL_DOMAINS = ['@gmail.com', '@googlemail.com'];

const STORAGE_KEY = 'qfdos_v3_user';

export function esCuentaInstitucional(email: string): boolean {
  return UGR_DOMAINS.some(d => email.toLowerCase().endsWith(d));
}

function decodeJwt(token: string): Record<string, string> | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const loginWithGoogle = (credentialResponse: { credential?: string }): { success: boolean; error?: string } => {
    if (!credentialResponse.credential) {
      return { success: false, error: 'No se recibió credencial de Google.' };
    }

    const payload = decodeJwt(credentialResponse.credential);
    if (!payload) {
      return { success: false, error: 'No se pudo verificar la identidad con Google.' };
    }

    const email = (payload.email || '').toLowerCase();
    const name = payload.name || '';
    const picture = payload.picture || '';

    const institucional = esCuentaInstitucional(email);
    const personal = PERSONAL_DOMAINS.some(d => email.endsWith(d));

    if (!institucional && !personal) {
      return {
        success: false,
        error:
          `Esta cuenta no está admitida. Entra con tu correo de la UGR ` +
          `(@correo.ugr.es, @go.ugr.es o @ugr.es) o con una cuenta de Gmail. ` +
          `Cuenta recibida: ${email}`
      };
    }

    // El acceso de profesor exige cuenta institucional: una dirección personal
    // no acredita la identidad frente a la universidad.
    const role: UserRole =
      institucional && PROFESSOR_EMAILS.includes(email) ? 'profesor' : 'estudiante';

    setUser({ name, email, role, avatarUrl: picture, institucional });
    return { success: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isProfesor: user?.role === 'profesor',
      isEstudiante: user?.role === 'estudiante',
      isInstitucional: !!user && user.institucional !== false,
      loginWithGoogle,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
