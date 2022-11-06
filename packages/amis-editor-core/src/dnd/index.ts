/**
 * @file 拖拽相关逻辑
 */
import find from 'lodash/find';
import {isAlive} from 'mobx-state-tree';
import {toast} from 'amis';
import {EditorManager} from '../manager';
import {DragEventContext, SubRendererInfo} from '../plugin';
import {EditorStoreType} from '../store/editor';
import {EditorNodeType} from '../store/node';
import {autobind, reactionWithOldValue, unitFormula} from '../util';
import {DefaultDNDMode} from './default';
import {DNDModeInterface} from './interface';
import {PositionHDNDMode} from './position-h';

export class EditorDNDManager {
  toDispose: Array<() => void> = [];

  /**
   * 这个会随着 region 的切换，每次动态创建。
   */
  dndMode?: DNDModeInterface;

  /**
   * 拖拽对象 dom。
   */
  readonly dragGhost: HTMLElement;

  /**
   * 统计dragEnter 的次数，因为这个方法会调用很多次，
   * 有时候只想第一次进来的时候处理逻辑
   */
  dragEnterCount = 0;

  /**
   * 当前被拖动的渲染器元素。注意这里不一定是 e.target。
   */
  dragElement?: HTMLElement;

  /**
   * 拖拽跟随元素
   */
  dragImage?: HTMLElement;

  /**
   * 记录上次鼠标位置信息，协助拖拽计算的。
   */
  lastX: number = 0;
  lastY: number = 0;
  lastMoveAt: number = 0;
  curDragId: string;
  startX: number = 0;
  startY: number = 0;

  constructor(
    readonly manager: EditorManager,
    readonly store: EditorStoreType
  ) {
    this.toDispose.push(
      
      reactionWithOldValue(
        () => (store.dragType === 'schema' ? store.dragId : ''),
        this.updateDragElements
      ),

      /**
       * 自动给拖入的区域添加 is-dragenter 之类的 css。
       */
      reactionWithOldValue(
        () => ({id: store.dropId, region: store.dropRegion}),
        this.updateDropRegion
      ),

      /**
       * 自动给即将激活的区域添加高亮。
       */
      reactionWithOldValue(
        () => ({id: store.planDropId, region: store.planDropRegion}),
        this.updatePlanDropRegion
      )
    );

    this.dragGhost = document.createElement('div');
    this.dragGhost.classList.add('ae-DragGhost');
    this.dragGhost.classList.add('is-ghost');
  }

  /**
   * 创建拖拽跟随元素，如果用默认太大了，而且有时候不统一。
   * @param id
   * @param node
   */
  createDragImage(id: string, node: EditorNodeType) {
    const dragImage = document.createElement('div');
    dragImage.classList.add('ae-DragImage');
    // bca-disable-next-line
    dragImage.innerHTML = `<span>${node.label}</span>`;
    document.body.appendChild(dragImage);
    // dragImage.style.cssText += `width: ${node.w}px; height: ${node.h}px;`;
    this.dragImage = dragImage;
    return dragImage;
  }

  /**
   * 销毁拖拽跟随元素
   */
  disposeDragImage() {
    const dragImage = this.dragImage;
    dragImage?.parentElement?.removeChild(dragImage);
    delete this.dragImage;
  }

  /**
   * 切换到目标区域。
   * @param e
   * @param id
   * @param region
   */
  switchToRegion(e: DragEvent, id: string, region: string): boolean {
    const store = this.store;

    if (
      !id ||
      !region ||
      (store.dropId === id && store.dropRegion === region)
    ) {
      return false;
    }
    const node = store.getNodeById(id, region)!;
    const config = node.regionInfo!;

    // 获取当前拖拽的元素schema数据
    const json = store.dragSchema;

    if (config?.accept?.(json) === false) {
      return false;
    }

    const context: DragEventContext = {
      mode: store.dragMode as any,
      sourceType: store.dragType as any,
      sourceId: store.dragId,
      data: store.dragSchema,
      targetId: id,
      targetRegion: region
    };

    const event = this.manager.trigger('dnd-accept', context);
    if (event.prevented) {
      return false;
    }

    this.dndMode?.leave(e, this.dragGhost);
    this.dndMode?.dispose();

    store.setDropId(id, region);
    this.makeDNDModeInstance(node);
    this.dndMode?.enter(e, this.dragGhost!);
    return true;
  }

  /**
   * 根据区域的配置，创建拖拽模式实例。
   * 比如 table 列区域的拖拽就是放根线表示拖入的位置。
   * @param region
   */
  makeDNDModeInstance(region: EditorNodeType) {
    if (!region || !isAlive(region)) {
      return this.dndMode || null;
    }
    const mode = region.regionInfo?.dndMode;
    let Klass: new (
      dnd: EditorDNDManager,
      region: EditorNodeType
    ) => DNDModeInterface = DefaultDNDMode; // todo 根据配置自动实例化不同的。

    if (mode === 'position-h') {
      Klass = PositionHDNDMode;
    }
    this.dndMode = new Klass(this, region);
    return this.dndMode;
  }

  /**
   * 拖拽入口，一个是拖拽按钮 toolbar，一个是 outline 里面的导航项
   * @param id
   * @param e
   */
  startDrag(id: string, e: DragEvent) {
    const node = this.store.getNodeById(id)!;
    // 获取要拖拽的元素dom节点
    const dom = this.store.getDoc().querySelector(`[data-editor-id="${id}"]`);
    if (!node || !dom) {
      e.preventDefault();
      return;
    }

    this.lastX = e.clientX;
    this.lastY = e.clientY;

    if (this.manager.draggableContainer(node.id)) {
      this.curDragId = id; 
      this.startX = e.clientX;
      this.startY = e.clientY;
      return;
    }


    this.dragElement = dom as HTMLElement;
    // const rect = dom.getBoundingClientRect();
    e.dataTransfer!.effectAllowed = 'move';
    e.dataTransfer!.setDragImage(
      this.createDragImage(id, node),
      0, //e.clientX - rect.left,
      0
    );
    e.dataTransfer!.setData(`dnd/ae-node-${id}`.toLowerCase(), ``);
    e.target?.addEventListener('dragend', this.dragEnd);

    setTimeout(() => {
      this.store.setDragId(id);
      const region = node.parent;
      // 直接设置成当前节点所在容器。
      this.switchToRegion(e, region.id, region.region);
    }, 4);
  }

  /**
   * 有东西拖进来了。目前只支持内部面边里面的可用组件，后续还会支持其他类型。
   * @param e
   */
  @autobind
  dragEnter(e: DragEvent) {
    const store = this.store;

    if (this.curDragId && this.manager.draggableContainer(this.curDragId)) {
      // 特殊布局元素拖拽位置时，不需要 switchToRegion
      return;
    }

    const activeId = store.activeId;
    if (activeId) {
      const curNode = store.getNodeById(activeId);
      if (!curNode) {
        toast.warning('请先选择一个元素作为插入的位置。');
        return;
      }
       
      if (curNode?.schema?.type === 'flex') {
        toast.warning('布局容器组件不支持拖拽插入子元素。');
        return;
      }
    } else {
      toast.warning('请先选择一个元素作为插入的位置。');
      return;
    }

    this.dragEnterCount++;

    if (store.dragId || this.dragEnterCount !== 1) {
      return;
    }

    const types = e.dataTransfer!.types;
    for (let i = types.length - 1; i >= 0; i--) {
      if (/^dnd-dom\/(.*)$/.test(types[i])) {
        const selector = RegExp.$1;
        const dom = document.querySelector(selector);
        if (dom) {
          dom.addEventListener('dragend', this.dragEnd);
          const id = dom.getAttribute('data-dnd-id')!;
          const type = dom.getAttribute('data-dnd-type')!;
          const dataRaw = dom.getAttribute('data-dnd-data');
          const schema = dataRaw
            ? JSON.parse(dataRaw)
            : {
                type: 'tpl',
                tpl: 'Unknown'
              };
          store.setDragId(id, 'copy', type, schema);
          const containerId = store.activeContainerId;

          // 如果当前选中了某个组件，则默认让其第一个区域处于拖入状态。
          if (containerId) {
            const node = store.getNodeById(containerId);

            if (node?.childRegions.length) {
              this.switchToRegion(e, node.id, node.childRegions[0].region);
            }
          }
          break;
        }
      }
    }
  }

  /**
   * 拖入后的每一次移动，除了切换区域的逻辑外都丢给 DNDMode 那个去处理了。
   * @param e
   */
  @autobind
  dragOver(e: DragEvent) {
    const store = this.store;
    const target = e.target as HTMLElement;
    e.preventDefault();

    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    const d = Math.max(Math.abs(dx), Math.abs(dy));
    const now = Date.now();

    const curElem = target.closest(`[data-region][data-region-host]`);
    const hostId = curElem?.getAttribute('data-region-host');
    const region = curElem?.getAttribute('data-region');

    if (d > 5 && this.curDragId && this.manager.draggableContainer(this.curDragId)) {
      // 特殊布局元素拖拽位置
      const doc = store.getDoc();

      // 实时调整高亮区域坐标值
      const dragHlBoxItem = doc.querySelector(`[data-hlbox-id='${this.curDragId}']`) as HTMLElement;
      dragHlBoxItem.style.top = unitFormula(dragHlBoxItem.style.top, dy);
      dragHlBoxItem.style.left = unitFormula(dragHlBoxItem.style.left, dx);

      // 实时调整被拖拽元素的坐标值
      const dragContainerItem = doc.querySelector(`[data-editor-id='${this.curDragId}']`) as HTMLElement;
      let curInset = dragContainerItem.style.inset || 'auto';
      const insetArr = curInset.split(' ');
      const inset = {
        top: insetArr[0] || 'auto',
        right: insetArr[1] || 'auto',
        bottom: insetArr[2] || insetArr[0] || 'auto',
        left: insetArr[3] || insetArr[1] || 'auto',
      };

      dragContainerItem.style.inset = `${inset.top !== 'auto' ? unitFormula(inset.top, dy) : 'auto'} ${inset.right !== 'auto' ? unitFormula(inset.right, -dx) : 'auto'} ${inset.bottom !== 'auto' ? unitFormula(inset.bottom, -dy) : 'auto'} ${inset.left !== 'auto' ? unitFormula(inset.left, dx) : 'auto'}`;

      this.lastX = e.clientX;
      this.lastY = e.clientY;
      return;
    }

    if (!store.dropId || !target) {
      return;
    }

    // 没移动还是不要处理，免得晃动个不停。
    if (d < 5) {
      if (!curElem || hostId === store.dropId) {
        return;
      }

      // 跨容器组件切换，增加200毫秒的延迟
      if (now - this.lastMoveAt > 200 && region && hostId) {
        this.switchToRegion(e, hostId!, region!);
      }

      /*
      else if (now - this.lastMoveAt > 200 && region && hostId) {
        store.setPlanDropId(hostId, region);
      }
      */
      return;
    }

    store.setPlanDropId('', '');
    this.lastMoveAt = now;
    this.lastX = e.clientX;
    this.lastY = e.clientY;

    // 同一个容器组件下面的区域可以快速切换。
    if (store.dropId === hostId && region && region !== store.dropRegion) {
      this.switchToRegion(e, store.dropId, region);
    }

    this.dndMode?.over(e, this.dragGhost!);
  }

  /**
   * 拖拽释放的逻辑。
   * @param e
   */
  @autobind
  async drop(e: DragEvent) {
    const store = this.store;
    if (!this.curDragId) {
      return;
    }
    if (this.curDragId && this.manager.draggableContainer(this.curDragId)) {
      // 特殊布局元素拖拽位置后更新schema-style数据
      const dx = e.clientX - this.startX;
      const dy = e.clientY - this.startY;
      this.manager.updateContainerStyleByDrag(this.curDragId, dx, dy);
      // 重置拖拽ID，避免影响其他拖拽元素
      this.curDragId = '';
      return;
    }

    const beforeId = this.dndMode?.getDropBeforeId();

    if (store.dragMode === 'move') {
      this.manager.move(store.dropId, store.dropRegion, store.dragId, beforeId);
    } else if (store.dragMode === 'copy') {
      let schema = store.dragSchema;
      const dropId = store.dropId;
      const dropRegion = store.dropRegion;
      let subRenderer: SubRendererInfo | undefined = undefined;

      if (store.dragType === 'subrenderer') {
        subRenderer = find(store.subRenderers, r => r.id === store.dragId);
        if (subRenderer?.scaffoldForm) {
          schema = await this.manager.scaffold(
            subRenderer.scaffoldForm,
            schema
          );
        }
      }

      this.manager.addChild(dropId, dropRegion, schema, beforeId, subRenderer, {
        id: store.dragId,
        type: store.dragType,
        data: store.dragSchema
      });
    }
  }

  /**
   * 拖拽离开时调用。
   * @param e
   */
  @autobind
  dragLeave(e: DragEvent) {
    this.dragEnterCount--;
  }

  /**
   * 拖拽结束了。
   * @param e
   */
  @autobind
  dragEnd(e: DragEvent) {
    e.target?.removeEventListener('dragend', this.dragEnd);

    this.dndMode?.leave(e, this.dragGhost!);
    delete this.dndMode;
    // bca-disable-next-line
    this.dragGhost.innerHTML = '';
    this.store.setDragId('');
    this.store.setDropId('');
    this.disposeDragImage();
    this.dragEnterCount = 0;
  }

  /**
   * 自动给正在拖拽的元素加 is-draging 之类的 css。
   */
  @autobind
  updateDragElements(dragId: string) {
    if (dragId && this.manager.draggableContainer(dragId)) {
      return;
    }
    if (dragId) {
      [].slice
        .call(
          this.store.getDoc().querySelectorAll(`[data-editor-id="${dragId}"]`)
        )
        .forEach((elem: HTMLElement) => elem.classList.add('ae-is-draging'));
    } else {
      [].slice
        .call(this.store.getDoc().querySelectorAll(`.ae-is-draging`))
        .forEach((elem: HTMLElement) => elem.classList.remove('ae-is-draging'));
    }
  }

  /**
   * 自动给拖入的区域添加 is-dragenter 之类的 css。
   */
  @autobind
  updateDropRegion(
    value: {id: string; region: string},
    oldValue?: {id: string; region: string}
  ) {
    if (this.store.dragId && this.manager.draggableContainer(this.store.dragId)) {
      return;
    }
    if (oldValue?.id && oldValue.region) {
      this.store
        .getDoc()
        .querySelector(
          `[data-region="${oldValue.region}"][data-region-host="${oldValue.id}"]`
        )
        ?.classList.remove('is-dragenter');
    }

    if (value.id && value.region) {
      this.store
        .getDoc()
        .querySelector(
          `[data-region="${value.region}"][data-region-host="${value.id}"]`
        )
        ?.classList.add('is-dragenter');
    }
  }

  /**
   * 自动给即将激活的区域添加高亮。
   */
  @autobind
  updatePlanDropRegion(
    value: {id: string; region: string},
    oldValue?: {id: string; region: string}
  ) {
    if (this.store.dragId && this.manager.draggableContainer(this.store.dragId)) {
      return;
    }
    if (oldValue?.id && oldValue.region) {
      this.store
        .getDoc()
        .querySelector(
          `[data-region="${oldValue.region}"][data-region-host="${oldValue.id}"]`
        )
        ?.classList.remove('is-entering');
    }

    if (value.id && value.region) {
      this.store
        .getDoc()
        .querySelector(
          `[data-region="${value.region}"][data-region-host="${value.id}"]`
        )
        ?.classList.add('is-entering');
    }
  }

  /**
   * 销毁函数。
   */
  dispose() {
    this.disposeDragImage();
    this.toDispose.forEach(fn => fn());
    this.toDispose = [];
  }
}
