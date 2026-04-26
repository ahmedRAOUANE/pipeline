import { Processor } from "../types/pipeline";

export const identityProcessor: Processor = async (ctx) => {
    return ctx;
};