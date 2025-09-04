// Simulación de base de datos en memoria
const users = [
  { id: 1, name: 'Juan Pérez', email: 'juan@email.com', age: 25 },
  { id: 2, name: 'María García', email: 'maria@email.com', age: 30 },
  { id: 3, name: 'Carlos López', email: 'carlos@email.com', age: 28 }
];

let nextId = 4;

export class User {
  constructor(data) {
    this.id = data.id || nextId++;
    this.name = data.name;
    this.email = data.email;
    this.age = data.age;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  // Método para validar datos del usuario
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

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Métodos estáticos para operaciones CRUD
  static findAll() {
    return users;
  }

  static findById(id) {
    return users.find(user => user.id === parseInt(id));
  }

  static create(userData) {
    const user = new User(userData);
    const errors = user.validate();
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    // Verificar email único
    if (users.some(u => u.email === user.email)) { // ***
      throw new Error('El email ya está registrado');
    }

    users.push(user);
    return user;
  }

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

  static delete(id) {
    const index = users.findIndex(user => user.id === parseInt(id));
    if (index === -1) {return null;}

    return users.splice(index, 1)[0];
  }
}