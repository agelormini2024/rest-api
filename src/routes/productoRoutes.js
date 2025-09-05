import express from 'express';
import { getProductos, getProductoById } from '../controllers/productoController.js';
// import {
//   getUsers,
//   getUserById,
//   createUser,
//   updateUser,
//   deleteUser
// } from '../controllers/userController.js';

const router = express.Router();

// Rutas para /api/productos
router.route('/')
    .get(getProductos);      // GET /api/productos
//   .post(createProducto);  // POST /api/productos

router.route('/:id')
    .get(getProductoById);   // GET /api/productos/:id
//   .put(updateProducto)    // PUT /api/productos/:id
//   .delete(deleteProducto); // DELETE /api/productos/:id

export default router;