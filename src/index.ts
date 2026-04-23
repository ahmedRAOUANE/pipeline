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
} from "./core/types";