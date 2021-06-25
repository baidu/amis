import {Renderer, RendererProps} from '../factory';
import React from 'react';
import Alert, {AlertProps} from '../components/Alert2';
import {BaseSchema, SchemaCollection} from '../Schema';

/**
 * Alert 提示渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/alert
 */
export interface AlertSchema extends BaseSchema {
  /**
   * 指定为提示框类型
   */
  type: 'alert';

  /**
   * 内容区域
   */
  body: SchemaCollection;

  /**
   * 提示类型
   */
  level?: 'info' | 'warning' | 'success' | 'error' | 'danger';

  /**
   * 是否显示关闭按钮
   */
  showCloseButton?: boolean;
}

@Renderer({
  type: 'alert'
})
export class TplRenderer extends React.Component<AlertProps & RendererProps> {
  render() {
    const {render, body, ...rest} = this.props;
    return <Alert {...rest}>{render('body', body)}</Alert>;
  }
}
