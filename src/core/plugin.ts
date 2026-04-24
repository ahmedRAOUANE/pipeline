import { PipelineBuilder } from "./builder";

export type PipelinePlugin = {
    name: string,
    version?: string,
    setup: (builder: PipelineBuilder) => void
};