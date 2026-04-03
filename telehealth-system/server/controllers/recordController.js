import { db } from '../config/firebase.js';

// Get health records for a patient
export const getRecords = async (req, res) => {
  try {
    const { patientId } = req.query;
    let query = db.collection('health_records');
    
    if (patientId) {
      query = query.where('patientId', '==', patientId);
    }
    
    const recordsSnapshot = await query.get();
    const records = [];
    recordsSnapshot.forEach(doc => {
      records.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort by date descending
    records.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get record by ID
export const getRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const recordDoc = await db.collection('health_records').doc(id).get();
    
    if (!recordDoc.exists) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    res.json({ id: recordDoc.id, ...recordDoc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create health record
export const createRecord = async (req, res) => {
  try {
    const { 
      patientId, 
      doctorId, 
      appointmentId,
      diagnosis, 
      prescription, 
      notes,
      vitals 
    } = req.body;
    
    const newRecord = {
      patientId,
      doctorId,
      appointmentId: appointmentId || null,
      diagnosis: diagnosis || '',
      prescription: prescription || [],
      notes: notes || '',
      vitals: vitals || {},
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('health_records').add(newRecord);
    res.status(201).json({ id: docRef.id, ...newRecord });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update health record
export const updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    await db.collection('health_records').doc(id).update({
      ...updates,
      updatedAt: new Date().toISOString()
    });
    
    res.json({ message: 'Record updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get prescriptions for a patient
export const getPrescriptions = async (req, res) => {
  try {
    const { patientId } = req.query;
    
    const recordsSnapshot = await db.collection('health_records')
      .where('patientId', '==', patientId)
      .get();
    
    const prescriptions = [];
    recordsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.prescription && data.prescription.length > 0) {
        prescriptions.push({
          recordId: doc.id,
          date: data.date,
          doctorId: data.doctorId,
          prescription: data.prescription
        });
      }
    });
    
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
