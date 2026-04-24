import { PipelineBuilder } from "../src/core/builder";

const plugin = (builder: PipelineBuilder) => {
    builder.addValidator((ctx) => {
        ctx.metadata.test = true;
    });
};

const builder = new PipelineBuilder({
    storage: {} as any,
});

plugin(builder);

console.log(builder.validators.length); // should be 1