import { z } from 'zod';
export declare const SceneInstanceSchema: z.ZodObject<{
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
}>;
export type SceneInstance = z.infer<typeof SceneInstanceSchema>;
//# sourceMappingURL=scene.d.ts.map