# 📚 Documentación: Modelo User.js - Simulación de Base de Datos en Memoria

## 🎯 Introducción

El archivo `User.js` implementa un **modelo de datos simulado** que funciona como una base de datos en memoria para usuarios. Es una excelente forma de entender los conceptos CRUD y validación de datos antes de migrar a una base de datos real.

---

## 🏗️ Arquitectura del Modelo

### **📊 Estructura General:**

```javascript
// 1. Datos simulados (Array como "tabla")
const users = [...];

// 2. Contador para IDs únicos
let nextId = 4;

// 3. Clase User con:
export class User {
  // Constructor
  // Métodos de instancia (validación)
  // Métodos estáticos (CRUD)
}
```

### **🎨 Patrón de Diseño Implementado:**

- **Active Record Pattern:** Los métodos CRUD están en la misma clase del modelo
- **Singleton Data Store:** Un solo array compartido para todos los usuarios
- **Factory Pattern:** El constructor crea instancias válidas de usuarios

---

## 📋 Análisis Línea por Línea

### **1. Base de Datos Simulada (Líneas 2-6)**

```javascript
const users = [
    { id: 1, name: 'Juan Pérez', email: 'juan@email.com', age: 25 },
    { id: 2, name: 'María García', email: 'maria@email.com', age: 30 },
    { id: 3, name: 'Carlos López', email: 'carlos@email.com', age: 28 }
];
```

**📝 Explicación:**
- **`const users`**: Array que simula una tabla de base de datos
- **Datos iniciales**: 3 usuarios predefinidos para testing
- **Estructura de usuario**: `{id, name, email, age}`
- **Persistencia**: Los datos se mantienen mientras el servidor esté activo

---

### **2. Contador de IDs (Línea 8)**

```javascript
let nextId = 4;
```

**📝 Explicación:**
- **Propósito**: Simula un campo `AUTO_INCREMENT` de base de datos
- **Valor inicial**: 4 (porque ya tenemos usuarios con ID 1, 2, 3)
- **Modificable**: `let` permite incrementar el valor
- **Thread-safety**: ⚠️ No es thread-safe (problema en apps concurrentes)

---

### **3. Constructor de la Clase (Líneas 11-18)**

```javascript
constructor(data) {
    this.id = data.id || nextId++;
    this.name = data.name;
    this.email = data.email;
    this.age = data.age;
    this.createdAt = data.createdAt || new Date().toISOString();
}
```

**📝 Explicación línea por línea:**

| Línea | Código | Función |
|-------|--------|---------|
| `data.id \|\| nextId++` | Si no viene ID, asigna el próximo disponible | Auto-incremento |
| `this.name = data.name` | Asigna nombre directamente | Asignación simple |
| `this.email = data.email` | Asigna email directamente | Asignación simple |
| `this.age = data.age` | Asigna edad directamente | Asignación simple |
| `data.createdAt \|\| new Date().toISOString()` | Si no viene fecha, crea timestamp actual | Timestamp automático |

**🎯 Casos de uso:**

```javascript
// Caso 1: Usuario nuevo (sin ID)
new User({ name: 'Ana', email: 'ana@email.com', age: 25 });
// Resultado: { id: 4, name: 'Ana', email: 'ana@email.com', age: 25, createdAt: '2025-09-07T...' }

// Caso 2: Usuario existente (con ID)
new User({ id: 1, name: 'Juan Actualizado', email: 'juan@email.com', age: 26 });
// Resultado: { id: 1, name: 'Juan Actualizado', email: 'juan@email.com', age: 26, createdAt: '...' }
```

---

### **4. Método de Validación (Líneas 21-42)**

```javascript
validate() {
    const errors = [];

    if (!this.name || this.name.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }

    if (!this.email || !this.isValidEmail(this.email)) {
        errors.push('Email inválido');
    }

    if (!this.age || this.age < 0 || this.age > 120) {
        errors.push('La edad debe estar entre 0 y 120 años');
    }

    return errors;
}
```

**📝 Análisis de validaciones:**

#### **Validación de Nombre:**
```javascript
if (!this.name || this.name.trim().length < 2)
```

**Casos que fallan:**
- `null`, `undefined`, `""` (valores falsy)
- `"  "` (solo espacios)
- `"A"` (menos de 2 caracteres)

**Casos válidos:**
- `"Juan"`, `"María José"`, `"李小明"`

#### **Validación de Email:**
```javascript
if (!this.email || !this.isValidEmail(this.email))
```

**Delegación**: Usa método auxiliar `isValidEmail()`
**Casos que fallan:**
- `null`, `undefined`, `""`
- `"invalido"`, `"@gmail.com"`, `"juan@"`

#### **Validación de Edad:**
```javascript
if (!this.age || this.age < 0 || this.age > 120)
```

**Casos que fallan:**
- `null`, `undefined`, `0` (valores falsy)
- `-5` (edad negativa)
- `150` (edad irreal)

**📊 Patrón de Respuesta:**
```javascript
// Éxito (sin errores)
user.validate(); // []

// Errores múltiples
user.validate(); // ['El nombre debe tener...', 'Email inválido', ...]
```

---

### **5. Validador de Email (Líneas 44-47)**

```javascript
isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
```

**📝 Explicación del Regex:**

| Parte | Significado | Ejemplo |
|-------|-------------|---------|
| `^` | Inicio de cadena | - |
| `[^\s@]+` | Uno o más caracteres que NO sean espacio ni @ | `juan`, `user123` |
| `@` | Carácter @ literal | `@` |
| `[^\s@]+` | Uno o más caracteres que NO sean espacio ni @ | `gmail`, `empresa` |
| `\.` | Punto literal (escapado) | `.` |
| `[^\s@]+` | Uno o más caracteres que NO sean espacio ni @ | `com`, `org` |
| `$` | Final de cadena | - |

**✅ Emails válidos:**
- `juan@gmail.com`
- `user.name@empresa.org`
- `test123@subdomain.domain.co`

**❌ Emails inválidos:**
- `juan@` (falta dominio)
- `@gmail.com` (falta usuario)
- `juan gmail.com` (falta @)
- `juan@gmail` (falta TLD)

---

### **6. Métodos CRUD Estáticos**

Los métodos estáticos simulan operaciones de base de datos:

#### **6.1 findAll() - Obtener Todos (Línea 50-52)**

```javascript
static findAll() {
    return users;
}
```

**📝 Función:**
- Devuelve el array completo de usuarios
- Equivale a `SELECT * FROM users`
- Simple pero efectivo para el caso de uso

**🔄 Uso:**
```javascript
const allUsers = User.findAll();
console.log(allUsers); // [{ id: 1, name: 'Juan'... }, { id: 2... }]
```

---

#### **6.2 findById() - Buscar por ID (Línea 54-56)**

```javascript
static findById(id) {
    return users.find(user => user.id === parseInt(id));
}
```

**📝 Análisis:**
- **`parseInt(id)`**: Convierte string a número (importante para rutas URL)
- **`find()`**: Devuelve el primer elemento que coincida o `undefined`
- **`===`**: Comparación estricta de tipo y valor

**🔄 Casos de uso:**
```javascript
User.findById(1);    // { id: 1, name: 'Juan Pérez'... }
User.findById("2");  // { id: 2, name: 'María García'... } (convierte string)
User.findById(999);  // undefined (no existe)
User.findById("abc"); // undefined (parseInt("abc") = NaN)
```

---

#### **6.3 create() - Crear Usuario (Líneas 58-72)**

```javascript
static create(userData) {
    const user = new User(userData);
    const errors = user.validate();

    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }

    // Verificar email único
    if (users.some(u => u.email === user.email)) {
        throw new Error('El email ya está registrado');
    }

    users.push(user);
    return user;
}
```

**📝 Flujo paso a paso:**

```
📥 Datos de entrada → 🏗️ Constructor → ✅ Validación → 🔍 Email único → 💾 Guardar
```

**1. Creación de instancia:**
```javascript
const user = new User(userData);
// Crea objeto con ID auto-asignado y timestamp
```

**2. Validación de datos:**
```javascript
const errors = user.validate();
if (errors.length > 0) {
    throw new Error(errors.join(', '));
}
// Si hay errores, lanza excepción con todos los mensajes unidos
```

**3. Verificación de unicidad:**
```javascript
if (users.some(u => u.email === user.email)) {
    throw new Error('El email ya está registrado');
}
// Simula UNIQUE constraint de base de datos
```

**4. Persistencia:**
```javascript
users.push(user);
return user;
// Añade al array y devuelve el usuario creado
```

**🎯 Ejemplo práctico:**
```javascript
// ✅ Caso exitoso
const newUser = User.create({
    name: 'Ana López',
    email: 'ana@nueva.com',
    age: 28
});
console.log(newUser);
// { id: 4, name: 'Ana López', email: 'ana@nueva.com', age: 28, createdAt: '...' }

// ❌ Caso con error de validación
try {
    User.create({ name: 'A', email: 'invalid', age: -5 });
} catch (error) {
    console.log(error.message);
    // "El nombre debe tener al menos 2 caracteres, Email inválido, La edad debe estar entre 0 y 120 años"
}

// ❌ Caso con email duplicado
try {
    User.create({ name: 'Otro Juan', email: 'juan@email.com', age: 30 });
} catch (error) {
    console.log(error.message);
    // "El email ya está registrado"
}
```

---

#### **6.4 update() - Actualizar Usuario (Líneas 74-87)**

```javascript
static update(id, userData) {
    const index = users.findIndex(user => user.id === parseInt(id));
    if (index === -1) {return null;}

    const updatedUser = new User({ ...users[index], ...userData, id: parseInt(id) });
    const errors = updatedUser.validate();

    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }

    users[index] = updatedUser;
    return updatedUser;
}
```

**📝 Flujo de actualización:**

```
🔍 Buscar por ID → 📝 Merge datos → ✅ Validar → 💾 Reemplazar → 📤 Devolver
```

**1. Búsqueda del índice:**
```javascript
const index = users.findIndex(user => user.id === parseInt(id));
if (index === -1) {return null;}
// findIndex devuelve -1 si no encuentra el elemento
```

**2. Merge de datos (Spread Operator):**
```javascript
const updatedUser = new User({ ...users[index], ...userData, id: parseInt(id) });
```

**🎨 Explicación del Spread:**
```javascript
// Usuario original
{ id: 1, name: 'Juan', email: 'juan@email.com', age: 25 }

// Datos nuevos
{ name: 'Juan Carlos', age: 26 }

// Resultado del merge
{ id: 1, name: 'Juan Carlos', email: 'juan@email.com', age: 26 }
//         ↑ actualizado        ↑ sin cambios       ↑ actualizado
```

**3. Validación y reemplazo:**
```javascript
const errors = updatedUser.validate();
// Valida el usuario con los datos mezclados

users[index] = updatedUser;
// Reemplaza el usuario en el array
```

**🎯 Casos de uso:**
```javascript
// ✅ Actualización parcial
const updated = User.update(1, { age: 26 });
console.log(updated);
// { id: 1, name: 'Juan Pérez', email: 'juan@email.com', age: 26, createdAt: '...' }

// ✅ Actualización múltiple
User.update(1, { name: 'Juan Carlos', age: 27 });

// ❌ Usuario inexistente
const result = User.update(999, { name: 'No existe' });
console.log(result); // null

// ❌ Datos inválidos
try {
    User.update(1, { age: -10 });
} catch (error) {
    console.log(error.message); // "La edad debe estar entre 0 y 120 años"
}
```

---

#### **6.5 delete() - Eliminar Usuario (Líneas 89-94)**

```javascript
static delete(id) {
    const index = users.findIndex(user => user.id === parseInt(id));
    if (index === -1) {return null;}

    return users.splice(index, 1)[0];
}
```

**📝 Análisis del método:**

**1. Búsqueda del índice:**
```javascript
const index = users.findIndex(user => user.id === parseInt(id));
// Busca la posición del usuario en el array
```

**2. Validación de existencia:**
```javascript
if (index === -1) {return null;}
// Si no existe, devuelve null en lugar de error
```

**3. Eliminación y retorno:**
```javascript
return users.splice(index, 1)[0];
```

**🔬 Explicación de `splice()`:**
- **`splice(index, 1)`**: Elimina 1 elemento en la posición `index`
- **Retorna**: Array con los elementos eliminados `[usuario]`
- **`[0]`**: Obtiene el primer (y único) elemento eliminado

**🎯 Ejemplos:**
```javascript
// ✅ Eliminación exitosa
const deleted = User.delete(1);
console.log(deleted);
// { id: 1, name: 'Juan Pérez', email: 'juan@email.com', age: 25, createdAt: '...' }

console.log(User.findAll().length); // 2 (era 3, ahora 2)

// ❌ Usuario inexistente
const notFound = User.delete(999);
console.log(notFound); // null
```

---

## 🧪 Casos de Uso Prácticos

### **Escenario 1: Operaciones CRUD Completas**

```javascript
// 1. Listar usuarios iniciales
console.log('Usuarios iniciales:', User.findAll().length); // 3

// 2. Crear nuevo usuario
const newUser = User.create({
    name: 'Ana Martínez',
    email: 'ana@empresa.com',
    age: 29
});
console.log('Usuario creado:', newUser.id); // 4

// 3. Buscar usuario específico
const foundUser = User.findById(4);
console.log('Usuario encontrado:', foundUser.name); // 'Ana Martínez'

// 4. Actualizar usuario
const updatedUser = User.update(4, { age: 30 });
console.log('Nueva edad:', updatedUser.age); // 30

// 5. Eliminar usuario
const deletedUser = User.delete(4);
console.log('Usuario eliminado:', deletedUser.name); // 'Ana Martínez'

// 6. Verificar eliminación
const notFound = User.findById(4);
console.log('Búsqueda post-eliminación:', notFound); // undefined
```

### **Escenario 2: Manejo de Errores**

```javascript
// Validación múltiple
try {
    User.create({
        name: '', // Error: muy corto
        email: 'email-invalido', // Error: formato incorrecto
        age: 150 // Error: fuera de rango
    });
} catch (error) {
    console.log(error.message);
    // "El nombre debe tener al menos 2 caracteres, Email inválido, La edad debe estar entre 0 y 120 años"
}

// Email duplicado
try {
    User.create({
        name: 'Otro Juan',
        email: 'juan@email.com', // Ya existe
        age: 25
    });
} catch (error) {
    console.log(error.message); // "El email ya está registrado"
}

// Actualización con datos inválidos
try {
    User.update(1, { email: 'email-invalido' });
} catch (error) {
    console.log(error.message); // "Email inválido"
}
```

---

## 🔄 Comparación con Base de Datos Real

### **Equivalencias SQL:**

| Método JavaScript | SQL Equivalente | Funcionalidad |
|------------------|-----------------|---------------|
| `User.findAll()` | `SELECT * FROM users` | Obtener todos |
| `User.findById(1)` | `SELECT * FROM users WHERE id = 1` | Buscar por ID |
| `User.create(data)` | `INSERT INTO users (...) VALUES (...)` | Crear registro |
| `User.update(1, data)` | `UPDATE users SET ... WHERE id = 1` | Actualizar |
| `User.delete(1)` | `DELETE FROM users WHERE id = 1` | Eliminar |

### **Ventajas del modelo en memoria:**

✅ **Simplicidad:** No requiere configurar base de datos  
✅ **Rapidez:** Operaciones instantáneas en memoria  
✅ **Testing:** Ideal para pruebas y prototipos  
✅ **Sin dependencias:** No necesita drivers de BD  

### **Limitaciones:**

❌ **Persistencia:** Se pierde al reiniciar el servidor  
❌ **Escalabilidad:** Limitado por memoria RAM  
❌ **Concurrencia:** No es thread-safe  
❌ **Funcionalidades:** Sin transacciones, índices, etc.  

---

## 🚀 Patrones y Mejores Prácticas Implementadas

### **1. Single Responsibility Principle:**
- **Constructor:** Solo crear instancias
- **validate():** Solo validar datos
- **CRUD methods:** Una responsabilidad por método

### **2. Error Handling Consistente:**
```javascript
// Validación: Array de errores → Excepción con mensaje unificado
const errors = user.validate();
if (errors.length > 0) {
    throw new Error(errors.join(', '));
}

// Recursos no encontrados: Devolver null (no excepción)
if (index === -1) {return null;}
```

### **3. Inmutabilidad Parcial:**
```javascript
// No modifica el objeto original, crea uno nuevo
const updatedUser = new User({ ...users[index], ...userData, id: parseInt(id) });
```

### **4. Type Coercion Controlada:**
```javascript
// Conversión explícita para IDs de URL
user.id === parseInt(id)
```

### **5. Validación de Negocio:**
```javascript
// Reglas de negocio centralizadas en el modelo
if (users.some(u => u.email === user.email)) {
    throw new Error('El email ya está registrado');
}
```

---

## 🎓 Conceptos Avanzados Demostrados

### **1. Factory Pattern:**
```javascript
// El constructor actúa como factory
const user = new User(userData); // Crea instancia válida
```

### **2. Active Record Pattern:**
```javascript
// El modelo conoce cómo persistirse
User.create(data); // El modelo maneja su propia persistencia
```

### **3. Data Mapper Simulation:**
```javascript
// Separación entre objeto de dominio y persistencia
const user = new User(data); // Objeto de dominio
users.push(user);           // Capa de persistencia
```

### **4. Repository Pattern (Simplificado):**
```javascript
// Los métodos estáticos actúan como repository
User.findAll();    // Repository.findAll()
User.findById(1);  // Repository.findById(1)
```

---

## 🔧 Posibles Mejoras

### **1. Agregar Timestamps Automáticos:**
```javascript
constructor(data) {
    // ...existing code...
    this.updatedAt = new Date().toISOString();
}

static update(id, userData) {
    // ...existing code...
    updatedUser.updatedAt = new Date().toISOString();
    // ...rest of code...
}
```

### **2. Validación de Email más Robusta:**
```javascript
isValidEmail(email) {
    // RFC 5322 compliant regex (más estricto)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
}
```

### **3. Paginación:**
```javascript
static findAll(page = 1, limit = 10) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return users.slice(startIndex, endIndex);
}
```

### **4. Búsqueda y Filtros:**
```javascript
static findByEmail(email) {
    return users.find(user => user.email === email);
}

static findByAge(minAge, maxAge) {
    return users.filter(user => user.age >= minAge && user.age <= maxAge);
}
```

---

## 🎯 Conclusión

El modelo `User.js` es un excelente ejemplo de cómo implementar:

### **✅ Lo que hace bien:**
- **Simulación realista** de base de datos
- **Validación robusta** de datos
- **Manejo de errores** consistente
- **API intuitiva** para operaciones CRUD
- **Código limpio** y bien estructurado

### **🎓 Conceptos que enseña:**
- Patrones de diseño (Factory, Active Record)
- Validación de datos en el modelo
- Manejo de errores con excepciones
- Operaciones CRUD fundamentales
- Simulación de constraits de BD (UNIQUE)

### **🚀 Camino hacia producción:**
Este modelo es perfecto para:
1. **Aprender** conceptos fundamentales
2. **Prototipar** rápidamente
3. **Testing** sin dependencias externas
4. **Migrar** gradualmente a base de datos real

**¡Es una base sólida para entender cómo funcionan los ORMs y modelos de datos en aplicaciones reales!** 🎉

---

*Documentación creada el 7 de septiembre de 2025*  
*Análisis completo del modelo User.js - Simulación de BD en memoria*
