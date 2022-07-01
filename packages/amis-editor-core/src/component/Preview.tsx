import {render, toast, resolveRenderer, Modal, Icon, resizeSensor} from 'amis';
import React, {Component} from 'react';
import cx from 'classnames';
import {autobind, guid, noop, reactionWithOldValue} from '../util';
import {clearStoresCache, RenderOptions} from 'amis-core';
import {Schema} from 'amis/lib/types';
import {EditorStoreType} from '../store/editor';
import {observer} from 'mobx-react';
import {findDOMNode} from 'react-dom';
import {EditorManager} from '../manager';
import HighlightBox from './HighlightBox';
import RegionHighlightBox from './RegionHLBox';
import {ErrorRenderer} from './base/ErrorRenderer';
import IFrameBridge from './IFrameBridge';
import {isAlive} from 'mobx-state-tree';
import {findTree} from 'amis-core';
import BackTop from './base/BackTop';
import {RendererConfig} from 'amis-core/lib/factory';

export interface PreviewProps {
  // isEditorEnabled?: (
  //   info: any,
  //   path: string,
  //   renderer: any,
  //   schema: any
  // ) => boolean;

  theme?: string;
  amisEnv?: any;
  className?: string;
  editable?: boolean;
  isMobile?: boolean;
  store: EditorStoreType;
  manager: EditorManager;
  data?: any;
  iframeUrl?: string;
  autoFocus?: boolean;

  toolbarContainer?: () => any;
}

export interface PreviewState {
  ready?: boolean;
}

@observer
export default class Preview extends Component<PreviewProps> {
  currentDom: HTMLElement; // 用于记录当前dom元素
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
    rendererResolver: this.rendererResolver.bind(this),
    ...this.props.amisEnv
  };

  doingSelection = false;

  componentDidMount() {
    this.currentDom = findDOMNode(this) as HTMLElement;

    this.currentDom.addEventListener('mouseleave', this.handleMouseLeave);
    this.currentDom.addEventListener('mousemove', this.handleMouseMove);
    this.currentDom.addEventListener('click', this.handleClick);
    this.currentDom.addEventListener('mouseover', this.handeMouseOver);

    this.currentDom.addEventListener('mousedown', this.handeMouseDown);

    this.props.manager.on('after-update', this.handlePanelChange);
  }

  componentWillUnmount() {
    this.currentDom.removeEventListener('mouseleave', this.handleMouseLeave);
    this.currentDom.removeEventListener('mousemove', this.handleMouseMove);
    this.currentDom.removeEventListener('click', this.handleClick);
    this.currentDom.removeEventListener('mouseover', this.handeMouseOver);
    this.currentDom.removeEventListener('mousedown', this.handeMouseDown);
    this.props.manager.off('after-update', this.handlePanelChange);

    setTimeout(() => clearStoresCache([this.env.session!]), 500);
  }

  unSensor?: () => void;
  layer?: HTMLDivElement;
  @autobind
  contentsRef(ref: HTMLDivElement | null) {
    if (ref) {
      this.layer = ref!.querySelector('.ae-Preview-widgets') as HTMLDivElement;
      this.props.store.setLayer(this.layer);

      this.unSensor = resizeSensor(ref, () =>
        this.calculateHighlightBox(this.getHighlightNodes())
      );
    } else {
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
      setTimeout(() => {
        this.calculateHighlightBox(ids);
      }, 50);
      let oldIds = oldValue?.[0];

      if (Array.isArray(oldIds)) {
        oldIds = oldIds.filter(id => !~ids.indexOf(id));
        store.resetHighlightBox(oldIds);
      }
    }
  );

  @autobind
  handlePanelChange() {
    // 视图同步也需要时间啊
    setTimeout(() => this.calculateHighlightBox(this.getHighlightNodes()), 50);
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

    if (
      e.defaultPrevented ||
      (e.target as HTMLElement)?.closest('[draggable]')
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

      if (rect.w < 10 && rect.h < 10) {
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
    const dom = findDOMNode(this) as HTMLElement;
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
    const target = (e.target as HTMLElement).closest(`[data-editor-id]`);

    if ((e.target as HTMLElement).closest('.ae-editor-action-btn')) {
      // 设计器内容区中允许点击的元素，比如：回到顶部功能按钮。
      return;
    }

    if (e.defaultPrevented) {
      e.stopPropagation();
      return;
    }

    if (target) {
      const curActiveId = target.getAttribute('data-editor-id');
      let curRegion: string = '';

      // 判断当前是否在子区域
      const targetRegion = (e.target as HTMLElement).closest(
        `[data-region-host]`
      );
      if (targetRegion) {
        // 特殊区域允许点击事件
        const curRegionId = targetRegion.getAttribute('data-region-host');
        if (
          curRegionId &&
          curRegionId === curActiveId &&
          targetRegion.getAttribute('data-region')
        ) {
          // 确保点击的是当前预选中元素的子区域
          curRegion = targetRegion.getAttribute('data-region')!;
        }
      }

      e.metaKey
        ? this.props.manager.toggleSelection(curActiveId!)
        : store.setActiveId(curActiveId!, curRegion);
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

    if (this.layer?.contains(dom)) {
      return;
    }

    if ((e.target as HTMLElement).closest('.ignore-hover-elem')) {
      // 设计器内容区中忽略hover的元素，比如：region头部标签。
      return;
    }

    const target = dom.closest(`[data-editor-id]`);

    if (target) {
      const curHoverId = target.getAttribute('data-editor-id');
      let curHoverRegion: string = '';

      // 判断当前是否在子区域
      const targetRegion = (e.target as HTMLElement).closest(
        `[data-region-host]`
      );
      if (targetRegion) {
        // 特殊区域允许点击事件
        const curRegionId = targetRegion.getAttribute('data-region-host');
        if (
          curRegionId &&
          curRegionId === curHoverId &&
          targetRegion.getAttribute('data-region')
        ) {
          // 确保点击的是当前预选中元素的子区域
          curHoverRegion = targetRegion.getAttribute('data-region')!;
        }
      }

      store.setMouseMoveRegion(curHoverRegion);
      store.setHoverId(curHoverId!);
    }
  }

  @autobind
  handleMouseLeave() {
    const store = this.props.store;
    store.setMouseMoveRegion('');
    store.setHoverId('');
  }

  @autobind
  handeMouseOver(e: MouseEvent) {
    if (this.props.editable) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  @autobind
  handleDragEnter(e: React.DragEvent) {
    const manager = this.props.manager;
    manager.dnd.dragEnter(e.nativeEvent);
  }

  @autobind
  handleDragLeave(e: React.DragEvent) {
    const manager = this.props.manager;
    manager.dnd.dragLeave(e.nativeEvent);
  }

  @autobind
  handleDragOver(e: React.DragEvent) {
    const manager = this.props.manager;
    manager.dnd.dragOver(e.nativeEvent);
  }

  @autobind
  handleDrop(e: React.DragEvent) {
    const manager = this.props.manager;
    manager.dnd.drop(e.nativeEvent);
  }

  @autobind
  getCurrentTarget() {
    const isMobile = this.props.isMobile;
    if (isMobile) {
      return this.currentDom.querySelector(
        '.ae-Preview-inner'
      ) as HTMLDivElement;
    } else {
      return this.currentDom.querySelector(
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

    // 更新 Editor 中的 amisStore
    if (props && props.store && props.store.data) {
      manager.updateAMISContext(props.store.data);
    }

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
      iframeUrl,
      autoFocus,
      toolbarContainer,
      ...rest
    } = this.props;

    return (
      <div
        id="editor-preview-body"
        onDragEnter={this.handleDragEnter}
        onDragLeave={this.handleDragLeave}
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
        className={cx(
          'ae-Preview',
          className,
          isMobile ? 'is-mobile-body hoverShowScrollBar' : 'is-pc-body'
        )}
      >
        <div
          className={cx(
            'ae-Preview-body',
            className,
            editable ? 'is-edting' : '',
            isMobile ? 'is-mobile' : 'is-pc hoverShowScrollBar'
          )}
        >
          {iframeUrl && isMobile && (
            <React.Fragment>
              <div className="mobile-sound"></div>
              <div className="mobile-receiver"></div>
              <div className="mobile-left-btn"></div>
              <div className="mobile-right-btn"></div>
              <div className="mobile-open-btn"></div>
            </React.Fragment>
          )}
          <div className="ae-Preview-inner" ref={this.contentsRef}>
            {iframeUrl && isMobile ? (
              <IFrameBridge
                {...rest}
                key="mobile"
                className="ae-PreviewFrame"
                editable={editable}
                isMobile={isMobile}
                store={store}
                env={this.env}
                manager={manager}
                url={iframeUrl}
                theme={theme}
                autoFocus={autoFocus}
              ></IFrameBridge>
            ) : (
              <SmartPreview
                {...rest}
                editable={editable}
                autoFocus={autoFocus}
                store={store}
                env={this.env}
                manager={manager}
                key="pc"
              />
            )}

            {iframeUrl && isMobile && store.contextId ? (
              <span className="ae-IframeMask"></span>
            ) : null}

            <div className="ae-Preview-widgets" id="aePreviewHighlightBox">
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
                >
                  {node.childRegions.map(region =>
                    !node.memberImmutable(region.region) &&
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
          {this.currentDom && (
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
}
@observer
class SmartPreview extends React.Component<SmartPreviewProps> {
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

          first && isAlive(store) && store.setActiveId(first.id);
        }
      }, 350);
    } else {
      this.props.manager.buildRenderersAndPanels();
    }
  }

  render() {
    const {editable, store, autoFocus, env, data, manager, ...rest} =
      this.props;

    return render(
      editable ? store.filteredSchema : store.filteredSchemaForPreview,
      {
        ...rest,
        key: editable ? 'edit-mode' : 'preview-mode',
        theme: env.theme,
        data: data ?? store.ctx
      },
      env
    );
  }
}
