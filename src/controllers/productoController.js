import { prisma } from '../../prisma.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

// @desc    Obtener todos los productos
// @route   GET /api/productos
// @access  Public
export const getProductos = asyncHandler(async (req, res) => {
  const productos = await prisma.producto.findMany();
  res.json(productos);
});

// @desc    Obtener un producto por ID
// @route   GET /api/productos/:id
// @access  Public
export const getProductoById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const producto = await prisma.producto.findUnique({
    where: { id: Number(id) },
  });
  if (!producto) {
    res.status(404);
    throw new Error('Producto no encontrado');
  }
  res.json(producto);
});