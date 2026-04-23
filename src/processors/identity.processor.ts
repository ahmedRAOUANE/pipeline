import { Processor } from "../core/types";

export const identityProcessor: Processor = async (ctx) => {
    return ctx;
};