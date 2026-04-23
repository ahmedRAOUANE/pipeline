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

// old version
// export type Validator = (file: PipelineFile) => void | Promise<void>;

// export type Processor = (
//     file: PipelineFile
// ) => PipelineFile | Promise<PipelineFile>;

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
