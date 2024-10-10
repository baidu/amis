import {H} from '../../../util/H';

/**
 * 用于缩放 drawing 的边框，目前没实现编辑功能所以还不能用，只是展示
 */
export class ResizeBox {
  /**
   * 边框元素
   */
  box: HTMLElement;

  /**
   * 左上角的操作节点
   */
  topLeft: HTMLElement;

  /**
   * 顶部的操作节点
   */
  top: HTMLElement;

  /**
   * 右上角的操作节点
   */
  topRight: HTMLElement;

  /**
   * 左侧的操作节点
   */
  left: HTMLElement;

  /**
   * 右侧的操作节点
   */
  right: HTMLElement;

  /**
   * 左下角的操作节点
   */
  bottomLeft: HTMLElement;

  /**
   * 底部的操作节点
   */
  bottom: HTMLElement;

  /**
   * 右下角的操作节点
   */
  bottomRight: HTMLElement;

  /**
   * 控制节点的大小，需要和 CSS 里保持一致
   */
  controllerSize = 14;

  constructor(container: HTMLElement) {
    this.box = H('div', {
      className: 'ov-excel-resize-box',
      parent: container
    });

    this.topLeft = H('div', {
      className: 'ov-excel-resize-box-control',
      parent: this.box
    });

    this.top = H('div', {
      className: 'ov-excel-resize-box-control',
      parent: this.box
    });

    this.topRight = H('div', {
      className: 'ov-excel-resize-box-control',
      parent: this.box
    });

    this.left = H('div', {
      className: 'ov-excel-resize-box-control',
      parent: this.box
    });

    this.right = H('div', {
      className: 'ov-excel-resize-box-control',
      parent: this.box
    });

    this.bottomLeft = H('div', {
      className: 'ov-excel-resize-box-control',
      parent: this.box
    });

    this.bottom = H('div', {
      className: 'ov-excel-resize-box-control',
      parent: this.box
    });

    this.bottomRight = H('div', {
      className: 'ov-excel-resize-box-control',
      parent: this.box
    });

    // 默认隐藏，点击的时候才开启
    this.hide();
  }

  /**
   * 更新位置信息
   */
  updatePosition(x: number, y: number, width: number, height: number) {
    this.box.style.display = 'block';
    this.box.style.left = `${x}px`;
    this.box.style.top = `${y}px`;
    this.box.style.width = `${width}px`;
    this.box.style.height = `${height}px`;

    this.topLeft.style.left = '-7px';
    this.topLeft.style.top = '-7px';

    this.top.style.left = `${width / 2 - this.controllerSize / 2}px`;
    this.top.style.top = '-7px';

    this.topRight.style.right = '-7px';
    this.topRight.style.top = '-7px';

    this.left.style.left = '-7px';
    this.left.style.top = `${height / 2 - this.controllerSize / 2}px`;

    this.right.style.right = '-7px';
    this.right.style.top = `${height / 2 - this.controllerSize / 2}px`;

    this.bottomLeft.style.left = '-7px';
    this.bottomLeft.style.bottom = '-7px';

    this.bottom.style.left = `${width / 2 - this.controllerSize / 2}px`;
    this.bottom.style.bottom = '-7px';

    this.bottomRight.style.right = '-7px';
    this.bottomRight.style.bottom = '-7px';
  }

  hide() {
    this.box.style.display = 'none';
  }
}
