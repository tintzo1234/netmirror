import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp, setDoc,
} from 'firebase/firestore';
import { db } from './firebase';

// ===== MOVIES =====
export async function getAllMovies() {
  const q = query(collection(db, 'movies'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getMovieById(id: string) {
  const snap = await getDoc(doc(db, 'movies', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function addMovie(data: any) {
  return addDoc(collection(db, 'movies'), { ...data, createdAt: serverTimestamp(), views: 0 });
}

export async function updateMovie(id: string, data: any) {
  return updateDoc(doc(db, 'movies', id), data);
}

export async function deleteMovie(id: string) {
  return deleteDoc(doc(db, 'movies', id));
}

// ===== EPISODES =====
export async function getEpisodesByMovie(movieId: string) {
  const q = query(
    collection(db, 'episodes'),
    where('movieId', '==', movieId),
    orderBy('season'),
    orderBy('episode')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addEpisode(data: any) {
  return addDoc(collection(db, 'episodes'), { ...data, createdAt: serverTimestamp() });
}

export async function updateEpisode(id: string, data: any) {
  return updateDoc(doc(db, 'episodes', id), data);
}

export async function deleteEpisode(id: string) {
  return deleteDoc(doc(db, 'episodes', id));
}

// ===== WATCH HISTORY =====
export async function logWatchHistory(
  userId: string,
  contentId: string,
  contentType: string,
  title: string
) {
  const ref = doc(db, 'watchHistory', `${userId}_${contentId}`);
  return setDoc(ref, {
    userId,
    contentId,
    contentType,
    title,
    watchedAt: serverTimestamp(),
  }, { merge: true });
}

export async function getUserWatchHistory(userId: string) {
  const q = query(
    collection(db, 'watchHistory'),
    where('userId', '==', userId),
    orderBy('watchedAt', 'desc'),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getAllWatchHistory() {
  const q = query(collection(db, 'watchHistory'), orderBy('watchedAt', 'desc'), limit(200));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ===== USERS =====
export async function getAllUsers() {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function upsertUser(uid: string, data: any) {
  return setDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getUserById(uid: string) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
