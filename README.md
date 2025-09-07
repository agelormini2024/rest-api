# 🚀 REST API con Node.js, Express, PostgreSQL y Prisma

Plantilla de API RESTful construida con Node.js, Express, PostgreSQL y Prisma ORM. Incluye arquitectura modular, manejo centralizado de errores específicos de PostgreSQL, validación de datos y dos recursos completos: usuarios (simulados) y productos (base de datos real).

---

## 📦 Instalación

```bash
git clone <URL-del-repo>
cd rest-api
npm install

# Configurar base de datos PostgreSQL
npx prisma generate
npx prisma migrate dev
```

---

## 🏁 Uso

### Desarrollo (con recarga automática):

```bash
npm run dev
```

### Producción:

```bash
npm start
```

El servidor se ejecutará por defecto en [http://localhost:3000](http://localhost:3000).

---

## 🗂️ Estructura del Proyecto

```
rest-api/
├── server.js                    # Punto de entrada principal
├── prisma.js                    # Configuración cliente Prisma
├── src/
│   ├── app.js                   # Configuración central de Express
│   ├── controllers/
│   │   ├── userController.js    # Lógica de negocio de usuarios (simulado)
│   │   └── productoController.js # Lógica de negocio de productos (PostgreSQL)
│   ├── models/
│   │   └── User.js              # Modelo simulado de usuario
│   ├── routes/
│   │   ├── userRoutes.js        # Endpoints de usuario
│   │   └── productoRoutes.js    # Endpoints de productos
│   └── middleware/
│       └── errorMiddleware.js   # Manejo de errores PostgreSQL
├── prisma/
│   ├── schema.prisma            # Esquema de base de datos
│   └── migrations/              # Migraciones de BD
├── api.http                     # Pruebas rápidas de endpoints
├── package.json
└── .gitignore
```

---

## 🛣️ Endpoints Disponibles

### **🏥 Estado del Servidor**
| Método | Endpoint | Descripción | Respuesta |
|--------|----------|-------------|-----------|
| GET | `/health` | Estado del servidor | `{status: "OK", timestamp, uptime}` |

### **👥 Usuarios (Simulados en Memoria)**
| Método | Endpoint | Descripción | Body Requerido |
|--------|----------|-------------|----------------|
| GET | `/api/users` | Listar todos los usuarios | - |
| GET | `/api/users/:id` | Obtener usuario por ID | - |
| POST | `/api/users` | Crear nuevo usuario | `{name, email, age}` |
| PUT | `/api/users/:id` | Actualizar usuario | `{name?, email?, age?}` |
| DELETE | `/api/users/:id` | Eliminar usuario | - |

### **📦 Productos (PostgreSQL + Prisma)**
| Método | Endpoint | Descripción | Body Requerido |
|--------|----------|-------------|----------------|
| GET | `/api/productos` | Listar todos los productos | - |
| GET | `/api/productos/:id` | Obtener producto por ID | - |
| POST | `/api/productos` | Crear nuevo producto | `{nombre, descripcion, precio, stock}` |
| PUT | `/api/productos/:id` | Actualizar producto | `{nombre?, descripcion?, precio?, stock?}` |
| DELETE | `/api/productos/:id` | Eliminar producto | - |

---

## ⚠️ Manejo de Errores

La API incluye manejo específico para errores de PostgreSQL:

### Códigos de Error Principales:

| Código PostgreSQL | Error                     | Status HTTP | Ejemplo                     |
|-------------------|---------------------------|-------------|-----------------------------|
| `23505`           | Restricción única violada | 400         | Email duplicado             |
| `23502`           | Campo NOT NULL            | 400         | Campo obligatorio faltante  |
| `23503`           | Clave foránea inválida    | 400         | Referencia inexistente      |
| `22P02`           | Tipo de dato inválido     | 400         | Formato incorrecto          |
| `ECONNREFUSED`    | Conexión BD fallida       | 503         | Base de datos no disponible |

### Ejemplo de Respuesta de Error:

```json
{
  "success": false,
  "error": "El email ya existe. Debe ser único.",
  "code": "23505",
  "detail": "Key (email)=(test@email.com) already exists."
}
```

---

## 📋 Modelos de Datos

### **👤 Usuario (Simulado en Memoria)**

```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "age": 25,
  "createdAt": "2025-09-02T10:30:00.000Z"
}
```

### **📦 Producto (PostgreSQL + Prisma)**

```json
{
  "id": 1,
  "nombre": "Notebook Lenovo",
  "descripcion": "Laptop para oficina y programación",
  "precio": 1200.50,
  "stock": 5,
  "createdAt": "2025-09-06T10:30:00.000Z",
  "updatedAt": "2025-09-06T10:30:00.000Z"
}
```

### **📊 Esquema Prisma**

```prisma
model Producto {
  id          Int      @id @default(autoincrement())
  nombre      String
  descripcion String?
  precio      Decimal  @db.Decimal(10,2)
  stock       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 🧪 Pruebas Rápidas

Puedes usar el archivo [`api.http`](api.http) para probar los endpoints directamente desde VS Code con la extensión "REST Client".

---

## ⚙️ Variables de Entorno

Crea un archivo `.env` en la raíz con las siguientes variables:

```env
# Configuración del servidor
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000

# Base de datos PostgreSQL (requerido para productos)
DATABASE_URL="postgresql://username:password@localhost:5432/rest_api_db"

# Opcional: Configuración de Prisma
PRISMA_CLI_QUERY_ENGINE_TYPE=binary
```

### **📋 Configuración de PostgreSQL:**

1. **Instalar PostgreSQL** en tu sistema
2. **Crear base de datos:**
   ```sql
   CREATE DATABASE rest_api_db;
   ```
3. **Configurar DATABASE_URL** en `.env`
4. **Ejecutar migraciones:**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

---

## 🛡️ Características

- **ES6 Modules** (`import/export`)
- **Base de datos PostgreSQL** con Prisma ORM
  - Migraciones automáticas
  - Cliente tipado con autocompletado
  - Validación a nivel de esquema
- **Manejo centralizado de errores PostgreSQL**
  - Códigos específicos de PostgreSQL (23505, 23502, 23503, etc.)
  - Mensajes de error descriptivos y específicos
  - Diferentes status HTTP según el tipo de error
  - Información de debug en desarrollo
- **Dual storage system:**
  - Usuarios: Simulados en memoria (para demostración)
  - Productos: PostgreSQL real (para producción)
- **ESLint configurado** para detección de errores
- **Helmet, CORS y Morgan integrados**
- **Estructura escalable y modular**

---

## �️ Comandos de Base de Datos

### **Prisma Commands:**

```bash
# Generar cliente Prisma (después de cambios en schema)
npx prisma generate

# Aplicar migraciones a la base de datos
npx prisma migrate dev --name descripcion_del_cambio

# Ver estado de migraciones
npx prisma migrate status

# Resetear base de datos (⚠️ elimina todos los datos)
npx prisma migrate reset

# Abrir Prisma Studio (interfaz visual)
npx prisma studio

# Sembrar datos de prueba (si tienes seed configurado)
npx prisma db seed
```

### **Desarrollo típico:**

```bash
# 1. Modificar schema.prisma
# 2. Generar migración
npx prisma migrate dev --name agregar_tabla_productos

# 3. Generar cliente actualizado
npx prisma generate

# 4. Usar en código
import { prisma } from './prisma.js';
const productos = await prisma.producto.findMany();
```

---

## �📚 Más Información

Consulta [`FLUJO_API_EXPLICACION.md`](FLUJO_API_EXPLICACION.md) para una explicación detallada del flujo y arquitectura de la API.

---

## 📝 Licencia

ISC © [Alejandro Gelormini](https://github.com/agelormini2024)
