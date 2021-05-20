import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {Schema} from '../types';
import {resolveVariable} from '../utils/tpl-builtin';
import {createObject, isObject} from '../utils/helper';
import {BaseSchema, SchemaCollection} from '../Schema';

/**
 * Each 循环功能渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/each
 */
export interface EachSchema extends BaseSchema {
  /**
   * 指定为each展示类型
   */
  type: 'each';

  /**
   * 关联字段名
   */
  name?: string;

  items?: SchemaCollection;

  placeholder?: string;
}

export interface EachProps extends RendererProps {
  name: string;
  items: Schema;
}

export default class Each extends React.Component<EachProps> {
  static propsList: Array<string> = ['name', 'items', 'value'];
  static defaultProps = {
    className: '',
    placeholder: '暂无内容'
  };

  render() {
    const {
      data,
      name,
      className,
      render,
      value,
      items,
      placeholder,
      classnames: cx,
      translate: __
    } = this.props;

    const arr =
      typeof value !== 'undefined'
        ? isObject(value)
          ? Object.keys(value).map(key => ({
              key: key,
              value: value[key]
            }))
          : Array.isArray(value)
          ? value
          : []
        : resolveVariable(name, data);

    return (
      <div className={cx('Each', className)}>
        {Array.isArray(arr) && arr.length && items ? (
          arr.map((item: any, index: number) =>
            render(`item/${index}`, items, {
              data: createObject(
                data,
                isObject(item)
                  ? {index, ...item}
                  : {[name]: item, item: item, index}
              ),
              key: index
            })
          )
        ) : (
          <div className={cx('Each-placeholder')}>
            {render('placeholder', __(placeholder))}
          </div>
        )}
      </div>
    );
  }
}

@Renderer({
  test: /(^|\/)(?:repeat|each)$/,
  name: 'each'
})
export class EachRenderer extends Each {}
