# 🛡️ Guía Completa: Configurar ESLint en Proyectos Node.js

## 🎯 ¿Qué es ESLint y por qué lo necesitas?

**ESLint** es como un "corrector ortográfico" inteligente para tu código JavaScript que:

- ✅ **Detecta errores antes de ejecutar** - Variables no definidas, imports faltantes
- ✅ **Mantiene código consistente** - Mismo estilo en todo el proyecto
- ✅ **Sugiere mejores prácticas** - Uso de const/let, comparaciones estrictas
- ✅ **Previene bugs comunes** - Variables no usadas, funciones mal escritas
- ✅ **Integración con VS Code** - Errores en tiempo real mientras escribes

### 🤔 **Problema sin ESLint:**
```javascript
// ❌ Sin ESLint, esto no da error hasta ejecutar:
const app = expres(); // Typo en 'express' - runtime error
console.log('servidor iniciado');
```

### ✅ **Con ESLint configurado:**
```javascript
// ✅ ESLint detecta el error inmediatamente:
const app = expres(); // 🔴 Error: 'expres' is not defined
//            ^^^^^^ Línea roja en VS Code
```

---

## 📋 Paso 1: Instalar ESLint

### **En un proyecto existente:**

```bash
# Navegar al directorio del proyecto
cd mi-proyecto

# Instalar ESLint como dependencia de desarrollo
npm install --save-dev eslint
```

### **En un proyecto nuevo:**

```bash
# Crear directorio y entrar
mkdir mi-nuevo-proyecto
cd mi-nuevo-proyecto

# Inicializar npm
npm init -y

# Instalar ESLint
npm install --save-dev eslint
```

### **¿Por qué `--save-dev`?**
- ESLint solo se usa durante el **desarrollo**
- No se necesita en **producción**
- Mantiene el bundle final más liviano

---

## 📋 Paso 2: Inicializar Configuración de ESLint

### **Método 1: Configuración Interactiva (Recomendado para principiantes)**

```bash
npx eslint --init
```

Te hará preguntas como:

```
✔ How would you like to use ESLint? 
  › To check syntax and find problems

✔ What type of modules does your project use?
  › JavaScript modules (import/export)

✔ Which framework does your project use?
  › None of these

✔ Does your project use TypeScript?
  › No

✔ Where does your code run?
  › Node

✔ Would you like to install them now?
  › Yes

✔ Which package manager do you want to use?
  › npm
```

### **Método 2: Configuración Manual (Más control)**

Crear archivo `eslint.config.js` manualmente:

```javascript
import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    files: ['**/*.{js,mjs}'],
    languageOptions: { 
      globals: {
        ...globals.node,  // Variables globales de Node.js
        ...globals.es2021 // Características de ES2021
      },
      ecmaVersion: 2021,
      sourceType: 'module' // Para ES6 modules (import/export)
    },
    rules: {
      // Reglas específicas para detectar imports faltantes
      'no-undef': 'error',           // Error si usas variables no definidas
      'no-unused-vars': 'warn',      // Advertencia para variables no usadas
      'no-console': 'off',           // Permitir console.log en Node.js
      
      // Reglas de buenas prácticas
      'prefer-const': 'warn',        // Prefiere const sobre let cuando sea posible
      'no-var': 'error',             // No usar var, solo let/const
      'eqeqeq': 'error',             // Usar === en lugar de ==
      'curly': 'error',              // Siempre usar llaves en if/for/while
      
      // Reglas de formato
      'indent': ['error', 2],        // Indentación de 2 espacios
      'quotes': ['error', 'single'], // Usar comillas simples
      'semi': ['error', 'always'],   // Siempre usar punto y coma
    }
  },
  pluginJs.configs.recommended,
];
```

---

## 📋 Paso 3: Instalar Extensión en VS Code

### **1. Abrir VS Code Extensions (Ctrl+Shift+X)**

### **2. Buscar "ESLint" por Dirk Baeumer**

### **3. Instalar la extensión**

### **4. Reiniciar VS Code** (importante para cargar la configuración)

---

## 📋 Paso 4: Configurar VS Code para ESLint

### **Crear archivo `.vscode/settings.json` en tu proyecto:**

```json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact"
  ],
  "eslint.format.enable": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.formatOnSave": true,
  "eslint.workingDirectories": [
    "."
  ],
  "[javascript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  }
}
```

### **¿Qué hace cada configuración?**

| Configuración               | Función                                |
|-----------------------------|----------------------------------------|
| `eslint.validate`           | En qué tipos de archivo activar ESLint |
| `eslint.format.enable`      | Permite que ESLint formatee código.    |
| `editor.codeActionsOnSave`  | Auto-arregla errores al guardar        |
| `editor.formatOnSave`       | Formatea código automáticamente        |
| `eslint.workingDirectories` | Dónde buscar configuración de ESLint   |

---

## 📋 Paso 5: Agregar Scripts al package.json

### **Abrir `package.json` y agregar scripts:**

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "lint": "eslint . --ext .js,.mjs",
    "lint:fix": "eslint . --ext .js,.mjs --fix",
    "lint:watch": "nodemon --exec \"npm run lint\" --watch ./ --ext js"
  }
}
```

### **Explicación de cada script:**

| Script               | Comando                         | Función                          |
|----------------------|---------------------------------|----------------------------------|
| `npm run lint`       | `eslint . --ext .js,.mjs`       | Verificar errores sin arreglar   |
| `npm run lint:fix`   | `eslint . --ext .js,.mjs --fix` | Arreglar errores automáticamente |
| `npm run lint:watch` | `nodemon --exec...`             | Verificar errores en tiempo real |

---

## 📋 Paso 6: Probar la Configuración

### **1. Crear archivo de prueba:**

```javascript
// test-eslint.js
// ❌ Este código tiene errores intencionalmente:

const app = express(); // Error: 'express' is not defined
console.log('Hola mundo');

const variableNoUsada = 'test'; // Warning: variable no usada
var miVariable = 'mal'; // Error: usar const/let en lugar de var

if (miVariable == 'mal') { // Error: usar === en lugar de ==
  console.log('Esto está mal');
}

export default app;
```

### **2. Ejecutar ESLint:**

```bash
npm run lint
```

### **3. Resultado esperado:**

```bash
/test-eslint.js
  4:13  error    'express' is not defined                      no-undef
  7:7   warning  'variableNoUsada' is assigned but never used  no-unused-vars
  8:1   error    Unexpected var, use let or const instead      no-var
  10:20 error    Expected '===' and instead saw '=='           eqeqeq

✖ 4 problems (3 errors, 1 warning)
  2 errors and 0 warnings potentially fixable with --fix
```

### **4. Arreglar errores automáticamente:**

```bash
npm run lint:fix
```

### **5. Resultado después del fix:**

```javascript
// test-eslint.js - Código arreglado automáticamente:

const app = express(); // ❌ Este error hay que arreglarlo manualmente
console.log('Hola mundo');

// ✅ Variable eliminada automáticamente por no usarse
const miVariable = 'mal'; // ✅ var cambiado a const

if (miVariable === 'mal') { // ✅ == cambiado a ===
  console.log('Esto está mal');
}

export default app;
```

---

## 🎯 Reglas Importantes de ESLint

### **Reglas para Detectar Imports Faltantes:**

| Regla | Nivel | Función |
|-------|-------|---------|
| `no-undef` | error | Detecta variables no definidas (¡imports faltantes!) |
| `no-unused-vars` | warn | Variables declaradas pero no usadas |
| `import/no-unresolved` | error | Imports que no se pueden resolver |

### **Reglas de Buenas Prácticas:**

| Regla | Nivel | Función | Ejemplo |
|-------|-------|---------|---------|
| `prefer-const` | warn | Prefiere const sobre let | `let x = 5` → `const x = 5` |
| `no-var` | error | No usar var | `var x = 5` → `const x = 5` |
| `eqeqeq` | error | Usar === en lugar de == | `x == 5` → `x === 5` |
| `curly` | error | Siempre usar llaves | `if (x) return` → `if (x) { return; }` |

### **Reglas de Formato:**

| Regla | Configuración | Función |
|-------|---------------|---------|
| `indent` | `['error', 2]` | Indentación de 2 espacios |
| `quotes` | `['error', 'single']` | Usar comillas simples |
| `semi` | `['error', 'always']` | Siempre usar punto y coma |

---

## 🔧 Configuraciones Avanzadas

### **Para proyectos con React:**

```javascript
import pluginReact from 'eslint-plugin-react';

export default [
  // ...configuración base
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react: pluginReact,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      'react/prop-types': 'off', // Desactivar PropTypes si usas TypeScript
    },
  },
];
```

### **Para proyectos con TypeScript:**

```bash
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

```javascript
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
    },
  },
];
```

### **Ignorar archivos específicos:**

Crear archivo `.eslintignore`:

```gitignore
node_modules/
dist/
build/
*.min.js
coverage/
.env
```

---

## 🚨 Solución de Problemas Comunes

### **Problema 1: "ESLint couldn't determine the plugin"**

**Causa:** Configuración incorrecta o dependencias faltantes

**Solución:**
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Verificar que eslint.config.js esté en la raíz del proyecto
ls -la eslint.config.js
```

### **Problema 2: "No se muestran errores en VS Code"**

**Causa:** Extensión no activada o configuración incorrecta

**Solución:**
1. Verificar que la extensión ESLint esté instalada
2. Reiniciar VS Code
3. Abrir Command Palette (Ctrl+Shift+P) → "ESLint: Restart ESLint Server"
4. Verificar archivo `.vscode/settings.json`

### **Problema 3: "Demasiados errores, ES lint very annoying"**

**Causa:** Reglas muy estrictas para proyectos legacy

**Solución:**
```javascript
// eslint.config.js - Configuración más permisiva
export default [
  {
    rules: {
      'no-undef': 'error',        // Solo mantener lo esencial
      'no-unused-vars': 'warn',   // Cambiar a warning
      'no-console': 'off',        // Permitir console.log
      // Comentar reglas estrictas temporalmente:
      // 'quotes': 'off',
      // 'semi': 'off',
      // 'indent': 'off',
    }
  }
];
```

### **Problema 4: "ESLint no detecta imports faltantes"**

**Causa:** Regla `no-undef` desactivada o configuración incorrecta

**Solución:**
```javascript
// Verificar que esta regla esté activa:
export default [
  {
    rules: {
      'no-undef': 'error', // ← Esta regla debe estar presente
    }
  }
];
```

---

## 🎓 Mejores Prácticas

### **1. Integración con Git Hooks**

```bash
# Instalar husky para git hooks
npm install --save-dev husky

# Configurar pre-commit hook
npx husky add .husky/pre-commit "npm run lint"
```

### **2. Configuración para Equipos**

```json
// .vscode/settings.json - Compartir con el equipo
{
  "eslint.validate": ["javascript"],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.formatOnSave": true
}
```

### **3. Scripts de NPM Útiles**

```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.mjs",
    "lint:fix": "eslint . --ext .js,.mjs --fix",
    "lint:check": "eslint . --ext .js,.mjs --max-warnings 0",
    "test": "npm run lint:check && node test.js"
  }
}
```

### **4. Configuración por Entorno**

```javascript
export default [
  {
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    }
  }
];
```

---

## 📚 Comandos de Referencia Rápida

### **Instalación:**
```bash
npm install --save-dev eslint
npx eslint --init
```

### **Uso diario:**
```bash
npm run lint          # Verificar errores
npm run lint:fix      # Arreglar errores automáticamente
npm run lint -- --fix # Arreglar archivo específico
```

### **Debugging:**
```bash
npx eslint --debug file.js    # Debug de reglas específicas
npx eslint --print-config .   # Ver configuración actual
```

### **VS Code:**
- `Ctrl+Shift+P` → "ESLint: Restart ESLint Server"
- `Ctrl+Shift+P` → "ESLint: Show Output Channel"

---

## 🎯 Resultado Final

Una vez configurado correctamente, tendrás:

### **✅ En VS Code:**
- 🔴 **Líneas rojas** bajo errores
- 🟡 **Líneas amarillas** bajo warnings
- 💡 **Bombilla** con sugerencias de arreglo
- ⚡ **Auto-fix** al guardar archivo

### **✅ En Terminal:**
```bash
$ npm run lint
✨ No problems found!

$ npm run lint:fix
✨ All fixable problems fixed!
```

### **✅ En tu Código:**
```javascript
// ❌ Antes (sin ESLint):
var user = getUser()
if (user.name == "admin") {
    console.log("Welcome")
}

// ✅ Después (con ESLint):
const user = getUser();
if (user.name === 'admin') {
  console.log('Welcome');
}
```

---

## 🎉 ¡Felicitaciones!

Ahora tienes ESLint configurado correctamente y:

- 🛡️ **Tu código está protegido** contra errores comunes
- 🎯 **Detectas imports faltantes** inmediatamente
- 📏 **Mantienes consistencia** en todo el proyecto
- 🚀 **Escribes código de mejor calidad** automáticamente

### **Próximos pasos recomendados:**
1. Configurar **Prettier** para formateo automático
2. Añadir **Git Hooks** para verificar código antes de commits
3. Explorar **reglas específicas** para tu framework (React, Vue, etc.)
4. Configurar **CI/CD** para verificar código en el servidor

¡Happy coding con ESLint! 🎊

---

*Documentación creada el 4 de septiembre de 2025*  
*Guía completa de configuración de ESLint para proyectos Node.js*
