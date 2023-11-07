import fs from 'fs';

const throwError = (message: string): void => {
    throw new Error(`Error: ${message}`)
}

export const zoomComparison = (fromZoom: number, toZoom: number): boolean | void => {
    const valid = fromZoom <= toZoom;
    return valid ? true : throwError(`from zoom level value cannot be bigger than to zoom level value`);
}

export const fileExists = (filePath: string): boolean | void => {
    const exists = fs.existsSync(filePath);
    return exists ? true : throwError(`file '${filePath}' is not exists`);
}