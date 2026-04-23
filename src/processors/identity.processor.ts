import { Processor } from "../core/types";

export const identityProcessor: Processor = async (file) => {
    return file;
};