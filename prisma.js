// Este archivo se encarga de crear una instancia de PrismaClient
// y exportarla para que pueda ser utilizada en otros archivos de la aplicación.
// También se encarga de guardar la instancia en una variable global para que no sea
// necesario crear una nueva instancia cada vez que se importe el archivo.
// Es un cliente que maneja las conexiones de
// prisma y básicamente si detecta una conexión global ya no crea nuevas conexiones.

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') {globalForPrisma.prisma = prisma;}

// import { PrismaClient } from '@prisma/client/edge'
// import { withAccelerate } from '@prisma/extension-accelerate'

// export const prisma = new PrismaClient().$extends(withAccelerate())

