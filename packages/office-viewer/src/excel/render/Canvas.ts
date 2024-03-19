/**
 * Canvas 的简单封装，方便绘制图形
 */

import {Line} from './Line';
import {drawOffscreenCanvas} from './canvas/drawOffscreenCanvas';
import {setPixelRatio} from './canvas/setPixelRatio';
import {Widget} from './widget/Widget';

export class Canvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  width: number;
  height: number;

  widgets: Map<string, Widget> = new Map();

  /**
   * 缩放比例
   */
  zoom: number = 1;

  ratio: number = 1;

  constructor(width: number, height: number, zoom: number, className: string) {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    this.width = width;
    this.height = height;
    this.ratio = setPixelRatio(this.canvas, width, height);
    this.canvas.className = className;
    this.zoom = zoom;
    this.setZoom();
    this.canvas.addEventListener('mousemove', this.handleMousemove.bind(this));
  }

  private setZoom() {
    const zoom = this.zoom;
    if (zoom && zoom !== 1) {
      this.ctx.scale(zoom, zoom);
    }
  }

  async renderWidget(widget: Widget) {
    const ratio = this.ratio * this.zoom;
    const {x, y, width, height} = widget.getClientBounding();
    const imageData = await widget.draw();
    this.ctx.putImageData(imageData, x * ratio, y * ratio);
  }

  lastTarget: Widget | null = null;

  /**
   * 鼠标移动的时候判断是否在某个 widget 上
   */
  handleMousemove(event: MouseEvent) {
    let {offsetX, offsetY} = event;
    offsetX = offsetX / this.zoom;
    offsetY = offsetY / this.zoom;

    for (const widget of this.widgets.values()) {
      if (widget.isPointInWidget(offsetX, offsetY)) {
        if (this.lastTarget && this.lastTarget !== widget) {
          this.lastTarget.onMouseout();
        } else {
          this.lastTarget = widget;
          widget.onMouseover();
        }
      }
    }
  }

  updateCursor(cursor: string) {
    this.canvas.style.cursor = cursor;
  }

  hasWidget(key: string) {
    return this.widgets.has(key);
  }

  addWidget(key: string, widget: Widget) {
    this.widgets.set(key, widget);
    this.renderWidget(widget);
  }

  getRealRatio() {
    return this.ratio * this.zoom;
  }

  getCanvasElement() {
    return this.canvas;
  }

  getContext() {
    return this.ctx;
  }

  updateZoom(zoom: number) {
    this.zoom = zoom;
    this.ctx.resetTransform();
    this.ctx.scale(this.ratio * zoom, this.ratio * zoom);
    this.clearCache();
  }

  /**
   * 清空画布
   */
  clear(width?: number, height?: number) {
    const ctx = this.ctx;
    ctx.clearRect(
      0,
      0,
      (width || this.width) / this.zoom,
      (height || this.height) / this.zoom
    );
  }

  clearRect(x: number, y: number, width: number, height: number) {
    const ctx = this.ctx;
    ctx.clearRect(x, y, width, height);
  }

  clearRectPadding(
    x: number,
    y: number,
    width: number,
    height: number,
    padding: number
  ) {
    this.clearRect(
      x + padding,
      y + padding,
      width - padding * 2,
      height - padding * 2
    );
  }

  /**
   * 绘制线条
   * @param line 线条配置
   * @param color
   * @param width
   */
  drawLine(line: Line, color: string, width = 1) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(line.x1, line.y1);
    ctx.lineTo(line.x2, line.y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  setLineDash(line: Line, segments: number[], color: string, width = 1) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(line.x1, line.y1);
    ctx.lineTo(line.x2, line.y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(segments);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  /**
   * 绘制多个线条
   * @param line 多个线条配置
   * @param width
   * @param height
   * @param color
   */
  drawLines(lines: Line[], color: string, width = 1) {
    const ctx = this.ctx;
    ctx.beginPath();
    lines.forEach(line => {
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  /**
   * 绘制字体
   * @param font
   * @param color
   * @param text
   * @param x
   * @param y
   * @param textBaseline
   */
  drawText(
    font: string,
    color = '#000',
    text: string,
    x: number,
    y: number,
    textBaseline: CanvasTextBaseline = 'middle'
  ) {
    const ctx = this.ctx;
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textBaseline = textBaseline;
    ctx.fillText(text, x, y);
  }

  /**
   * 绘制矩形
   */
  drawRect(x: number, y: number, width: number, height: number, color: string) {
    const ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }

  /**
   * 绘制带 padding 的矩形
   */
  drawRectWithPadding(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    padding: number
  ) {
    const ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.fillRect(
      x + padding,
      y + padding,
      width - padding * 2,
      height - padding * 2
    );
  }

  drawRectLinearGradientWithPadding(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    colorEnd: string,
    padding: number
  ) {
    const displayWidth = Math.max(1, width - padding * 2);
    const ctx = this.ctx;
    // gradient 坐标是全局的
    const grd = ctx.createLinearGradient(
      x + padding,
      y + padding,
      x + padding + displayWidth,
      y + padding
    );
    grd.addColorStop(0, color);
    grd.addColorStop(1, colorEnd);
    ctx.fillStyle = grd;
    ctx.fillRect(x + padding, y + padding, displayWidth, height - padding * 2);
  }

  /**
   * 绘制带透明度的矩形
   */
  drawAlphaRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    alpha: number
  ) {
    const ctx = this.ctx;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    ctx.globalAlpha = 1;
  }

  /**
   * 绘制带透明度的矩形，加 padding
   */
  drawAlphaRectPadding(
    x: number,
    y: number,
    width: number,
    height: number,
    padding: number,
    color: string,
    alpha: number
  ) {
    return this.drawAlphaRect(
      x + padding,
      y + padding,
      width - padding * 2,
      height - padding * 2,
      color,
      alpha
    );
  }

  /**
   * 绘制矩形边框
   */
  drawStrokeRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    lineWidth = 1
  ) {
    const ctx = this.ctx;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(x, y, width, height);
  }

  /**
   * 绘制带 padding 的矩形边框
   */
  drawStrokeRectPadding(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    lineWidth = 1,
    padding = 1
  ) {
    this.drawStrokeRect(
      x + padding,
      y + padding,
      width - padding * 2,
      height - padding * 2,
      color,
      lineWidth
    );
  }

  drawImage(url: string, x: number, y: number, width: number, height: number) {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      this.ctx.drawImage(img, x, y, width, height);
    };
  }

  imageCache = new Map<string, OffscreenCanvas>();

  /**
   * 绘制图片，并使用缓存
   * @param url
   * @param x
   * @param y
   * @param width
   * @param height
   */
  async drawImageWithCache(
    url: string,
    x: number,
    y: number,
    width: number,
    height: number
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const ratio = this.ratio * this.zoom;
      const cacheKey = `${url}-${width}-${height}`;
      // 根据 mdn 文档，最好是整数
      // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#avoid_floating-point_coordinates_and_use_integers_instead
      width = Math.floor(width);
      height = Math.floor(height);
      // 避免报错
      if (width === 0 || height === 0) {
        resolve();
        return;
      }
      const cache = this.imageCache.get(cacheKey);
      if (cache) {
        this.ctx.drawImage(cache, x, y, width, height);
        resolve();
        return;
      }
      const img = new Image();
      img.src = url;
      img.onload = () => {
        const imageBitmap = drawOffscreenCanvas(ratio, width, height, ctx => {
          ctx.drawImage(img, 0, 0, width, height);
        });
        this.ctx.drawImage(imageBitmap, x, y, width, height);
        this.imageCache.set(cacheKey, imageBitmap);
        resolve();
      };
      img.onerror = reject;
    });
  }

  /**
   * 运行绘制并缓存
   */
  async customDrawWithCache(
    cacheKey: string,
    x: number,
    y: number,
    width: number,
    height: number,
    func: (ctx: OffscreenCanvasRenderingContext2D, ratio: number) => void
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const ratio = this.ratio * this.zoom;
      const cache = this.imageCache.get(cacheKey);
      if (cache) {
        this.ctx.drawImage(cache, x, y, width, height);
        resolve();
        return;
      }
      const imageBitmap = drawOffscreenCanvas(ratio, width, height, ctx => {
        func(ctx, ratio);
      });
      this.ctx.drawImage(imageBitmap, x, y, width, height);
      this.imageCache.set(cacheKey, imageBitmap);
      resolve();
    });
  }

  /**
   * 清空缓存
   */
  clearCache() {
    this.imageCache.clear();
  }
}
