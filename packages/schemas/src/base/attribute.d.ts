import { z } from 'zod';
export declare const AttributeValueSchema: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodEffects<z.ZodDate, string, Date>, z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>, z.ZodArray<z.ZodString, "many">, z.ZodRecord<z.ZodString, z.ZodUnknown>]>;
export type AttributeValue = z.infer<typeof AttributeValueSchema>;
export declare const AttributeSchema: z.ZodObject<{
    keyPath: z.ZodString;
    value: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodEffects<z.ZodDate, string, Date>, z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>, z.ZodArray<z.ZodString, "many">, z.ZodRecord<z.ZodString, z.ZodUnknown>]>;
    confidence: z.ZodDefault<z.ZodNumber>;
    lastUpdatedBy: z.ZodOptional<z.ZodBranded<z.ZodString, "Ulid">>;
    updatedAt: z.ZodDefault<z.ZodString>;
    evidenceRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    value: string | number | boolean | string[] | [number, number] | Record<string, unknown>;
    keyPath: string;
    confidence: number;
    updatedAt: string;
    evidenceRefs: string[];
    lastUpdatedBy?: (string & z.BRAND<"Ulid">) | undefined;
}, {
    value: string | number | boolean | Date | string[] | [number, number] | Record<string, unknown>;
    keyPath: string;
    confidence?: number | undefined;
    lastUpdatedBy?: string | undefined;
    updatedAt?: string | undefined;
    evidenceRefs?: string[] | undefined;
}>;
export type Attribute = z.infer<typeof AttributeSchema>;
//# sourceMappingURL=attribute.d.ts.map