/**
 * Extension Manifest Schema
 * Defines the shape of an extension's declarative manifest loaded at startup.
 * Fields mirror the technical spec (R-001) Section 4.
 *
 * Example:
 * const manifest: ExtensionManifest = {
 *   id: 'relationship-score-normalizer',
 *   name: 'Relationship Score Normalizer',
 *   version: '0.1.0',
 *   description: 'Adjusts relationship bond metrics after moderated chat turns',
 *   coreApiRange: '^1.0.0',
 *   capabilities: ['normalize:relationship', 'chat:postModeration'],
 *   hooks: { normalize: ['normalizeRelationship'] },
 *   chatHooks: { postModeration: ['postModerationAdjust'] },
 *   priority: 10,
 *   hookBudgets: { postModerationAdjust: { maxLatencyMs: 25 } },
 *   concurrencyLimit: 4,
 *   killSwitchEnabled: true,
 *   stateTransactionSupport: true
 * };
 */
import { z } from 'zod';

// Reusable regexes / constants
// Both patterns are linear-time (no nested quantifiers / backtracking hotspots).
// Length caps added to avoid unbounded input size even though patterns are safe.
const MAX_ID_LENGTH = 64;
const MAX_HOOK_NAME_LENGTH = 64;
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/; // lower-kebab, no leading/trailing dash

export const ExtensionPeerSchema = z.object({
  id: z.string().regex(idPattern, 'peer id must be lower-kebab'),
  range: z.string().min(1, 'semver range required'),
}).strict();

export type ExtensionPeer = z.infer<typeof ExtensionPeerSchema>;

const hookNamePattern = /^[A-Za-z_][A-Za-z0-9_]*$/;

// Budget schema: advisory per-hook token/time limits
export const HookBudgetSchema = z.object({
  maxTokens: z.number().int().positive().optional(),
  maxLatencyMs: z.number().int().positive().optional(),
}).strict();
export type HookBudget = z.infer<typeof HookBudgetSchema>;

export const ExtensionManifestSchema = z.object({
  id: z.string()
    .min(1)
    .max(MAX_ID_LENGTH)
    .regex(idPattern, 'id must be lower-kebab'),
  name: z.string().min(1),
  version: z.string().min(1),
  description: z.string().min(1),
  license: z.string().optional(),
  author: z.string().optional(),
  coreApiRange: z.string().min(1),
  peerExtensions: z.array(ExtensionPeerSchema).default([]).readonly(),
  capabilities: z.array(z.string()).default([]).readonly(),
  hooks: z
    .object({
      normalize: z.array(z.string().max(MAX_HOOK_NAME_LENGTH).regex(hookNamePattern)).optional(),
      retrievalEnrichment: z.array(z.string().max(MAX_HOOK_NAME_LENGTH).regex(hookNamePattern)).optional(),
      preSaveValidate: z.array(z.string().max(MAX_HOOK_NAME_LENGTH).regex(hookNamePattern)).optional(),
    })
    .partial()
    .optional(),
  priority: z.number().int().default(0),
  unsafeCapabilities: z.array(z.string()).optional().readonly(),
  configSchema: z.string().optional(),
  chatHooks: z
    .object({
      preChatTurn: z.array(z.string().max(MAX_HOOK_NAME_LENGTH).regex(hookNamePattern)).optional(),
      postModelDraft: z.array(z.string().max(MAX_HOOK_NAME_LENGTH).regex(hookNamePattern)).optional(),
      postModeration: z.array(z.string().max(MAX_HOOK_NAME_LENGTH).regex(hookNamePattern)).optional(),
      prePersistTurn: z.array(z.string().max(MAX_HOOK_NAME_LENGTH).regex(hookNamePattern)).optional(),
    })
    .partial()
    .optional(),
  hookBudgets: z
    .record(
      z.string().max(MAX_HOOK_NAME_LENGTH).regex(hookNamePattern),
      HookBudgetSchema
    )
    .optional(),
  concurrencyLimit: z.number().int().positive().default(4),
  killSwitchEnabled: z.boolean().default(true),
  dataClassScopes: z.array(z.string()).optional().readonly(),
  stateTransactionSupport: z.boolean().default(false),
}).strict();

export type ExtensionManifest = z.infer<typeof ExtensionManifestSchema>;

// Deliberately separate semantic validation (semver ranges, etc.) to a helper function outside pure schema.
