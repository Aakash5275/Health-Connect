import { db } from '../firebase/firebaseConfig';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function getUserRoleByUid(uid) {
  if (!uid) return null;

  try {
    // Check patients collection
    const patientSnap = await Promise.race([
      getDoc(doc(db, 'patients', uid)),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
    ]);
    if (patientSnap.exists()) return patientSnap.data()?.role || 'patient';

    // Check doctors collection
    const doctorSnap = await Promise.race([
      getDoc(doc(db, 'doctors', uid)),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
    ]);
    if (doctorSnap.exists()) return doctorSnap.data()?.role || 'doctor';

    return null;
  } catch (error) {
    if (error?.message === 'timeout' || error?.code === 'unavailable' || `${error?.message || ''}`.toLowerCase().includes('offline')) {
      console.warn("Firestore unavailable or timed out. Falling back to cached role.");
      return null;
    }
    throw error;
  }
}

export async function checkPatientExists(uid) {
  if (!uid) return false;
  try {
    const snap = await getDoc(doc(db, 'patients', uid));
    return snap.exists();
  } catch (err) {
    if (err?.code === 'unavailable') return true; // graceful offline bypass
    console.error("Patient check failed:", err);
    return false;
  }
}

export async function checkDoctorExists(uid) {
  if (!uid) return false;
  try {
    const snap = await getDoc(doc(db, 'doctors', uid));
    return snap.exists();
  } catch (err) {
    if (err?.code === 'unavailable') return true; // graceful offline bypass
    console.error("Doctor check failed:", err);
    return false;
  }
}

export async function ensureDoctorProfile({ uid, email, name, role = 'doctor' }) {
  if (!uid) return;
  const docRef = doc(db, 'doctors', uid);
  const snap = await getDoc(docRef);
  if (snap.exists()) return;

  await setDoc(docRef, {
    uid,
    email: email || null,
    name: name || null,
    role,
    createdAt: new Date().toISOString(),
    createdAtServer: serverTimestamp(),
  });
}

export async function ensurePatientProfile({ uid, email, name, role = 'patient' }) {
  if (!uid) return;
  const docRef = doc(db, 'patients', uid);
  const snap = await getDoc(docRef);
  if (snap.exists()) return;

  await setDoc(docRef, {
    uid,
    email: email || null,
    name: name || null,
    role,
    createdAt: new Date().toISOString(),
    createdAtServer: serverTimestamp(),
  });
}

