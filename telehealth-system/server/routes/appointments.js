import express from 'express';
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment
} from '../controllers/appointmentController.js';

const router = express.Router();

// GET /api/appointments - Get all appointments (with optional filters)
router.get('/', getAppointments);

// GET /api/appointments/:id - Get appointment by ID
router.get('/:id', getAppointmentById);

// POST /api/appointments - Create new appointment
router.post('/', createAppointment);

// PUT /api/appointments/:id - Update appointment
router.put('/:id', updateAppointment);

// DELETE /api/appointments/:id/cancel - Cancel appointment
router.delete('/:id/cancel', cancelAppointment);

export default router;
