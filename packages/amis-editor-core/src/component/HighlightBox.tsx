import React from 'react';
import cx from 'classnames';
import {EditorStoreType} from '../store/editor';
import {observer} from 'mobx-react';
import {EditorNodeType} from '../store/node';
import {Icon} from 'amis';
import {autobind, noop} from '../util';
import {PluginEvent, ResizeMoveEventContext} from '../plugin';
import {EditorManager} from '../manager';
import {isAlive} from 'mobx-state-tree';

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
  readonly?: boolean;
}

export default observer(function ({
  className,
  store,
  id,
  title,
  children,
  node,
  toolbarContainer,
  onSwitch,
  manager,
  readonly
}: HighlightBoxProps) {
  const handleWResizerMouseDown = React.useCallback(
    (e: MouseEvent) => startResize(e, 'horizontal'),
    []
  );

  const handleHResizerMouseDown = React.useCallback(
    (e: MouseEvent) => startResize(e, 'vertical'),
    []
  );

  const handleResizerMouseDown = React.useCallback(
    (e: MouseEvent) => startResize(e, 'both'),
    []
  );

  const startResize = React.useCallback(
    (e: MouseEvent, direction: 'horizontal' | 'vertical' | 'both') => {
      const isLeftButton =
        (e.button === 1 && window.event !== null) || e.button === 0;
      if (!isLeftButton || e.defaultPrevented) return;

      e.preventDefault();
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
        store: store,
        resizer:
          direction === 'both'
            ? resizerDom.current!
            : direction === 'vertical'
            ? hResizerDom.current!
            : wResizerDom.current!
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
      mainRef.current?.setAttribute('data-resizing', '');

      const onMove = (e: MouseEvent) => {
        e.preventDefault();
        pluginOnMove?.(e);
      };

      const onUp = (e: MouseEvent) => {
        e.preventDefault();
        manager.disableHover = false;
        mainRef.current?.removeAttribute('data-resizing');
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
    },
    []
  );
  const wResizerDom = React.useRef<HTMLElement>();
  const wResizerRef = React.useCallback((ref: HTMLElement) => {
    if (ref) {
      ref.addEventListener('mousedown', handleWResizerMouseDown);
    } else {
      wResizerDom.current?.removeEventListener(
        'mousedown',
        handleWResizerMouseDown
      );
    }

    wResizerDom.current = ref;
  }, []);

  const hResizerDom = React.useRef<HTMLElement>();
  const hResizerRef = React.useCallback((ref: HTMLElement) => {
    if (ref) {
      ref.addEventListener('mousedown', handleHResizerMouseDown);
    } else {
      hResizerDom.current?.removeEventListener(
        'mousedown',
        handleHResizerMouseDown
      );
    }

    hResizerDom.current = ref;
  }, []);

  const resizerDom = React.useRef<HTMLElement>();
  const resizerRef = React.useCallback((ref: HTMLElement) => {
    if (ref) {
      ref.addEventListener('mousedown', handleResizerMouseDown);
    } else {
      resizerDom.current?.removeEventListener(
        'mousedown',
        handleResizerMouseDown
      );
    }

    resizerDom.current = ref;
  }, []);

  const handleMouseEnter = React.useCallback(() => {
    if (manager.disableHover) {
      return;
    }

    store.setHoverId(id);
  }, []);

  const handleDragStart = React.useCallback((e: React.DragEvent) => {
    if (manager.disableHover) {
      return;
    }

    manager.startDrag(id, e);
  }, []);

  const mainRef = React.createRef<HTMLDivElement>();
  const toolbars = store.sortedToolbars;
  const secondaryToolbars = store.sortedSecondaryToolbars;
  const specialToolbars = store.sortedSpecialToolbars;
  const isActive = store.isActive(id);
  const curFreeContainerId = store.parentIsFreeContainer();
  const isHover =
    store.isHoved(id) ||
    store.dropId === id ||
    store.insertOrigId === id ||
    curFreeContainerId === id;
  const isDraggableContainer = store.draggableContainer(id);

  // todo 干掉这个逻辑
  // 获取当前高亮画布宽度
  const aePreviewOffsetWidth = document.getElementById(
    'aePreviewHighlightBox'
  )!.offsetWidth;

  if (!isAlive(node)) {
    return <div />;
  }

  // 判断是否在最右侧（考虑组件头部工具栏被遮挡的问题）
  const isRightElem = aePreviewOffsetWidth - node.x < 176; // 跳过icode代码检查
  const isSelected =
    (isActive && !store.activeElement) || ~store.selections.indexOf(id);

  React.useLayoutEffect(() => {
    if (!node.draggable || !isSelected || !isAlive(node)) {
      return;
    }
    const dom = node.getTarget() as HTMLElement;
    const targets = Array.isArray(dom) ? dom : dom ? [dom] : [];
    targets.forEach(item => {
      item.setAttribute('draggable', 'true');
      item.addEventListener('dragstart', handleDragStart as any);
    });
    return () => {
      targets.forEach(item => {
        item.removeAttribute('draggable');
        item.removeEventListener('dragstart', handleDragStart as any);
      });
    };
  }, [node.draggable, isSelected]);

  /* bca-disable */
  return (
    <div
      className={cx(
        'ae-Editor-hlbox',
        {
          shake: id === store.insertOrigId,
          focused: store.activeElement && isActive,
          selected: isSelected,
          hover: isHover,
          regionOn: node.childRegions.some(region =>
            store.isRegionHighlighted(region.id, region.region)
          ),
          isFreeContainerElem: !!curFreeContainerId || isDraggableContainer
        },
        className
      )}
      data-hlbox-id={id}
      style={{
        display:
          node.w && node.h && !node.info.plugin.notHighlight ? 'block' : 'none',
        top: node.y,
        left: node.x,
        width: node.w,
        height: node.h
      }}
      ref={mainRef}
      onMouseEnter={handleMouseEnter}
      draggable={node.draggable}
      onDragStart={handleDragStart}
    >
      {isActive && !store.activeElement && !readonly ? (
        <div
          className={`ae-Editor-toolbarPopover ${
            isRightElem ? 'is-right-elem' : ''
          }`}
          onClick={e => e.stopPropagation()}
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

          <div
            className={cx('ae-Editor-toolbar', {
              invisible: toolbars.length === 0
            })}
            key="toolbar"
          >
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
        <div className="ae-Editor-toolbar sencondary" key="sencondary-toolbar">
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
        <>
          <span className="ae-border-WResizer" ref={wResizerRef}></span>
          <span className="ae-WResizer" ref={wResizerRef}></span>
        </>
      ) : null}

      {node.heightMutable ? (
        <>
          <span className="ae-border-HResizer" ref={hResizerRef}></span>
          <span className="ae-HResizer" ref={hResizerRef}></span>
        </>
      ) : null}

      {node.widthMutable && node.heightMutable ? (
        <span className="ae-Resizer" ref={resizerRef}></span>
      ) : null}
    </div>
  );
});
