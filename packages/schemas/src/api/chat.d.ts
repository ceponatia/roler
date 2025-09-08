import { z } from 'zod';
export declare const ChatMessageSchema: z.ZodObject<{
    id: z.ZodString;
    role: z.ZodEnum<["system", "user", "assistant"]>;
    content: z.ZodString;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    role: "system" | "user" | "assistant";
    content: string;
}, {
    id: string;
    createdAt: string;
    role: "system" | "user" | "assistant";
    content: string;
}>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export declare const ChatRequestSchema: z.ZodObject<{
    messages: z.ZodArray<z.ZodObject<Pick<{
        id: z.ZodString;
        role: z.ZodEnum<["system", "user", "assistant"]>;
        content: z.ZodString;
        createdAt: z.ZodString;
    }, "role" | "content">, "strip", z.ZodTypeAny, {
        role: "system" | "user" | "assistant";
        content: string;
    }, {
        role: "system" | "user" | "assistant";
        content: string;
    }>, "many">;
    maxTokens: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    messages: {
        role: "system" | "user" | "assistant";
        content: string;
    }[];
    maxTokens?: number | undefined;
}, {
    messages: {
        role: "system" | "user" | "assistant";
        content: string;
    }[];
    maxTokens?: number | undefined;
}>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export declare const ChatResponseSchema: z.ZodObject<{
    messages: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        role: z.ZodEnum<["system", "user", "assistant"]>;
        content: z.ZodString;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        createdAt: string;
        role: "system" | "user" | "assistant";
        content: string;
    }, {
        id: string;
        createdAt: string;
        role: "system" | "user" | "assistant";
        content: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    messages: {
        id: string;
        createdAt: string;
        role: "system" | "user" | "assistant";
        content: string;
    }[];
}, {
    messages: {
        id: string;
        createdAt: string;
        role: "system" | "user" | "assistant";
        content: string;
    }[];
}>;
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
//# sourceMappingURL=chat.d.ts.map