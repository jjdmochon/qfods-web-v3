// File Storage and Persistence Utility for QFDOS Web v2

export interface StoredFileMeta {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  dataUrl?: string;
}

const STORAGE_KEY_PREFIX = 'qfdos_v2_files_';

export const saveFileToLocal = async (file: File): Promise<StoredFileMeta> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const id = `file_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const sizeBytes = file.size;
        const sizeFormatted = sizeBytes > 1024 * 1024 
          ? `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB` 
          : `${(sizeBytes / 1024).toFixed(0)} KB`;

        const meta: StoredFileMeta = {
          id,
          name: file.name,
          size: sizeFormatted,
          type: file.type || 'application/octet-stream',
          uploadedAt: new Date().toISOString(),
          dataUrl: reader.result as string
        };

        // Cache file metadata in localStorage
        const existingList: StoredFileMeta[] = JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}index`) || '[]');
        existingList.push(meta);
        localStorage.setItem(`${STORAGE_KEY_PREFIX}index`, JSON.stringify(existingList));

        // Store file data
        try {
          localStorage.setItem(`${STORAGE_KEY_PREFIX}${id}`, reader.result as string);
        } catch (storageErr) {
          console.warn('File too large for localStorage, retained in-memory session only', storageErr);
        }

        resolve(meta);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

export const getStoredFiles = (): StoredFileMeta[] => {
  try {
    return JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}index`) || '[]');
  } catch (e) {
    console.error('Error reading stored files', e);
    return [];
  }
};
