import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import productoRoutes from './routes/productoRoutes.js';

// Helmet: Protege contra vulnerabilidades comunes
// Morgan: Registra todas las peticiones HTTP
// CORS: Permite requests desde otros dominios
// El orden de middleware es crucial - los de error van al final
// Petición → Helmet → Morgan → JSON Parser → CORS → Rutas → Error Handlers

const app = express();

// Middleware de seguridad
app.use(helmet()); // Añade headers de seguridad

// Middleware de logging
app.use(morgan('combined')); // Logs detallados de requests

// Middleware de parsing
app.use(express.json({ limit: '10mb' })); // Parse JSON con límite
app.use(express.urlencoded({ extended: true })); // Parse form data ***

// CORS - Configuración para desarrollo
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Ruta de salud del servidor
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Rutas de la API
app.use('/api/users', userRoutes);
app.use('/api/productos', productoRoutes); 

// Middleware de manejo de errores (debe ir al final)
app.use(notFound);
app.use(errorHandler);

export default app;