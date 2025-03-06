import React from 'react';
import merge from 'lodash/merge';
import {
  Renderer,
  RendererProps,
  autobind,
  buildStyle,
  isPureVariable,
  resolveVariableAndFilter,
  CustomStyle,
  setThemeClassName
} from 'amis-core';
import {DndContainer as DndWrapper} from 'amis-ui';
import {BaseSchema, SchemaClassName, SchemaCollection} from '../Schema';

/** 容器拖拽配置 */
export interface ContainerDraggableConfig {
  /**
   * 可拖拽的方向, 默认为所有方向, 支持设置为X或Y轴
   */
  axis?: 'both' | 'x' | 'y';

  /**
   * 元素的起始位置
   */
  defaultPosition?: {x: number; y: number};

  /**
   * 拖拽的边界, 可以设置坐标, 也可以设置父级元素的选择器
   */
  bounds?:
    | {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
      }
    | string;

  /**
   * 以网格模式拖拽的步长
   */
  grid?: [number, number];

  /**
   * 初始化拖拽的选择器
   */
  handle?: string;

  /**
   * 禁止拖拽的选择器
   */
  cancel?: string;

  /**
   * 拖拽距离的缩放比, 默认为1
   */
  scale?: number;

  /**
   * 默认设置容器内部为'user-select:none', 可以设置true关闭
   */
  enableUserSelect?: boolean;
}

/**
 * Container 容器渲染器。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/container
 */
export interface ContainerSchema extends BaseSchema {
  /**
   * 指定为 container 类型
   */
  type: 'container';

  /**
   * 内容
   */
  body: SchemaCollection;

  /**
   * body 类名
   */
  bodyClassName?: SchemaClassName;

  /**
   * 自定义样式
   */
  style?: {
    [propName: string]: any;
  };

  /**
   * 使用的标签
   */
  wrapperComponent?: string;

  /**
   * 是否需要对body加一层div包裹，默认为 true
   */
  wrapperBody?: boolean;

  /**
   * 是否开启容器拖拽
   */
  draggable?: boolean | string;

  /**
   * 是否开启容器拖拽配置
   */
  draggableConfig: ContainerDraggableConfig | string;
}

export interface ContainerProps
  extends RendererProps,
    Omit<ContainerSchema, 'type' | 'className' | 'style'> {
  children?: (props: any) => React.ReactNode;
}

export default class Container<T> extends React.Component<
  ContainerProps & T,
  object
> {
  static propsList: Array<string> = ['body', 'className'];
  static defaultProps = {
    className: '',
    draggableConfig: {
      axis: 'both' as ContainerDraggableConfig['axis'],
      scale: 1,
      enableUserSelect: false
    }
  };

  @autobind
  handleClick(e: React.MouseEvent<any>) {
    const {dispatchEvent, data} = this.props;
    dispatchEvent(e, data);
  }

  @autobind
  handleMouseEnter(e: React.MouseEvent<any>) {
    const {dispatchEvent, data} = this.props;
    dispatchEvent(e, data);
  }

  @autobind
  handleMouseLeave(e: React.MouseEvent<any>) {
    const {dispatchEvent, data} = this.props;
    dispatchEvent(e, data);
  }

  renderBody(): JSX.Element | null {
    const {
      children,
      body,
      render,
      classnames: cx,
      bodyClassName,
      disabled,
      wrapperBody,
      testIdBuilder
    } = this.props;

    const isWrapperBody = wrapperBody ?? true;

    const containerBody = children
      ? typeof children === 'function'
        ? ((children as any)(this.props) as JSX.Element)
        : (children as any)
      : (render('body', (body as any) ? body : [], {disabled}) as JSX.Element);

    if (isWrapperBody) {
      return (
        <div
          className={cx('Container-body', bodyClassName)}
          {...testIdBuilder?.getTestId()}
        >
          {containerBody}
        </div>
      );
    } else {
      return containerBody;
    }
  }

  render() {
    const {
      className,
      wrapperComponent,
      size,
      classnames: cx,
      style,
      data,
      draggable,
      draggableConfig,
      id,
      wrapperCustomStyle,
      env,
      themeCss,
      baseControlClassName
    } = this.props;
    const finalDraggable: boolean = isPureVariable(draggable)
      ? resolveVariableAndFilter(draggable, data, '| raw')
      : draggable;
    const finalDraggableConfig: ContainerDraggableConfig = merge(
      Container.defaultProps.draggableConfig,
      isPureVariable(draggableConfig)
        ? resolveVariableAndFilter(draggableConfig, data, '| raw')
        : draggableConfig
    );
    const Component =
      (wrapperComponent as keyof JSX.IntrinsicElements) || 'div';
    const contentDom = (
      <Component
        className={cx(
          'Container',
          size && size !== 'none' ? `Container--${size}` : '',
          className,
          setThemeClassName({
            ...this.props,
            name: 'baseControlClassName',
            id,
            themeCss
          }),
          setThemeClassName({
            ...this.props,
            name: 'wrapperCustomStyle',
            id,
            themeCss: wrapperCustomStyle
          })
        )}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        style={buildStyle(style, data)}
        data-id={id}
        data-role="container"
      >
        {this.renderBody()}
        <CustomStyle
          {...this.props}
          config={{
            wrapperCustomStyle,
            id,
            themeCss,
            classNames: [
              {
                key: 'baseControlClassName'
              }
            ]
          }}
          env={env}
        />
      </Component>
    );

    return finalDraggable ? (
      <DndWrapper {...finalDraggableConfig} draggable={true}>
        {contentDom}
      </DndWrapper>
    ) : (
      contentDom
    );
  }
}

@Renderer({
  type: 'container'
})
export class ContainerRenderer extends Container<{}> {}
