/**
 * Rutas a los ficheros de la carpeta public/.
 *
 * Vite reescribe la ruta base de los recursos que IMPORTA, pero no toca las
 * cadenas de texto escritas a mano en los ficheros de datos. En local eso da
 * igual, porque la aplicación se sirve desde la raíz; en GitHub Pages cuelga
 * de /qfods-web-v3/ y esas rutas absolutas apuntan fuera del sitio: la imagen
 * existe, pero el navegador la pide donde no está y recibe un 404.
 *
 * Esta función antepone la base correcta en cada caso.
 */
export function recurso(ruta: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const limpia = ruta.startsWith('/') ? ruta.slice(1) : ruta;
  return `${base.endsWith('/') ? base : base + '/'}${limpia}`;
}
