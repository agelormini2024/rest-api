# 📚 Documentación: Flujo Completo de la REST API

## 🎯 Introducción

Esta documentación explica de manera didáctica cómo funciona el flujo completo de una REST API construida con Node.js, Express, PostgreSQL y Prisma ORM. Incluye arquitectura modular, manejo de errores específicos de PostgreSQL, y implementa dos patrones de almacenamiento: usuarios simulados en memoria y productos en base de datos real.

---

## 🏗️ Arquitectura General

```
rest-api/
├── server.js              # 🚪 Punto de entrada principal
├── prisma.js              # 🗄️ Cliente de Prisma configurado
├── src/
│   ├── app.js             # 🧠 Configuración central de Express
│   ├── controllers/       # 🎮 Lógica de negocio
│   │   ├── userController.js      # Usuarios (memoria)
│   │   └── productoController.js  # Productos (PostgreSQL)
│   ├── models/            # 📝 Modelos de datos
│   │   └── User.js        # Modelo simulado de usuario
│   ├── routes/            # 🛣️ Definición de rutas
│   │   ├── userRoutes.js          # Endpoints de usuarios
│   │   └── productoRoutes.js      # Endpoints de productos
│   ├── middleware/        # 🛡️ Funciones intermedias
│   │   └── errorMiddleware.js     # Manejo errores PostgreSQL
│   └── config/            # ⚙️ Configuraciones
├── prisma/
│   ├── schema.prisma      # 📊 Esquema de base de datos
│   └── migrations/        # 🔄 Historial de migraciones
├── .env                   # 🔒 Variables de entorno + DATABASE_URL
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

### **Ejemplo 3: GET /api/productos (Con PostgreSQL + Prisma)**

#### **Petición:**
```http
GET http://localhost:3000/api/productos
```

#### **Flujo Paso a Paso:**

**1. Enrutamiento:**
```javascript
// app.js - Línea que dirige el tráfico
app.use('/api/productos', productoRoutes);
```

**2. Identificación de Ruta:**
```javascript
// productoRoutes.js - Encuentra la función exacta
router.route('/')
  .get(getProductos)  // ← Aquí coincide GET /api/productos
```

**3. Ejecución del Controlador:**
```javascript
// productoController.js - Lógica de negocio
export const getProductos = asyncHandler(async (req, res) => {
  const productos = await prisma.producto.findMany(); // ← Consulta a PostgreSQL
  
  res.json({
    success: true,
    count: productos.length,
    data: productos
  });
});
```

**4. Procesamiento con Prisma:**
```javascript
// prisma.js - Cliente configurado
import { PrismaClient } from '@prisma/client';
export const prisma = globalThis.prisma || new PrismaClient();

// La consulta prisma.producto.findMany() genera:
SELECT id, nombre, descripcion, precio, stock, "createdAt", "updatedAt" 
FROM "Producto";
```

**5. Respuesta Final:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "nombre": "Notebook Lenovo",
      "descripcion": "Laptop para oficina",
      "precio": "1200.50",
      "stock": 5,
      "createdAt": "2025-09-06T10:30:00.000Z",
      "updatedAt": "2025-09-06T10:30:00.000Z"
    },
    {
      "id": 2,
      "nombre": "Mouse Logitech",
      "descripcion": "Mouse inalámbrico",
      "precio": "25.99",
      "stock": 15,
      "createdAt": "2025-09-06T10:35:00.000Z",
      "updatedAt": "2025-09-06T10:35:00.000Z"
    }
  ]
}
```

---

### **Ejemplo 4: POST /api/productos (Crear Producto con BD Real)**

#### **Petición:**
```http
POST http://localhost:3000/api/productos
Content-Type: application/json

{
  "nombre": "Teclado Mecánico",
  "descripcion": "Teclado gaming RGB",
  "precio": 89.99,
  "stock": 10
}
```

#### **Flujo Detallado:**

```
📨 POST /api/productos con JSON body
    ↓
🔧 express.json() - Convierte el JSON en req.body
    ↓
🛣️ productoRoutes.js - router.route('/').post(createProducto)
    ↓
🎮 productoController.js - createProducto()
    ↓ 
🔍 Validación de entrada (nombre, precio, stock requeridos)
    ↓
🗄️ prisma.producto.create() - INSERT a PostgreSQL
    ↓
✅ Validación de BD + restricciones PostgreSQL
    ↓
💾 Almacenamiento en tabla "Producto"
    ↓
📤 Respuesta JSON con status 201
```

#### **En el Controlador:**
```javascript
export const createProducto = asyncHandler(async (req, res) => {
  const { nombre, descripcion, precio, stock } = req.body;

  // Validación de entrada
  if (!nombre || !precio || stock === undefined) {
    res.status(400);
    throw new Error('Por favor proporciona nombre, precio y stock');
  }

  // Inserción en PostgreSQL via Prisma
  const producto = await prisma.producto.create({
    data: { nombre, descripcion, precio, stock }
  });

  res.status(201).json({
    success: true,
    data: producto
  });
});
```

#### **Query SQL Generada por Prisma:**
```sql
INSERT INTO "Producto" (nombre, descripcion, precio, stock, "createdAt", "updatedAt") 
VALUES ($1, $2, $3, $4, NOW(), NOW()) 
RETURNING id, nombre, descripcion, precio, stock, "createdAt", "updatedAt";
```

#### **Ventajas de Prisma sobre SQL directo:**
- ✅ **Tipado automático** - Autocompletado en VS Code
- ✅ **Validación de esquema** - Errores en tiempo de compilación
- ✅ **Prevención de SQL Injection** - Queries parametrizadas
- ✅ **Migraciones automáticas** - Control de versiones de BD
- ✅ **Generación de clientes** - API consistente

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

### **Tipos de Errores Manejados (PostgreSQL):**

1. **Errores de Conexión (503):**
```javascript
// Error: Base de datos no disponible
{
  "success": false,
  "error": "Error de conexión a la base de datos"
}
```

2. **Errores de Restricción Única - PostgreSQL 23505 (400):**
```javascript
// Error: Email duplicado
{
  "success": false,
  "error": "El email ya existe. Debe ser único.",
  "code": "23505",  // Solo en desarrollo
  "detail": "Key (email)=(test@email.com) already exists."
}
```

3. **Errores de Campo Obligatorio - PostgreSQL 23502 (400):**
```javascript
// Error: Campo NOT NULL
{
  "success": false,
  "error": "El campo 'name' es obligatorio"
}
```

4. **Errores de Clave Foránea - PostgreSQL 23503 (400):**
```javascript
// Error: Referencia inexistente
{
  "success": false,
  "error": "Referencia a un recurso que no existe"
}
```

5. **Errores de Validación - PostgreSQL 23514 (400):**
```javascript
// Error: Restricción check
{
  "success": false,
  "error": "Los datos no cumplen con las restricciones de validación"
}
```

6. **Errores de ID Inválido (400):**
```javascript
// Error: UUID/Integer malformado
{
  "success": false,
  "error": "ID proporcionado no es válido"
}
```

7. **Errores de Tipo de Dato - PostgreSQL 22P02 (400):**
```javascript
// Error: Formato incorrecto
{
  "success": false,
  "error": "Formato de datos inválido"
}
```

8. **Errores de Recurso No Encontrado (404):**
```javascript
// Error: Usuario con ID inexistente
{
  "success": false,
  "error": "Usuario no encontrado"
}
```

9. **Errores de Ruta No Encontrada (404):**
```javascript
// Error: Endpoint inexistente
{
  "success": false,
  "error": "Ruta no encontrada - /api/productos"
}
```

10. **Errores Internos del Servidor (500):**
```javascript
// Error: SQL syntax o tabla inexistente
{
  "success": false,
  "error": "Error interno del servidor - Consulta SQL inválida"
}
```

### **Códigos de Error PostgreSQL Principales:**

| Código         | Descripción                     | Status HTTP | Ejemplo                   |
|----------------|---------------------------------|-------------|---------------------------|
| `23505`        | Violación restricción única     | 400         | Email duplicado           |
| `23502`        | Violación NOT NULL              | 400         | Campo obligatorio         |
| `23503`        | Violación clave foránea         | 400         | ID referenciado no existe |
| `23514`        | Violación restricción check     | 400         | Edad negativa             |
| `42601`        | Error sintaxis SQL              | 500         | Query malformado          |
| `42P01`        | Tabla no existe                 | 500         | Esquema incorrecto        |
| `42703`        | Columna no existe               | 500         | Campo inexistente         |
| `22P02`        | Tipo de dato inválido           | 400         | String en campo numérico  |
| `ECONNREFUSED` | Conexión rechazada              | 503         | BD no disponible          |
| `P2025`        | Registro no encontrado (Prisma) | 404         | Usuario inexistente       |

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

### **Modelo User (Simulado en Memoria):**

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

### **Modelo Producto (PostgreSQL + Prisma):**

```javascript
// Estructura de un producto
{
  id: 1,                                    // Autoincremental (PostgreSQL)
  nombre: "Notebook Lenovo",                // String, requerido
  descripcion: "Laptop para oficina",      // String, opcional
  precio: "1200.50",                        // Decimal(10,2), requerido
  stock: 5,                                 // Integer, default 0
  createdAt: "2025-09-06T10:30:00.000Z",   // DateTime, auto-generado
  updatedAt: "2025-09-06T10:30:00.000Z"    // DateTime, auto-actualizado
}
```

### **Esquema Prisma:**

```prisma
// prisma/schema.prisma
model Producto {
  id          Int      @id @default(autoincrement())
  nombre      String
  descripcion String?
  precio      Decimal  @db.Decimal(10,2)
  stock       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("Producto")
}
```

### **Tabla PostgreSQL Generada:**

```sql
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);
```

**✅ Ventajas:** Persistencia real, validaciones de BD, respaldos automáticos.

---

## 🛣️ Endpoints Disponibles

### **🏥 Estado del Servidor**
| Método | Endpoint | Descripción | Respuesta |
|--------|----------|-------------|-----------|
| `GET` | `/health` | Estado del servidor | `{status: "OK", timestamp, uptime}` |

### **👥 Usuarios (Simulados en Memoria)**
| Método | Endpoint | Descripción | Body Requerido |
|--------|----------|-------------|----------------|
| `GET` | `/api/users` | Listar todos los usuarios | - |
| `GET` | `/api/users/:id` | Obtener usuario específico | - |
| `POST` | `/api/users` | Crear nuevo usuario | `{name, email, age}` |
| `PUT` | `/api/users/:id` | Actualizar usuario | `{name?, email?, age?}` |
| `DELETE` | `/api/users/:id` | Eliminar usuario | - |

### **📦 Productos (PostgreSQL + Prisma)**
| Método | Endpoint | Descripción | Body Requerido |
|--------|----------|-------------|----------------|
| `GET` | `/api/productos` | Listar todos los productos | - |
| `GET` | `/api/productos/:id` | Obtener producto específico | - |
| `POST` | `/api/productos` | Crear nuevo producto | `{nombre, descripcion?, precio, stock}` |
| `PUT` | `/api/productos/:id` | Actualizar producto | `{nombre?, descripcion?, precio?, stock?}` |
| `DELETE` | `/api/productos/:id` | Eliminar producto | - |

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
# Configuración del servidor
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:3000/api

# Base de datos PostgreSQL (requerido para productos)
DATABASE_URL="postgresql://username:password@localhost:5432/rest_api_db"

# Opcional: Configuración de Prisma
PRISMA_CLI_QUERY_ENGINE_TYPE=binary
```

### **Scripts de NPM:**
```json
{
  "scripts": {
    "start": "node server.js",     // Producción
    "dev": "nodemon server.js",    // Desarrollo con auto-reload
    "lint": "eslint . --ext .js,.mjs",        // Verificar errores
    "lint:fix": "eslint . --ext .js,.mjs --fix" // Arreglar errores
  }
}
```

### **Scripts de Prisma:**
```bash
# Generar cliente Prisma (después de cambios en schema)
npx prisma generate

# Aplicar migraciones a la base de datos
npx prisma migrate dev --name descripcion_cambio

# Ver estado de migraciones
npx prisma migrate status

# Resetear base de datos (⚠️ elimina datos)
npx prisma migrate reset

# Abrir Prisma Studio (interfaz visual)
npx prisma studio
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

### ========== USUARIOS (Memoria) ==========

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

### ========== PRODUCTOS (PostgreSQL) ==========

### Obtener todos los productos
GET http://localhost:3000/api/productos

### Crear nuevo producto
POST http://localhost:3000/api/productos
Content-Type: application/json

{
  "nombre": "Notebook Lenovo ThinkPad",
  "descripcion": "Laptop profesional para desarrollo",
  "precio": 1299.99,
  "stock": 8
}

### Obtener producto específico
GET http://localhost:3000/api/productos/1

### Actualizar producto
PUT http://localhost:3000/api/productos/1
Content-Type: application/json

{
  "precio": 1199.99,
  "stock": 10
}

### Eliminar producto
DELETE http://localhost:3000/api/productos/1
```

---

## 🚀 Comandos de Inicialización

### **Setup inicial del proyecto:**

```bash
# 1. Crear directorio e inicializar
mkdir my-express-api && cd my-express-api
npm init -y

# 2. Instalar dependencias principales
npm install express cors helmet morgan dotenv @prisma/client
npm install --save-dev nodemon prisma eslint

# 3. Crear estructura de carpetas
mkdir -p src/{controllers,models,routes,middleware,config}

# 4. Crear archivos principales
touch server.js src/app.js prisma.js .env .gitignore
touch src/controllers/userController.js
touch src/controllers/productoController.js
touch src/models/User.js
touch src/routes/userRoutes.js
touch src/routes/productoRoutes.js
touch src/middleware/errorMiddleware.js

# 5. Inicializar Prisma
npx prisma init

# 6. Configurar DATABASE_URL en .env
echo 'DATABASE_URL="postgresql://username:password@localhost:5432/rest_api_db"' >> .env

# 7. Ejecutar en desarrollo
npm run dev
```

### **🗄️ Setup de PostgreSQL + Prisma:**

```bash
# 1. Instalar PostgreSQL en tu sistema
# macOS: brew install postgresql
# Ubuntu: sudo apt install postgresql
# Windows: Descargar desde postgresql.org

# 2. Crear base de datos
createdb rest_api_db

# 3. Configurar schema.prisma
cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Producto {
  id          Int      @id @default(autoincrement())
  nombre      String
  descripcion String?
  precio      Decimal  @db.Decimal(10,2)
  stock       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
EOF

# 4. Generar migración inicial
npx prisma migrate dev --name init

# 5. Generar cliente Prisma
npx prisma generate

# 6. (Opcional) Abrir Prisma Studio
npx prisma studio
```

### **🔧 Configuración adicional:**

```bash
# Configurar ESLint
npx eslint --init

# Agregar .gitignore
cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
dist/
build/
*.log
.DS_Store
EOF

# Verificar que todo funciona
npm run dev
```

---

## 🔄 Próximos Pasos para Expandir

### **1. Base de Datos Real:**
- **PostgreSQL + Prisma:** Para SQL (✅ **Manejo de errores ya implementado**)
- **MongoDB + Mongoose:** Para NoSQL  
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

### **6. Prisma ORM:**
- **Type-safe queries:** Consultas con tipado automático
- **Schema-first approach:** El esquema define la estructura
- **Auto-generated client:** Cliente generado automáticamente
- **Migration system:** Control de versiones de base de datos

### **7. PostgreSQL Integration:**
- **Persistent storage:** Datos que persisten entre reinicios
- **ACID transactions:** Consistencia y atomicidad de datos
- **Advanced data types:** Decimal, DateTime, etc.
- **Constraint validation:** Validación a nivel de base de datos

### **8. Dual Storage Pattern:**
- **In-memory (Users):** Rápido para prototipos y demos
- **Database (Products):** Robusto para datos de producción
- **Flexibility:** Permite migración gradual entre sistemas

---

## 🎯 Conclusión

Esta REST API template proporciona una base sólida y escalable para construir APIs modernas con Node.js, Express, PostgreSQL y Prisma ORM. La arquitectura modular permite:

- **Fácil mantenimiento:** Código organizado por responsabilidades
- **Escalabilidad:** Estructura que soporta crecimiento
- **Reutilización:** Template aplicable a diferentes proyectos
- **Mejores prácticas:** Implementa patrones estándar de la industria
- **Base de datos robusta:** PostgreSQL con Prisma para datos críticos
- **Flexibilidad:** Dual storage pattern para diferentes necesidades
- **Tipado automático:** Prisma genera tipos para mejor desarrollo
- **Manejo de errores avanzado:** Específico para PostgreSQL

### **🚀 Lo que has logrado:**

- ✅ **API REST completa** con dos recursos (usuarios y productos)
- ✅ **Integración PostgreSQL** con Prisma ORM
- ✅ **Manejo de errores específico** para PostgreSQL
- ✅ **ESLint configurado** para mejor calidad de código
- ✅ **Documentación completa** paso a paso
- ✅ **Testing setup** con archivo api.http
- ✅ **Arquitectura escalable** lista para producción

**¡Ahora tienes una API completamente funcional, bien documentada y lista para usar como base en tus futuros proyectos profesionales!** 🚀

---

*Documentación actualizada el 6 de septiembre de 2025*  
*Template de REST API con Node.js, Express, PostgreSQL y Prisma ORM*
