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
