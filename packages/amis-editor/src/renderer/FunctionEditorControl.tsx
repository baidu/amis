/**
 * @file 函数编辑器
 */

import React from 'react';
import {autobind} from 'amis-editor-core';
import {FormControlProps} from 'amis-core';
import {FormItem} from 'amis';
import {TooltipObject} from 'amis-ui/lib/components/TooltipWrapper';

interface FuncParam {
  label: string;
  tip?: string | TooltipObject;
}

export interface FunctionEditorControlProps extends FormControlProps {
  /**
   * 适配器函数参数
   */
  params?: FuncParam[];
  /**
   * 复用适配器 函数参数提示
   */
  mergeParams?: (params: FuncParam[]) => FuncParam[];
  /**
   * 代码编辑器底部的 description
   */
  desc?: any;
  /**
   * 代码编辑器的placeholder
   */
  placeholder?: string;
  /**
   * 自定义提示参数
   */
  tooltipProps?: TooltipObject;
}

export default class FunctionEditorControl extends React.Component<
  FunctionEditorControlProps,
  {}
> {
  static defaultProps: Pick<FunctionEditorControlProps, 'params'> = {
    params: []
  };

  @autobind
  onChange(value: any = '') {
    this.props.onChange?.(value);
  }

  // 生成tooltip 的参数
  genTooltipProps(content: any, othersProps?: TooltipObject) {
    const {render} = this.props;
    return {
      tooltipTheme: 'light',
      trigger: 'hover',
      rootClose: true,
      placement: 'top',
      tooltipClassName: 'ae-FunctionEditorControl-desc-tooltip',
      ...(typeof content === 'string'
        ? {content}
        : {
            content: ' ', // amis缺陷，必须有这个字段，否则显示不出来
            children: () =>
              React.isValidElement(content)
                ? content
                : render('content', content)
          }),
      ...(this.props.tooltipProps || {}),
      ...(othersProps || {})
    };
  }

  render() {
    const {
      render,
      params = [],
      allowFullscreen,
      value,
      placeholder,
      desc,
      mergeParams
    } = this.props;

    const lastParams =
      typeof mergeParams === 'function' ? mergeParams(params) : params;

    return (
      <>
        {render('api-function-editor-control-editor/0', {
          type: 'container',
          className: 'ae-FunctionEditorControl-func-header',
          body: [
            '<span class="mtk6">function&nbsp;</span>',
            '<span class="mtk1 bracket-highlighting-0">(</span>',
            ...lastParams
              .map(({label, tip}, index) => {
                return [
                  {
                    type: 'button',
                    level: 'link',
                    label,
                    className: 'ae-FunctionEditorControl-func-arg',
                    ...(tip ? {tooltip: this.genTooltipProps(tip)} : {})
                  },
                  ...(index === lastParams.length - 1
                    ? []
                    : ['<span class="mtk1">,&nbsp;</span>'])
                ];
              })
              .flat(),
            '<span class="mtk1 bracket-highlighting-0">)&nbsp;{</span>'
          ]
        })}

        {render(
          'api-function-editor-control-editor/1',
          {
            label: '',
            name: '__whatever_name_adpator',
            placeholder: placeholder || '',
            mode: 'normal',
            type: 'js-editor',
            className: 'ae-FunctionEditorControl-func-editor',
            allowFullscreen
          },
          {
            value,
            onChange: this.onChange
          }
        )}

        {render('api-function-editor-control-editor/2', {
          type: 'container',
          body: '<span class="mtk1 bracket-highlighting-0">}</span>',
          className: 'ae-FunctionEditorControl-func-footer'
        })}
        {render('api-function-editor-control-editor/3', {
          type: 'container',
          className: 'cxd-Form-description',
          body: desc
        })}
      </>
    );
  }
}

@FormItem({
  type: 'ae-functionEditorControl',
  renderLabel: false
})
export class FunctionEditorControlRenderer extends FunctionEditorControl {}
