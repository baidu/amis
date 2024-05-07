/**
 * 去掉字符串两边的引号
 */
export function removeQuote(str: string): string {
  if (str[0] === '"' && str[str.length - 1] === '"') {
    return str.slice(1, -1).replace(/""/g, '"');
  }
  if (str[0] === "'" && str[str.length - 1] === "'") {
    return str.slice(1, -1).replace(/''/g, "'");
  }
  return str;
}
