/**
 * @file 阴影
 * @description 阴影配置
 * @grammar
 * x偏移量 | y偏移量 | 阴影颜色
 * x偏移量 | y偏移量 | 阴影模糊半径 | 阴影颜色
 * 插页(阴影向内) | x偏移量 | y偏移量 | 阴影模糊半径 | 阴影扩散半径 | 阴影颜色
 */

import React from 'react';
import mapValues from 'lodash/mapValues';

import {render as amisRender, FormItem} from 'amis';

import {parseBoxShadow, normalizeBoxShadow} from './transformation';

import type {FormControlProps} from 'amis-core';
import type {BoxShadowProps} from './types';

function BoxShadow({
  value = '',
  onChange
}: {
  value?: string;
  onChange: (value: any) => void;
}) {
  const boxShadowContext: Record<
    BoxShadowProps,
    any
  > = mapValues(
    parseBoxShadow(typeof value !== 'string' ? '' : value),
    (value, key, collection) =>
      key === 'color' || key === 'inset' ? value : {length: value, unit: 'px'}
  );

  // style-box-shadow组件name需要具体指定，比如style.boxShadow，否则取不到值
  const handleSubmit = (formValue: any, action: any) => {
    onChange?.(normalizeBoxShadow(formValue).boxShadow);
  };

  return (
    <>
      {amisRender(
        {
          type: 'form',
          wrapWithPanel: false,
          panelClassName: 'border-none shadow-none mb-0',
          bodyClassName: 'p-none',
          actionsClassName: 'border-none mt-2.5',
          wrapperComponent: 'div',
          formLazyChange: true,
          preventEnterSubmit: true,
          submitOnChange: true,
          body: [
            ...[
              {
                name: 'X轴偏移量',
                field: 'x'
              },
              {
                name: 'Y轴偏移量',
                field: 'y'
              },
              {
                name: '模糊半径',
                field: 'blur'
              },
              {
                name: '扩散半径',
                field: 'spread'
              }
            ].map(
              (item: {name: string; field: 'x' | 'y' | 'blur' | 'spread'}) => ({
                type: 'combo',
                name: item.field,
                label: item.name,
                formClassName: 'ae-BoxShadow-group',
                items: [
                  {
                    type: 'input-range',
                    label: false,
                    name: 'length',
                    max: 120,
                    min: 0,
                    step: 1
                  },
                  {
                    type: 'select',
                    label: false,
                    name: 'unit',
                    columnClassName: 'ae-BoxShadow-unit',
                    size: 'xs',
                    options: ['px']
                    // TODO: 暂时先支持px
                    // options: ['px', 'em', 'rem', 'vw', 'vh']
                  }
                ]
              })
            ),
            {
              type: 'switch',
              name: 'inset',
              label: '内阴影',
              mode: 'row',
              inputClassName: 'inline-flex justify-between flex-row-reverse'
            },
            {
              type: 'input-color',
              name: 'color',
              label: '阴影颜色',
              placeholder: '设置阴影颜色',
              mode: 'row'
            }
          ]
        },
        {
          data: boxShadowContext,
          onSubmit: handleSubmit
        }
      )}
    </>
  );
}

export default BoxShadow;

@FormItem({type: 'style-box-shadow'})
export class BoxShadowRenderer extends React.Component<FormControlProps> {
  render() {
    return <BoxShadow {...this.props} />;
  }
}
