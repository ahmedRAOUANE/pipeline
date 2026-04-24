export { createPipeline } from "./core/pipeline";

export { localStorage } from "./storage/local.storage";

export { maxSize } from "./validators/size.validator";
export { allowedMimeTypes } from "./validators/mime.validator";

export { identityProcessor } from "./processors/identity.processor";

export type {
    PipelineFile,
    PipelineResult,
    Processor,
    Validator,
    Storage,
    PipelineContext,
} from "./core/types";

export type {
    PipelineErrorCode,
} from "./utils/errors";

export {
    PipelineError,
    ValidationError,
    ProcessorError,
    StorageError,
} from "./utils/errors";

export { PipelineBuilder } from "./core/builder"

export type {PipelinePlugin} from "./core/plugin"
