/**
 * Extension Manifest Schema
 * Defines the shape of an extension's declarative manifest loaded at startup.
 * Fields mirror the technical spec (R-001) Section 4.
 *
 * Example:
 * const manifest: ExtensionManifest = {
 *   id: 'relationship-score-normalizer',
 *   name: 'Relationship Score Normalizer',
 *   version: '0.1.0',
 *   description: 'Adjusts relationship bond metrics after moderated chat turns',
 *   coreApiRange: '^1.0.0',
 *   capabilities: ['normalize:relationship', 'chat:postModeration'],
 *   hooks: { normalize: ['normalizeRelationship'] },
 *   chatHooks: { postModeration: ['postModerationAdjust'] },
 *   priority: 10,
 *   hookBudgets: { postModerationAdjust: { maxLatencyMs: 25 } },
 *   concurrencyLimit: 4,
 *   killSwitchEnabled: true,
 *   stateTransactionSupport: true
 * };
 */
import { z } from 'zod';
export declare const ExtensionPeerSchema: z.ZodObject<{
    id: z.ZodString;
    range: z.ZodString;
}, "strict", z.ZodTypeAny, {
    id: string;
    range: string;
}, {
    id: string;
    range: string;
}>;
export type ExtensionPeer = z.infer<typeof ExtensionPeerSchema>;
export declare const HookBudgetSchema: z.ZodObject<{
    maxTokens: z.ZodOptional<z.ZodNumber>;
    maxLatencyMs: z.ZodOptional<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    maxTokens?: number | undefined;
    maxLatencyMs?: number | undefined;
}, {
    maxTokens?: number | undefined;
    maxLatencyMs?: number | undefined;
}>;
export type HookBudget = z.infer<typeof HookBudgetSchema>;
export declare const ExtensionManifestSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    version: z.ZodString;
    description: z.ZodString;
    license: z.ZodOptional<z.ZodString>;
    author: z.ZodOptional<z.ZodString>;
    coreApiRange: z.ZodString;
    peerExtensions: z.ZodReadonly<z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        range: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        id: string;
        range: string;
    }, {
        id: string;
        range: string;
    }>, "many">>>;
    capabilities: z.ZodReadonly<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    hooks: z.ZodOptional<z.ZodObject<{
        normalize: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        retrievalEnrichment: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        preSaveValidate: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    }, "strip", z.ZodTypeAny, {
        normalize?: string[] | undefined;
        retrievalEnrichment?: string[] | undefined;
        preSaveValidate?: string[] | undefined;
    }, {
        normalize?: string[] | undefined;
        retrievalEnrichment?: string[] | undefined;
        preSaveValidate?: string[] | undefined;
    }>>;
    priority: z.ZodDefault<z.ZodNumber>;
    unsafeCapabilities: z.ZodReadonly<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    configSchema: z.ZodOptional<z.ZodString>;
    chatHooks: z.ZodOptional<z.ZodObject<{
        preChatTurn: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        postModelDraft: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        postModeration: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        prePersistTurn: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    }, "strip", z.ZodTypeAny, {
        preChatTurn?: string[] | undefined;
        postModelDraft?: string[] | undefined;
        postModeration?: string[] | undefined;
        prePersistTurn?: string[] | undefined;
    }, {
        preChatTurn?: string[] | undefined;
        postModelDraft?: string[] | undefined;
        postModeration?: string[] | undefined;
        prePersistTurn?: string[] | undefined;
    }>>;
    hookBudgets: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        maxTokens: z.ZodOptional<z.ZodNumber>;
        maxLatencyMs: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        maxTokens?: number | undefined;
        maxLatencyMs?: number | undefined;
    }, {
        maxTokens?: number | undefined;
        maxLatencyMs?: number | undefined;
    }>>>;
    concurrencyLimit: z.ZodDefault<z.ZodNumber>;
    killSwitchEnabled: z.ZodDefault<z.ZodBoolean>;
    dataClassScopes: z.ZodReadonly<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    stateTransactionSupport: z.ZodDefault<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    id: string;
    version: string;
    name: string;
    description: string;
    coreApiRange: string;
    peerExtensions: readonly {
        id: string;
        range: string;
    }[];
    capabilities: readonly string[];
    priority: number;
    concurrencyLimit: number;
    killSwitchEnabled: boolean;
    stateTransactionSupport: boolean;
    license?: string | undefined;
    author?: string | undefined;
    hooks?: {
        normalize?: string[] | undefined;
        retrievalEnrichment?: string[] | undefined;
        preSaveValidate?: string[] | undefined;
    } | undefined;
    unsafeCapabilities?: readonly string[] | undefined;
    configSchema?: string | undefined;
    chatHooks?: {
        preChatTurn?: string[] | undefined;
        postModelDraft?: string[] | undefined;
        postModeration?: string[] | undefined;
        prePersistTurn?: string[] | undefined;
    } | undefined;
    hookBudgets?: Record<string, {
        maxTokens?: number | undefined;
        maxLatencyMs?: number | undefined;
    }> | undefined;
    dataClassScopes?: readonly string[] | undefined;
}, {
    id: string;
    version: string;
    name: string;
    description: string;
    coreApiRange: string;
    license?: string | undefined;
    author?: string | undefined;
    peerExtensions?: readonly {
        id: string;
        range: string;
    }[] | undefined;
    capabilities?: readonly string[] | undefined;
    hooks?: {
        normalize?: string[] | undefined;
        retrievalEnrichment?: string[] | undefined;
        preSaveValidate?: string[] | undefined;
    } | undefined;
    priority?: number | undefined;
    unsafeCapabilities?: readonly string[] | undefined;
    configSchema?: string | undefined;
    chatHooks?: {
        preChatTurn?: string[] | undefined;
        postModelDraft?: string[] | undefined;
        postModeration?: string[] | undefined;
        prePersistTurn?: string[] | undefined;
    } | undefined;
    hookBudgets?: Record<string, {
        maxTokens?: number | undefined;
        maxLatencyMs?: number | undefined;
    }> | undefined;
    concurrencyLimit?: number | undefined;
    killSwitchEnabled?: boolean | undefined;
    dataClassScopes?: readonly string[] | undefined;
    stateTransactionSupport?: boolean | undefined;
}>;
export type ExtensionManifest = z.infer<typeof ExtensionManifestSchema>;
//# sourceMappingURL=extension-manifest.schema.d.ts.map