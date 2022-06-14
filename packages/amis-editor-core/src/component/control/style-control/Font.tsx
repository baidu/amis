/**
 * @file Font
 * @description 文字样式相关控件
 */

import React from 'react';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import mapValues from 'lodash/mapValues';
import {render as amisRender} from 'amis';
import {fontFamilyList} from './font-family';
import {string2CSSUnit, isObject} from '../../../util';

import {FormItem} from 'amis';

import type {FormControlProps} from 'amis-core';
import type {PlainObject} from './types';

export interface FontProps extends FormControlProps {
  value?: PlainObject;
  onChange: (value: PlainObject) => void;
}

const Font: React.FC<FontProps> = props => {
  const {value, onChange} = props;
  const validProps = [
    'color',
    'fontFamily',
    'fontSize',
    'fontWeight',
    'fontStyle',
    'textAlign',
    'letterSpacing',
    'lineHeight'
  ];
  const fontContext = isObject(value)
    ? {
        ...pick(value, validProps),
        /** textDecoration 特殊处理一下，因为可以同时选择多个value */
        underline: !!~(value?.textDecoration ?? '').indexOf('underline')
          ? 'underline'
          : undefined,
        lineThrough: !!~(value?.textDecoration ?? '').indexOf('line-through')
          ? 'line-through'
          : undefined
      }
    : {};

  const handleSubmit = (formValue: any, action: any) => {
    onChange?.({
      ...value,
      ...mapValues(
        {
          ...pick(formValue, validProps),
          textDecoration: [formValue.underline, formValue.lineThrough]
            .filter(Boolean)
            .join(' '),
          letterSpacing: string2CSSUnit(formValue.letterSpacing),
          lineHeight: string2CSSUnit(formValue.lineHeight)
        },
        props => props || undefined
      ),
      // 字体需要特殊处理，支持设置为空string
      fontFamily: formValue.fontFamily
    });
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
          preventEnterSubmit: true,
          submitOnChange: true,
          body: [
            {
              name: 'fontFamily',
              label: '字体类型',
              type: 'select',
              mode: 'row',
              size: 'md',
              placeholder: '请选择字体',
              menuTpl: '<div style="font-family: ${value};">${label}</div>',
              options: fontFamilyList,
              clearable: false,
              value: value?.fontFamily ?? ''
            },
            {
              name: 'color',
              label: '字体颜色',
              type: 'input-color',
              mode: 'row',
              size: 'md',
              value: value?.color ?? ''
            },
            {
              name: 'fontSize',
              label: '字体大小',
              type: 'input-range',
              max: 100,
              min: 12,
              step: 1,
              clearable: false,
              value: value?.fontSize ?? 12
            },
            {
              type: 'input-group',
              name: 'input-group',
              label: '文字样式',
              mode: 'row',
              body: [
                {
                  type: 'button-group-select',
                  name: 'fontWeight',
                  clearable: true,
                  label: false,
                  options: [
                    {
                      label: '',
                      value: 'bold',
                      icon: 'fa fa-bold',
                      className: 'ae-Font-group-lhs ae-Font-relative-left'
                    }
                  ]
                },
                {
                  type: 'button-group-select',
                  name: 'fontStyle',
                  clearable: true,
                  label: false,
                  options: [
                    {
                      label: '',
                      value: 'italic',
                      icon: 'fa fa-italic',
                      className: 'ae-Font-group-middle'
                    }
                  ]
                },
                {
                  type: 'button-group-select',
                  name: 'underline',
                  clearable: true,
                  label: false,
                  options: [
                    {
                      label: '',
                      value: 'underline',
                      icon: 'fa fa-underline',
                      className: 'ae-Font-group-middle ae-Font-relative-right'
                    }
                  ]
                },
                {
                  type: 'button-group-select',
                  name: 'lineThrough',
                  clearable: true,
                  label: false,
                  options: [
                    {
                      label: '',
                      value: 'line-through',
                      icon: 'fa fa-strikethrough',
                      className: 'ae-Font-group-rhs ae-Font-relative-right-2'
                    }
                  ]
                }
              ]
            },
            // TODO: 添加'justify-all', 'start', 'end', 'match-parent'类型
            {
              name: 'textAlign',
              label: '文字位置',
              type: 'button-group-select',
              mode: 'row',
              options: [
                {
                  label: '',
                  value: 'left',
                  icon: 'fa fa-align-left'
                },
                {
                  label: '',
                  value: 'center',
                  icon: 'fa fa-align-center'
                },
                {
                  label: '',
                  value: 'right',
                  icon: 'fa fa-align-right'
                },
                {
                  label: '',
                  value: 'justify',
                  icon: 'fa fa-align-justify'
                }
              ]
            },
            {
              type: 'group',
              label: '文字排版',
              body: [
                {
                  name: 'letterSpacing',
                  label: '',
                  type: 'input-text',
                  addOn: {
                    className: 'ae-Font-group-lhs',
                    label: '',
                    type: 'text',
                    position: 'left',
                    icon: 'fa fa-text-width'
                  }
                },
                {
                  name: 'lineHeight',
                  label: '',
                  type: 'input-text',
                  addOn: {
                    className: 'ae-Font-group-lhs',
                    label: '',
                    type: 'text',
                    position: 'left',
                    icon: 'fa fa-text-height'
                  }
                }
              ]
            }
          ]
        },
        {
          data: fontContext,
          onSubmit: handleSubmit
        }
      )}
    </>
  );
};

export default Font;

@FormItem({type: 'style-font', renderLabel: false})
export class FontRenderer extends React.Component<FormControlProps> {
  render() {
    return <Font {...this.props} />;
  }
}
