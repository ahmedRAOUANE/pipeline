import fs from "fs/promises";
import path from "path";
import { PipelineFile, PipelineResult, Storage } from "../types/pipeline";

export function localStorage(basePath: string): Storage {
    return {
        async save(file: PipelineFile): Promise<PipelineResult> {
            const filePath = path.join(basePath, file.filename);

            await fs.mkdir(basePath, { recursive: true });
            await fs.writeFile(filePath, file.buffer);

            return {
                url: filePath,
                path: filePath,
                size: file.size,
                metadata: {},
                meta: {
                    plugins: [], 
                    trace: [],
                },
            };
        },
    };
}