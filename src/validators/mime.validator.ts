import { Validator } from "../types/pipeline";
import { ValidationError } from "../utils/errors";

export function allowedMimeTypes(types: string[]): Validator {
    return (ctx) => {
        if (!types.includes(ctx.file.mimeType)) {
            throw new ValidationError("Invalid mime type", {
                received: ctx.file.mimeType,
                allowed: types,
            });
        }
    };
}