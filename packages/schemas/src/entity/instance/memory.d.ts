import { z } from 'zod';
export declare const MemoryInstanceSchema: z.ZodObject<{
    kind: z.ZodLiteral<"memory">;
    scope: z.ZodEnum<["L1", "L2", "L3"]>;
    salience: z.ZodDefault<z.ZodNumber>;
    decayPolicy: z.ZodDefault<z.ZodEnum<["none", "time", "usage"]>>;
    vector: z.ZodObject<{
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
    id: z.ZodBranded<z.ZodString, "Ulid">;
    canonicalId: z.ZodOptional<z.ZodBranded<z.ZodString, "Ulid">>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    createdBy: z.ZodBranded<z.ZodString, "Ulid">;
    updatedBy: z.ZodBranded<z.ZodString, "Ulid">;
    mutableAttributes: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    changePolicy: z.ZodObject<{
        allowedKeys: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        requiresEvidence: z.ZodDefault<z.ZodBoolean>;
        stability: z.ZodDefault<z.ZodEnum<["volatile", "stable", "locked"]>>;
        cooldown: z.ZodDefault<z.ZodNumber>;
        rateWindow: z.ZodDefault<z.ZodNumber>;
        maxChanges: z.ZodDefault<z.ZodNumber>;
        rateLimit: z.ZodDefault<z.ZodObject<{
            perMinute: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            perMinute?: number | undefined;
        }, {
            perMinute?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        allowedKeys: string[];
        requiresEvidence: boolean;
        stability: "volatile" | "stable" | "locked";
        cooldown: number;
        rateWindow: number;
        maxChanges: number;
        rateLimit: {
            perMinute?: number | undefined;
        };
    }, {
        allowedKeys?: string[] | undefined;
        requiresEvidence?: boolean | undefined;
        stability?: "volatile" | "stable" | "locked" | undefined;
        cooldown?: number | undefined;
        rateWindow?: number | undefined;
        maxChanges?: number | undefined;
        rateLimit?: {
            perMinute?: number | undefined;
        } | undefined;
    }>;
    attributes: z.ZodDefault<z.ZodArray<z.ZodObject<{
        keyPath: z.ZodString;
        value: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodEffects<z.ZodDate, string, Date>, z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>, z.ZodArray<z.ZodString, "many">, z.ZodRecord<z.ZodString, z.ZodUnknown>]>;
        confidence: z.ZodDefault<z.ZodNumber>;
        lastUpdatedBy: z.ZodOptional<z.ZodBranded<z.ZodString, "Ulid">>;
        updatedAt: z.ZodDefault<z.ZodString>;
        evidenceRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        value: string | number | boolean | string[] | [number, number] | Record<string, unknown>;
        keyPath: string;
        confidence: number;
        updatedAt: string;
        evidenceRefs: string[];
        lastUpdatedBy?: (string & z.BRAND<"Ulid">) | undefined;
    }, {
        value: string | number | boolean | Date | string[] | [number, number] | Record<string, unknown>;
        keyPath: string;
        confidence?: number | undefined;
        lastUpdatedBy?: string | undefined;
        updatedAt?: string | undefined;
        evidenceRefs?: string[] | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    vector: {
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
    updatedAt: string;
    id: string & z.BRAND<"Ulid">;
    kind: "memory";
    createdAt: string;
    createdBy: string & z.BRAND<"Ulid">;
    updatedBy: string & z.BRAND<"Ulid">;
    attributes: {
        value: string | number | boolean | string[] | [number, number] | Record<string, unknown>;
        keyPath: string;
        confidence: number;
        updatedAt: string;
        evidenceRefs: string[];
        lastUpdatedBy?: (string & z.BRAND<"Ulid">) | undefined;
    }[];
    mutableAttributes: string[];
    changePolicy: {
        allowedKeys: string[];
        requiresEvidence: boolean;
        stability: "volatile" | "stable" | "locked";
        cooldown: number;
        rateWindow: number;
        maxChanges: number;
        rateLimit: {
            perMinute?: number | undefined;
        };
    };
    scope: "L1" | "L2" | "L3";
    salience: number;
    decayPolicy: "none" | "time" | "usage";
    canonicalId?: (string & z.BRAND<"Ulid">) | undefined;
}, {
    vector: {
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
    updatedAt: string;
    id: string;
    kind: "memory";
    createdAt: string;
    createdBy: string;
    updatedBy: string;
    changePolicy: {
        allowedKeys?: string[] | undefined;
        requiresEvidence?: boolean | undefined;
        stability?: "volatile" | "stable" | "locked" | undefined;
        cooldown?: number | undefined;
        rateWindow?: number | undefined;
        maxChanges?: number | undefined;
        rateLimit?: {
            perMinute?: number | undefined;
        } | undefined;
    };
    scope: "L1" | "L2" | "L3";
    attributes?: {
        value: string | number | boolean | Date | string[] | [number, number] | Record<string, unknown>;
        keyPath: string;
        confidence?: number | undefined;
        lastUpdatedBy?: string | undefined;
        updatedAt?: string | undefined;
        evidenceRefs?: string[] | undefined;
    }[] | undefined;
    canonicalId?: string | undefined;
    mutableAttributes?: string[] | undefined;
    salience?: number | undefined;
    decayPolicy?: "none" | "time" | "usage" | undefined;
}>;
export type MemoryInstance = z.infer<typeof MemoryInstanceSchema>;
//# sourceMappingURL=memory.d.ts.map