/**
 * @file 用来展示面包屑导航
 */
import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema, SchemaIcon, SchemaUrlPath} from '../Schema';
import {generateIcon} from '../utils/icon';
import {filter} from '../utils/tpl';
import {resolveVariable, resolveVariableAndFilter} from '../utils/tpl-builtin';

export type BreadcrumbItemSchema = {
  /**
   * 文字
   */
  label?: string;

  /**
   * 图标类名
   */
  icon?: SchemaIcon;

  /**
   * 链接地址
   */
  href?: SchemaUrlPath;
} & Omit<BaseSchema, 'type'>;

/**
 * Breadcrumb 显示渲染器
 * 文档：https://baidu.gitee.io/amis/docs/components/breadcrumb
 */
export interface BreadcrumbSchema extends BaseSchema {
  /**
   *  指定为面包屑显示控件
   */
  type: 'breadcrumb';

  /**
   * 分隔符
   */
  separator?: string;

  /**
   * 分隔符类
   */
  separatorClassName?: string;

  /**
   * 列表
   */
  items: Array<BreadcrumbItemSchema>;
}

export interface BreadcrumbProps
  extends RendererProps,
    Omit<BreadcrumbSchema, 'type' | 'className'> {}

export class BreadcrumbField extends React.Component<BreadcrumbProps, object> {
  static defaultProps = {
    className: '',
    itemClassName: '',
    separator: '/'
  };

  render() {
    const {
      className,
      itemClassName,
      separatorClassName,
      classnames: cx,
      items,
      source,
      data,
      separator,
      render
    } = this.props;

    const crumbItems = items
      ? items
      : (resolveVariable(source, data) as Array<BreadcrumbItemSchema>);

    const crumbs = crumbItems
      .map<React.ReactNode>((item, index) => (
        <span className={cx('Breadcrumb-item', itemClassName)} key={index}>
          {item.icon
            ? generateIcon(cx, item.icon, 'Icon', 'Breadcrumb-icon')
            : null}
          {item.href ? (
            <a href={item.href}>{filter(item.label, data)}</a>
          ) : (
            render('label', filter(item.label, data))
          )}
        </span>
      ))
      .reduce((prev, curr, index) => [
        prev,
        <span
          className={cx('Breadcrumb-separator', separatorClassName)}
          key={`separator-${index}`}
        >
          {separator}
        </span>,
        curr
      ]);

    return <div className={cx('Breadcrumb', className)}>{crumbs}</div>;
  }
}

@Renderer({
  type: 'breadcrumb'
})
export class BreadcrumbFieldRenderer extends BreadcrumbField {}
