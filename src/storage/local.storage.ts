import fs from "fs/promises";
import path from "path";
import { PipelineFile, PipelineResult, Storage } from "../types/pipeline";
import { StorageError } from "../utils/errors";

export function localStorage(basePath: string): Storage {
    return {
        async save(file: PipelineFile): Promise<PipelineResult> {
            const filePath = path.join(basePath, file.filename);

            await fs.mkdir(basePath, { recursive: true });

            try {
                await fs.access(basePath, fs.constants.W_OK);
            } catch (err) {
                throw new StorageError(
                    `Storage directory is not writable: ${basePath}`,
                    { originalError: (err as Error).message }
                );
            }

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