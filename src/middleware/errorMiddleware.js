// Middleware para rutas no encontradas
export const notFound = (req, res, next) => {
    const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Middleware principal de manejo de errores
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
    // Si no hay status code, usar 500 (error interno del servidor)
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Error de conexión a PostgreSQL
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
        statusCode = 503;
        message = 'Error de conexión a la base de datos';
    }

    // Error de violación de restricción única (PostgreSQL)
    if (err.code === '23505') {
        statusCode = 400;
        const field = err.detail?.match(/Key \((.+?)\)/)?.[1] || 'campo';
        message = `El ${field} ya existe. Debe ser único.`;
    }

    // Error de violación de restricción NOT NULL (PostgreSQL)
    if (err.code === '23502') {
        statusCode = 400;
        const column = err.column || 'campo requerido';
        message = `El campo '${column}' es obligatorio`;
    }

    // Error de violación de clave foránea (PostgreSQL)
    if (err.code === '23503') {
        statusCode = 400;
        message = 'Referencia a un recurso que no existe';
    }

    // Error de violación de restricción check (PostgreSQL)
    if (err.code === '23514') {
        statusCode = 400;
        message = 'Los datos no cumplen con las restricciones de validación';
    }

    // Error de sintaxis SQL (PostgreSQL)
    if (err.code === '42601') {
        statusCode = 500;
        message = 'Error interno del servidor - Consulta SQL inválida';
    }

    // Error de tabla/columna no existe (PostgreSQL)
    if (err.code === '42P01' || err.code === '42703') {
        statusCode = 500;
        message = 'Error interno del servidor - Recurso de base de datos no encontrado';
    }

    // Error de tipo de dato inválido (PostgreSQL)
    if (err.code === '22P02') {
        statusCode = 400;
        message = 'Formato de datos inválido';
    }

    // Error de ID no válido (UUID/Integer inválido)
    if (err.message?.includes('invalid input syntax')) {
        statusCode = 400;
        message = 'ID proporcionado no es válido';
    }

    // Error de validación de Prisma/Sequelize
    if (err.name === 'ValidationError') {
        statusCode = 400;
        if (err.errors && Array.isArray(err.errors)) {
            message = err.errors.map(e => e.message).join(', ');
        }
    }

    // Error de registro no encontrado
    if (err.name === 'NotFoundError' || err.code === 'P2025') {
        statusCode = 404;
        message = 'Recurso no encontrado';
    }

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { 
            stack: err.stack,
            code: err.code,
            detail: err.detail 
        })
    });
};

// Middleware para capturar errores async
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};