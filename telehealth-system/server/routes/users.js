import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  getDoctors
} from '../controllers/userController.js';

const router = express.Router();

// GET /api/users - Get all users
router.get('/', getUsers);

// GET /api/users/doctors - Get all doctors
router.get('/doctors', getDoctors);

// GET /api/users/:id - Get user by ID
router.get('/:id', getUserById);

// POST /api/users - Create new user
router.post('/', createUser);

// PUT /api/users/:id - Update user
router.put('/:id', updateUser);

export default router;
