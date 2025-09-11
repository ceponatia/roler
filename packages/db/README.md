# @roler/db

Prisma-based database layer for Roler.
Initial implementation on 9-11-2025.

## Environment

- DATABASE_URL: Postgres connection string (validated by Zod).

## Common commands

- pnpm --filter @roler/db prisma:validate
- pnpm --filter @roler/db prisma:generate
- pnpm --filter @roler/db migrate:dev
- pnpm --filter @roler/db migrate:deploy

## Usage

```ts
import { getPrismaClient } from '@roler/db';

const prisma = getPrismaClient();
const versions = await prisma.canonVersion.findMany({ take: 10 });
```
