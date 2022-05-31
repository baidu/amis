import React from 'react';
import {RendererProps, Renderer} from 'amis-core';
import {SchemaCollection} from '../../Schema';
import {autobind} from 'amis-core';
import {resolveVariable} from 'amis-core';
import {FormBaseControl, FormItemWrap} from 'amis-core';

/**
 * Group 表单集合渲染器，能让多个表单在一行显示
 * 文档：https://baidu.gitee.io/amis/docs/components/form/group
 */
export interface FormControlSchema extends FormBaseControl {
  type: 'control';

  /**
   * FormItem 内容
   */
  body: SchemaCollection;
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
