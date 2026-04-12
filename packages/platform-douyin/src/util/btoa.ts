/**
 * Base64 encoding function
 * Encodes a string to Base64
 */
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

class InvalidCharacterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCharacterError';
  }
}

export function btoa(input: string): string {
  const str = String(input);
  let output = '';
  let block = 0;
  let charCode: number;
  let idx = 0;
  let map = chars;

  while (str.charAt(idx | 0) || (map = '=', idx % 1)) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 255) {
      throw new InvalidCharacterError(
        "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
      );
    }
    block = (block << 8) | charCode;
    output += map.charAt(63 & (block >> (8 - (idx % 1) * 8)));
  }

  return output;
}

export default btoa;
