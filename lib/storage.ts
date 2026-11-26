import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';
import { v4 as uuidv4 } from 'uuid';

export async function uploadFile(
  file: File,
  folder: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${uuidv4()}.${ext}`;
  const storageRef = ref(storage, fileName);

  const metadata = {
    contentType: file.type || 'video/mp4',
    cacheControl: 'public,max-age=31536000',
  };

  return new Promise((resolve, reject) => {
    // High-performance resumable chunked upload
    const task = uploadBytesResumable(storageRef, file, metadata);
    task.on(
      'state_changed',
      (snap) => {
        if (snap.totalBytes > 0) {
          const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          onProgress?.(pct);
        }
      },
      (error) => {
        console.error('Upload error:', error);
        reject(error);
      },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

export async function deleteFile(url: string) {
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch (e) {
    console.error('Error deleting file:', e);
  }
}

