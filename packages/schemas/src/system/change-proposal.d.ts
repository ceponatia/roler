import { z } from 'zod';
export declare const ChangeProposalSchema: z.ZodObject<{
    entityId: z.ZodBranded<z.ZodString, "Ulid">;
    proposedBy: z.ZodBranded<z.ZodString, "Ulid">;
    proposedAt: z.ZodString;
    rationale: z.ZodOptional<z.ZodString>;
    evidenceRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    diff: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
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
    moderatorOverride: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    evidenceRefs: string[];
    entityId: string & z.BRAND<"Ulid">;
    diff: Record<string, unknown>;
    proposedBy: string & z.BRAND<"Ulid">;
    proposedAt: string;
    moderatorOverride: boolean;
    rationale?: string | undefined;
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
    evidenceRefs?: string[] | undefined;
    rationale?: string | undefined;
    diff?: Record<string, unknown> | undefined;
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
    moderatorOverride?: boolean | undefined;
}>;
export type ChangeProposal = z.infer<typeof ChangeProposalSchema>;
//# sourceMappingURL=change-proposal.d.ts.map