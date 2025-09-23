import { OpenAPIRegistry, OpenApiGeneratorV3, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { TextChunkOwnerTypeSchema, TextChunkSchema } from '@roler/schemas';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { z } from 'zod';

import type { TextChunk, TextChunkOwnerType } from '@roler/schemas';

const require = createRequire(import.meta.url);
try {
  const resolved = require.resolve('@asteasolutions/zod-to-openapi/package.json');
  const pkg = require(resolved);
  console.log(`zod-to-openapi resolved to: ${resolved} (${pkg.version})`);
} catch (e) {
  console.log('Could not resolve @asteasolutions/zod-to-openapi at runtime', e);
}
// Import a few representative schemas to showcase the pipeline.
// Avoid importing everything to keep the initial spec lean and fast.

const registry = new OpenAPIRegistry();
// Ensure zod schemas have the .openapi() helper used by the registry in v7
extendZodWithOpenApi(z);

// Register core entities as components
registry.register('TextChunk', TextChunkSchema);
registry.register('TextChunkOwnerType', TextChunkOwnerTypeSchema);

// Example endpoint schemas (placeholder request/response) to
// generate a valid OpenAPI document consumers can browse.
const GetTextChunkResponse = z.object({
  data: TextChunkSchema
});

const ListTextChunksResponse = z.object({
  data: z.array(TextChunkSchema)
});

registry.registerPath({
  method: 'get',
  path: '/api/text-chunks',
  summary: 'List text chunks',
  responses: {
    200: {
      description: 'List of text chunks',
      content: {
        'application/json': {
          schema: ListTextChunksResponse
        }
      }
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/text-chunks/{id}',
  summary: 'Get a text chunk by id',
  request: {
    params: z.object({ id: z.string() })
  },
  responses: {
    200: {
      description: 'Text chunk',
      content: {
        'application/json': {
          schema: GetTextChunkResponse
        }
      }
    }
  }
});

const generator = new OpenApiGeneratorV3(registry.definitions);
const doc = generator.generateDocument({
  openapi: '3.0.3',
  info: {
    title: 'Roler API (prototype)',
    version: '0.1.0'
  },
  servers: [{ url: 'http://localhost:3000' }]
});

const outDir = process.cwd();
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, 'openapi.json');
writeFileSync(outFile, JSON.stringify(doc, null, 2), 'utf8');
console.log(`Generated OpenAPI spec at ${outFile}`);

// Types used above to ensure imports are exercised (satisfies no-unused-vars rules in some configs)
void (undefined as unknown as TextChunk | TextChunkOwnerType);
