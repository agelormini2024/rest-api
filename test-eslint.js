// Este archivo es solo para demostrar ESLint
// ❌ ESLint detectará estos errores:

const app = express(); // Error: 'express' is not defined
console.log('Hola mundo');

// ❌ Variables no usadas:
const variableNoUsada = 'test';

// ❌ Usar var en lugar de const/let:
const miVariable = 'mal';

// ❌ Comparación con == en lugar de ===:
if (miVariable == 'mal') {
  console.log('Esto está mal');
}

export default app;
