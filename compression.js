function encodeBase62(arrayBuffer) { let result = []; const uint8Array = new Uint8Array(arrayBuffer); let value = BigInt(0); for (const byte of uint8Array) { value = (value << 8n) + BigInt(byte); } while (value > 0) { const remainder = value % 62n; result.push('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'[Number(remainder)]); value = value / 62n; } return result.reverse().join('') || '0'; };
function decodeBase62(base62Str) { let value = BigInt(0); for (const char of base62Str) { const index = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.indexOf(char); if (index === -1) throw new Error('Invalid Base62 character'); value = (value * 62n) + BigInt(index); } const byteArray = []; while (value > 0) { byteArray.push(Number(value % 256n)); value = value / 256n; } return new Uint8Array(byteArray.reverse()); };
async function concatUint8Arrays(uint8arrays) { const totalLength = uint8arrays.reduce((acc, array) => acc + array.length, 0); const result = new Uint8Array(totalLength); let offset = 0; for (const array of uint8arrays) { result.set(array, offset); offset += array.length; } return result; };
/* Compression Main Function */
async function compress(str) {
    const stream = new Blob([str]).stream();
    const compressedStream = stream.pipeThrough(new CompressionStream("deflate-raw"));
    const chunks = await Array.fromAsync(compressedStream);
    const compressedBytes = await concatUint8Arrays(chunks);
    return encodeBase62(compressedBytes.buffer);
};
/* Decompress Main Function */
async function decompress(encodedStr) {
    const compressedBytes = decodeBase62(encodedStr);
    const stream = new Blob([compressedBytes]).stream();
    const decompressedStream = stream.pipeThrough(new DecompressionStream("deflate-raw"));
    const chunks = await Array.fromAsync(decompressedStream);
    const stringBytes = await concatUint8Arrays(chunks);
    return new TextDecoder().decode(stringBytes);
};

/* String to Compress */
const str = "This string is AI generated to test JavaScript compression. The words are randomly selected to simulate real-world usage in code and applications. The goal is to examine how different compression algorithms handle various text patterns and word structures. JavaScript compression is essential for optimizing the performance of web pages.";

/* Compress and Decompress the string */
const compressedStr = await compress(str);
console.log(compressedStr, compressedStr.length);
const decompressed = await decompress(compressedStr);
console.log(decompressed, decompressed.length);