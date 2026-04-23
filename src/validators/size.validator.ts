import { Validator } from "../core/types";
import { ValidationError } from "../utils/errors";

export function maxSize(limit: number): Validator {
    return (ctx) => {
        if (ctx.file.size > limit) {
            throw new ValidationError("File too large", {
                size: ctx.file.size,
                limit,
            });
        }
    };
}