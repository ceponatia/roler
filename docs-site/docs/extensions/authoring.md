# Roler Extensions Authoring Guide

This guide helps you create a minimal extension that works with the current preview of the `@roler/extensions` API.

## Quick checklist

- package.json includes a `rolerExtension.entry` pointing to your built ESM file.
- Your entry module exports a `manifest` object that matches `ExtensionManifest`.
- Keep hooks small and fast; honor budgets.
- Test locally with `EXTENSIONS_ENABLED=true`.

## package.json

```json
{
	"name": "my-extension",
	"version": "0.1.0",
	"type": "module",
	"rolerExtension": { "entry": "dist/extension.js" }
}
```

## Entry file (dist/extension.js)

Export a manifest that passes the shared schema (validated by the host):

```js
export const manifest = {
	id: "my-extension",
	name: "My Extension",
	version: "0.1.0",
	description: "Example",
	coreApiRange: "^1.0.0",
	capabilities: ["demo"],
	// Optional chat hooks advertised via names; host may call conventionally
	chatHooks: { preChatTurn: ["preChatTurn"] },
	// Optional budgets per hook (advisory)
	hookBudgets: { preChatTurn: { maxLatencyMs: 40 } },
	// Operational defaults
	killSwitchEnabled: true,
	concurrencyLimit: 4,
};

// Optional hook function(s)
export async function preChatTurn(ctx) {
	// Keep it fast; avoid blocking I/O
	return { ok: true, value: {} };
}
```

## Budgets

- Defaults are provided by the host via `DefaultHookBudgets`.
- You can override budgets per hook in your manifest with `hookBudgets`.
- Budgets are advisory; overruns are recorded via metrics and may be truncated/soft-timed-out by the host.

## Metrics

Hosts may inject a metrics sink using `setMetricsSink`. You don’t need to implement this; just keep hooks within budget to avoid `onBudgetOverrun` events.

## Feature flag

Extensions only load when `EXTENSIONS_ENABLED` parses to true. Use `.env` in dev:

```env
EXTENSIONS_ENABLED=true
```

## Publishing

- Build ESM (`type: module`).
- Do not deep-import internal core packages.
- Declare only stable peer ranges you require (avoid overly strict ranges).
