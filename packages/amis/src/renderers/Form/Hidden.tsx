import React from 'react';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  AMISFormItem
} from 'amis-core';
import {FormBaseControlSchema} from '../../Schema';

/**
 * Hidden 隐藏域。功能性组件
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/hidden
 */
/**
 * Hidden 隐藏域，用于在表单中存储不展示给用户的数据
 */
export interface AMISHiddenSchema extends AMISFormItem {
  type: 'hidden';
}

export default class HiddenControl extends React.Component<
  FormControlProps,
  any
> {
  render() {
    return null;
  }
}

@FormItem({
  type: 'hidden',
  wrap: false,
  sizeMutable: false
})
export class HiddenControlRenderer extends HiddenControl {}
