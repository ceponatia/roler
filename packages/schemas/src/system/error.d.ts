import { z } from 'zod';
export declare const ErrorSchema: z.ZodObject<{
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
}>;
export type SchemaError = z.infer<typeof ErrorSchema>;
//# sourceMappingURL=error.d.ts.map