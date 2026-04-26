import { PipelineContext, PipelineResult } from "./pipeline";
import { PipelineError } from "../utils/errors";

export type PipelineHooks = {
    onStart?: (ctx: PipelineContext) => void | Promise<void>;

    afterValidate?: (ctx: PipelineContext) => void | Promise<void>;

    afterProcess?: (ctx: PipelineContext) => void | Promise<void>;

    onError?: (error: PipelineError | Error, ctx: PipelineContext) => void | Promise<void>;

    onFinish?: (result: PipelineResult, ctx: PipelineContext) => void | Promise<void>;
};