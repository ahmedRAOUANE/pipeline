import { PipelineContext } from "../types/pipeline";

export function trace(
    ctx: PipelineContext,
    event: Omit<PipelineContext["meta"]["trace"][0], "timestamp">
) {
    ctx.meta.trace.push({
        ...event,
        timestamp: Date.now(),
    });
}