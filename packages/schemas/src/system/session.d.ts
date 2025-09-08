import { z } from 'zod';
export declare const SessionSchema: z.ZodObject<{
    id: z.ZodBranded<z.ZodString, "Ulid">;
    userId: z.ZodBranded<z.ZodString, "Ulid">;
    token: z.ZodString;
    createdAt: z.ZodString;
    expiresAt: z.ZodString;
    lastActiveAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string & z.BRAND<"Ulid">;
    createdAt: string;
    userId: string & z.BRAND<"Ulid">;
    token: string;
    expiresAt: string;
    lastActiveAt?: string | undefined;
}, {
    id: string;
    createdAt: string;
    userId: string;
    token: string;
    expiresAt: string;
    lastActiveAt?: string | undefined;
}>;
export type Session = z.infer<typeof SessionSchema>;
//# sourceMappingURL=session.d.ts.map