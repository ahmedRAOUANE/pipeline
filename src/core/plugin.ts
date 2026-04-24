import { PipelineBuilder } from "./builder";

export type PipelinePlugin = (builder: PipelineBuilder) => void;