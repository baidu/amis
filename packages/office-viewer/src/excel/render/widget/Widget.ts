/**
 * canvas 渲染中的小部件
 */

import type {Canvas} from '../Canvas';

export abstract class Widget {
  x: number;
  y: number;
  width: number;
  height: number;
  ratio: number;
  canvas: Canvas;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    canvas: Canvas
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.ratio = canvas.getRealRatio();
    this.canvas = canvas;
  }

  getClientBounding() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  updateScale() {
    this.ratio = this.canvas.getRealRatio();
  }

  updateX(x: number) {
    this.x = x;
  }

  updateY(y: number) {
    this.y = y;
  }

  /**
   * 判断某个坐标点是否在这个小部件内
   */
  isPointInWidget(x: number, y: number) {
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }

  onMouseover() {}

  onMouseout() {}

  abstract draw(): Promise<ImageData>;
}
