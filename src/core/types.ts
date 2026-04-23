import { PipelineHooks } from "./hooks";

export type PipelineFile = {
    buffer: Buffer;
    filename: string;
    mimeType: string;
    size: number;
};

export type PipelineResult = {
    url: string;
    path: string;
    size: number;
};

export type Storage = {
    save(file: PipelineFile): Promise<PipelineResult>;
};

export type PipelineContext = {
    file: PipelineFile;
    metadata: Record<string, any>;
};

export type Validator = (
    ctx: PipelineContext
) => void | Promise<void>;

export type Processor = (
    ctx: PipelineContext
) => PipelineContext | Promise<PipelineContext>;

export type PipelineConfig = {
    validators?: Validator[];
    processors?: Processor[];
    storage: Storage;
    hooks?: PipelineHooks;
};
