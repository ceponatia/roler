import { z } from 'zod';
export const ChatMessageSchema = z.object({
    id: z.string(),
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string(),
    createdAt: z.string().datetime({ offset: true })
});
export const ChatRequestSchema = z.object({
    messages: z.array(ChatMessageSchema.pick({ role: true, content: true })).min(1),
    maxTokens: z.number().int().positive().optional()
});
export const ChatResponseSchema = z.object({
    messages: z.array(ChatMessageSchema)
});
//# sourceMappingURL=chat.js.map