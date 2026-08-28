// ==========================================================================
// Entrega de datos de prácticas al profesorado
//
// El envío a Google Sheets se hace con `mode: 'no-cors'`, y eso tiene una
// consecuencia importante: el navegador NUNCA devuelve el estado de la
// respuesta. Un fetch que "no lanza excepción" no demuestra que el dato haya
// llegado — si la URL no está configurada o el script está caído, la promesa
// se resuelve igualmente. Por eso aquí no se afirma nunca que algo se ha
// enviado: se distingue entre "enviado sin confirmación" y "no configurado",
// y en ambos casos se ofrece una vía alternativa que sí llega al profesor.
// ==========================================================================

export const PROFESOR_EMAIL = 'juandiaz@ugr.es';

const GSHEET_ID = '1RrMzWJPFOKKH76vJh70pQw9vbiQZNOGOJH7vNaTGkso';

/** URL del Apps Script desplegado. Se define en .env.local */
const WEBAPP_URL = (import.meta.env.VITE_PRACTICAS_WEBAPP_URL ?? '').trim();

/** Un despliegue real de Apps Script tiene un id largo tras /macros/s/ */
export function envioConfigurado(): boolean {
  return (
    WEBAPP_URL.startsWith('https://script.google.com/macros/s/') &&
    !WEBAPP_URL.includes('PLACEHOLDER') &&
    WEBAPP_URL.length > 60
  );
}

export type EstadoEnvio = 'confirmado' | 'enviado-sin-confirmar' | 'no-configurado' | 'error';

export interface ResultadoEnvio {
  estado: EstadoEnvio;
  mensaje: string;
  /** Fila de la hoja en la que quedó registrada la entrega */
  fila?: number;
}

/**
 * Envía una fila a la hoja del profesor.
 *
 * Un Apps Script desplegado con acceso «Cualquier usuario» responde con CORS
 * abierto a una petición GET simple, así que aquí SÍ se lee la respuesta y se
 * confirma la recepción con el número de fila. Sólo si esa lectura falla —por
 * ejemplo, porque el despliegue quedó restringido— se reintenta a ciegas con
 * `no-cors`, y entonces se dice claramente que no hay confirmación.
 */
export async function enviarAHoja(
  hoja: string,
  datos: Record<string, string>
): Promise<ResultadoEnvio> {
  if (!envioConfigurado()) {
    return {
      estado: 'no-configurado',
      mensaje:
        'El envío automático a la hoja no está configurado. Usa «Enviar por correo»: ' +
        'llega igual al profesor y te queda copia en Enviados.'
    };
  }

  const params = new URLSearchParams({ sheetId: GSHEET_ID, sheetName: hoja, ...datos });
  const url = `${WEBAPP_URL}?${params.toString()}`;

  try {
    const resp = await fetch(url, { method: 'GET', redirect: 'follow' });
    if (resp.ok) {
      const cuerpo = await resp.json().catch(() => null);
      if (cuerpo?.ok) {
        return {
          estado: 'confirmado',
          fila: cuerpo.fila,
          mensaje: `Recibido y anotado en la hoja «${hoja}», fila ${cuerpo.fila}.`
        };
      }
      return {
        estado: 'error',
        mensaje: `La hoja rechazó el envío: ${cuerpo?.error ?? 'respuesta inesperada'}.`
      };
    }
    return { estado: 'error', mensaje: `El servidor respondió ${resp.status}.` };
  } catch {
    // CORS bloqueado: el envío puede haber llegado igualmente, pero no se sabe
    try {
      await fetch(url, { method: 'GET', mode: 'no-cors' });
      return {
        estado: 'enviado-sin-confirmar',
        mensaje:
          'Enviado, pero el navegador no ha podido confirmar la recepción. Suele ocurrir ' +
          'cuando el script de Google está desplegado como «Solo yo» en vez de «Cualquier ' +
          'usuario». Guarda una copia y avisa al profesor.'
      };
    } catch (err2) {
      return {
        estado: 'error',
        mensaje: `No se pudo enviar: ${err2 instanceof Error ? err2.message : String(err2)}`
      };
    }
  }
}

/** Comprueba que el endpoint está vivo, sin escribir nada en la hoja. */
export async function comprobarEndpoint(): Promise<ResultadoEnvio> {
  if (!envioConfigurado()) {
    return { estado: 'no-configurado', mensaje: 'Falta VITE_PRACTICAS_WEBAPP_URL en .env.local' };
  }
  try {
    const resp = await fetch(WEBAPP_URL, { method: 'GET', redirect: 'follow' });
    const cuerpo = await resp.json().catch(() => null);
    return cuerpo?.ok
      ? { estado: 'confirmado', mensaje: 'El endpoint responde correctamente.' }
      : { estado: 'error', mensaje: 'Responde, pero no con el formato esperado. ¿Está el script actualizado?' };
  } catch {
    return {
      estado: 'error',
      mensaje: 'No responde. Revisa que la implementación sea de tipo «Aplicación web» con acceso «Cualquier usuario».'
    };
  }
}

/** Convierte los datos en un texto legible para el cuerpo de un correo. */
export function componerTexto(titulo: string, datos: Record<string, string>): string {
  const lineas = Object.entries(datos)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${etiquetar(k)}: ${v}`);

  return [
    `${titulo}`,
    `Química Farmacéutica II · Prácticas de laboratorio`,
    ''.padEnd(52, '-'),
    ...lineas,
    ''.padEnd(52, '-'),
    `Enviado desde la plataforma QFDOS el ${new Date().toLocaleString('es-ES')}`
  ].join('\n');
}

/**
 * Nombres legibles para el informe. Las claves se mantienen estables porque
 * son también los encabezados de columna de la hoja de cálculo; lo que cambia
 * es cómo se leen en el correo.
 */
const ETIQUETAS: Record<string, string> = {
  grupo: 'Grupo',
  puesto: 'Puesto',
  alumno1: 'Alumno 1',
  email1: 'Correo 1',
  alumno2: 'Alumno 2',
  email2: 'Correo 2',
  cuentaDeEnvio: 'Enviado desde',
  tipoDeCuenta: 'Tipo de cuenta',
  fechaSesion: 'Fecha de la sesión',
  entregadoEn: 'Entregado el',
  etapa1Naftol: 'Etapa 1 · α-naftol pesado',
  etapa1Crudo: 'Etapa 1 · oxirano crudo obtenido',
  etapa1Rendimiento: 'Etapa 1 · rendimiento',
  etapa1Aspecto: 'Etapa 1 · aspecto',
  etapa2Oxirano: 'Etapa 2 · oxirano de partida',
  etapa2Propranolol: 'Etapa 2 · propranolol obtenido',
  etapa2RendEtapa: 'Etapa 2 · rendimiento de etapa',
  etapa2RendGlobal: 'Etapa 2 · rendimiento global',
  etapa2PuntoFusion: 'Etapa 2 · punto de fusión',
  etapa3Compuesto: 'Etapa 3 · compuesto',
  etapa3Aldehido: 'Etapa 3 · aldehído empleado',
  etapa3Producto: 'Etapa 3 · producto obtenido',
  etapa3Rendimiento: 'Etapa 3 · rendimiento',
  etapa3PuntoFusion: 'Etapa 3 · punto de fusión',
  etapa3Cristales: 'Etapa 3 · hábito cristalino',
  cuestion1: 'Cuestión 1',
  cuestion2: 'Cuestión 2',
  cuestion3: 'Cuestión 3',
  observaciones: 'Observaciones',
  nombre: 'Nombre',
  email: 'Correo',
  iniciales: 'Iniciales',
  fecha: 'Fecha',
  hora: 'Hora',
  materialFaltante: 'Material que falta',
  totalFaltante: 'Nº de elementos que faltan',
  normasAceptadas: 'Normas aceptadas'
};

function etiquetar(clave: string): string {
  if (ETIQUETAS[clave]) return ETIQUETAS[clave];
  // Separa camelCase y también los dígitos pegados: etapa1Crudo → etapa 1 crudo
  const s = clave
    .replace(/([a-zá-ú])([A-ZÁ-Ú])/g, '$1 $2')
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .toLowerCase()
    .trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Abre el cliente de correo con el informe ya redactado.
 * Es la vía que sí garantiza que el profesor reciba los datos.
 */
export function enviarPorCorreo(asunto: string, titulo: string, datos: Record<string, string>): void {
  const cuerpo = componerTexto(titulo, datos);
  const url =
    `mailto:${PROFESOR_EMAIL}` +
    `?subject=${encodeURIComponent(asunto)}` +
    `&body=${encodeURIComponent(cuerpo)}`;
  window.location.href = url;
}

/** Descarga los datos como fichero de texto, para entregarlos a mano. */
export function descargarInforme(nombreFichero: string, titulo: string, datos: Record<string, string>): void {
  const blob = new Blob([componerTexto(titulo, datos)], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreFichero.endsWith('.txt') ? nombreFichero : `${nombreFichero}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Copia el informe al portapapeles. */
export async function copiarInforme(titulo: string, datos: Record<string, string>): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(componerTexto(titulo, datos));
    return true;
  } catch {
    return false;
  }
}
