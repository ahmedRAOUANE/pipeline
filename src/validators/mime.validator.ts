import { Validator } from "../core/types";

export function allowedMimeTypes(types: string[]): Validator {
    return (file) => {
        if (!types.includes(file.mimeType)) {
            throw new Error(`Invalid mime type: ${file.mimeType}`);
        }
    };
}