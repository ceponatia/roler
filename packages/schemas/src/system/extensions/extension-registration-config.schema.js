/**
 * Extension Registration Config Schema
 * Host-level configuration controlling which extensions load and behavioral policies.
 * Mirrors technical spec (R-001) supporting schema.
 */
import { z } from 'zod';
export const EnabledExtensionRefSchema = z.object({
    id: z.string(),
    // optional explicit path override (e.g. local dev build) - not necessarily used at runtime yet
    path: z.string().optional(),
    // allow per-extension override of concurrency limit or kill-switch at host level (subset of manifest fields)
    overrides: z
        .object({
        concurrencyLimit: z.number().int().positive().optional(),
        killSwitchEnabled: z.boolean().optional(),
    })
        .optional(),
}).strict();
export const ExtensionRegistrationConfigSchema = z.object({
    extensions: z.array(EnabledExtensionRefSchema).default([]),
    orderOverrides: z.array(z.string()).optional(), // explicit global ordering precedence
    capabilityAllowlist: z.array(z.string()).optional(),
    failOpen: z.boolean().default(false), // if true, certain manifest validation errors downgrade to warnings
    strictMode: z.boolean().default(false), // escalates soft failures
    performance: z
        .object({
        maxOverheadPercentWarn: z.number().positive().default(5),
        maxOverheadPercentFail: z.number().positive().default(7),
    })
        .default({}),
}).strict();
//# sourceMappingURL=extension-registration-config.schema.js.map