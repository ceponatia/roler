import { z } from 'zod';
export declare const ProposedFieldChangeSchema: z.ZodObject<{
    keyPath: z.ZodString;
    newValue: z.ZodUnknown;
    rationale: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    keyPath: string;
    rationale?: string | undefined;
    newValue?: unknown;
}, {
    keyPath: string;
    rationale?: string | undefined;
    newValue?: unknown;
}>;
export type ProposedFieldChange = z.infer<typeof ProposedFieldChangeSchema>;
export declare const ProposeChangeInputSchema: z.ZodObject<{
    entityId: z.ZodString;
    proposedBy: z.ZodString;
    proposedAt: z.ZodString;
    evidenceRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    changes: z.ZodArray<z.ZodObject<{
        keyPath: z.ZodString;
        newValue: z.ZodUnknown;
        rationale: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        keyPath: string;
        rationale?: string | undefined;
        newValue?: unknown;
    }, {
        keyPath: string;
        rationale?: string | undefined;
        newValue?: unknown;
    }>, "many">;
    policyCheck: z.ZodOptional<z.ZodObject<{
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
    }>>;
}, "strip", z.ZodTypeAny, {
    evidenceRefs: string[];
    entityId: string;
    proposedBy: string;
    proposedAt: string;
    changes: {
        keyPath: string;
        rationale?: string | undefined;
        newValue?: unknown;
    }[];
    policyCheck?: {
        allowedKeys: string[];
        requiresEvidence: boolean;
        stability: "volatile" | "stable" | "locked";
        cooldown: number;
        rateWindow: number;
        maxChanges: number;
        rateLimit: {
            perMinute?: number | undefined;
        };
    } | undefined;
}, {
    entityId: string;
    proposedBy: string;
    proposedAt: string;
    changes: {
        keyPath: string;
        rationale?: string | undefined;
        newValue?: unknown;
    }[];
    evidenceRefs?: string[] | undefined;
    policyCheck?: {
        allowedKeys?: string[] | undefined;
        requiresEvidence?: boolean | undefined;
        stability?: "volatile" | "stable" | "locked" | undefined;
        cooldown?: number | undefined;
        rateWindow?: number | undefined;
        maxChanges?: number | undefined;
        rateLimit?: {
            perMinute?: number | undefined;
        } | undefined;
    } | undefined;
}>;
export type ProposeChangeInput = z.infer<typeof ProposeChangeInputSchema>;
export declare const ProposeChangeOutputSchema: z.ZodObject<{
    entityId: z.ZodString;
    accepted: z.ZodBoolean;
    appliedKeys: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    errors: z.ZodDefault<z.ZodArray<z.ZodObject<{
        code: z.ZodEnum<["parse", "refine", "policy", "safety"]>;
        fieldPath: z.ZodOptional<z.ZodString>;
        message: z.ZodString;
        hint: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        code: "parse" | "refine" | "policy" | "safety";
        message: string;
        fieldPath?: string | undefined;
        hint?: string | undefined;
    }, {
        code: "parse" | "refine" | "policy" | "safety";
        message: string;
        fieldPath?: string | undefined;
        hint?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    entityId: string;
    accepted: boolean;
    appliedKeys: string[];
    errors: {
        code: "parse" | "refine" | "policy" | "safety";
        message: string;
        fieldPath?: string | undefined;
        hint?: string | undefined;
    }[];
}, {
    entityId: string;
    accepted: boolean;
    appliedKeys?: string[] | undefined;
    errors?: {
        code: "parse" | "refine" | "policy" | "safety";
        message: string;
        fieldPath?: string | undefined;
        hint?: string | undefined;
    }[] | undefined;
}>;
export type ProposeChangeOutput = z.infer<typeof ProposeChangeOutputSchema>;
//# sourceMappingURL=propose-change.d.ts.map