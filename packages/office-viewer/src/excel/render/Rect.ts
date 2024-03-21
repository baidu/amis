/**
 * 矩形定义
 */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 判断点是否在矩形内
 */
export function pointInRect(x: number, y: number, rect: Rect) {
  return (
    x >= rect.x &&
    x <= rect.x + rect.width &&
    y >= rect.y &&
    y <= rect.y + rect.height
  );
}

/**
 * 判断两个矩形是否相交
 */
export function rectIntersect(rect1: Rect, rect2: Rect) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}
