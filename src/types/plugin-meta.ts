export type PluginMeta = {
    name: string;
    version?: string | undefined;
    priority?: number;
};

export type PluginTraceEvent = {
    plugin: string;
    stage: "validator" | "processor" | "hook" | "storage";
    message: string;
    timestamp: number;
    duration?: number;
};

export type PipelineMeta = {
    plugins: PluginMeta[];
    trace: PluginTraceEvent[];
};