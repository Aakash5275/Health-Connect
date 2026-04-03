import express from 'express';
import {
  getRecords,
  getRecordById,
  createRecord,
  updateRecord,
  getPrescriptions
} from '../controllers/recordController.js';

const router = express.Router();

// GET /api/records - Get all health records (with optional patient filter)
router.get('/', getRecords);

// GET /api/records/prescriptions - Get prescriptions for a patient
router.get('/prescriptions', getPrescriptions);

// GET /api/records/:id - Get record by ID
router.get('/:id', getRecordById);

// POST /api/records - Create new health record
router.post('/', createRecord);

// PUT /api/records/:id - Update health record
router.put('/:id', updateRecord);

export default router;
