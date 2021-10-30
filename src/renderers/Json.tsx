import React from 'react';
import {Renderer, RendererProps} from '../factory';

import JsonView, {InteractionProps} from 'react-json-view';
import {autobind, getPropValue, noop} from '../utils/helper';
import {BaseSchema} from '../Schema';
import {resolveVariableAndFilter, isPureVariable} from '../utils/tpl-builtin';
/**
 * JSON 数据展示控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/json
 */
export interface JsonSchema extends BaseSchema {
  /**
   * 指定为Json展示类型
   */
  type: 'json' | 'static-json';

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
}

export interface JSONProps extends RendererProps, JsonSchema {
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
    source: ''
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
      jsonTheme,
      classnames: cx,
      placeholder,
      source,
      levelExpand,
      mutable,
      name
    } = this.props;

    const value = getPropValue(this.props);

    let data = value;
    if (source !== undefined && isPureVariable(source)) {
      data = resolveVariableAndFilter(source, this.props.data, '| raw');
    } else if (typeof value === 'string') {
      try {
        data = JSON.parse(value);
      } catch (e) {
        data = {
          error: e.message
        };
      }
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
    if (data && ~['string', 'number'].indexOf(typeof data)) {
      data = {
        [typeof data]: data
      };
    }

    return (
      <div className={cx('JsonField', className)}>
        {typeof data === 'undefined' || data === null ? (
          placeholder
        ) : (
          <JsonView
            name={false}
            src={data}
            theme={(jsonThemeValue as any) ?? 'rjv-default'}
            shouldCollapse={this.shouldExpandNode}
            enableClipboard={false}
            iconStyle="square"
            onEdit={name && mutable ? this.emitChange : false}
            onDelete={name && mutable ? this.emitChange : false}
            onAdd={name && mutable ? this.emitChange : false}
          />
        )}
      </div>
    );
  }
}

@Renderer({
  type: 'json'
})
export class JSONFieldRenderer extends JSONField {}
