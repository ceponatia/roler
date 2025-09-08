import { z } from 'zod';
export declare const UserSchema: z.ZodObject<{
    id: z.ZodBranded<z.ZodString, "Ulid">;
    email: z.ZodString;
    displayName: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    roles: z.ZodDefault<z.ZodArray<z.ZodEnum<["gm", "player", "admin"]>, "many">>;
}, "strip", z.ZodTypeAny, {
    updatedAt: string;
    id: string & z.BRAND<"Ulid">;
    createdAt: string;
    email: string;
    displayName: string;
    roles: ("gm" | "player" | "admin")[];
}, {
    updatedAt: string;
    id: string;
    createdAt: string;
    email: string;
    displayName: string;
    roles?: ("gm" | "player" | "admin")[] | undefined;
}>;
export type User = z.infer<typeof UserSchema>;
//# sourceMappingURL=user.d.ts.map