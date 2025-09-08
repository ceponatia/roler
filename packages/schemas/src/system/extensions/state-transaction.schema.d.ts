import { z } from 'zod';
/**
 * State Transaction Schema
 * Represents a collection of atomic operations proposed by an extension (chat phases / normalization) to be merged.
 * Aligns with spec Section 5 (State Transactions).
 */
export declare const TxOperationSchema: z.ZodEffects<z.ZodObject<{
    path: z.ZodString;
    op: z.ZodEnum<["set", "increment", "append"]>;
    value: z.ZodOptional<z.ZodUnknown>;
    delta: z.ZodOptional<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    path: string;
    op: "set" | "increment" | "append";
    value?: unknown;
    delta?: number | undefined;
}, {
    path: string;
    op: "set" | "increment" | "append";
    value?: unknown;
    delta?: number | undefined;
}>, {
    path: string;
    op: "set" | "increment" | "append";
    value?: unknown;
    delta?: number | undefined;
}, {
    path: string;
    op: "set" | "increment" | "append";
    value?: unknown;
    delta?: number | undefined;
}>;
export type TxOperation = z.infer<typeof TxOperationSchema>;
export declare const StateTransactionSchema: z.ZodObject<{
    txId: z.ZodString;
    originExtension: z.ZodString;
    operations: z.ZodReadonly<z.ZodArray<z.ZodEffects<z.ZodObject<{
        path: z.ZodString;
        op: z.ZodEnum<["set", "increment", "append"]>;
        value: z.ZodOptional<z.ZodUnknown>;
        delta: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        path: string;
        op: "set" | "increment" | "append";
        value?: unknown;
        delta?: number | undefined;
    }, {
        path: string;
        op: "set" | "increment" | "append";
        value?: unknown;
        delta?: number | undefined;
    }>, {
        path: string;
        op: "set" | "increment" | "append";
        value?: unknown;
        delta?: number | undefined;
    }, {
        path: string;
        op: "set" | "increment" | "append";
        value?: unknown;
        delta?: number | undefined;
    }>, "many">>;
    conflictPolicy: z.ZodEnum<["first-wins", "last-wins", "weighted", "resolver"]>;
    weight: z.ZodOptional<z.ZodNumber>;
    resolverId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strict", z.ZodTypeAny, {
    txId: string;
    originExtension: string;
    operations: readonly {
        path: string;
        op: "set" | "increment" | "append";
        value?: unknown;
        delta?: number | undefined;
    }[];
    conflictPolicy: "first-wins" | "last-wins" | "weighted" | "resolver";
    weight?: number | undefined;
    resolverId?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
}, {
    txId: string;
    originExtension: string;
    operations: readonly {
        path: string;
        op: "set" | "increment" | "append";
        value?: unknown;
        delta?: number | undefined;
    }[];
    conflictPolicy: "first-wins" | "last-wins" | "weighted" | "resolver";
    weight?: number | undefined;
    resolverId?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
}>;
export type StateTransaction = z.infer<typeof StateTransactionSchema>;
//# sourceMappingURL=state-transaction.schema.d.ts.map