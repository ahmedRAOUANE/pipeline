// Inside local.storage.ts, before the export
import { randomBytes } from "crypto";
import path from "path";

export function sanitizeFilename(filename: string): string {
    let sanitized = filename
        .replace(/[/\\?%*:|"<>]/g, '-')
        .replace(/\0/g, '')
        .trim();
    if (!sanitized) sanitized = "file";
    return sanitized;
}

// old version
// export function generateStoredName(originalName: string, mimeType: string): string {
//     // 1. Extract extension from original name
//     let ext = path.extname(originalName).toLowerCase();

//     // 2. If no extension, try to infer from mime type
//     if (!ext && mimeType) {
//         const mimeToExt: Record<string, string> = {
//             'image/jpeg': '.jpg',
//             'image/png': '.png',
//             'image/gif': '.gif',
//             'image/webp': '.webp',
//             'text/plain': '.txt',
//             'application/pdf': '.pdf',
//             // add more as needed
//         };
//         ext = mimeToExt[mimeType] || '';
//     }

//     // 3. Generate unique base: timestamp + random bytes
//     const timestamp = Date.now();
//     const random = randomBytes(4).toString('hex'); // 8 hex chars
//     const base = `${timestamp}-${random}`;

//     return `${base}${ext}`;
// }
export function generateStoredName(originalName: string, mimeType: string): string {
    const originalExt = path.extname(originalName).toLowerCase();
    const safeExtPattern = /^\.[a-z0-9]+$/i;
    const ext = safeExtPattern.test(originalExt) ? originalExt : '';

    let finalExt = ext;
    if (!finalExt && mimeType) {
        const mimeToExt: Record<string, string> = {
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'image/gif': '.gif',
            'image/webp': '.webp',
            'text/plain': '.txt',
            'application/pdf': '.pdf',
        };
        finalExt = mimeToExt[mimeType] || '';
    }

    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${random}${finalExt}`;
}