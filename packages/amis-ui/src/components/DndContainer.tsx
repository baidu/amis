/**
 * @file DndContainer
 * @desc 可拖拽容器
 */

import React from 'react';
import Draggable from 'react-draggable';
import {localeable, LocaleProps, themeable, ThemeProps} from 'amis-core';

import type {
  DraggableEvent,
  DraggableData,
  DraggableBounds
} from 'react-draggable';

export interface DndContainerProps extends LocaleProps, ThemeProps {
  /**
   * 可拖拽的方向, 默认为所有方向, 支持设置为X或Y轴
   */
  axis?: 'both' | 'x' | 'y' | 'none';
  /** 元素的位置 */
  position?: {x: number; y: number};
  /** 元素的起始位置 */
  defaultPosition?: {x: number; y: number};
  /**
   * 拖拽的边界, 可以设置坐标, 也可以设置父级元素的选择器
   */
  bounds?: DraggableBounds | string;
  /** 以网格范围拖拽的步长 */
  grid?: [number, number];
  /** 初始化拖拽的选择器 */
  handle?: string;
  /** 禁止拖拽的选择器 */
  cancel?: string;
  /** 拖拽距离的缩放比, 默认为1 */
  scale?: number;
  /** 是否禁止拖拽 */
  draggable?: boolean;
  /** 默认设置容器内部为'user-select:none', 可以设置true关闭 */
  enableUserSelect?: boolean;
  nodeRef?: React.RefObject<HTMLElement>;
  children?: React.ReactElement<any>;
  onStart?: (event: DraggableEvent, data: DraggableData) => void | false;
  onDrag?: (event: DraggableEvent, data: DraggableData) => void | false;
  onStop?: (event: DraggableEvent, data: DraggableData) => void | false;
}

const DndContainer: React.FC<DndContainerProps> = (
  props: DndContainerProps
) => {
  const {
    className,
    classnames: cx,
    children,
    axis,
    position,
    defaultPosition,
    bounds,
    grid,
    handle,
    cancel,
    draggable,
    scale,
    enableUserSelect,
    nodeRef,
    onDrag,
    onStart,
    onStop
  } = props;

  return (
    <Draggable
      axis={axis}
      position={position}
      defaultPosition={defaultPosition}
      bounds={bounds}
      grid={grid}
      handle={handle}
      cancel={cancel}
      disabled={!draggable}
      scale={scale}
      enableUserSelectHack={!enableUserSelect}
      nodeRef={nodeRef}
      defaultClassName={cx(className)}
      defaultClassNameDragging={cx('DndContainer--dragging')}
      defaultClassNameDragged={cx('DndContainer--dragged')}
      onStart={onStart}
      onDrag={onDrag}
      onStop={onStop}
    >
      {children}
    </Draggable>
  );
};

DndContainer.defaultProps = {
  axis: 'both',
  scale: 1,
  enableUserSelect: false
};

export default localeable(themeable(DndContainer));
