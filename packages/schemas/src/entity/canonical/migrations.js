// Placeholder migration utilities for canonical entity evolution.
// Future: implement version-based transforms.
import { CanonicalEntitySchema } from './index.js';
export function migrateCanonicalV1ToLatest(input) {
    const parsed = CanonicalEntitySchema.parse(input);
    // No-op for now; in future apply structural changes.
    return parsed;
}
//# sourceMappingURL=migrations.js.map