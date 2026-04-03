import { db } from '../config/firebase.js';

// Get all appointments
export const getAppointments = async (req, res) => {
  try {
    const { patientId, doctorId, status } = req.query;
    let query = db.collection('appointments');
    
    if (patientId) {
      query = query.where('patientId', '==', patientId);
    }
    if (doctorId) {
      query = query.where('doctorId', '==', doctorId);
    }
    if (status) {
      query = query.where('status', '==', status);
    }
    
    const appointmentsSnapshot = await query.get();
    const appointments = [];
    appointmentsSnapshot.forEach(doc => {
      appointments.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointmentDoc = await db.collection('appointments').doc(id).get();
    
    if (!appointmentDoc.exists) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    res.json({ id: appointmentDoc.id, ...appointmentDoc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create appointment
export const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, time, type, notes } = req.body;
    
    // Generate a unique room ID for video consultation
    const roomId = `telehealth-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newAppointment = {
      patientId,
      doctorId,
      date,
      time: time || '10:00',
      type: type || 'video',
      status: 'scheduled',
      notes: notes || '',
      roomId,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('appointments').add(newAppointment);
    res.status(201).json({ id: docRef.id, ...newAppointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update appointment status
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    await db.collection('appointments').doc(id).update({
      ...updates,
      updatedAt: new Date().toISOString()
    });
    
    res.json({ message: 'Appointment updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel appointment
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.collection('appointments').doc(id).update({
      status: 'cancelled',
      updatedAt: new Date().toISOString()
    });
    
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
