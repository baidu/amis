export function string2regExp(
  value: string,
  caseSensitive = false,
  globalSearch = false
) {
  if (typeof value !== 'string') {
    throw new TypeError('Expected a string');
  }

  return new RegExp(
    value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d'),
    `${!caseSensitive ? 'i' : ''}${globalSearch ? 'g' : ''}`
  );
}
