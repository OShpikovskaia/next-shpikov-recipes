import { withAccelerate } from '@prisma/extension-accelerate';

import { PrismaClient } from '@/generated/prisma/client';

const createPrismaClient = () => {
  return new PrismaClient().$extends(withAccelerate());
};

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma?: ExtendedPrismaClient;
};

const prisma: ExtendedPrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
