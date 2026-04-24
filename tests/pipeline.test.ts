import { createPipeline, localStorage } from "media-pipeline";
import { PipelineBuilder } from "../src/core/builder";

function debugPlugin() {
    return (builder: PipelineBuilder) => {
        builder.addValidator(async (ctx: any) => {
            console.log("validator throws");
            throw new Error("boom");
        });

        builder.addProcessor(async (ctx: any) => {
            console.log("⚙️ processor executed");
            return ctx;
        });

        builder.mergeHooks({
            onStart: (ctx: any) => {
                console.log("🚀 onStart");
            },
            afterValidate: () => {
                console.log("🔍 afterValidate");
            },
            afterProcess: () => {
                console.log("⚙️ afterProcess");
            },
            onFinish: () => {
                console.log("✅ onFinish");
            },
            onError: () => {
                console.log("❌ onError");
            },
        });
    };
}

function pluginA() {
    return (builder: any) => {
        builder.mergeHooks({
            onStart: () => console.log("A start"),
        });
    };
}

function pluginB() {
    return (builder: any) => {
        builder.mergeHooks({
            onStart: () => console.log("B start"),
        });
    };
}

function processorPlugin() {
    return (builder: any) => {
        builder.addProcessor(async (ctx: any) => {
            ctx.metadata.step1 = true;
            return ctx;
        });

        builder.addProcessor(async (ctx: any) => {
            ctx.metadata.step2 = true;
            return ctx;
        });
    };
}

const file = {
    buffer: Buffer.from("ok"),
    filename: "test.png",
    mimeType: "image/png",
    size: 2,
};

const pipeline = createPipeline({
    storage: localStorage("./tests/uploads"),
})
    .use(processorPlugin()).process(file).then((res: any) => res);

console.log("RESULT:", pipeline);