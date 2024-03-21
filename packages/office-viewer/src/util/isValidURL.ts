/**
 * 判断是否是 URL
 */
export function isValidURL(str: string) {
  if (!str) {
    return false;
  }

  let url;

  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}
