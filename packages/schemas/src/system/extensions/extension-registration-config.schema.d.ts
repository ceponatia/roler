/**
 * Extension Registration Config Schema
 * Host-level configuration controlling which extensions load and behavioral policies.
 * Mirrors technical spec (R-001) supporting schema.
 */
import { z } from 'zod';
import type { ExtensionManifest } from './extension-manifest.schema.js';
export declare const EnabledExtensionRefSchema: z.ZodObject<{
    id: z.ZodString;
    path: z.ZodOptional<z.ZodString>;
    overrides: z.ZodOptional<z.ZodObject<{
        concurrencyLimit: z.ZodOptional<z.ZodNumber>;
        killSwitchEnabled: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        concurrencyLimit?: number | undefined;
        killSwitchEnabled?: boolean | undefined;
    }, {
        concurrencyLimit?: number | undefined;
        killSwitchEnabled?: boolean | undefined;
    }>>;
}, "strict", z.ZodTypeAny, {
    id: string;
    path?: string | undefined;
    overrides?: {
        concurrencyLimit?: number | undefined;
        killSwitchEnabled?: boolean | undefined;
    } | undefined;
}, {
    id: string;
    path?: string | undefined;
    overrides?: {
        concurrencyLimit?: number | undefined;
        killSwitchEnabled?: boolean | undefined;
    } | undefined;
}>;
export type EnabledExtensionRef = z.infer<typeof EnabledExtensionRefSchema>;
export declare const ExtensionRegistrationConfigSchema: z.ZodObject<{
    extensions: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        path: z.ZodOptional<z.ZodString>;
        overrides: z.ZodOptional<z.ZodObject<{
            concurrencyLimit: z.ZodOptional<z.ZodNumber>;
            killSwitchEnabled: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            concurrencyLimit?: number | undefined;
            killSwitchEnabled?: boolean | undefined;
        }, {
            concurrencyLimit?: number | undefined;
            killSwitchEnabled?: boolean | undefined;
        }>>;
    }, "strict", z.ZodTypeAny, {
        id: string;
        path?: string | undefined;
        overrides?: {
            concurrencyLimit?: number | undefined;
            killSwitchEnabled?: boolean | undefined;
        } | undefined;
    }, {
        id: string;
        path?: string | undefined;
        overrides?: {
            concurrencyLimit?: number | undefined;
            killSwitchEnabled?: boolean | undefined;
        } | undefined;
    }>, "many">>;
    orderOverrides: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    capabilityAllowlist: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    failOpen: z.ZodDefault<z.ZodBoolean>;
    strictMode: z.ZodDefault<z.ZodBoolean>;
    performance: z.ZodDefault<z.ZodObject<{
        maxOverheadPercentWarn: z.ZodDefault<z.ZodNumber>;
        maxOverheadPercentFail: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        maxOverheadPercentWarn: number;
        maxOverheadPercentFail: number;
    }, {
        maxOverheadPercentWarn?: number | undefined;
        maxOverheadPercentFail?: number | undefined;
    }>>;
}, "strict", z.ZodTypeAny, {
    extensions: {
        id: string;
        path?: string | undefined;
        overrides?: {
            concurrencyLimit?: number | undefined;
            killSwitchEnabled?: boolean | undefined;
        } | undefined;
    }[];
    failOpen: boolean;
    strictMode: boolean;
    performance: {
        maxOverheadPercentWarn: number;
        maxOverheadPercentFail: number;
    };
    orderOverrides?: string[] | undefined;
    capabilityAllowlist?: string[] | undefined;
}, {
    extensions?: {
        id: string;
        path?: string | undefined;
        overrides?: {
            concurrencyLimit?: number | undefined;
            killSwitchEnabled?: boolean | undefined;
        } | undefined;
    }[] | undefined;
    orderOverrides?: string[] | undefined;
    capabilityAllowlist?: string[] | undefined;
    failOpen?: boolean | undefined;
    strictMode?: boolean | undefined;
    performance?: {
        maxOverheadPercentWarn?: number | undefined;
        maxOverheadPercentFail?: number | undefined;
    } | undefined;
}>;
export type ExtensionRegistrationConfig = z.infer<typeof ExtensionRegistrationConfigSchema>;
export interface RegisteredExtensionRuntime {
    readonly manifest: ExtensionManifest;
    readonly disabled: boolean;
}
//# sourceMappingURL=extension-registration-config.schema.d.ts.map