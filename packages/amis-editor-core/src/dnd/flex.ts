import {isMobile} from 'amis-core';
/**
 * 支持上下左右拖拽模式
 */
import findIndex from 'lodash/findIndex';
import {EditorDNDManager} from '.';
import {renderThumbToGhost} from '../component/factory';
import {EditorNodeType} from '../store/node';
import {translateSchema} from '../util';
import {DNDModeInterface} from './interface';
import findLastIndex from 'lodash/findLastIndex';
import find from 'lodash/find';
import {AutoScroll, getScrollableParent} from './autoScroll';

const className = 'PushHighlight';

export class FlexDNDMode implements DNDModeInterface {
  readonly dndContainer: HTMLElement; // 记录当前拖拽区域
  dropBeforeId?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxRolLength = 4;
  dragNode?: any;
  dragId: string;
  store: any;
  autoScroll?: AutoScroll;
  constructor(
    readonly dnd: EditorDNDManager,
    readonly region: EditorNodeType,
    config: any
  ) {
    // 初始化时，默认将元素所在区域设置为当前拖拽区域
    this.dndContainer = this.dnd.store
      .getDoc()
      .querySelector(
        `[data-region="${region.region}"][data-region-host="${region.id}"]`
      ) as HTMLElement;
    this.maxRolLength = config.regionNode.maxRolLength || 4;
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

  /**
   * 首次拖入，把 ghost 插入进来。让用户有个直观感受。
   * @param e
   * @param ghost
   */
  enter(e: DragEvent, ghost: HTMLElement) {
    const dragEl = this.dnd.dragElement;
    const list = Array.isArray(this.region.schema) ? this.region.schema : [];
    const manager = this.dnd.manager;
    this.store = manager.store;
    // 如果区域里面没有元素，ghost就渲染为真实的表单元素
    if (list.length === 0) {
      if (dragEl && dragEl.closest('[data-region]') === this.dndContainer) {
        const child = this.getChild(this.dndContainer, dragEl);
        this.dndContainer.insertBefore(ghost, child);
        let innerHTML = dragEl.outerHTML
          .replace('ae-is-draging', '')
          .replace(/\bdata\-editor\-id=(?:'.+?'|".+?")/g, '');
        ghost.innerHTML = innerHTML;
      } else {
        renderThumbToGhost(
          ghost,
          this.region,
          translateSchema(this.store.dragSchema),
          manager
        );
        this.dndContainer.appendChild(ghost);
      }
    } else {
      ghost.innerHTML = '';
      // 直接插入 ghost，over的时候再去调整样式
      this.dndContainer.appendChild(ghost);
    }
    this.dragId = this.store.dragId;
    this.dragNode =
      find(list, (item: any) => item.$$id === this.dragId) ||
      this.store.dragSchema;
  }

  /**
   * 拖出去了，就移除 ghost
   * @param e
   * @param ghost
   */
  leave(e: DragEvent, ghost: HTMLElement) {
    this.dndContainer.removeChild(ghost);
    this.clearGhostStyle(ghost);
  }

  over(e: DragEvent, ghost: HTMLElement) {
    this.autoScroll?.checkScroll(e);

    const {isMobile} = this.store;
    const colTarget = (e.target as HTMLElement).closest('[role="flex-col"]');
    const wrapper = this.dndContainer;
    const elemSchema = this.region.schema;
    const {x: wx, y: wy} = wrapper.getBoundingClientRect();
    const list: Array<any> = Array.isArray(elemSchema) ? elemSchema : [];
    this.clearGhostStyle(ghost);

    if (colTarget && list.length) {
      const {width, height, x, y} = colTarget.getBoundingClientRect();
      const cx = e.clientX;
      const cy = e.clientY;
      const w = width / 8;
      const h = height / 2;

      const target = this.getTarget(colTarget);
      const targetId = target.getAttribute('data-editor-id')!;
      const targetIndex = findIndex(
        list,
        (item: any) => item.$$id === targetId
      );
      const targetRow = list[targetIndex].row;
      const targetRowLen = list.filter(
        (item: any) => item.row === targetRow
      ).length;
      // 是否可以插入到左右
      const canRL =
        this.dragId !== targetId && // 拖拽和目标不能是同一个元素，才能插入到左右
        this.dragNode?.$$dragMode !== 'hv' &&
        list[targetIndex]?.$$dragMode !== 'hv' && // 如果拖拽元素和目标元素的拖拽模式不能是垂直，才能插入到左右
        (targetRowLen < this.maxRolLength ||
          this.dragNode?.row === targetRow) && // 如果当前行的元素个数小于最大行长度，或者拖拽的元素就在当前行，才能插入到当前行
        !isMobile; // 移动端不支持左右拖拽

      if (cx < x + w && canRL) {
        ghost.classList.add(`ae-${className}-left`);
        ghost.style.left = x - wx + 'px';
        ghost.style.top = y - wy + 'px';
        ghost.style.height = height + 'px';
        this.dropBeforeId = targetId;
        this.position = 'left';
      } else if (cx > x + 7 * w && canRL) {
        ghost.classList.add(`ae-${className}-right`);
        ghost.style.left = x - wx + width + 'px';
        ghost.style.top = y - wy + 'px';
        ghost.style.height = height + 'px';
        this.dropBeforeId =
          list[
            list[targetIndex + 1]?.$$id === this.dragId
              ? targetIndex + 2
              : targetIndex + 1
          ]?.$$id;
        this.position = 'right';
      } else if (cy < y + h) {
        // 移动端，独占一行的元素不能插入到一行的中间
        if (
          this.store.isMobile &&
          (this.dragNode?.$$dragMode !== 'hv' ||
            list[targetIndex]?.$$dragMode !== 'hv') &&
          list[targetIndex].row === list[targetIndex - 1]?.row
        ) {
          delete this.position;
          delete this.dropBeforeId;
          return;
        }

        ghost.classList.add(`ae-${className}-top`);
        ghost.style.width = '100%';
        ghost.style.top = y - wy + 'px';

        if (this.store.isMobile) {
          this.dropBeforeId = targetId;
        } else {
          const beforeIndex = findIndex(
            list,
            (item: any) => item.row === targetRow
          );
          const index =
            list[beforeIndex]?.$$id === this.dragId
              ? beforeIndex + 1
              : beforeIndex;
          this.dropBeforeId = list[index]?.$$id;
        }
        this.position = 'top';
      } else {
        // 移动端，独占一行的元素不能插入到一行的中间
        if (
          this.store.isMobile &&
          (this.dragNode?.$$dragMode !== 'hv' ||
            list[targetIndex]?.$$dragMode !== 'hv') &&
          list[targetIndex].row === list[targetIndex + 1]?.row
        ) {
          delete this.position;
          delete this.dropBeforeId;
          return;
        }
        ghost.classList.add(`ae-${className}-bottom`);
        ghost.style.width = '100%';
        ghost.style.top = y - wy + height + 'px';
        if (this.store.isMobile) {
          this.dropBeforeId = list[targetIndex + 1]?.$$id;
        } else {
          const lastIndex = findLastIndex(
            list,
            (item: any) => item.row === targetRow
          );
          const index =
            list[lastIndex + 1]?.$$id === this.dragId
              ? lastIndex + 2
              : lastIndex + 1;
          this.dropBeforeId = list[index]?.$$id;
        }
        this.position = 'bottom';
      }
    } else {
      this.dropBeforeId = undefined;
      if (list.length) {
        const rows = wrapper.querySelectorAll('[role="flex-row"]');
        const lastRow = rows[rows.length - 1];
        const {y, height} = lastRow.getBoundingClientRect();
        ghost.classList.add(`ae-${className}-bottom`);
        ghost.style.width = '100%';
        ghost.style.top = y - wy + height + 'px';
      }
      this.position = 'bottom';
    }
  }

  clearGhostStyle(ghost: HTMLElement) {
    // 清除ghost的样式
    ghost.style.left = '';
    ghost.style.top = '';
    ghost.style.right = '';
    ghost.style.bottom = '';
    ghost.style.width = '';
    ghost.style.height = '';
    ghost.classList.remove(`ae-${className}-left`);
    ghost.classList.remove(`ae-${className}-right`);
    ghost.classList.remove(`ae-${className}-top`);
    ghost.classList.remove(`ae-${className}-bottom`);
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
  getTarget(col: Element | null) {
    let target = col?.querySelector('[data-editor-id]') as HTMLElement;
    return target;
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
    delete this.autoScroll;
    delete this.dropBeforeId;
    delete this.position;
  }

  getDropPosition() {
    return this.position;
  }

  // 是否中断 drop 事件
  interruptionDrop() {
    // 如果没有 dropBeforeId 和 position，说明没有拖拽到任何元素上，中断 drop 事件
    if (!this.dropBeforeId && !this.position) {
      return true;
    }
    return false;
  }
}
