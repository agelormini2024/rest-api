# 🚀 REST API con Node.js, Express y ES6

Plantilla de API RESTful construida con Node.js, Express y módulos ES6. Incluye arquitectura modular, manejo centralizado de errores, validación de datos y simulación de base de datos en memoria.

---

## 📦 Instalación

```bash
git clone <URL-del-repo>
cd rest-api
npm install
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
├── server.js                  # Punto de entrada principal
├── src/
│   ├── app.js                 # Configuración central de Express
│   ├── controllers/
│   │   └── userController.js  # Lógica de negocio de usuarios
│   ├── models/
│   │   └── User.js            # Modelo y validación de usuario
│   ├── routes/
│   │   └── userRoutes.js      # Endpoints de usuario
│   └── middleware/
│       └── errorMiddleware.js # Manejo de errores
├── api.http                   # Pruebas rápidas de endpoints
├── package.json
└── .gitignore
```

---

## 🛣️ Endpoints Disponibles

| Método | Endpoint           | Descripción                | Body Requerido           |
|--------|--------------------|----------------------------|--------------------------|
| GET    | `/health`          | Estado del servidor        | -                        |
| GET    | `/api/users`       | Listar todos los usuarios  | -                        |
| GET    | `/api/users/:id`   | Obtener usuario por ID     | -                        |
| POST   | `/api/users`       | Crear nuevo usuario        | `{name, email, age}`     |
| PUT    | `/api/users/:id`   | Actualizar usuario         | `{name?, email?, age?}`  |
| DELETE | `/api/users/:id`   | Eliminar usuario           | -                        |

---

## 📋 Ejemplo de Usuario

```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "age": 25,
  "createdAt": "2025-09-02T10:30:00.000Z"
}
```

---

## 🧪 Pruebas Rápidas

Puedes usar el archivo [`api.http`](api.http) para probar los endpoints directamente desde VS Code con la extensión "REST Client".

---

## ⚙️ Variables de Entorno

rea un archivo `.env` en la raíz con las siguientes variables si lo necesitas:

```
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000
```

---

## 🛡️ Características

- **ES6 Modules** (`import/export`)
- **Manejo centralizado de errores**
- **Validación de datos en modelo**
- **Simulación de base de datos en memoria**
- **Helmet, CORS y Morgan integrados**
- **Estructura escalable y modular**

---

## 📚 Más Información

Consulta [`FLUJO_API_EXPLICACION.md`](FLUJO_API_EXPLICACION.md) para una explicación detallada del flujo y arquitectura de la API.

---

## 📝 Licencia

ISC © [Alejandro Gelormini](https://github.com/alejandrogelormini)
