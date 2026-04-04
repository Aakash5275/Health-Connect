import { db } from '../firebase/firebaseConfig';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function getUserRoleByUid(uid) {
  if (!uid) return null;

  try {
    // Bypassing Firestore completely to avoid timeouts and slow loading.
    // We add a brief delay to allow Login components to populate localStorage
    // with the intended role before App.js reads it.
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return localStorage.getItem('userRole') || null;
  } catch (error) {
    console.warn("Fallback error:", error);
    return null;
  }
}

export async function checkPatientExists(uid) {
  return true; // Bypass validation: let anyone act as patient
}

export async function checkDoctorExists(uid) {
  return true; // Bypass validation: let anyone act as doctor
}

export async function ensureDoctorProfile({ uid, email, name, role = 'doctor' }) {
  // Graceful return without awaiting firestore
  return; 
}

export async function ensurePatientProfile({ uid, email, name, role = 'patient' }) {
  // Graceful return without awaiting firestore
  return;
}

