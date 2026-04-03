import { db } from '../config/firebase.js';

// Get all medicines
export const getMedicines = async (req, res) => {
  try {
    const { name, pharmacy, available } = req.query;
    let query = db.collection('medicines');
    
    const medicinesSnapshot = await query.get();
    let medicines = [];
    medicinesSnapshot.forEach(doc => {
      medicines.push({ id: doc.id, ...doc.data() });
    });
    
    // Filter by name if provided
    if (name) {
      medicines = medicines.filter(m => 
        m.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    
    // Filter by pharmacy if provided
    if (pharmacy) {
      medicines = medicines.filter(m => 
        m.pharmacy.toLowerCase().includes(pharmacy.toLowerCase())
      );
    }
    
    // Filter by availability if provided
    if (available !== undefined) {
      const isAvailable = available === 'true';
      medicines = medicines.filter(m => m.available === isAvailable);
    }
    
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get medicine by ID
export const getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;
    const medicineDoc = await db.collection('medicines').doc(id).get();
    
    if (!medicineDoc.exists) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    
    res.json({ id: medicineDoc.id, ...medicineDoc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search medicines by name
export const searchMedicines = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const medicinesSnapshot = await db.collection('medicines').get();
    const medicines = [];
    
    medicinesSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.name.toLowerCase().includes(query.toLowerCase())) {
        medicines.push({ id: doc.id, ...data });
      }
    });
    
    // Group by medicine name
    const grouped = medicines.reduce((acc, med) => {
      if (!acc[med.name]) {
        acc[med.name] = [];
      }
      acc[med.name].push({
        pharmacy: med.pharmacy,
        available: med.available,
        price: med.price || null
      });
      return acc;
    }, {});
    
    res.json(grouped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add medicine (for pharmacy owners)
export const addMedicine = async (req, res) => {
  try {
    const { name, pharmacy, available, price, quantity } = req.body;
    
    const newMedicine = {
      name,
      pharmacy,
      available: available !== false,
      price: price || null,
      quantity: quantity || 0,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('medicines').add(newMedicine);
    res.status(201).json({ id: docRef.id, ...newMedicine });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update medicine availability
export const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    await db.collection('medicines').doc(id).update({
      ...updates,
      updatedAt: new Date().toISOString()
    });
    
    res.json({ message: 'Medicine updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get pharmacies
export const getPharmacies = async (req, res) => {
  try {
    const medicinesSnapshot = await db.collection('medicines').get();
    const pharmacies = new Set();
    
    medicinesSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.pharmacy) {
        pharmacies.add(data.pharmacy);
      }
    });
    
    res.json(Array.from(pharmacies));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
