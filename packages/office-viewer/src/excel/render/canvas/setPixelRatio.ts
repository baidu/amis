/**
 * 设置像素比来支持高清屏幕，参考 Mozilla 里的文档
 */
export function setPixelRatio(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
) {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.scale(ratio, ratio);
  }
  return ratio;
}
