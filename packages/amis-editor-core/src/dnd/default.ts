/**
 * 默认的拖拽模式实现。
 */
import {animation} from 'amis';
import findIndex from 'lodash/findIndex';
import {EditorDNDManager} from './index';
import {renderThumbToGhost} from '../component/factory';
import {EditorNodeType} from '../store/node';
import {translateSchema} from '../util';
import {DNDModeInterface} from './interface';
import {AutoScroll, getScrollableParent} from './autoScroll';
function getRelativeParent(element: HTMLElement): HTMLElement | null {
  let parent = element;
  const win = parent.ownerDocument.defaultView || window;

  while (parent) {
    const style = win.getComputedStyle(parent);
    if (style.position === 'relative') {
      return parent;
    }
    parent = parent.parentElement as HTMLElement;
  }
  return null;
}

export class DefaultDNDMode implements DNDModeInterface {
  readonly dndContainer: HTMLElement; // 记录当前拖拽区域
  readonly relativeContainer: HTMLElement;
  dropOn?: string;
  dropPosition?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'middle';

  autoScroll?: AutoScroll;

  constructor(readonly dnd: EditorDNDManager, readonly region: EditorNodeType) {
    // 初始化时，默认将元素所在区域设置为当前拖拽区域
    this.dndContainer = this.dnd.store
      .getDoc()
      .querySelector(
        `[data-region="${region.region}"][data-region-host="${region.id}"]`
      ) as HTMLElement;

    // 获取相对定位的父级元素
    this.relativeContainer =
      getRelativeParent(this.dndContainer) || this.dndContainer;

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

  layoutInfo: LayoutInfo | null = null;

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
    ghost.innerHTML = '';
    ghost.classList.add('use-indicator');

    const layoutInfo = new LayoutDetector(this.dndContainer).detect();
    this.layoutInfo = layoutInfo;

    ghost.style.cssText =
      'width: var(--ae-DragGhost-size); height: var(--ae-DragGhost-size);';
    this.dndContainer.appendChild(ghost);
    this.over(e, ghost);
  }

  /**
   * 拖出去了，就移除 ghost
   * @param e
   * @param ghost
   */
  leave(e: DragEvent, ghost: HTMLElement) {
    this.layoutInfo = null;
    ghost.style.cssText = '';
    ghost.classList.remove('use-indicator');
    this.dndContainer.removeChild(ghost);
  }

  over(e: DragEvent, ghost: HTMLElement) {
    const target = this.getTarget(e);
    const wrapper = this.dndContainer;

    this.autoScroll?.checkScroll(e);

    if (target) {
      const dropPosition = this.detectDropPosition(e, target);
      this.updateIndicator(
        ghost,

        target,
        this.reductionPosition(dropPosition, this.layoutInfo?.isHorizontal)
      );
    } else {
      // 拖入了某个区域上
      const children = this.getChildren(wrapper);

      if (!children.length && !this.dropOn) {
        const placeholder = wrapper.querySelector(
          '.ae-Region-placeholder'
        ) as HTMLElement;

        this.updateIndicator(
          ghost,
          placeholder?.offsetWidth ? placeholder : wrapper,
          this.layoutInfo?.isHorizontal ? 'center' : 'middle'
        );
        return;
      }

      const lastChild = children[children.length - 1];
      const firstChild = children[0];

      const dropPositionOfLast = this.detectDropPosition(e, lastChild);

      if (dropPositionOfLast === 'right' || dropPositionOfLast === 'bottom') {
        this.updateIndicator(
          ghost,

          lastChild,
          this.reductionPosition('right', this.layoutInfo?.isHorizontal)
        );
      } else {
        this.updateIndicator(
          ghost,

          firstChild,
          this.reductionPosition('left', this.layoutInfo?.isHorizontal)
        );
      }
    }
  }

  /**
   * 返回个相对位置，如果没有数据会插入到结尾。
   */
  getDropBeforeId() {
    if (
      !this.dropOn ||
      this.dropPosition === 'center' ||
      this.dropPosition === 'middle'
    ) {
      return;
    }

    if (this.dropPosition === 'top' || this.dropPosition === 'left') {
      return this.dropOn;
    }

    const children = this.getChildren(this.dndContainer);
    const idx = children.findIndex(
      item => item.getAttribute('data-editor-id') === this.dropOn
    );
    if (idx !== -1 && children[idx + 1]) {
      return children[idx + 1].getAttribute('data-editor-id')!;
    }

    return;
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

  // 获取直接孩子，剔除掉间接孩子
  getChildren(region: HTMLElement): Array<HTMLElement> {
    const indirectChildren = Array.from(
      region.querySelectorAll(':scope [data-editor-id] [data-editor-id]')
    );
    return Array.from(
      region.querySelectorAll('[data-editor-id]:not(.ae-is-draging)')
    ).filter(item => !indirectChildren.includes(item)) as any;
  }

  detectDropPosition(
    event: DragEvent,
    dropTarget: HTMLElement
  ): 'top' | 'bottom' | 'left' | 'right' {
    const rect = dropTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 计算相对位置（百分比）
    const relativeX = x / rect.width;
    const relativeY = y / rect.height;

    // 判断位置（上、下、左、右）
    if (relativeY < 0.25) return 'top';
    if (relativeY > 0.75) return 'bottom';
    if (relativeX < 0.5) return 'left';
    return 'right';
  }

  reductionPosition(
    position: 'top' | 'bottom' | 'left' | 'right',
    isHorizontal?: boolean
  ) {
    const left = position === 'left' || position === 'top';
    return isHorizontal ? (left ? 'left' : 'right') : left ? 'top' : 'bottom';
  }

  updateIndicator(
    ghost: HTMLElement,
    target: HTMLElement,
    dropPosition: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'middle'
  ) {
    // const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const frameRect = this.relativeContainer.getBoundingClientRect();

    ghost.style.cssText += `width: ${
      dropPosition === 'left' ||
      dropPosition === 'right' ||
      dropPosition === 'center'
        ? 'var(--ae-DragGhost-size);'
        : targetRect.width
    }px; height: ${
      dropPosition === 'top' ||
      dropPosition === 'bottom' ||
      dropPosition === 'middle'
        ? 'var(--ae-DragGhost-size);'
        : targetRect.height
    }px; left: ${
      dropPosition === 'center'
        ? targetRect.left + targetRect.width / 2 - frameRect.left
        : dropPosition === 'right'
        ? targetRect.right - frameRect.left
        : targetRect.left - frameRect.left
    }px; top: ${
      dropPosition === 'middle'
        ? targetRect.top + targetRect.height / 2 - frameRect.top
        : dropPosition === 'bottom'
        ? targetRect.bottom - frameRect.top
        : targetRect.top - frameRect.top
    }px; `;

    this.dropOn = target.getAttribute('data-editor-id')!;
    this.dropPosition = dropPosition;
  }

  /**
   * 销毁
   */
  dispose() {
    delete this.autoScroll;
    delete this.dropOn;
    delete this.dropPosition;
  }
}

interface LayoutInfo {
  type: 'flex' | 'grid' | 'block';
  isHorizontal?: boolean;
  isWrapped?: boolean;
  hasColumns?: boolean;
}

class LayoutDetector {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  detectByStyle(): LayoutInfo {
    const win = this.container.ownerDocument.defaultView || window;
    const style = win.getComputedStyle(this.container);
    const display = style.display;

    switch (display) {
      case 'flex':
      case 'inline-flex':
        return this.detectFlexAlignment(style);
      case 'grid':
      case 'inline-grid':
        return this.detectGridAlignment(style);
      default:
        return this.detectBlockAlignment();
    }
  }

  detectFlexAlignment(style: CSSStyleDeclaration): LayoutInfo {
    const direction = style.flexDirection;
    const wrap = style.flexWrap;

    return {
      type: 'flex',
      isHorizontal: direction.includes('row'),
      isWrapped: wrap !== 'nowrap'
    };
  }

  detectGridAlignment(style: CSSStyleDeclaration): LayoutInfo {
    const autoFlow = style.gridAutoFlow;
    const templateColumns = style.gridTemplateColumns;

    return {
      type: 'grid',
      isHorizontal: autoFlow.includes('column'),
      hasColumns: templateColumns !== 'none'
    };
  }

  detectBlockAlignment(): LayoutInfo {
    const children = Array.from(this.container.children).filter(item =>
      item.matches('[data-editor-id]')
    );
    if (!children.length) {
      return {type: 'block', isHorizontal: false};
    } else if (children.length === 1) {
      const win = this.container.ownerDocument.defaultView || window;
      const style = win.getComputedStyle(this.container);
      const rect = this.container.getBoundingClientRect();
      const childRect = children[0].getBoundingClientRect();
      const paddingWidth =
        parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      const paddingHeight =
        parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);

      return {
        type: 'block',
        isHorizontal:
          childRect.height / (rect.height - paddingHeight) >
          childRect.width / (rect.width - paddingWidth)
      };
    }

    const rect1 = children[0].getBoundingClientRect();
    const rect2 = children[1].getBoundingClientRect();

    return {
      type: 'block',
      isHorizontal:
        Math.abs(rect2.left - rect1.left) > Math.abs(rect2.top - rect1.top)
    };
  }

  detect(): LayoutInfo {
    return this.detectByStyle();
  }
}
