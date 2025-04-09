/**
 * @file 一种更简单的拖拽模式，直接在某个位置显示条线来告知用户拖拽即将拖拽到哪。
 * 比如 Table 里面的列位置的移动，如果真要移动dom，那可能要命。
 */
import findIndex from 'lodash/findIndex';
import {DNDModeInterface} from './interface';
import {EditorNodeType} from '../store/node';
import {EditorDNDManager} from './index';
import {AutoScroll, getScrollableParent} from './autoScroll';

export class PositionHDNDMode implements DNDModeInterface {
  readonly dndContainer: HTMLElement; // 记录当前拖拽区域
  dropBeforeId?: string;
  autoScroll?: AutoScroll;

  constructor(readonly dnd: EditorDNDManager, readonly region: EditorNodeType) {
    // 初始化时，默认将元素所在区域设置为当前拖拽区域
    this.dndContainer = this.dnd.store
      .getDoc()
      .querySelector(
        `[data-region="${region.region}"][data-region-host="${region.id}"]`
      ) as HTMLElement;
    const scrollableParent = getScrollableParent(
      this.dndContainer,
      this.dnd.store.getIframe()
    );
    if (scrollableParent) {
      this.autoScroll = new AutoScroll({
        container: scrollableParent
      });
    }
  }

  enter(e: DragEvent, ghost: HTMLElement) {
    ghost.innerHTML = '';
    ghost.classList.add('use-position');
    ghost.classList.add('is-horizontal');

    const dragEl = this.dnd.dragElement;
    const regionRect = this.dndContainer.getBoundingClientRect();

    const list: Array<any> = Array.isArray(this.region.schema)
      ? this.region.schema
      : [];

    // 如果就在移动的元素所在的区域，那么把 ghost 放到原来的位置。
    if (dragEl && dragEl.closest(`[data-region]`) === this.dndContainer) {
      const id = dragEl.getAttribute('data-editor-id')!;
      const idx = findIndex(list, (item: any) => item.$$id === id);
      if (~idx && list[idx + 1]) {
        this.dropBeforeId = list[idx + 1].$$id;
      }

      if (dragEl.nextElementSibling) {
        const rect = dragEl.nextElementSibling.getBoundingClientRect();
        ghost.style.cssText += `top: 0; left: ${rect.x - regionRect.x}px;`;
      } else {
        ghost.style.cssText += `top: 0; left: 100%;`;
      }
    } else {
      ghost.style.cssText += `top: 0; left: -999999%;`;
    }
    this.dndContainer.appendChild(ghost);
  }

  leave(e: DragEvent, ghost: HTMLElement) {
    ghost.style.cssText = '';
    ghost.classList.remove('use-position');
    ghost.classList.remove('is-horizontal');
    this.dndContainer.removeChild(ghost);
  }

  over(e: DragEvent, ghost: HTMLElement) {
    this.autoScroll?.checkScroll(e);

    let target = this.getTarget(e);
    if (!target) {
      return;
    }

    // 如果是列特殊处理。
    if (this.dndContainer?.getAttribute('data-renderer') === 'table') {
      const col = target.parentElement?.closest(
        'th[data-editor-id], td[data-editor-id]'
      );
      if (col && this.dndContainer.contains(col)) {
        target = col as HTMLElement;
      }
    }

    const regionRect = this.dndContainer.getBoundingClientRect();

    const rect = target.getBoundingClientRect();
    const leading = (e.clientX - rect.left) / rect.width < 0.5;

    if (leading) {
      ghost.style.cssText += `left: ${rect.x - regionRect.x}px;`;
      this.dropBeforeId = target.getAttribute('data-editor-id')!;
    } else if (
      target.nextElementSibling &&
      target.nextElementSibling.hasAttribute('data-editor-id')
    ) {
      ghost.style.cssText += `top: 0; left: ${rect.right - regionRect.x}px;`;
      this.dropBeforeId =
        target.nextElementSibling.getAttribute('data-editor-id')!;
    } else {
      ghost.style.cssText += `top: 0; left: ${rect.right - regionRect.x}px;`;
      delete this.dropBeforeId;
    }
  }

  /**
   * 获取当时拖动到了哪个节点上面。
   */
  getTarget(e: DragEvent) {
    let target = (e.target as HTMLElement).closest(
      '[data-editor-id]:not(.ae-is-draging)'
    ) as HTMLElement;

    while (target) {
      const region = target.parentElement?.closest('[data-region]');

      if (region === this.dndContainer) {
        const renderer = target.getAttribute('data-renderer');
        if (renderer === 'grid') {
          // grid 组件中的分栏的子栏也可以拖入 选中分栏组件同级组件拖动时有问题 兼容一下
          return target.parentElement;
        } else {
          return target;
        }
      }

      target =
        (target.parentElement?.closest(
          '[data-editor-id]:not(.ae-is-draging)'
        ) as HTMLElement) || null;
    }

    return null;
  }

  getDropBeforeId() {
    return this.dropBeforeId;
  }

  /**
   * 销毁
   */
  dispose() {
    delete this.dropBeforeId;
    delete this.autoScroll;
  }
}
