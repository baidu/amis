import React from 'react';

import {RendererProps, Renderer} from '../../factory';
import {autobind} from '../../utils/helper';
import {
  asFormItem,
  FormBaseControl,
  FormItemWrap,
  renderToComponent
} from './Item';
import {wrapControl} from './wrapControl';
/**
 * Group 表单集合渲染器，能让多个表单在一行显示
 * 文档：https://baidu.gitee.io/amis/docs/components/form/group
 */
export interface GroupControlSchema extends FormBaseControl {
  type: 'control';

  /**
   * FormItem 集合
   */
  control: FormBaseControl;
}

@Renderer({
  type: 'control',
  name: 'control'
})
export class ControlRenderer extends React.Component<RendererProps> {
  @autobind
  renderInput() {
    const {render, control} = this.props;
    return render('inner', control);
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
