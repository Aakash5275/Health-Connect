import { db } from '../config/firebase.js';

// Get all users
export const getUsers = async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = [];
    usersSnapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userDoc = await db.collection('users').doc(id).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ id: userDoc.id, ...userDoc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create user
export const createUser = async (req, res) => {
  try {
    const { name, role, age, email, phone } = req.body;
    
    const newUser = {
      name,
      role: role || 'patient',
      age: age || null,
      email: email || null,
      phone: phone || null,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('users').add(newUser);
    res.status(201).json({ id: docRef.id, ...newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    await db.collection('users').doc(id).update({
      ...updates,
      updatedAt: new Date().toISOString()
    });
    
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get doctors
export const getDoctors = async (req, res) => {
  try {
    const doctorsSnapshot = await db.collection('users')
      .where('role', '==', 'doctor')
      .get();
    
    const doctors = [];
    doctorsSnapshot.forEach(doc => {
      doctors.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
