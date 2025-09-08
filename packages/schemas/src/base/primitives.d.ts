import { z } from 'zod';
export declare const UlidSchema: z.ZodBranded<z.ZodString, "Ulid">;
export type Ulid = z.infer<typeof UlidSchema>;
export declare const isUlid: (value: unknown) => value is Ulid;
export declare const IsoDateTimeSchema: z.ZodString;
export type IsoDateTime = z.infer<typeof IsoDateTimeSchema>;
export declare const VectorizableTextSchema: z.ZodObject<{
    text: z.ZodString;
    embed: z.ZodDefault<z.ZodBoolean>;
    embedding: z.ZodOptional<z.ZodObject<{
        model: z.ZodString;
        vector: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
        dimension: z.ZodOptional<z.ZodNumber>;
        embeddedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        model: string;
        vector?: number[] | undefined;
        dimension?: number | undefined;
        embeddedAt?: string | undefined;
    }, {
        model: string;
        vector?: number[] | undefined;
        dimension?: number | undefined;
        embeddedAt?: string | undefined;
    }>>;
    chunk: z.ZodOptional<z.ZodObject<{
        index: z.ZodNumber;
        total: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        index: number;
        total: number;
    }, {
        index: number;
        total: number;
    }>>;
    namespace: z.ZodOptional<z.ZodString>;
    contentTags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    text: string;
    embed: boolean;
    contentTags: string[];
    embedding?: {
        model: string;
        vector?: number[] | undefined;
        dimension?: number | undefined;
        embeddedAt?: string | undefined;
    } | undefined;
    chunk?: {
        index: number;
        total: number;
    } | undefined;
    namespace?: string | undefined;
}, {
    text: string;
    embed?: boolean | undefined;
    embedding?: {
        model: string;
        vector?: number[] | undefined;
        dimension?: number | undefined;
        embeddedAt?: string | undefined;
    } | undefined;
    chunk?: {
        index: number;
        total: number;
    } | undefined;
    namespace?: string | undefined;
    contentTags?: string[] | undefined;
}>;
export type VectorizableText = z.infer<typeof VectorizableTextSchema>;
//# sourceMappingURL=primitives.d.ts.map