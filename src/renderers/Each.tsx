import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {Schema} from '../types';
import {resolveVariable} from '../utils/tpl-builtin';
import {createObject, isObject} from '../utils/helper';

export interface EachProps extends RendererProps {
  name: string;
  items: Schema;
}

export default class Each extends React.Component<EachProps> {
  static propsList: Array<string> = ['name', 'items', 'value'];
  static defaultProps: Partial<EachProps> = {
    className: ''
  };

  render() {
    const {data, name, className, render, value, items} = this.props;

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
      <div className={className}>
        {Array.isArray(arr) && items
          ? arr.map((item: any, index: number) =>
              render(`item/${index}`, items, {
                data: createObject(
                  data,
                  isObject(item) ? item : {[name]: item, item: item}
                ),
                key: index
              })
            )
          : null}
      </div>
    );
  }
}

@Renderer({
  test: /(^|\/)(?:repeat|each)$/,
  name: 'each'
})
export class EachRenderer extends Each {}
