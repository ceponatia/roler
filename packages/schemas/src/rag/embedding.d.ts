import { z } from 'zod';
export declare const EmbeddingMetaSchema: z.ZodObject<{
    id: z.ZodBranded<z.ZodString, "Ulid">;
    namespace: z.ZodString;
    model: z.ZodString;
    dimension: z.ZodNumber;
    contentTags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    model: string;
    dimension: number;
    namespace: string;
    contentTags: string[];
    id: string & z.BRAND<"Ulid">;
    createdAt: string;
}, {
    model: string;
    dimension: number;
    namespace: string;
    id: string;
    createdAt: string;
    contentTags?: string[] | undefined;
}>;
export type EmbeddingMeta = z.infer<typeof EmbeddingMetaSchema>;
//# sourceMappingURL=embedding.d.ts.map