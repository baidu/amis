/**
 * 默认的拖拽模式实现。
 */
import {animation} from 'amis';
import findIndex from 'lodash/findIndex';
import {EditorDNDManager} from '.';
import {renderThumbToGhost} from '../component/factory';
import {EditorNodeType} from '../store/node';
import {DNDModeInterface} from './interface';

export class DefaultDNDMode implements DNDModeInterface {
  readonly dndContainer: HTMLElement; // 记录当前拖拽区域
  dropBeforeId?: string;
  constructor(readonly dnd: EditorDNDManager, readonly region: EditorNodeType) {
    // 初始化时，默认将元素所在区域设置为当前拖拽区域
    this.dndContainer = this.dnd.store
      .getDoc()
      .querySelector(
        `[data-region="${region.region}"][data-region-host="${region.id}"]`
      ) as HTMLElement;
  }

  /**
   * 记录上次交换时的鼠标位置。
   */
  exchangeX: number = 0;
  exchangeY: number = 0;

  /**
   * 首次拖入，把 ghost 插入进来。让用户有个直观感受。
   * @param e
   * @param ghost
   */
  enter(e: DragEvent, ghost: HTMLElement) {
    const dragEl = this.dnd.dragElement;
    // 如果就在移动的元素所在的区域，那么把 ghost 放到原来的位置。
    if (dragEl && dragEl.closest('[data-region]') === this.dndContainer) {
      const list: Array<any> = Array.isArray(this.region.schema)
        ? this.region.schema
        : [];
      const child = this.getChild(this.dndContainer, dragEl);
      const id = dragEl.getAttribute('data-editor-id')!;
      const idx = findIndex(list, (item: any) => item.$$id === id);
      if (~idx && list[idx + 1]) {
        this.dropBeforeId = list[idx + 1].$$id;
      }
      this.dndContainer.insertBefore(ghost, child);

      let innerHTML = dragEl.outerHTML
        .replace('ae-is-draging', '')
        // .replace(/\bdata\-editor\-id=('|").+?\1/g, '');
        // 上面那个会让 fis 编译的时候把后续的 require 语句都给忽略掉了。
        .replace(/\bdata\-editor\-id=(?:'.+?'|".+?")/g, '');
      // bca-disable-next-line
      ghost.innerHTML = innerHTML;
    } else {
      const manager = this.dnd.manager;
      const store = manager.store;
      renderThumbToGhost(ghost, this.region, store.dragSchema, manager);
      this.dndContainer.appendChild(ghost);
    }
  }

  /**
   * 拖出去了，就移除 ghost
   * @param e
   * @param ghost
   */
  leave(e: DragEvent, ghost: HTMLElement) {
    this.dndContainer.removeChild(ghost);
  }

  over(e: DragEvent, ghost: HTMLElement) {
    const target = this.getTarget(e);
    const wrapper = this.dndContainer;
    const elemSchema = this.region.schema;
    const list: Array<any> = Array.isArray(elemSchema) ? elemSchema : [];
    const dx = e.clientX - this.exchangeX;
    const dy = e.clientY - this.exchangeY;
    const vertical = Math.abs(dy) > Math.abs(dx);

    if (target && !animation.animating) {
      const targetId = target.getAttribute('data-editor-id')!;
      const targetChild = this.getChild(wrapper, target!);
      const idx = findIndex(list, (item: any) => item.$$id === targetId);

      const originIdx = Array.prototype.indexOf.call(wrapper.children, ghost);
      const targetIdx = Array.prototype.indexOf.call(
        wrapper.children,
        targetChild
      );

      if (
        ~originIdx &&
        originIdx > targetIdx &&
        (!this.exchangeY || dy < 0 || dx < 0)
      ) {
        // 原来在后面，移动到前面

        this.exchangeX = e.clientX;
        this.exchangeY = e.clientY;
        this.dropBeforeId = list[idx]?.$$id;

        if (originIdx !== targetIdx - 1) {
          animation.capture(wrapper);
          wrapper.insertBefore(ghost, targetChild);
          animation.animateAll();
        }
      } else if (
        ~originIdx &&
        originIdx < targetIdx &&
        (!this.exchangeY || dy > 0 || dx > 0)
      ) {
        // 原来在前面，移动到后面

        this.exchangeX = e.clientX;
        this.exchangeY = e.clientY;
        if (list[idx + 1]) {
          this.dropBeforeId = list[idx + 1]?.$$id;
        } else {
          delete this.dropBeforeId;
        }

        if (originIdx !== targetIdx + 1) {
          animation.capture(wrapper);
          wrapper.insertBefore(ghost, targetChild.nextSibling);
          animation.animateAll();
        }
      }
    }

    if (ghost.parentNode !== wrapper) {
      delete this.dropBeforeId;
      animation.capture(wrapper);
      wrapper.appendChild(ghost);
      animation.animateAll();
    }
  }

  /**
   * 返回个相对位置，如果没有数据会插入到结尾。
   */
  getDropBeforeId() {
    return this.dropBeforeId;
  }

  /**
   * 获取当时拖动到了哪个节点上面。
   */
  getTarget(e: DragEvent) {
    let target = (e.target as HTMLElement).closest(
      '[data-editor-id]'
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
        (target.parentElement?.closest('[data-editor-id]') as HTMLElement) ||
        null;
    }

    return null;
  }

  /**
   * 获取区域的直接孩子，因为有时候会在孩子的孩子里面。
   * 但是插入 ghost 的相对位置，insertBefore 只能是当前孩子。
   * @param dom
   * @param descend
   */
  getChild(dom: HTMLElement, descend: HTMLElement) {
    let child = descend;

    while (child) {
      if (child.parentElement === dom) {
        break;
      }

      child = child.parentElement!;
    }

    return child;
  }

  /**
   * 销毁
   */
  dispose() {
    delete this.dropBeforeId;
  }
}
