# 📚 Documentación: Flujo Completo de la REST API

## 🎯 Introducción

Esta documentación explica de manera didáctica cómo funciona el flujo completo de una REST API construida con Node.js, Express y ES6 modules. Está diseñada para servir como template para futuras APIs.

---

## 🏗️ Arquitectura General

```
my-api/
├── server.js              # 🚪 Punto de entrada principal
├── src/
│   ├── app.js             # 🧠 Configuración central de Express
│   ├── controllers/       # 🎮 Lógica de negocio
│   │   └── userController.js
│   ├── models/            # 📝 Modelos de datos
│   │   └── User.js
│   ├── routes/            # 🛣️ Definición de rutas
│   │   └── userRoutes.js
│   ├── middleware/        # 🛡️ Funciones intermedias
│   │   └── errorMiddleware.js
│   └── config/            # ⚙️ Configuraciones
├── .env                   # 🔒 Variables de entorno
├── package.json           # 📦 Dependencias y scripts
└── api.http              # 🧪 Tests de endpoints
```

---

## 🚀 Flujo Completo de una Petición HTTP

### 1. **Punto de Entrada: `server.js`**

```
🌐 Cliente hace petición → 📡 Puerto 3000 → server.js
```

**Responsabilidades:**
- Escucha en el puerto configurado (3000 por defecto)
- Carga las variables de entorno desde `.env`
- Importa y ejecuta la configuración de la app
- Maneja el cierre graceful del servidor

```javascript
// server.js - El portero principal
import app from './src/app.js';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
});
```

---

### 2. **Configuración Central: `src/app.js`**

```
📡 Petición llega → 🔧 Middleware Stack → 🛣️ Rutas
```

**Stack de Middleware (ORDEN CRÍTICO):**

```javascript
// app.js - El cerebro que procesa todo
const app = express();

// 1️⃣ SEGURIDAD
app.use(helmet()); // Añade headers de seguridad HTTP

// 2️⃣ LOGGING
app.use(morgan('combined')); // Registra cada petición HTTP

// 3️⃣ PARSING
app.use(express.json({ limit: '10mb' })); // Convierte JSON → Objeto JS
app.use(express.urlencoded({ extended: true })); // Parse form data

// 4️⃣ CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// 5️⃣ RUTAS
app.use('/api/users', userRoutes);

// 6️⃣ ERROR HANDLERS (SIEMPRE AL FINAL)
app.use(notFound);
app.use(errorHandler);
```

**Flujo de Procesamiento:**
```
Petición → Helmet → Morgan → JSON Parser → CORS → Rutas → Error Handler
```

---

## 🔄 Ejemplos Prácticos de Flujo

### **Ejemplo 1: GET /api/users**

#### **Petición:**
```http
GET http://localhost:3000/api/users
```

#### **Flujo Paso a Paso:**

**1. Enrutamiento:**
```javascript
// app.js - Línea que dirige el tráfico
app.use('/api/users', userRoutes);
```

**2. Identificación de Ruta:**
```javascript
// userRoutes.js - Encuentra la función exacta
router.route('/')
  .get(getUsers)  // ← Aquí coincide GET /api/users
```

**3. Ejecución del Controlador:**
```javascript
// userController.js - Lógica de negocio
export const getUsers = asyncHandler(async (req, res) => {
  const users = User.findAll(); // ← Llama al modelo
  
  res.json({
    success: true,
    count: users.length,
    data: users
  });
});
```

**4. Procesamiento en el Modelo:**
```javascript
// User.js - Acceso a datos
static findAll() {
  return users; // Devuelve el array de usuarios en memoria
}
```

**5. Respuesta Final:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    { "id": 1, "name": "Juan Pérez", "email": "juan@email.com", "age": 25 },
    { "id": 2, "name": "María García", "email": "maria@email.com", "age": 30 },
    { "id": 3, "name": "Carlos López", "email": "carlos@email.com", "age": 28 }
  ]
}
```

---

### **Ejemplo 2: POST /api/users (Crear Usuario)**

#### **Petición:**
```http
POST http://localhost:3000/api/users
Content-Type: application/json

{
  "name": "Ana Martínez",
  "email": "ana@email.com",
  "age": 27
}
```

#### **Flujo Detallado:**

```
📨 POST /api/users con JSON body
    ↓
🔧 express.json() - Convierte el JSON en req.body
    ↓
🛣️ userRoutes.js - router.route('/').post(createUser)
    ↓
🎮 userController.js - createUser()
    ↓ 
🔍 Validación de entrada (name, email, age requeridos)
    ↓
📝 User.js - User.create(userData)
    ↓
✅ Validación del modelo + verificación email único
    ↓
💾 Almacenamiento en array users[]
    ↓
📤 Respuesta JSON con status 201
```

#### **En el Controlador:**
```javascript
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, age } = req.body; // ← Datos parseados por express.json()
  
  // Validación de entrada
  if (!name || !email || !age) {
    res.status(400);
    throw new Error('Por favor proporciona name, email y age');
  }

  const user = User.create({ name, email, age }); // ← Delegación al modelo

  res.status(201).json({
    success: true,
    data: user
  });
});
```

#### **En el Modelo:**
```javascript
static create(userData) {
  const user = new User(userData);
  const errors = user.validate(); // ← Validación interna
  
  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }

  // Verificación de email único
  if (users.some(u => u.email === user.email)) {
    throw new Error('El email ya está registrado');
  }

  users.push(user); // ← Persistencia en memoria
  return user;
}
```

---

## 🛡️ Manejo de Errores

### **Flujo de Error:**

```
❌ Error en cualquier punto del flujo
    ↓
🛡️ asyncHandler() - Captura automática de errores async
    ↓
🚨 errorHandler() - Middleware de manejo de errores
    ↓
📤 Respuesta de error estandarizada
```

### **Tipos de Errores Manejados:**

1. **Errores de Validación (400):**
```javascript
// Error: Campos requeridos faltantes
{
  "success": false,
  "error": "Por favor proporciona name, email y age"
}
```

2. **Errores de Recurso No Encontrado (404):**
```javascript
// Error: Usuario con ID inexistente
{
  "success": false,
  "error": "Usuario no encontrado"
}
```

3. **Errores de Duplicado (400):**
```javascript
// Error: Email ya registrado
{
  "success": false,
  "error": "El email ya está registrado"
}
```

4. **Errores de Ruta No Encontrada (404):**
```javascript
// Error: Endpoint inexistente
{
  "success": false,
  "error": "Ruta no encontrada - /api/productos"
}
```

### **asyncHandler Explicado:**
```javascript
// Envuelve funciones async para capturar errores automáticamente
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Sin asyncHandler tendrías que hacer esto en cada función:
export const getUsers = async (req, res, next) => {
  try {
    const users = User.findAll();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error); // ← Manualmente pasar errores
  }
};
```

---

## 📊 Estructura de Datos

### **Modelo User:**

```javascript
// Estructura de un usuario
{
  id: 1,                                    // Autoincremental
  name: "Juan Pérez",                       // String, min 2 caracteres
  email: "juan@email.com",                  // String, formato email válido
  age: 25,                                  // Number, entre 0-120
  createdAt: "2025-09-02T10:30:00.000Z"    // ISO String, auto-generado
}
```

### **Base de Datos Simulada:**

```javascript
// Array en memoria que simula una base de datos
let users = [
  { id: 1, name: 'Juan Pérez', email: 'juan@email.com', age: 25 },
  { id: 2, name: 'María García', email: 'maria@email.com', age: 30 },
  { id: 3, name: 'Carlos López', email: 'carlos@email.com', age: 28 }
];

let nextId = 4; // Contador para IDs únicos
```

**⚠️ Importante:** Los datos se resetean en cada reinicio del servidor.

---

## 🛣️ Endpoints Disponibles

| Método | Endpoint       | Descripción               | Body Requerido          |
|--------|----------------|---------------------------|-------------------------|
|`GET`   |`/health`       | Estado del servidor       | -                       |
|`GET`   |`/api/users`    | Obtener todos los usuarios| -                       |
|`GET`   |`/api/users/:id`| Obtener usuario específico| -                       |
|`POST`  |`/api/users`    | Crear nuevo usuario       | `{name, email, age}`    |
|`PUT`   |`/api/users/:id`| Actualizar usuario        | `{name?, email?, age?}` |
|`DELETE`|`/api/users/:id`| Eliminar usuario          | -                       |

### **Formato de Respuesta Estándar:**

**Éxito:**
```javascript
{
  "success": true,
  "data": {...},        // Para respuestas con datos
  "count": 5,           // Para listas (opcional)
  "message": "..."      // Para acciones sin datos (opcional)
}
```

**Error:**
```javascript
{
  "success": false,
  "error": "Descripción del error",
  "stack": "..."        // Solo en desarrollo
}
```

---

## ⚙️ Configuración

### **Variables de Entorno (.env):**
```env
NODE_ENV=development          # Entorno de ejecución
PORT=3000                    # Puerto del servidor
FRONTEND_URL=http://localhost:3000  # URL del frontend para CORS
API_URL=http://localhost:3000/api   # URL base de la API
```

### **Scripts de NPM:**
```json
{
  "scripts": {
    "start": "node server.js",     // Producción
    "dev": "nodemon server.js"     // Desarrollo con auto-reload
  }
}
```

---

## 🔄 Diagrama Visual del Flujo Completo

```
🌐 Cliente (Postman, Browser, App)
    ↓ (HTTP Request)
📡 server.js (Puerto 3000)
    ↓ (Carga configuración)
🔧 app.js (Middleware Stack)
    ├── helmet() .................... Seguridad HTTP
    ├── morgan() .................... Logging de requests
    ├── express.json() .............. Parsing del body
    ├── cors() ...................... Control de CORS
    └── userRoutes .................. Enrutamiento
         ↓ (Identifica ruta específica)
🛣️ userRoutes.js
    ├── GET / → getUsers ............ Listar todos
    ├── POST / → createUser ......... Crear nuevo
    ├── GET /:id → getUserById ...... Obtener uno
    ├── PUT /:id → updateUser ....... Actualizar
    └── DELETE /:id → deleteUser .... Eliminar
         ↓ (Ejecuta lógica de negocio)
🎮 userController.js
    ├── Validación de entrada ....... Campos requeridos
    ├── Llamada al modelo ........... Operaciones CRUD
    └── Formateo de respuesta ....... Estructura estándar
         ↓ (Acceso a datos)
📝 User.js (Modelo de datos)
    ├── Operaciones CRUD ............ create, read, update, delete
    ├── Validación de datos ......... email, age, name
    └── Simulación de BD ............ Array en memoria
         ↓ (Resultado procesado)
📤 Respuesta JSON al cliente
```

---

## 🧪 Testing de la API

### **Usando el archivo api.http:**

```http
### Verificar estado del servidor
GET http://localhost:3000/health

### Obtener todos los usuarios
GET http://localhost:3000/api/users

### Crear un nuevo usuario
POST http://localhost:3000/api/users
Content-Type: application/json

{
  "name": "Ana Martínez",
  "email": "ana@email.com",
  "age": 27
}

### Obtener usuario específico
GET http://localhost:3000/api/users/1

### Actualizar usuario
PUT http://localhost:3000/api/users/1
Content-Type: application/json

{
  "name": "Juan Carlos Pérez",
  "age": 26
}

### Eliminar usuario
DELETE http://localhost:3000/api/users/1
```

---

## 🚀 Comandos de Inicialización

### **Setup inicial del proyecto:**

```bash
# 1. Crear directorio e inicializar
mkdir my-express-api && cd my-express-api
npm init -y

# 2. Instalar dependencias
npm install express cors helmet morgan dotenv
npm install --save-dev nodemon

# 3. Crear estructura de carpetas
mkdir -p src/{controllers,models,routes,middleware,config}

# 4. Crear archivos principales
touch server.js src/app.js .env .gitignore
touch src/controllers/userController.js
touch src/models/User.js
touch src/routes/userRoutes.js
touch src/middleware/errorMiddleware.js

# 5. Ejecutar en desarrollo
npm run dev
```

---

## 🔄 Próximos Pasos para Expandir

### **1. Base de Datos Real:**
- **MongoDB + Mongoose:** Para NoSQL
- **PostgreSQL + Prisma:** Para SQL
- **SQLite:** Para prototipado rápido

### **2. Autenticación y Autorización:**
- **JWT (JSON Web Tokens):** Para autenticación stateless
- **bcrypt:** Para hash de contraseñas
- **Middleware de autenticación:** Proteger rutas

### **3. Validación Avanzada:**
- **Joi:** Validación de esquemas robusta
- **express-validator:** Middleware de validación
- **Zod:** Validación con TypeScript

### **4. Testing:**
- **Jest:** Framework de testing
- **Supertest:** Testing de APIs HTTP
- **Testing de integración y unitario**

### **5. Documentación Automática:**
- **Swagger/OpenAPI:** Documentación interactiva
- **Postman Collections:** Colecciones exportables

### **6. Optimización y Monitoreo:**
- **Compression:** Compresión gzip
- **Rate Limiting:** Límites de peticiones
- **Health Checks:** Monitoreo del estado
- **Logging avanzado:** Winston, Pino

### **7. Deployment:**
- **Docker:** Containerización
- **PM2:** Process manager
- **Environment configs:** Múltiples entornos

---

## 💡 Conceptos Clave Aprendidos

### **1. Separation of Concerns (Separación de Responsabilidades):**
- **server.js:** Solo inicialización del servidor
- **app.js:** Solo configuración de Express
- **Controllers:** Solo lógica de negocio
- **Models:** Solo acceso y validación de datos
- **Routes:** Solo definición de endpoints

### **2. Middleware Pattern:**
- **Secuencial:** Se ejecutan en orden
- **Reutilizable:** Un middleware puede usarse en múltiples rutas
- **Modular:** Cada middleware tiene una responsabilidad específica

### **3. Error Handling Centralizado:**
- **asyncHandler:** Captura automática de errores async
- **errorMiddleware:** Manejo uniforme de errores
- **Respuestas consistentes:** Mismo formato para todos los errores

### **4. RESTful Design:**
- **Recursos:** `/api/users` representa la colección de usuarios
- **Métodos HTTP:** GET, POST, PUT, DELETE para CRUD
- **Status Codes:** 200, 201, 400, 404, 500 apropiados
- **Respuestas consistentes:** Mismo formato de respuesta

### **5. ES6 Modules:**
- **import/export:** Sintaxis moderna de módulos
- **"type": "module":** Habilitación en package.json
- **Named exports:** Múltiples exports por archivo
- **Default exports:** Un export principal por archivo

---

## 🎯 Conclusión

Esta REST API template proporciona una base sólida y escalable para construir APIs modernas con Node.js y Express. La arquitectura modular permite:

- **Fácil mantenimiento:** Código organizado por responsabilidades
- **Escalabilidad:** Estructura que soporta crecimiento
- **Reutilización:** Template aplicable a diferentes proyectos
- **Mejores prácticas:** Implementa patrones estándar de la industria

**¡Ahora tienes una API completamente funcional y bien documentada para usar como base en tus futuros proyectos!** 🚀

---

*Documentación creada el 2 de septiembre de 2025*  
*Template de REST API con Node.js, Express y ES6*
