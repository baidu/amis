import React from 'react';
import {AMISFormItem, uuidv4} from 'amis-core';
import {FormItem, FormControlProps, FormBaseControl} from 'amis-core';
import {FormBaseControlSchema} from '../../Schema';

/**
 * UUID 功能性组件
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/uuid
 */
export interface AMISUuidSchema extends AMISFormItem {
  type: 'uuid';
  /**
   * 长度
   */
  length?: number;
}

export default class UUIDControl extends React.Component<
  FormControlProps,
  any
> {
  constructor(props: FormControlProps) {
    super(props);
    if (!props.value) {
      this.setValue();
    }
  }

  componentDidUpdate(props: FormControlProps) {
    if (!props.value && props.formInited !== false) {
      this.setValue();
    }
  }

  setValue() {
    const props = this.props;
    let uuid = uuidv4();
    if (props.length) {
      uuid = uuid.substring(0, props.length);
    }
    props.onChange(uuid);
  }

  render() {
    return null;
  }
}

@FormItem({
  type: 'uuid',
  wrap: false,
  sizeMutable: false
})
export class UUIDControlRenderer extends UUIDControl {}
