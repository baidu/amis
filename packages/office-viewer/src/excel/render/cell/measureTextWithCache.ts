/**
 * 缓存文本大小，避免重复计算
 */
const textSizeCache: Map<string, TextSize> = new Map();

export interface TextSize {
  /**
   * 文本宽度，目前主要用这个
   */
  width: number;
  /**
   * 实际宽度，这个在斜体的时候比 width 长，文本为数字的时候又比 width 短
   */
  boundingWidth: number;
  /**
   * 文本高度
   */
  height: number;
  /**
   * 字体高度
   */
  fontHeight: number;
}
/**
 * 测量字体大小，这个会计算最终真实大小及字体大小，带缓存，需要自己 save state
 */

export function measureTextWithCache(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  font: string,
  text: string
): TextSize {
  const key = `${font}---${text}`;
  if (textSizeCache.has(key)) {
    return textSizeCache.get(key)!;
  }
  ctx.font = font;
  const measureSize = ctx.measureText(text);
  const size = {
    width: measureSize.width,
    boundingWidth:
      Math.abs(measureSize.actualBoundingBoxRight) +
      Math.abs(measureSize.actualBoundingBoxLeft),
    height:
      measureSize.actualBoundingBoxAscent +
      measureSize.actualBoundingBoxDescent,
    fontHeight:
      measureSize.fontBoundingBoxAscent + measureSize.fontBoundingBoxDescent
  };
  textSizeCache.set(key, size);
  return size;
}

export function inValidTextSizeCache() {
  textSizeCache.clear();
}
