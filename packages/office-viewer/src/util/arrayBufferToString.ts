export function arrayBufferToString(
  buffer: ArrayBuffer,
  charset: string = 'utf-8'
) {
  const dec = new TextDecoder(charset);
  return dec.decode(buffer);
}
