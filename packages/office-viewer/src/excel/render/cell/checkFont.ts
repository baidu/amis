import {isFontAvailable} from '../../../util/isFontAvailable';

const FontAvailableCache = new Map<string, boolean>();

/**
 * 检查字体是否存在，这里主要是为了加缓存和 warning
 */
export function checkFont(font: string) {
  if (FontAvailableCache.has(font)) {
    return FontAvailableCache.get(font);
  }
  const result = isFontAvailable(font);
  FontAvailableCache.set(font, result);
  return result;
}

/**
 * 获取所有不可用的字体
 */
export function getAllNotAvailableFont(): string[] {
  return Array.from(FontAvailableCache.entries())
    .filter(([_, v]) => v === false)
    .map(([k]) => k);
}
