import fs from 'fs';

/**
 * Extracts data from a csv file.
 *
 * @param {string} path - The path to the CSV file to extract data from.
 * @returns {Promise<ReadableStream>} A promise that resolves to a readable stream of the CSV data.
 */
export async function extractDataFromCSV(path) {
    if (!fs.existsSync(path)) {
        throw new Error(`File not found: ${path}`);
    }

    return fs.createReadStream(path);
}
