/**
 * Base64 decoding function
 * Decodes a Base64 string
 */
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

class InvalidCharacterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCharacterError';
  }
}

export function atob(input: string): string {
  const str = String(input).replace(/=+$/, '');

  if (str.length % 4 === 1) {
    throw new InvalidCharacterError(
      "'atob' failed: The string to be decoded is not correctly encoded."
    );
  }

  let output = '';
  let bc = 0;
  let bs = 0;
  let buffer: number;
  let idx = 0;

  while ((buffer = chars.indexOf(str.charAt(idx++))) !== -1) {
    if (~buffer) {
      bs = bc % 4 ? bs * 64 + buffer : buffer;
      if (bc++ % 4) {
        output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6)));
      }
    }
  }

  return output;
}

export default atob;
