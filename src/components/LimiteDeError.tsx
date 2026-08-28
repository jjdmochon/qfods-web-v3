import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  /** Nombre de la zona, para orientar al usuario y al profesor */
  zona: string;
}

interface State {
  error: Error | null;
}

/**
 * Aísla los fallos de una sección.
 *
 * Sin esto, un único error de renderizado deja la página entera en blanco: React
 * desmonta todo el árbol. Es lo que ocurrió cuando la calculadora pidió una clave
 * de datos inexistente y desapareció la aplicación completa, no sólo la
 * calculadora. Aquí el fallo queda acotado y el resto sigue usable.
 */
export class LimiteDeError extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Queda en consola para poder diagnosticarlo desde el navegador del alumno
    console.error(`[QFDOS] Fallo en «${this.props.zona}»:`, error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="error-zona" role="alert">
        <AlertTriangle size={22} color="var(--accent-amber)" />
        <div style={{ flex: 1 }}>
          <strong>No se ha podido mostrar «{this.props.zona}».</strong>
          <p>
            El resto de la plataforma sigue funcionando: usa la navegación de arriba para
            continuar. Si el problema persiste, avisa al profesor indicándole en qué
            apartado ha ocurrido.
          </p>
          <details>
            <summary>Detalle técnico</summary>
            <code>{this.state.error.message}</code>
          </details>
        </div>
        <button
          onClick={() => this.setState({ error: null })}
          className="btn btn-sm btn-outline"
        >
          <RotateCcw size={14} /> Reintentar
        </button>
      </div>
    );
  }
}
