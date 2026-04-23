import { Validator } from "../core/types";

export function maxSize(limit: number): Validator {
    return (ctx) => {
        if (ctx.file.size > limit) {
            throw new Error(`File too large: ${ctx.file.size} > ${limit}`);
        }
    };
}