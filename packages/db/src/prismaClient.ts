import { PrismaClient } from '@prisma/client';

import { getDbEnv } from './env.js';

export interface PrismaClientLike {
  readonly $connect: () => Promise<void>;
  readonly $disconnect: () => Promise<void>;
}

let prisma: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (prisma) return prisma;
  // Validate env before instantiating client
  const { DATABASE_URL } = getDbEnv();
  void DATABASE_URL; // validation side effect; value is used by Prisma internals
  prisma = new PrismaClient({
    log: [
      { emit: 'event', level: 'warn' },
      { emit: 'event', level: 'error' }
    ]
  });
  return prisma;
}
