/**
 * @file 用来展示面包屑导航
 */
import React from 'react';
import {Renderer, RendererProps} from 'amis-core';
import {BaseSchema, SchemaIcon, SchemaUrlPath} from '../Schema';
import {filter, BaseSchemaWithoutType} from 'amis-core';
import {resolveVariableAndFilter} from 'amis-core';
import {Breadcrumb} from 'amis-ui';
import type {AMISClassName, AMISSchemaBase, TestIdBuilder} from 'amis-core';

export interface BreadcrumbBaseItemSchema extends AMISSchemaBase {
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
}

export interface AMISBreadcrumbItemSchema extends AMISSchemaBase {
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

  /**
   * 下拉菜单
   */
  dropdown?: Array<AMISBreadcrumbItemSchema>;
}

export type TooltipPositionType = 'top' | 'bottom' | 'left' | 'right';

export type ItemPlace = 'start' | 'middle' | 'end';

/**
 * Breadcrumb 显示渲染器
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/breadcrumb
 */

/**
 * 面包屑组件，用于展示当前位置路径。支持分隔符与图标。
 */
export interface AMISBreadcrumbSchema extends AMISSchemaBase {
  /**
   * 指定为 breadcrumb 组件
   */
  type: 'breadcrumb';

  /**
   * 面包项类名
   */
  itemClassName?: AMISClassName;

  /**
   * 分隔符
   */
  separator?: string;

  /**
   * 分隔符类名
   */
  separatorClassName?: AMISClassName;

  /**
   * 下拉菜单类名
   */
  dropdownClassName?: AMISClassName;

  /**
   * 下拉菜单项类名
   */
  dropdownItemClassName?: AMISClassName;

  /**
   * 列表
   */
  items: Array<AMISBreadcrumbItemSchema>;

  /**
   * labelMaxLength
   */
  labelMaxLength?: number;

  /**
   * 浮窗提示位置
   */
  tooltipPosition?: TooltipPositionType;

  testIdBuilder?: TestIdBuilder;
}

export interface BreadcrumbProps
  extends RendererProps,
    Omit<AMISBreadcrumbSchema, 'type' | 'className'> {}

export class BreadcrumbField extends React.Component<BreadcrumbProps, object> {
  render() {
    const {items, source, data, env, ...restProps} = this.props;

    let crumbItems = items
      ? items
      : (resolveVariableAndFilter(
          source,
          data,
          '| raw'
        ) as Array<AMISBreadcrumbItemSchema>);

    if (crumbItems) {
      crumbItems = crumbItems.map(item => {
        if (item.label) {
          item.label = filter(item.label, data);
        }
        if (item.href) {
          item.href = resolveVariableAndFilter(item.href, data, '| raw');
        }
        if (item.dropdown) {
          item.dropdown = item.dropdown.map(dropdownItem => {
            if (dropdownItem.label) {
              dropdownItem.label = filter(dropdownItem.label, data);
            }
            if (dropdownItem.href) {
              dropdownItem.href = resolveVariableAndFilter(
                dropdownItem.href,
                data,
                '| raw'
              );
            }
            return dropdownItem;
          });
        }
        return item;
      });
    }

    return (
      <Breadcrumb
        items={crumbItems}
        tooltipContainer={env?.getModalContainer}
        {...restProps}
      ></Breadcrumb>
    );
  }
}

@Renderer({
  type: 'breadcrumb'
})
export class BreadcrumbFieldRenderer extends BreadcrumbField {}
