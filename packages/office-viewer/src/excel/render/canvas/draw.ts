/**
 * 绘制圆角矩形路径
 * @param cornerRadius 圆角半径
 */

export function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  width: number,
  height: number,
  cornerRadius: number | number[]
) {
  let topLeft = 0;
  let topRight = 0;
  let bottomLeft = 0;
  let bottomRight = 0;
  if (typeof cornerRadius === 'number') {
    topLeft =
      topRight =
      bottomLeft =
      bottomRight =
        Math.min(cornerRadius, width / 2, height / 2);
  } else {
    topLeft = Math.min(cornerRadius[0] || 0, width / 2, height / 2);
    topRight = Math.min(cornerRadius[1] || 0, width / 2, height / 2);
    bottomRight = Math.min(cornerRadius[2] || 0, width / 2, height / 2);
    bottomLeft = Math.min(cornerRadius[3] || 0, width / 2, height / 2);
  }
  ctx.moveTo(topLeft, 0);
  ctx.lineTo(width - topRight, 0);
  ctx.arc(width - topRight, topRight, topRight, (Math.PI * 3) / 2, 0, false);
  ctx.lineTo(width, height - bottomRight);
  ctx.arc(
    width - bottomRight,
    height - bottomRight,
    bottomRight,
    0,
    Math.PI / 2,
    false
  );
  ctx.lineTo(bottomLeft, height);
  ctx.arc(
    bottomLeft,
    height - bottomLeft,
    bottomLeft,
    Math.PI / 2,
    Math.PI,
    false
  );
  ctx.lineTo(0, topLeft);
  ctx.arc(topLeft, topLeft, topLeft, Math.PI, (Math.PI * 3) / 2, false);
}
