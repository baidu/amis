import {
  render,
  toast,
  resolveRenderer,
  Modal,
  Icon,
  resizeSensor,
  Spinner
} from 'amis';
import React, {Component} from 'react';
import cx from 'classnames';
import {autobind, guid, noop, reactionWithOldValue} from '../util';
import {clearStoresCache, RenderOptions} from 'amis-core';
import type {Schema} from 'amis';
import {EditorStoreType} from '../store/editor';
import {observer} from 'mobx-react';
import {EditorManager} from '../manager';
import HighlightBox from './HighlightBox';
import RegionHighlightBox from './RegionHLBox';
import {ErrorRenderer} from './base/ErrorRenderer';
import {isAlive} from 'mobx-state-tree';
import {findTree} from 'amis-core';
import BackTop from './base/BackTop';
import {reaction} from 'mobx';
import type {RendererConfig} from 'amis-core';
import IFramePreview from './IFramePreview';
import {SchemaRenderer} from './SchemaRenderer';

export interface PreviewProps {
  // isEditorEnabled?: (
  //   info: any,
  //   path: string,
  //   renderer: any,
  //   schema: any
  // ) => boolean;

  theme?: string;
  /** 应用语言类型 */
  appLocale?: string;
  amisEnv?: any;
  className?: string;
  editable?: boolean;
  isMobile?: boolean;
  store: EditorStoreType;
  manager: EditorManager;
  data?: any;
  autoFocus?: boolean;

  toolbarContainer?: () => any;

  readonly?: boolean;
  ref?: any;
}

export interface PreviewState {
  ready?: boolean;
}

@observer
export default class Preview extends Component<PreviewProps> {
  currentDom = React.createRef<HTMLDivElement>();
  dialogReaction: any;
  env: RenderOptions = {
    ...this.props.manager.env,
    notify: (type, msg, conf) => {
      if (this.props.editable) {
        console.warn('[Notify]', type, msg);
        return;
      }

      toast[type]
        ? toast[type](msg, conf || (type === 'error' ? '系统错误' : '系统消息'))
        : console.warn('[Notify]', type, msg);
    },
    theme: this.props.theme,
    session: `preview-${this.props.manager.id}`,
    rendererResolver: this.rendererResolver.bind(this)
  };

  doingSelection = false;

  componentDidMount() {
    const currentDom = this.currentDom.current!;
    currentDom.addEventListener('mouseleave', this.handleMouseLeave);
    currentDom.addEventListener('mousemove', this.handleMouseMove);
    currentDom.addEventListener('click', this.handleClick, true);
    currentDom.addEventListener('dblclick', this.handleDBClick, true);
    currentDom.addEventListener('mouseover', this.handeMouseOver);
    currentDom.addEventListener('mousedown', this.handeMouseDown);
    currentDom.addEventListener('submit', this.handleSubmit);
    this.props.manager.on('after-update', this.handlePreviewViewChange);
  }

  componentWillUnmount() {
    if (this.currentDom.current) {
      const currentDom = this.currentDom.current!;
      currentDom.removeEventListener('mouseleave', this.handleMouseLeave);
      currentDom.removeEventListener('mousemove', this.handleMouseMove);
      currentDom.removeEventListener('click', this.handleClick, true);
      currentDom.removeEventListener('dblclick', this.handleDBClick, true);
      currentDom.removeEventListener('mouseover', this.handeMouseOver);
      currentDom.removeEventListener('mousedown', this.handeMouseDown);
      currentDom.removeEventListener('submit', this.handleSubmit);
      this.props.manager.off('after-update', this.handlePreviewViewChange);
      this.dialogReaction?.();
    }

    setTimeout(() => clearStoresCache([this.env.session!]), 500);
  }

  unSensor?: () => void;
  layer?: HTMLDivElement;
  scrollLayer?: HTMLDivElement;

  @autobind
  handleLayerScroll(e: WheelEvent) {
    e.preventDefault();
    e.stopPropagation();

    const store = this.props.store;
    const iframe = store.getIframe();

    if (iframe) {
      iframe.contentWindow?.scrollTo({
        top: iframe.contentWindow?.scrollY + e.deltaY,
        behavior: 'smooth'
      });
      this.handlePreviewViewChange();
    } else {
      this.scrollLayer?.scrollTo({
        top: this.scrollLayer.scrollTop + e.deltaY,
        behavior: 'smooth'
      });
    }
  }

  @autobind
  contentsRef(ref: HTMLDivElement | null) {
    if (ref) {
      this.layer = ref
        .closest('.ae-Preview')!
        .querySelector('.ae-Preview-widgets') as HTMLDivElement;

      this.unSensor = resizeSensor(ref, this.handlePreviewViewChange);
      if (this.props.isMobile) {
        ref = ref.firstChild as HTMLDivElement;
      }

      this.scrollLayer = ref as HTMLDivElement;
      this.scrollLayer.removeEventListener(
        'scroll',
        this.handlePreviewViewChange
      );
      this.scrollLayer.addEventListener('scroll', this.handlePreviewViewChange);
      this.props.store.setLayer(this.layer);

      this.layer.addEventListener('wheel', this.handleLayerScroll, true);
    } else {
      this.layer?.removeEventListener('wheel', this.handleLayerScroll, true);
      this.scrollLayer?.removeEventListener(
        'scroll',
        this.handlePreviewViewChange
      );
      delete this.scrollLayer;
      delete this.layer;
      this.unSensor?.();
      delete this.unSensor;
    }
  }

  // 优化这块
  readonly unReaction: () => void = reactionWithOldValue(
    () => [this.getHighlightNodes(), this.props.store.activeId],
    ([ids]: [Array<string>], oldValue: [Array<string>]) => {
      const store = this.props.store;
      // requestAnimationFrame(() => {
      //   this.calculateHighlightBox(ids);
      // });
      store.activeHighlightNodes(ids);
      let oldIds = oldValue?.[0];

      if (Array.isArray(oldIds)) {
        oldIds = oldIds.filter(id => !~ids.indexOf(id));
        store.deActiveHighlightNodes(oldIds);
        // store.resetHighlightBox(oldIds);
      }
    }
  );

  @autobind
  handlePreviewViewChange() {
    if (this.layer && this.scrollLayer) {
      requestAnimationFrame(() => {
        if (!this.layer) {
          return;
        }
        this.layer!.style.cssText += `transform: translate(0, -${
          this.scrollLayer!.scrollTop
        }px);`;
      });
    }

    requestAnimationFrame(() =>
      this.calculateHighlightBox(this.getHighlightNodes())
    );
  }

  getHighlightNodes() {
    const store = this.props.store;
    return store.highlightNodes.map(item => item.id);
  }

  @autobind
  calculateHighlightBox(ids: Array<string>) {
    const store = this.props.store;
    this.layer && store.calculateHighlightBox(ids);
  }

  @autobind
  handeMouseDown(e: MouseEvent) {
    const isLeftButton =
      (e.button === 1 && window.event !== null) || e.button === 0;
    if (!this.props.editable || !isLeftButton || e.defaultPrevented) return;

    // todo highlight 改成可拖拽后，框选逻辑异常了，需要修复
    const store = this.props.store;
    if (
      e.defaultPrevented ||
      (e.target as HTMLElement)?.closest('[draggable]') ||
      store.activeElement
    ) {
      return;
    }

    const dom = this.layer as HTMLElement;
    if (!dom) {
      return;
    }

    let cursor: HTMLDivElement | null = null;
    const rect = dom.getBoundingClientRect();
    const startX = e.pageX;
    const startY = e.pageY;
    const x = startX - rect.left;
    const y = startY - rect.top;

    let onMove = (e: MouseEvent) => {
      if (!cursor) {
        cursor = document.createElement('div');
        cursor.classList.add('ae-Editor-selectionCursor');
        dom.appendChild(cursor);
      }

      this.doingSelection = true;
      const w = e.pageX - startX;
      const h = e.pageY - startY;
      cursor.style.cssText = `left: ${x + Math.min(w, 0)}px; top: ${
        y + Math.min(h, 0)
      }px; width: ${Math.abs(w)}px; height: ${Math.abs(h)}px;`;
    };
    let onUp = (e: MouseEvent) => {
      this.doingSelection = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      cursor && dom.removeChild(cursor);

      const w = e.pageX - startX;
      const h = e.pageY - startY;
      const rect = {
        x: x + Math.min(w, 0),
        y: y + Math.min(h, 0),
        w: Math.abs(w),
        h: Math.abs(h)
      };

      if (Math.hypot(w, h) < 10) {
        return;
      }

      // 阻止 click 事件触发。
      let captureClick = (e: MouseEvent) => {
        window.removeEventListener('click', captureClick, true);
        e.preventDefault();
        e.stopPropagation();
      };
      window.addEventListener('click', captureClick, true);
      setTimeout(
        () => window.removeEventListener('click', captureClick, true),
        350
      );

      this.doSelection(rect);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  /** 拖拽多选 */
  doSelection(rect: {x: number; y: number; w: number; h: number}) {
    const layer = this.layer;
    const dom = this.currentDom.current;
    if (!layer || !dom) {
      return;
    }

    const selections: Array<HTMLElement> = [];
    const layerRect = layer.getBoundingClientRect();
    const frameRect = {
      left: rect.x + layerRect.left,
      top: rect.y + layerRect.top,
      width: rect.w,
      height: rect.h,
      right: rect.x + layerRect.left + rect.w,
      bottom: rect.y + layerRect.top + rect.h
    };
    const nodes = dom.querySelectorAll(`[data-editor-id]`);
    [].slice.apply(nodes).forEach((node: HTMLElement) => {
      if (selections.some(container => container.contains(node))) {
        return;
      }

      const nodeRect = node.getBoundingClientRect();

      // 完全包含
      if (
        frameRect.left <= nodeRect.left &&
        frameRect.top <= nodeRect.top &&
        frameRect.right >= nodeRect.right &&
        frameRect.bottom >= nodeRect.bottom
      ) {
        ~selections.indexOf(node) || selections.push(node);
      }
    });
    const ids = selections
      .map(item => item.getAttribute('data-editor-id')!)
      .filter((id: string, idx, list) => list.indexOf(id) === idx);
    ids.length && this.props.manager.setSelection(ids);
  }

  @autobind
  handleClick(e: MouseEvent) {
    const store = this.props.store;

    // 处于编辑态时，不响应点击事件
    if (store.activeElement) {
      // 同时阻止渲染器里面的 click 事件
      e.preventDefault();
      return;
    }

    if (
      (e.target as HTMLElement).closest(
        '.ae-editor-action-btn,.ae-Editor-toolbarPopover '
      )
    ) {
      // 设计器内容区中允许点击的元素，比如：回到顶部功能按钮。
      // 或者高亮区的操作按钮
      return;
    }

    if (e.defaultPrevented) {
      e.stopPropagation();
      return;
    }

    const target = (e.target as HTMLElement).closest(
      `[data-editor-id],[data-hlbox-id]`
    );

    if (target?.matches('[data-editor-id]')) {
      const curActiveId = target.getAttribute('data-editor-id');

      e.metaKey
        ? this.props.manager.toggleSelection(curActiveId!)
        : store.setActiveId(curActiveId!);
    } else if (target?.matches('[data-hlbox-id]')) {
      const id = target.getAttribute('data-hlbox-id')!;
      const {x, y} = this.getElementPoint(e);
      let elements = store.getDoc().elementsFromPoint(x, y);

      let node = elements.find(
        (ele: Element) =>
          ele.hasAttribute('data-editor-id') &&
          ele.getAttribute('data-editor-id') !== id &&
          !ele.querySelector(`[data-editor-id="${id}"]`)
      );
      if (node) {
        const nodeId = node.getAttribute('data-editor-id')!;
        // 如果已经进入了内联模式
        // 不要再切选中了
        setTimeout(() => {
          store.activeElement || store.setActiveId(nodeId);
        }, 350);
      }
    }

    if (!this.layer?.contains(e.target as HTMLElement) && this.props.editable) {
      // 让渲染器不可点，只能点击选中。
      const event = this.props.manager.trigger('prevent-click', {
        data: e
      });

      if (!event.prevented && !event.stoped) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }

  @autobind
  handleDBClick(e: MouseEvent) {
    const store = this.props.store;
    let target = e.target as HTMLElement;
    let hostElem = target.closest(`[data-editor-id]`) as HTMLElement;

    if (!hostElem) {
      const hlbox = target.closest(`[data-hlbox-id]`) as HTMLElement;
      // 自由容器里面的高亮区域是可以点击的
      // 当点击来自高亮区域时，需要根据位置计算出组件上点击的元素
      if (hlbox) {
        const {x, y} = this.getElementPoint(e);
        const elements = store.getDoc().elementsFromPoint(x, y);
        target = elements.find((ele: Element) => {
          hostElem = ele.closest(
            `[data-editor-id="${hlbox.getAttribute('data-hlbox-id')}"]`
          ) as HTMLElement;
          return hostElem;
        }) as HTMLElement;
      }
    }

    if (hostElem) {
      const node = store.getNodeById(hostElem.getAttribute('data-editor-id')!);
      if (!node) {
        return;
      }
      e.preventDefault();
      const rendererInfo = node.info;

      // 需要支持 :scope > xxx 语法，所以才这么写
      let inlineElem: HTMLElement | undefined | null = null;
      const inlineSetting = (rendererInfo.inlineEditableElements || []).find(
        elem => {
          inlineElem = (
            [].slice.call(
              hostElem.querySelectorAll(elem.match)
            ) as Array<HTMLElement>
          ).find(dom => dom.contains(target));
          return !!inlineElem;
        }
      )!;

      // 如果命中了支持内联编辑的元素，则开始内联编辑
      if (inlineElem && inlineSetting) {
        const manager = this.props.manager;
        manager.startInlineEdit(node, inlineElem, inlineSetting, e);
      }
    }
  }

  @autobind
  handleNavSwitch(id: string) {
    const store = this.props.store;
    store.setActiveId(id);
  }

  @autobind
  handleMouseMove(e: MouseEvent) {
    if (this.doingSelection || this.props.manager.disableHover) {
      return;
    }

    const store = this.props.store;
    const dom = e.target as HTMLElement;

    if ((e.target as HTMLElement).closest('.ignore-hover-elem')) {
      // 设计器内容区中忽略hover的元素，比如：region头部标签。
      return;
    }

    const target = dom.closest(`[data-editor-id],[data-hlbox-id]`);

    if (target?.matches('[data-editor-id]')) {
      const curHoverId = target.getAttribute('data-editor-id');
      store.setHoverId(curHoverId!);
    } else if (target?.matches('[data-hlbox-id]')) {
      const {x, y} = this.getElementPoint(e);
      const elements = store.getDoc().elementsFromPoint(x, y);
      let hostElem: HTMLElement | null = null;
      for (const ele of elements) {
        hostElem = ele.closest(`[data-editor-id]`) as HTMLElement;
        if (hostElem) {
          break;
        }
      }

      if (hostElem) {
        // 判断当前是否在子区域
        const curHoverId = hostElem.getAttribute('data-editor-id');
        store.setHoverId(curHoverId!);
      }
    }
  }

  getElementPoint(e: MouseEvent) {
    const store = this.props.store;
    let x = e.clientX;
    let y = e.clientY;

    const iframe = store.getIframe();

    // 计算鼠标位置在页面中的实际位置，如果iframe存在，需要考虑iframe偏移量以及iframe的缩放比例
    if (iframe) {
      const preview: HTMLElement = (store.getLayer() as HTMLElement)
        .previousSibling?.firstChild as HTMLElement;
      const previewRect = preview.getBoundingClientRect();

      x -= previewRect.left;
      y -= previewRect.top;
      // 如果有缩放比例，重新计算位置
      const scale = store.getScale();
      if (scale >= 0) {
        x = x / scale;
        y = y / scale;
      }
    }

    return {x, y};
  }

  @autobind
  handleMouseLeave() {
    const store = this.props.store;
    store.setHoverId('');
  }

  @autobind
  handeMouseOver(e: MouseEvent) {
    if (this.props.editable) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  // 禁用内部的提交事件
  handleSubmit(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }

  @autobind
  handleDragEnter(e: React.DragEvent) {
    if (!this.props.editable) {
      // 非编辑态下不监听拖拽事件
      return;
    }
    const manager = this.props.manager;
    manager.dnd.dragEnter(e.nativeEvent);
  }

  @autobind
  handleDragLeave(e: React.DragEvent) {
    if (!this.props.editable) {
      return;
    }
    const manager = this.props.manager;
    manager.dnd.dragLeave(e.nativeEvent);
  }

  @autobind
  handleDragOver(e: React.DragEvent) {
    if (!this.props.editable) {
      return;
    }
    const manager = this.props.manager;
    manager.dnd.dragOver(e.nativeEvent);
  }

  @autobind
  handleDrop(e: React.DragEvent) {
    if (!this.props.editable) {
      return;
    }
    const manager = this.props.manager;
    manager.dnd.drop(e.nativeEvent);
  }

  @autobind
  handleWidgetsDragEnter(e: React.DragEvent) {
    const target = e.target as HTMLElement;
    const dom = target.closest(`[data-node-id][data-node-region].region-tip`);

    if (!dom) {
      return;
    }

    e.preventDefault();
    const manager = this.props.manager;
    const id = dom.getAttribute('data-node-id')!;
    const region = dom.getAttribute('data-node-region')!; // 大纲树中的容器节点

    id && region && manager.dnd.switchToRegion(e.nativeEvent, id, region);
  }

  @autobind
  getCurrentTarget() {
    const isMobile = this.props.isMobile;
    if (isMobile) {
      return this.currentDom.current!.querySelector(
        '.ae-Preview-inner'
      ) as HTMLDivElement;
    } else {
      return this.currentDom.current!.querySelector(
        '.ae-Preview-body'
      ) as HTMLDivElement;
    }
  }

  rendererResolver(path: string, schema: Schema, props: any) {
    const {editable, manager} = this.props;

    let renderer: RendererConfig = resolveRenderer(path, schema)!;
    if (editable === false) {
      return renderer;
    }

    renderer = renderer || {
      name: 'error',
      test: () => true,
      component: ErrorRenderer
    };

    let info = manager.getEditorInfo(renderer!, path, schema);

    info &&
      (renderer = {
        ...renderer,
        component: manager.makeWrapper(info, renderer)
      });

    return renderer;
  }

  render() {
    const {
      className,
      editable,
      store,
      manager,
      amisEnv,
      theme,
      isMobile,
      autoFocus,
      toolbarContainer,
      appLocale,
      ...rest
    } = this.props;

    const env = {
      ...this.env,
      ...amisEnv
    };

    return (
      <div
        id="editor-preview-body"
        onDragEnter={this.handleDragEnter}
        onDragLeave={this.handleDragLeave}
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
        className={cx(
          'ae-Preview',
          'AMISCSSWrapper',
          className,
          isMobile ? 'is-mobile-body' : 'is-pc-body'
        )}
        ref={this.currentDom}
      >
        <div className={cx('ae-Preview-outter')}>
          <div
            key={
              /* contentsLayer 逻辑不一样需要更新一下 */ isMobile
                ? 'mobile-body'
                : 'pc-body'
            }
            className={cx(
              'ae-Preview-body',
              className,
              editable ? 'is-edting' : '',
              isMobile ? 'is-mobile' : 'is-pc hoverShowScrollBar'
            )}
            ref={this.contentsRef}
          >
            <div className="ae-Preview-inner">
              {!store.ready ? (
                <div className="ae-Preview-loading">
                  <Spinner overlay size="lg" />
                </div>
              ) : isMobile ? (
                <IFramePreview
                  {...rest}
                  key="mobile"
                  editable={editable}
                  store={store}
                  env={env}
                  manager={manager}
                  autoFocus={autoFocus}
                  appLocale={appLocale}
                ></IFramePreview>
              ) : (
                <SmartPreview
                  {...rest}
                  editable={editable}
                  autoFocus={autoFocus}
                  store={store}
                  env={env}
                  manager={manager}
                  key="pc"
                  appLocale={appLocale}
                />
              )}
            </div>
            {this.currentDom.current && (
              <BackTop
                key={isMobile ? 'mobile-back-up' : 'pc-back-up'}
                className="ae-editor-action-btn"
                target={this.getCurrentTarget.bind(this)}
                onClick={(e: any) => {
                  console.log(e);
                }}
              >
                <Icon icon="back-up" className="back-top-icon" />
              </BackTop>
            )}
          </div>
        </div>

        <div
          onDragEnter={this.handleWidgetsDragEnter}
          className="ae-Preview-widgets"
          id="aePreviewHighlightBox"
        >
          {store.highlightNodes.map(node => (
            <HighlightBox
              node={node}
              key={node.id}
              store={store}
              id={node.id}
              title={node.label}
              toolbarContainer={toolbarContainer}
              onSwitch={this.handleNavSwitch}
              manager={manager}
              readonly={this.props.readonly}
            >
              {node.childRegions.map(region =>
                !node.memberImmutable(region.region) &&
                !store.activeElement &&
                !this.props.readonly &&
                store.isRegionActive(region.id, region.region) ? (
                  <RegionHighlightBox
                    manager={manager}
                    key={region.region}
                    store={store}
                    node={region}
                    id={region.id}
                    name={region.region}
                    title={region.label}
                    preferTag={region.preferTag}
                    isOnlyChildRegion={node.childRegions.length === 1}
                  />
                ) : null
              )}
            </HighlightBox>
          ))}
        </div>
      </div>
    );
  }
}

/**
 * 这个用了 observer，所以能最小程度的刷新，数据不变按理是不会刷新的。
 */
export interface SmartPreviewProps {
  editable?: boolean;
  autoFocus?: boolean;
  store: EditorStoreType;
  env: any;
  data?: any;
  manager: EditorManager;
  /** 应用语言类型 */
  appLocale?: string;
}
@observer
class SmartPreview extends React.Component<SmartPreviewProps> {
  dialogMountRef: React.RefObject<HTMLDivElement> = React.createRef();

  componentDidMount() {
    const store = this.props.store;

    if (this.props.autoFocus) {
      // 一般弹框动画差不多 350ms
      // 延时 350ms，在弹框中展示编辑器效果要好点。
      setTimeout(() => {
        if (isAlive(store)) {
          const first = findTree(
            store.outline,
            item => !item.isRegion && item.clickable
          );
          if (first && isAlive(store)) {
            let region = first.childRegions.find(
              (item: any) => item.region === 'body'
            )?.region;
            region =
              region ?? first.childRegions.find((i: any) => i.region)?.region;
            store.setActiveId(first.id, region);
          }
        }
      }, 350);
    } else {
      this.props.manager.buildRenderersAndPanels();
    }
  }

  componentDidUpdate(prevProps: SmartPreviewProps) {
    const props = this.props;

    if (props.editable !== prevProps.editable) {
      if (props.editable) {
        // 当预览状态切换到设计状态
        this.props.manager.trigger('preview2editor', {
          data: this.props.manager
        });
      }
    }
  }

  @autobind
  getDialogMountRef() {
    return this.dialogMountRef.current;
  }

  render() {
    const {editable, store, appLocale, autoFocus, env, data, manager, ...rest} =
      this.props;

    return (
      // 弹窗挂载节点
      <div ref={this.dialogMountRef} className="ae-PageWrapper">
        {render(
          editable ? store.filteredSchema : store.filteredSchemaForPreview,
          {
            globalVars: store.globalVariables,
            ...rest,
            key: editable ? 'edit-mode' : 'preview-mode',
            theme: env.theme,
            data: data,
            context: store.ctx,
            locale: appLocale,
            editorDialogMountNode: this.getDialogMountRef
          },
          {
            ...env,
            session: `${env.session}-${
              editable ? 'edit' : 'preview'
            }-smart-preview`,
            SchemaRenderer: editable ? SchemaRenderer : undefined,
            enableAMISDebug: !editable
          }
        )}
      </div>
    );
  }
}
