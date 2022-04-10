import React from 'react';
import {uuidv4} from '../../utils/helper';
import {FormItem, FormControlProps, FormBaseControl} from './Item';

/**
 * UUID 功能性组件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/uuid
 */
export interface UUIDControlSchema extends FormBaseControl {
  type: 'uuid';
  /**
   * 长度，默认 uuid 的长度是 36，如果不需要那么长，可以设置这个来缩短
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
    if (!props.value) {
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
