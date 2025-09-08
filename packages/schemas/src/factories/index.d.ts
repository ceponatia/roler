import { CharacterCanonicalSchema } from '../entity/canonical/character.js';
export declare function makeCharacterCanonical(overrides?: Partial<ReturnType<typeof CharacterCanonicalSchema.parse>>): ReturnType<typeof CharacterCanonicalSchema.parse>;
export declare function makeCharacterInstance(overrides?: Record<string, unknown>): {
    updatedAt: string;
    id: string & import("zod").BRAND<"Ulid">;
    kind: "characterInstance";
    createdAt: string;
    createdBy: string & import("zod").BRAND<"Ulid">;
    updatedBy: string & import("zod").BRAND<"Ulid">;
    attributes: {
        value: string | number | boolean | string[] | [number, number] | Record<string, unknown>;
        keyPath: string;
        confidence: number;
        updatedAt: string;
        evidenceRefs: string[];
        lastUpdatedBy?: (string & import("zod").BRAND<"Ulid">) | undefined;
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
    canonicalId?: (string & import("zod").BRAND<"Ulid">) | undefined;
    sessionId?: string | undefined;
};
export declare function makeSceneInstance(overrides?: Record<string, unknown>): {
    updatedAt: string;
    id: string & import("zod").BRAND<"Ulid">;
    kind: "scene";
    createdAt: string;
    createdBy: string & import("zod").BRAND<"Ulid">;
    updatedBy: string & import("zod").BRAND<"Ulid">;
    attributes: {
        value: string | number | boolean | string[] | [number, number] | Record<string, unknown>;
        keyPath: string;
        confidence: number;
        updatedAt: string;
        evidenceRefs: string[];
        lastUpdatedBy?: (string & import("zod").BRAND<"Ulid">) | undefined;
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
    canonicalId?: (string & import("zod").BRAND<"Ulid">) | undefined;
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
};
export declare function validateUlid(candidate: string): boolean;
//# sourceMappingURL=index.d.ts.map