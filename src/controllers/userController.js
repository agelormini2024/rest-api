import { User } from '../models/User.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Public
export const getUsers = asyncHandler(async (req, res) => {
    const users = User.findAll();
  
    res.json({
        success: true,
        count: users.length,
        data: users
    });
});

// @desc    Obtener usuario por ID
// @route   GET /api/users/:id
// @access  Public
export const getUserById = asyncHandler(async (req, res) => {
    const user = User.findById(req.params.id);
  
    if (!user) {
        res.status(404);
        throw new Error('Usuario no encontrado');
    }

    res.json({
        success: true,
        data: user
    });
});

// @desc    Crear nuevo usuario
// @route   POST /api/users
// @access  Public
export const createUser = asyncHandler(async (req, res) => {
    const { name, email, age } = req.body;

    if (!name || !email || !age) {
        res.status(400);
        throw new Error('Por favor proporciona name, email y age');
    }

    const user = User.create({ name, email, age });

    res.status(201).json({
        success: true,
        data: user
    });
});

// @desc    Actualizar usuario
// @route   PUT /api/users/:id
// @access  Public
export const updateUser = asyncHandler(async (req, res) => {
    const user = User.update(req.params.id, req.body);

    if (!user) {
        res.status(404);
        throw new Error('Usuario no encontrado');
    }

    res.json({
        success: true,
        data: user
    });
});

// @desc    Eliminar usuario
// @route   DELETE /api/users/:id
// @access  Public
export const deleteUser = asyncHandler(async (req, res) => {
    const user = User.delete(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('Usuario no encontrado');
    }

    res.json({
        success: true,
        message: 'Usuario eliminado correctamente'
    });
});