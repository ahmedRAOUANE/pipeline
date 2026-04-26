import fs from "fs/promises";
import path from "path";
import { PipelineFile, PipelineResult, Storage } from "../types/pipeline";
import { StorageError } from "../utils/errors";
import { generateStoredName, sanitizeFilename } from "../utils/file";

export function localStorage(basePath: string): Storage {
    return {
        async save(file: PipelineFile): Promise<PipelineResult> {
            const originalName = sanitizeFilename(file.filename);
            const storedName = generateStoredName(originalName, file.mimeType);
            const filePath = path.join(basePath, storedName);

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

            // this is only for local storage - this might be changed based on the library/framework using it
            const url = `file://${path.resolve(filePath)}`;

            return {
                url,
                path: filePath,
                size: file.size,
                originalName,
                storedName,
                mimeType: file.mimeType,
                provider: "local",
                metadata: {},
                meta: {
                    plugins: [], 
                    trace: [],
                },
            };
        },
    };
}