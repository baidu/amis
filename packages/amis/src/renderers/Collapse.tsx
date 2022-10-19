import React from 'react';
import {
  Renderer,
  RendererProps,
  generateIcon,
  IconCheckedSchema
} from 'amis-core';
import {Collapse as BasicCollapse} from 'amis-ui';
import {BaseSchema, SchemaCollection, SchemaTpl, SchemaObject} from '../Schema';

/**
 * Collapse 折叠渲染器，格式说明。
 * 文档：https://baidu.gitee.io/amis/docs/components/collapse
 */
export interface CollapseSchema extends BaseSchema {
  /**
   * 指定为折叠器类型
   */
  type: 'collapse';

  /**
   * 标识
   */
  key?: string;

  /**
   * 标题展示位置
   */
  headerPosition?: 'top' | 'bottom';

  /**
   * 标题
   */
  header?: string | SchemaCollection;

  /**
   * 内容区域
   */
  body: SchemaCollection;

  /**
   * 配置 Body 容器 className
   */
  bodyClassName?: string;

  /**
   * 是否禁用
   */
  disabled?: boolean;

  /**
   * 是否可折叠
   */
  collapsable?: boolean;

  /**
   * 默认是否折叠
   */
  collapsed?: boolean;

  /**
   * 图标是否展示
   */
  showArrow?: boolean;

  /**
   * 自定义切换图标
   */
  expandIcon?: SchemaObject;

  /**
   * 标题 CSS 类名
   */
  headingClassName?: string;

  /**
   * 收起的标题
   */
  collapseHeader?: SchemaTpl;

  /**
   * 控件大小
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'base';

  /**
   * 点开时才加载内容
   */
  mountOnEnter?: boolean;

  /**
   * 卡片隐藏就销毁内容。
   */
  unmountOnExit?: boolean;
}

export interface CollapseProps
  extends RendererProps,
    Omit<CollapseSchema, 'type' | 'className'> {
  wrapperComponent?: any;
  headingComponent?: any;

  // 内容口子
  children?: JSX.Element | ((props?: any) => JSX.Element);
}

export default class Collapse extends React.Component<CollapseProps, {}> {
  static propsList: Array<string> = [
    'collapsable',
    'collapsed',
    'collapseTitle',
    'showArrow',
    'headerPosition',
    'bodyClassName',
    'headingClassName',
    'collapseHeader',
    'size'
  ];

  render() {
    const {
      id,
      classPrefix: ns,
      classnames: cx,
      size,
      wrapperComponent,
      headingComponent,
      className,
      headingClassName,
      children,
      titlePosition,
      headerPosition,
      title,
      collapseTitle,
      collapseHeader,
      header,
      body,
      bodyClassName,
      render,
      collapsable,
      translate: __,
      mountOnEnter,
      unmountOnExit,
      showArrow,
      expandIcon,
      disabled,
      collapsed,
      propsUpdate,
      onCollapse
    } = this.props;

    return (
      <BasicCollapse
        id={id}
        classnames={cx}
        classPrefix={ns}
        mountOnEnter={mountOnEnter}
        unmountOnExit={unmountOnExit}
        size={size}
        wrapperComponent={wrapperComponent}
        headingComponent={headingComponent}
        className={className}
        headingClassName={headingClassName}
        bodyClassName={bodyClassName}
        headerPosition={titlePosition || headerPosition}
        collapsable={collapsable}
        collapsed={collapsed}
        showArrow={showArrow}
        disabled={disabled}
        propsUpdate={propsUpdate}
        expandIcon={
          expandIcon
            ? typeof expandIcon === 'object'
              ? generateIcon(cx, expandIcon as IconCheckedSchema)
              : render('arrow-icon', expandIcon || '', {
                  className: cx('Collapse-icon-tranform')
                })
            : null
        }
        collapseHeader={
          collapseTitle || collapseHeader
            ? render('heading', collapseTitle || collapseHeader)
            : null
        }
        header={render('heading', title || header || '')}
        body={
          children
            ? typeof children === 'function'
              ? children(this.props)
              : children
            : body
            ? render('body', body)
            : null
        }
        onCollapse={onCollapse}
      ></BasicCollapse>
    );
  }
}

@Renderer({
  type: 'collapse'
})
export class CollapseRenderer extends Collapse {}
