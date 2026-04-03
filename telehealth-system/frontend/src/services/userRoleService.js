import { db } from '../firebase/firebaseConfig';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function getUserRoleByUid(uid) {
  if (!uid) return null;

  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return null;

    const data = userSnap.data();
    return data?.role || null;
  } catch (error) {
    // If client is offline, gracefully fallback to cached role from localStorage in caller.
    if (error?.code === 'unavailable' || `${error?.message || ''}`.toLowerCase().includes('offline')) {
      return null;
    }
    throw error;
  }
}

export async function ensureUserProfile({ uid, email, name, role }) {
  if (!uid || !role) return;

  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) return;

  await setDoc(userRef, {
    uid,
    email: email || null,
    name: name || null,
    role,
    createdAt: new Date().toISOString(),
    createdAtServer: serverTimestamp(),
  });
}

