import { z } from 'zod';
import { ErrorCodeEnum } from '../base/enums.js';
export const ErrorSchema = z.object({
    code: ErrorCodeEnum,
    fieldPath: z.string().optional(),
    message: z.string(),
    hint: z.string().optional()
});
//# sourceMappingURL=error.js.map