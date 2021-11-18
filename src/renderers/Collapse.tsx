import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {Collapse as BasicCollapse} from '../components/Collapse';
import {
  BaseSchema,
  SchemaClassName,
  SchemaCollection,
  SchemaTpl,
  SchemaObject
} from '../Schema';

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
  titlePosition?: 'top' | 'bottom';

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
  bodyClassName?: SchemaClassName;

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
   * 标题
   */
  title?: SchemaTpl;

  /**
   * 收起的标题
   */
  collapseTitle?: SchemaTpl;

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
   * 变更事件
   */
  onChange?: (item: CollapseProps, collapsed: boolean) => void;
}

export interface CollapseProps
  extends RendererProps,
    Omit<CollapseSchema, 'type' | 'className'> {
  wrapperComponent?: any;
  headingComponent?: any;

  // 内容口子
  children?: JSX.Element | ((props?: any) => JSX.Element);
}

export default class Collapse extends React.Component<
  CollapseProps,
  {}
> {

  render() {
    const {
      key,
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
      title,
      collapseTitle,
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
      onChange
    } = this.props;

    return (
      <BasicCollapse
        key={key}
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
        titlePosition={titlePosition}
        collapsable={collapsable}
        collapsed={collapsed}
        showArrow={showArrow}
        disabled={disabled}
        expandIcon={expandIcon ? render('arrow-icon', expandIcon || '', {className: cx('Collapse-icon-tranform')}) : null}
        collapseTitle={collapseTitle ? render('heading', collapseTitle) : null}
        header={render('heading', title || header || '')}
        body={children
          ? typeof children === 'function'
            ? children(this.props)
            : children
          : body
          ? render('body', body)
          : null}
        onChange={onChange}
      >
      </BasicCollapse>
    );
  }
}

@Renderer({
  type: 'collapse'
})
export class CollapseRenderer extends Collapse {}
