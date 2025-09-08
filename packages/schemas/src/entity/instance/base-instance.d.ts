import { z } from 'zod';
export declare const ChangePolicySchema: z.ZodObject<{
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
export type ChangePolicy = z.infer<typeof ChangePolicySchema>;
export declare const MutableBaseCore: {
    id: z.ZodBranded<z.ZodString, "Ulid">;
    kind: z.ZodEnum<["character", "location", "item", "relationshipType", "promptTemplate", "characterInstance", "itemInstance", "relationship", "scene", "episode", "memory"]>;
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
};
export declare const MutableBaseSchema: z.ZodObject<{
    id: z.ZodBranded<z.ZodString, "Ulid">;
    kind: z.ZodEnum<["character", "location", "item", "relationshipType", "promptTemplate", "characterInstance", "itemInstance", "relationship", "scene", "episode", "memory"]>;
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
    kind: "character" | "location" | "item" | "relationshipType" | "promptTemplate" | "characterInstance" | "itemInstance" | "relationship" | "scene" | "episode" | "memory";
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
    canonicalId?: (string & z.BRAND<"Ulid">) | undefined;
}, {
    updatedAt: string;
    id: string;
    kind: "character" | "location" | "item" | "relationshipType" | "promptTemplate" | "characterInstance" | "itemInstance" | "relationship" | "scene" | "episode" | "memory";
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
}>;
export type MutableBase = z.infer<typeof MutableBaseSchema>;
export declare const RelationshipParticipantSchema: z.ZodObject<{
    refId: z.ZodBranded<z.ZodString, "Ulid">;
    role: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    refId: string & z.BRAND<"Ulid">;
    role?: string | undefined;
}, {
    refId: string;
    role?: string | undefined;
}>;
export type RelationshipParticipant = z.infer<typeof RelationshipParticipantSchema>;
export declare const RelationshipHistoryEntrySchema: z.ZodObject<{
    at: z.ZodString;
    stage: z.ZodOptional<z.ZodEnum<["acquaintance", "friendly", "close", "romantic", "intimate", "estranged"]>>;
    intensity: z.ZodOptional<z.ZodNumber>;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    at: string;
    stage?: "acquaintance" | "friendly" | "close" | "romantic" | "intimate" | "estranged" | undefined;
    intensity?: number | undefined;
    note?: string | undefined;
}, {
    at: string;
    stage?: "acquaintance" | "friendly" | "close" | "romantic" | "intimate" | "estranged" | undefined;
    intensity?: number | undefined;
    note?: string | undefined;
}>;
export type RelationshipHistoryEntry = z.infer<typeof RelationshipHistoryEntrySchema>;
//# sourceMappingURL=base-instance.d.ts.map