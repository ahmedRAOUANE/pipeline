import { PipelineBuilder } from "../core/builder";

export type PipelinePluginSetup = (builder: PipelineBuilder) => void;

export type PipelinePluginFunction = PipelinePluginSetup & {
    displayName?: string;
};

export type PipelinePlugin = {
    name: string,
    version?: string,
    setup: PipelinePluginSetup,
};