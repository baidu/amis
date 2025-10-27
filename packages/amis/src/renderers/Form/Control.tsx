import React from 'react';
import {
  RendererProps,
  Renderer,
  AMISFormItem,
  AMISSchemaCollection
} from 'amis-core';
import {autobind} from 'amis-core';
import {resolveVariable} from 'amis-core';
import {FormBaseControl, FormItemWrap} from 'amis-core';

/**
 * Control 表单项包裹
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/control
 */
export interface AMISFormControlSchema extends AMISFormItem {
  /**
   * 指定为 control 组件
   */
  type: 'control';

  /**
   * FormItem 内容
   */
  body: AMISSchemaCollection;
}

@Renderer({
  type: 'control'
})
export class ControlRenderer extends React.Component<RendererProps> {
  @autobind
  renderInput() {
    const {render, body, name, data} = this.props;
    return render('inner', body, {
      value: typeof name === 'string' ? resolveVariable(name, data) : undefined
    });
  }

  render() {
    const {render, label, control, ...rest} = this.props;
    return (
      <FormItemWrap
        {...(rest as any)}
        formMode={rest.mode ?? rest.formMode}
        render={render}
        sizeMutable={false}
        label={label}
        renderControl={this.renderInput}
      />
    );
  }
}
