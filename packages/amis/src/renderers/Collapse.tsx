import React from 'react';
import {
  Renderer,
  RendererProps,
  generateIcon,
  IconCheckedSchema,
  autobind,
  resolveEventData
} from 'amis-core';
import {Collapse as BasicCollapse} from 'amis-ui';
import {BaseSchema, SchemaCollection, SchemaTpl, SchemaObject} from '../Schema';

/**
 * Collapse 折叠渲染器，格式说明。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/collapse
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
  /**
   * 标题内容分割线
   */
  divideLine?: boolean;
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

  @autobind
  async handleCollapseChange(props: any, collapsed: boolean) {
    const {dispatchEvent, onCollapse} = this.props;
    const rendererEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {
        collapsed
      })
    );
    if (rendererEvent?.prevented) {
      return;
    }
    onCollapse?.(props, collapsed);
  }

  render() {
    const {
      id,
      classPrefix: ns,
      classnames: cx,
      size,
      wrapperComponent,
      headingComponent,
      className,
      style,
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
      useMobileUI,
      divideLine
    } = this.props;

    const heading = title || header || '';

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
        style={style}
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
            ? typeof (expandIcon as any).icon === 'object'
              ? generateIcon(cx, (expandIcon as any).icon)
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
        header={heading ? render('heading', heading) : null}
        body={
          children
            ? typeof children === 'function'
              ? children(this.props)
              : children
            : body
            ? render('body', body)
            : null
        }
        useMobileUI={useMobileUI}
        onCollapse={this.handleCollapseChange}
        divideLine={divideLine}
      ></BasicCollapse>
    );
  }
}

@Renderer({
  type: 'collapse'
})
export class CollapseRenderer extends Collapse {}
