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

export const createProducto = asyncHandler(async (req, res) => {
    const { nombre, precio, descripcion, stock } = req.body;

    if (!nombre || !precio || !descripcion) {
        res.status(400);
        throw new Error('Por favor proporciona nombre, precio y descripción');
    }

    const producto = await prisma.producto.create({
        data: {
            nombre,
            precio: parseFloat(precio),
            descripcion,
            stock: parseInt(stock, 10)
        }
    });

    res.status(201).json(producto);
});

export const updateProducto = asyncHandler(async(req,res)=> {
    const { nombre, precio, descripcion, stock } = req.body;
    const {id} = req.params

        
    const producto = await prisma.producto.update({
        where: {
            id: Number(id)
        },
        data: {
            nombre,
            precio,
            descripcion,
            stock
        }
    })

    res.status(200).json(producto)
})

export const updateStockProducto = asyncHandler(async(req, res)=> {
    const {id} = req.params
    const producto = await prisma.producto.update({
        where: {
            id: Number(id)
        },
        data: {
            stock: {
                decrement: 1
            }
        }
    })

    res.status(200).json(producto)

})

export const deleteProducto = asyncHandler(async(req, res) => {
    const { id } = req.params

    const producto = await prisma.producto.delete({
        where: {
            id: Number(id)
        }
    })

    res.status(200).json(producto)
}) 


