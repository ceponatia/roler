import { z } from 'zod';

export const ChatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['system','user','assistant']),
  content: z.string(),
  createdAt: z.string().datetime({ offset: true })
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema.pick({ role: true, content: true })).min(1),
  maxTokens: z.number().int().positive().optional()
});
export type ChatRequest = z.infer<typeof ChatRequestSchema>;

export const ChatResponseSchema = z.object({
  messages: z.array(ChatMessageSchema)
});
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
