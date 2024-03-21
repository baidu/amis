import {Rect} from '../Rect';

/**
 * Drawing 渲染基类
 */
export class BaseDrawingRender {
  drawingContainer: HTMLElement;

  constructor(
    container: HTMLElement,
    displayRect: Rect,
    gid: string,
    className: string
  ) {
    const picContainer = document.createElement('div');
    picContainer.className = className;
    picContainer.dataset.gid = gid;
    this.drawingContainer = picContainer;
    this.updatePosition(displayRect);
    container.appendChild(picContainer);
  }

  hide() {
    this.drawingContainer.style.display = 'none';
  }

  show() {
    this.drawingContainer.style.display = 'block';
  }

  updatePosition(displayRect: Rect) {
    const {x, y, width, height} = displayRect;
    this.drawingContainer.style.left = `${x}px`;
    this.drawingContainer.style.top = `${y}px`;
    this.drawingContainer.style.width = `${width}px`;
    this.drawingContainer.style.height = `${height}px`;
  }
}
