import React from 'react';
import {
  AMISSchemaBase,
  CustomStyle,
  Renderer,
  RendererProps,
  buildStyle,
  isPureVariable,
  setThemeClassName,
  AMISSchemaCollection
} from 'amis-core';
import {Schema} from 'amis-core';
import {resolveVariable, resolveVariableAndFilter} from 'amis-core';
import {createObject, getPropValue, isObject} from 'amis-core';
import {BaseSchema} from '../Schema';

export interface EachExtraProps extends RendererProps {
  items: any;
  item: any;
  index: number;
  itemKeyName: string;
  indexKeyName: string;
  name: string;
}

function EachItem(props: EachExtraProps) {
  const {render, data, items, item, name, index, itemKeyName, indexKeyName} =
    props;
  const ctx = React.useMemo(
    () =>
      createObject(data, {
        ...(isObject(item) ? {index, ...item} : {[name]: item}),
        [itemKeyName || 'item']: item,
        [indexKeyName || 'index']: index
      }),
    [item, data, name, index, itemKeyName, indexKeyName]
  );

  return render(`item/${index}`, items, {
    data: ctx
  });
}

/**
 * Each 循环功能渲染器。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/each
 */
/**
 * 循环渲染组件，用于遍历数组并渲染子内容。
 */
export interface AMISEachSchema extends AMISSchemaBase {
  /**
   * 指定为 each 组件
   */
  type: 'each';

  /**
   * 关联字段名
   */
  name?: string;

  /**
   * 关联字段名 支持数据映射
   */
  source?: string;

  /**
   * 用来控制通过什么字段读取成员数据
   */
  itemKeyName?: string;

  /**
   * 用来控制通过什么字段读取序号
   */
  indexKeyName?: string;

  items?: AMISSchemaCollection;

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
    placeholder: 'placeholder.noData'
  };

  render() {
    const {
      data,
      name,
      className,
      style,
      render,
      items,
      itemKeyName,
      indexKeyName,
      placeholder,
      classnames: cx,
      translate: __,
      env,
      id,
      wrapperCustomStyle,
      themeCss
    } = this.props;

    const value = getPropValue(this.props, props =>
      props.source
        ? resolveVariableAndFilter(props.source, props.data, '| raw')
        : undefined
    );

    let arr = isObject(value)
      ? Object.keys(value).map(key => ({
          key: key,
          value: value[key]
        }))
      : Array.isArray(value)
      ? value
      : [];

    // 最大循环次数支持
    const maxLength = isPureVariable(this.props.maxLength)
      ? resolveVariableAndFilter(this.props.maxLength, this.props.data) || 0
      : this.props.maxLength;

    if (Array.isArray(arr) && maxLength >= 1 && arr.length > maxLength) {
      arr = arr.slice(0, maxLength);
    }

    return (
      <div
        className={cx(
          'Each',
          className,
          setThemeClassName({
            ...this.props,
            name: 'baseControlClassName',
            id,
            themeCss
          })
        )}
        style={buildStyle(style, data)}
      >
        {Array.isArray(arr) && arr.length && items ? (
          arr.map((item: any, index: number) => (
            <EachItem
              {...this.props}
              items={items}
              key={index}
              index={index}
              data={data}
              item={item}
              name={name}
              itemKeyName={itemKeyName}
              indexKeyName={indexKeyName}
            />
          ))
        ) : (
          <div className={cx('Each-placeholder')}>
            {render('placeholder', __(placeholder))}
          </div>
        )}

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

@Renderer({
  type: 'each'
})
export class EachRenderer extends Each {}
