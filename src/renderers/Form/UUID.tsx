import React from 'react';
import {uuidv4} from '../../utils/helper';
import {FormItem, FormControlProps, FormBaseControl} from './Item';

/**
 * UUID 功能性组件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/uuid
 */
export interface UUIDControlSchema extends FormBaseControl {
  type: 'uuid';
}

export default class UUIDControl extends React.Component<
  FormControlProps,
  any
> {
  constructor(props: FormControlProps) {
    super(props);
    props.onChange(uuidv4());
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
