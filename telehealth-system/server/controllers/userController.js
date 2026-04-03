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
    const doctorsSnapshot = await db.collection('doctors').get();
    
    const doctors = [];
    doctorsSnapshot.forEach(doc => {
      doctors.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort doctors by name for consistent UI
    doctors.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    
    res.json(doctors);
  } catch (error) {
    if (error.message.includes('NOT_FOUND') || error.message.includes('not exist')) {
        return res.json([
          { id: '1', name: 'Dr. Smriti Pandey', specialty: 'General Physician', available: true, experience: '15+ yrs', rating: 4.8 },
          { id: '2', name: 'Dr. Priya Patel', specialty: 'Pediatrician', available: true, experience: '12 yrs', rating: 4.9 },
          { id: '3', name: 'Dr. Amit Kumar', specialty: 'Cardiologist', available: false, experience: '20+ yrs', rating: 4.7 },
          { id: '4', name: 'Dr. Sunita Gupta', specialty: 'Dermatologist', available: true, experience: '8 yrs', rating: 4.6 }
        ]);
    }
    res.status(500).json({ error: error.message });
  }
};
