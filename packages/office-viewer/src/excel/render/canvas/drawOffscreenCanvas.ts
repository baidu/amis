/**
 * 使用 OffscreenCanvas 渲染后获取内容
 * @param func 执行的调用函数
 * @returns
 */
export function drawOffscreenCanvas(
  ratio: number,
  width: number,
  height: number,
  func: (ctx: OffscreenCanvasRenderingContext2D) => void
) {
  const cacheCanvas = new OffscreenCanvas(width * ratio, height * ratio);
  const cacheCtx = cacheCanvas.getContext(
    '2d'
  )! as OffscreenCanvasRenderingContext2D;
  cacheCtx.scale(ratio, ratio);
  func(cacheCtx);
  return cacheCanvas;
}
