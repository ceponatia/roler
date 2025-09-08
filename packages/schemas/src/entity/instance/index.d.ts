import { z } from 'zod';
export declare const InstanceEntitySchema: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
    kind: z.ZodLiteral<"characterInstance">;
    name: z.ZodString;
    sessionId: z.ZodOptional<z.ZodString>;
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
    kind: "characterInstance";
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
    name: string;
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
    sessionId?: string | undefined;
}, {
    updatedAt: string;
    id: string;
    kind: "characterInstance";
    createdAt: string;
    createdBy: string;
    updatedBy: string;
    name: string;
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
    sessionId?: string | undefined;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"itemInstance">;
    label: z.ZodString;
    ownerId: z.ZodOptional<z.ZodString>;
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
    kind: "itemInstance";
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
    label: string;
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
    ownerId?: string | undefined;
}, {
    updatedAt: string;
    id: string;
    kind: "itemInstance";
    createdAt: string;
    createdBy: string;
    updatedBy: string;
    label: string;
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
    ownerId?: string | undefined;
}>, z.ZodObject<{
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
}>, z.ZodObject<{
    kind: z.ZodLiteral<"scene">;
    sessionId: z.ZodString;
    title: z.ZodString;
    settingRef: z.ZodOptional<z.ZodString>;
    participants: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    summary: z.ZodOptional<z.ZodObject<{
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
    }>>;
    beats: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
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
    kind: "scene";
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
    title: string;
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
    sessionId: string;
    participants: string[];
    beats: string[];
    tags: string[];
    canonicalId?: (string & z.BRAND<"Ulid">) | undefined;
    settingRef?: string | undefined;
    summary?: {
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
    } | undefined;
}, {
    updatedAt: string;
    id: string;
    kind: "scene";
    createdAt: string;
    createdBy: string;
    updatedBy: string;
    title: string;
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
    sessionId: string;
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
    participants?: string[] | undefined;
    settingRef?: string | undefined;
    summary?: {
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
    } | undefined;
    beats?: string[] | undefined;
    tags?: string[] | undefined;
}>, z.ZodObject<{
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
}>, z.ZodObject<{
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
}>]>;
export type InstanceEntity = z.infer<typeof InstanceEntitySchema>;
//# sourceMappingURL=index.d.ts.map