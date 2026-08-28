// ==========================================================================
// Almacenamiento local de materiales docentes (IndexedDB)
// Los PDF, imágenes y audios subidos por el profesor se guardan como Blob
// en el navegador. Para distribuirlos al alumnado hay que exportar el curso
// (JSON + ficheros) o enlazar a Google Drive — ver exportCourseBundle().
// ==========================================================================

const DB_NAME = 'qfdos_v3_files';
const DB_VERSION = 1;
const STORE = 'materials';

export interface StoredFile {
  id: string;
  name: string;
  mime: string;
  size: number;
  topicId?: string;
  kind: 'slides' | 'notes' | 'audio' | 'image' | 'other';
  uploadedAt: string;
  blob: Blob;
}

export interface StoredFileMeta extends Omit<StoredFile, 'blob'> {}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' });
        store.createIndex('topicId', 'topicId', { unique: false });
        store.createIndex('kind', 'kind', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('No se pudo abrir IndexedDB'));
  });
}

function tx<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    db =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(STORE, mode);
        const request = fn(transaction.objectStore(STORE));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        transaction.oncomplete = () => db.close();
      })
  );
}

export const MAX_FILE_BYTES = 40 * 1024 * 1024; // 40 MB por fichero

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function saveFile(
  file: File,
  kind: StoredFile['kind'],
  topicId?: string
): Promise<StoredFileMeta> {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(
      `"${file.name}" pesa ${formatBytes(file.size)}. El máximo por fichero es ${formatBytes(MAX_FILE_BYTES)}.`
    );
  }

  const record: StoredFile = {
    id: `f_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    name: file.name,
    mime: file.type || 'application/octet-stream',
    size: file.size,
    topicId,
    kind,
    uploadedAt: new Date().toISOString(),
    blob: file
  };

  await tx('readwrite', store => store.put(record));
  const { blob: _blob, ...meta } = record;
  return meta;
}

export async function listFiles(topicId?: string): Promise<StoredFileMeta[]> {
  const all = await tx<StoredFile[]>('readonly', store => store.getAll());
  return all
    .filter(f => (topicId ? f.topicId === topicId : true))
    .map(({ blob: _blob, ...meta }) => meta)
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

export async function getFileBlob(id: string): Promise<Blob | null> {
  const rec = await tx<StoredFile | undefined>('readonly', store => store.get(id));
  return rec?.blob ?? null;
}

/** Devuelve una URL de objeto para visualizar el fichero. Recuerda revocarla. */
export async function getFileUrl(id: string): Promise<string | null> {
  const blob = await getFileBlob(id);
  return blob ? URL.createObjectURL(blob) : null;
}

export async function deleteFile(id: string): Promise<void> {
  await tx('readwrite', store => store.delete(id));
}

export async function getUsage(): Promise<{ count: number; bytes: number; quota?: number }> {
  const all = await tx<StoredFile[]>('readonly', store => store.getAll());
  const bytes = all.reduce((sum, f) => sum + f.size, 0);

  let quota: number | undefined;
  try {
    if (navigator.storage?.estimate) {
      const est = await navigator.storage.estimate();
      quota = est.quota;
    }
  } catch {
    /* estimate no disponible */
  }

  return { count: all.length, bytes, quota };
}

/** Descarga un fichero almacenado al disco del usuario. */
export async function downloadStoredFile(id: string, filename: string): Promise<void> {
  const blob = await getFileBlob(id);
  if (!blob) throw new Error('El fichero ya no está disponible.');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function detectKind(file: File): StoredFile['kind'] {
  const n = file.name.toLowerCase();
  if (file.type.startsWith('audio/')) return 'audio';
  if (file.type.startsWith('image/')) return 'image';

  // Los formatos de presentación son diapositivas por definición
  if (/\.pptx?$/.test(n)) return 'slides';

  if (file.type === 'application/pdf' || n.endsWith('.pdf')) {
    // "apuntes" gana sobre "tema": un PDF llamado "Tema-03-Apuntes" son apuntes.
    // Palabras como "tema" o "clase" sólo dicen a qué sesión pertenece el fichero.
    if (/apunte|nota|resumen|guion|guión|dossier/.test(n)) return 'notes';
    if (/diapo|slide|present|transparenc/.test(n)) return 'slides';
    return 'notes';
  }
  return 'other';
}
