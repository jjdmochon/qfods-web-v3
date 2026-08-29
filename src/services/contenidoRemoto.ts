// ==========================================================================
// Contenido del curso compartido
//
// Sin esto, lo que el profesor edita vive sólo en SU navegador: el alumnado
// abre la web y ve el temario que venía compilado, no los cambios. Aquí el
// contenido se publica en la hoja de cálculo y todos lo leen de allí.
//
// El reparto de papeles es deliberado:
//   · leer     — público, sin clave, en cada arranque
//   · publicar — sólo el profesor, con una clave que teclea él y que queda
//                en su navegador, nunca en el código distribuido
// ==========================================================================

import { QfdosTopic, QfdosAnnouncement, QfdosGlossaryTerm, QfdosResourceLink } from '../data/qfdosData';

const WEBAPP_URL = (import.meta.env.VITE_PRACTICAS_WEBAPP_URL ?? '').trim();
const CLAVE_KEY = 'qfdos_v3_clave_publicacion';
const CACHE_KEY = 'qfdos_v3_contenido_remoto';

export interface ContenidoCurso {
  topics: QfdosTopic[];
  announcements: QfdosAnnouncement[];
  glossary: QfdosGlossaryTerm[];
  resourceLinks: QfdosResourceLink[];
}

export interface ContenidoPublicado extends ContenidoCurso {
  publicadoEn: string;
}

export function publicacionDisponible(): boolean {
  return WEBAPP_URL.startsWith('https://script.google.com/macros/s/') && WEBAPP_URL.length > 60;
}

export function getClavePublicacion(): string {
  return localStorage.getItem(CLAVE_KEY) ?? '';
}

export function setClavePublicacion(clave: string): void {
  localStorage.setItem(CLAVE_KEY, clave.trim());
}

/**
 * Descarga el contenido publicado. Devuelve null si no hay nada publicado
 * todavía o si no se puede alcanzar la hoja — en ambos casos la aplicación
 * sigue con el contenido que trae compilado.
 */
export async function descargarContenido(): Promise<ContenidoPublicado | null> {
  if (!publicacionDisponible()) return null;

  try {
    const resp = await fetch(`${WEBAPP_URL}?accion=leerContenido&t=${Date.now()}`, {
      method: 'GET',
      redirect: 'follow'
    });
    if (!resp.ok) return null;

    const cuerpo = await resp.json();
    if (!cuerpo?.ok || cuerpo.vacio || !cuerpo.contenido) return null;

    const publicado: ContenidoPublicado = { ...cuerpo.contenido, publicadoEn: cuerpo.publicadoEn ?? '' };

    // Se guarda una copia para poder arrancar sin conexión
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(publicado)); } catch { /* cuota */ }

    return publicado;
  } catch {
    return null;
  }
}

/** Última copia descargada, para arrancar sin esperar a la red. */
export function contenidoEnCache(): ContenidoPublicado | null {
  const raw = localStorage.getItem(CACHE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as ContenidoPublicado; } catch { return null; }
}

export interface ResultadoPublicacion {
  ok: boolean;
  mensaje: string;
}

/**
 * Publica el contenido para todo el mundo. Va por POST porque el temario
 * completo no cabe en una URL.
 */
export async function publicarContenido(
  contenido: ContenidoCurso,
  clave: string
): Promise<ResultadoPublicacion> {
  if (!publicacionDisponible()) {
    return { ok: false, mensaje: 'Falta configurar VITE_PRACTICAS_WEBAPP_URL en .env.local.' };
  }
  if (!clave.trim()) {
    return { ok: false, mensaje: 'Hace falta la clave de publicación.' };
  }

  try {
    const resp = await fetch(
      `${WEBAPP_URL}?accion=guardarContenido&clave=${encodeURIComponent(clave.trim())}`,
      {
        method: 'POST',
        // text/plain evita la petición previa de CORS, que Apps Script no atiende
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(contenido),
        redirect: 'follow'
      }
    );

    const cuerpo = await resp.json().catch(() => null);
    if (cuerpo?.ok) {
      const kb = Math.round((cuerpo.bytes ?? 0) / 1024);
      return {
        ok: true,
        mensaje: `Publicado para todo el curso (${kb} KB). El alumnado lo verá al recargar.`
      };
    }
    return { ok: false, mensaje: cuerpo?.error ?? 'La hoja rechazó la publicación.' };
  } catch (err) {
    return {
      ok: false,
      mensaje: `No se pudo publicar: ${err instanceof Error ? err.message : String(err)}`
    };
  }
}

// ==========================================================================
// Entregas de un estudiante
// ==========================================================================

export interface EntregaPropia {
  hoja: string;
  fila: number;
  datos: Record<string, string>;
}

/** Lo que esa persona ha entregado, buscando su correo en todas las hojas. */
export async function misEntregas(email: string): Promise<EntregaPropia[] | null> {
  if (!publicacionDisponible() || !email) return null;

  try {
    const resp = await fetch(
      `${WEBAPP_URL}?accion=misEntregas&email=${encodeURIComponent(email)}&t=${Date.now()}`,
      { method: 'GET', redirect: 'follow' }
    );
    if (!resp.ok) return null;
    const cuerpo = await resp.json();
    return cuerpo?.ok ? (cuerpo.entregas ?? []) : null;
  } catch {
    return null;
  }
}
