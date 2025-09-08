import { z } from 'zod';
export declare const StateChangeEventSchema: z.ZodObject<{
    id: z.ZodBranded<z.ZodString, "Ulid">;
    entityId: z.ZodBranded<z.ZodString, "Ulid">;
    actorId: z.ZodBranded<z.ZodString, "Ulid">;
    occurredAt: z.ZodString;
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
}, "strip", z.ZodTypeAny, {
    evidenceRefs: string[];
    id: string & z.BRAND<"Ulid">;
    entityId: string & z.BRAND<"Ulid">;
    actorId: string & z.BRAND<"Ulid">;
    occurredAt: string;
    diff: Record<string, unknown>;
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
    id: string;
    entityId: string;
    actorId: string;
    occurredAt: string;
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
}>;
export type StateChangeEvent = z.infer<typeof StateChangeEventSchema>;
//# sourceMappingURL=state-change-event.d.ts.map