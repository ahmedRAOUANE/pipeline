import { Validator } from "../core/types";

export function maxSize(limit: number): Validator {
    return (file) => {
        if (file.size > limit) {
            throw new Error(`File too large: ${file.size} > ${limit}`);
        }
    };
}