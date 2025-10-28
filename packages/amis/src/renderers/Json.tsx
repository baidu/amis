import React from 'react';
import {AMISSchemaBase, Renderer, RendererProps} from 'amis-core';

import type {InteractionProps} from 'react-json-view';
import {autobind, getPropValue, noop} from 'amis-core';
import {BaseSchema} from '../Schema';
import {
  resolveVariableAndFilter,
  isPureVariable,
  importLazyComponent
} from 'amis-core';

export const JsonView = React.lazy(() =>
  import('react-json-view').then(importLazyComponent)
);
/**
 * JSON 数据查看/编辑控件。用于展示或编辑 JSON 数据，支持复制、折叠、键排序等。
 */
export interface AMISJsonSchema extends AMISSchemaBase {
  /**
   * 指定为 json 组件
   */
  type: 'json' | 'static-json';

  /**
   * 要展示的 JSON 数据
   */
  value?: Record<string, any> | any[];

  /**
   * 默认展开的级别
   */
  levelExpand?: number;

  /**
   * 支持从数据链取值
   */
  source?: string;

  /**
   * 是否可修改
   */
  mutable?: boolean;

  /**
   * 是否显示数据类型
   */
  displayDataTypes?: boolean;

  /**
   * 是否可复制
   */
  enableClipboard?: boolean;

  /**
   * 图标风格
   */
  iconStyle?: 'square' | 'circle' | 'triangle';

  /**
   * 是否显示键的引号
   */
  quotesOnKeys?: boolean;

  /**
   * 是否为键排序
   */
  sortKeys?: boolean;

  /**
   * 设置字符串的最大展示长度
   */
  ellipsisThreshold?: number | false;
}

export interface JSONProps extends RendererProps, AMISJsonSchema {
  levelExpand: number;
  className?: string;
  placeholder?: string;
  jsonTheme: string;
  hideRoot?: boolean;
  source?: string;
}

export class JSONField extends React.Component<JSONProps, object> {
  static defaultProps: Partial<JSONProps> = {
    placeholder: '-',
    levelExpand: 1,
    source: '',
    displayDataTypes: false,
    enableClipboard: false,
    iconStyle: 'square',
    quotesOnKeys: true,
    sortKeys: false,
    ellipsisThreshold: false
  };

  @autobind
  emitChange(e: InteractionProps) {
    const {onChange, name} = this.props;

    if (!name || !onChange) {
      return false;
    }

    onChange(e.updated_src, name);
    return true;
  }

  @autobind
  shouldExpandNode({namespace}: {namespace: Array<string | null>}) {
    const {levelExpand} = this.props;

    if (typeof levelExpand !== 'number') {
      return false;
    }

    return namespace.length > levelExpand;
  }

  render() {
    const {
      className,
      style,
      jsonTheme,
      classnames: cx,
      placeholder,
      source,
      levelExpand,
      mutable,
      displayDataTypes,
      enableClipboard,
      iconStyle,
      quotesOnKeys,
      sortKeys,
      name,
      ellipsisThreshold
    } = this.props;

    const value = getPropValue(this.props);

    let data = value;
    if (source !== undefined && isPureVariable(source)) {
      data = resolveVariableAndFilter(source, this.props.data, '| raw');
    } else if (typeof value === 'string') {
      // 尝试解析 json
      try {
        data = JSON.parse(value);
      } catch (e) {}
    }

    let jsonThemeValue = jsonTheme;
    if (isPureVariable(jsonTheme)) {
      jsonThemeValue = resolveVariableAndFilter(
        jsonTheme,
        this.props.data,
        '| raw'
      );
    }

    // JsonView 只支持对象，所以不是对象格式需要转成对象格式。
    if (~['string', 'number', 'boolean'].indexOf(typeof data)) {
      data = {
        [typeof data]: data
      };
    }

    return (
      <div className={cx('JsonField', className)} style={style}>
        {typeof data === 'undefined' || data === null ? (
          placeholder
        ) : (
          <React.Suspense fallback={<div>...</div>}>
            <JsonView
              name={false}
              src={data}
              theme={(jsonThemeValue as any) ?? 'rjv-default'}
              shouldCollapse={this.shouldExpandNode}
              enableClipboard={enableClipboard}
              displayDataTypes={displayDataTypes}
              collapseStringsAfterLength={ellipsisThreshold}
              iconStyle={iconStyle}
              quotesOnKeys={quotesOnKeys}
              sortKeys={sortKeys}
              onEdit={name && mutable ? this.emitChange : false}
              onDelete={name && mutable ? this.emitChange : false}
              onAdd={name && mutable ? this.emitChange : false}
            />
          </React.Suspense>
        )}
      </div>
    );
  }
}

@Renderer({
  type: 'json'
})
export class JSONFieldRenderer extends JSONField {}
