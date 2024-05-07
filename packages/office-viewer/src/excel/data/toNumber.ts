export function toNumber(num: string | number | boolean | undefined): number {
  if (num === '' || num === undefined) {
    return 0;
  }
  if (typeof num === 'boolean') {
    return num ? 1 : 0;
  }
  if (typeof num === 'string') {
    return parseFloat(num);
  }
  return num;
}
