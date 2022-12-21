import React from 'react';
import cx from 'classnames';
import {EditorStoreType} from '../store/editor';
import {observer} from 'mobx-react';
import {EditorNodeType} from '../store/node';
import {Icon} from 'amis';
import {autobind, noop} from '../util';
import {PluginEvent, ResizeMoveEventContext} from '../plugin';
import {EditorManager} from '../manager';

export interface HighlightBoxProps {
  store: EditorStoreType;
  node: EditorNodeType;
  id: string;
  className?: string;
  title: string;
  toolbarContainer?: () => any;
  onSwitch?: (id: string) => void;
  manager: EditorManager;
  children?: React.ReactNode;
}

@observer
export default class HighlightBox extends React.Component<HighlightBoxProps> {
  mainRef = React.createRef<HTMLDivElement>();

  @autobind
  handleWResizerMouseDown(e: MouseEvent) {
    return this.startResize(e, 'horizontal');
  }

  @autobind
  handleHResizerMouseDown(e: MouseEvent) {
    return this.startResize(e, 'vertical');
  }

  @autobind
  handleResizerMouseDown(e: MouseEvent) {
    return this.startResize(e, 'both');
  }

  startResize(
    e: MouseEvent,
    direction: 'horizontal' | 'vertical' | 'both' = 'horizontal'
  ) {
    const isLeftButton =
      (e.button === 1 && window.event !== null) || e.button === 0;
    if (!isLeftButton || e.defaultPrevented) return;

    e.preventDefault();
    const {manager, id, node} = this.props;
    if (!node) {
      return;
    }

    const target = document.querySelector(`[data-editor-id="${id}"]`);

    if (!target) {
      return;
    }
    manager.disableHover = true;

    const event = manager[
      direction === 'both'
        ? 'onSizeChangeStart'
        : direction === 'vertical'
        ? 'onHeightChangeStart'
        : 'onWidthChangeStart'
    ](e, {
      dom: target as HTMLElement,
      node: node,
      resizer:
        direction === 'both'
          ? this.resizerDom
          : direction === 'vertical'
          ? this.hResizerDom
          : this.wResizerDom
    }) as PluginEvent<
      ResizeMoveEventContext,
      {
        onMove(e: MouseEvent): void;
        onEnd(e: MouseEvent): void;
      }
    >;

    const pluginOnMove = event.data?.onMove;
    const pluginonEnd = event.data?.onEnd;

    if (!pluginOnMove && !pluginonEnd) {
      return;
    }
    this.mainRef.current?.setAttribute('data-resizing', '');

    const onMove = (e: MouseEvent) => {
      e.preventDefault();
      pluginOnMove?.(e);
    };

    const onUp = (e: MouseEvent) => {
      e.preventDefault();
      manager.disableHover = false;
      this.mainRef.current?.removeAttribute('data-resizing');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      document.body.style.cursor = 'default';

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

      pluginonEnd?.(e);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    document.body.style.cursor =
      direction === 'both'
        ? 'nwse-resize'
        : direction === 'vertical'
        ? 'ns-resize'
        : 'ew-resize';
  }

  wResizerDom: HTMLElement;

  @autobind
  wResizerRef(ref: any) {
    if (ref) {
      ref.addEventListener('mousedown', this.handleWResizerMouseDown);
    } else {
      this.wResizerDom.addEventListener(
        'mousedown',
        this.handleWResizerMouseDown
      );
    }

    this.wResizerDom = ref;
  }

  hResizerDom: HTMLElement;

  @autobind
  hResizerRef(ref: any) {
    if (ref) {
      ref.addEventListener('mousedown', this.handleHResizerMouseDown);
    } else {
      this.hResizerDom.addEventListener(
        'mousedown',
        this.handleHResizerMouseDown
      );
    }

    this.hResizerDom = ref;
  }

  resizerDom: HTMLElement;

  @autobind
  resizerRef(ref: any) {
    if (ref) {
      ref.addEventListener('mousedown', this.handleResizerMouseDown);
    } else {
      this.resizerDom.addEventListener(
        'mousedown',
        this.handleResizerMouseDown
      );
    }

    this.resizerDom = ref;
  }

  @autobind
  handleMouseEnter() {
    const manager = this.props.manager;

    if (manager.disableHover) {
      return;
    }

    this.props.store.setHoverId(this.props.id);
  }

  // @autobind
  // handleMouseLeave() {
  //   this.props.store.setHoverId(this.props.id);
  // }

  render() {
    const {
      className,
      store,
      id,
      title,
      children,
      node,
      toolbarContainer,
      onSwitch
    } = this.props;
    const toolbars = store.sortedToolbars;
    const secondaryToolbars = store.sortedSecondaryToolbars;
    const specialToolbars = store.sortedSpecialToolbars;
    const isActive = store.isActive(id);
    const isHover =
      store.isHoved(id) || store.dropId === id || store.insertOrigId === id;

    // 获取当前高亮画布宽度
    const aePreviewOffsetWidth = document.getElementById(
      'aePreviewHighlightBox'
    )!.offsetWidth;
    // 判断是否在最右侧（考虑组件头部工具栏被遮挡的问题）
    const isRightElem = aePreviewOffsetWidth - node.x < 176; // 跳过icode代码检查

    /* bca-disable */ return (
      <div
        className={cx(
          'ae-Editor-hlbox',
          {
            shake: id === store.insertOrigId,
            selected: isActive || ~store.selections.indexOf(id),
            hover: isHover,
            regionOn: node.childRegions.some(region =>
              store.isRegionHighlighted(region.id, region.region)
            )
          },
          className
        )}
        data-hlbox-id={id}
        style={{
          display: node.w && node.h ? 'block' : 'none',
          top: node.y,
          left: node.x,
          width: node.w,
          height: node.h
        }}
        ref={this.mainRef}
        onMouseEnter={this.handleMouseEnter}
      >
        {isActive ? (
          <div
            className={`ae-Editor-toolbarPopover ${
              isRightElem ? 'is-right-elem' : ''
            }`}
          >
            <div className="ae-Editor-nav">
              {node.host ? (
                <div
                  className="ae-Editor-tip parent"
                  onClick={() => onSwitch?.(node.host.id)}
                >
                  {node.host.label}
                </div>
              ) : null}

              <div key="tip" className="ae-Editor-tip current">
                {title}
              </div>

              {node.firstChild ? (
                <div
                  className="ae-Editor-tip child"
                  onClick={() => onSwitch?.(node.firstChild.id)}
                >
                  {node.firstChild.label}
                </div>
              ) : null}
            </div>

            <div className="ae-Editor-toolbar" key="toolbar">
              {toolbars.map(item => (
                <button
                  key={item.id}
                  type="button"
                  draggable={item.draggable}
                  onDragStart={item.onDragStart}
                  data-id={item.id}
                  data-tooltip={item.tooltip || undefined}
                  data-position={item.placement || 'top'}
                  onClick={item.onClick}
                >
                  {item.iconSvg ? (
                    <Icon className="icon" icon={item.iconSvg} />
                  ) : ~item.icon!.indexOf('<') ? (
                    <span dangerouslySetInnerHTML={{__html: item.icon!}} />
                  ) : (
                    <i className={item.icon} />
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {isActive && secondaryToolbars.length ? (
          <div
            className="ae-Editor-toolbar sencondary"
            key="sencondary-toolbar"
          >
            {secondaryToolbars.map(item => (
              <button
                key={item.id}
                type="button"
                className={item.className}
                data-id={item.id}
                data-tooltip={item.tooltip || undefined}
                data-position={item.placement || 'top'}
                onClick={item.onClick}
              >
                {item.iconSvg ? (
                  <Icon className="icon" icon={item.iconSvg} />
                ) : ~item.icon!.indexOf('<') ? (
                  <span dangerouslySetInnerHTML={{__html: item.icon!}} />
                ) : (
                  <i className={item.icon} />
                )}
              </button>
            ))}
          </div>
        ) : null}

        {isActive && specialToolbars.length ? (
          <div className="ae-Editor-toolbar special" key="special-toolbar">
            {specialToolbars.map(item => (
              <button
                key={item.id}
                type="button"
                className={item.className}
                data-id={item.id}
                data-tooltip={item.tooltip || undefined}
                data-position={item.placement || 'top'}
                onClick={item.onClick}
              >
                {item.iconSvg ? (
                  <Icon className="icon" icon={item.iconSvg} />
                ) : ~item.icon!.indexOf('<') ? (
                  <span dangerouslySetInnerHTML={{__html: item.icon!}} />
                ) : (
                  <i className={item.icon} />
                )}
              </button>
            ))}
          </div>
        ) : null}

        {children}

        {node.widthMutable ? (
          <span className="ae-WResizer" ref={this.wResizerRef}></span>
        ) : null}

        {node.heightMutable ? (
          <span className="ae-HResizer" ref={this.hResizerRef}></span>
        ) : null}

        {node.widthMutable && node.heightMutable ? (
          <span className="ae-Resizer" ref={this.resizerRef}></span>
        ) : null}
      </div>
    );
  }
}
