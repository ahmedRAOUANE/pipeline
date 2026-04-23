import { Validator } from "../core/types";

export function allowedMimeTypes(types: string[]): Validator {
    return (ctx) => {
        if (!types.includes(ctx.file.mimeType)) {
            throw new Error(`Invalid mime type: ${ctx.file.mimeType}`);
        }
    };
}