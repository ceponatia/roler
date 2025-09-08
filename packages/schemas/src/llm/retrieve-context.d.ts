import { z } from 'zod';
export declare const RetrieveContextInputSchema: z.ZodObject<{
    text: z.ZodString;
    limit: z.ZodDefault<z.ZodNumber>;
    namespace: z.ZodOptional<z.ZodString>;
    contentTags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
} & {
    includeMeta: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    text: string;
    limit: number;
    includeMeta: boolean;
    namespace?: string | undefined;
    contentTags?: string[] | undefined;
}, {
    text: string;
    namespace?: string | undefined;
    contentTags?: string[] | undefined;
    limit?: number | undefined;
    includeMeta?: boolean | undefined;
}>;
export type RetrieveContextInput = z.infer<typeof RetrieveContextInputSchema>;
export declare const RetrieveContextOutputSchema: z.ZodObject<{
    query: z.ZodObject<{
        text: z.ZodString;
        limit: z.ZodDefault<z.ZodNumber>;
        namespace: z.ZodOptional<z.ZodString>;
        contentTags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        text: string;
        limit: number;
        namespace?: string | undefined;
        contentTags?: string[] | undefined;
    }, {
        text: string;
        namespace?: string | undefined;
        contentTags?: string[] | undefined;
        limit?: number | undefined;
    }>;
    chunks: z.ZodArray<z.ZodObject<{
        score: z.ZodNumber;
        source: z.ZodObject<{
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
        meta: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        source: {
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
        };
        score: number;
        meta: Record<string, unknown>;
    }, {
        source: {
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
        };
        score: number;
        meta?: Record<string, unknown> | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    query: {
        text: string;
        limit: number;
        namespace?: string | undefined;
        contentTags?: string[] | undefined;
    };
    chunks: {
        source: {
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
        };
        score: number;
        meta: Record<string, unknown>;
    }[];
}, {
    query: {
        text: string;
        namespace?: string | undefined;
        contentTags?: string[] | undefined;
        limit?: number | undefined;
    };
    chunks: {
        source: {
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
        };
        score: number;
        meta?: Record<string, unknown> | undefined;
    }[];
}>;
export type RetrieveContextOutput = z.infer<typeof RetrieveContextOutputSchema>;
//# sourceMappingURL=retrieve-context.d.ts.map