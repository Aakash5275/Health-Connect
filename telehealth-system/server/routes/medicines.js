import express from 'express';
import {
  getMedicines,
  getMedicineById,
  searchMedicines,
  addMedicine,
  updateMedicine,
  getPharmacies
} from '../controllers/medicineController.js';

const router = express.Router();

// GET /api/medicines - Get all medicines
router.get('/', getMedicines);

// GET /api/medicines/search - Search medicines by name
router.get('/search', searchMedicines);

// GET /api/medicines/pharmacies - Get list of pharmacies
router.get('/pharmacies', getPharmacies);

// GET /api/medicines/:id - Get medicine by ID
router.get('/:id', getMedicineById);

// POST /api/medicines - Add new medicine
router.post('/', addMedicine);

// PUT /api/medicines/:id - Update medicine
router.put('/:id', updateMedicine);

export default router;
