import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

// Rutas para /api/users
router.route('/')
  .get(getUsers)      // GET /api/users
  .post(createUser);  // POST /api/users

router.route('/:id')
  .get(getUserById)   // GET /api/users/:id
  .put(updateUser)    // PUT /api/users/:id
  .delete(deleteUser); // DELETE /api/users/:id

export default router;