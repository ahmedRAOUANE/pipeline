export type PipelineErrorCode =
    | "VALIDATION_ERROR"
    | "PROCESSOR_ERROR"
    | "STORAGE_ERROR"
    | "UNKNOWN_ERROR"
    | "PLUGIN_ERROR";

export class PipelineError extends Error {
    public code: PipelineErrorCode;
    public details: Record<string, unknown> | undefined;

    constructor(
        message: string,
        code: PipelineErrorCode = "UNKNOWN_ERROR",
        details?: Record<string, unknown>
    ) {
        super(message);
        this.name = "PipelineError";
        this.code = code;
        this.details = details;
    }
}

export class ValidationError extends PipelineError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, "VALIDATION_ERROR", details);
        this.name = "ValidationError";
    }
}

export class ProcessorError extends PipelineError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, "PROCESSOR_ERROR", details);
        this.name = "ProcessorError";
    }
}

export class StorageError extends PipelineError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, "STORAGE_ERROR", details);
        this.name = "StorageError";
    }
}
export class PluginError extends PipelineError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, "PLUGIN_ERROR", details);
        this.name = "PluginError";
    }
}