import { z } from 'zod';
export declare const PermissionSchema: z.ZodObject<{
    id: z.ZodBranded<z.ZodString, "Ulid">;
    userId: z.ZodBranded<z.ZodString, "Ulid">;
    gameId: z.ZodOptional<z.ZodBranded<z.ZodString, "Ulid">>;
    scope: z.ZodEnum<["read", "write", "moderate", "admin"]>;
    grantedBy: z.ZodBranded<z.ZodString, "Ulid">;
    grantedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string & z.BRAND<"Ulid">;
    scope: "admin" | "read" | "write" | "moderate";
    userId: string & z.BRAND<"Ulid">;
    grantedBy: string & z.BRAND<"Ulid">;
    grantedAt: string;
    gameId?: (string & z.BRAND<"Ulid">) | undefined;
}, {
    id: string;
    scope: "admin" | "read" | "write" | "moderate";
    userId: string;
    grantedBy: string;
    grantedAt: string;
    gameId?: string | undefined;
}>;
export type Permission = z.infer<typeof PermissionSchema>;
//# sourceMappingURL=permission.d.ts.map