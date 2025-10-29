/**
 * @file 简化版 Flex 布局，主要用于不熟悉 CSS 的开发者
 */

import React from 'react';
import {
  buildStyle,
  Renderer,
  RendererProps,
  CustomStyle,
  setThemeClassName,
  AMISSchemaBase,
  AMISSchemaCollection
} from 'amis-core';
import {Schema} from 'amis-core';
import {BaseSchema, SchemaObject} from '../Schema';

/**
 * Flex 弹性布局组件，简化版 Flex 布局，主要用于不熟悉 CSS 的开发者
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/flex
 */
/**
 * 弹性布局组件，基于 Flexbox 布局子元素。支持方向、换行与对齐配置。
 */
export interface AMISFlexSchema extends AMISSchemaBase {
  /**
   * 指定为 flex 组件
   */
  type: 'flex';

  /**
   * 水平分布方式
   */
  justify?:
    | 'start'
    | 'flex-start'
    | 'center'
    | 'end'
    | 'flex-end'
    | 'space-around'
    | 'space-between'
    | 'space-evenly';

  /**
   * 垂直对齐方式
   */
  alignItems?:
    | 'stretch'
    | 'start'
    | 'flex-start'
    | 'flex-end'
    | 'end'
    | 'center'
    | 'baseline';

  /**
   * 多行垂直分布方式
   */
  alignContent?:
    | 'normal'
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch';

  /**
   * 布局方向
   */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';

  /**
   * Flex 子项配置
   */
  items: AMISSchemaCollection;

  /**
   * 自定义样式
   */
  style?: {
    [propName: string]: any;
  };
}

export interface FlexProps
  extends RendererProps,
    Omit<AMISFlexSchema, 'type' | 'className'> {}

export default class Flex extends React.Component<FlexProps, object> {
  static defaultProps: Partial<FlexProps> = {
    direction: 'row',
    justify: 'center',
    alignItems: 'stretch',
    alignContent: 'center'
  };

  constructor(props: FlexProps) {
    super(props);
  }

  renderItems() {
    const {items, render, disabled, classnames: cx} = this.props;
    let children = Array.isArray(items) ? items : items ? [items] : [];

    return children.map((item, key) =>
      render(`items/${key}`, item, {
        key: `items/${key}`,
        disabled: (item as SchemaObject)?.disabled ?? disabled
      })
    );
  }

  render() {
    const {
      items,
      direction,
      justify,
      alignItems,
      alignContent,
      style,
      className,
      render,
      disabled,
      data,
      id,
      wrapperCustomStyle,
      env,
      themeCss,
      classnames: cx
    } = this.props;
    const styleVar = buildStyle(style, data);
    const flexStyle = {
      display: 'flex',
      flexDirection: direction,
      justifyContent: justify,
      alignItems,
      alignContent,
      ...styleVar
    };

    if (flexStyle.flexBasis !== undefined && flexStyle.flex) {
      // 合并flex和flexBasis，并优先使用flexBasis
      const flexValArr = flexStyle.flex.split(' ');
      flexStyle.flex = `${flexValArr[0]} ${flexValArr[1] || flexValArr[0]} ${
        flexStyle.flexBasis
      }`;
    }

    return (
      <div
        style={flexStyle}
        className={cx(
          'Flex',
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
        data-id={id}
        data-role="container"
      >
        {this.renderItems()}
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
      </div>
    );
  }
}

export interface FlexItemSchema extends AMISSchemaBase {
  /**
   * 功能和 wrapper 类似，主要是给 flex 子节点用的
   */
  type: 'flex-item';

  /**
   * 内容
   */
  body: AMISSchemaCollection;

  /**
   * 自定义样式
   */
  style?: {
    [propName: string]: any;
  };
}

export interface FlexItemProps
  extends RendererProps,
    Omit<FlexItemSchema, 'className'> {
  children?: JSX.Element | ((props?: any) => JSX.Element);
}

export class FlexItem extends React.Component<FlexItemProps, object> {
  static propsList: Array<string> = ['body', 'className', 'children'];

  renderBody(): JSX.Element | null {
    const {children, body, render, disabled} = this.props;

    return children
      ? typeof children === 'function'
        ? (children(this.props) as JSX.Element)
        : (children as JSX.Element)
      : body
      ? (render('body', body, {disabled}) as JSX.Element)
      : null;
  }

  render() {
    const {className, size, classnames: cx, style} = this.props;

    return (
      <div className={className} style={style}>
        {this.renderBody()}
      </div>
    );
  }
}

@Renderer({
  type: 'flex'
})
export class FlexRenderer extends Flex {}

@Renderer({
  type: 'flex-item'
})
export class FlexItemRenderer extends FlexItem {}
