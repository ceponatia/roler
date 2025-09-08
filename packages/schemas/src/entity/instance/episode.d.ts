import { z } from 'zod';
export declare const EpisodeInstanceSchema: z.ZodObject<{
    kind: z.ZodLiteral<"episode">;
    sceneId: z.ZodString;
    inputs: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    llmOutputs: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    appliedChanges: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    memoryWrites: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    seed: z.ZodOptional<z.ZodString>;
    modelInfo: z.ZodDefault<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        latencyMs: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        model?: string | undefined;
        latencyMs?: number | undefined;
    }, {
        model?: string | undefined;
        latencyMs?: number | undefined;
    }>>;
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
    updatedAt: string;
    id: string & z.BRAND<"Ulid">;
    kind: "episode";
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
    sceneId: string;
    inputs: Record<string, unknown>;
    llmOutputs: Record<string, unknown>;
    appliedChanges: string[];
    memoryWrites: string[];
    modelInfo: {
        model?: string | undefined;
        latencyMs?: number | undefined;
    };
    canonicalId?: (string & z.BRAND<"Ulid">) | undefined;
    seed?: string | undefined;
}, {
    updatedAt: string;
    id: string;
    kind: "episode";
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
    sceneId: string;
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
    inputs?: Record<string, unknown> | undefined;
    llmOutputs?: Record<string, unknown> | undefined;
    appliedChanges?: string[] | undefined;
    memoryWrites?: string[] | undefined;
    seed?: string | undefined;
    modelInfo?: {
        model?: string | undefined;
        latencyMs?: number | undefined;
    } | undefined;
}>;
export type EpisodeInstance = z.infer<typeof EpisodeInstanceSchema>;
//# sourceMappingURL=episode.d.ts.map