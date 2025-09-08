import { z } from 'zod';
export declare const PromptTemplateCanonicalSchema: z.ZodObject<{
    kind: z.ZodLiteral<"promptTemplate">;
    template: z.ZodString;
    variables: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    id: z.ZodBranded<z.ZodString, "Ulid">;
    lineageId: z.ZodBranded<z.ZodString, "Ulid">;
    version: z.ZodNumber;
    status: z.ZodEnum<["draft", "published", "archived"]>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    createdBy: z.ZodBranded<z.ZodString, "Ulid">;
    updatedBy: z.ZodBranded<z.ZodString, "Ulid">;
    source: z.ZodOptional<z.ZodString>;
    contentRating: z.ZodDefault<z.ZodEnum<["g", "pg", "pg13", "r", "nc17"]>>;
    blockedTags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    ageCheck: z.ZodDefault<z.ZodBoolean>;
    attributes: z.ZodDefault<z.ZodArray<z.ZodObject<{
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
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    status: "draft" | "published" | "archived";
    updatedAt: string;
    id: string & z.BRAND<"Ulid">;
    lineageId: string & z.BRAND<"Ulid">;
    version: number;
    kind: "promptTemplate";
    createdAt: string;
    createdBy: string & z.BRAND<"Ulid">;
    updatedBy: string & z.BRAND<"Ulid">;
    contentRating: "g" | "pg" | "pg13" | "r" | "nc17";
    blockedTags: string[];
    ageCheck: boolean;
    attributes: {
        value: string | number | boolean | string[] | [number, number] | Record<string, unknown>;
        keyPath: string;
        confidence: number;
        updatedAt: string;
        evidenceRefs: string[];
        lastUpdatedBy?: (string & z.BRAND<"Ulid">) | undefined;
    }[];
    template: string;
    variables: string[];
    source?: string | undefined;
}, {
    status: "draft" | "published" | "archived";
    updatedAt: string;
    id: string;
    lineageId: string;
    version: number;
    kind: "promptTemplate";
    createdAt: string;
    createdBy: string;
    updatedBy: string;
    template: string;
    source?: string | undefined;
    contentRating?: "g" | "pg" | "pg13" | "r" | "nc17" | undefined;
    blockedTags?: string[] | undefined;
    ageCheck?: boolean | undefined;
    attributes?: {
        value: string | number | boolean | Date | string[] | [number, number] | Record<string, unknown>;
        keyPath: string;
        confidence?: number | undefined;
        lastUpdatedBy?: string | undefined;
        updatedAt?: string | undefined;
        evidenceRefs?: string[] | undefined;
    }[] | undefined;
    variables?: string[] | undefined;
}>;
export type PromptTemplateCanonical = z.infer<typeof PromptTemplateCanonicalSchema>;
//# sourceMappingURL=prompt-template.d.ts.map