import { z } from 'zod';
export declare const RelationshipInstanceSchema: z.ZodObject<{
    kind: z.ZodLiteral<"relationship">;
    participants: z.ZodArray<z.ZodObject<{
        refId: z.ZodBranded<z.ZodString, "Ulid">;
        role: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        refId: string & z.BRAND<"Ulid">;
        role?: string | undefined;
    }, {
        refId: string;
        role?: string | undefined;
    }>, "many">;
    typeRef: z.ZodString;
    intensity: z.ZodDefault<z.ZodNumber>;
    stage: z.ZodDefault<z.ZodEnum<["acquaintance", "friendly", "close", "romantic", "intimate", "estranged"]>>;
    romance: z.ZodDefault<z.ZodObject<{
        isRomantic: z.ZodDefault<z.ZodBoolean>;
        isIntimate: z.ZodDefault<z.ZodBoolean>;
        consentEstablishedAt: z.ZodOptional<z.ZodString>;
        lastConsentReviewAt: z.ZodOptional<z.ZodString>;
        safetyConcerns: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        isRomantic: boolean;
        isIntimate: boolean;
        safetyConcerns: string[];
        consentEstablishedAt?: string | undefined;
        lastConsentReviewAt?: string | undefined;
    }, {
        isRomantic?: boolean | undefined;
        isIntimate?: boolean | undefined;
        consentEstablishedAt?: string | undefined;
        lastConsentReviewAt?: string | undefined;
        safetyConcerns?: string[] | undefined;
    }>>;
    boundaries: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    history: z.ZodDefault<z.ZodArray<z.ZodObject<{
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
    }>, "many">>;
    consentFlags: z.ZodDefault<z.ZodObject<{
        lastConfirmedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        lastConfirmedAt?: string | undefined;
    }, {
        lastConfirmedAt?: string | undefined;
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
    kind: "relationship";
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
    stage: "acquaintance" | "friendly" | "close" | "romantic" | "intimate" | "estranged";
    intensity: number;
    participants: {
        refId: string & z.BRAND<"Ulid">;
        role?: string | undefined;
    }[];
    typeRef: string;
    romance: {
        isRomantic: boolean;
        isIntimate: boolean;
        safetyConcerns: string[];
        consentEstablishedAt?: string | undefined;
        lastConsentReviewAt?: string | undefined;
    };
    boundaries: string[];
    history: {
        at: string;
        stage?: "acquaintance" | "friendly" | "close" | "romantic" | "intimate" | "estranged" | undefined;
        intensity?: number | undefined;
        note?: string | undefined;
    }[];
    consentFlags: {
        lastConfirmedAt?: string | undefined;
    };
    canonicalId?: (string & z.BRAND<"Ulid">) | undefined;
}, {
    updatedAt: string;
    id: string;
    kind: "relationship";
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
    participants: {
        refId: string;
        role?: string | undefined;
    }[];
    typeRef: string;
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
    stage?: "acquaintance" | "friendly" | "close" | "romantic" | "intimate" | "estranged" | undefined;
    intensity?: number | undefined;
    romance?: {
        isRomantic?: boolean | undefined;
        isIntimate?: boolean | undefined;
        consentEstablishedAt?: string | undefined;
        lastConsentReviewAt?: string | undefined;
        safetyConcerns?: string[] | undefined;
    } | undefined;
    boundaries?: string[] | undefined;
    history?: {
        at: string;
        stage?: "acquaintance" | "friendly" | "close" | "romantic" | "intimate" | "estranged" | undefined;
        intensity?: number | undefined;
        note?: string | undefined;
    }[] | undefined;
    consentFlags?: {
        lastConfirmedAt?: string | undefined;
    } | undefined;
}>;
export type RelationshipInstance = z.infer<typeof RelationshipInstanceSchema>;
//# sourceMappingURL=relationship.d.ts.map